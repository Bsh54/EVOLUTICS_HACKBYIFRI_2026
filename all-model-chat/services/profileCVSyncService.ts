import { CVData } from '../types/cvTypes';
import { UserProfile } from '../types/user';
import { authService } from '../services/authService';

// Mapping des champs entre UserProfile et CVData
export interface FieldMapping {
  cvField: keyof CVData | string; // Support des champs imbriqués avec notation dot
  profileField: keyof UserProfile;
  transform?: {
    toCV?: (profileValue: any) => any;
    toProfile?: (cvValue: any) => any;
  };
}

// Configuration du mapping bidirectionnel
export const PROFILE_CV_MAPPING: FieldMapping[] = [
  // Identité de base
  {
    cvField: 'fullName',
    profileField: 'display_name'
  },
  {
    cvField: 'title',
    profileField: 'current_position'
  },
  {
    cvField: 'contact.email',
    profileField: 'email'
  },
  {
    cvField: 'contact.phone',
    profileField: 'phone'
  },
  {
    cvField: 'profileImage',
    profileField: 'avatar_url'
  },
  {
    cvField: 'about',
    profileField: 'bio'
  },
  {
    cvField: 'contact.linkedin',
    profileField: 'linkedin_url'
  },
  // Compétences avec transformation
  {
    cvField: 'skills',
    profileField: 'skills',
    transform: {
      toCV: (profileSkills: string[]) =>
        profileSkills?.map(skill => ({ name: skill, level: 80 })) || [],
      toProfile: (cvSkills: Array<{name: string, level: number}>) =>
        cvSkills?.map(skill => skill.name) || []
    }
  },
  // Formation avec transformation complexe
  {
    cvField: 'education',
    profileField: 'university',
    transform: {
      toCV: (profileValue: any, profile: UserProfile) => {
        if (!profile.university) return [];
        return [{
          degree: `${profile.education_level || 'Diplôme'} en ${profile.field_of_study || 'Formation'}`,
          school: profile.university,
          startDate: profile.graduation_year ? (profile.graduation_year - 3).toString() : '',
          endDate: profile.graduation_year?.toString() || '',
          isCurrent: false
        }];
      },
      toProfile: (cvEducation: any[]) => {
        // Prendre la première formation pour mettre à jour le profil
        return cvEducation?.[0]?.school || '';
      }
    }
  }
];

// Utilitaire pour accéder aux propriétés imbriquées
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

export class ProfileCVSyncService {
  /**
   * Synchronise les données du profil vers le CV
   */
  static syncProfileToCV(profile: UserProfile, existingCVData?: CVData): CVData {
    // Données CV par défaut avec exemples pour prévisualisation
    const defaultCVData: CVData = {
      fullName: "Votre Nom",
      title: "Votre Titre Professionnel",
      color: "#00a99d",
      profileImage: "",
      contact: {
        phone: "+33 6 12 34 56 78",
        email: "votre.email@exemple.com",
        address: "Votre Adresse, Ville",
        linkedin: "linkedin.com/in/votre-profil"
      },
      about: "Décrivez votre profil professionnel ici...",
      objective: "Votre objectif de carrière",
      experiences: [
        {
          title: "Poste Actuel",
          company: "Entreprise Actuelle",
          startDate: "2022",
          endDate: "",
          isCurrent: true,
          description: "Description de vos responsabilités et réalisations principales..."
        },
        {
          title: "Poste Précédent",
          company: "Entreprise Précédente",
          startDate: "2020",
          endDate: "2022",
          isCurrent: false,
          description: "Description de votre expérience précédente..."
        }
      ],
      education: [
        {
          degree: "Master en Informatique",
          school: "Université/École",
          startDate: "2018",
          endDate: "2020",
          isCurrent: false
        }
      ],
      certifications: [
        {
          name: "Certification Professionnelle",
          issuer: "Organisme Certificateur",
          date: "2023"
        }
      ],
      skills: [
        { name: "JavaScript", level: 85 },
        { name: "React", level: 80 },
        { name: "Node.js", level: 75 },
        { name: "Python", level: 70 }
      ],
      tools: [
        { name: "VS Code", level: 90 },
        { name: "Git", level: 85 },
        { name: "Docker", level: 70 }
      ],
      links: [
        {
          name: "Portfolio",
          url: "https://votre-portfolio.com"
        },
        {
          name: "GitHub",
          url: "https://github.com/votre-username"
        }
      ],
      languages: [
        { name: "Français", level: "Natif" },
        { name: "Anglais", level: "Courant" },
        { name: "Espagnol", level: "Intermédiaire" }
      ],
      hobbies: [
        "Développement open source",
        "Photographie",
        "Voyage"
      ],
      references: [
        {
          name: "Nom du Référent",
          position: "Poste du Référent",
          company: "Entreprise",
          email: "referent@entreprise.com",
          phone: "+33 6 12 34 56 78"
        }
      ],
      strategicPitch: "",
      isOptimized: false,
      sectionsOrder: {
        sidebar: ["contact", "skills", "languages", "hobbies"],
        main: ["about", "experiences", "education", "references"]
      }
    };

    // Commencer avec les données existantes ou les données par défaut
    const cvData = existingCVData ? { ...existingCVData } : { ...defaultCVData };

    // Appliquer le mapping
    PROFILE_CV_MAPPING.forEach(mapping => {
      const profileValue = profile[mapping.profileField];

      if (profileValue !== undefined && profileValue !== null && profileValue !== '') {
        let transformedValue = profileValue;

        // Appliquer la transformation si elle existe
        if (mapping.transform?.toCV) {
          transformedValue = mapping.transform.toCV(profileValue, profile);
        }

        // Définir la valeur dans le CV
        if (mapping.cvField.includes('.')) {
          setNestedValue(cvData, mapping.cvField, transformedValue);
        } else {
          (cvData as any)[mapping.cvField] = transformedValue;
        }
      }
    });

    return cvData;
  }

  /**
   * Synchronise les données du CV vers le profil
   */
  static syncCVToProfile(cvData: CVData, currentProfile: UserProfile): Partial<UserProfile> {
    const profileUpdates: Partial<UserProfile> = {};

    PROFILE_CV_MAPPING.forEach(mapping => {
      const cvValue = mapping.cvField.includes('.')
        ? getNestedValue(cvData, mapping.cvField)
        : (cvData as any)[mapping.cvField];

      if (cvValue !== undefined && cvValue !== null && cvValue !== '') {
        let transformedValue = cvValue;

        // Appliquer la transformation si elle existe
        if (mapping.transform?.toProfile) {
          transformedValue = mapping.transform.toProfile(cvValue);
        }

        // Ne mettre à jour que si la valeur a changé
        const currentValue = currentProfile[mapping.profileField];
        if (currentValue !== transformedValue) {
          (profileUpdates as any)[mapping.profileField] = transformedValue;
        }
      }
    });

    return profileUpdates;
  }

  /**
   * Sauvegarde automatique des modifications CV vers le profil
   */
  static async autoSaveCVToProfile(cvData: CVData, currentProfile: UserProfile): Promise<void> {
    try {
      const profileUpdates = this.syncCVToProfile(cvData, currentProfile);

      // Ne sauvegarder que s'il y a des changements
      if (Object.keys(profileUpdates).length > 0) {
        console.log('🔄 Synchronisation automatique CV → Profil:', profileUpdates);

        // Mettre à jour le profil via le service d'authentification
        await authService.updateProfile(currentProfile.id, profileUpdates);

        console.log('✅ Profil mis à jour automatiquement');
      }
    } catch (error) {
      console.error('❌ Erreur synchronisation CV → Profil:', error);
      // Ne pas bloquer l'utilisateur en cas d'erreur de sync
    }
  }

  /**
   * Détecte quels champs sont synchronisés avec le profil
   */
  static getSyncedFields(): string[] {
    return PROFILE_CV_MAPPING.map(mapping => mapping.cvField);
  }

  /**
   * Vérifie si un champ CV est synchronisé avec le profil
   */
  static isFieldSynced(cvField: string): boolean {
    return PROFILE_CV_MAPPING.some(mapping => mapping.cvField === cvField);
  }
}

export default ProfileCVSyncService;