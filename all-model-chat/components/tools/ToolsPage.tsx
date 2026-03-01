import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ToolsPageProps {
  themeId: string;
  onThemeChange: (themeId: string) => void;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ themeId, onThemeChange }) => {
  const handleCVBuilderClick = () => {
    // TODO: Implémenter la navigation vers le CV Builder
    console.log('CV Builder clicked');
  };

  return (
    <div className="h-full overflow-y-auto bg-[var(--theme-bg-primary)] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--theme-text-primary)] mb-2">
          🛠️ Outils Créatifs
        </h1>
        <p className="text-[var(--theme-text-secondary)]">
          Des outils pour booster votre recherche d'emploi
        </p>
      </div>

      {/* Tools Grid - Style des cartes d'opportunités */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {/* CV Builder Card */}
        <div
          onClick={handleCVBuilderClick}
          className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 relative animate-fade-in-up"
        >
          <div className="h-64 relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070"
              className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110"
              alt="CV Builder"
            />
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-black text-[var(--theme-text-primary)] mb-2 group-hover:text-[var(--theme-bg-accent)] transition-colors">
                  Création de CV
                </h3>
                <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed">
                  Créez votre CV professionnel en quelques clics avec nos templates modernes et personnalisables
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <ArrowRight className="w-5 h-5 text-[var(--theme-text-tertiary)] group-hover:text-[var(--theme-bg-accent)] group-hover:translate-x-1 transition-all ml-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;