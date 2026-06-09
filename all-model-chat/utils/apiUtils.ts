
import { AppSettings, ChatSettings } from '../types';
import { API_KEY_LAST_USED_INDEX_KEY } from '../constants/appConstants';
import { logService } from '../services/logService';

export const getActiveApiConfig = (appSettings: AppSettings): { apiKeysString: string | null } => {
    if (appSettings.useCustomApiConfig) {
        return {
            apiKeysString: appSettings.apiKey,
        };
    }
    return {
        apiKeysString: process.env.API_KEY || null,
    };
};

/**
 * Parses a raw API key string (which may contain multiple keys, newlines, commas, or quotes)
 * into a clean array of individual keys.
 */
export const parseApiKeys = (apiKeysString: string | null): string[] => {
    if (!apiKeysString) return [];
    return apiKeysString
        .split(/[\n,]+/)
        .map(k => k.trim().replace(/^["']|["']$/g, ''))
        .filter(k => k.length > 0);
};

export const getKeyForRequest = (
    _appSettings: AppSettings,
    _currentChatSettings: ChatSettings,
    _options: { skipIncrement?: boolean } = {}
): { key: string; isNewKey: boolean } | { error: string } => {
    // On force l'utilisation de la clé pour le point d'accès ShadsAI
    return { key: "sk-dummy", isNewKey: false };
};
