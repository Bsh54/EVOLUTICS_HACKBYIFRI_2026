import React from 'react';

interface EvoluticsLogoProps {
  className?: string;
  size?: number;
}

/**
 * Logo EVOLUTICS — Wordmark PNG
 * Utilise l'image officielle EVOLUTICS.png (typographie géométrique futuriste)
 */
export const EvoluticsLogo: React.FC<EvoluticsLogoProps> = ({ className = 'h-7', size }) => {
  return (
    <img
      src="/assets/logo.png"
      alt="EVOLUTICS Logo"
      className={`${className} object-contain`}
      width={size}
      height={size}
      draggable={false}
    />
  );
};

export default EvoluticsLogo;
