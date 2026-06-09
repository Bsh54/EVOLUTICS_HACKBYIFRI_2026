import { logService } from "../../logService";
import { DeepSeekService } from "../../deepseekService";

const API_URL = "https://shadsai1api.shadobsh.workers.dev/v1/chat/completions";
const API_KEY = "sk-dummy";
const MODEL_ID = "gemini-2.5-flash";

export const translateTextApi = async (_apiKey: string, text: string, targetLanguage: string = 'English'): Promise<string> => {
    // 🎭 Interface: Utilise "Gemini" dans les logs pour l'utilisateur
    // 🔧 Backend: DeepSeek traite la traduction
    logService.info(`[UI: Gemini] [Backend: DeepSeek] Traduction vers ${targetLanguage}...`);

    const prompt = `Translate the following text to ${targetLanguage}. Only return the translated text, without any additional explanation or formatting.\n\nText to translate:\n"""\n${text}\n"""`;

    try {
        const result = await DeepSeekService.generateText(prompt);
        logService.info(`✅ [Backend: DeepSeek] Traduction terminée`);
        return result.trim();
    } catch (error) {
        logService.error("❌ [Backend: DeepSeek] Erreur traduction:", error);
        throw error;
    }
};

export const generateSuggestionsApi = async (_apiKey: string, userContent: string, modelContent: string, language: 'en' | 'zh'): Promise<string[]> => {
    // 🎭 Interface: Utilise "Gemini" dans les logs pour l'utilisateur
    // 🔧 Backend: DeepSeek génère les suggestions
    logService.info(`[UI: Gemini] [Backend: DeepSeek] Génération suggestions ${language}...`);

    const prompt = language === 'zh'
        ? `En tant qu'expert en conversation, prédisez les 3 réponses courtes les plus probables que l'utilisateur enverra ensuite en fonction du contexte suivant. Retournez au format JSON : {"suggestions": ["réponse1", "réponse2", "réponse3"]}
Contexte de la conversation :
Utilisateur : "${userContent}"
Assistant : "${modelContent}"`
        : `As a conversation expert, predict the 3 most likely short follow-up messages the USER would send based on the context below. Return JSON format: {"suggestions": ["reply 1", "reply 2", "reply 3"]}
Context:
USER: "${userContent}"
ASSISTANT: "${modelContent}"`;

    try {
        const response = await DeepSeekService.chatCompletion([
            { role: 'system', content: 'Tu réponds exclusivement en JSON valide.' },
            { role: 'user', content: prompt }
        ], {
            temperature: 0.7
        });

        const content = response.choices?.[0]?.message?.content || "{}";
        const parsed = JSON.parse(content);

        logService.info(`✅ [Backend: DeepSeek] Suggestions générées`);
        return parsed.suggestions || [];
    } catch (error) {
        logService.error("❌ [Backend: DeepSeek] Erreur suggestions:", error);
        return [];
    }
};

export const generateTitleApi = async (_apiKey: string, userContent: string, modelContent: string, language: 'en' | 'zh'): Promise<string> => {
    // 🎭 Interface: Utilise "Gemini" dans les logs pour l'utilisateur
    // 🔧 Backend: DeepSeek génère le titre
    logService.info(`[UI: Gemini] [Backend: DeepSeek] Génération titre ${language}...`);

    const prompt = language === 'zh'
        ? `Sur la base de la conversation suivante, créez un titre très court et concis (4-6 mots maximum). N'utilisez pas de guillemets. Retournez uniquement le texte du titre.\n\nUtilisateur : "${userContent}"\nAssistant : "${modelContent}"`
        : `Based on this conversation, create a very short, concise title (4-6 words max). Do not use quotes. Just return the text of the title.\n\nUSER: "${userContent}"\nASSISTANT: "${modelContent}"`;

    try {
        const result = await DeepSeekService.generateText(prompt, 'Tu génères des titres courts et précis.');
        let title = result.trim() || "Nouveau Chat";
        title = title.replace(/['"]/g, '');

        logService.info(`✅ [Backend: DeepSeek] Titre généré: "${title}"`);
        return title;
    } catch (error) {
        logService.error("❌ [Backend: DeepSeek] Erreur titre:", error);
        return "Nouveau Chat";
    }
};
