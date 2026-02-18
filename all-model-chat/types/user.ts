import { OpportunityType } from './opportunity';

export type EducationLevel =
  | 'Licence 1'
  | 'Licence 2'
  | 'Licence 3'
  | 'Master 1'
  | 'Master 2'
  | 'Doctorat'
  | 'Diplômé';

export interface UserProfile {
  // Auth (Supabase)
  id: string;
  email: string;
  created_at?: string;
  last_login_at?: string;

  // Identité
  display_name: string;
  avatar_url?: string;
  phone?: string;

  // Académique
  university?: string;
  field_of_study?: string;
  education_level?: EducationLevel;
  graduation_year?: number;

  // Professionnel
  skills?: string[];
  experience_years?: number;
  current_position?: string;
  cv_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  bio?: string;

  // Préférences
  preferred_types?: OpportunityType[];
  preferred_locations?: string[];
  availability_date?: string;
  salary_expectation?: string;

  // Activité
  favorites?: string[];
  application_count?: number;

  // Onboarding
  onboarding_completed?: boolean;
}
