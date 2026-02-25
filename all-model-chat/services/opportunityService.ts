
import { supabase } from './supabaseClient';
import { Opportunity } from '../types/opportunity';

// Mapping Frontend (camelCase) -> DB (snake_case)
const toDbFormat = (opp: Opportunity) => ({
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
  status: opp.status,
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
  is_partner: opp.isPartner
});

// Mapping DB (snake_case) -> Frontend (camelCase)
const fromDbFormat = (dbRow: any): Opportunity => ({
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
  status: dbRow.status,
  reward: dbRow.reward,
  tags: dbRow.tags,
  salary: dbRow.salary,
  contractType: dbRow.contract_type,
  duration: dbRow.duration,
  level: dbRow.level,
  prizes: dbRow.prizes,
  speakers: dbRow.speakers,
  schedule: dbRow.schedule,
  aiGreeting: dbRow.ai_greeting,
  isPartner: dbRow.is_partner
});

export const opportunityService = {
  // Récupérer toutes les opportunités
  async getAll(): Promise<Opportunity[]> {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase (getAll):', error);
      throw error;
    }

    return (data || []).map(fromDbFormat);
  },

  // Créer une nouvelle opportunité
  async create(opp: Opportunity): Promise<void> {
    const { error } = await supabase
      .from('opportunities')
      .insert([toDbFormat(opp)]);

    if (error) {
      console.error('Erreur Supabase (create):', error);
      throw error;
    }
  },

  // Mettre à jour une opportunité existante
  async update(opp: Opportunity): Promise<void> {
    const { error } = await supabase
      .from('opportunities')
      .update(toDbFormat(opp))
      .eq('id', opp.id);

    if (error) {
      console.error('Erreur Supabase (update):', error);
      throw error;
    }
  },

  // Supprimer une opportunité
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erreur Supabase (delete):', error);
      throw error;
    }
  }
};
