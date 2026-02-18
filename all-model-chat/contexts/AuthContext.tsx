import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import { UserProfile } from '../types/user';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Timeout helper : résout avec null après X ms si la promesse ne répond pas
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const needsOnboarding = isAuthenticated && profile !== null && !profile.onboarding_completed;

  // Charger le profil (avec timeout de sécurité)
  const loadProfile = async (authUser: any) => {
    if (!authUser) {
      setProfile(null);
      return;
    }

    try {
      const userProfile = await withTimeout(
        authService.ensureProfile(authUser),
        5000, // 5 secondes max
        null
      );
      setProfile(userProfile);
    } catch (error) {
      console.error('Erreur chargement profil:', error);
      setProfile(null);
    }
  };

  // Initialisation : vérifier la session existante
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const session = await withTimeout(
          authService.getSession(),
          5000,
          null
        );

        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        }
      } catch (error) {
        console.error('Erreur initialisation auth:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initAuth();

    // Écouter les changements d'état d'auth
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
          setIsLoading(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          setUser(session.user);
        }
      }
    );

    // Sécurité absolue : forcer la fin du loading après 8 secondes
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setIsLoading(false);
      }
    }, 8000);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { user: authUser } = await authService.signIn(email, password);
    setUser(authUser);
    await loadProfile(authUser);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { user: authUser } = await authService.signUp(email, password, displayName);
    if (authUser) {
      setUser(authUser);
      await loadProfile(authUser);
    }
  };

  const signInWithGoogle = async () => {
    await authService.signInWithGoogle();
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setProfile(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updatedProfile = await authService.updateProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
      } else {
        const freshProfile = await authService.getProfile(user.id);
        if (freshProfile) setProfile(freshProfile);
      }
    } catch (err) {
      console.error('Erreur updateProfile:', err);
      throw err;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile(user);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated,
    needsOnboarding,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
