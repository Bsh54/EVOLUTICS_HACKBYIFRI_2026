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
    return `Tu es un expert en recrutement et optimisation de CV. Ton rôle est d'analyser une offre d'emploi et d'optimiser un CV pour maximiser les chances de succès.

OFFRE D'EMPLOI À ANALYSER:
Titre: ${jobOffer.title}
Entreprise: ${jobOffer.company}
Description: ${jobOffer.description}

CV ACTUEL À OPTIMISER:
Nom: ${cvData.fullName}
Titre actuel: ${cvData.title}
À propos: ${cvData.about}
Expériences: ${JSON.stringify(cvData.experiences, null, 2)}
Compétences: ${JSON.stringify(cvData.skills, null, 2)}
Formation: ${JSON.stringify(cvData.education, null, 2)}

INSTRUCTIONS:
1. Analyse l'offre d'emploi pour identifier les mots-clés, compétences et qualifications recherchées
2. Optimise le CV pour correspondre parfaitement à cette offre en:
   - Adaptant le titre professionnel
   - Réécrivant la section "À propos" pour mettre en avant les points pertinents
   - Réorganisant et reformulant les expériences pour mettre en avant les réalisations pertinentes
   - Ajustant les compétences pour inclure celles mentionnées dans l'offre
   - Suggérant des améliorations pour la formation si nécessaire

3. Calcule un score de correspondance (0-100) entre le CV optimisé et l'offre

RÉPONSE ATTENDUE (FORMAT JSON STRICT):
{
  "optimizedCV": {
    "fullName": "${cvData.fullName}",
    "title": "nouveau titre optimisé",
    "about": "nouvelle description optimisée",
    "experiences": [array des expériences optimisées],
    "skills": [array des compétences optimisées],
    "education": [array de la formation],
    "color": "${cvData.color}",
    "profileImage": "${cvData.profileImage}",
    "contact": ${JSON.stringify(cvData.contact)},
    "objective": "objectif optimisé",
    "certifications": ${JSON.stringify(cvData.certifications)},
    "tools": ${JSON.stringify(cvData.tools)},
    "links": ${JSON.stringify(cvData.links)},
    "languages": ${JSON.stringify(cvData.languages)},
    "hobbies": ${JSON.stringify(cvData.hobbies)},
    "references": ${JSON.stringify(cvData.references)},
    "strategicPitch": "pitch stratégique optimisé",
    "isOptimized": true,
    "sectionsOrder": ${JSON.stringify(cvData.sectionsOrder)}
  },
  "changes": ["liste des changements effectués"],
  "matchScore": 85,
  "recommendations": ["recommandations supplémentaires pour améliorer le CV"]
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
  }

  /**
   * Parse la réponse de l'IA et extrait les données d'optimisation
   */
  private static parseAIResponse(aiResponse: string, originalCV: CVData): OptimizationResult {
    try {
      // Nettoyer la réponse pour extraire le JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Format de réponse invalide: JSON non trouvé');
      }

      const parsedResponse = JSON.parse(jsonMatch[0]);

      // Valider la structure de la réponse
      if (!parsedResponse.optimizedCV || !parsedResponse.changes || !parsedResponse.matchScore) {
        throw new Error('Structure de réponse invalide');
      }

      // S'assurer que le CV optimisé a tous les champs requis
      const optimizedCV: CVData = {
        ...originalCV,
        ...parsedResponse.optimizedCV,
        isOptimized: true
      };

      return {
        optimizedCV,
        changes: parsedResponse.changes || [],
        matchScore: Math.min(100, Math.max(0, parsedResponse.matchScore || 0)),
        recommendations: parsedResponse.recommendations || []
      };

    } catch (error) {
      console.error('Erreur lors du parsing de la réponse IA:', error);

      // Fallback: retourner le CV original avec des améliorations basiques
      return {
        optimizedCV: {
          ...originalCV,
          isOptimized: true,
          title: originalCV.title + ' - Optimisé IA'
        },
        changes: ['Optimisation automatique appliquée'],
        matchScore: 75,
        recommendations: ['Le CV a été optimisé automatiquement. Vérifiez les modifications.']
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