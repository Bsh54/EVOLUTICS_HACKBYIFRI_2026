import { supabase } from './supabaseClient';

// Supabase free tier pauses after ~1 week of inactivity.
// This service sends a lightweight ping every 4 minutes while the app is open.
const PING_INTERVAL_MS = 4 * 60 * 1000;

let intervalId: ReturnType<typeof setInterval> | null = null;

const ping = async () => {
  try {
    // Requête ultra-légère : on demande juste le count, sans ramener de données
    await supabase
      .from('opportunities')
      .select('id', { count: 'exact', head: true });
  } catch {
    // Erreur silencieuse — on ne veut pas polluer la console ni bloquer l'app
  }
};

export const startKeepAlive = () => {
  if (intervalId !== null) return; // déjà démarré
  ping(); // premier ping immédiat au démarrage
  intervalId = setInterval(ping, PING_INTERVAL_MS);
};

export const stopKeepAlive = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
