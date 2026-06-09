import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  fr: {
    // Navigation
    'nav.explore': 'EXPLORER',
    'nav.assistant': 'ASSISTANT',
    'nav.tools': 'OUTILS',
    'nav.profile': 'PROFIL',
    
    // Landing Page
    'landing.title': 'Bienvenue sur EVOLUTICS',
    'landing.subtitle': 'Votre plateforme de développement de carrière',
    'landing.cta': 'Commencer',
    'landing.login': 'Se connecter',
    
    // Auth
    'auth.login': 'Connexion',
    'auth.signup': 'Inscription',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.fullName': 'Nom complet',
    'auth.googleLogin': 'Continuer avec Google',
    'auth.noAccount': 'Pas de compte ?',
    'auth.hasAccount': 'Déjà un compte ?',
    'auth.forgotPassword': 'Mot de passe oublié ?',
    
    // Onboarding
    'onboarding.welcome': 'Bienvenue sur EVOLUTICS',
    'onboarding.subtitle': 'Parlez-nous un peu de vous pour personnaliser votre expérience.',
    'onboarding.identity': 'Identité',
    'onboarding.education': 'Formation',
    'onboarding.experience': 'Expérience',
    'onboarding.preferences': 'Préférences',
    'onboarding.fullName': 'Nom complet',
    'onboarding.bio': 'Bio',
    'onboarding.next': 'SUIVANT',
    'onboarding.previous': 'Précédent',
    'onboarding.skip': 'Passer cette étape et compléter plus tard',
    'onboarding.complete': 'Terminer',
    
    // Opportunities
    'opportunities.title': 'Opportunités',
    'opportunities.search': 'Rechercher des opportunités...',
    'opportunities.filter': 'Filtrer',
    'opportunities.type': 'Type',
    'opportunities.all': 'Tous',
    'opportunities.internship': 'Stage',
    'opportunities.job': 'Emploi',
    'opportunities.scholarship': 'Bourse',
    'opportunities.training': 'Formation',
    'opportunities.competition': 'Concours',
    'opportunities.noResults': 'Aucune opportunité trouvée',
    'opportunities.loading': 'Chargement...',
    'opportunities.applyNow': 'Postuler',
    'opportunities.deadline': 'Date limite',
    'opportunities.location': 'Lieu',
    'opportunities.organization': 'Organisation',
    
    // Tools
    'tools.title': 'Outils de Carrière',
    'tools.cvBuilder': 'Créateur de CV',
    'tools.cvBuilder.desc': 'Créez un CV professionnel adapté à vos opportunités',
    'tools.coverLetter': 'Lettre de Motivation',
    'tools.coverLetter.desc': 'Générez des lettres de motivation personnalisées',
    'tools.interview': 'Simulation d\'Entretien',
    'tools.interview.desc': 'Entraînez-vous avec notre simulateur vocal intelligent',
    'tools.comingSoon': 'Bientôt disponible',
    
    // Interview Simulator
    'interview.title': 'Simulation d\'Entretien Vocal',
    'interview.report': 'Rapport d\'Entretien',
    'interview.voiceSetup': 'Configuration de la Voix',
    'interview.chooseVoice': 'Choisissez la voix de l\'IA pour votre entretien',
    'interview.aiVoice': 'Voix de l\'IA :',
    'interview.speechSpeed': 'Vitesse de parole :',
    'interview.slow': 'Lent',
    'interview.normal': 'Normal',
    'interview.fast': 'Rapide',
    'interview.continue': 'Continuer',
    'interview.preparing': 'Préparation des questions...',
    'interview.question': 'Question',
    'interview.listening': 'Parlez maintenant, je vous écoute',
    'interview.processing': 'Analyse de votre réponse...',
    'interview.aiAsking': 'L\'IA pose la question...',
    'interview.aiFeedback': 'L\'IA donne son feedback...',
    'interview.sendAnswer': 'Envoyer ma Réponse',
    'interview.startInterview': 'Commencer l\'Entretien',
    'interview.globalScore': 'Score Global',
    'interview.globalFeedback': 'Feedback Global',
    'interview.questionDetails': 'Détail par Question',
    'interview.previousFeedback': 'Question Précédente:',
    'interview.finish': 'Terminer',
    
    // Profile
    'profile.title': 'Mon Profil',
    'profile.edit': 'Modifier',
    'profile.save': 'Enregistrer',
    'profile.logout': 'Se déconnecter',
    'profile.personalInfo': 'Informations personnelles',
    'profile.education': 'Formation',
    'profile.experience': 'Expérience',
    'profile.skills': 'Compétences',
    
    // Admin
    'admin.title': 'Administration',
    'admin.pendingOpportunities': 'Opportunités en attente',
    'admin.approve': 'Approuver',
    'admin.reject': 'Rejeter',
    'admin.edit': 'Modifier',
    'admin.showing': 'Affichées:',
    'admin.total': 'Total',
    'admin.loadMore': 'Charger plus',
    'admin.noMore': 'Toutes les opportunités ont été chargées',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.close': 'Fermer',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.yes': 'Oui',
    'common.no': 'Non',
  },
  en: {
    // Navigation
    'nav.explore': 'EXPLORE',
    'nav.assistant': 'ASSISTANT',
    'nav.tools': 'TOOLS',
    'nav.profile': 'PROFILE',
    
    // Landing Page
    'landing.title': 'Welcome to EVOLUTICS',
    'landing.subtitle': 'Your career development platform',
    'landing.cta': 'Get Started',
    'landing.login': 'Sign In',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.signup': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.fullName': 'Full Name',
    'auth.googleLogin': 'Continue with Google',
    'auth.noAccount': 'No account?',
    'auth.hasAccount': 'Already have an account?',
    'auth.forgotPassword': 'Forgot password?',
    
    // Onboarding
    'onboarding.welcome': 'Welcome to EVOLUTICS',
    'onboarding.subtitle': 'Tell us a bit about yourself to personalize your experience.',
    'onboarding.identity': 'Identity',
    'onboarding.education': 'Education',
    'onboarding.experience': 'Experience',
    'onboarding.preferences': 'Preferences',
    'onboarding.fullName': 'Full Name',
    'onboarding.bio': 'Bio',
    'onboarding.next': 'NEXT',
    'onboarding.previous': 'Previous',
    'onboarding.skip': 'Skip this step and complete later',
    'onboarding.complete': 'Complete',
    
    // Opportunities
    'opportunities.title': 'Opportunities',
    'opportunities.search': 'Search opportunities...',
    'opportunities.filter': 'Filter',
    'opportunities.type': 'Type',
    'opportunities.all': 'All',
    'opportunities.internship': 'Internship',
    'opportunities.job': 'Job',
    'opportunities.scholarship': 'Scholarship',
    'opportunities.training': 'Training',
    'opportunities.competition': 'Competition',
    'opportunities.noResults': 'No opportunities found',
    'opportunities.loading': 'Loading...',
    'opportunities.applyNow': 'Apply Now',
    'opportunities.deadline': 'Deadline',
    'opportunities.location': 'Location',
    'opportunities.organization': 'Organization',
    
    // Tools
    'tools.title': 'Career Tools',
    'tools.cvBuilder': 'CV Builder',
    'tools.cvBuilder.desc': 'Create a professional CV tailored to your opportunities',
    'tools.coverLetter': 'Cover Letter',
    'tools.coverLetter.desc': 'Generate personalized cover letters',
    'tools.interview': 'Interview Simulator',
    'tools.interview.desc': 'Practice with our intelligent voice simulator',
    'tools.comingSoon': 'Coming Soon',
    
    // Interview Simulator
    'interview.title': 'Voice Interview Simulation',
    'interview.report': 'Interview Report',
    'interview.voiceSetup': 'Voice Configuration',
    'interview.chooseVoice': 'Choose the AI voice for your interview',
    'interview.aiVoice': 'AI Voice:',
    'interview.speechSpeed': 'Speech speed:',
    'interview.slow': 'Slow',
    'interview.normal': 'Normal',
    'interview.fast': 'Fast',
    'interview.continue': 'Continue',
    'interview.preparing': 'Preparing questions...',
    'interview.question': 'Question',
    'interview.listening': 'Speak now, I\'m listening',
    'interview.processing': 'Analyzing your answer...',
    'interview.aiAsking': 'AI is asking the question...',
    'interview.aiFeedback': 'AI is giving feedback...',
    'interview.sendAnswer': 'Send My Answer',
    'interview.startInterview': 'Start Interview',
    'interview.globalScore': 'Overall Score',
    'interview.globalFeedback': 'Overall Feedback',
    'interview.questionDetails': 'Question Details',
    'interview.previousFeedback': 'Previous Question:',
    'interview.finish': 'Finish',
    
    // Profile
    'profile.title': 'My Profile',
    'profile.edit': 'Edit',
    'profile.save': 'Save',
    'profile.logout': 'Sign Out',
    'profile.personalInfo': 'Personal Information',
    'profile.education': 'Education',
    'profile.experience': 'Experience',
    'profile.skills': 'Skills',
    
    // Admin
    'admin.title': 'Administration',
    'admin.pendingOpportunities': 'Pending Opportunities',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.edit': 'Edit',
    'admin.showing': 'Showing:',
    'admin.total': 'Total',
    'admin.loadMore': 'Load More',
    'admin.noMore': 'All opportunities have been loaded',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.yes': 'Yes',
    'common.no': 'No',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['fr']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
