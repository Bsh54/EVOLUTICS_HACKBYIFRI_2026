import { supabase } from './supabaseClient';
import { SavedChatSession } from '../types';

export const chatService = {
  /**
   * Récupère toutes les sessions de l'utilisateur connecté (triées par date de mise à jour)
   */
  async getSessions(): Promise<SavedChatSession[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des sessions de chat:', error);
      return [];
    }

    // Mapper les champs de la base de données vers l'interface frontend
    return data.map(session => ({
      id: session.id,
      title: session.title,
      messages: session.messages || [],
      settings: session.settings || {},
      timestamp: new Date(session.updated_at).getTime(), // Très important pour le tri et le Sidebar
      date: new Date(session.updated_at).toLocaleString(),
      isPinned: session.is_pinned || false,
    }));
  },

  /**
   * Récupère une session spécifique par son ID
   */
  async getSessionById(sessionId: string): Promise<SavedChatSession | null> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      messages: data.messages || [],
      settings: data.settings || {},
      timestamp: new Date(data.updated_at).getTime(),
      date: new Date(data.updated_at).toLocaleString(),
      isPinned: data.is_pinned || false,
    };
  },

  /**
   * Crée ou met à jour une session (Upsert)
   */
  async saveSession(session: SavedChatSession): Promise<SavedChatSession | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null; // Seulement pour les utilisateurs connectés

    // Préparer le payload pour la base de données
    const payload = {
      id: session.id, // Si l'ID frontend n'est pas un UUID valide, Supabase pourrait le rejeter
      user_id: user.id,
      title: session.title || 'Nouvelle conversation',
      messages: session.messages,
      settings: session.settings,
      is_pinned: session.isPinned || false,
      updated_at: new Date().toISOString()
    };

    // Note: Si l'ID généré côté frontend (souvent par `generateUniqueId` court) n'est pas 
    // un UUIDv4 standard, il faudra peut-être adapter la définition de table (text au lieu de uuid).
    // Nous utiliserons text pour la compatibilité avec le système existant.

    const { data, error } = await supabase
      .from('chat_sessions')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la sauvegarde de la session:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      messages: data.messages,
      settings: data.settings,
      date: new Date(data.updated_at).toLocaleString(),
    };
  },

  /**
   * Met à jour uniquement le titre d'une session
   */
  async updateTitle(sessionId: string, newTitle: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title: newTitle, updated_at: new Date().toISOString() })
      .eq('id', sessionId);

    return !error;
  },

  /**
   * Supprime une session
   */
  async deleteSession(sessionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId);

    return !error;
  },
  
  /**
   * Supprime toutes les sessions de l'utilisateur
   */
  async clearAllSessions(): Promise<boolean> {
     const { data: { user } } = await supabase.auth.getUser();
     if (!user) return false;
     
     const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', user.id);
      
     return !error;
  }
};
