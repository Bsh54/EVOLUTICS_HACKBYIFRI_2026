import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clé de service pour l'interface admin (contourne RLS)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdnYnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIyODk3NSwiZXhwIjoyMDg2ODA0OTc1fQ.JqXTPVBvlDRPVnIuyU2xo7IDQAKtPLgm8BJpbsWOOQY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERREUR SUPABASE: Les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont manquantes.");
}

// Instance unique avec gestion des conflits de session
let supabaseInstance: any = null;
let supabaseAdminInstance: any = null;

// Client principal avec clé anonyme (singleton)
export const supabase = (() => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'evolutics-auth-token', // Clé unique pour éviter les conflits
        storage: window.localStorage
      }
    });
  }
  return supabaseInstance;
})();

// Client admin avec clé de service (singleton)
export const supabaseAdmin = (() => {
  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false, // Pas de session persistante pour l'admin
        storageKey: 'evolutics-admin-token' // Clé séparée pour l'admin
      }
    });
  }
  return supabaseAdminInstance;
})();