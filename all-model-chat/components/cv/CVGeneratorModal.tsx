import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Send, Sparkles, Download, Loader2, Printer } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Opportunity } from '../../types/opportunity';
import { CVData } from '../../types/cvTypes';
import { getCVData, setCVData } from '../../lib/cvStore';
import { optimizeCVWithAI } from '../../lib/cvAiService';
import CVEditorPanel from './CVEditorPanel';
import CVTemplate from '../../templates/moderne/Moderne01';
// @ts-ignore
import html2pdf from 'html2pdf.js';
import { toast } from 'react-toastify';

interface CVGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  themeId: string;
}

const CVGeneratorModal: React.FC<CVGeneratorModalProps> = ({ isOpen, onClose, opportunity, themeId }) => {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState<'editor' | 'optimize' | 'preview'>('editor');
  const [cvData, setCvDataState] = useState<CVData | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [jobOffer, setJobOffer] = useState('');
  const [companyInfo, setCompanyInfo] = useState('');

  // données par défaut à partir du profil
  const getDefaultCVData = (): CVData => ({
    fullName: profile?.fullName || "Votre Nom",
    title: profile?.title || "Votre Titre Professionnel",
    color: "#00a99d",
    profileImage: "",
    contact: {
      phone: profile?.phone || "",
      email: profile?.email || "",
      address: profile?.location || "",
      linkedin: ""
    },
    about: profile?.bio || "Décrivez votre profil professionnel ici...",
    objective: "",
    experiences: [],
    education: [],
    certifications: [],
    skills: [],
    tools: [],
    links: [],
    languages: [],
    hobbies: [],
    references: [],
    strategicPitch: "",
    isOptimized: false,
    sectionsOrder: {
      sidebar: ["contact", "skills", "languages", "hobbies"],
      main: ["about", "experiences", "education", "references"]
    }
  });

  // init des données CV
  useEffect(() => {
    if (isOpen && profile) {
      // pré-remplir l'offre d'emploi
      setJobOffer(opportunity.fullContent || opportunity.description || '');
      setCompanyInfo(`${opportunity.organization} - ${opportunity.type}`);

      // récupérer ou créer les données CV
      let existingData = getCVData();
      if (!existingData) {
        existingData = getDefaultCVData();
        setCVData(existingData);
      }
      setCvDataState(existingData);
    }
  }, [isOpen, profile, opportunity]);

  // mettre à jour les données CV
  const handleCVDataChange = (newData: CVData) => {
    setCvDataState(newData);
    setCVData(newData);
  };

  // optimisation IA
  const handleOptimize = async () => {
    if (!cvData || !jobOffer.trim()) {
      toast.warn("Veuillez vérifier l'offre d'emploi.");
      return;
    }

    setIsOptimizing(true);
    const toastId = toast.loading("L'IA adapte votre profil...");

    try {
      const optimized = await optimizeCVWithAI({
        jobOffer,
        currentData: cvData
      });

      handleCVDataChange(optimized);
      toast.update(toastId, { render: "CV Optimisé !", type: "success", isLoading: false, autoClose: 2000 });
      setCurrentStep('preview');
    } catch (error) {
      toast.update(toastId, { render: "❌ Erreur d'optimisation", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Fonction d'export PDF (exactement comme CV-AI)
  const handleExportPDF = async () => {
    const element = document.querySelector("#cv-preview > div") as HTMLElement;
    if (!element || !cvData) return;

    setIsExporting(true);
    const toastId = toast.loading("Génération du PDF haute fidélité...");

    try {
      const opt = {
        margin: 0,
        filename: `CV_${cvData.fullName.replace(/\s+/g, "_")}_${opportunity.title.replace(/\s+/g, "_")}.pdf`,
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

      toast.update(toastId, { render: "✅ PDF téléchargé !", type: "success", isLoading: false, autoClose: 2000 });
    } catch (e) {
      console.error("PDF_ERROR:", e);
      toast.update(toastId, { render: "❌ Erreur de génération", type: "error", isLoading: false, autoClose: 2000 });
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen || !cvData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className={`bg-[var(--theme-bg-primary)] rounded-3xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden theme-${themeId}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--theme-text-primary)]">Générateur de CV Intelligent</h2>
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

        {/* Navigation Steps */}
        <div className="flex border-b border-[var(--theme-border-primary)]">
          <button
            onClick={() => setCurrentStep('editor')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              currentStep === 'editor'
                ? 'bg-[var(--theme-bg-accent)] text-white'
                : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)]'
            }`}
          >
            1. Édition du CV
          </button>
          <button
            onClick={() => setCurrentStep('optimize')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              currentStep === 'optimize'
                ? 'bg-[var(--theme-bg-accent)] text-white'
                : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)]'
            }`}
          >
            2. Optimisation IA
          </button>
          <button
            onClick={() => setCurrentStep('preview')}
            className={`flex-1 py-4 px-6 font-medium transition-colors ${
              currentStep === 'preview'
                ? 'bg-[var(--theme-bg-accent)] text-white'
                : 'text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-secondary)]'
            }`}
          >
            3. Prévisualisation
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(95vh-200px)] overflow-hidden">
          {/* Étape 1: Édition */}
          {currentStep === 'editor' && (
            <>
              <div className="w-[450px] bg-[var(--theme-bg-secondary)] border-r border-[var(--theme-border-primary)] overflow-y-auto p-6">
                <div className="mb-8 text-center border-b pb-4">
                  <h1 className="text-2xl font-black text-[var(--theme-text-primary)] uppercase leading-none mb-1">Votre CV</h1>
                </div>
                <CVEditorPanel data={cvData} onChange={handleCVDataChange} />
              </div>
              <div className="flex-1 bg-gray-200 overflow-y-auto p-4 md:p-12 flex justify-center">
                <div className="w-full max-w-[850px]">
                  <CVTemplate data={cvData} />
                </div>
              </div>
            </>
          )}

          {/* Étape 2: Optimisation */}
          {currentStep === 'optimize' && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="max-w-2xl w-full">
                <div className="bg-[var(--theme-bg-secondary)] p-8 rounded-xl shadow-md border space-y-8">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-full bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] mb-2">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--theme-text-primary)]">Optimisation par IA</h1>
                    <p className="text-[var(--theme-text-secondary)]">Adaptez votre CV à cette opportunité.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="font-bold text-[var(--theme-text-primary)]">Description de l'offre</label>
                      <textarea
                        className="w-full min-h-[150px] p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] focus:ring-2 focus:ring-[var(--theme-bg-accent)] outline-none"
                        placeholder="Description automatiquement remplie..."
                        value={jobOffer}
                        onChange={(e) => setJobOffer(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-bold text-[var(--theme-text-primary)]">Infos sur l'entreprise (Optionnel)</label>
                      <input
                        className="w-full p-3 border border-[var(--theme-border-primary)] rounded-lg bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] focus:ring-2 focus:ring-[var(--theme-bg-accent)] outline-none"
                        placeholder="Valeurs, culture..."
                        value={companyInfo}
                        onChange={(e) => setCompanyInfo(e.target.value)}
                      />
                    </div>

                    <button
                      className="w-full py-6 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white text-lg font-bold shadow-lg rounded-lg transition-colors flex items-center justify-center gap-3"
                      onClick={handleOptimize}
                      disabled={isOptimizing}
                    >
                      {isOptimizing ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
                      LANCER L'IA
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Prévisualisation */}
          {currentStep === 'preview' && (
            <>
              <div className="w-[300px] bg-[var(--theme-bg-secondary)] border-r border-[var(--theme-border-primary)] p-6 space-y-4">
                <h3 className="text-lg font-bold text-[var(--theme-text-primary)]">Actions</h3>

                {cvData.isOptimized && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-600 text-sm font-bold uppercase tracking-widest text-center">
                    Optimisation effectuée
                  </div>
                )}

                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="w-full py-4 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] font-bold text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {isExporting ? <Loader2 className="animate-spin" /> : <Download />}
                  TÉLÉCHARGER PDF
                </button>

                <button
                  onClick={() => window.print()}
                  className="w-full py-4 border-2 border-[var(--theme-bg-accent)] text-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent)]/10 font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  IMPRIMER
                </button>

                <button
                  onClick={() => setCurrentStep('optimize')}
                  className="w-full text-[var(--theme-bg-accent)] hover:underline text-sm font-bold uppercase pt-2"
                >
                  Modifier l'optimisation
                </button>
              </div>

              <div className="flex-1 bg-gray-200 overflow-y-auto p-4 md:p-12 flex justify-center">
                <div className="w-full max-w-[850px]">
                  <CVTemplate data={cvData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVGeneratorModal;