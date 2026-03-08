import React, { useState, useEffect, useRef } from 'react';
import { X, Mic, MicOff, Send, Loader, Award, MessageSquare, TrendingUp, Volume2 } from 'lucide-react';
import { geminiServiceInstance } from '../../services/geminiService';
import { Opportunity } from '../../types/opportunity';

interface InterviewSimulatorProps {
  opportunity?: Opportunity;
  onClose: () => void;
  themeId: string;
}

interface Question {
  id: number;
  text: string;
  category: string;
}

interface Answer {
  questionId: number;
  transcript: string;
  feedback: string;
  score: number;
}

type InterviewState = 'voice-setup' | 'setup' | 'ai-asking' | 'listening' | 'processing' | 'ai-feedback' | 'complete';

const AVAILABLE_VOICES = {
  'fr-FR-DeniseNeural': 'Denise - Français (France) 👩',
  'fr-FR-HenriNeural': 'Henri - Français (France) 👨',
  'en-US-JennyNeural': 'Jenny - Anglais (États-Unis) 👩',
  'en-US-GuyNeural': 'Guy - Anglais (États-Unis) 👨'
};

const TTS_API = 'https://librettts-api.shadobsh.workers.dev';

export const InterviewSimulator: React.FC<InterviewSimulatorProps> = ({ 
  opportunity, 
  onClose 
}) => {
  const [state, setState] = useState<InterviewState>('voice-setup');
  const [selectedVoice, setSelectedVoice] = useState<string>('fr-FR-DeniseNeural');
  const [speechSpeed, setSpeechSpeed] = useState<number>(1.0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [transcript, setTranscript] = useState('');
  const [overallFeedback, setOverallFeedback] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser la reconnaissance vocale
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'fr-FR';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPart + ' ';
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(prev => prev + finalTranscript);
    };

    recognition.onerror = (event: any) => {
      console.error('Erreur reconnaissance vocale:', event.error);
    };

    recognition.onend = () => {
      if (state === 'listening') {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [state]);

  // Générer les questions au démarrage
  useEffect(() => {
    if (state === 'voice-setup') {
      generateQuestions();
    }
  }, []);

  const callGemini = async (prompt: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      geminiServiceInstance.sendMessageNonStream(
        'dummy-key',
        'gemini-2.0-flash-exp',
        [],
        [{ text: prompt }],
        {},
        new AbortController().signal,
        (error) => reject(error),
        (parts) => {
          const textPart = parts.find(p => 'text' in p);
          resolve(textPart?.text || '');
        }
      );
    });
  };

  const generateQuestions = async () => {
    try {
      const prompt = `Tu es un recruteur expert. Génère 5 questions d'entretien pour cette opportunité :

${opportunity ? `
Type: ${opportunity.type}
Titre: ${opportunity.title}
Organisation: ${opportunity.organization}
Description: ${opportunity.description}
` : 'Entretien générique'}

INSTRUCTIONS:
1. Génère exactement 5 questions pertinentes
2. Mélange questions techniques et comportementales
3. Format JSON strict:
[
  {"id": 1, "text": "Question 1", "category": "Technique"},
  {"id": 2, "text": "Question 2", "category": "Comportementale"}
]`;

      const response = await callGemini(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      
      if (jsonMatch) {
        const generatedQuestions = JSON.parse(jsonMatch[0]);
        setQuestions(generatedQuestions);
      } else {
        throw new Error('Format invalide');
      }
    } catch (error) {
      console.error('Erreur génération questions:', error);
      setQuestions([
        { id: 1, text: "Parlez-moi de vous et de votre parcours", category: "Présentation" },
        { id: 2, text: "Pourquoi êtes-vous intéressé par cette opportunité ?", category: "Motivation" },
        { id: 3, text: "Quelles sont vos principales compétences ?", category: "Compétences" },
        { id: 4, text: "Décrivez un défi que vous avez surmonté", category: "Comportementale" },
        { id: 5, text: "Où vous voyez-vous dans 3 ans ?", category: "Projection" }
      ]);
    }
  };

  const speak = async (text: string): Promise<void> => {
    try {
      const response = await fetch(TTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voice: selectedVoice,
          rate: Math.round((speechSpeed - 1) * 100),
          pitch: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API TTS: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      return new Promise((resolve, reject) => {
        const audio = new Audio(audioUrl);
        audio.volume = 1.0;
        audioRef.current = audio;

        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          resolve();
        };

        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
          reject(new Error('Erreur lecture audio'));
        };

        audio.play().catch(reject);
      });
    } catch (error) {
      console.error('Erreur TTS:', error);
      // Fallback vers la synthèse vocale du navigateur
      return new Promise((resolve) => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = 'fr-FR';
          utterance.rate = speechSpeed;
          utterance.onend = () => resolve();
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        } else {
          resolve();
        }
      });
    }
  };

  const startInterview = async () => {
    if (questions.length === 0) return;
    
    setState('ai-asking');
    const currentQuestion = questions[currentQuestionIndex];
    await speak(currentQuestion.text);
    
    setState('listening');
    setTranscript('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const submitAnswer = async () => {
    if (!transcript.trim()) return;

    stopListening();
    setState('processing');

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const prompt = `Analyse cette réponse d'entretien et donne un feedback constructif.

Question: ${currentQuestion.text}
Catégorie: ${currentQuestion.category}
Réponse du candidat: ${transcript}

Fournis:
1. Un score sur 10
2. Un feedback constructif (2-3 phrases)

Format JSON strict:
{"score": 8, "feedback": "Votre feedback ici"}`;

      const response = await callGemini(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      let score = 7;
      let feedback = "Bonne réponse, continuez ainsi !";
      
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        score = analysis.score || 7;
        feedback = analysis.feedback || feedback;
      }

      const newAnswer: Answer = {
        questionId: currentQuestion.id,
        transcript: transcript,
        feedback,
        score
      };

      setAnswers(prev => [...prev, newAnswer]);

      // Lire le feedback vocalement
      setState('ai-feedback');
      await speak(`Vous avez obtenu ${score} sur 10. ${feedback}`);

      // Passer à la question suivante ou terminer
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeout(() => startNextQuestion(), 1000);
      } else {
        await generateFinalReport([...answers, newAnswer]);
      }
    } catch (error) {
      console.error('Erreur analyse:', error);
      setState('listening');
    }
  };

  const startNextQuestion = async () => {
    setState('ai-asking');
    const currentQuestion = questions[currentQuestionIndex];
    await speak(currentQuestion.text);
    
    setState('listening');
    setTranscript('');
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  const generateFinalReport = async (allAnswers: Answer[]) => {
    try {
      const avgScore = allAnswers.reduce((sum, a) => sum + a.score, 0) / allAnswers.length;
      const prompt = `Génère un feedback global pour cet entretien.

Score moyen: ${avgScore.toFixed(1)}/10
Nombre de questions: ${allAnswers.length}

Fournis un feedback global encourageant et constructif (3-4 phrases).`;

      const response = await callGemini(prompt);
      setOverallFeedback(response);
      
      await speak(response);
    } catch (error) {
      setOverallFeedback("Félicitations pour avoir complété cet entretien !");
    } finally {
      setState('complete');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const avgScore = answers.length > 0 
    ? answers.reduce((sum, a) => sum + a.score, 0) / answers.length 
    : 0;

  const getStateMessage = () => {
    switch (state) {
      case 'voice-setup':
        return 'Choisissez la voix de l\'IA';
      case 'setup':
        return 'Prêt à commencer l\'entretien';
      case 'ai-asking':
        return 'L\'IA pose la question...';
      case 'listening':
        return 'Parlez maintenant, je vous écoute';
      case 'processing':
        return 'Analyse de votre réponse...';
      case 'ai-feedback':
        return 'L\'IA donne son feedback...';
      case 'complete':
        return 'Entretien terminé';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 pt-20">
      <div className="bg-[var(--theme-bg-primary)] rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 border-b border-[var(--theme-border-primary)] flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[var(--theme-text-primary)]">
              {state === 'complete' ? '📊 Rapport d\'Entretien' : '🎯 Simulation d\'Entretien Vocal'}
            </h2>
            <p className="text-xs text-[var(--theme-text-secondary)] mt-1">
              {opportunity ? opportunity.title : 'Entretien Générique'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[var(--theme-text-secondary)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {state === 'voice-setup' ? (
            <div className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <Volume2 className="w-16 h-16 text-[var(--theme-bg-accent)] mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[var(--theme-text-primary)] mb-2">
                  Configuration de la Voix
                </h3>
                <p className="text-[var(--theme-text-secondary)]">
                  Choisissez la voix de l'IA pour votre entretien
                </p>
              </div>

              <div className="bg-[var(--theme-bg-secondary)] rounded-2xl p-6 border border-[var(--theme-border-primary)]">
                <label className="block text-sm font-bold text-[var(--theme-text-primary)] mb-3">
                  Voix de l'IA :
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl p-3 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]"
                >
                  {Object.entries(AVAILABLE_VOICES).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="bg-[var(--theme-bg-secondary)] rounded-2xl p-6 border border-[var(--theme-border-primary)]">
                <label className="block text-sm font-bold text-[var(--theme-text-primary)] mb-3">
                  Vitesse de parole : <span className="text-[var(--theme-bg-accent)]">{speechSpeed.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={speechSpeed}
                  onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[var(--theme-text-tertiary)] mt-2">
                  <span>Lent</span>
                  <span>Normal</span>
                  <span>Rapide</span>
                </div>
              </div>

              <button
                onClick={() => setState('setup')}
                disabled={questions.length === 0}
                className="w-full py-4 bg-[var(--theme-bg-accent)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {questions.length === 0 ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Préparation des questions...
                  </>
                ) : (
                  <>
                    Continuer
                  </>
                )}
              </button>
            </div>
          ) : state === 'complete' ? (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[var(--theme-bg-accent)]/10 to-[var(--theme-bg-accent)]/5 rounded-2xl p-8 text-center border border-[var(--theme-bg-accent)]/20">
                <Award className="w-16 h-16 text-[var(--theme-bg-accent)] mx-auto mb-4" />
                <h3 className="text-3xl font-bold text-[var(--theme-text-primary)] mb-2">
                  {avgScore.toFixed(1)}/10
                </h3>
                <p className="text-[var(--theme-text-secondary)]">Score Global</p>
                <div className="mt-4 bg-[var(--theme-bg-tertiary)] rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--theme-bg-accent)] to-green-500 transition-all duration-1000"
                    style={{ width: `${(avgScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-[var(--theme-bg-secondary)] rounded-2xl p-6 border border-[var(--theme-border-primary)]">
                <h4 className="text-lg font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Feedback Global
                </h4>
                <p className="text-[var(--theme-text-secondary)] leading-relaxed">
                  {overallFeedback}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-bold text-[var(--theme-text-primary)]">
                  Détail par Question
                </h4>
                {answers.map((answer, index) => (
                  <div
                    key={answer.questionId}
                    className="bg-[var(--theme-bg-secondary)] rounded-xl p-4 border border-[var(--theme-border-primary)]"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-bold text-[var(--theme-text-primary)]">
                        Q{index + 1}: {questions[index]?.text}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        answer.score >= 8 ? 'bg-green-500/10 text-green-500' :
                        answer.score >= 6 ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {answer.score}/10
                      </span>
                    </div>
                    <p className="text-xs text-[var(--theme-text-tertiary)] mb-2">
                      {answer.feedback}
                    </p>
                  </div>
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-[var(--theme-bg-accent)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                Terminer
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Progression */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--theme-text-secondary)]">
                  Question {currentQuestionIndex + 1} / {questions.length}
                </span>
                <div className="flex gap-1">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-8 h-1 rounded-full ${
                        index < currentQuestionIndex ? 'bg-green-500' :
                        index === currentQuestionIndex ? 'bg-[var(--theme-bg-accent)]' :
                        'bg-[var(--theme-bg-tertiary)]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Question actuelle */}
              {currentQuestion && state !== 'setup' && (
                <div className="bg-[var(--theme-bg-secondary)] rounded-2xl p-8 border border-[var(--theme-border-primary)]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--theme-bg-accent)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-[var(--theme-bg-accent)]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[var(--theme-bg-accent)] uppercase tracking-wider">
                        {currentQuestion.category}
                      </span>
                      <h3 className="text-xl font-bold text-[var(--theme-text-primary)] mt-2">
                        {currentQuestion.text}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Indicateur d'état */}
              <div className="bg-[var(--theme-bg-secondary)] rounded-2xl p-8 border border-[var(--theme-border-primary)] text-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 transition-all ${
                  state === 'listening' ? 'bg-red-500 animate-pulse' :
                  state === 'processing' || state === 'ai-asking' || state === 'ai-feedback' ? 'bg-[var(--theme-bg-accent)] animate-pulse' :
                  'bg-[var(--theme-bg-tertiary)]'
                }`}>
                  {state === 'listening' ? (
                    <Mic className="w-10 h-10 text-white" />
                  ) : state === 'processing' || state === 'ai-asking' || state === 'ai-feedback' ? (
                    state === 'ai-asking' || state === 'ai-feedback' ? (
                      <Volume2 className="w-10 h-10 text-white" />
                    ) : (
                      <Loader className="w-10 h-10 text-white animate-spin" />
                    )
                  ) : (
                    <MicOff className="w-10 h-10 text-white" />
                  )}
                </div>
                <p className="text-[var(--theme-text-primary)] font-bold mb-2">
                  {getStateMessage()}
                </p>
                {state === 'listening' && transcript && (
                  <p className="text-sm text-[var(--theme-text-secondary)] mt-4 p-4 bg-[var(--theme-bg-primary)] rounded-lg">
                    "{transcript}"
                  </p>
                )}
              </div>

              {/* Boutons de contrôle */}
              <div className="flex gap-3">
                {state === 'setup' && questions.length > 0 && (
                  <button
                    onClick={startInterview}
                    className="flex-1 py-4 bg-[var(--theme-bg-accent)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Mic className="w-5 h-5" />
                    Commencer l'Entretien
                  </button>
                )}
                
                {state === 'listening' && (
                  <button
                    onClick={submitAnswer}
                    disabled={!transcript.trim()}
                    className="flex-1 py-4 bg-[var(--theme-bg-accent)] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Envoyer ma Réponse
                  </button>
                )}
              </div>

              {/* Feedback de la question précédente */}
              {answers.length > 0 && answers[currentQuestionIndex - 1] && state !== 'setup' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-green-500 mb-1">
                        Question Précédente: {answers[currentQuestionIndex - 1].score}/10
                      </p>
                      <p className="text-sm text-[var(--theme-text-secondary)]">
                        {answers[currentQuestionIndex - 1].feedback}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
