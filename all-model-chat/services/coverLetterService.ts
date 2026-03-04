import { supabase } from './supabaseClient';
import { CoverLetter, CoverLetterGenerationParams } from '../types/coverLetter';
import { geminiServiceInstance } from './geminiService';

/**
 * Service pour gérer les lettres de motivation
 */
class CoverLetterService {
  /**
   * Récupérer toutes les lettres d'un utilisateur
   */
  async getUserCoverLetters(userId: string): Promise<CoverLetter[]> {
    const { data, error } = await supabase
      .from('user_cover_letters')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur récupération lettres:', error);
      throw error;
    }

    return data || [];
  }

  /**
   * Récupérer une lettre par ID
   */
  async getCoverLetterById(id: string): Promise<CoverLetter | null> {
    const { data, error } = await supabase
      .from('user_cover_letters')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erreur récupération lettre:', error);
      return null;
    }

    return data;
  }

  /**
   * Créer une nouvelle lettre
   */
  async createCoverLetter(letter: Partial<CoverLetter>): Promise<CoverLetter> {
    const { data, error } = await supabase
      .from('user_cover_letters')
      .insert([letter])
      .select()
      .single();

    if (error) {
      console.error('Erreur création lettre:', error);
      throw error;
    }

    return data;
  }

  /**
   * Mettre à jour une lettre
   */
  async updateCoverLetter(id: string, updates: Partial<CoverLetter>): Promise<CoverLetter> {
    const { data, error } = await supabase
      .from('user_cover_letters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erreur mise à jour lettre:', error);
      throw error;
    }

    return data;
  }

  /**
   * Supprimer une lettre
   */
  async deleteCoverLetter(id: string): Promise<void> {
    const { error } = await supabase
      .from('user_cover_letters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur suppression lettre:', error);
      throw error;
    }
  }

  /**
   * Générer une lettre de motivation avec l'IA
   */
  async generateWithAI(params: CoverLetterGenerationParams): Promise<string> {
    const { userProfile, opportunity, tone, additionalInfo } = params;

    // Construction du prompt selon le ton
    const toneInstructions = {
      formal: 'Adopte un ton formel, professionnel et respectueux. Utilise un vocabulaire soutenu.',
      dynamic: 'Adopte un ton dynamique, enthousiaste et énergique. Montre ta motivation et ton engagement.',
      creative: 'Adopte un ton créatif, original et personnel. Ose sortir des sentiers battus tout en restant professionnel.'
    };

    const prompt = `Tu es un expert en rédaction de lettres de motivation pour étudiants et jeunes professionnels.

PROFIL DU CANDIDAT :
- Nom : ${userProfile.display_name}
- Email : ${userProfile.email || 'Non spécifié'}
- Téléphone : ${userProfile.phone || 'Non spécifié'}
- Université : ${userProfile.university || 'Non spécifiée'}
- Domaine d'études : ${userProfile.field_of_study || 'Non spécifié'}
- Niveau : ${userProfile.education_level || 'Non spécifié'}
- Compétences : ${userProfile.skills?.join(', ') || 'Non spécifiées'}
- Années d'expérience : ${userProfile.experience_years || 0}
- Poste actuel : ${userProfile.current_position || 'Étudiant'}
- Bio : ${userProfile.bio || 'Non spécifiée'}

${opportunity ? `
OPPORTUNITÉ CIBLÉE :
- Type : ${opportunity.type}
- Titre : ${opportunity.title}
- Organisation : ${opportunity.organization}
- Description : ${opportunity.description || 'Non spécifiée'}
${opportunity.fullContent ? `- Détails complets : ${opportunity.fullContent}` : ''}
` : 'OPPORTUNITÉ : Lettre de motivation générique (aucune opportunité spécifique ciblée)'}

${additionalInfo ? `INFORMATIONS SUPPLÉMENTAIRES DU CANDIDAT :\n${additionalInfo}\n` : ''}

TON DEMANDÉ : ${toneInstructions[tone]}

INSTRUCTIONS :
1. Rédige une lettre de motivation complète et personnalisée
2. Structure classique : En-tête, Introduction, Corps (2-3 paragraphes), Conclusion
3. Mets en avant les compétences et expériences pertinentes du candidat
4. Montre la motivation et l'adéquation avec ${opportunity ? "l'opportunité" : "le poste visé"}
5. Utilise des exemples concrets si possible
6. Longueur : 300-400 mots
7. Format : Texte brut avec sauts de ligne appropriés (pas de Markdown)
8. Inclus les coordonnées en haut : Nom, Email, Téléphone, Ville
9. Date du jour
10. Destinataire : ${opportunity ? opportunity.organization : '[Nom de l\'entreprise]'}

IMPORTANT : 
- Ne mentionne PAS de compétences ou expériences qui ne sont pas dans le profil
- Reste factuel et honnête
- Adapte le contenu au niveau d'études et d'expérience du candidat
- Si le candidat est débutant, mise sur la motivation et le potentiel

Génère maintenant la lettre de motivation :`;

    return new Promise((resolve, reject) => {
      const parts = [{ text: prompt }];
      
      geminiServiceInstance.sendMessageNonStream(
        'dummy-key', // L'API proxy gère l'auth
        'gemini-2.5-flash',
        [],
        parts,
        { temperature: 0.8 }, // Plus créatif pour les lettres
        new AbortController().signal,
        (error) => {
          console.error('Erreur génération IA:', error);
          reject(error);
        },
        (responseParts) => {
          if (responseParts && responseParts.length > 0 && responseParts[0].text) {
            resolve(responseParts[0].text);
          } else {
            reject(new Error('Aucune réponse de l\'IA'));
          }
        }
      );
    });
  }

  /**
   * Basculer le statut favori d'une lettre
   */
  async toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
    await this.updateCoverLetter(id, { is_favorite: isFavorite });
  }
}

export const coverLetterService = new CoverLetterService();
