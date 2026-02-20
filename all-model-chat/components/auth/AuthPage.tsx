import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';

interface AuthPageProps {
  onAuthSuccess: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess, signIn, signUp, signInWithGoogle }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      // Gestion propre des erreurs pour l'utilisateur
      const msg = err?.message || 'Une erreur est survenue.';

      // Erreurs connues et reformulées
      if (msg.includes('Invalid login') || msg.includes('Invalid credentials')) {
        setError('Email ou mot de passe incorrect.');
      } else if (msg.includes('User already registered')) {
        setError('Un compte avec cet email existe déjà. Connectez-vous.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Veuillez confirmer votre email avant de vous connecter.');
      } else if (msg.includes('Too many requests') || msg.includes('rate limit')) {
        setError('Trop de tentatives. Veuillez patienter quelques minutes.');
      } else if (msg.includes('Password should be')) {
        setError('Le mot de passe est trop faible (min 6 caractères).');
      } else {
        // Erreur générique pour tout le reste (problème serveur, config, etc.)
        // On ne montre JAMAIS l'erreur technique brute à l'utilisateur
        console.error('Erreur technique:', msg); // Log pour le débug
        setError('Impossible de se connecter. Veuillez réessayer plus tard.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message || 'Erreur de connexion Google.');
    }
  };

  return (
    <div className="h-screen w-full flex bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] overflow-hidden">
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[var(--theme-bg-accent)] via-[var(--theme-bg-accent-hover)] to-[var(--theme-bg-secondary)]">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-white/15 blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-16 space-y-10">
          <div className="flex items-center gap-4">
            <EvoluticsLogo className="h-10" />
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
              Votre carrière<br />commence ici.
            </h1>
            <p className="text-lg text-white/70 font-medium max-w-md leading-relaxed">
              Explorez les meilleures opportunités, préparez vos candidatures avec l'IA et décrochez le poste de vos rêves.
            </p>
          </div>
          <div className="flex gap-6 pt-4">
            {[
              { number: '500+', label: 'Opportunités' },
              { number: 'IA', label: 'Coach Carrière' },
              { number: '24/7', label: 'Disponible' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white">{stat.number}</div>
                <div className="text-xs text-white/50 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8 py-8">
          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-3 justify-center mb-4">
            <EvoluticsLogo className="h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-black tracking-tight">
              {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
            </h2>
            <p className="text-[var(--theme-text-secondary)] font-medium">
              {mode === 'login'
                ? 'Connectez-vous pour accéder à vos opportunités.'
                : 'Rejoignez EVOLUTICS et boostez votre carrière.'}
            </p>
          </div>

          {/* Messages */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-sm font-medium">
              <CheckCircle className="w-5 h-5 shrink-0" />
              {successMessage}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Nom complet</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Adresse email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-12 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--theme-text-tertiary)]">Confirmer le mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-11 pr-4 py-3.5 text-sm text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 focus:border-[var(--theme-bg-accent)] transition-all"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 group active:scale-[0.98] text-sm uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {mode === 'login' ? 'SE CONNECTER' : "S'INSCRIRE"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--theme-border-primary)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[var(--theme-bg-primary)] px-4 text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">ou</span>
            </div>
          </div>

          {/* Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] font-bold py-3.5 rounded-2xl transition-all flex items-center justify-center gap-3 active:scale-[0.98] text-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>

          {/* Switch mode */}
          <div className="text-center pt-2">
            <span className="text-sm text-[var(--theme-text-secondary)]">
              {mode === 'login' ? "Pas encore de compte ? " : "Déjà inscrit ? "}
            </span>
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError(null);
                setSuccessMessage(null);
              }}
              className="text-sm font-black text-[var(--theme-bg-accent)] hover:underline uppercase"
            >
              {mode === 'login' ? "S'inscrire" : 'Se connecter'}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
