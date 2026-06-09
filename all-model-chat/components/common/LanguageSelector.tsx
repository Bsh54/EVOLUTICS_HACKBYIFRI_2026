import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-tertiary)] transition-colors border border-[var(--theme-border-primary)]"
        title={language === 'fr' ? 'Switch to English' : 'Passer en Français'}
      >
        <Globe className="w-4 h-4 text-[var(--theme-text-secondary)]" />
        <span className="text-sm font-medium text-[var(--theme-text-primary)] uppercase">
          {language}
        </span>
      </button>
    </div>
  );
};
