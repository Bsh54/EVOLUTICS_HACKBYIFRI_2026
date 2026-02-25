import React from 'react';

interface EvoluticsLogoProps {
  className?: string;
  size?: number;
}

/**
 * Logo EVOLUTICS — Wordmark PNG avec nom
 * Utilise l'image officielle EVOLUTICS WITH NAME.png (typographie géométrique futuriste)
 */
export const EvoluticsLogo: React.FC<EvoluticsLogoProps> = ({ className = 'h-7', size }) => {
  return (
    <img
      src="/assets/evolutics-logo.png"
      alt="EVOLUTICS Logo"
      className={`${className} object-contain`}
      width={size}
      height={size}
      draggable={false}
    />
  );
};

export default EvoluticsLogo;
