/**
 * API Endpoint pour recevoir les opportunités analysées par Google Apps Script
 * POST /api/pending-opportunities
 */

import { supabase } from '../services/supabaseClient';
import { PendingOpportunity } from '../types/pendingOpportunity';

// Configuration CORS pour permettre les requêtes depuis Apps Script
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function handlePendingOpportunityAPI(request: Request): Promise<Response> {
  // Gérer les requêtes OPTIONS (preflight CORS)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // Seules les requêtes POST sont acceptées
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Méthode non autorisée' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Parser le body JSON
    const body = await request.json();
    console.log('📥 Données reçues du Google Apps Script:', body);

    // Validation des données requises
    if (!body.title || !body.organization || !body.type) {
      return new Response(JSON.stringify({
        error: 'Champs requis manquants: title, organization, type'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Préparer les données pour insertion
    const pendingOpportunity = {
      id: crypto.randomUUID(),
      type: body.type,
      title: body.title,
      organization: body.organization,
      description: body.description || '',
      full_content: body.fullContent || body.full_content || '',
      deadline: body.deadline,
      location: body.location || 'Non spécifié',
      image: body.image,
      link: body.link || body.source_url || body.sourceUrl,
      contact_email: body.contactEmail || body.contact_email,
      apply_method: body.applyMethod || body.apply_method || 'link',
      reward: body.reward,
      tags: body.tags || [],
      salary: body.salary,
      contract_type: body.contractType || body.contract_type,
      duration: body.duration,
      level: body.level || 'Non spécifié',
      prizes: body.prizes,
      speakers: body.speakers,
      schedule: body.schedule,
      ai_greeting: body.aiGreeting || body.ai_greeting,

      // Métadonnées IA
      source_url: body.source_url || body.sourceUrl || body.link,
      ai_confidence: body.confidence || body.ai_confidence || 0.7,
      ai_processed: true,
      status: 'pending',
      admin_notes: null,
      reviewed_by: null,
      reviewed_at: null,
      original_content: body.original_content || body.originalContent,
      extracted_data: body.extracted_data || {
        title: body.title,
        organization: body.organization,
        type: body.type,
        confidence: body.confidence || 0.7
      },

      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('💾 Insertion dans pending_opportunities...');

    // Insérer dans Supabase
    const { data, error } = await supabase
      .from('pending_opportunities')
      .insert([pendingOpportunity])
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return new Response(JSON.stringify({
        error: 'Erreur base de données',
        details: error.message
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('✅ Opportunité créée avec succès:', data.id);

    // Réponse de succès
    return new Response(JSON.stringify({
      success: true,
      message: 'Opportunité ajoutée à la file d\'attente',
      id: data.id,
      status: 'pending'
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('💥 Erreur traitement requête:', error);

    return new Response(JSON.stringify({
      error: 'Erreur serveur',
      details: error instanceof Error ? error.message : 'Erreur inconnue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

// Export pour utilisation dans un serveur Express ou similaire
export default handlePendingOpportunityAPI;