import React, { useState } from 'react';
import { ModelOption } from '../../../types';
import { ModelSelectorHeader } from './model-selector/ModelSelectorHeader';
import { ModelListEditor } from './model-selector/ModelListEditor';
import { ModelListView } from './model-selector/ModelListView';

interface ModelSelectorProps {
  availableModels: ModelOption[];
  selectedModelId: string;
  onSelectModel: (id: string) => void;
  t: (key: string) => string;
  setAvailableModels: (models: ModelOption[]) => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
}) => {
  return (
    <div className="p-3 rounded-xl bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-secondary)]">
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--theme-text-primary)]">
                Modèle Actif
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-[var(--theme-bg-primary)] text-[var(--theme-text-link)] font-mono">
                {selectedModelId}
            </span>
        </div>
    </div>
  );
};