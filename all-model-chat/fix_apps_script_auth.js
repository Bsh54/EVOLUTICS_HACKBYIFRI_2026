// =====================================================
// CORRECTION GOOGLE APPS SCRIPT - AUTHENTIFICATION SUPABASE
// =====================================================

// Configuration Supabase (à mettre à jour avec vos vraies valeurs)
const SUPABASE_URL = 'https://votre-projet.supabase.co';
const SUPABASE_SERVICE_KEY = 'votre-service-role-key'; // Utiliser la SERVICE ROLE KEY, pas l'anon key

/**
 * Envoie les opportunités analysées vers EVOLUTICS
 */
async function sendToEvolutics(opportunities) {
  console.log(`📤 Envoi de ${opportunities.length} opportunités vers EVOLUTICS...`);

  let successCount = 0;
  let errorCount = 0;

  for (const opportunity of opportunities) {
    try {
      // Préparer les données pour Supabase
      const supabaseData = {
        type: opportunity.type,
        title: opportunity.title,
        organization: opportunity.organization,
        description: opportunity.description,
        full_content: opportunity.fullContent,
        deadline: opportunity.deadline,
        location: opportunity.location,
        reward: opportunity.reward,
        level: opportunity.level,
        tags: opportunity.tags,
        ai_greeting: opportunity.aiGreeting,
        source_url: opportunity.sourceUrl,
        ai_confidence: opportunity.confidence,
        ai_processed: true,
        original_content: opportunity.originalContent,
        extracted_data: opportunity,
        status: opportunity.confidence >= 0.9 ? 'approved' : 'pending',
        contact_email: opportunity.contactEmail,
        apply_method: opportunity.applyMethod || 'link',
        salary: opportunity.salary,
        contract_type: opportunity.contractType,
        duration: opportunity.duration,
        prizes: opportunity.prizes,
        speakers: opportunity.speakers,
        schedule: opportunity.schedule
      };

      // Appel API Supabase avec la SERVICE ROLE KEY
      const response = UrlFetchApp.fetch(`${SUPABASE_URL}/rest/v1/pending_opportunities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`, // SERVICE ROLE KEY pour bypasser RLS
          'Prefer': 'return=minimal'
        },
        payload: JSON.stringify(supabaseData)
      });

      if (response.getResponseCode() === 201) {
        console.log(`✅ ${opportunity.title} envoyé avec succès`);
        successCount++;
      } else {
        console.error(`❌ Erreur envoi ${opportunity.title}: ${response.getResponseCode()}`);
        console.error(`Réponse: ${response.getContentText()}`);
        errorCount++;
      }

      // Délai pour éviter le rate limiting
      Utilities.sleep(500);

    } catch (error) {
      console.error(`❌ Erreur envoi ${opportunity.title}:`, error.toString());
      errorCount++;
    }
  }

  console.log(`📊 Résultats envoi: ${successCount} succès, ${errorCount} erreurs`);
  return { success: successCount, errors: errorCount };
}

// =====================================================
// INSTRUCTIONS DE CONFIGURATION
// =====================================================

/*
ÉTAPES POUR CORRIGER L'ERREUR 401 :

1. Dans Supabase Dashboard :
   - Aller dans Settings > API
   - Copier la "service_role" key (pas l'anon key)
   - Cette clé bypasse les politiques RLS

2. Dans ce script Apps Script :
   - Remplacer SUPABASE_URL par votre vraie URL
   - Remplacer SUPABASE_SERVICE_KEY par votre service role key

3. Exécuter le script SQL fix_rls_policies.sql dans Supabase :
   - Aller dans SQL Editor
   - Coller et exécuter le contenu du fichier
   - Cela met à jour les politiques RLS

4. Tester à nouveau le script
*/