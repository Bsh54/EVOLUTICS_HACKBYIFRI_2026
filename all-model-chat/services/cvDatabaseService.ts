import { supabase } from './supabaseClient';
import { CVData } from '../types/cvTypes';

export interface UserCVRecord {
  id: string;
  user_id: string;
  cv_data: CVData;
  template_id: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export class CVDatabaseService {
  /**
   * Sauvegarde les données CV en base de données
   */
  static async saveCVData(userId: string, cvData: CVData, templateId: string = 'moderne-01'): Promise<void> {
    try {
      console.log('💾 Sauvegarde CV en base pour utilisateur:', userId);

      // Vérifier si l'utilisateur a déjà un CV
      const { data: existingCV, error: fetchError } = await supabase
        .from('user_cv_data')
        .select('id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingCV) {
        // Mettre à jour le CV existant
        const { error: updateError } = await supabase
          .from('user_cv_data')
          .update({
            cv_data: cvData,
            template_id: templateId,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingCV.id);

        if (updateError) throw updateError;
        console.log('✅ CV mis à jour en base');
      } else {
        // Créer un nouveau CV
        const { error: insertError } = await supabase
          .from('user_cv_data')
          .insert({
            user_id: userId,
            cv_data: cvData,
            template_id: templateId,
            is_default: true
          });

        if (insertError) throw insertError;
        console.log('✅ Nouveau CV créé en base');
      }
    } catch (error) {
      console.error('❌ Erreur sauvegarde CV:', error);
      throw error;
    }
  }

  /**
   * Récupère les données CV depuis la base de données
   */
  static async getCVData(userId: string): Promise<CVData | null> {
    try {
      console.log('📖 Récupération CV depuis base pour utilisateur:', userId);

      const { data, error } = await supabase
        .from('user_cv_data')
        .select('cv_data, template_id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Aucun CV trouvé - normal pour un nouvel utilisateur
          console.log('ℹ️ Aucun CV trouvé en base (nouvel utilisateur)');
          return null;
        }
        throw error;
      }

      console.log('✅ CV récupéré depuis base:', {
        fullName: data.cv_data.fullName,
        skillsCount: data.cv_data.skills?.length || 0,
        experiencesCount: data.cv_data.experiences?.length || 0
      });

      return data.cv_data as CVData;
    } catch (error) {
      console.error('❌ Erreur récupération CV:', error);
      return null;
    }
  }

  /**
   * Supprime les données CV de la base
   */
  static async deleteCVData(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_cv_data')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      console.log('✅ CV supprimé de la base');
    } catch (error) {
      console.error('❌ Erreur suppression CV:', error);
      throw error;
    }
  }

  /**
   * Vérifie si l'utilisateur a des données CV sauvegardées
   */
  static async hasCVData(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_cv_data')
        .select('id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('❌ Erreur vérification CV:', error);
      return false;
    }
  }

  /**
   * Sauvegarde automatique avec debouncing
   */
  static async autoSaveCVData(userId: string, cvData: CVData, templateId: string = 'moderne-01'): Promise<void> {
    // Utiliser un délai pour éviter trop d'appels à la base
    clearTimeout((window as any).cvDatabaseSaveTimeout);
    (window as any).cvDatabaseSaveTimeout = setTimeout(async () => {
      try {
        await this.saveCVData(userId, cvData, templateId);
      } catch (error) {
        console.error('❌ Erreur auto-sauvegarde CV:', error);
        // Ne pas bloquer l'utilisateur en cas d'erreur de sauvegarde
      }
    }, 3000); // Délai de 3 secondes
  }

  /**
   * Obtient les statistiques CV de l'utilisateur
   */
  static async getCVStats(userId: string): Promise<{
    hasCV: boolean;
    lastUpdated: string | null;
    templateId: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from('user_cv_data')
        .select('updated_at, template_id')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return {
        hasCV: !!data,
        lastUpdated: data?.updated_at || null,
        templateId: data?.template_id || null
      };
    } catch (error) {
      console.error('❌ Erreur stats CV:', error);
      return {
        hasCV: false,
        lastUpdated: null,
        templateId: null
      };
    }
  }
}

export default CVDatabaseService;