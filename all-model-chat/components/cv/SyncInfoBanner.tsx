import React, { useState } from 'react';
import { Info, X, RefreshCw } from 'lucide-react';

interface SyncInfoBannerProps {
  className?: string;
}

export const SyncInfoBanner: React.FC<SyncInfoBannerProps> = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 p-1 bg-blue-100 rounded-lg">
          <RefreshCw className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-blue-900 mb-1">
            Synchronisation Activée
          </h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            Les champs avec <RefreshCw className="w-3 h-3 inline mx-1 text-blue-600" />
            sont auto-remplis depuis votre profil.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 p-1 hover:bg-blue-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
};

export default SyncInfoBanner;