import React from 'react';
import { RefreshCw, User } from 'lucide-react';

interface SyncIndicatorProps {
  isSync: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

export const SyncIndicator: React.FC<SyncIndicatorProps> = ({
  isSync,
  size = 'sm',
  className = ''
}) => {
  if (!isSync) return null;

  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-blue-500 ${className}`}
      title="Ce champ est synchronisé avec votre profil EVOLUTICS"
    >
      <RefreshCw className={`${sizeClasses[size]} opacity-70`} />
      {size === 'md' && (
        <span className="text-xs font-medium opacity-70">Sync</span>
      )}
    </div>
  );
};

interface SyncFieldLabelProps {
  label: string;
  fieldName: string;
  required?: boolean;
}

export const SyncFieldLabel: React.FC<SyncFieldLabelProps> = ({
  label,
  fieldName,
  required = false
}) => {
  // Importer le service pour vérifier si le champ est synchronisé
  const isSync = [
    'fullName', 'title', 'contact.email', 'contact.phone',
    'profileImage', 'about', 'contact.linkedin', 'skills', 'education'
  ].includes(fieldName);

  return (
    <div className="flex items-center justify-between">
      <label className="text-xs uppercase font-bold text-[var(--theme-text-secondary)]">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <SyncIndicator isSync={isSync} />
    </div>
  );
};

export default SyncIndicator;