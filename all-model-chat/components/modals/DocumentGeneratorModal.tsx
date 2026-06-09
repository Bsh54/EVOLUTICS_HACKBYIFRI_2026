import React, { useEffect, useState } from 'react';
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
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Délai pour l'animation des cartes après l'ouverture du modal
      const timer = setTimeout(() => setShowCards(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowCards(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
      
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop avec animation */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"
        style={{ animation: 'fadeIn 0.3s ease-out' }}
        onClick={onClose}
      />

      {/* Modal avec animation */}
      <div 
        className="relative bg-[var(--theme-bg-primary)] rounded-2xl sm:rounded-[2.5rem] shadow-2xl max-w-4xl w-full border border-[var(--theme-border-primary)] overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ animation: 'modalSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-all"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--theme-text-secondary)]" />
        </button>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Carte CV - Style opportunité */}
            <div
              onClick={() => {
                onSelectCV();
                onClose();
              }}
              className={`group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-2xl sm:rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: showCards ? '0.1s' : '0s'
              }}
            >
              {/* Image avec dégradé */}
              <div className="h-32 sm:h-40 md:h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070" 
                  className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" 
                  alt="CV"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FileText className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/90 drop-shadow-lg" />
                </div>
                
                {/* Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6">
                  <span className="bg-white/20 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Document Pro
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight group-hover:text-[var(--theme-bg-accent)] transition-colors mb-2 sm:mb-3">
                    Curriculum Vitae
                  </h3>
                  <p className="text-[var(--theme-text-secondary)] text-xs sm:text-sm leading-relaxed">
                    Templates modernes, optimisation IA et export PDF haute qualité
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-[var(--theme-border-primary)] mt-4 sm:mt-6">
                  <div className="bg-[var(--theme-bg-tertiary)] px-2.5 py-1.5 sm:px-3 rounded-xl border border-[var(--theme-border-primary)] flex items-center gap-1.5 sm:gap-2 hover:bg-[var(--theme-bg-accent)] hover:text-white transition-all group-hover:scale-105">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase">Créer mon CV</span>
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
              className={`group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-2xl sm:rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-purple-600/40 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: showCards ? '0.25s' : '0s'
              }}
            >
              {/* Image avec dégradé */}
              <div className="h-32 sm:h-40 md:h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600"></div>
                <img 
                  src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2070" 
                  className="w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-110" 
                  alt="Lettre"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white/90 drop-shadow-lg" />
                </div>
                
                {/* Badge */}
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 md:top-6 md:left-6">
                  <span className="bg-white/20 backdrop-blur-md text-white px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border border-white/20">
                    IA Personnalisée
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight group-hover:text-purple-600 transition-colors mb-2 sm:mb-3">
                    Lettre de Motivation
                  </h3>
                  <p className="text-[var(--theme-text-secondary)] text-xs sm:text-sm leading-relaxed">
                    Génération IA, 3 tons au choix et modification en temps réel
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-[var(--theme-border-primary)] mt-4 sm:mt-6">
                  <div className="bg-[var(--theme-bg-tertiary)] px-2.5 py-1.5 sm:px-3 rounded-xl border border-[var(--theme-border-primary)] flex items-center gap-1.5 sm:gap-2 hover:bg-purple-600 hover:text-white transition-all group-hover:scale-105">
                    <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase">Créer ma lettre</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DocumentGeneratorModal;
