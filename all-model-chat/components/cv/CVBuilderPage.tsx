import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Download, Loader2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CVData } from '../../types/cvTypes';
import ProfileCVSyncService from '../../services/profileCVSyncService';
import CVDatabaseService from '../../services/cvDatabaseService';
import CVTemplateSelector from './CVTemplateSelector';
import CVEditorPanel from './CVEditorPanel';
import CVTemplate from '../../templates/moderne/Moderne01';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';

interface CVBuilderPageProps {
  onBack: () => void;
  themeId: string;
  onThemeChange: (themeId: string) => void;
}

type CVBuilderStep = 'template-selection' | 'form-filling' | 'preview';

const CVBuilderPage: React.FC<CVBuilderPageProps> = ({
  onBack,
  themeId,
  onThemeChange
}) => {
  const { profile, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState<CVBuilderStep>('template-selection');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [cvData, setCvDataState] = useState<CVData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialisation intelligente des données CV avec synchronisation
  useEffect(() => {
    const initializeCVData = async () => {
      if (profile && currentStep === 'form-filling') {
        setIsInitializing(true);
        console.log('🔄 Initialisation CV avec synchronisation profil...');

        try {
          // Récupérer les données CV depuis la base de données
          const existingData = await CVDatabaseService.getCVData(profile.id);

          if (existingData) {
            // Utiliser les données existantes de la base
            console.log('✅ CV récupéré depuis la base de données');
            setCvDataState(existingData);
          } else {
            // Synchroniser avec le profil (auto-remplissage intelligent)
            const syncedData = ProfileCVSyncService.syncProfileToCV(profile);
            setCvDataState(syncedData);
            console.log('✅ CV initialisé avec données profil (nouveau CV)');
          }
        } catch (error) {
          console.error('❌ Erreur initialisation CV:', error);
          // Fallback vers synchronisation profil
          const syncedData = ProfileCVSyncService.syncProfileToCV(profile);
          setCvDataState(syncedData);
        } finally {
          setIsInitializing(false);
        }
      }
    };

    initializeCVData();
  }, [profile, currentStep]);

  // Gestion de la sélection de template
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('form-filling');
  };

  // Fonction pour mettre à jour les données CV (sans auto-sauvegarde)
  const handleCVDataChange = (newData: CVData) => {
    setCvDataState(newData);
    // Pas d'auto-sauvegarde - seulement mise à jour de l'état local
  };

  // Fonction de sauvegarde manuelle
  const handleSave = async () => {
    if (!cvData || !profile) return;

    setIsSaving(true);
    const toastId = toast.loading("Sauvegarde en cours...");

    try {
      // Vérifier si les données contiennent encore des valeurs par défaut (données de test)
      const hasDefaultData =
        cvData.fullName === "Votre Nom" ||
        cvData.title === "Votre Titre Professionnel" ||
        cvData.about === "Décrivez votre profil professionnel ici..." ||
        cvData.contact.email === "votre.email@exemple.com" ||
        cvData.contact.phone === "+33 6 12 34 56 78" ||
        cvData.experiences.some(exp =>
          exp.role === "Poste Actuel" ||
          exp.role === "Poste Précédent" ||
          exp.company === "Entreprise Actuelle" ||
          exp.company === "Entreprise Précédente"
        ) ||
        cvData.education.some(edu =>
          edu.degree === "Master en Informatique" ||
          edu.school === "Université/École"
        );

      if (hasDefaultData) {
        toast.update(toastId, {
          render: "⚠️ Veuillez modifier les données par défaut avant de sauvegarder",
          type: "warning",
          isLoading: false,
          autoClose: 3000
        });
        return;
      }

      // Sauvegarder en base de données
      await CVDatabaseService.saveCVData(profile.id, cvData, selectedTemplate || 'moderne-01');

      // Synchroniser vers le profil si nécessaire
      if (updateProfile) {
        const profileUpdates = ProfileCVSyncService.syncCVToProfile(cvData, profile);
        if (Object.keys(profileUpdates).length > 0) {
          await updateProfile(profileUpdates);
        }
      }

      toast.update(toastId, {
        render: "✅ CV sauvegardé avec succès !",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.update(toastId, {
        render: "❌ Erreur lors de la sauvegarde",
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    const element = document.querySelector("#cv-preview > div") as HTMLElement;
    if (!element || !cvData) return;

    setIsExporting(true);
    const toastId = toast.loading("Génération du PDF haute fidélité...");

    try {
      const opt = {
        margin: 0,
        filename: `CV_${cvData.fullName.replace(/\s+/g, "_")}_EVOLUTICS.pdf`,
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: {
          scale: 4,
          useCORS: true,
          letterRendering: true,
          logging: false,
          backgroundColor: "#ffffff",
          onclone: (clonedDoc: Document) => {
            try {
              const styles = clonedDoc.querySelectorAll("style");
              styles.forEach(s => {
                s.innerHTML = s.innerHTML.replace(/oklch\([^)]+\)/g, "#1e293b");
              });

              clonedDoc.querySelectorAll("*").forEach(el => {
                const element = el as HTMLElement;
                if (element.style) {
                  const computedStyle = window.getComputedStyle(element);
                  if (computedStyle.color.includes("oklch")) element.style.color = "#1e293b";
                  if (computedStyle.backgroundColor.includes("oklch")) element.style.backgroundColor = "#ffffff";
                  if (computedStyle.borderColor.includes("oklch")) element.style.borderColor = "#1e293b";
                }
              });
            } catch (err) {
              console.warn("Style cleanup warning:", err);
            }

            const clonedElement = clonedDoc.querySelector(".pdf-export-mode") as HTMLElement;
            if (clonedElement) {
              clonedElement.style.width = "794px";
              clonedElement.style.height = "1122px";
              clonedElement.style.minHeight = "1122px";
              clonedElement.style.maxHeight = "1122px";
              clonedElement.style.overflow = "hidden";
              clonedElement.style.position = "relative";

              clonedElement.querySelectorAll("svg").forEach(svg => {
                const color = window.getComputedStyle(svg).color;
                svg.setAttribute("stroke", color);
                svg.style.stroke = color;
                svg.querySelectorAll("path, circle, line, polyline, rect").forEach(path => {
                  const p = path as SVGElement;
                  p.setAttribute("stroke", color);
                  p.style.stroke = color;
                });
              });

              clonedElement.querySelectorAll("img").forEach(img => {
                img.style.objectFit = "cover";
                img.style.display = "block";
              });
            }
          }
        },
        jsPDF: { unit: "px", format: [794, 1122], orientation: "portrait", hotfixes: ["px_scaling"] }
      };

      element.classList.add("pdf-export-mode");
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
      element.classList.remove("pdf-export-mode");

      toast.update(toastId, {
        render: "✅ PDF téléchargé !",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });
    } catch (e) {
      console.error("PDF_ERROR:", e);
      toast.update(toastId, {
        render: "❌ Erreur de génération",
        type: "error",
        isLoading: false,
        autoClose: 2000
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Navigation entre les étapes
  const handleBackToTemplates = () => {
    setCurrentStep('template-selection');
    setSelectedTemplate('');
  };

  const handlePreview = () => {
    if (cvData) {
      setCurrentStep('preview');
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form-filling');
  };

  return (
    <div className={`h-full overflow-hidden bg-[var(--theme-bg-primary)] theme-${themeId}`}>
      {/* Étape 1: Sélection de template */}
      {currentStep === 'template-selection' && (
        <CVTemplateSelector
          onSelectTemplate={handleTemplateSelect}
          onBack={onBack}
          themeId={themeId}
        />
      )}

      {/* Étape 2: Formulaire de saisie */}
      {currentStep === 'form-filling' && (
        <div className="h-full flex flex-col">
          {/* État de chargement pendant l'initialisation */}
          {isInitializing ? (
            <div className="h-full flex items-center justify-center bg-[var(--theme-bg-primary)]">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-bg-accent)]" />
                </div>
                <h2 className="text-xl font-semibold text-[var(--theme-text-primary)] mb-2">
                  Initialisation de votre CV
                </h2>
                <p className="text-[var(--theme-text-secondary)]">
                  Récupération de vos données...
                </p>
              </div>
            </div>
          ) : cvData ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)]">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToTemplates}
                    className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--theme-text-primary)]">
                      ✏️ Remplissez votre CV
                    </h1>
                    <p className="text-[var(--theme-text-secondary)]">
                      Template: Moderne Professionnel
                    </p>
                  </div>
                </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-accent)]/10 border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] rounded-xl transition-colors"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Sauvegarder
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl transition-colors font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Prévisualiser
              </button>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 flex overflow-hidden">
            {/* Panel d'édition - Réduit de 450px à 380px */}
            <div className="w-[380px] bg-[var(--theme-bg-secondary)] border-r border-[var(--theme-border-primary)] overflow-y-auto p-4">
              <div className="mb-6 text-center border-b pb-3">
                <h2 className="text-lg font-black text-[var(--theme-text-primary)] uppercase leading-none mb-1">
                  Informations CV
                </h2>
                <p className="text-xs text-[var(--theme-text-secondary)]">
                  Remplissez tous les champs pour un CV complet
                </p>
              </div>
              <CVEditorPanel data={cvData} onChange={handleCVDataChange} />
            </div>

            {/* Prévisualisation en temps réel - Padding réduit */}
            <div className="flex-1 bg-gray-200 overflow-y-auto p-3 md:p-6 flex justify-center">
              <div className="w-full max-w-[700px]">
                <CVTemplate data={cvData} />
              </div>
            </div>
          </div>
            </>
          ) : null}
        </div>
      )}

      {/* Étape 3: Prévisualisation finale */}
      {currentStep === 'preview' && cvData && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)]">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToForm}
                className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-[var(--theme-text-primary)]">
                  👁️ Prévisualisation finale
                </h1>
                <p className="text-[var(--theme-text-secondary)]">
                  Votre CV est prêt à être téléchargé
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToForm}
                className="px-4 py-2 border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
              >
                Modifier
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl transition-colors font-medium"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Télécharger PDF
              </button>
            </div>
          </div>

          {/* Prévisualisation */}
          <div className="flex-1 bg-gray-200 overflow-y-auto p-3 md:p-6 flex justify-center">
            <div id="cv-preview" className="w-full max-w-[700px]">
              <CVTemplate data={cvData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderPage;