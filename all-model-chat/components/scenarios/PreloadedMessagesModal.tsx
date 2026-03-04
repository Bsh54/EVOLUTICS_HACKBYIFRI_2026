import React from 'react';
import { Modal } from '../shared/Modal';
import { SavedScenario } from '../../types';
import { translations } from '../../utils/appUtils';

interface PreloadedMessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedScenarios: SavedScenario[];
  onSaveAllScenarios: (scenarios: SavedScenario[]) => void;
  onLoadScenario: (scenario: SavedScenario) => void;
  t: (key: keyof typeof translations, fallback?: string) => string;
}

export const PreloadedMessagesModal: React.FC<PreloadedMessagesModalProps> = ({
  isOpen,
  onClose,
  savedScenarios,
  onLoadScenario,
  t,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-[var(--theme-text-primary)]">
          {t('scenarios', 'Scenarios')}
        </h2>
        
        {savedScenarios.length === 0 ? (
          <p className="text-[var(--theme-text-secondary)] text-center py-8">
            No scenarios available
          </p>
        ) : (
          <div className="space-y-2">
            {savedScenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => {
                  onLoadScenario(scenario);
                  onClose();
                }}
                className="w-full text-left p-4 rounded-lg border border-[var(--theme-border-secondary)] hover:border-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-tertiary)] transition-all"
              >
                <div className="font-medium text-[var(--theme-text-primary)]">
                  {scenario.name}
                </div>
                {scenario.description && (
                  <div className="text-sm text-[var(--theme-text-secondary)] mt-1">
                    {scenario.description}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
