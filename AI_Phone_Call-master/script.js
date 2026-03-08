// ===== CONFIGURATION ET VARIABLES GLOBALES =====
const API_CONFIG = {
    TTS_API: 'https://librettts-api.shadobsh.workers.dev',
    AI_API: 'https://shads229-personnal-aiv2.hf.space/v1/chat/completions',
    AI_TOKEN: 'Shadobsh'
};

// État global de la conversation vocale
let conversationState = {
    isListening: false,        // En cours d'écoute
    isPaused: false,           // En pause
    isProcessing: false,       // Traitement IA en cours
    isSpeaking: false,         // IA en train de parler
    isConversationActive: false, // Conversation active
    recognition: null,         // Objet reconnaissance vocale
    currentAudio: null,        // Audio en cours de lecture
    accumulatedTranscript: '', // Transcription accumulée
    selectedVoice: null,       // Voix sélectionnée
    speechSpeed: 1.0,          // Vitesse de parole
    volume: 1.0                // Volume audio
};

// Configuration des voix disponibles
let availableVoices = {};

// ===== INITIALISATION =====
$(document).ready(function() {
    initializeApp();
});

async function initializeApp() {
    try {
        // Charger les voix disponibles
        await loadVoices();

        // Vérifier que les voix sont bien chargées
        if (Object.keys(availableVoices).length === 0) {
            throw new Error('Aucune voix disponible');
        }

        // Initialiser la reconnaissance vocale
        initializeSpeechRecognition();

        // Configurer les événements
        setupEventListeners();

        // Initialiser les contrôles audio
        initializeAudioControls();

        // Activer le bouton de conversation
        $('#startConversationBtn').prop('disabled', false);

    } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        showToast('Erreur lors de l\'initialisation. Veuillez actualiser la page.', 'error');
    }
}

// ===== GESTION DES VOIX =====
async function loadVoices() {
    try {
        console.log('Chargement des voix...');
        const response = await fetch('speakers.json');

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data && data['edge-api'] && data['edge-api'].speakers) {
            availableVoices = data['edge-api'].speakers;
            updateVoiceSelect();
        } else {
            throw new Error('Format de données de voix invalide');
        }
    } catch (error) {
        console.error('Erreur lors du chargement des voix:', error);

        // Voix de secours : français France et anglais États-Unis seulement
        availableVoices = {
            'fr-FR-DeniseNeural': 'Denise - Français (France)',
            'fr-FR-HenriNeural': 'Henri - Français (France)',
            'en-US-JennyNeural': 'Jenny - Anglais (États-Unis)',
            'en-US-GuyNeural': 'Guy - Anglais (États-Unis)'
        };
        updateVoiceSelect();
    }
}

function updateVoiceSelect() {
    const voiceSelect = $('#voiceSelect');
    voiceSelect.empty();

    // Filtrer et organiser les voix : français France d'abord, puis anglais US seulement
    const organizedVoices = {};

    // 1. Ajouter les voix françaises de France en premier
    Object.keys(availableVoices).forEach(key => {
        if (key.startsWith('fr-FR-')) {
            organizedVoices[key] = availableVoices[key];
        }
    });

    // 2. Ajouter seulement les voix anglaises des États-Unis
    Object.keys(availableVoices).forEach(key => {
        if (key.startsWith('en-US-')) {
            organizedVoices[key] = availableVoices[key];
        }
    });

    // Ajouter les voix organisées au sélecteur
    Object.keys(organizedVoices).forEach(key => {
        voiceSelect.append(new Option(organizedVoices[key], key));
    });

    // Sélectionner la première voix française par défaut
    const frenchVoice = Object.keys(organizedVoices).find(key => key.includes('fr-FR'));
    if (frenchVoice) {
        voiceSelect.val(frenchVoice);
        conversationState.selectedVoice = frenchVoice;
    } else if (Object.keys(organizedVoices).length > 0) {
        const firstVoice = Object.keys(organizedVoices)[0];
        voiceSelect.val(firstVoice);
        conversationState.selectedVoice = firstVoice;
    }

    console.log('Voix chargées:', Object.keys(organizedVoices).length);
}

// ===== RECONNAISSANCE VOCALE =====
function initializeSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showToast('La reconnaissance vocale n\'est pas supportée par votre navigateur.', 'error');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    conversationState.recognition = new SpeechRecognition();

    // Configuration de la reconnaissance
    conversationState.recognition.continuous = true;
    conversationState.recognition.interimResults = true;
    conversationState.recognition.lang = 'fr-FR';

    // Événements de reconnaissance
    conversationState.recognition.onstart = function() {
        console.log('Reconnaissance vocale démarrée');
        conversationState.isListening = true;
        updateUIState();
    };

    conversationState.recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Accumuler la transcription finale
        if (finalTranscript.trim()) {
            conversationState.accumulatedTranscript += finalTranscript + ' ';
            console.log('Transcription accumulée:', conversationState.accumulatedTranscript);
        }
    };

    conversationState.recognition.onerror = function(event) {
        console.error('Erreur de reconnaissance vocale:', event.error);
        if (event.error === 'no-speech') {
            // Ne pas afficher d'erreur pour no-speech, c'est normal
        } else {
            showToast('Erreur de reconnaissance vocale: ' + event.error, 'error');
        }
    };

    conversationState.recognition.onend = function() {
        console.log('Reconnaissance vocale terminée');
        if (conversationState.isListening && !conversationState.isPaused) {
            // Redémarrer automatiquement si on est toujours en écoute
            setTimeout(() => {
                if (conversationState.isListening && !conversationState.isPaused) {
                    conversationState.recognition.start();
                }
            }, 100);
        }
    };
}

// ===== GESTION DES ÉVÉNEMENTS =====
function setupEventListeners() {
    // Bouton pour démarrer la conversation
    $('#startConversationBtn').on('click', startConversation);

    // Bouton pour terminer la conversation
    $('#endConversationBtn').on('click', endConversation);

    // Bouton microphone
    $('#micBtn').on('click', toggleListening);

    // Bouton pause
    $('#pauseBtn').on('click', pauseListening);

    // Bouton continuer
    $('#continueBtn').on('click', continueListening);

    // Bouton envoyer
    $('#sendBtn').on('click', sendToAI);

    // Contrôles audio
    $('#voiceSelect').on('change', function() {
        conversationState.selectedVoice = $(this).val();
        console.log('Voix sélectionnée:', conversationState.selectedVoice);
    });

    $('#speedControl').on('input', function() {
        conversationState.speechSpeed = parseFloat($(this).val());
        $('#speedValue').text(conversationState.speechSpeed + 'x');
    });

    $('#volumeControl').on('input', function() {
        conversationState.volume = parseInt($(this).val()) / 100;
        $('#volumeValue').text($(this).val() + '%');
    });
}

// ===== GESTION DE LA CONVERSATION =====
function startConversation() {
    // Vérifier que les paramètres sont configurés
    if (!conversationState.selectedVoice) {
        showToast('Veuillez sélectionner une voix avant de commencer.', 'warning');
        return;
    }

    conversationState.isConversationActive = true;

    // Masquer la section de configuration et afficher la section de conversation
    $('#setupSection').hide();
    $('#conversationSection').show();
    $('.voice-container').addClass('conversation-active');

    // Activer le bouton microphone
    $('#micBtn').prop('disabled', false);

    updateUIState();
}

function endConversation() {
    // Arrêter tous les processus en cours
    stopAllProcesses();

    // Réinitialiser l'état
    conversationState.isConversationActive = false;
    conversationState.isListening = false;
    conversationState.isPaused = false;
    conversationState.isProcessing = false;
    conversationState.isSpeaking = false;
    conversationState.accumulatedTranscript = '';

    // Masquer la section de conversation et afficher la section de configuration
    $('#conversationSection').hide();
    $('#setupSection').show();
    $('.voice-container').removeClass('conversation-active processing');

    updateUIState();
}

function toggleListening() {
    if (conversationState.isListening) {
        stopListening();
    } else {
        startListening();
    }
}

function startListening() {
    if (!conversationState.recognition || conversationState.isProcessing || conversationState.isSpeaking) {
        return;
    }

    try {
        conversationState.isListening = true;
        conversationState.isPaused = false;
        conversationState.accumulatedTranscript = ''; // Réinitialiser la transcription
        conversationState.recognition.start();
        updateUIState();
    } catch (error) {
        console.error('Erreur lors du démarrage de l\'écoute:', error);
        showToast('Impossible de démarrer l\'écoute.', 'error');
    }
}

function stopListening() {
    conversationState.isListening = false;
    if (conversationState.recognition) {
        conversationState.recognition.stop();
    }
    updateUIState();
}

function pauseListening() {
    conversationState.isPaused = true;
    conversationState.isListening = false;
    if (conversationState.recognition) {
        conversationState.recognition.stop();
    }
    updateUIState();
}

function continueListening() {
    conversationState.isPaused = false;
    startListening();
}

function stopAllProcesses() {
    // Arrêter la reconnaissance vocale
    if (conversationState.recognition) {
        conversationState.recognition.stop();
    }

    // Arrêter l'audio en cours
    if (conversationState.currentAudio) {
        conversationState.currentAudio.pause();
        conversationState.currentAudio = null;
    }
}

// ===== TRAITEMENT IA =====
async function sendToAI() {
    if (!conversationState.accumulatedTranscript.trim()) {
        showToast('Aucun texte à envoyer. Parlez d\'abord.', 'warning');
        return;
    }

    // Arrêter l'écoute
    stopListening();

    conversationState.isProcessing = true;
    updateUIState();

    try {
        console.log('Envoi à l\'IA:', conversationState.accumulatedTranscript);

        // Préparer le message pour l'IA
        const messages = [
            {
                role: 'system',
                content: 'Tu es un assistant IA amical et serviable. Réponds de manière naturelle et conversationnelle en français. Garde tes réponses relativement courtes et engageantes.'
            },
            {
                role: 'user',
                content: conversationState.accumulatedTranscript.trim()
            }
        ];

        const response = await fetch(API_CONFIG.AI_API, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_CONFIG.AI_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur API IA: ${response.status}`);
        }

        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            throw new Error('Réponse IA invalide');
        }

        const aiResponse = data.choices[0].message.content.trim();
        console.log('Réponse IA:', aiResponse);

        // Synthétiser et lire la réponse
        await speakResponse(aiResponse);

    } catch (error) {
        console.error('Erreur lors du traitement IA:', error);
        showToast('Erreur lors du traitement de votre message.', 'error');

        // Réponse d'erreur
        const errorResponse = "Désolé, j'ai rencontré un problème technique. Pouvez-vous répéter votre question ?";
        await speakResponse(errorResponse);
    }

    conversationState.isProcessing = false;
    conversationState.accumulatedTranscript = ''; // Réinitialiser pour la prochaine interaction
    updateUIState();
}

// ===== SYNTHÈSE VOCALE =====
async function speakResponse(text) {
    if (!text.trim() || !conversationState.selectedVoice) {
        return;
    }

    conversationState.isSpeaking = true;
    updateUIState();

    try {
        const response = await fetch(API_CONFIG.TTS_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                voice: conversationState.selectedVoice,
                rate: Math.round((conversationState.speechSpeed - 1) * 100),
                pitch: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur API TTS: ${response.status}`);
        }

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        // Créer et configurer l'élément audio
        const audio = new Audio(audioUrl);
        audio.volume = conversationState.volume;
        conversationState.currentAudio = audio;

        // Événements audio
        audio.onended = function() {
            conversationState.isSpeaking = false;
            URL.revokeObjectURL(audioUrl);
            conversationState.currentAudio = null;

            // Redémarrer automatiquement l'écoute après que l'IA ait fini de parler
            setTimeout(() => {
                if (conversationState.isConversationActive) {
                    startListening();
                }
            }, 500); // Petite pause de 500ms avant de redémarrer l'écoute

            updateUIState();
        };

        audio.onerror = function() {
            console.error('Erreur lors de la lecture audio');
            conversationState.isSpeaking = false;
            conversationState.currentAudio = null;
            updateUIState();
        };

        // Lire l'audio
        await audio.play();

    } catch (error) {
        console.error('Erreur lors de la synthèse vocale:', error);
        conversationState.isSpeaking = false;
        showToast('Erreur lors de la synthèse vocale.', 'error');
        updateUIState();
    }
}

// ===== GESTION DE L'INTERFACE UTILISATEUR =====
function updateUIState() {
    // Réinitialiser tous les états visuels
    $('.process-step').removeClass('active');
    $('.voice-container').removeClass('processing');

    // Mettre à jour selon l'état actuel
    if (conversationState.isListening) {
        // État d'écoute
        $('#statusText').text('En écoute...');
        $('#statusIcon').removeClass().addClass('status-icon listening').html('<i class="fas fa-microphone"></i>');
        $('#statusMessage').text('Parlez maintenant, je vous écoute');
        $('#mainStatusIndicator').addClass('active');
        $('#listeningStep').addClass('active');

        // Boutons
        $('#micBtn').html('<i class="fas fa-stop"></i><span>Arrêter</span>');
        $('#pauseBtn').show();
        $('#sendBtn').show();
        $('#continueBtn').hide();

    } else if (conversationState.isPaused) {
        // État de pause
        $('#statusText').text('En pause');
        $('#statusIcon').removeClass().addClass('status-icon').html('<i class="fas fa-pause"></i>');
        $('#statusMessage').text('Conversation en pause');
        $('#mainStatusIndicator').removeClass('active');

        // Boutons
        $('#micBtn').html('<i class="fas fa-microphone"></i><span>Parler</span>');
        $('#pauseBtn').hide();
        $('#sendBtn').show();
        $('#continueBtn').show();

    } else if (conversationState.isProcessing) {
        // État de traitement
        $('#statusText').text('IA réfléchit...');
        $('#statusIcon').removeClass().addClass('status-icon processing').html('<i class="fas fa-brain"></i>');
        $('#statusMessage').text('Traitement de votre message en cours');
        $('#mainStatusIndicator').addClass('active');
        $('#processingStep').addClass('active');
        $('.voice-container').addClass('processing');

        // Désactiver tous les boutons
        $('.voice-btn').prop('disabled', true);

    } else if (conversationState.isSpeaking) {
        // État de parole IA
        $('#statusText').text('IA parle...');
        $('#statusIcon').removeClass().addClass('status-icon speaking').html('<i class="fas fa-volume-up"></i>');
        $('#statusMessage').text('Écoutez la réponse de l\'IA');
        $('#mainStatusIndicator').addClass('active');
        $('#speakingStep').addClass('active');

        // Désactiver tous les boutons sauf arrêt
        $('.voice-btn').prop('disabled', true);
        $('#micBtn').prop('disabled', false).html('<i class="fas fa-microphone"></i><span>Interrompre</span>');

    } else {
        // État d'attente/prêt
        if (conversationState.isConversationActive) {
            $('#statusText').text('Prêt à vous écouter');
            $('#statusIcon').removeClass().addClass('status-icon').html('<i class="fas fa-microphone-slash"></i>');
            $('#statusMessage').text('Cliquez sur le micro pour parler ou attendez le redémarrage automatique');
        } else {
            $('#statusText').text('Prêt à vous écouter');
            $('#statusIcon').removeClass().addClass('status-icon').html('<i class="fas fa-microphone-slash"></i>');
            $('#statusMessage').text('Cliquez sur le micro pour parler');
        }
        $('#mainStatusIndicator').removeClass('active');

        // Boutons
        $('#micBtn').html('<i class="fas fa-microphone"></i><span>Parler</span>').prop('disabled', false);
        $('#pauseBtn').hide();
        $('#sendBtn').hide();
        $('#continueBtn').hide();
        $('.voice-btn').prop('disabled', false);
    }

    // Gérer l'affichage du bouton d'envoi
    if (conversationState.accumulatedTranscript.trim() && !conversationState.isProcessing && !conversationState.isSpeaking) {
        $('#sendBtn').show();
    }
}

// ===== CONTRÔLES AUDIO =====
function initializeAudioControls() {
    // Initialiser les valeurs par défaut
    $('#speedControl').val(conversationState.speechSpeed);
    $('#speedValue').text(conversationState.speechSpeed + 'x');
    $('#volumeControl').val(conversationState.volume * 100);
    $('#volumeValue').text((conversationState.volume * 100) + '%');
}

// ===== NOTIFICATIONS TOAST =====
function showToast(message, type = 'info', duration = 4000) {
    const toastContainer = $('#toastContainer');
    const toastId = 'toast-' + Date.now();

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };

    const toastHtml = `
        <div class="toast ${type}" id="${toastId}">
            <div class="toast-content">
                <i class="fas ${icons[type]} toast-icon"></i>
                <div class="toast-message">${escapeHtml(message)}</div>
            </div>
        </div>
    `;

    toastContainer.append(toastHtml);

    // Animation d'entrée
    setTimeout(() => {
        $(`#${toastId}`).addClass('show');
    }, 100);

    // Suppression automatique
    setTimeout(() => {
        $(`#${toastId}`).removeClass('show');
        setTimeout(() => {
            $(`#${toastId}`).remove();
        }, 300);
    }, duration);
}

// ===== UTILITAIRES =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== GESTION DES ERREURS GLOBALES =====
window.addEventListener('error', function(event) {
    console.error('Erreur globale:', event.error);
    showToast('Une erreur inattendue s\'est produite.', 'error');
});

// ===== NETTOYAGE À LA FERMETURE =====
window.addEventListener('beforeunload', function() {
    if (conversationState.isConversationActive) {
        stopAllProcesses();
    }
});

// ===== FONCTIONS DE DÉBOGAGE (DÉVELOPPEMENT) =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugConversation = function() {
        console.log('État de la conversation:', conversationState);
        console.log('Transcription accumulée:', conversationState.accumulatedTranscript);
    };

    window.testTTS = async function(text = "Ceci est un test de synthèse vocale.") {
        await speakResponse(text);
    };

    window.testAI = async function(message = "Bonjour, comment allez-vous ?") {
        conversationState.accumulatedTranscript = message;
        await sendToAI();
    };
}