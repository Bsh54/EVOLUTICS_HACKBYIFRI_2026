
import { useState, useCallback } from 'react';
import { ModelOption } from '../../types';
import { sortModels, getDefaultModelOptions } from '../../utils/appUtils';

const CUSTOM_MODELS_KEY = 'custom_model_list_v1';

export const useModels = () => {
    // Force l'utilisation des modèles par défaut (Gemini 2.5 Flash uniquement)
    // On ignore le localStorage pour garantir le verrouillage sur le modèle ShadsAI
    const [apiModels, setApiModelsState] = useState<ModelOption[]>(() => {
        return getDefaultModelOptions();
    });

    const setApiModels = useCallback((models: ModelOption[]) => {
        // Désactivé : on ne permet plus de modifier la liste des modèles
        logService.debug("setApiModels ignoré en mode modèle unique.");
    }, []);

    // Currently loading is instantaneous for local storage, but structure prepared for API fetch
    const isModelsLoading = false;
    const modelsLoadingError = null;

    return { apiModels, setApiModels, isModelsLoading, modelsLoadingError };
};
