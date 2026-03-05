/**
 * Service DeepSeek unifié - Remplace Gemini en arrière-plan
 * Interface utilisateur : Affiche "Gemini"
 * Backend : Utilise DeepSeek
 */

import { PersonalizedPromptService } from './personalizedPromptService';

export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
      role: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class DeepSeekService {
  private static readonly API_URL = 'https://shads229-personnal-aiv2.hf.space/v1/chat/completions';
  private static readonly API_KEY = 'Shadobsh';
  private static readonly MODEL = 'deepseek-chat';

  /**
   * Appel API DeepSeek générique pour le chat
   */
  static async chatCompletion(
    messages: DeepSeekMessage[],
    options: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    } = {}
  ): Promise<DeepSeekResponse> {
    try {
      console.log('🤖 [DeepSeek Backend] Traitement de la requête...');

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages,
          temperature: options.temperature || 0.7,
          max_tokens: options.max_tokens || 4000,
          stream: options.stream || false
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur API DeepSeek: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.choices || result.choices.length === 0) {
        throw new Error('Réponse vide de DeepSeek');
      }

      console.log('✅ [DeepSeek Backend] Réponse reçue avec succès');
      return result;

    } catch (error) {
      console.error('❌ [DeepSeek Backend] Erreur:', error);
      throw error;
    }
  }

  /**
   * Chat simple - Compatible avec l'interface Gemini existante
   */
  static async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: DeepSeekMessage[] = [];

    // Utilise le prompt personnalisé si aucun systemPrompt n'est fourni
    const finalSystemPrompt = systemPrompt || PersonalizedPromptService.getSystemPrompt();
    if (finalSystemPrompt) {
      messages.push({ role: 'system', content: finalSystemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await this.chatCompletion(messages);
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Chat avec historique - Pour les conversations
   */
  static async generateWithHistory(
    messages: Array<{ role: string; content: string }>,
    options?: { temperature?: number; max_tokens?: number }
  ): Promise<string> {
    // Convertir le format vers DeepSeek
    const deepseekMessages: DeepSeekMessage[] = messages.map(msg => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content
    }));

    const response = await this.chatCompletion(deepseekMessages, options);
    return response.choices[0]?.message?.content || '';
  }

  /**
   * Streaming pour les réponses en temps réel
   */
  static async generateStream(
    messages: DeepSeekMessage[],
    onChunk: (chunk: string) => void,
    options?: { temperature?: number }
  ): Promise<void> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages,
          temperature: options?.temperature || 0.7,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur streaming DeepSeek: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Pas de reader disponible');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                onChunk(content);
              }
            } catch (e) {
              // Ignorer les erreurs de parsing des chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ [DeepSeek Streaming] Erreur:', error);
      throw error;
    }
  }

  /**
   * Vérifier la santé de l'API
   */
  static async healthCheck(): Promise<boolean> {
    try {
      const response = await this.generateText('Test de connexion', 'Réponds simplement "OK"');
      return response.toLowerCase().includes('ok');
    } catch {
      return false;
    }
  }
}