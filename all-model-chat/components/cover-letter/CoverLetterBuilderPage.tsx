import React, { useState, useEffect } from 'react';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Opportunity } from '../../types/opportunity';
import { coverLetterService } from '../../services/coverLetterService';
import { CoverLetterTone } from '../../types/coverLetter';
import CoverLetterTemplateSelector from './CoverLetterTemplateSelector';
import CoverLetterFormPanel from './CoverLetterFormPanel';
import CoverLetterPreview from './CoverLetterPreview';
import { toast } from 'react-toastify';

interface CoverLetterBuilderPageProps {
  onBack: () => void;
  themeId: string;
  opportunityForLetter?: Opportunity | null;
}

type BuilderStep = 'template-selection' | 'form-filling';

interface LetterFormData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  jobDescription: string;
  companyInfo: string;
  tone: CoverLetterTone;
  additionalInfo: string;
}

const CoverLetterBuilderPage: React.FC<CoverLetterBuilderPageProps> = ({
  onBack,
  themeId,
  opportunityForLetter
}) => {
  const { user, profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<BuilderStep>('template-selection');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const [formData, setFormData] = useState<LetterFormData>({
    recipientName: '',
    recipientTitle: '',
    companyName: opportunityForLetter?.organization || '',
    companyAddress: '',
    jobTitle: opportunityForLetter?.title || '',
    jobDescription: opportunityForLetter?.description || '',
    companyInfo: '',
    tone: 'formal',
    additionalInfo: ''
  });

  // Pré-remplir avec l'opportunité si fournie
  useEffect(() => {
    if (opportunityForLetter) {
      setFormData(prev => ({
        ...prev,
        companyName: opportunityForLetter.organization || '',
        jobTitle: opportunityForLetter.title || '',
        jobDescription: opportunityForLetter.description || ''
      }));
    }
  }, [opportunityForLetter]);

  const handleTemplateSelect = (templateId: string) => {
    setCurrentStep('form-filling');
  };

  const handleGenerate = async () => {
    if (!profile) {
      toast.error("Profil utilisateur non disponible");
      return;
    }

    if (!formData.jobTitle || !formData.companyName) {
      toast.error("Veuillez remplir au minimum le poste et l'entreprise");
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading("🤖 Génération de votre lettre en cours...");

    try {
      const content = await coverLetterService.generateWithAI({
        userProfile: {
          display_name: profile.display_name,
          email: profile.email,
          phone: profile.phone,
          university: profile.university,
          field_of_study: profile.field_of_study,
          education_level: profile.education_level,
          skills: profile.skills,
          experience_years: profile.experience_years,
          current_position: profile.current_position,
          bio: profile.bio
        },
        opportunity: opportunityForLetter
          ? {
              title: opportunityForLetter.title,
              organization: opportunityForLetter.organization,
              type: opportunityForLetter.type,
              description: opportunityForLetter.description,
              fullContent: opportunityForLetter.fullContent
            }
          : {
              title: formData.jobTitle,
              organization: formData.companyName,
              type: 'Emploi',
              description: formData.additionalInfo
            },
        tone: formData.tone,
        additionalInfo: formData.additionalInfo,
        jobDescription: formData.jobDescription,
        companyInfo: formData.companyInfo
      });

      console.log('🎉 [CoverLetterBuilder] Contenu généré par l\'IA:', {
        length: content.length,
        firstChars: content.substring(0, 100),
        hasNewlines: content.includes('\n'),
        startsWithSpace: content.startsWith(' '),
        charCodeFirst: content.charCodeAt(0)
      });

      // Vérification et correction : s'assurer que le nom complet est présent
      let finalContent = content;
      if (profile?.display_name) {
        const nameParts = profile.display_name.split(' ');
        const firstName = nameParts[0];
        
        // Vérifier si le contenu commence bien par le prénom complet
        if (!content.startsWith(firstName)) {
          console.warn('⚠️ [CoverLetterBuilder] Le nom semble tronqué, correction en cours...');
          
          // Chercher où commence le nom tronqué dans le contenu
          const contentStart = content.substring(0, 50);
          let foundPartialName = false;
          
          // Vérifier si on trouve une partie du prénom
          for (let i = 1; i < firstName.length; i++) {
            const partial = firstName.substring(i);
            if (contentStart.startsWith(partial)) {
              console.log(`🔧 [CoverLetterBuilder] Nom tronqué détecté: "${partial}" au lieu de "${firstName}"`);
              finalContent = firstName + content.substring(partial.length);
              foundPartialName = true;
              break;
            }
          }
          
          if (foundPartialName) {
            console.log('✅ [CoverLetterBuilder] Nom corrigé:', finalContent.substring(0, 50));
          }
        }
      }

      setGeneratedContent(finalContent);

      toast.update(toastId, {
        render: "✅ Lettre générée avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Erreur génération:', error);
      toast.update(toastId, {
        render: "❌ Erreur lors de la génération",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!user || !generatedContent) return;

    try {
      await coverLetterService.createCoverLetter({
        user_id: user.id,
        content: generatedContent,
        title: `Lettre - ${formData.jobTitle}`,
        tone: formData.tone,
        opportunity_id: opportunityForLetter?.id,
        opportunity_title: opportunityForLetter?.title,
        opportunity_organization: opportunityForLetter?.organization,
        is_favorite: false
      });

      toast.success("✅ Lettre sauvegardée !");
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error("❌ Erreur lors de la sauvegarde");
    }
  };

  const handleExportPDF = async () => {
    if (!generatedContent) return;

    setIsExporting(true);
    const toastId = toast.loading("Génération du PDF...");

    try {
      // Importer jsPDF dynamiquement
      const { jsPDF } = await import('jspdf');
      
      // Créer un nouveau document PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Marges et dimensions
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const maxWidth = pageWidth - (2 * margin);
      const lineHeight = 7;
      let yPosition = margin;

      // Police et taille
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // Diviser le contenu en lignes
      const lines = generatedContent.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Ligne vide = saut de ligne
        if (line.trim() === '') {
          yPosition += lineHeight / 2;
          continue;
        }

        // Découper le texte pour qu'il tienne dans la largeur
        const wrappedLines = doc.splitTextToSize(line, maxWidth);

        // Vérifier si on doit ajouter une nouvelle page
        if (yPosition + (wrappedLines.length * lineHeight) > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }

        // Ajouter chaque ligne wrappée
        wrappedLines.forEach((wrappedLine: string) => {
          doc.text(wrappedLine, margin, yPosition);
          yPosition += lineHeight;
        });
      }

      // Sauvegarder le PDF
      const filename = `Lettre_Motivation_${formData.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(filename);

      toast.update(toastId, {
        render: "✅ PDF téléchargé avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.update(toastId, {
        render: "❌ Erreur lors de l'export PDF",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleBackToTemplates = () => {
    setCurrentStep('template-selection');
    setGeneratedContent('');
  };

  return (
    <div className={`h-full overflow-hidden bg-[var(--theme-bg-primary)] theme-${themeId}`}>
      {/* Étape 1: Sélection de template */}
      {currentStep === 'template-selection' && (
        <CoverLetterTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onBack={onBack}
          themeId={themeId}
        />
      )}

      {/* Étape 2: Formulaire et génération */}
      {currentStep === 'form-filling' && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)] gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToTemplates}
                className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">
                  ✉️ Générez votre Lettre de Motivation
                </h1>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  Template: Professionnel Moderne
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {generatedContent && (
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl transition-colors text-sm flex-1 sm:flex-none justify-center"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span className="hidden sm:inline">Télécharger PDF</span>
                  <span className="sm:hidden">PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Panel de formulaire */}
            <div className="w-full lg:w-[380px] bg-[var(--theme-bg-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--theme-border-primary)] overflow-y-auto p-4">
              <CoverLetterFormPanel
                formData={formData}
                onChange={setFormData}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                hasContent={!!generatedContent}
              />
            </div>

            {/* Prévisualisation */}
            <div className="hidden lg:flex flex-1 bg-gray-200 overflow-y-auto p-6 justify-center">
              <CoverLetterPreview
                content={generatedContent}
                formData={formData}
                profile={profile}
                onContentChange={setGeneratedContent}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoverLetterBuilderPage;
