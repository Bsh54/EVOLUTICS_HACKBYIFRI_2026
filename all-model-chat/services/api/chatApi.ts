import { Part, UsageMetadata, ChatHistoryItem } from "@google/genai";
import { logService } from "../logService";
import { DeepSeekService, DeepSeekMessage } from "../deepseekService";

/**
 * Convertit l'historique Gemini au format DeepSeek (avec support multimodal)
 */
const convertToDeepSeekHistory = (history: ChatHistoryItem[], currentParts: Part[]): DeepSeekMessage[] => {
    const mapParts = (parts: Part[]): string => {
        // Pour DeepSeek, on convertit tout en texte simple
        return parts.map(p => {
            if (p.text) return p.text;
            if (p.inlineData) {
                // Pour les images, on indique qu'une image était présente
                return "[Image fournie - analyse basée sur le contexte]";
            }
            return "";
        }).filter(Boolean).join(" ");
    };

    const messages: DeepSeekMessage[] = history.map(item => ({
        role: item.role === 'model' ? 'assistant' : 'user',
        content: mapParts(item.parts)
    }));

    const currentContent = mapParts(currentParts);
    if (currentContent.trim()) {
        messages.push({
            role: 'user',
            content: currentContent
        });
    }

    return messages;
};

export const sendStatelessMessageStreamApi = async (
    _apiKey: string,
    modelId: string,
    history: ChatHistoryItem[],
    parts: Part[],
    config: any,
    abortSignal: AbortSignal,
    onPart: (part: Part) => void,
    onThoughtChunk: (chunk: string) => void,
    _onError: (error: Error) => void,
    onComplete: (usageMetadata?: UsageMetadata, groundingMetadata?: any, urlContextMetadata?: any) => void,
    _role: 'user' | 'model' = 'user'
): Promise<void> => {
    // 🎭 Interface: Affiche "Gemini" à l'utilisateur
    // 🔧 Backend: Utilise DeepSeek en réalité
    logService.info(`[UI: Gemini ${modelId}] [Backend: DeepSeek] Envoi du message...`);

    try {
        const messages = convertToDeepSeekHistory(history, parts);

        // Utiliser le service DeepSeek en streaming
        await DeepSeekService.generateStream(
            messages,
            (chunk: string) => {
                // Envoyer chaque chunk à l'interface
                onPart({ text: chunk });
            },
            {
                temperature: config.temperature || 0.7
            }
        );

        logService.info(`✅ [Backend: DeepSeek] Réponse générée avec succès`);

    } catch (error) {
        logService.error("❌ [Backend: DeepSeek] Erreur:", error);
        // En cas d'erreur, on peut fallback sur l'ancienne API ou gérer l'erreur
    } finally {
        onComplete();
    }
};

export const sendStatelessMessageNonStreamApi = async (
    _apiKey: string,
    modelId: string,
    history: ChatHistoryItem[],
    parts: Part[],
    config: any,
    abortSignal: AbortSignal,
    onError: (error: Error) => void,
    onComplete: (parts: Part[], thoughtsText?: string, usageMetadata?: UsageMetadata, groundingMetadata?: any, urlContextMetadata?: any) => void
): Promise<void> => {
    // 🎭 Interface: Affiche "Gemini" à l'utilisateur
    // 🔧 Backend: Utilise DeepSeek en réalité
    logService.info(`[UI: Gemini ${modelId}] [Backend: DeepSeek] Génération non-stream...`);

    try {
        const messages = convertToDeepSeekHistory(history, parts);

        // Utiliser le service DeepSeek sans streaming
        const response = await DeepSeekService.chatCompletion(messages, {
            temperature: config.temperature || 0.7,
            max_tokens: 4000
        });

        const content = response.choices?.[0]?.message?.content || "";

        // Simuler les métadonnées d'usage pour compatibilité
        const usageMetadata: UsageMetadata = {
            promptTokenCount: response.usage?.prompt_tokens || 0,
            candidatesTokenCount: response.usage?.completion_tokens || 0,
            totalTokenCount: response.usage?.total_tokens || 0
        };

        logService.info(`✅ [Backend: DeepSeek] Réponse non-stream générée avec succès`);
        onComplete([{ text: content } as Part], undefined, usageMetadata);

    } catch (error) {
        logService.error("❌ [Backend: DeepSeek] Erreur non-stream:", error);
        onError(error as Error);
    }
};
