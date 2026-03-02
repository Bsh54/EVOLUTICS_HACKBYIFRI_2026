import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Download, Loader2, Save, Wand2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CVData } from '../../types/cvTypes';
import ProfileCVSyncService from '../../services/profileCVSyncService';
import CVDatabaseService from '../../services/cvDatabaseService';
import CVAIOptimizationService, { JobOffer, OptimizationResult } from '../../services/cvAIOptimizationService';
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

type CVBuilderStep = 'template-selection' | 'form-filling' | 'ai-optimization';

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
  const [modifiedFields, setModifiedFields] = useState<Set<string>>(new Set());

  // États pour l'optimisation IA
  const [jobOffer, setJobOffer] = useState<JobOffer>({
    title: '',
    company: '',
    description: ''
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [showOptimizationResults, setShowOptimizationResults] = useState(false);

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
            // Fusionner les données sauvegardées avec les données de test par défaut
            console.log('✅ CV récupéré depuis la base de données');
            const defaultData = ProfileCVSyncService.syncProfileToCV(profile);
            const mergedData = mergeWithDefaults(existingData, defaultData);
            setCvDataState(mergedData);
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

  // Fonction pour mettre à jour les données CV et tracker les modifications
  const handleCVDataChange = (newData: CVData) => {
    setCvDataState(newData);

    // Tracker les champs modifiés en comparant avec les valeurs par défaut
    const defaultValues = {
      fullName: "Votre Nom",
      title: "Votre Titre Professionnel",
      about: "Décrivez votre profil professionnel ici...",
      objective: "Votre objectif de carrière",
      "contact.email": "votre.email@exemple.com",
      "contact.phone": "+33 6 12 34 56 78",
      "contact.address": "Votre Adresse, Ville",
      "contact.linkedin": "linkedin.com/in/votre-profil"
    };

    const newModifiedFields = new Set(modifiedFields);

    // Vérifier les champs simples
    Object.entries(defaultValues).forEach(([key, defaultValue]) => {
      let currentValue;
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        currentValue = (newData as any)[parent]?.[child];
      } else {
        currentValue = (newData as any)[key];
      }

      if (currentValue && currentValue !== defaultValue) {
        newModifiedFields.add(key);
      }
    });

    // Vérifier les tableaux (expériences, formation, etc.)
    if (newData.experiences.some(exp =>
      exp.role !== "Poste Actuel" && exp.role !== "Poste Précédent" ||
      exp.company !== "Entreprise Actuelle" && exp.company !== "Entreprise Précédente"
    )) {
      newModifiedFields.add('experiences');
    }

    if (newData.education.some(edu =>
      edu.degree !== "Master en Informatique" ||
      edu.school !== "Université/École"
    )) {
      newModifiedFields.add('education');
    }

    if (newData.skills.some(skill =>
      !["JavaScript", "React", "Node.js", "Python"].includes(skill.name)
    )) {
      newModifiedFields.add('skills');
    }

    setModifiedFields(newModifiedFields);
    console.log('🔄 Champs modifiés:', Array.from(newModifiedFields));
  };

  // Fonction de sauvegarde manuelle - ne sauvegarde que les champs modifiés
  const handleSave = async () => {
    console.log('🔄 Début sauvegarde, cvData:', cvData);
    console.log('🔄 Profile:', profile);
    console.log('🔄 Champs modifiés:', Array.from(modifiedFields));

    if (!cvData || !profile) {
      console.log('❌ Données manquantes - cvData:', !!cvData, 'profile:', !!profile);
      return;
    }

    if (modifiedFields.size === 0) {
      toast.warning("Aucune modification à sauvegarder");
      return;
    }

    setIsSaving(true);

    try {
      // Créer un objet avec seulement les données modifiées
      const dataToSave = createFilteredCVData(cvData, modifiedFields);

      console.log('✅ Données filtrées à sauvegarder:', dataToSave);

      // Sauvegarder en base de données
      await CVDatabaseService.saveCVData(profile.id, dataToSave, selectedTemplate || 'moderne-01');

      // Synchroniser vers le profil si nécessaire - UTILISER LES DONNÉES COMPLÈTES
      if (updateProfile) {
        // ⚠️ IMPORTANT: Utiliser cvData (données complètes affichées)
        // et non dataToSave (données filtrées) pour éviter les incohérences
        const profileUpdates = ProfileCVSyncService.syncCVToProfile(cvData, profile);
        if (Object.keys(profileUpdates).length > 0) {
          console.log('🔄 Synchronisation profil avec données complètes:', profileUpdates);
          await updateProfile(profileUpdates);
        }
      }

      console.log('✅ Sauvegarde terminée avec succès');
      toast.success(`✅ CV sauvegardé ! (${modifiedFields.size} champs modifiés)`, {
        autoClose: 2000
      });
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      toast.error("❌ Erreur lors de la sauvegarde", {
        autoClose: 3000
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction d'optimisation IA
  const handleAIOptimization = async () => {
    if (!cvData) {
      toast.error("Aucune donnée CV disponible pour l'optimisation");
      return;
    }

    // Validation de l'offre d'emploi
    if (!CVAIOptimizationService.validateJobOffer(jobOffer)) {
      toast.error("Veuillez remplir au minimum le titre du poste et une description détaillée (50+ caractères)");
      return;
    }

    setIsOptimizing(true);
    const toastId = toast.loading("🤖 Optimisation IA en cours...");

    try {
      console.log('🤖 Début optimisation IA avec:', jobOffer);

      const result = await CVAIOptimizationService.optimizeCV(cvData, jobOffer);

      console.log('✅ Optimisation terminée:', result);

      // Mettre à jour les données CV avec la version optimisée
      setCvDataState(result.optimizedCV);
      setOptimizationResult(result);
      setShowOptimizationResults(true);

      // Marquer tous les champs comme modifiés pour permettre la sauvegarde
      const allFields = new Set([
        'fullName', 'title', 'about', 'objective', 'experiences',
        'education', 'skills', 'certifications', 'tools', 'links',
        'languages', 'hobbies', 'references', 'strategicPitch'
      ]);
      setModifiedFields(allFields);

      toast.update(toastId, {
        render: `✅ CV optimisé ! Score de correspondance: ${result.matchScore}% - Vous pouvez maintenant éditer les modifications`,
        type: "success",
        isLoading: false,
        autoClose: 4000
      });

    } catch (error) {
      console.error('❌ Erreur optimisation IA:', error);

      let errorMessage = "Erreur lors de l'optimisation IA";
      if (error instanceof Error) {
        if (error.message.includes('API')) {
          errorMessage = "Erreur de connexion à l'IA. Vérifiez votre connexion.";
        } else if (error.message.includes('Clé API')) {
          errorMessage = "Configuration IA manquante. Contactez le support.";
        }
      }

      toast.update(toastId, {
        render: `❌ ${errorMessage}`,
        type: "error",
        isLoading: false,
        autoClose: 5000
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Fonction pour appliquer les résultats d'optimisation
  const handleApplyOptimization = async () => {
    if (!optimizationResult || !profile) return;

    try {
      // Sauvegarder le CV optimisé
      await CVDatabaseService.saveCVData(
        profile.id,
        optimizationResult.optimizedCV,
        selectedTemplate || 'moderne-01'
      );

      // Marquer tous les champs optimisés comme modifiés pour permettre la sauvegarde future
      const optimizedFields = new Set([
        'fullName', 'title', 'about', 'objective', 'experiences',
        'education', 'skills', 'certifications', 'tools', 'links',
        'languages', 'hobbies', 'references', 'strategicPitch'
      ]);
      setModifiedFields(optimizedFields);

      // S'assurer que les données optimisées sont visibles dans le formulaire
      setCvDataState(optimizationResult.optimizedCV);

      toast.success("✅ CV optimisé sauvegardé avec succès !");
      setShowOptimizationResults(false);
      setCurrentStep('form-filling');

    } catch (error) {
      console.error('❌ Erreur sauvegarde CV optimisé:', error);
      toast.error("❌ Erreur lors de la sauvegarde du CV optimisé");
    }
  };

  // Fonction pour fusionner les données sauvegardées avec les données de test par défaut
  const mergeWithDefaults = (savedData: CVData, defaultData: CVData): CVData => {
    return {
      fullName: savedData.fullName || defaultData.fullName,
      title: savedData.title || defaultData.title,
      color: savedData.color || defaultData.color,
      profileImage: savedData.profileImage || defaultData.profileImage,
      contact: {
        phone: savedData.contact.phone || defaultData.contact.phone,
        email: savedData.contact.email || defaultData.contact.email,
        address: savedData.contact.address || defaultData.contact.address,
        linkedin: savedData.contact.linkedin || defaultData.contact.linkedin
      },
      about: savedData.about || defaultData.about,
      objective: savedData.objective || defaultData.objective,
      experiences: savedData.experiences.length > 0 ? savedData.experiences : defaultData.experiences,
      education: savedData.education.length > 0 ? savedData.education : defaultData.education,
      certifications: savedData.certifications.length > 0 ? savedData.certifications : defaultData.certifications,
      skills: savedData.skills.length > 0 ? savedData.skills : defaultData.skills,
      tools: savedData.tools.length > 0 ? savedData.tools : defaultData.tools,
      links: savedData.links.length > 0 ? savedData.links : defaultData.links,
      languages: savedData.languages.length > 0 ? savedData.languages : defaultData.languages,
      hobbies: savedData.hobbies.length > 0 ? savedData.hobbies : defaultData.hobbies,
      references: savedData.references.length > 0 ? savedData.references : defaultData.references,
      strategicPitch: savedData.strategicPitch || defaultData.strategicPitch,
      isOptimized: savedData.isOptimized || defaultData.isOptimized,
      sectionsOrder: savedData.sectionsOrder || defaultData.sectionsOrder
    };
  };

  // Fonction pour créer les données CV filtrées (seulement les champs modifiés)
  const createFilteredCVData = (fullData: CVData, modifiedFields: Set<string>): CVData => {
    // Commencer avec une structure CV minimale
    const filteredData: CVData = {
      fullName: modifiedFields.has('fullName') ? fullData.fullName : "",
      title: modifiedFields.has('title') ? fullData.title : "",
      color: fullData.color, // Toujours sauvegarder la couleur
      profileImage: fullData.profileImage || "",
      contact: {
        phone: modifiedFields.has('contact.phone') ? fullData.contact.phone : "",
        email: modifiedFields.has('contact.email') ? fullData.contact.email : "",
        address: modifiedFields.has('contact.address') ? fullData.contact.address : "",
        linkedin: modifiedFields.has('contact.linkedin') ? fullData.contact.linkedin : ""
      },
      about: modifiedFields.has('about') ? fullData.about : "",
      objective: modifiedFields.has('objective') ? fullData.objective : "",
      experiences: modifiedFields.has('experiences') ? fullData.experiences : [],
      education: modifiedFields.has('education') ? fullData.education : [],
      certifications: modifiedFields.has('certifications') ? fullData.certifications : [],
      skills: modifiedFields.has('skills') ? fullData.skills : [],
      tools: modifiedFields.has('tools') ? fullData.tools : [],
      links: modifiedFields.has('links') ? fullData.links : [],
      languages: modifiedFields.has('languages') ? fullData.languages : [],
      hobbies: modifiedFields.has('hobbies') ? fullData.hobbies : [],
      references: modifiedFields.has('references') ? fullData.references : [],
      strategicPitch: modifiedFields.has('strategicPitch') ? fullData.strategicPitch : "",
      isOptimized: fullData.isOptimized || false,
      sectionsOrder: fullData.sectionsOrder
    };

    return filteredData;
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
              {/* Header - Responsive */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)] gap-4 sm:gap-0">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleBackToTemplates}
                    className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
                  </button>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">
                      ✏️ Remplissez votre CV
                    </h1>
                    <p className="text-sm text-[var(--theme-text-secondary)]">
                      Template: Moderne Professionnel
                    </p>
                  </div>
                </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-accent)]/10 border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] rounded-xl transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span className="hidden sm:inline">Sauvegarder</span>
                <span className="sm:hidden">Sauver</span>
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
              >
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">Télécharger PDF</span>
                <span className="sm:hidden">PDF</span>
              </button>
              <button
                onClick={() => setCurrentStep('ai-optimization')}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium text-sm sm:text-base flex-1 sm:flex-none justify-center shadow-lg"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Optimiser avec IA</span>
                <span className="sm:hidden">IA</span>
              </button>
            </div>
          </div>

          {/* Contenu principal - Layout responsive */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Panel d'édition - Responsive */}
            <div className="w-full lg:w-[380px] bg-[var(--theme-bg-secondary)] border-b lg:border-b-0 lg:border-r border-[var(--theme-border-primary)] overflow-y-auto p-4">
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

            {/* Prévisualisation en temps réel - MASQUÉE SUR MOBILE */}
            <div className="hidden lg:flex flex-1 bg-gray-200 overflow-y-auto p-6 justify-center">
              <div className="w-full max-w-[700px]">
                <CVTemplate data={cvData} />
              </div>
            </div>
          </div>
            </>
          ) : null}
        </div>
      )}

      {/* Étape 3: Optimisation IA */}
      {currentStep === 'ai-optimization' && cvData && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-primary)] gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentStep('form-filling')}
                className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--theme-text-primary)]" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
                  <Wand2 className="w-6 h-6 text-purple-600" />
                  Optimisation IA
                </h1>
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  Optimisez votre CV pour une offre d'emploi spécifique
                </p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Instructions */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Wand2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-2">
                      Comment ça marche ?
                    </h3>
                    <ul className="text-sm text-[var(--theme-text-secondary)] space-y-1">
                      <li>• Collez l'offre d'emploi qui vous intéresse</li>
                      <li>• Notre IA analyse les compétences et mots-clés recherchés</li>
                      <li>• Votre CV est automatiquement optimisé pour cette offre</li>
                      <li>• Téléchargez votre CV personnalisé et augmentez vos chances</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Formulaire d'offre d'emploi */}
              <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-4">
                  Offre d'emploi cible
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text-primary)] mb-2">
                      Titre du poste
                    </label>
                    <input
                      type="text"
                      value={jobOffer.title}
                      onChange={(e) => setJobOffer(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Développeur Full Stack Senior"
                      className="w-full px-4 py-3 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text-primary)] mb-2">
                      Entreprise
                    </label>
                    <input
                      type="text"
                      value={jobOffer.company}
                      onChange={(e) => setJobOffer(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Ex: Google, Microsoft, Startup innovante..."
                      className="w-full px-4 py-3 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--theme-text-primary)] mb-2">
                      Description complète de l'offre
                    </label>
                    <textarea
                      rows={12}
                      value={jobOffer.description}
                      onChange={(e) => setJobOffer(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Collez ici la description complète de l'offre d'emploi (missions, compétences requises, profil recherché, etc.)..."
                      className="w-full px-4 py-3 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => setCurrentStep('form-filling')}
                    className="px-6 py-3 border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] rounded-xl transition-colors font-medium"
                  >
                    Retour au formulaire
                  </button>
                  <button
                    onClick={handleAIOptimization}
                    disabled={isOptimizing}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-lg flex-1 sm:flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOptimizing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Wand2 className="w-5 h-5" />
                    )}
                    {isOptimizing ? 'Optimisation en cours...' : 'Optimiser mon CV avec l\'IA'}
                  </button>
                </div>
              </div>

              {/* Résultats de l'optimisation IA */}
              {showOptimizationResults && optimizationResult && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-700 rounded-xl p-6 mt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-[var(--theme-text-primary)] mb-2 flex items-center gap-2">
                        Optimisation terminée !
                        <span className="text-sm bg-gradient-to-r from-green-600 to-blue-600 text-white px-2 py-1 rounded-full">
                          {optimizationResult.matchScore}% de correspondance
                        </span>
                      </h3>

                      {/* Changements effectués */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-[var(--theme-text-primary)] mb-2">
                          Modifications apportées ({optimizationResult.changes.length}) :
                        </h4>
                        <ul className="text-sm text-[var(--theme-text-secondary)] space-y-1">
                          {optimizationResult.changes.slice(0, 5).map((change, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              {change}
                            </li>
                          ))}
                          {optimizationResult.changes.length > 5 && (
                            <li className="text-xs text-[var(--theme-text-tertiary)] italic">
                              ... et {optimizationResult.changes.length - 5} autres modifications
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Recommandations */}
                      {optimizationResult.recommendations.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-[var(--theme-text-primary)] mb-2">
                            Recommandations supplémentaires :
                          </h4>
                          <ul className="text-sm text-[var(--theme-text-secondary)] space-y-1">
                            {optimizationResult.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setShowOptimizationResults(false)}
                          className="px-4 py-2 border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] rounded-xl transition-colors"
                        >
                          Masquer les résultats
                        </button>
                        <button
                          onClick={handleApplyOptimization}
                          className="flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium shadow-lg flex-1 sm:flex-none"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Sauvegarder le CV optimisé
                        </button>
                        <button
                          onClick={() => {
                            // Charger les données optimisées dans le formulaire pour permettre l'édition
                            setCvDataState(optimizationResult.optimizedCV);
                            // Marquer les champs optimisés comme modifiés
                            const optimizedFields = new Set([
                              'fullName', 'title', 'about', 'objective', 'experiences',
                              'education', 'skills', 'certifications'
                            ]);
                            setModifiedFields(optimizedFields);
                            setCurrentStep('form-filling');
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl transition-colors font-medium"
                        >
                          <Sparkles className="w-4 h-4" />
                          Éditer le CV optimisé
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilderPage;