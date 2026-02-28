import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clé de service pour l'interface admin (contourne RLS)
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6Y21wdWxpdnpubXpiamdnYnloIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTIyODk3NSwiZXhwIjoyMDg2ODA0OTc1fQ.JqXTPVBvlDRPVnIuyU2xo7IDQAKtPLgm8BJpbsWOOQY';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERREUR SUPABASE: Les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont manquantes.");
}

// Client principal avec clé anonyme
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client admin avec clé de service (pour pending_opportunities)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);