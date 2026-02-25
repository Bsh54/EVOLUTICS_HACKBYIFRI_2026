
import { useMemo } from 'react';
import { isGemini3Model } from '../utils/appUtils';

export const useModelCapabilities = (modelId: string) => {
    return useMemo(() => {
        return {
            isImagenModel: false,
            isGemini3ImageModel: false,
            isGemini3: false, // On le traite comme un modèle 2.5 standard pour la compatibilité
            isTtsModel: false,
            isNativeAudioModel: false,
            supportedAspectRatios: undefined,
            supportedImageSizes: undefined
        };
    }, [modelId]);
};
