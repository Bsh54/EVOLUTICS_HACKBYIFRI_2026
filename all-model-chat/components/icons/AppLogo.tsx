
import React from 'react';

export const AppLogo: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <img
      src="/assets/logo.png"
      alt="EVOLUTICS Logo"
      className={`${className || ''} object-contain`}
      style={style}
      draggable={false}
    />
  );
};

