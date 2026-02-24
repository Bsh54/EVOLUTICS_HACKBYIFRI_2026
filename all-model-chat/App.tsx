
import React, { useState } from 'react';
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
      <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)]">
        <div className="relative animate-pulse flex flex-col items-center gap-4">
            <EvoluticsLogo className="h-12 w-12" />
        </div>
      </div>
    );
  }

  // Visiteur non connecté : Landing Page ou AuthPage
  if (!isAuthenticated) {
    if (showLanding) {
      return (
        <LandingPage
          onGetStarted={() => setShowLanding(false)}
          onSignIn={() => setShowLanding(false)}
        />
      );
    }
    return (
      <AuthPage
        onAuthSuccess={() => {}}
        signIn={signIn}
        signUp={signUp}
        signInWithGoogle={signInWithGoogle}
      />
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