import { File as GeminiFile } from "@google/genai";
import { logService } from "../logService";

/**
 * Votre point d'accès Cloudflare ne supporte pas l'API de fichiers persistants de Google.
 * Nous désactivons l'upload distant. Les fichiers seront envoyés en ligne (base64) lors du chat.
 */
export const uploadFileApi = async (
    _apiKey: string,
    file: File,
    _mimeType: string,
    displayName: string,
    _signal: AbortSignal,
    onProgress?: (loaded: number, total: number) => void
): Promise<GeminiFile> => {
    logService.info(`Simulation d'upload pour: ${displayName}`);

    if (onProgress) {
        onProgress(file.size, file.size);
    }

    // On renvoie un objet factice qui sera géré par l'application comme un fichier local
    return {
        name: `files/local-${Date.now()}`,
        displayName: displayName,
        mimeType: file.type,
        sizeBytes: file.size.toString(),
        uri: "local://", // Indicateur pour le reste de l'app
    } as GeminiFile;
};

export const getFileMetadataApi = async (_apiKey: string, _fileApiName: string): Promise<GeminiFile | null> => {
    return null;
};
