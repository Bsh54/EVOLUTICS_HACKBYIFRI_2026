import { supabase } from './supabaseClient';
import { UserProfile } from '../types/user';

export const authService = {
  // Inscription avec email et mot de passe
  async signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) throw error;

    // Créer le profil dans la table profiles
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
          id: data.user.id,
          email: data.user.email,
          display_name: displayName,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
        }]);

      if (profileError) console.error('Erreur création profil:', profileError);
    }

    return data;
  },

  // Connexion avec email et mot de passe
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Mettre à jour last_login_at
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', data.user.id);
    }

    return data;
  },

  // Connexion avec Google OAuth
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
    return data;
  },

  // Déconnexion
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Récupérer la session actuelle
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Récupérer le profil complet depuis la table profiles
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erreur récupération profil:', error);
      return null;
    }

    return data as UserProfile;
  },

  // Mettre à jour le profil
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour profil:', error);
      throw error;
    }

    return data as UserProfile;
  },

  // Upload d'avatar vers Supabase Storage
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    // Mettre à jour le profil avec l'URL de l'avatar
    await supabase
      .from('profiles')
      .update({ avatar_url: data.publicUrl })
      .eq('id', userId);

    return data.publicUrl;
  },

  // Upload de CV vers Supabase Storage
  async uploadCV(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/cv.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('cvs')
      .upload(fileName, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('cvs')
      .getPublicUrl(fileName);

    await supabase
      .from('profiles')
      .update({ cv_url: data.publicUrl })
      .eq('id', userId);

    return data.publicUrl;
  },

  // Écouter les changements d'état d'auth
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Vérifier si le profil existe (pour l'onboarding après OAuth)
  async ensureProfile(user: any): Promise<UserProfile | null> {
    let profile = await this.getProfile(user.id);

    if (!profile) {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Utilisateur',
          avatar_url: user.user_metadata?.avatar_url || null,
          onboarding_completed: false,
          created_at: new Date().toISOString(),
        }]);

      if (error) {
        console.error('Erreur création profil auto:', error);
        return null;
      }

      profile = await this.getProfile(user.id);
    }

    return profile;
  },
};
