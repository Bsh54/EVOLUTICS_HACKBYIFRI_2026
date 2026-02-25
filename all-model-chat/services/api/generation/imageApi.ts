import { logService } from "../../logService";

/**
 * La génération d'images n'est pas supportée via l'endpoint de chat completions standard.
 */
export const generateImagesApi = async (_apiKey: string, _modelId: string, _prompt: string, _aspectRatio: string, _imageSize: string | undefined, _abortSignal: AbortSignal): Promise<string[]> => {
    logService.warn("Génération d'images non supportée avec l'endpoint Cloudflare actuel.");
    throw new Error("La génération d'images n'est pas disponible avec cette configuration de modèle unique.");
};
