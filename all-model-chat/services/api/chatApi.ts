import { Part, UsageMetadata, ChatHistoryItem } from "@google/genai";
import { logService } from "../logService";

/**
 * Convertit l'historique Gemini au format OpenAI (avec support multimodal)
 */
const convertToOpenAIHistory = (history: ChatHistoryItem[], currentParts: Part[]) => {
    const mapParts = (parts: Part[]) => {
        if (parts.length === 1 && parts[0].text) {
            return parts[0].text;
        }

        return parts.map(p => {
            if (p.text) return { type: "text", text: p.text };
            if (p.inlineData) {
                return {
                    type: "image_url",
                    image_url: {
                        url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}`
                    }
                };
            }
            return null;
        }).filter(Boolean);
    };

    const messages = history.map(item => ({
        role: item.role === 'model' ? 'assistant' : 'user',
        content: mapParts(item.parts)
    }));

    messages.push({
        role: 'user',
        content: mapParts(currentParts)
    });

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
    const API_URL = "https://shadsai1api.shadobsh.workers.dev/v1/chat/completions";
    const API_KEY = "sk-dummy";

    logService.info(`Sending message via OpenAI format to Cloudflare for ${modelId}`);

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: convertToOpenAIHistory(history, parts),
                stream: true,
                temperature: config.temperature || 0.7,
                top_p: config.topP || 0.95,
            }),
            signal: abortSignal
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        if (!reader) throw new Error("No reader available");

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const cleanLine = line.replace(/^data: /, '').trim();
                if (!cleanLine || cleanLine === '[DONE]') continue;

                try {
                    const json = JSON.parse(cleanLine);
                    const content = json.choices?.[0]?.delta?.content;
                    const reasoning = json.choices?.[0]?.delta?.reasoning_content;

                    if (reasoning) {
                        onThoughtChunk(reasoning);
                    }
                    if (content) {
                        onPart({ text: content });
                    }
                } catch (e) {
                    // Ignorer les erreurs de parsing sur les fragments
                }
            }
        }
    } catch (error) {
        logService.error("Error in OpenAI stream:", error);
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
    const API_URL = "https://shadsai1api.shadobsh.workers.dev/v1/chat/completions";
    const API_KEY = "sk-dummy";

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: modelId,
                messages: convertToOpenAIHistory(history, parts),
                stream: false,
                temperature: config.temperature || 0.7,
                top_p: config.topP || 0.95,
            }),
            signal: abortSignal
        });

        const json = await response.json();
        const content = json.choices?.[0]?.message?.content || "";
        const reasoning = json.choices?.[0]?.message?.reasoning_content || "";

        onComplete([{ text: content } as Part], reasoning);
    } catch (error) {
        onError(error as Error);
    }
};
