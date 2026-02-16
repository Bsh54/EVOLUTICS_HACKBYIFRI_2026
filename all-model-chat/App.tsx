
import React from 'react';
import { useAppLogic } from './hooks/app/useAppLogic';
import { useAppProps } from './hooks/app/useAppProps';
import { WindowProvider } from './contexts/WindowContext';
import ShadsAIHub from './components/layout/ShadsAIHub';
import { AddOpportunityForm } from './components/layout/AddOpportunityForm';

const App: React.FC = () => {
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

  return (
    <WindowProvider>
      <div className={`relative flex h-full bg-[var(--theme-bg-secondary)] text-[var(--theme-text-primary)] theme-${currentTheme.id} overflow-hidden`}>
        {isAdmin ? (
          <div className="w-full h-full bg-[var(--theme-bg-primary)]">
            <AddOpportunityForm
              onClose={() => window.location.href = '/'}
              onAdd={() => {
                // On déclenche manuellement l'événement pour forcer la mise à jour sans recharger la page
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
    </WindowProvider>
  );
};

export default App;