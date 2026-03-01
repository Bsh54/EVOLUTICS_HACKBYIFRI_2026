import React from 'react';
import { FileText, ArrowRight } from 'lucide-react';

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

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* CV Builder Card */}
        <div
          onClick={handleCVBuilderClick}
          className="bg-[var(--theme-bg-secondary)] rounded-xl p-6 border border-[var(--theme-border-primary)] hover:border-[var(--theme-border-focus)] transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105 group"
        >
          <div className="flex items-center justify-center w-12 h-12 bg-[var(--theme-bg-accent)] rounded-lg mb-4 group-hover:scale-110 transition-transform duration-300">
            <FileText className="w-6 h-6 text-[var(--theme-text-accent)]" />
          </div>

          <h3 className="text-lg font-semibold text-[var(--theme-text-primary)] mb-2">
            Création de CV
          </h3>

          <p className="text-[var(--theme-text-secondary)] mb-4 text-sm">
            Créez votre CV professionnel en quelques clics avec nos templates modernes
          </p>

          <div className="flex items-center text-[var(--theme-text-accent)] font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
            Commencer
            <ArrowRight className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;