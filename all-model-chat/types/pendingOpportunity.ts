import { Opportunity } from './opportunity';

export interface PendingOpportunity extends Opportunity {
  // Métadonnées IA
  sourceUrl: string;
  aiConfidence: number;
  aiProcessed: boolean;

  // Statut de validation
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  adminNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;

  // Données originales pour comparaison
  originalContent?: string;
  extractedData?: {
    title?: string;
    organization?: string;
    type?: string;
    confidence?: number;
  };
}

export interface AIAnalysisResult {
  type: 'Emploi' | 'Stage' | 'Bourse' | 'Concours' | 'Conférences';
  title: string;
  organization: string;
  description: string;
  fullContent: string;
  deadline?: string;
  location?: string;
  reward?: string;
  level?: string;
  tags: string[];
  confidence: number;
  aiGreeting: string;
  contactEmail?: string;
  applyMethod?: 'link' | 'email';
  salary?: string;
  contractType?: string;
  duration?: string;
  prizes?: string;
  speakers?: string;
  schedule?: string;
}

export interface QueueStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  processing: number;
  averageConfidence: number;
  recentActivity: {
    approved: number;
    rejected: number;
    processed: number;
  };
}

export interface AdminAction {
  type: 'approve' | 'reject' | 'edit' | 'reanalyze';
  opportunityId: string;
  notes?: string;
  changes?: Partial<PendingOpportunity>;
}