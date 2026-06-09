
import React, { useState, useEffect } from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ShadsAIHub from './components/layout/ShadsAIHub';
import { AddOpportunityForm } from './components/layout/AddOpportunityForm';
import AuthPage from './components/auth/AuthPage';
import { AdminLoginForm } from './components/auth/AdminLoginForm';
import OnboardingForm from './components/auth/OnboardingForm';
import LandingPage from './components/layout/LandingPage';
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage';
import { EvoluticsLoader } from './components/icons/EvoluticsLoader';
import { EvoluticsLogo } from './components/icons/EvoluticsLogo';
import './utils/diagnostics';
import { startKeepAlive, stopKeepAlive } from './services/supabaseKeepAlive';

// composant interne qui utilise les contextes Auth et AdminAuth
const AppContent: React.FC = () => {
  const {
    isLoading: isAuthLoading,
    isAuthenticated,
    needsOnboarding,
    profile,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  } = useAuth();

  const {
    isAdminAuthenticated,
    isLoading: isAdminLoading,
    logoutAdmin,
  } = useAdminAuth();

  // landing page par défaut pour les visiteurs
  const [showLanding, setShowLanding] = useState(() => {
    // Si une authentification est en cours (Google OAuth), ne pas afficher la landing
    const authInProgress = localStorage.getItem('auth_in_progress');
    return authInProgress !== 'true';
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // reset showLanding quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated) {
      setShowLanding(false);
      // Nettoyer le flag d'authentification en cours
      localStorage.removeItem('auth_in_progress');
    }
  }, [isAuthenticated]);

  // Vérifier si on revient d'une authentification Google
  useEffect(() => {
    const authInProgress = localStorage.getItem('auth_in_progress');
    if (authInProgress === 'true' && !isAuthLoading) {
      // On est de retour après Google OAuth, ne pas afficher la landing
      setShowLanding(false);
    }
  }, [isAuthLoading]);

  const handleTransitionToAuth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsTransitioning(false);
    }, 300);
  };

  const handleBackToLanding = () => {
    setShowLanding(true);
  };

  const logic = useAppLogic();
  const {
    currentTheme,
    sidePanelContent,
    handleCloseSidePanel,
    uiState,
    setAppSettings,
  } = logic;

  const { sidebarProps, chatAreaProps, appModalsProps } = useAppProps(logic);

  // changement de thème
  const handleThemeChange = (themeId: string) => {
    setAppSettings(prev => ({
      ...prev,
      themeId
    }));
  };

  // routage avec priorité admin
  const isAdmin = window.location.pathname === '/admin-portal';
  const isPrivacyPolicy = window.location.pathname === '/privacy-policy';

  // route privacy-policy
  if (isPrivacyPolicy) {
    return (
      <PrivacyPolicyPage 
        onBack={() => {
          window.location.href = '/';
        }}
      />
    );
  }

  // route admin
  if (isAdmin) {
    // loading admin
    if (isAdminLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] px-4">
          <div className="relative flex items-center justify-center">
            <img src="/assets/EVOLUTICS.png" alt="EVOLUTICS" className="h-24 w-auto sm:h-28 md:h-32 z-10 object-contain" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="evolutics-loader"
                style={{
                  width: 'clamp(150px, 40vw, 200px)',
                  height: 'clamp(150px, 40vw, 200px)',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'var(--theme-bg-accent)',
                  WebkitMask: `
                    repeating-conic-gradient(
                      transparent 0deg,
                      black 2deg 65deg,
                      transparent 66deg 90deg
                    ),
                    radial-gradient(
                      farthest-side,
                      transparent calc(100% - 12px - 1px),
                      black calc(100% - 12px)
                    )
                  `,
                  mask: `
                    repeating-conic-gradient(
                      transparent 0deg,
                      black 2deg 65deg,
                      transparent 66deg 90deg
                    ),
                    radial-gradient(
                      farthest-side,
                      transparent calc(100% - 12px - 1px),
                      black calc(100% - 12px)
                    )
                  `,
                  WebkitMaskComposite: 'destination-in',
                  maskComposite: 'intersect',
                  animation: 'evoluticsLoader 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          </div>
          <style>{`
            @keyframes evoluticsLoader {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      );
    }

    // Admin non authentifié : formulaire de connexion admin
    if (!isAdminAuthenticated) {
      return <AdminLoginForm onBackToLanding={handleBackToLanding} />;
    }

    // Admin authentifié : interface d'administration
    return (
      <div className={`relative flex h-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] theme-${currentTheme.id} overflow-hidden`}>
        <div className="w-full h-full bg-[var(--theme-bg-primary)]">
          <AddOpportunityForm
            onClose={() => {
              logoutAdmin();
              window.location.href = '/';
            }}
            onAdd={() => {
              window.dispatchEvent(new Event('storage'));
            }}
            themeId={currentTheme.id}
            onThemeChange={handleThemeChange}
          />
        </div>
      </div>
    );
  }
  // PRIORITÉ 3: Flux utilisateur normal - Écran de chargement initial
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] px-4">
        <div className="relative flex items-center justify-center">
          {/* Logo au centre - responsive */}
          <img src="/assets/EVOLUTICS.png" alt="EVOLUTICS" className="h-24 w-auto sm:h-28 md:h-32 z-10 object-contain" />

          {/* Loader stylé avec CSS mask - responsive */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="evolutics-loader"
              style={{
                width: 'clamp(150px, 40vw, 200px)',
                height: 'clamp(150px, 40vw, 200px)',
                aspectRatio: '1',
                borderRadius: '50%',
                background: 'var(--theme-bg-accent)',
                WebkitMask: `
                  repeating-conic-gradient(
                    transparent 0deg,
                    black 2deg 65deg,
                    transparent 66deg 90deg
                  ),
                  radial-gradient(
                    farthest-side,
                    transparent calc(100% - 12px - 1px),
                    black calc(100% - 12px)
                  )
                `,
                mask: `
                  repeating-conic-gradient(
                    transparent 0deg,
                    black 2deg 65deg,
                    transparent 66deg 90deg
                  ),
                  radial-gradient(
                    farthest-side,
                    transparent calc(100% - 12px - 1px),
                    black calc(100% - 12px)
                  )
                `,
                WebkitMaskComposite: 'destination-in',
                maskComposite: 'intersect',
                animation: 'evoluticsLoader 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
              }}
            />
          </div>

          {/* Effet de glow subtil - responsive */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full opacity-20 blur-xl"
              style={{
                width: 'clamp(120px, 35vw, 180px)',
                height: 'clamp(120px, 35vw, 180px)',
                background: `radial-gradient(circle, var(--theme-bg-accent) 0%, transparent 70%)`,
                animation: 'evoluticsGlow 3s ease-in-out infinite alternate'
              }}
            />
          </div>
        </div>

        {/* Styles CSS intégrés */}
        <style>{`
          @keyframes evoluticsLoader {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes evoluticsGlow {
            0% {
              opacity: 0.1;
              transform: scale(0.95);
            }
            100% {
              opacity: 0.3;
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    );
  }

  // Visiteur non connecté : Landing Page ou AuthPage
  if (!isAuthenticated) {
    // Retour d'un OAuth Google : Supabase n'a pas encore résolu la session
    // → on affiche l'écran de chargement au lieu de l'AuthPage
    const oauthInProgress = localStorage.getItem('auth_in_progress') === 'true';
    const hasOauthParams = window.location.hash.includes('access_token') || window.location.search.includes('code=');
    if (oauthInProgress || hasOauthParams) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] px-4">
          <div className="relative flex items-center justify-center">
            <img src="/assets/EVOLUTICS.png" alt="EVOLUTICS" className="h-24 w-auto sm:h-28 md:h-32 z-10 object-contain" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="evolutics-loader"
                style={{
                  width: 'clamp(150px, 40vw, 200px)',
                  height: 'clamp(150px, 40vw, 200px)',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  background: 'var(--theme-bg-accent)',
                  WebkitMask: `repeating-conic-gradient(transparent 0deg,black 2deg 65deg,transparent 66deg 90deg),radial-gradient(farthest-side,transparent calc(100% - 12px - 1px),black calc(100% - 12px))`,
                  mask: `repeating-conic-gradient(transparent 0deg,black 2deg 65deg,transparent 66deg 90deg),radial-gradient(farthest-side,transparent calc(100% - 12px - 1px),black calc(100% - 12px))`,
                  WebkitMaskComposite: 'destination-in',
                  maskComposite: 'intersect',
                  animation: 'evoluticsLoader 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite'
                }}
              />
            </div>
          </div>
          <style>{`@keyframes evoluticsLoader { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    if (showLanding) {
      return (
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <LandingPage
            onGetStarted={handleTransitionToAuth}
            onSignIn={handleTransitionToAuth}
            themeId={currentTheme.id}
            onThemeChange={handleThemeChange}
          />
        </div>
      );
    }
    return (
      <div className="animate-fade-in-smooth">
        <AuthPage
          onAuthSuccess={() => {
            // Après authentification réussie, masquer immédiatement la landing page
            setShowLanding(false);
            // Le contexte Auth va automatiquement détecter needsOnboarding
          }}
          onBackToLanding={handleBackToLanding}
          signIn={signIn}
          signUp={signUp}
          signInWithGoogle={signInWithGoogle}
          themeId={currentTheme.id}
          onThemeChange={handleThemeChange}
        />
        <style>{`
          @keyframes fade-in-smooth {
            0% {
              opacity: 0;
              transform: translateY(20px) scale(0.98);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-fade-in-smooth {
            animation: fade-in-smooth 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </div>
    );
  }

  // Formulaire d'onboarding (première connexion)
  if (needsOnboarding && profile) {
    return (
      <OnboardingForm
        profile={profile}
        onComplete={async (updates) => {
          await updateProfile(updates);
        }}
        themeId={currentTheme.id}
        onThemeChange={handleThemeChange}
      />
    );
  }

  return (
    <div className={`relative flex h-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] theme-${currentTheme.id} overflow-hidden`}>
      {isAdmin ? (
        <div className="w-full h-full bg-[var(--theme-bg-primary)]">
          <AddOpportunityForm
            onClose={() => window.location.href = '/'}
            onAdd={() => {
              window.dispatchEvent(new Event('storage'));
            }}
            themeId={currentTheme.id}
            onThemeChange={handleThemeChange}
          />
        </div>
      ) : (
        <ShadsAIHub
          sidebarProps={sidebarProps}
          chatAreaProps={chatAreaProps}
          appModalsProps={appModalsProps}
          isHistorySidebarOpen={uiState.isHistorySidebarOpen}
          setIsHistorySidebarOpen={uiState.setIsHistorySidebarOpen}
          sidePanelContent={sidePanelContent}
          onCloseSidePanel={handleCloseSidePanel}
          themeId={currentTheme.id}
          onThemeChange={handleThemeChange}
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  useEffect(() => {
    startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  return (
    <WindowProvider>
      <LanguageProvider>
        <AdminAuthProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </AdminAuthProvider>
      </LanguageProvider>
    </WindowProvider>
  );
};

export default App;