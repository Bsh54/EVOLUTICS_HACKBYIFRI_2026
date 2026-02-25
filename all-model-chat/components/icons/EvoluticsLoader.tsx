import React from 'react';

interface EvoluticsLoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'accent' | 'white';
}

export const EvoluticsLoader: React.FC<EvoluticsLoaderProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'accent'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const ringColors = {
    primary: 'border-[var(--theme-text-primary)]',
    accent: 'border-[var(--theme-bg-accent)]',
    white: 'border-white'
  };

  const glowColors = {
    primary: 'bg-[var(--theme-text-primary)]',
    accent: 'bg-[var(--theme-bg-accent)]',
    white: 'bg-white'
  };

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      {/* Anneau externe qui tourne */}
      <div 
        className={`absolute inset-0 rounded-full border-2 border-t-transparent ${ringColors[variant]} opacity-70 animate-spin`}
        style={{ animationDuration: '1s' }}
      />
      
      {/* Anneau interne qui tourne dans le sens inverse */}
      <div 
        className={`absolute inset-1 rounded-full border-2 border-b-transparent ${ringColors[variant]} opacity-40 animate-spin`}
        style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
      />
      
      {/* Cœur pulsant au centre */}
      <div 
        className={`absolute inset-[35%] rounded-full ${glowColors[variant]} animate-pulse`} 
      />
    </div>
  );
};
