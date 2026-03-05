import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle, GraduationCap, Briefcase, BrainCircuit } from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';
import { EvoluticsLoader } from '../icons/EvoluticsLoader';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AuthPageProps {
  onAuthSuccess: () => void;
  onBackToLanding: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  themeId: string;
  onThemeChange: (themeId: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, onBackToLanding, signIn, signUp, signInWithGoogle, themeId, onThemeChange }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'google' | 'email' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!displayName.trim()) {
        setError('Le nom est requis.');
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        return;
      }
      // Afficher le modal pour accepter les politiques
      if (!acceptedPrivacy) {
        setPendingAction('email');
        setShowPrivacyModal(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signIn(email, password);
        onAuthSuccess();
      } else {
        await signUp(email, password, displayName.trim());
        onAuthSuccess();
      }
    } catch (err: any) {
      const msg = err?.message || 'Une erreur est survenue.';

      if (msg.includes('Invalid login') || msg.includes('Invalid credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('User already registered')) {
        setError('Un compte avec cet email existe déjà. Connectez-vous.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter.');
      } else if (msg === 'EMAIL_CONFIRMATION_REQUIRED') {
        setSuccessMessage('Inscription réussie ! Veuillez vérifier vos emails pour confirmer votre compte avant de vous connecter.');
        setMode('login');
      } else if (msg.includes('Too many requests') || msg.includes('rate limit')) {
        setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else if (msg.includes('Password should be')) {
        setError('Le mot de passe est trop faible (min 6 caractères).');
      } else {
        console.error('Erreur technique:', msg);
        setError('Impossible de se connecter. Veuillez réessayer plus tard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    
    // En mode inscription, afficher le modal de confidentialité
    if (mode === 'register' && !acceptedPrivacy) {
      setPendingAction('google');
      setShowPrivacyModal(true);
      return;
    }
    
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion Google.');
    }
  };

  const handleAcceptPrivacy = async () => {
    setAcceptedPrivacy(true);
    setShowPrivacyModal(false);
    
    // Continuer avec l'action en attente
    if (pendingAction === 'google') {
      try {
        await signInWithGoogle();
      } catch (err: any) {
        setError(err?.message || 'Erreur de connexion Google.');
      }
    } else if (pendingAction === 'email') {
      // Relancer la soumission du formulaire
      setIsLoading(true);
      try {
        await signUp(email, password, displayName.trim());
        onAuthSuccess();
      } catch (err: any) {
        const msg = err?.message || 'Une erreur est survenue.';
        if (msg === 'EMAIL_CONFIRMATION_REQUIRED') {
          setSuccessMessage('Inscription réussie ! Veuillez vérifier vos emails pour confirmer votre compte avant de vous connecter.');
          setMode('login');
        } else {
          setError(msg);
        }
      } finally {
        setIsLoading(false);
      }
    }
    
    setPendingAction(null);
  };

  return (
    <div className="h-screen w-full flex bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] overflow-hidden font-sans">

      {/* Toggle de thème fixe en haut à droite */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle
          currentThemeId={themeId}
          onThemeChange={onThemeChange}
          size="md"
          className="shadow-lg"
        />
      </div>

      {/* Panneau gauche - Image représentative et Branding */}
      <div className="hidden lg:flex lg:w-[50%] relative overflow-hidden bg-[var(--theme-bg-secondary)] flex-col justify-between">

        {/* Image de fond avec Overlay Gradient pour lisibilité */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2070&auto=format&fit=crop"
            alt="Personne passant un entretien en ligne"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-secondary)] via-[var(--theme-bg-secondary)]/80 to-[var(--theme-bg-accent)]/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#09090b]/60" /> {/* Darkening for contrast */}
        </div>

        {/* Header - Logo */}
        <div className="relative z-10 p-12">
            <button
              onClick={onBackToLanding}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105 group"
            >
                <svg className="w-5 h-5 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <EvoluticsLogo className="h-12" />
                <span className="text-white font-bold text-sm uppercase tracking-wider">Retour</span>
            </button>
        </div>

        {/* Content - Hero Text & Features */}
        <div className="relative z-10 p-12 pb-48 mt-auto">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-5xl font-black text-white tracking-tight leading-[1.1]">
              Votre carrière commence ici. <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Propulsée par l'IA.</span>
            </h1>
            <p className="text-lg text-white/80 font-medium leading-relaxed max-w-lg">
              Ne cherchez plus vos offres au hasard. Préparez vos entretiens, optimisez votre CV et décrochez votre premier emploi avec notre Coach Carrière intelligent.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaire avec Glassmorphism */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Decorative background elements for form side */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[var(--theme-bg-accent)]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="min-h-full flex items-center justify-center p-3 sm:p-4 md:p-6 relative z-10">
          <div className="w-full max-w-[400px] space-y-5">

            {/* Logo mobile */}
            <div className="lg:hidden flex items-center justify-center mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
               <button
                 onClick={onBackToLanding}
                 className="flex items-center gap-2 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] shadow-sm px-4 py-2 rounded-2xl hover:bg-[var(--theme-bg-tertiary)] transition-all duration-300 hover:scale-105 group"
               >
                  <svg className="w-4 h-4 text-[var(--theme-text-secondary)] group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <EvoluticsLogo className="h-8" />
                  <span className="text-[var(--theme-text-secondary)] font-bold text-xs uppercase tracking-wider">Retour</span>
               </button>
            </div>

            <div className="space-y-1.5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                {mode === 'login' ? 'Bon retour parmi nous' : 'Créez votre compte'}
              </h2>
            </div>

            {/* Messages d'alerte */}
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 dark:text-red-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="space-y-3.5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)] ml-1">Nom complet</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-3 py-3 text-[13px] text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/15 focus:border-[var(--theme-bg-accent)] transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)] ml-1">Adresse email</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="etudiant@ecole.edu"
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-3 py-3 text-[13px] text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/15 focus:border-[var(--theme-bg-accent)] transition-all shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)] ml-1">Mot de passe</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-10 py-3 text-[13px] text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/15 focus:border-[var(--theme-bg-accent)] transition-all shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] transition-all focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[var(--theme-text-tertiary)] ml-1">Confirmer le mot de passe</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-3 py-3 text-[13px] text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/15 focus:border-[var(--theme-bg-accent)] transition-all shadow-sm"
                      required
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                  <div className="flex justify-end pb-1">
                      <button type="button" className="text-[11px] font-semibold text-[var(--theme-bg-accent)] hover:underline">Mot de passe oublié ?</button>
                  </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white font-bold py-3.5 rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] text-[14px] disabled:opacity-70 disabled:cursor-not-allowed mt-1 animate-fade-in-up" style={{ animationDelay: '0.4s' }}
              >
                {isLoading ? (
                  <EvoluticsLoader size="sm" variant="white" />
                ) : (
                  <>
                    {mode === 'login' ? 'Se connecter' : "Créer mon compte"}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="relative flex items-center py-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex-grow border-t border-[var(--theme-border-primary)]"></div>
              <span className="flex-shrink-0 mx-3 text-[10px] font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">
                Ou
              </span>
              <div className="flex-grow border-t border-[var(--theme-border-primary)]"></div>
            </div>

            {/* Google OAuth */}
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] font-semibold py-3 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-[14px] animate-fade-in-up" style={{ animationDelay: '0.6s' }}
            >
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continuer avec Google
            </button>

            {/* Switch mode */}
            <div className="text-center pt-3 mt-3 border-t border-[var(--theme-border-primary)]/50 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
              <span className="text-[13px] text-[var(--theme-text-secondary)] font-medium block mb-2">
                {mode === 'login' ? "Nouveau sur EVOLUTICS ? " : "Vous avez déjà un compte ? "}
              </span>
              <button
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login');
                  setError(null);
                  setSuccessMessage(null);
                  setAcceptedPrivacy(false);
                }}
                className="w-full bg-transparent border-2 border-[var(--theme-bg-accent)] text-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent)] hover:text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] text-[14px]"
              >
                {mode === 'login' ? "S'inscrire gratuitement" : 'Se connecter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Politiques de Confidentialité */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--theme-bg-secondary)] rounded-[2.5rem] shadow-2xl max-w-lg w-full border-2 border-[var(--theme-border-primary)] animate-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 pb-6 border-b border-[var(--theme-border-primary)]">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--theme-bg-accent)] to-[var(--theme-bg-accent-hover)] flex items-center justify-center shadow-lg flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black tracking-tight text-[var(--theme-text-primary)] mb-2">
                    Politiques de Confidentialité
                  </h3>
                  <p className="text-sm text-[var(--theme-text-secondary)] font-medium leading-relaxed">
                    Avant de continuer, veuillez accepter nos conditions
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-2xl p-6 space-y-4 max-h-[240px] overflow-y-auto custom-scrollbar">
                {[
                  'Vos données personnelles seront collectées et traitées de manière sécurisée',
                  'Nous utilisons vos informations uniquement pour améliorer votre expérience',
                  'Vos données ne seront jamais partagées avec des tiers sans votre consentement',
                  'Vous pouvez demander la suppression de vos données à tout moment'
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--theme-bg-accent)]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[var(--theme-bg-accent)]" />
                    </div>
                    <p className="text-sm text-[var(--theme-text-primary)] font-medium leading-relaxed">
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              <a 
                href="/privacy-policy" 
                target="_blank"
                className="flex items-center justify-center gap-2 text-sm text-[var(--theme-bg-accent)] hover:text-[var(--theme-bg-accent-hover)] font-bold uppercase tracking-widest transition-all group"
              >
                Lire les politiques complètes
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Footer */}
            <div className="p-8 pt-6 border-t border-[var(--theme-border-primary)] flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="flex-1 px-6 py-3.5 bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
              >
                Annuler
              </button>
              <button
                onClick={handleAcceptPrivacy}
                className="flex-1 px-6 py-3.5 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white rounded-xl font-black text-sm uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-[var(--theme-bg-accent)]/25"
              >
                Accepter et continuer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;
