
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("ERREUR SUPABASE: Les variables d'environnement VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont manquantes.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
