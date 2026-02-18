
import React from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ShadsAIHub from './components/layout/ShadsAIHub';
import { AddOpportunityForm } from './components/layout/AddOpportunityForm';
import AuthPage from './components/auth/AuthPage';
import OnboardingForm from './components/auth/OnboardingForm';
import { Loader2, Sparkles } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center h-full w-full bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] gap-4">
        <div className="w-14 h-14 bg-[var(--theme-bg-accent)] rounded-2xl flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-[var(--theme-text-accent)]" />
        </div>
        <Loader2 className="w-6 h-6 animate-spin text-[var(--theme-bg-accent)]" />
        <span className="text-sm font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">Chargement...</span>
      </div>
    );
  }

  // Page de connexion / inscription
  if (!isAuthenticated) {
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