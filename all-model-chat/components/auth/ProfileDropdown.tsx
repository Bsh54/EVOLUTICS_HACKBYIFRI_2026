import React, { useState, useRef, useEffect } from 'react';
import {
  User, LogOut, Settings, Shield, ChevronDown,
  GraduationCap, Briefcase, MapPin, Mail, ExternalLink, AlertTriangle
} from 'lucide-react';
import { UserProfile } from '../../types/user';

interface ProfileDropdownProps {
  profile: UserProfile;
  onSignOut: () => Promise<void>;
  onOpenSettings?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ profile, onSignOut, onOpenSettings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Vérifier si le profil est incomplet
  const isProfileIncomplete = 
    !profile.university || 
    !profile.field_of_study || 
    !profile.education_level || 
    !profile.graduation_year ||
    !profile.skills || profile.skills.length === 0 ||
    !profile.current_position ||
    profile.experience_years === undefined || profile.experience_years === null;

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await onSignOut();
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    } finally {
      setIsSigningOut(false);
      setIsOpen(false);
    }
  };

  const initials = profile.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bouton avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[var(--theme-bg-tertiary)] transition-all group relative"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--theme-bg-accent)] flex items-center justify-center overflow-hidden border-2 border-[var(--theme-border-primary)] group-hover:border-[var(--theme-bg-accent)] transition-colors">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--theme-text-accent)] text-xs font-black">{initials}</span>
          )}
        </div>

        {/* Pastille de notification si le profil est incomplet */}
        {isProfileIncomplete && (
          <span className="absolute top-1 left-7 w-3 h-3 bg-red-500 border-2 border-[var(--theme-bg-secondary)] rounded-full animate-pulse"></span>
        )}

        <ChevronDown className={`w-3.5 h-3.5 text-[var(--theme-text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-2xl shadow-2xl z-[200] overflow-hidden"
          style={{ animation: 'fadeInUp 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both' }}
        >
          {/* Alerte Profil Incomplet */}
          {isProfileIncomplete && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-4 py-3 flex items-start gap-3 relative overflow-hidden group/alert cursor-pointer" onClick={onOpenSettings}>
              <div className="absolute inset-0 bg-red-500/5 translate-y-full group-hover/alert:translate-y-0 transition-transform duration-300 ease-out" />
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5 relative z-10" />
              <div className="relative z-10">
                <p className="text-xs font-bold text-red-600 dark:text-red-400">Profil incomplet !</p>
                <p className="text-[10px] text-red-600/80 dark:text-red-400/80 mt-0.5 leading-tight pr-2">
                  Complétez votre profil (formation, établissement, domaine, niveau, année, expérience, compétences, poste) pour une meilleure expérience. 
                  <span className="font-bold underline decoration-red-500/30 underline-offset-2"> Cliquez ici.</span>
                </p>
              </div>
            </div>
          )}

          {/* En-tête profil */}
          <div className="p-5 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-tertiary)]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[var(--theme-bg-accent)] flex items-center justify-center overflow-hidden border-2 border-[var(--theme-bg-accent)]/30 shrink-0">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[var(--theme-text-accent)] text-lg font-black">{initials}</span>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-black text-[var(--theme-text-primary)] truncate">{profile.display_name}</h3>
                <p className="text-xs text-[var(--theme-text-tertiary)] truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {profile.email}
                </p>
              </div>
            </div>

            {/* Tags rapides */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.education_level && (
                <span className="flex items-center gap-1 px-2 py-1 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-[10px] font-bold border border-[var(--theme-bg-accent)]/20">
                  <GraduationCap className="w-3 h-3" /> {profile.education_level}
                </span>
              )}
              {profile.field_of_study && (
                <span className="flex items-center gap-1 px-2 py-1 bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] rounded-lg text-[10px] font-bold border border-[var(--theme-border-primary)]">
                  {profile.field_of_study}
                </span>
              )}
              {profile.current_position && (
                <span className="flex items-center gap-1 px-2 py-1 bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] rounded-lg text-[10px] font-bold border border-[var(--theme-border-primary)]">
                  <Briefcase className="w-3 h-3" /> {profile.current_position}
                </span>
              )}
            </div>
          </div>

          {/* Infos supplémentaires */}
          {(profile.university || profile.preferred_locations?.length) && (
            <div className="px-5 py-3 border-b border-[var(--theme-border-primary)] space-y-2">
              {profile.university && (
                <div className="flex items-center gap-2 text-xs text-[var(--theme-text-secondary)]">
                  <GraduationCap className="w-3.5 h-3.5 text-[var(--theme-text-tertiary)]" />
                  <span className="truncate">{profile.university}</span>
                </div>
              )}
              {profile.preferred_locations && profile.preferred_locations.length > 0 && (
                <div className="flex items-center gap-2 text-xs text-[var(--theme-text-secondary)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--theme-text-tertiary)]" />
                  <span className="truncate">{profile.preferred_locations.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* Liens rapides */}
          <div className="p-2">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] transition-all"
              >
                <ExternalLink className="w-4 h-4" /> LinkedIn
              </a>
            )}
            {profile.portfolio_url && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Portfolio
              </a>
            )}
            <button
              onClick={() => { window.location.pathname = '/admin-portal'; setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] hover:text-[var(--theme-text-primary)] transition-all"
            >
              <Shield className="w-4 h-4" /> Portail Admin
            </button>
          </div>

          {/* Déconnexion */}
          <div className="p-2 border-t border-[var(--theme-border-primary)]">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
            >
              <LogOut className="w-4 h-4" />
              {isSigningOut ? 'Déconnexion...' : 'Se déconnecter'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
