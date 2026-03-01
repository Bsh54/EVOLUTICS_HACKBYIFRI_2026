import { supabase } from './supabaseClient';

export interface CVData {
  fullName: string;
  title: string;
  color: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  about: string;
  experiences: Array<{
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
  }>;
  skills: Array<{
    name: string;
    level: number;
  }>;
  languages: string[];
  references: Array<{
    name: string;
    contact: string;
  }>;
}

export interface UserProfile {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  title?: string;
}

export interface Opportunity {
  id: string;
  type: string;
  title: string;
  organization: string;
  fullContent: string;
  description?: string;
}

class CVIntegrationService {
  /**
   * Mappe les données du profil utilisateur vers la structure CVData
   */
  mapProfileToCVData(profile: UserProfile): Partial<CVData> {
    return {
      fullName: profile.fullName || '',
      title: profile.title || '',
      color: '#00a99d', // Couleur par défaut EVOLUTICS
      contact: {
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.location || ''
      },
      about: profile.bio || '',
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      references: []
    };
  }

  /**
   * Récupère les données CV sauvegardées pour un utilisateur
   */
  async getUserCVData(userId: string): Promise<Partial<CVData> | null> {
    try {
      const { data, error } = await supabase
        .from('user_cv_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erreur lors de la récupération des données CV:', error);
        return null;
      }

      if (!data) return null;

      return {
        experiences: data.experiences || [],
        education: data.education || [],
        skills: data.skills || [],
        languages: data.languages || [],
        references: data.references || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des données CV:', error);
      return null;
    }
  }

  /**
   * Sauvegarde les données CV d'un utilisateur
   */
  async saveCVProfile(userId: string, cvData: Partial<CVData>): Promise<boolean> {
    try {
      const cvProfileData = {
        user_id: userId,
        experiences: cvData.experiences || [],
        education: cvData.education || [],
        skills: cvData.skills || [],
        languages: cvData.languages || [],
        references: cvData.references || [],
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_cv_profiles')
        .upsert(cvProfileData, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde des données CV:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données CV:', error);
      return false;
    }
  }

  /**
   * Optimise le CV avec l'IA en utilisant la description de l'opportunité
   */
  async optimizeWithOpportunity(cvData: CVData, opportunity: Opportunity): Promise<CVData> {
    try {
      // Utilisation de l'API Gemini pour optimiser le CV
      const prompt = `
        Rôle : Expert en recrutement stratégique.
        Tâche : Optimise intégralement ce CV pour l'opportunité fournie.
        Réponds UNIQUEMENT avec un objet JSON complet commençant par { et finissant par }.

        IMPORTANT : Optimise le profil (about), TOUTES les expériences (descriptions) et les compétences (skills) pour correspondre aux mots-clés de l'opportunité.

        DONNÉES ACTUELLES :
        ${JSON.stringify({
          about: cvData.about,
          experiences: cvData.experiences,
          skills: cvData.skills
        })}

        OPPORTUNITÉ CIBLE : ${opportunity.fullContent.substring(0, 800)}

        STRUCTURE JSON ATTENDUE :
        {
          "about": "...",
          "experiences": [{"role": "...", "company": "...", "startDate": "...", "endDate": "...", "isCurrent": boolean, "description": "..."}],
          "skills": [{"name": "...", "level": 90}]
        }
      `;

      // Simulation de l'optimisation IA (à remplacer par l'API Gemini réelle)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Pour l'instant, on retourne une version légèrement optimisée
      const optimizedCV: CVData = {
        ...cvData,
        about: `${cvData.about} Passionné par les opportunités dans le domaine de ${opportunity.organization}. Motivé par ${opportunity.type.toLowerCase()} qui correspond parfaitement à mon profil et mes aspirations professionnelles.`,
        title: cvData.title ? `${cvData.title} - Candidat pour ${opportunity.title}` : `Candidat pour ${opportunity.title}`
      };

      return optimizedCV;
    } catch (error) {
      console.error('Erreur lors de l\'optimisation IA:', error);
      // En cas d'erreur, retourner le CV original
      return cvData;
    }
  }

  /**
   * Génère un PDF du CV (simulation)
   */
  async generatePDF(cvData: CVData): Promise<Blob | null> {
    try {
      // Simulation de la génération PDF
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Ici, on intégrerait la logique de génération PDF de CV-AI
      // Pour l'instant, on simule avec un blob vide
      const pdfBlob = new Blob(['PDF simulé'], { type: 'application/pdf' });

      return pdfBlob;
    } catch (error) {
      console.error('Erreur lors de la génération PDF:', error);
      return null;
    }
  }

  /**
   * Sauvegarde l'historique d'un CV généré
   */
  async saveGeneratedCV(userId: string, opportunityId: string, cvData: CVData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('generated_cvs')
        .insert({
          user_id: userId,
          opportunity_id: opportunityId,
          cv_data: cvData,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde de l\'historique CV:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique CV:', error);
      return false;
    }
  }

  /**
   * Récupère l'historique des CV générés pour un utilisateur
   */
  async getUserCVHistory(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('generated_cvs')
        .select(`
          *,
          opportunities (
            title,
            organization,
            type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération de l\'historique CV:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique CV:', error);
      return [];
    }
  }
}

export const cvIntegrationService = new CVIntegrationService();