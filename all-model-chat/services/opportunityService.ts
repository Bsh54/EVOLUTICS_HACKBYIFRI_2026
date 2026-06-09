
import { supabase } from './supabaseClient';
import { Opportunity } from '../types/opportunity';
import { mockOpportunities } from '../data/mockOpportunities';

// mapping Frontend (camelCase) -> DB (snake_case)
const toDbFormat = (opp: Opportunity) => {
  // nettoyer le champ schedule si invalide
  let cleanSchedule = opp.schedule;
  if (cleanSchedule) {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(cleanSchedule)) {
      console.log(`Format schedule invalide pour ${opp.id}: "${cleanSchedule}" - conversion en null`);
      cleanSchedule = null;
    }
  }

  return {
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
    schedule: cleanSchedule,
    ai_greeting: opp.aiGreeting,
    is_partner: opp.isPartner
  };
};

// mapping DB (snake_case) -> Frontend (camelCase)
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
  // récupérer toutes les opportunités
  async getAll(): Promise<Opportunity[]> {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .or(`deadline.is.null,deadline.gte.${today}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur Supabase (getAll):', error);
      // En cas d'erreur réseau, on affiche les données fictives
      return mockOpportunities;
    }

    const real = (data || []).map(fromDbFormat);
    // Si la base est vide, on affiche les opportunités de démonstration
    return real.length > 0 ? real : mockOpportunities;
  },

  // créer une nouvelle opportunité
  async create(opp: Opportunity): Promise<void> {
    const { error } = await supabase
      .from('opportunities')
      .insert([toDbFormat(opp)]);

    if (error) {
      console.error('Erreur Supabase (create):', error);
      throw error;
    }
  },

  // mettre à jour une opportunité
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

  // supprimer une opportunité
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
