import type { CVData } from "../types/cvTypes";
import { DeepSeekService } from "../services/deepseekService";

const AI_API_URL = import.meta.env.VITE_GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
const AI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function optimizeCVWithAI({ jobOffer, currentData }: { jobOffer: string; currentData: CVData }): Promise<CVData> {
  // 🎭 Interface: L'utilisateur voit "Optimisation avec Gemini AI"
  // 🔧 Backend: DeepSeek traite l'optimisation
  console.log('🎭 [UI: Gemini AI] 🔧 [Backend: DeepSeek] Optimisation CV...');

  const prompt = `
    Rôle : Expert en recrutement stratégique.
    Tâche : Optimise intégralement ce CV pour l'offre fournie.
    Réponds UNIQUEMENT avec un objet JSON complet commençant par { et finissant par }.

    ⚠️ RÈGLES STRICTES - INTERDICTIONS ABSOLUES :
    ❌ N'INVENTE JAMAIS de compétences, expériences, projets ou réalisations qui ne sont PAS dans les données actuelles
    ❌ N'AJOUTE JAMAIS de certifications, diplômes, formations ou outils non mentionnés
    ❌ N'EXAGÈRE JAMAIS les responsabilités ou le niveau d'expertise
    ❌ N'INVENTE JAMAIS de chiffres, statistiques ou résultats quantifiables
    ❌ N'AJOUTE JAMAIS de langues, technologies ou frameworks non listés
    ❌ Ne modifie PAS les dates, entreprises ou postes réels
    
    ✅ OBLIGATIONS :
    ✅ Utilise UNIQUEMENT les informations fournies dans les données actuelles
    ✅ Reformule et optimise les descriptions existantes pour mieux correspondre à l'offre
    ✅ Réorganise les compétences par pertinence pour l'offre (sans en inventer)
    ✅ Ajuste les niveaux de compétences de manière réaliste (entre 70-95)
    ✅ Mets en avant les mots-clés de l'offre UNIQUEMENT s'ils correspondent aux compétences réelles
    ✅ Reste factuel, honnête et vérifiable à 100%

    DONNÉES ACTUELLES (SOURCE DE VÉRITÉ) :
    ${JSON.stringify({
      about: currentData.about,
      experiences: currentData.experiences,
      skills: currentData.skills
    })}

    OFFRE CIBLE : ${jobOffer.substring(0, 800)}

    STRUCTURE JSON ATTENDUE :
    {
      "about": "...",
      "experiences": [{"role": "...", "company": "...", "startDate": "...", "endDate": "...", "isCurrent": boolean, "description": "..."}],
      "skills": [{"name": "...", "level": 90}]
    }
    
    RAPPEL FINAL : Toute information dans le CV optimisé DOIT être traçable dans les données actuelles. En cas de doute, ne modifie pas.
  `;

  try {
    // Utiliser DeepSeek au lieu de Gemini
    const response = await DeepSeekService.chatCompletion([
      { role: 'system', content: 'Tu es un expert en recrutement. Tu réponds exclusivement en JSON pur et valide.' },
      { role: 'user', content: prompt }
    ], {
      temperature: 0.1,
      max_tokens: 2048
    });

    let rawContent = response.choices?.[0]?.message?.content || "";

    if (!rawContent) {
      throw new Error("Réponse vide de DeepSeek");
    }

    // Tentative de réparation du JSON si l'accolade manque
    if (rawContent.trim().startsWith('"about"') || rawContent.trim().startsWith('about')) {
        rawContent = "{" + rawContent;
    }
    if (rawContent.length > 0 && !rawContent.trim().endsWith('}')) {
        rawContent = rawContent + "}";
    }

    const match = rawContent.match(/(\{[\s\S]*\})/);
    if (!match) throw new Error("L'IA n'a pas renvoyé de données structurées.");

    const optimizedData = JSON.parse(match[1].trim());

    console.log('✅ [Backend: DeepSeek] CV optimisé avec succès');

    return {
      ...currentData,
      isOptimized: true,
      about: optimizedData.about || currentData.about,
      experiences: optimizedData.experiences || currentData.experiences,
      skills: optimizedData.skills || currentData.skills
    };
  } catch (error: any) {
    console.error("❌ [Backend: DeepSeek] Erreur optimisation CV:", error.message);
    // On propage l'erreur pour que le bouton de chargement s'arrête et qu'un message s'affiche
    throw new Error("Échec de l'optimisation. Vérifiez votre connexion ou l'offre saisie.");
  }
}