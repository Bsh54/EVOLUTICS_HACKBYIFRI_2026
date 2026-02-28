// ============================================================
// CORRECTION CONFIGURATION SUPABASE - REMPLACER DANS VOTRE SCRIPT
// ============================================================

const CONFIG = {
  // ... autres configurations ...

  // Configuration Base de données - CORRIGER CES VALEURS
  supabaseUrl: "https://bzcmpulivznmzbjggbyh.supabase.co",
  supabaseKey: "REMPLACER_PAR_VOTRE_SERVICE_ROLE_KEY", // ⚠️ Utiliser la SERVICE ROLE KEY, pas l'anon key

  // ... reste de la configuration ...
};

// ============================================================
// FONCTION CORRIGÉE POUR L'ENVOI VERS SUPABASE
// ============================================================

/**
 * Envoie les données vers Supabase avec la service_role key
 */
function envoyerVersSupabase(payload) {
  return UrlFetchApp.fetch(`${CONFIG.supabaseUrl}/rest/v1/pending_opportunities`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CONFIG.supabaseKey}`, // Service role key
      'apikey': CONFIG.supabaseKey, // Service role key
      'Prefer': 'return=minimal'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

// ============================================================
// INSTRUCTIONS DE CONFIGURATION
// ============================================================

/*
ÉTAPES POUR CORRIGER L'ERREUR 401 :

1. Dans Supabase Dashboard :
   - Aller dans https://supabase.com/dashboard/project/bzcmpulivznmzbjggbyh/settings/api
   - Copier la clé "service_role" (commence généralement par "eyJ...")
   - ⚠️ NE PAS utiliser l'anon key (celle qui commence par "sb_publishable_")

2. Dans votre script Apps Script :
   - Remplacer la valeur de CONFIG.supabaseKey par votre service_role key
   - La service_role key bypasse automatiquement les politiques RLS

3. Tester à nouveau :
   - Exécuter executionAutomatique()
   - Les opportunités devraient maintenant s'insérer sans erreur 401

EXEMPLE DE CONFIGURATION CORRECTE :
supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdn..."

⚠️ SÉCURITÉ : La service_role key est très puissante, gardez-la secrète !
*/