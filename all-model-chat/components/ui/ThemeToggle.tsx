import React from 'react';
import { Sun, Moon, Palette } from 'lucide-react';
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
  const [isOpen, setIsOpen] = React.useState(false);
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

  const getThemeIcon = (themeId: string) => {
    switch (themeId) {
      case 'pearl':
        return <Sun className={iconSizeClasses[size]} />;
      case 'midnight':
        return <Moon className={iconSizeClasses[size]} />;
      case 'onyx':
        return <Palette className={iconSizeClasses[size]} />;
      default:
        return <Palette className={iconSizeClasses[size]} />;
    }
  };

  const getThemeColor = (themeId: string) => {
    switch (themeId) {
      case 'pearl':
        return 'text-amber-500 hover:text-amber-600';
      case 'midnight':
        return 'text-blue-400 hover:text-blue-300';
      case 'onyx':
        return 'text-purple-400 hover:text-purple-300';
      default:
        return 'text-gray-400 hover:text-gray-300';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
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
        title={`Thème actuel: ${currentTheme?.name}`}
        aria-label="Changer de thème"
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

      {/* Menu déroulant */}
      {isOpen && (
        <>
          {/* Overlay pour fermer le menu */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu des thèmes */}
          <div className="theme-toggle-menu absolute top-full mt-2 right-0 z-50 min-w-48 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-lg shadow-xl overflow-hidden">
            {AVAILABLE_THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  onThemeChange(theme.id);
                  setIsOpen(false);
                }}
                className={`
                  theme-option
                  w-full px-4 py-3 text-left flex items-center gap-3
                  hover:bg-[var(--theme-bg-tertiary)]
                  transition-colors duration-150
                  ${theme.id === currentThemeId ? 'bg-[var(--theme-bg-tertiary)]' : ''}
                `}
              >
                <div className={`flex items-center justify-center w-6 h-6 ${getThemeColor(theme.id)}`}>
                  {getThemeIcon(theme.id)}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-[var(--theme-text-primary)]">
                    {theme.name}
                  </div>
                  <div className="text-xs text-[var(--theme-text-secondary)]">
                    {theme.id === 'pearl' && 'Thème clair et professionnel'}
                    {theme.id === 'midnight' && 'Thème sombre élégant'}
                    {theme.id === 'onyx' && 'Thème très sombre'}
                  </div>
                </div>

                {/* Indicateur du thème actuel */}
                {theme.id === currentThemeId && (
                  <div className="theme-indicator w-2 h-2 bg-[var(--theme-bg-accent)] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeToggle;