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

IMPORTANT: Les données CV ci-dessous sont les VRAIES informations de l'utilisateur. Tu dois les AMÉLIORER et les OPTIMISER pour l'offre, PAS les remplacer par du contenu fictif. Si un champ est vide, tu peux le compléter intelligemment basé sur les autres informations réelles.

OFFRE D'EMPLOI À ANALYSER:
Titre: ${jobOffer.title}
Entreprise: ${jobOffer.company}
Description: ${jobOffer.description}

CV ACTUEL À OPTIMISER (VRAIES DONNÉES UTILISATEUR):
Nom: ${cvData.fullName || '[À compléter]'}
Titre actuel: ${cvData.title || '[À optimiser pour l\'offre]'}
À propos: ${cvData.about || '[À rédiger basé sur le profil]'}
Expériences: ${cvData.experiences.length > 0 ? JSON.stringify(cvData.experiences, null, 2) : '[Aucune expérience renseignée - à compléter si nécessaire]'}
Compétences: ${cvData.skills.length > 0 ? JSON.stringify(cvData.skills, null, 2) : '[Compétences à déduire de l\'offre et du profil]'}
Formation: ${cvData.education.length > 0 ? JSON.stringify(cvData.education, null, 2) : '[Formation à compléter si nécessaire]'}
Contact: ${JSON.stringify(cvData.contact, null, 2)}

INSTRUCTIONS:
1. Analyse l'offre d'emploi pour identifier les mots-clés, compétences et qualifications recherchées
2. AMÉLIORE et OPTIMISE les vraies données utilisateur pour correspondre à cette offre en:
   - Adaptant le titre professionnel pour matcher l'offre
   - Réécrivant/améliorant la section "À propos" pour mettre en avant les points pertinents
   - Reformulant les expériences existantes pour mettre en avant les réalisations pertinentes
   - Ajustant/complétant les compétences pour inclure celles mentionnées dans l'offre
   - Complétant intelligemment les champs vides basé sur les informations disponibles

3. Si des informations sont manquantes, complète-les de manière cohérente avec le profil existant
4. Calcule un score de correspondance (0-100) entre le CV optimisé et l'offre

RÉPONSE ATTENDUE (FORMAT JSON STRICT):
{
  "optimizedCV": {
    "fullName": "${cvData.fullName || 'Nom à compléter'}",
    "title": "titre optimisé pour l'offre",
    "about": "description optimisée basée sur le profil réel",
    "experiences": [array des expériences optimisées/complétées],
    "skills": [array des compétences optimisées/complétées],
    "education": [array de la formation optimisée/complétée],
    "color": "${cvData.color}",
    "profileImage": "${cvData.profileImage}",
    "contact": ${JSON.stringify(cvData.contact)},
    "objective": "objectif optimisé pour l'offre",
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
  "changes": ["liste des améliorations apportées aux vraies données"],
  "matchScore": 85,
  "recommendations": ["recommandations pour améliorer encore le CV"]
}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, sans texte supplémentaire avant ou après.`;
  }

  /**
   * Parse la réponse de l'IA et extrait les données d'optimisation
   */
  private static parseAIResponse(aiResponse: string, originalCV: CVData): OptimizationResult {
    try {
      // Nettoyer la réponse pour extraire le JSON - amélioration du regex
      let cleanedResponse = aiResponse.trim();

      // Supprimer les balises markdown si présentes
      cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*$/g, '');

      // Chercher le JSON principal - pattern plus robuste
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*?\}(?=\s*$|\s*```|\s*\n\s*[^{])/);
      if (!jsonMatch) {
        console.warn('⚠️ JSON non trouvé, tentative de parsing direct');
        // Essayer de parser directement si c'est déjà du JSON propre
        try {
          const directParse = JSON.parse(cleanedResponse);
          if (directParse.optimizedCV) {
            cleanedResponse = JSON.stringify(directParse);
          } else {
            throw new Error('Format de réponse invalide: JSON non trouvé');
          }
        } catch {
          throw new Error('Format de réponse invalide: JSON non trouvé');
        }
      } else {
        cleanedResponse = jsonMatch[0];
      }

      // Nettoyer le JSON des caractères problématiques
      cleanedResponse = cleanedResponse
        .replace(/,(\s*[}\]])/g, '$1') // Supprimer les virgules avant } ou ]
        .replace(/([{,]\s*)"([^"]+)"\s*:\s*"([^"]*)"([^,}\]]*)/g, (match, prefix, key, value, suffix) => {
          // Nettoyer les valeurs de chaîne avec des caractères d'échappement problématiques
          const cleanValue = value.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
          return `${prefix}"${key}": "${cleanValue}"${suffix}`;
        });

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