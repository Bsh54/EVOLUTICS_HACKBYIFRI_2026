import { supabaseAdmin } from './supabaseClient';
import { PendingOpportunity, AIAnalysisResult, QueueStats } from '../types/pendingOpportunity';
import { withSupabaseRetry } from './supabaseErrorHandler';

// Mapping Frontend (camelCase) -> DB (snake_case)
const toDbFormat = (opp: PendingOpportunity) => ({
  id: opp.id,
  type: opp.type,
  title: opp.title,
  organization: opp.organization,
  description: opp.description,
  full_content: opp.fullContent,
  deadline: opp.deadline,
  location: opp.location,
  image: opp.image,
  link: opp.link,
  contact_email: opp.contactEmail,
  apply_method: opp.applyMethod,
  reward: opp.reward,
  tags: opp.tags,
  salary: opp.salary,
  contract_type: opp.contractType,
  duration: opp.duration,
  level: opp.level,
  prizes: opp.prizes,
  speakers: opp.speakers,
  schedule: opp.schedule,
  ai_greeting: opp.aiGreeting,

  // Métadonnées IA
  source_url: opp.sourceUrl,
  ai_confidence: opp.aiConfidence,
  ai_processed: opp.aiProcessed,

  // Statut de validation
  status: opp.status,
  admin_notes: opp.adminNotes,
  reviewed_by: opp.reviewedBy,
  reviewed_at: opp.reviewedAt,

  // Données originales
  original_content: opp.originalContent,
  extracted_data: opp.extractedData,

  created_at: opp.createdAt,
  updated_at: opp.updatedAt
});

// Mapping DB (snake_case) -> Frontend (camelCase)
const fromDbFormat = (dbRow: any): PendingOpportunity => ({
  id: dbRow.id,
  type: dbRow.type,
  title: dbRow.title,
  organization: dbRow.organization,
  description: dbRow.description,
  fullContent: dbRow.full_content,
  deadline: dbRow.deadline,
  location: dbRow.location,
  image: dbRow.image,
  link: dbRow.link,
  contactEmail: dbRow.contact_email,
  applyMethod: dbRow.apply_method,
  reward: dbRow.reward,
  tags: dbRow.tags || [],
  salary: dbRow.salary,
  contractType: dbRow.contract_type,
  duration: dbRow.duration,
  level: dbRow.level,
  prizes: dbRow.prizes,
  speakers: dbRow.speakers,
  schedule: dbRow.schedule,
  aiGreeting: dbRow.ai_greeting,

  // Métadonnées IA
  sourceUrl: dbRow.source_url,
  aiConfidence: dbRow.ai_confidence || 0,
  aiProcessed: dbRow.ai_processed || false,

  // Statut de validation
  status: dbRow.status || 'pending',
  adminNotes: dbRow.admin_notes,
  reviewedBy: dbRow.reviewed_by,
  reviewedAt: dbRow.reviewed_at,

  // Données originales
  originalContent: dbRow.original_content,
  extractedData: dbRow.extracted_data,

  createdAt: dbRow.created_at,
  updatedAt: dbRow.updated_at
});

export const pendingOpportunityService = {
  // Récupérer toutes les opportunités en attente (filtre automatiquement les expirées)
  async getAll(status?: string): Promise<PendingOpportunity[]> {
    return withSupabaseRetry(async () => {
      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

      let query = supabaseAdmin
        .from('pending_opportunities')
        .select('*')
        .or(`deadline.is.null,deadline.gte.${today}`) // Inclut les opportunités sans deadline OU avec deadline >= aujourd'hui
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(fromDbFormat);
    }, 'getAll pending');
  },

  // Récupérer les opportunités avec pagination
  async getPaginated(status?: string, page: number = 0, pageSize: number = 10): Promise<{ data: PendingOpportunity[], hasMore: boolean, total: number }> {
    return withSupabaseRetry(async () => {
      const today = new Date().toISOString().split('T')[0];
      const from = page * pageSize;
      const to = from + pageSize - 1;

      let query = supabaseAdmin
        .from('pending_opportunities')
        .select('*', { count: 'exact' })
        .or(`deadline.is.null,deadline.gte.${today}`)
        .order('created_at', { ascending: false })
        .range(from, to);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data: (data || []).map(fromDbFormat),
        hasMore: count ? (from + pageSize) < count : false,
        total: count || 0
      };
    }, 'getPaginated pending');
  },

  // Récupérer une opportunité spécifique
  async getById(id: string): Promise<PendingOpportunity | null> {
    const { data, error } = await supabaseAdmin
      .from('pending_opportunities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      console.error('Erreur Supabase (getById pending):', error);
      throw error;
    }

    return fromDbFormat(data);
  },

  // Créer une nouvelle opportunité en attente
  async create(opp: Partial<PendingOpportunity>): Promise<PendingOpportunity> {
    const newOpp: PendingOpportunity = {
      id: crypto.randomUUID(),
      type: 'Stage',
      status: 'pending',
      aiProcessed: false,
      aiConfidence: 0,
      sourceUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      ...opp
    } as PendingOpportunity;

    const { data, error } = await supabaseAdmin
      .from('pending_opportunities')
      .insert([toDbFormat(newOpp)])
      .select()
      .single();

    if (error) {
      console.error('Erreur Supabase (create pending):', error);
      throw error;
    }

    return fromDbFormat(data);
  },

  // Mettre à jour une opportunité en attente
  async update(id: string, updates: Partial<PendingOpportunity>): Promise<void> {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('pending_opportunities')
      .update(toDbFormat(updateData as PendingOpportunity))
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase (update pending):', error);
      throw error;
    }
  },

  // Mettre à jour le statut avec notes admin
  async updateStatus(id: string, status: string, adminNotes?: string, reviewedBy?: string): Promise<void> {
    const updates: any = {
      status,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (adminNotes) updates.admin_notes = adminNotes;
    if (reviewedBy) updates.reviewed_by = reviewedBy;

    const { error } = await supabaseAdmin
      .from('pending_opportunities')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase (updateStatus pending):', error);
      throw error;
    }
  },

  // Approuver et déplacer vers opportunities
  async approve(id: string, adminNotes?: string, reviewedBy?: string): Promise<void> {
    // 1. Récupérer l'opportunité
    const pendingOpp = await this.getById(id);
    if (!pendingOpp) throw new Error('Opportunité non trouvée');

    // 2. Créer dans opportunities
    const { error: createError } = await supabaseAdmin
      .from('opportunities')
      .insert([{
        id: pendingOpp.id,
        type: pendingOpp.type,
        title: pendingOpp.title,
        organization: pendingOpp.organization,
        description: pendingOpp.description,
        full_content: pendingOpp.fullContent,
        deadline: pendingOpp.deadline,
        location: pendingOpp.location,
        image: pendingOpp.image,
        link: pendingOpp.link,
        contact_email: pendingOpp.contactEmail,
        apply_method: pendingOpp.applyMethod,
        status: 'Ouvert',
        reward: pendingOpp.reward,
        tags: pendingOpp.tags,
        salary: pendingOpp.salary,
        contract_type: pendingOpp.contractType,
        duration: pendingOpp.duration,
        level: pendingOpp.level,
        prizes: pendingOpp.prizes,
        speakers: pendingOpp.speakers,
        schedule: pendingOpp.schedule,
        ai_greeting: pendingOpp.aiGreeting,
        created_at: new Date().toISOString()
      }]);

    if (createError) {
      console.error('Erreur création opportunity:', createError);
      throw createError;
    }

    // 3. Mettre à jour le statut en approved
    await this.updateStatus(id, 'approved', adminNotes, reviewedBy);
  },

  // Rejeter une opportunité
  async reject(id: string, reason: string, reviewedBy?: string): Promise<void> {
    await this.updateStatus(id, 'rejected', reason, reviewedBy);
  },

  // Supprimer une opportunité en attente
  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('pending_opportunities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase (delete pending):', error);
      throw error;
    }
  },

  // Obtenir les statistiques de la file d'attente
  async getStats(): Promise<QueueStats> {
    const { data, error } = await supabaseAdmin
      .from('pending_opportunities')
      .select('status, ai_confidence, created_at');

    if (error) {
      console.error('Erreur Supabase (getStats):', error);
      throw error;
    }

    const stats = data.reduce((acc, item) => {
      acc.total++;
      acc[item.status as keyof QueueStats]++;
      return acc;
    }, {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      processing: 0
    } as any);

    // Calculer la confiance moyenne
    const confidences = data
      .filter(item => item.ai_confidence)
      .map(item => item.ai_confidence);

    stats.averageConfidence = confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

    // Activité récente (dernières 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const recentData = data.filter(item =>
      new Date(item.created_at) > yesterday
    );

    stats.recentActivity = {
      approved: recentData.filter(item => item.status === 'approved').length,
      rejected: recentData.filter(item => item.status === 'rejected').length,
      processed: recentData.filter(item => item.status !== 'pending').length
    };

    return stats;
  },

  // Rechercher dans les opportunités en attente
  async search(query: string, status?: string): Promise<PendingOpportunity[]> {
    let supabaseQuery = supabaseAdmin
      .from('pending_opportunities')
      .select('*')
      .or(`title.ilike.%${query}%,organization.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (status) {
      supabaseQuery = supabaseQuery.eq('status', status);
    }

    const { data, error } = await supabaseQuery;

    if (error) {
      console.error('Erreur Supabase (search pending):', error);
      throw error;
    }

    return (data || []).map(fromDbFormat);
  }
};