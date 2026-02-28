
import { Theme, ThemeColors } from '../types/theme';

// Nouveau thème sombre élégant avec cohérence de couleur bleue EVOLUTICS
export const MIDNIGHT_THEME_COLORS: ThemeColors = {
  // Backgrounds - Plus doux que le full noir
  bgPrimary: '#0f1419', // Bleu-gris très sombre mais pas noir
  bgSecondary: '#1a1f2e', // Bleu-gris sombre pour sidebar/header
  bgTertiary: '#252a3a', // Hover states plus visibles
  bgAccent: '#3b82f6', // Bleu cohérent avec l'identité EVOLUTICS
  bgAccentHover: '#2563eb', // Bleu plus foncé au hover
  bgDanger: '#ef4444',
  bgDangerHover: '#dc2626',
  bgInput: '#1e2532', // Input avec fond légèrement plus clair
  bgCodeBlock: '#161b22', // Code block avec teinte bleutée
  bgCodeBlockHeader: '#21262d',
  bgUserMessage: '#3b82f6', // Message utilisateur en bleu cohérent
  bgModelMessage: 'rgba(30, 37, 50, 0.3)', // Fond transparent léger
  bgErrorMessage: 'rgba(239, 68, 68, 0.15)',
  bgSuccess: 'rgba(34, 197, 94, 0.15)',
  textSuccess: '#4ade80',
  bgInfo: 'rgba(56, 189, 248, 0.15)',
  textInfo: '#38bdf8',
  bgWarning: 'rgba(245, 158, 11, 0.15)',
  textWarning: '#fbbf24',

  // Text - Contraste élevé mais pas éblouissant
  textPrimary: '#e6edf3', // Blanc cassé pour moins de fatigue oculaire
  textSecondary: '#8b949e', // Gris moyen bien visible
  textTertiary: '#6e7681', // Gris plus foncé mais lisible
  textAccent: '#ffffff',
  textDanger: '#ff7b7b',
  textLink: '#60a5fa', // Bleu néon doux cohérent
  textCode: '#e6edf3',
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#e6edf3',
  bgErrorMessageText: '#ff7b7b',

  // Borders - Visibles mais subtiles
  borderPrimary: '#30363d', // Bordures principales visibles
  borderSecondary: '#21262d', // Bordures secondaires plus subtiles
  borderFocus: '#3b82f6', // Focus en bleu cohérent

  // Scrollbar
  scrollbarThumb: '#484f58',
  scrollbarTrack: '#21262d',

  // Icons - Bien visibles avec effet bleu subtil
  iconUser: '#ffffff',
  iconModel: '#60a5fa', // Bleu néon cohérent
  iconError: '#ff7b7b',
  iconThought: '#8b949e',
  iconSettings: '#8b949e',
  iconClearChat: '#e6edf3',
  iconSend: '#ffffff',
  iconAttach: '#8b949e',
  iconStop: '#ffffff',
  iconEdit: '#8b949e',
  iconHistory: '#8b949e',
};

export const PEARL_THEME_COLORS: ThemeColors = {
  // Backgrounds - Couleurs encore plus douces avec tons chauds
  bgPrimary: '#faf9f7', // Blanc cassé avec une pointe de beige très subtile
  bgSecondary: '#f5f4f2', // Gris très clair avec chaleur
  bgTertiary: '#efede9', // Gris clair beige pour moins d'éblouissement
  bgAccent: '#4f46e5', // Indigo 600
  bgAccentHover: '#4338ca', // Indigo 700
  bgDanger: '#ef4444',
  bgDangerHover: '#dc2626',
  bgInput: '#f7f6f4', // Fond input avec teinte chaude très subtile
  bgCodeBlock: '#f5f4f2', // Code block avec fond chaud
  bgCodeBlockHeader: 'rgba(245, 244, 242, 0.9)',
  bgUserMessage: '#4f46e5', // Indigo 600 - Modern sleek bubble
  bgModelMessage: 'transparent',
  bgErrorMessage: 'rgba(239, 68, 68, 0.1)',
  bgSuccess: 'rgba(34, 197, 94, 0.1)',
  textSuccess: '#16a34a',
  bgInfo: 'rgba(56, 189, 248, 0.1)',
  textInfo: '#0284c7',
  bgWarning: 'rgba(245, 158, 11, 0.1)',
  textWarning: '#b45309',

  // Text - Contraste encore plus doux pour le confort
  textPrimary: '#2c2825', // Brun très foncé au lieu du gris froid
  textSecondary: '#5a5550', // Brun moyen plus chaleureux
  textTertiary: '#78716c', // Brun clair mais lisible
  textAccent: '#ffffff',
  textDanger: '#dc2626',
  textLink: '#4f46e5', // Indigo 600
  textCode: '#3c3530', // Code avec couleur brune douce
  bgUserMessageText: '#ffffff',
  bgModelMessageText: '#2c2825',
  bgErrorMessageText: '#dc2626',

  // Borders - Encore plus subtiles avec tons chauds
  borderPrimary: '#e7e5e1', // Bordures beiges très douces
  borderSecondary: '#d6d3ce', // Bordures secondaires chaudes
  borderFocus: '#4f46e5',

  // Scrollbar
  scrollbarThumb: '#a8a29e', // Scrollbar beige plus douce
  scrollbarTrack: '#f5f4f2', // Track avec chaleur

  // Icons - Couleurs adoucies avec tons chauds
  iconUser: '#ffffff',
  iconModel: '#4f46e5',
  iconError: '#dc2626',
  iconThought: '#78716c',
  iconSettings: '#5a5550',
  iconClearChat: '#ffffff',
  iconSend: '#ffffff',
  iconAttach: '#78716c',
  iconStop: '#ffffff',
  iconEdit: '#78716c',
  iconHistory: '#2c2825',
};

export const AVAILABLE_THEMES: Theme[] = [
  { id: 'midnight', name: 'Midnight (Élégant)', colors: MIDNIGHT_THEME_COLORS },
  { id: 'pearl', name: 'Pearl (Clair)', colors: PEARL_THEME_COLORS },
];

export const DEFAULT_THEME_ID = 'midnight';
