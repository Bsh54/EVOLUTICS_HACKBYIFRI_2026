import { AIAnalysisResult } from '../types/pendingOpportunity';

export class AIAnalysisService {
  private static instance: AIAnalysisService;
  private geminiApiKey: string;

  private constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  }

  public static getInstance(): AIAnalysisService {
    if (!AIAnalysisService.instance) {
      AIAnalysisService.instance = new AIAnalysisService();
    }
    return AIAnalysisService.instance;
  }

  /**
   * Analyse le contenu d'une URL avec l'IA Gemini
   */
  async analyzeOpportunity(url: string, htmlContent?: string): Promise<AIAnalysisResult | null> {
    try {
      // Si pas de contenu HTML fourni, essayer de le récupérer
      let content = htmlContent;
      if (!content) {
        content = await this.fetchPageContent(url);
      }

      if (!content) {
        throw new Error('Impossible de récupérer le contenu de la page');
      }

      // Nettoyer le contenu HTML
      const cleanContent = this.cleanHtmlContent(content);

      // Créer le prompt d'analyse
      const prompt = this.createAnalysisPrompt(url, cleanContent);

      // Appeler l'API Gemini
      const result = await this.callGeminiAPI(prompt);

      // Parser et valider le résultat
      return this.parseAndValidateResult(result, url);

    } catch (error) {
      console.error('Erreur analyse IA:', error);
      return null;
    }
  }

  /**
   * Récupère le contenu d'une page web
   */
  private async fetchPageContent(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.text();
    } catch (error) {
      console.error('Erreur récupération contenu:', error);
      return null;
    }
  }

  /**
   * Nettoie le contenu HTML pour l'analyse
   */
  private cleanHtmlContent(html: string): string {
    // Supprimer les scripts et styles
    let cleaned = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');

    // Supprimer les commentaires HTML
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

    // Extraire le texte principal (approximatif)
    cleaned = cleaned.replace(/<[^>]+>/g, ' ');

    // Nettoyer les espaces multiples
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Limiter la taille pour l'API
    return cleaned.substring(0, 8000);
  }

  /**
   * Crée le prompt d'analyse pour Gemini avec champs spécifiques par type
   */
  private createAnalysisPrompt(url: string, content: string): string {
    return `
Tu es un expert en analyse d'opportunités professionnelles pour étudiants africains. Analyse ce contenu et extrait les informations structurées.

URL: ${url}
Contenu: ${content}

INSTRUCTIONS:
1. Détermine le type d'opportunité parmi: Emploi, Stage, Bourse, Concours, Conférences
2. Extrait toutes les informations pertinentes SELON LE TYPE
3. Génère un message d'accueil personnalisé pour cette opportunité
4. Évalue ta confiance dans l'analyse (0.0 à 1.0)

RETOURNE UNIQUEMENT un JSON valide avec cette structure EXACTE selon le type:

POUR EMPLOI:
{
  "type": "Emploi",
  "title": "titre exact de l'emploi",
  "organization": "nom de l'entreprise",
  "description": "résumé en 2-3 phrases claires",
  "fullContent": "contenu complet formaté en markdown",
  "deadline": "YYYY-MM-DD ou null",
  "location": "lieu précis ou 'Remote' ou 'Non spécifié'",
  "salary": "salaire proposé ou null",
  "contractType": "CDI|CDD|Stage Pro|Freelance|Prestation ou null",
  "level": "niveau requis ou 'Non spécifié'",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "aiGreeting": "message d'accueil personnalisé",
  "contactEmail": "email de contact ou null",
  "applyMethod": "link|email"
}

POUR STAGE:
{
  "type": "Stage",
  "title": "titre exact du stage",
  "organization": "nom de l'organisation",
  "description": "résumé en 2-3 phrases claires",
  "fullContent": "contenu complet formaté en markdown",
  "deadline": "YYYY-MM-DD ou null",
  "location": "lieu précis ou 'Remote' ou 'Non spécifié'",
  "duration": "durée formatée (ex: 6 MOIS)",
  "level": "niveau requis (ex: Licence 3, Master 1) ou 'Non spécifié'",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "aiGreeting": "message d'accueil personnalisé",
  "contactEmail": "email de contact ou null",
  "applyMethod": "link|email"
}

POUR BOURSE:
{
  "type": "Bourse",
  "title": "titre exact de la bourse",
  "organization": "nom de l'organisation",
  "description": "résumé en 2-3 phrases claires",
  "fullContent": "contenu complet formaté en markdown",
  "deadline": "YYYY-MM-DD ou null",
  "location": "lieu ou pays ou 'International'",
  "reward": "montant de la bourse (ex: 500.000 FCFA/an)",
  "level": "niveau requis ou 'Non spécifié'",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "aiGreeting": "message d'accueil personnalisé",
  "contactEmail": "email de contact ou null",
  "applyMethod": "link|email"
}

POUR CONCOURS:
{
  "type": "Concours",
  "title": "titre exact du concours",
  "organization": "nom de l'organisation",
  "description": "résumé en 2-3 phrases claires",
  "fullContent": "contenu complet formaté en markdown",
  "deadline": "YYYY-MM-DD ou null",
  "location": "lieu du concours ou 'En ligne'",
  "prizes": "prix et récompenses (ex: 1er Prix: 100.000 FCFA + Mentorat)",
  "level": "niveau requis ou 'Tous niveaux'",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "aiGreeting": "message d'accueil personnalisé",
  "contactEmail": "email de contact ou null",
  "applyMethod": "link|email"
}

POUR CONFÉRENCES:
{
  "type": "Conférences",
  "title": "titre exact de la conférence",
  "organization": "nom de l'organisateur",
  "description": "résumé en 2-3 phrases claires",
  "fullContent": "contenu complet formaté en markdown",
  "deadline": "YYYY-MM-DD ou null (date limite d'inscription)",
  "location": "lieu de la conférence ou 'En ligne'",
  "schedule": "horaires (ex: 09:00 - 18:00) ou null",
  "speakers": "intervenants principaux ou null",
  "tags": ["tag1", "tag2", "tag3"],
  "confidence": 0.95,
  "aiGreeting": "message d'accueil personnalisé",
  "contactEmail": "email de contact ou null",
  "applyMethod": "link|email"
}

RÈGLES STRICTES:
1. Le JSON doit commencer par { et finir par }
2. Toutes les clés et valeurs string doivent être entre guillemets doubles
3. Pas de virgule après le dernier élément
4. Pas de commentaires dans le JSON
5. Pas de texte avant ou après le JSON
6. Utilise null pour les champs sans information
7. La confiance doit être un nombre entre 0 et 1
8. SEULS les champs du type sélectionné doivent être présents

RÉPONDS UNIQUEMENT AVEC LE JSON CORRESPONDANT AU TYPE DÉTECTÉ, RIEN D'AUTRE.
`;
  }

  /**
   * Appelle l'API Gemini
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Réponse API Gemini invalide');
    }

    return data.candidates[0].content.parts[0].text;
  }

  /**
   * Parse et valide le résultat de l'IA
   */
  private parseAndValidateResult(result: string, originalUrl: string): AIAnalysisResult | null {
    try {
      // Nettoyer le résultat (supprimer les backticks markdown si présents)
      const cleanResult = result.replace(/```json\n?|\n?```/g, '').trim();

      const parsed = JSON.parse(cleanResult);

      // Validation des champs obligatoires
      if (!parsed.type || !parsed.title || !parsed.organization) {
        throw new Error('Champs obligatoires manquants');
      }

      // Validation du type
      const validTypes = ['Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences'];
      if (!validTypes.includes(parsed.type)) {
        parsed.type = 'Stage'; // Valeur par défaut
      }

      // Validation de la confiance
      if (typeof parsed.confidence !== 'number' || parsed.confidence < 0 || parsed.confidence > 1) {
        parsed.confidence = 0.5;
      }

      // Assurer que les champs requis existent
      const result: AIAnalysisResult = {
        type: parsed.type,
        title: parsed.title || 'Titre non spécifié',
        organization: parsed.organization || 'Organisation non spécifiée',
        description: parsed.description || 'Description non disponible',
        fullContent: parsed.fullContent || parsed.description || 'Contenu non disponible',
        deadline: parsed.deadline || undefined,
        location: parsed.location || 'Non spécifié',
        reward: parsed.reward || undefined,
        level: parsed.level || 'Non spécifié',
        tags: Array.isArray(parsed.tags) ? parsed.tags : [],
        confidence: parsed.confidence,
        aiGreeting: parsed.aiGreeting || `Découvrez cette opportunité ${parsed.type.toLowerCase()} chez ${parsed.organization}`,
        contactEmail: parsed.contactEmail || undefined,
        applyMethod: parsed.applyMethod === 'email' ? 'email' : 'link',
        salary: parsed.salary || undefined,
        contractType: parsed.contractType || undefined,
        duration: parsed.duration || undefined,
        prizes: parsed.prizes || undefined,
        speakers: parsed.speakers || undefined,
        schedule: parsed.schedule || undefined
      };

      return result;

    } catch (error) {
      console.error('Erreur parsing résultat IA:', error);
      console.error('Résultat brut:', result);
      return null;
    }
  }

  /**
   * Analyse en lot plusieurs URLs
   */
  async analyzeBatch(urls: string[]): Promise<(AIAnalysisResult | null)[]> {
    const results: (AIAnalysisResult | null)[] = [];

    for (const url of urls) {
      try {
        const result = await this.analyzeOpportunity(url);
        results.push(result);

        // Délai entre les appels pour éviter le rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Erreur analyse ${url}:`, error);
        results.push(null);
      }
    }

    return results;
  }

  /**
   * Re-analyse une opportunité avec un prompt personnalisé
   */
  async reanalyzeWithCustomPrompt(url: string, customInstructions: string): Promise<AIAnalysisResult | null> {
    try {
      const content = await this.fetchPageContent(url);
      if (!content) return null;

      const cleanContent = this.cleanHtmlContent(content);
      const customPrompt = `
${this.createAnalysisPrompt(url, cleanContent)}

INSTRUCTIONS SUPPLÉMENTAIRES:
${customInstructions}
`;

      const result = await this.callGeminiAPI(customPrompt);
      return this.parseAndValidateResult(result, url);

    } catch (error) {
      console.error('Erreur re-analyse IA:', error);
      return null;
    }
  }
}

// Instance singleton
export const aiAnalysisService = AIAnalysisService.getInstance();