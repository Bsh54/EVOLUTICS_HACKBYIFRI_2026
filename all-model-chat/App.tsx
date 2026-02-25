
import React, { useState, useEffect } from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ShadsAIHub from './components/layout/ShadsAIHub';
import { AddOpportunityForm } from './components/layout/AddOpportunityForm';
import AuthPage from './components/auth/AuthPage';
import OnboardingForm from './components/auth/OnboardingForm';
import LandingPage from './components/layout/LandingPage';
import { EvoluticsLoader } from './components/icons/EvoluticsLoader';
import { EvoluticsLogo } from './components/icons/EvoluticsLogo';

// Composant interne qui utilise le contexte Auth
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

  // Landing page s'affiche par défaut pour les visiteurs non connectés
  const [showLanding, setShowLanding] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Réinitialiser showLanding quand l'utilisateur se connecte
  useEffect(() => {
    if (isAuthenticated) {
      setShowLanding(false);
    }
  }, [isAuthenticated]);

  const handleTransitionToAuth = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowLanding(false);
      setIsTransitioning(false);
    }, 300);
  };

  const logic = useAppLogic();
  const {
    currentTheme,
    sidePanelContent,
    handleCloseSidePanel,
    uiState,
  } = logic;

  const { sidebarProps, chatAreaProps, appModalsProps } = useAppProps(logic);

  // Système de routage simple pour l'admin
  const isAdmin = window.location.pathname === '/admin-portal';

  // Écran de chargement initial
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] px-4">
        <div className="relative flex items-center justify-center">
          {/* Logo au centre - responsive */}
          <EvoluticsLogo className="h-24 w-auto sm:h-28 md:h-32 z-10" />

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
        <style jsx>{`
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
    if (showLanding) {
      return (
        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
          <LandingPage
            onGetStarted={handleTransitionToAuth}
            onSignIn={handleTransitionToAuth}
          />
        </div>
      );
    }
    return (
      <div className="animate-fade-in-smooth">
        <AuthPage
          onAuthSuccess={() => {
            // Après authentification réussie, forcer la réévaluation de l'état
            // Le contexte Auth va automatiquement détecter needsOnboarding
          }}
          signIn={signIn}
          signUp={signUp}
          signInWithGoogle={signInWithGoogle}
        />
        <style jsx>{`
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
          currentTheme={currentTheme}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WindowProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </WindowProvider>
  );
};

export default App;