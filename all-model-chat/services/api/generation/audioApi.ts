import { logService } from "../../logService";

/**
 * La génération de parole (TTS) n'est pas supportée via l'endpoint de chat completions standard.
 */
export const generateSpeechApi = async (_apiKey: string, _modelId: string, _text: string, _voice: string, _abortSignal: AbortSignal): Promise<string> => {
    logService.warn("TTS non supporté avec l'endpoint Cloudflare actuel.");
    throw new Error("La génération de voix n'est pas disponible avec cette configuration de modèle unique.");
};

/**
 * La transcription peut fonctionner si votre Worker supporte le multimodal au format OpenAI.
 * Pour l'instant, nous renvoyons une erreur pour éviter les crashs SDK.
 */
export const transcribeAudioApi = async (_apiKey: string, _audioFile: File, _modelId: string): Promise<string> => {
    logService.warn("Transcription audio non supportée via l'endpoint de chat completions.");
    throw new Error("La transcription audio n'est pas disponible avec cette configuration.");
};
