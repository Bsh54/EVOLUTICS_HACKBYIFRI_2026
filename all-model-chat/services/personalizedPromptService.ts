import React from 'react';
import { UserProfile } from '../types/user';
import { generatePersonalizedSystemPrompt, DEFAULT_SYSTEM_INSTRUCTION } from '../constants/promptConstants';
import { useAuth } from '../contexts/AuthContext';

/**
 * Service pour gérer les prompts système personnalisés
 */
export class PersonalizedPromptService {
  private static userProfile: UserProfile | null = null;
  private static personalizedPrompt: string | null = null;

  /**
   * Met à jour le profil utilisateur et régénère le prompt personnalisé
   */
  static updateUserProfile(profile: UserProfile | null): void {
    this.userProfile = profile;
    this.personalizedPrompt = profile ? generatePersonalizedSystemPrompt(profile) : null;
  }

  /**
   * Récupère le prompt système personnalisé ou le prompt par défaut
   */
  static getSystemPrompt(): string {
    return this.personalizedPrompt || DEFAULT_SYSTEM_INSTRUCTION;
  }

  /**
   * Vérifie si un prompt personnalisé est disponible
   */
  static hasPersonalizedPrompt(): boolean {
    return this.personalizedPrompt !== null;
  }

  /**
   * Force la régénération du prompt personnalisé
   */
  static regeneratePrompt(): void {
    if (this.userProfile) {
      this.personalizedPrompt = generatePersonalizedSystemPrompt(this.userProfile);
    }
  }

  /**
   * Récupère le profil utilisateur actuel
   */
  static getCurrentUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  /**
   * Réinitialise le service (utile pour la déconnexion)
   */
  static reset(): void {
    this.userProfile = null;
    this.personalizedPrompt = null;
  }
}

/**
 * Hook pour utiliser le prompt personnalisé dans les composants React
 */
export const usePersonalizedPrompt = () => {
  const { user } = useAuth();

  // Met à jour le profil utilisateur quand il change
  React.useEffect(() => {
    PersonalizedPromptService.updateUserProfile(user);
  }, [user]);

  return {
    getSystemPrompt: () => PersonalizedPromptService.getSystemPrompt(),
    hasPersonalizedPrompt: () => PersonalizedPromptService.hasPersonalizedPrompt(),
    regeneratePrompt: () => PersonalizedPromptService.regeneratePrompt(),
  };
};