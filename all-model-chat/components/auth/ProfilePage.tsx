import React, { useState } from 'react';
import {
  User, LogOut, ArrowLeft, Mail, GraduationCap, Briefcase,
  MapPin, Calendar, Heart, Sparkles, ExternalLink, Edit3, Check,
  X, Plus, Loader2, ChevronRight
} from 'lucide-react';
import { UserProfile, EducationLevel } from '../../types/user';
import { OpportunityType } from '../../types/opportunity';
import { getDefaultAvatar } from '../../utils/defaultAvatars';

interface ProfilePageProps {
  profile: UserProfile;
  onBack: () => void;
  onSignOut: () => Promise<void>;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onNavigateToTab?: (tab: 'chat' | 'opportunities') => void;
}

const EDUCATION_LEVELS: EducationLevel[] = [
  'Licence 1', 'Licence 2', 'Licence 3', 'Master 1', 'Master 2', 'Doctorat', 'Diplômé'
];

const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences'
];

const FIELDS_OF_STUDY = [
  'Informatique', 'Droit', 'Médecine', 'Économie', 'Gestion', 'Marketing',
  'Sciences Politiques', 'Ingénierie', 'Architecture', 'Design', 'Communication',
  'Lettres', 'Langues', 'Mathématiques', 'Physique', 'Chimie', 'Biologie',
  'Sociologie', 'Psychologie', 'Philosophie', 'Arts', 'Agriculture', 'Autre'
];

const ProfilePage: React.FC<ProfilePageProps> = ({ profile, onBack, onSignOut, onUpdateProfile, onNavigateToTab }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [displayName, setDisplayName] = useState(profile.display_name || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [university, setUniversity] = useState(profile.university || '');
  const [fieldOfStudy, setFieldOfStudy] = useState(profile.field_of_study || '');
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>(profile.education_level || '');
  const [graduationYear, setGraduationYear] = useState<number | ''>(profile.graduation_year || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>(profile.experience_years ?? '');
  const [currentPosition, setCurrentPosition] = useState(profile.current_position || '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedin_url || '');
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolio_url || '');
  const [preferredTypes, setPreferredTypes] = useState<OpportunityType[]>(profile.preferred_types || []);
  const [preferredLocations, setPreferredLocations] = useState<string[]>(profile.preferred_locations || []);
  const [locationInput, setLocationInput] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState(profile.availability_date || '');
  const [salaryExpectation, setSalaryExpectation] = useState(profile.salary_expectation || '');

  const currentYear = new Date().getFullYear();

  const initials = profile.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (trimmed && !preferredLocations.includes(trimmed)) {
      setPreferredLocations([...preferredLocations, trimmed]);
      setLocationInput('');
    }
  };

  const togglePreferredType = (type: OpportunityType) => {
    setPreferredTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSaveSuccess(false);
    try {
      const updates: Record<string, any> = {
        display_name: displayName.trim() || profile.display_name,
        onboarding_completed: true,
      };
      if (bio.trim()) updates.bio = bio.trim(); else updates.bio = null;
      if (university.trim()) updates.university = university.trim(); else updates.university = null;
      if (fieldOfStudy) updates.field_of_study = fieldOfStudy; else updates.field_of_study = null;
      if (educationLevel) updates.education_level = educationLevel; else updates.education_level = null;
      if (graduationYear !== '') updates.graduation_year = graduationYear; else updates.graduation_year = null;
      updates.skills = skills.length > 0 ? skills : [];
      if (experienceYears !== '') updates.experience_years = experienceYears; else updates.experience_years = null;
      if (currentPosition.trim()) updates.current_position = currentPosition.trim(); else updates.current_position = null;
      if (linkedinUrl.trim()) updates.linkedin_url = linkedinUrl.trim(); else updates.linkedin_url = null;
      if (portfolioUrl.trim()) updates.portfolio_url = portfolioUrl.trim(); else updates.portfolio_url = null;
      updates.preferred_types = preferredTypes.length > 0 ? preferredTypes : [];
      updates.preferred_locations = preferredLocations.length > 0 ? preferredLocations : [];
      if (availabilityDate) updates.availability_date = availabilityDate; else updates.availability_date = null;
      if (salaryExpectation.trim()) updates.salary_expectation = salaryExpectation.trim(); else updates.salary_expectation = null;

      await onUpdateProfile(updates);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await onSignOut();
    } catch (err) {
      console.error('Erreur déconnexion:', err);
    } finally {
      setIsSigningOut(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDisplayName(profile.display_name || '');
    setBio(profile.bio || '');
    setUniversity(profile.university || '');
    setFieldOfStudy(profile.field_of_study || '');
    setEducationLevel(profile.education_level || '');
    setGraduationYear(profile.graduation_year || '');
    setSkills(profile.skills || []);
    setExperienceYears(profile.experience_years ?? '');
    setCurrentPosition(profile.current_position || '');
    setLinkedinUrl(profile.linkedin_url || '');
    setPortfolioUrl(profile.portfolio_url || '');
    setPreferredTypes(profile.preferred_types || []);
    setPreferredLocations(profile.preferred_locations || []);
    setAvailabilityDate(profile.availability_date || '');
    setSalaryExpectation(profile.salary_expectation || '');
    setError(null);
  };

  // Helper pour afficher une valeur ou un placeholder
  const displayValue = (value: string | undefined | null, placeholder: string = 'Non renseigné') => (
    <span className={value ? 'text-[var(--theme-text-primary)]' : 'text-[var(--theme-text-tertiary)] italic'}>
      {value || placeholder}
    </span>
  );

  const inputClass = "w-full bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <div className="bg-[var(--theme-bg-primary)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border-primary)] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button onClick={cancelEdit} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[var(--theme-text-secondary)] hover:bg-[var(--theme-bg-tertiary)] transition-all">
                  <X className="w-4 h-4" /> Annuler
                </button>
                <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-black uppercase tracking-wider bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] hover:bg-[var(--theme-bg-accent-hover)] transition-all disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {isSaving ? 'Sauvegarde...' : 'Enregistrer'}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold text-[var(--theme-bg-accent)] border border-[var(--theme-bg-accent)]/30 hover:bg-[var(--theme-bg-accent)]/10 transition-all">
                <Edit3 className="w-4 h-4" /> Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10 pb-32">

        {/* Messages */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
            <X className="w-5 h-5 shrink-0" /> {error}
          </div>
        )}
        {saveSuccess && (
          <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-medium">
            <Check className="w-5 h-5 shrink-0" /> Profil mis à jour avec succès.
          </div>
        )}

        {/* En-tête profil */}
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-28 h-28 rounded-3xl overflow-hidden border-4 border-[var(--theme-bg-accent)]/20 shadow-2xl shrink-0">
            <img src={getDefaultAvatar(profile.id || profile.email || 'user')} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left space-y-2 flex-1">
            {isEditing ? (
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Votre nom complet" className={`${inputClass} text-2xl font-black`} />
            ) : (
              <h1 className="text-3xl font-black tracking-tight text-[var(--theme-text-primary)]">{profile.display_name}</h1>
            )}
            <p className="flex items-center gap-2 text-sm text-[var(--theme-text-tertiary)] justify-center md:justify-start">
              <Mail className="w-4 h-4" /> {profile.email}
            </p>
            {isEditing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Décrivez-vous en quelques mots..." rows={2} className={`${inputClass} resize-none`} />
            ) : (
              bio && <p className="text-sm text-[var(--theme-text-secondary)] max-w-lg">{bio}</p>
            )}
          </div>
        </div>

        {/* Section Formation */}
        <section className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight">Formation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Établissement</label>
              {isEditing ? (
                <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Université / École" className={inputClass} />
              ) : (
                <div className="text-sm">{displayValue(profile.university)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Domaine d'études</label>
              {isEditing ? (
                <select value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={selectClass}>
                  <option value="">Sélectionnez</option>
                  {FIELDS_OF_STUDY.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              ) : (
                <div className="text-sm">{displayValue(profile.field_of_study)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Niveau</label>
              {isEditing ? (
                <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value as EducationLevel)} className={selectClass}>
                  <option value="">Sélectionnez</option>
                  {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              ) : (
                <div className="text-sm">{displayValue(profile.education_level)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Année de diplôme</label>
              {isEditing ? (
                <select value={graduationYear} onChange={(e) => setGraduationYear(e.target.value ? parseInt(e.target.value) : '')} className={selectClass}>
                  <option value="">Année</option>
                  {Array.from({ length: 10 }, (_, i) => currentYear - 3 + i).map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              ) : (
                <div className="text-sm">{displayValue(profile.graduation_year?.toString())}</div>
              )}
            </div>
          </div>
        </section>

        {/* Section Expérience */}
        <section className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-amber-500" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight">Expérience</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Compétences</label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Ajouter une compétence..." className={`flex-1 ${inputClass}`} />
                  <button type="button" onClick={addSkill} className="px-4 py-3 bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] rounded-xl hover:bg-[var(--theme-bg-accent-hover)] transition-all"><Plus className="w-4 h-4" /></button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20">
                        {skill} <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.length > 0 ? profile.skills.map(skill => (
                  <span key={skill} className="px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20">{skill}</span>
                )) : <span className="text-sm text-[var(--theme-text-tertiary)] italic">Aucune compétence renseignée</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Poste actuel</label>
              {isEditing ? (
                <input type="text" value={currentPosition} onChange={(e) => setCurrentPosition(e.target.value)} placeholder="Étudiant, Stagiaire..." className={inputClass} />
              ) : (
                <div className="text-sm">{displayValue(profile.current_position)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Années d'expérience</label>
              {isEditing ? (
                <input type="number" min="0" max="50" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value ? parseInt(e.target.value) : '')} placeholder="0" className={inputClass} />
              ) : (
                <div className="text-sm">{displayValue(profile.experience_years != null ? `${profile.experience_years} an(s)` : null)}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">LinkedIn</label>
              {isEditing ? (
                <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/..." className={inputClass} />
              ) : (
                profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--theme-bg-accent)] hover:underline"><ExternalLink className="w-3.5 h-3.5" /> {profile.linkedin_url}</a> : <div className="text-sm">{displayValue(null)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Portfolio / GitHub</label>
              {isEditing ? (
                <input type="url" value={portfolioUrl} onChange={(e) => setPortfolioUrl(e.target.value)} placeholder="https://github.com/..." className={inputClass} />
              ) : (
                profile.portfolio_url ? <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-[var(--theme-bg-accent)] hover:underline"><ExternalLink className="w-3.5 h-3.5" /> {profile.portfolio_url}</a> : <div className="text-sm">{displayValue(null)}</div>
              )}
            </div>
          </div>
        </section>

        {/* Section Préférences */}
        <section className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight">Préférences</h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Types d'opportunités</label>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {OPPORTUNITY_TYPES.map(type => (
                  <button key={type} type="button" onClick={() => togglePreferredType(type)} className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${preferredTypes.includes(type) ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] border-[var(--theme-bg-accent)] shadow-lg' : 'bg-[var(--theme-bg-primary)] text-[var(--theme-text-secondary)] border-[var(--theme-border-primary)] hover:border-[var(--theme-bg-accent)]'}`}>
                    {type}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.preferred_types && profile.preferred_types.length > 0 ? profile.preferred_types.map(type => (
                  <span key={type} className="px-3 py-1.5 bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] rounded-lg text-xs font-bold">{type}</span>
                )) : <span className="text-sm text-[var(--theme-text-tertiary)] italic">Aucune préférence</span>}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Localisations</label>
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                    <input type="text" value={locationInput} onChange={(e) => setLocationInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }} placeholder="Cotonou, Paris..." className={`${inputClass} pl-11`} />
                  </div>
                  <button type="button" onClick={addLocation} className="px-4 py-3 bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] rounded-xl hover:bg-[var(--theme-bg-accent-hover)] transition-all"><Plus className="w-4 h-4" /></button>
                </div>
                {preferredLocations.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {preferredLocations.map(loc => (
                      <span key={loc} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20">
                        <MapPin className="w-3 h-3" /> {loc}
                        <button onClick={() => setPreferredLocations(preferredLocations.filter(l => l !== loc))} className="hover:text-red-400"><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profile.preferred_locations && profile.preferred_locations.length > 0 ? profile.preferred_locations.map(loc => (
                  <span key={loc} className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20"><MapPin className="w-3 h-3" /> {loc}</span>
                )) : <span className="text-sm text-[var(--theme-text-tertiary)] italic">Aucune localisation</span>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Disponibilité</label>
              {isEditing ? (
                <input type="date" value={availabilityDate} onChange={(e) => setAvailabilityDate(e.target.value)} className={inputClass} />
              ) : (
                <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-[var(--theme-text-tertiary)]" /> {displayValue(profile.availability_date)}</div>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Prétention salariale</label>
              {isEditing ? (
                <input type="text" value={salaryExpectation} onChange={(e) => setSalaryExpectation(e.target.value)} placeholder="Ex: 300 000 FCFA" className={inputClass} />
              ) : (
                <div className="text-sm">{displayValue(profile.salary_expectation)}</div>
              )}
            </div>
          </div>
        </section>

        {/* Bouton déconnexion */}
        <div className="flex justify-center pt-4 pb-24 md:pb-8">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest text-red-400 border-2 border-red-400/20 hover:bg-red-500/10 hover:border-red-400/40 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <LogOut className="w-5 h-5" />
            {isSigningOut ? 'Déconnexion en cours...' : 'Se déconnecter'}
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProfilePage;
