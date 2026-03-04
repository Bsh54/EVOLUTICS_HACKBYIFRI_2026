import React from 'react';
import { X, FileText, MessageSquare, ArrowRight } from 'lucide-react';

interface DocumentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCV: () => void;
  onSelectCoverLetter: () => void;
  opportunityTitle?: string;
}

const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectCV,
  onSelectCoverLetter,
  opportunityTitle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[var(--theme-bg-primary)] rounded-[2.5rem] shadow-2xl max-w-4xl w-full border border-[var(--theme-border-primary)] animate-in zoom-in-95 duration-300 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-all"
        >
          <X className="w-6 h-6 text-[var(--theme-text-secondary)]" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Carte CV - Style opportunité */}
            <div
              onClick={() => {
                onSelectCV();
                onClose();
              }}
              className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image avec dégradé */}
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070" 
                  className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" 
                  alt="CV"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-20 h-20 text-white/90 drop-shadow-lg" />
                </div>
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Document Pro
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-[var(--theme-bg-accent)] transition-colors mb-3">
                    Curriculum Vitae
                  </h3>
                  <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed">
                    Templates modernes, optimisation IA et export PDF haute qualité
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)] mt-6">
                  <div className="bg-[var(--theme-bg-tertiary)] px-3 py-1.5 rounded-xl border border-[var(--theme-border-primary)] flex items-center gap-2 hover:bg-[var(--theme-bg-accent)] hover:text-white transition-all group-hover:scale-105">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">Créer mon CV</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Carte Lettre - Style opportunité */}
            <div
              onClick={() => {
                onSelectCoverLetter();
                onClose();
              }}
              className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-purple-600/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Image avec dégradé */}
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600"></div>
                <img 
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2070" 
                  className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" 
                  alt="Lettre"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="w-20 h-20 text-white/90 drop-shadow-lg" />
                </div>
                
                {/* Badge */}
                <div className="absolute top-6 left-6">
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">
                    IA Personnalisée
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold leading-tight group-hover:text-purple-600 transition-colors mb-3">
                    Lettre de Motivation
                  </h3>
                  <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed">
                    Génération IA, 3 tons au choix et modification en temps réel
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)] mt-6">
                  <div className="bg-[var(--theme-bg-tertiary)] px-3 py-1.5 rounded-xl border border-[var(--theme-border-primary)] flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all group-hover:scale-105">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span className="text-[9px] font-black uppercase">Créer ma lettre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentGeneratorModal;
