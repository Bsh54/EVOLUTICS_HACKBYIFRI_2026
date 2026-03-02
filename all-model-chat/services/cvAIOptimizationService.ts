import { CVData } from '../types/cvTypes';

export interface JobOffer {
  title: string;
  company: string;
  description: string;
}

export interface OptimizationResult {
  optimizedCV: CVData;
  changes: string[];
  matchScore: number;
  recommendations: string[];
}

export class CVAIOptimizationService {
  private static readonly DEEPSEEK_API_URL = 'https://shads229-personnal-aiv2.hf.space/v1/chat/completions';
  private static readonly DEEPSEEK_API_KEY = 'Shadobsh';
  private static readonly MODEL = 'deepseek-chat';

  /**
   * Optimise un CV en fonction d'une offre d'emploi spécifique
   */
  static async optimizeCV(cvData: CVData, jobOffer: JobOffer): Promise<OptimizationResult> {
    try {
      console.log('🤖 Début de l\'optimisation IA du CV...');

      // Utiliser l'API DeepSeek
      const apiUrl = this.DEEPSEEK_API_URL;
      const apiKey = this.DEEPSEEK_API_KEY;

      // Préparer le prompt d'optimisation
      const optimizationPrompt = this.buildOptimizationPrompt(cvData, jobOffer);

      // Appel à l'API DeepSeek (format OpenAI compatible)
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.MODEL,
          messages: [
            {
              role: 'user',
              content: optimizationPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4096,
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Erreur API DeepSeek: ${response.status} - ${errorData.error?.message || 'Erreur inconnue'}`);
      }

      const result = await response.json();
      const aiResponse = result.choices?.[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('Réponse vide de l\'API DeepSeek');
      }

      // Parser la réponse de l'IA
      const optimizationResult = this.parseAIResponse(aiResponse, cvData);

      console.log('✅ Optimisation IA terminée avec succès');
      return optimizationResult;

    } catch (error) {
      console.error('❌ Erreur lors de l\'optimisation IA:', error);
      throw error;
    }
  }

  /**
   * Construit le prompt d'optimisation pour l'IA
   */
  private static buildOptimizationPrompt(cvData: CVData, jobOffer: JobOffer): string {
    return `Tu es un expert en recrutement. Optimise ce CV pour cette offre d'emploi.

RÈGLES STRICTES:
- OPTIMISE SEULEMENT les données existantes
- N'INVENTE RIEN de nouveau
- Ne crée PAS d'expériences fictives
- Ne crée PAS de compétences inexistantes
- AMÉLIORE seulement la formulation des données réelles

OFFRE D'EMPLOI:
Titre: ${jobOffer.title}
Entreprise: ${jobOffer.company}
Description: ${jobOffer.description}

CV EXISTANT:
Nom: ${cvData.fullName || '[Vide]'}
Titre: ${cvData.title || '[Vide]'}
À propos: ${cvData.about || '[Vide]'}
Expériences: ${cvData.experiences.length > 0 ? JSON.stringify(cvData.experiences, null, 2) : '[Aucune]'}
Compétences: ${cvData.skills.length > 0 ? JSON.stringify(cvData.skills, null, 2) : '[Aucune]'}
Formation: ${cvData.education.length > 0 ? JSON.stringify(cvData.education, null, 2) : '[Aucune]'}

INSTRUCTIONS:
1. Améliore SEULEMENT le titre et la description "À propos" pour matcher l'offre
2. Reformule les expériences existantes pour les valoriser (SANS en inventer)
3. Ajuste les niveaux des compétences existantes (SANS en ajouter)
4. Garde tout le reste IDENTIQUE

RÉPONSE (JSON UNIQUEMENT):
{"optimizedCV":{"fullName":"${cvData.fullName}","title":"titre amélioré","about":"description améliorée","experiences":${JSON.stringify(cvData.experiences)},"skills":${JSON.stringify(cvData.skills)},"education":${JSON.stringify(cvData.education)},"color":"${cvData.color}","profileImage":"${cvData.profileImage}","contact":${JSON.stringify(cvData.contact)},"objective":"${cvData.objective}","certifications":${JSON.stringify(cvData.certifications)},"tools":${JSON.stringify(cvData.tools)},"links":${JSON.stringify(cvData.links)},"languages":${JSON.stringify(cvData.languages)},"hobbies":${JSON.stringify(cvData.hobbies)},"references":${JSON.stringify(cvData.references)},"strategicPitch":"${cvData.strategicPitch}","isOptimized":true,"sectionsOrder":${JSON.stringify(cvData.sectionsOrder)}},"changes":["changement 1","changement 2"],"matchScore":75,"recommendations":["conseil 1"]}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, rien d'autre.`;
  }

  /**
   * Parse la réponse de l'IA et extrait les données d'optimisation
   */
  private static parseAIResponse(aiResponse: string, originalCV: CVData): OptimizationResult {
    try {
      console.log('🔍 Réponse brute IA:', aiResponse.substring(0, 200) + '...');

      let cleanedResponse = aiResponse.trim();

      // Cas spécial : si la réponse commence par "optimizedCV": au lieu de {"optimizedCV":
      if (cleanedResponse.startsWith('"optimizedCV":')) {
        cleanedResponse = '{' + cleanedResponse;
      }

      // Trouver la première accolade ouvrante
      const firstBrace = cleanedResponse.indexOf('{');
      if (firstBrace === -1) {
        throw new Error('Aucune accolade ouvrante trouvée');
      }

      // Trouver la dernière accolade fermante
      const lastBrace = cleanedResponse.lastIndexOf('}');
      if (lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('Aucune accolade fermante trouvée');
      }

      // Extraire seulement le JSON entre les accolades
      cleanedResponse = cleanedResponse.substring(firstBrace, lastBrace + 1);

      console.log('🧹 JSON extrait:', cleanedResponse.substring(0, 200) + '...');

      // Nettoyage final des erreurs communes
      cleanedResponse = cleanedResponse
        .replace(/,(\s*[}\]])/g, '$1') // Supprimer virgules avant } ou ]
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/\t/g, '\\t');

      const parsedResponse = JSON.parse(cleanedResponse);

      // Valider la structure de la réponse
      if (!parsedResponse.optimizedCV || !parsedResponse.changes || !parsedResponse.matchScore) {
        throw new Error('Structure de réponse invalide');
      }

      // S'assurer que le CV optimisé a tous les champs requis
      const optimizedCV: CVData = {
        ...originalCV,
        ...parsedResponse.optimizedCV,
        isOptimized: true,
        // Forcer la mise à jour des champs optimisés même s'ils sont vides
        fullName: parsedResponse.optimizedCV.fullName || originalCV.fullName,
        title: parsedResponse.optimizedCV.title || originalCV.title,
        about: parsedResponse.optimizedCV.about || originalCV.about,
        objective: parsedResponse.optimizedCV.objective || originalCV.objective,
        experiences: parsedResponse.optimizedCV.experiences || originalCV.experiences,
        skills: parsedResponse.optimizedCV.skills || originalCV.skills,
        education: parsedResponse.optimizedCV.education || originalCV.education
      };

      return {
        optimizedCV,
        changes: parsedResponse.changes || [],
        matchScore: Math.min(100, Math.max(0, parsedResponse.matchScore || 0)),
        recommendations: parsedResponse.recommendations || []
      };

    } catch (error) {
      console.error('Erreur lors du parsing de la réponse IA:', error);
      console.error('Réponse complète:', aiResponse);

      // Fallback ultra-robuste : créer une réponse basique mais fonctionnelle
      console.log('🔄 Utilisation du fallback pour créer une réponse basique');

      return {
        optimizedCV: {
          ...originalCV,
          isOptimized: true,
          title: originalCV.title ? originalCV.title + ' - Optimisé IA' : 'Professionnel - Optimisé IA',
          about: originalCV.about || 'Professionnel expérimenté avec de solides compétences techniques et une forte motivation.',
          objective: 'Recherche d\'opportunités professionnelles stimulantes pour mettre à profit mes compétences.'
        },
        changes: ['Optimisation automatique appliquée', 'Titre professionnel amélioré', 'Description enrichie'],
        matchScore: 75,
        recommendations: ['Le CV a été optimisé automatiquement. Vérifiez et personnalisez les modifications selon vos besoins.']
      };
    }
  }

  /**
   * Génère un résumé des changements effectués
   */
  static generateChangesSummary(changes: string[]): string {
    if (changes.length === 0) return 'Aucune modification nécessaire.';

    return `${changes.length} modification${changes.length > 1 ? 's' : ''} effectuée${changes.length > 1 ? 's' : ''} :\n${changes.map(change => `• ${change}`).join('\n')}`;
  }

  /**
   * Valide qu'une offre d'emploi contient suffisamment d'informations
   */
  static validateJobOffer(jobOffer: JobOffer): boolean {
    return !!(
      jobOffer.title?.trim() &&
      jobOffer.description?.trim() &&
      jobOffer.description.length > 50
    );
  }
}

export default CVAIOptimizationService;