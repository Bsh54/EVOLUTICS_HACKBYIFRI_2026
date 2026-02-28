import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { AVAILABLE_THEMES } from '../../constants/themeConstants';

interface ThemeToggleProps {
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  currentThemeId,
  onThemeChange,
  className = '',
  showLabel = false,
  size = 'md'
}) => {
  const currentTheme = AVAILABLE_THEMES.find(t => t.id === currentThemeId);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Fonction pour basculer entre les thèmes
  const toggleTheme = () => {
    const nextTheme = currentThemeId === 'midnight' ? 'pearl' : 'midnight';
    onThemeChange(nextTheme);
  };

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'pearl':
        return <Sun className={iconSizeClasses[size]} />;
      case 'midnight':
        return <Moon className={iconSizeClasses[size]} />;
      default:
        return <Moon className={iconSizeClasses[size]} />;
    }
  };

  const getThemeColor = (themeId: string) => {
    switch (themeId) {
      case 'pearl':
        return 'text-amber-500 hover:text-amber-600';
      case 'midnight':
        return 'text-blue-400 hover:text-blue-300';
      default:
        return 'text-gray-400 hover:text-gray-300';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggleTheme}
        className={`
          ${sizeClasses[size]}
          theme-toggle-button
          theme-toggle-${currentThemeId}
          flex items-center justify-center
          bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-accent)]
          border border-[var(--theme-border-primary)]
          rounded-lg
          transition-all duration-200
          cursor-pointer
          group
          ${getThemeColor(currentThemeId)}
        `}
        title={`Basculer vers ${currentThemeId === 'midnight' ? 'Pearl (Clair)' : 'Midnight (Sombre)'}`}
        aria-label="Basculer le thème"
      >
        <div className="theme-toggle-icon">
          {getThemeIcon(currentThemeId)}
        </div>

        {/* Effet de glow subtil pour le thème midnight - maintenant en bleu */}
        {currentThemeId === 'midnight' && (
          <div className="absolute inset-0 rounded-lg bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
        )}
      </button>

      {showLabel && (
        <span className="ml-2 text-sm text-[var(--theme-text-secondary)]">
          {currentTheme?.name}
        </span>
      )}
    </div>
  );
};

export default ThemeToggle;