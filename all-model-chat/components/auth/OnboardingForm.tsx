import React, { useState } from 'react';
import {
  ArrowRight, ArrowLeft, Check, User, GraduationCap,
  Briefcase, Heart, Upload, MapPin, Calendar, X, Plus
} from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';
import { EvoluticsLoader } from '../icons/EvoluticsLoader';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSelector } from '../common/LanguageSelector';
import { useLanguage } from '../../contexts/LanguageContext';
import { UserProfile, EducationLevel } from '../../types/user';
import { OpportunityType } from '../../types/opportunity';

interface OnboardingFormProps {
  profile: UserProfile;
  onComplete: (updates: Partial<UserProfile>) => Promise<void>;
  themeId: string;
  onThemeChange: (themeId: string) => void;
}

const STEPS = [
  { id: 'identity', label: 'Identité', icon: User },
  { id: 'academic', label: 'Formation', icon: GraduationCap },
  { id: 'professional', label: 'Expérience', icon: Briefcase },
  { id: 'preferences', label: 'Préférences', icon: Heart },
];

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

const OnboardingForm: React.FC<OnboardingFormProps> = ({ profile, onComplete, themeId, onThemeChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const addLocation = () => {
    const trimmed = locationInput.trim();
    if (trimmed && !preferredLocations.includes(trimmed)) {
      setPreferredLocations([...preferredLocations, trimmed]);
      setLocationInput('');
    }
  };

  const removeLocation = (loc: string) => {
    setPreferredLocations(preferredLocations.filter(l => l !== loc));
  };

  const togglePreferredType = (type: OpportunityType) => {
    setPreferredTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onComplete({ onboarding_completed: true });
    } catch (err: any) {
      console.error('Erreur skip onboarding:', err);
      setError(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Construire le payload en excluant les valeurs vides
      const updates: Record<string, any> = {
        display_name: displayName.trim() || profile.display_name,
        onboarding_completed: true,
      };

      if (bio.trim()) updates.bio = bio.trim();
      if (university.trim()) updates.university = university.trim();
      if (fieldOfStudy) updates.field_of_study = fieldOfStudy;
      if (educationLevel) updates.education_level = educationLevel;
      if (graduationYear !== '') updates.graduation_year = graduationYear;
      if (skills.length > 0) updates.skills = skills;
      if (experienceYears !== '') updates.experience_years = experienceYears;
      if (currentPosition.trim()) updates.current_position = currentPosition.trim();
      if (linkedinUrl.trim()) updates.linkedin_url = linkedinUrl.trim();
      if (portfolioUrl.trim()) updates.portfolio_url = portfolioUrl.trim();
      if (preferredTypes.length > 0) updates.preferred_types = preferredTypes;
      if (preferredLocations.length > 0) updates.preferred_locations = preferredLocations;
      if (availabilityDate) updates.availability_date = availabilityDate;
      if (salaryExpectation.trim()) updates.salary_expectation = salaryExpectation.trim();

      await onComplete(updates);
    } catch (err: any) {
      console.error('Erreur onboarding:', err);
      setError(err?.message || 'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identité
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black tracking-tight">Bienvenue sur EVOLUTICS</h2>
              <p className="text-[var(--theme-text-secondary)] font-medium">Parlez-nous un peu de vous pour personnaliser votre expérience.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Nom complet *</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Votre nom complet"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Décrivez-vous en quelques mots..."
                rows={3}
                className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all resize-none"
              />
            </div>
          </div>
        );

      case 1: // Académique
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black tracking-tight">Votre formation</h2>
              <p className="text-[var(--theme-text-secondary)] font-medium">Ces infos nous aident à trouver les meilleures opportunités pour vous.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Établissement</label>
              <div className="relative">
                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="Nom de votre université ou école"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Domaine d'études</label>
              <select
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all appearance-none cursor-pointer"
              >
                <option value="">Sélectionnez un domaine</option>
                {FIELDS_OF_STUDY.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Niveau</label>
                <select
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Niveau</option>
                  {EDUCATION_LEVELS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Année de diplôme</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value ? parseInt(e.target.value) : '')}
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Année</option>
                  {Array.from({ length: 10 }, (_, i) => currentYear - 3 + i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2: // Professionnel
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black tracking-tight">Votre expérience</h2>
              <p className="text-[var(--theme-text-secondary)] font-medium">Vos compétences aident notre IA à mieux vous conseiller.</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Compétences</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                  placeholder="Ex: React, Python, Gestion de projet..."
                  className="flex-1 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-4 py-3 bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] rounded-xl hover:bg-[var(--theme-bg-accent-hover)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {skills.map(skill => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Poste actuel</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                  <input
                    type="text"
                    value={currentPosition}
                    onChange={(e) => setCurrentPosition(e.target.value)}
                    placeholder="Étudiant, Stagiaire..."
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Années d'exp.</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value ? parseInt(e.target.value) : '')}
                  placeholder="0"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">LinkedIn</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/votre-profil"
                className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Portfolio / GitHub</label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://github.com/votre-profil"
                className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
              />
            </div>
          </div>
        );

      case 3: // Préférences
        return (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-black tracking-tight">Vos préférences</h2>
              <p className="text-[var(--theme-text-secondary)] font-medium">Dernière étape ! Quel type d'opportunités vous intéresse ?</p>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Types d'opportunités</label>
              <div className="flex flex-wrap gap-3">
                {OPPORTUNITY_TYPES.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => togglePreferredType(type)}
                    className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 ${
                      preferredTypes.includes(type)
                        ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] border-[var(--theme-bg-accent)] shadow-lg'
                        : 'bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] border-[var(--theme-border-primary)] hover:border-[var(--theme-bg-accent)]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Localisations préférées</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLocation(); } }}
                    placeholder="Ex: Cotonou, Paris, Remote..."
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={addLocation}
                  className="px-4 py-3 bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] rounded-xl hover:bg-[var(--theme-bg-accent-hover)] transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {preferredLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {preferredLocations.map(loc => (
                    <span
                      key={loc}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg text-xs font-bold border border-[var(--theme-bg-accent)]/20"
                    >
                      <MapPin className="w-3 h-3" /> {loc}
                      <button onClick={() => removeLocation(loc)} className="hover:text-red-400 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Disponibilité</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                  <input
                    type="date"
                    value={availabilityDate}
                    onChange={(e) => setAvailabilityDate(e.target.value)}
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Prétention salariale</label>
                <input
                  type="text"
                  value={salaryExpectation}
                  onChange={(e) => setSalaryExpectation(e.target.value)}
                  placeholder="Ex: 300 000 FCFA"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="h-full w-full overflow-y-auto bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] p-4 md:p-8">

      {/* Sélecteurs de langue et thème fixe en haut à droite */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSelector />
        <ThemeToggle
          currentThemeId={themeId}
          onThemeChange={onThemeChange}
          size="md"
          className="shadow-lg"
        />
      </div>

      <div className="w-full max-w-2xl mx-auto space-y-8 py-8">

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center">
            <EvoluticsLogo className="h-9" />
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center gap-2">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => index <= currentStep && setCurrentStep(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-lg'
                      : isCompleted
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                        : 'bg-[var(--theme-bg-secondary)] text-[var(--theme-text-tertiary)] border border-[var(--theme-border-primary)]'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span className="hidden md:inline">{step.label}</span>
                </button>
                {index < STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 rounded-full ${index < currentStep ? 'bg-green-500' : 'bg-[var(--theme-border-primary)]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
            <X className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Contenu du formulaire */}
        <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-[2rem] p-8 md:p-10 shadow-xl">
          {renderStepContent()}
        </div>

        {/* Erreur aussi près des boutons pour visibilité */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
            <X className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {/* Boutons de navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Précédent
          </button>

          <button
            onClick={() => {
              if (currentStep === 0 && !displayName.trim()) return;
              isLastStep ? handleFinish() : handleNext();
            }}
            disabled={isSubmitting}
            className="flex items-center gap-3 px-8 py-3.5 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black rounded-2xl shadow-xl transition-all group active:scale-[0.98] text-sm uppercase tracking-widest disabled:opacity-50"
          >
            {isSubmitting ? (
              <EvoluticsLoader size="sm" variant="white" />
            ) : isLastStep ? (
              <>
                TERMINER <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                SUIVANT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Skip */}
        <div className="text-center">
          <button
            onClick={handleSkip}
            disabled={isSubmitting}
            className="text-sm text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-bold transition-all underline underline-offset-4 decoration-[var(--theme-border-primary)] hover:decoration-[var(--theme-bg-accent)] px-4 py-2 rounded-xl hover:bg-[var(--theme-bg-accent)]/5 disabled:opacity-50"
          >
            {isSubmitting ? 'Chargement...' : 'Passer cette étape et compléter plus tard →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
