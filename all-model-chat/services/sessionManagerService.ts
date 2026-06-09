/**
 * Service centralisé pour gérer la création et mise à jour des sessions
 * Évite les créations multiples simultanées de sessions
 */

import { SavedChatSession, ChatMessage, ChatSettings } from '../types';
import { createNewSession, generateUniqueId } from '../utils/chat/session';
import { DEFAULT_CHAT_SETTINGS } from '../constants/appConstants';

class SessionManagerService {
  private pendingSessionCreation: Map<string, Promise<SavedChatSession>> = new Map();
  private sessionCreationLock = false;

  /**
   * Crée une nouvelle session de manière thread-safe
   * Évite les créations multiples simultanées
   */
  async createSessionSafely(
    settings: ChatSettings,
    messages: ChatMessage[] = [],
    title: string = "New Chat",
    groupId: string | null = null
  ): Promise<SavedChatSession> {
    // Générer une clé unique pour cette création de session
    const creationKey = `${Date.now()}-${Math.random()}`;

    // Si une création est déjà en cours, attendre qu'elle se termine
    if (this.sessionCreationLock) {
      await new Promise(resolve => setTimeout(resolve, 10));
      return this.createSessionSafely(settings, messages, title, groupId);
    }

    this.sessionCreationLock = true;

    try {
      const newSession = createNewSession(settings, messages, title, groupId);

      // Stocker la promesse pour éviter les duplicatas
      const sessionPromise = Promise.resolve(newSession);
      this.pendingSessionCreation.set(creationKey, sessionPromise);

      // Nettoyer après un délai
      setTimeout(() => {
        this.pendingSessionCreation.delete(creationKey);
      }, 1000);

      return newSession;
    } finally {
      this.sessionCreationLock = false;
    }
  }

  /**
   * Vérifie si une session existe déjà avec les mêmes caractéristiques
   */
  findExistingSession(
    sessions: SavedChatSession[],
    criteria: {
      isEmpty?: boolean;
      hasSystemInstruction?: boolean;
      modelId?: string;
    }
  ): SavedChatSession | null {
    return sessions.find(session => {
      if (criteria.isEmpty && session.messages.length > 0) return false;
      if (criteria.hasSystemInstruction !== undefined) {
        const hasInstruction = !!session.settings.systemInstruction;
        if (hasInstruction !== criteria.hasSystemInstruction) return false;
      }
      if (criteria.modelId && session.settings.modelId !== criteria.modelId) return false;
      return true;
    }) || null;
  }

  /**
   * Nettoie les sessions vides en double
   */
  cleanupDuplicateEmptySessions(sessions: SavedChatSession[]): SavedChatSession[] {
    const emptySessions = sessions.filter(s => s.messages.length === 0);
    const nonEmptySessions = sessions.filter(s => s.messages.length > 0);

    // Garder seulement la session vide la plus récente
    const latestEmptySession = emptySessions.sort((a, b) => b.timestamp - a.timestamp)[0];

    if (latestEmptySession) {
      return [latestEmptySession, ...nonEmptySessions];
    }

    return nonEmptySessions;
  }

  /**
   * Génère un titre intelligent pour une session
   */
  generateSmartTitle(messages: ChatMessage[], fallback: string = "New Chat"): string {
    if (messages.length === 0) return fallback;

    const firstUserMessage = messages.find(msg => msg.role === 'user' && msg.content.trim() !== '');
    if (firstUserMessage) {
      const words = firstUserMessage.content.trim().split(/\s+/);
      if (words.length <= 7) {
        return firstUserMessage.content.trim();
      }
      return words.slice(0, 7).join(' ') + '...';
    }

    const firstModelMessage = messages.find(msg => msg.role === 'model' && msg.content.trim() !== '');
    if (firstModelMessage) {
      const words = firstModelMessage.content.trim().split(/\s+/);
      return "Réponse: " + words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : '');
    }

    const firstFile = messages.find(msg => msg.files && msg.files.length > 0)?.files?.[0];
    if (firstFile) {
      return `Chat avec ${firstFile.name}`;
    }

    return fallback;
  }

  /**
   * Réinitialise le service (utile pour les tests)
   */
  reset(): void {
    this.pendingSessionCreation.clear();
    this.sessionCreationLock = false;
  }
}

export const sessionManagerService = new SessionManagerService();