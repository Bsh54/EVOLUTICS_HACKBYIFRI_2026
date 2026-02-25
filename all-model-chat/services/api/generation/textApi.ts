import { logService } from "../../logService";

const API_URL = "https://shadsai1api.shadobsh.workers.dev/v1/chat/completions";
const API_KEY = "sk-dummy";
const MODEL_ID = "gemini-2.5-flash";

export const translateTextApi = async (_apiKey: string, text: string, targetLanguage: string = 'English'): Promise<string> => {
    logService.info(`Translating text to ${targetLanguage} via Cloudflare...`);
    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, without any additional explanation or formatting.\n\nText to translate:\n"""\n${text}\n"""`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
            })
        });

        const json = await response.json();
        return json.choices?.[0]?.message?.content?.trim() || "";
    } catch (error) {
        logService.error("Error during text translation:", error);
        throw error;
    }
};

export const generateSuggestionsApi = async (_apiKey: string, userContent: string, modelContent: string, language: 'en' | 'zh'): Promise<string[]> => {
    logService.info(`Generating suggestions in ${language} via Cloudflare...`);

    const prompt = language === 'zh'
        ? `作为对话专家，请基于以下上下文，预测用户接下来最可能发送的 3 条简短回复。返回 JSON 格式: {"suggestions": ["回复1", "回复2", "回复3"]}
对话上下文：
用户: "${userContent}"
助手: "${modelContent}"`
        : `As a conversation expert, predict the 3 most likely short follow-up messages the USER would send based on the context below. Return JSON format: {"suggestions": ["reply 1", "reply 2", "reply 3"]}
Context:
USER: "${userContent}"
ASSISTANT: "${modelContent}"`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: "json_object" },
                temperature: 0.7,
            })
        });

        const json = await response.json();
        const content = json.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);
        return parsed.suggestions || [];
    } catch (error) {
        logService.error("Error during suggestions generation:", error);
        return [];
    }
};

export const generateTitleApi = async (_apiKey: string, userContent: string, modelContent: string, language: 'en' | 'zh'): Promise<string> => {
    logService.info(`Generating title in ${language} via Cloudflare...`);
    const prompt = language === 'zh'
        ? `根据以下对话，创建一个非常简短、简洁的标题（最多4-6个词）。不要使用引号。只返回标题文本。\n\n用户: "${userContent}"\n助手: "${modelContent}"`
        : `Based on this conversation, create a very short, concise title (4-6 words max). Do not use quotes. Just return the text of the title.\n\nUSER: "${userContent}"\nASSISTANT: "${modelContent}"`;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: MODEL_ID,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
            })
        });

        const json = await response.json();
        let title = json.choices?.[0]?.message?.content?.trim() || "Nouveau Chat";
        return title.replace(/['"]/g, '');
    } catch (error) {
        logService.error("Error during title generation:", error);
        return "Nouveau Chat";
    }
};
