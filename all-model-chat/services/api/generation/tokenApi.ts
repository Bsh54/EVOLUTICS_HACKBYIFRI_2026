import { logService } from "../../logService";
import { Part } from "@google/genai";

/**
 * Estimation simple des tokens pour le modèle unique.
 * La plupart des proxies OpenAI ne supportent pas countTokens nativement.
 */
export const countTokensApi = async (_apiKey: string, modelId: string, parts: Part[]): Promise<number> => {
    logService.info(`Estimating tokens for model ${modelId}...`);

    try {
        // Calcul simple : ~4 caractères par token en moyenne pour l'anglais/code
        const textContent = parts.map(p => p.text || "").join("");
        const estimatedTokens = Math.ceil(textContent.length / 4);

        return estimatedTokens;
    } catch (error) {
        logService.error("Error estimating tokens:", error);
        return 0;
    }
};
