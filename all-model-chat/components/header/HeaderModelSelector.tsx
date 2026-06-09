
import React, { useMemo } from 'react';
import { Zap } from 'lucide-react';
import { ModelOption } from '../../types';
import { GoogleSpinner } from '../icons/GoogleSpinner';
import { ModelPicker } from '../shared/ModelPicker';
import { isGemini3Model } from '../../utils/appUtils';

interface HeaderModelSelectorProps {
  currentModelName?: string;
  availableModels: ModelOption[];
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  isSwitchingModel: boolean;
  isLoading: boolean;
  t: (key: string) => string;
  thinkingLevel?: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH';
  onSetThinkingLevel: (level: 'MINIMAL' | 'LOW' | 'MEDIUM' | 'HIGH') => void;
}

export const HeaderModelSelector: React.FC<HeaderModelSelectorProps> = ({
  currentModelName,
  availableModels,
  selectedModelId,
  onSelectModel,
  isSwitchingModel,
  isLoading,
  t,
  thinkingLevel,
  onSetThinkingLevel,
}) => {
  const displayModelName = currentModelName;

  const abbreviatedModelName = useMemo(() => {
    if (!displayModelName) return '';
    if (displayModelName === t('loading')) return displayModelName;
    
    let name = displayModelName;
    name = name.replace(/^Gemini\s+/i, '');
    name = name.replace(/\s+Preview/i, '');
    name = name.replace(/\s+Latest/i, '');
    
    return name;
  }, [displayModelName, t]);

  const isSelectorDisabled = availableModels.length === 0 || isLoading || isSwitchingModel;
  
  // Check for Gemini 3 models (ignoring case) but exclude image models
  const isGemini3 = isGemini3Model(selectedModelId) && !selectedModelId.toLowerCase().includes('image');

  // Determine the target "Fast" level based on model capabilities
  // Gemini 3 Flash models support MINIMAL thinking for maximum speed
  // Other Gemini 3 models (like Pro) typically bottom out at LOW
  const isFlash = selectedModelId.toLowerCase().includes('flash');
  const targetFastLevel = isFlash ? 'MINIMAL' : 'LOW';
  
  // Consider it "Fast Mode" active if the current level matches the target fast level
  const isFastState = thinkingLevel === targetFastLevel;

  return (
    <div className="relative flex items-center gap-1">
        <div
            className="h-10 flex items-center gap-2 rounded-xl px-2 sm:px-3 bg-transparent text-[var(--theme-text-primary)] font-medium text-base border border-transparent"
        >
            <span className="truncate max-w-[200px] sm:max-w-[240px]">{abbreviatedModelName}</span>
        </div>
    </div>
  );
};
