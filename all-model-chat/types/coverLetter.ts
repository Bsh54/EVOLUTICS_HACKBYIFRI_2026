// Types pour les lettres de motivation

export type CoverLetterTone = 'formal' | 'dynamic' | 'creative';

export interface CoverLetter {
  id: string;
  user_id: string;
  opportunity_id?: string;
  opportunity_title?: string;
  opportunity_organization?: string;
  
  // Contenu
  content: string;
  tone: CoverLetterTone;
  
  // Métadonnées
  title: string;
  is_favorite: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface CoverLetterGenerationParams {
  userProfile: {
    display_name: string;
    email?: string;
    phone?: string;
    university?: string;
    field_of_study?: string;
    education_level?: string;
    skills?: string[];
    experience_years?: number;
    current_position?: string;
    bio?: string;
  };
  opportunity?: {
    title: string;
    organization: string;
    type: string;
    description?: string;
    fullContent?: string;
  };
  tone: CoverLetterTone;
  additionalInfo?: string;
}

export interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  style: 'classic' | 'modern' | 'creative' | 'minimal';
}
