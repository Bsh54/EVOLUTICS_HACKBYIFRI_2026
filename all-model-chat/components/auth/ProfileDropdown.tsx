import React, { useState, useRef, useEffect } from 'react';
import {
  User, LogOut, Settings, Shield, ChevronDown,
  GraduationCap, Briefcase, MapPin, Mail, ExternalLink
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
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[var(--theme-bg-tertiary)] transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-[var(--theme-bg-accent)] flex items-center justify-center overflow-hidden border-2 border-[var(--theme-border-primary)] group-hover:border-[var(--theme-bg-accent)] transition-colors">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[var(--theme-text-accent)] text-xs font-black">{initials}</span>
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--theme-text-tertiary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-2xl shadow-2xl z-[200] overflow-hidden"
          style={{ animation: 'fadeInUp 0.2s cubic-bezier(0.2, 0.8, 0.2, 1) both' }}
        >
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
