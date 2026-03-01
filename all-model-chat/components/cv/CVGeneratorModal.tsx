import React, { useState, useEffect } from 'react';
import { X, FileText, User, Briefcase, GraduationCap, Award, Languages, Users, Download, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Opportunity } from '../../types/opportunity';
import { cvIntegrationService, CVData } from '../../services/cvIntegrationService';

interface CVGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  themeId: string;
}

const CVGeneratorModal: React.FC<CVGeneratorModalProps> = ({ isOpen, onClose, opportunity, themeId }) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const steps = [
    { id: 1, title: 'Vérification des données', icon: User },
    { id: 2, title: 'Complétion du profil', icon: Briefcase },
    { id: 3, title: 'Optimisation IA', icon: Sparkles },
    { id: 4, title: 'Prévisualisation', icon: FileText },
    { id: 5, title: 'Export PDF', icon: Download }
  ];

  // Initialisation des données CV à partir du profil utilisateur
  useEffect(() => {
    if (profile && isOpen) {
      const initializeCV = async () => {
        // Mapper les données du profil
        const initialCVData = cvIntegrationService.mapProfileToCVData(profile) as CVData;

        // Récupérer les données CV sauvegardées si elles existent
        const savedCVData = await cvIntegrationService.getUserCVData(profile.id);

        if (savedCVData) {
          // Fusionner les données sauvegardées avec les données du profil
          const mergedData: CVData = {
            ...initialCVData,
            ...savedCVData
          };
          setCvData(mergedData);
        } else {
          setCvData(initialCVData);
        }
      };

      initializeCV();
    }
  }, [profile, isOpen]);

  // Fonction pour optimiser le CV avec l'IA
  const optimizeCV = async () => {
    if (!cvData || !profile) return;

    setIsOptimizing(true);
    try {
      // Utiliser le service d'intégration pour optimiser le CV
      const optimizedData = await cvIntegrationService.optimizeWithOpportunity(cvData, opportunity);

      // Sauvegarder les données CV mises à jour
      await cvIntegrationService.saveCVProfile(profile.id, optimizedData);

      setCvData(optimizedData);
      setCurrentStep(4);
    } catch (error) {
      console.error('Erreur lors de l\'optimisation:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Fonction pour générer le PDF
  const generatePDF = async () => {
    if (!cvData || !profile) return;

    setIsGeneratingPDF(true);
    try {
      // Utiliser le service pour générer le PDF
      const pdfBlob = await cvIntegrationService.generatePDF(cvData);

      if (pdfBlob) {
        // Créer un lien de téléchargement
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${cvData.fullName}_${opportunity.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Sauvegarder dans l'historique
        await cvIntegrationService.saveGeneratedCV(profile.id, opportunity.id, cvData);

        setCurrentStep(5);
      } else {
        console.error('Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!isOpen || !cvData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className={`bg-[var(--theme-bg-primary)] rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden theme-${themeId}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--theme-text-primary)]">Générateur de CV</h2>
              <p className="text-[var(--theme-text-secondary)]">Optimisé pour: {opportunity.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-[var(--theme-text-primary)]" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="p-6 border-b border-[var(--theme-border-primary)]">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center gap-3 ${isActive ? 'text-[var(--theme-bg-accent)]' : isCompleted ? 'text-green-500' : 'text-[var(--theme-text-tertiary)]'}`}>
                    <div className={`p-3 rounded-full ${isActive ? 'bg-[var(--theme-bg-accent)] text-white' : isCompleted ? 'bg-green-500 text-white' : 'bg-[var(--theme-bg-secondary)]'}`}>
                      {isCompleted ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                    </div>
                    <span className="font-medium text-sm hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-[var(--theme-text-tertiary)] mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)]">Vérification des données</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--theme-text-secondary)]">Nom complet</label>
                  <input
                    type="text"
                    value={cvData.fullName}
                    onChange={(e) => setCvData({...cvData, fullName: e.target.value})}
                    className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--theme-text-secondary)]">Titre professionnel</label>
                  <input
                    type="text"
                    value={cvData.title}
                    onChange={(e) => setCvData({...cvData, title: e.target.value})}
                    className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--theme-text-secondary)]">Email</label>
                  <input
                    type="email"
                    value={cvData.contact.email}
                    onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, email: e.target.value}})}
                    className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--theme-text-secondary)]">Téléphone</label>
                  <input
                    type="tel"
                    value={cvData.contact.phone}
                    onChange={(e) => setCvData({...cvData, contact: {...cvData.contact, phone: e.target.value}})}
                    className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--theme-text-secondary)]">À propos</label>
                <textarea
                  value={cvData.about}
                  onChange={(e) => setCvData({...cvData, about: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)]">Complétion du profil</h3>
              <p className="text-[var(--theme-text-secondary)]">
                Ajoutez vos expériences, formations et compétences pour un CV complet.
              </p>
              {/* Ici, on ajouterait les formulaires pour expériences, éducation, etc. */}
              <div className="text-center py-8">
                <p className="text-[var(--theme-text-tertiary)]">Formulaires de complétion à implémenter</p>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)]">Optimisation IA</h3>
              <div className="py-8">
                {isOptimizing ? (
                  <div className="space-y-4">
                    <div className="animate-spin w-12 h-12 border-4 border-[var(--theme-bg-accent)] border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-[var(--theme-text-secondary)]">L'IA optimise votre CV pour cette opportunité...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Sparkles className="w-16 h-16 text-[var(--theme-bg-accent)] mx-auto" />
                    <p className="text-[var(--theme-text-secondary)]">Prêt à optimiser votre CV avec l'IA</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)]">Prévisualisation</h3>
              <div className="bg-[var(--theme-bg-secondary)] p-6 rounded-lg">
                <h4 className="text-lg font-bold text-[var(--theme-text-primary)]">{cvData.fullName}</h4>
                <p className="text-[var(--theme-text-secondary)]">{cvData.title}</p>
                <p className="text-[var(--theme-text-tertiary)] mt-2">{cvData.about}</p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold text-[var(--theme-text-primary)]">CV généré avec succès !</h3>
              <div className="py-8">
                <Check className="w-16 h-16 text-green-500 mx-auto" />
                <p className="text-[var(--theme-text-secondary)] mt-4">Votre CV optimisé est prêt</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--theme-border-primary)] flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 border border-[var(--theme-border-primary)] rounded-lg text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-secondary)] transition-colors"
          >
            Annuler
          </button>

          <div className="flex gap-3">
            {currentStep > 1 && currentStep < 5 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 border border-[var(--theme-border-primary)] rounded-lg text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-secondary)] transition-colors"
              >
                Précédent
              </button>
            )}

            {currentStep === 1 && (
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:bg-[var(--theme-bg-accent-hover)] transition-colors"
              >
                Continuer
              </button>
            )}

            {currentStep === 2 && (
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:bg-[var(--theme-bg-accent-hover)] transition-colors"
              >
                Optimiser avec l'IA
              </button>
            )}

            {currentStep === 3 && !isOptimizing && (
              <button
                onClick={optimizeCV}
                className="px-6 py-3 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:bg-[var(--theme-bg-accent-hover)] transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Lancer l'optimisation
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={generatePDF}
                disabled={isGeneratingPDF}
                className="px-6 py-3 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:bg-[var(--theme-bg-accent-hover)] transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Génération...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Générer PDF
                  </>
                )}
              </button>
            )}

            {currentStep === 5 && (
              <button
                onClick={onClose}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Terminer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVGeneratorModal;