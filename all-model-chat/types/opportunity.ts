export type OpportunityType = 'Emploi' | 'Stage' | 'Bourse' | 'Concours' | 'Conférences';

export interface Opportunity {
  id: string;
  type: OpportunityType;
  title?: string;
  organization?: string;
  description?: string;
  fullContent?: string;
  deadline?: string;
  location?: string;
  image?: string;
  link?: string;
  contactEmail?: string;
  applyMethod?: 'link' | 'email';
  status?: 'Ouvert' | 'Bientôt fini' | 'Fermé';
  reward?: string;
  tags?: string[];
  // Champs dynamiques
  salary?: string;
  contractType?: string;
  duration?: string;
  level?: string;
  prizes?: string;
  speakers?: string;
  schedule?: string;
  // Champs IA Pré-générés
  aiGreeting?: string;
}
