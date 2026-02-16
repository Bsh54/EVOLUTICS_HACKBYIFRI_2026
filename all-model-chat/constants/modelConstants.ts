
import { ModelOption } from '../types';

export const DEFAULT_MODEL_ID = 'gemini-2.5-flash';

export const TAB_CYCLE_MODELS: string[] = [
    'gemini-2.5-flash',
];

export const INITIAL_PINNED_MODELS: string[] = [
    'gemini-2.5-flash',
];

export const GEMINI_3_RO_MODELS: string[] = [];

export const MODELS_MANDATORY_THINKING = [];

export const MODELS_SUPPORTING_RAW_MODE = [
    'gemini-2.5-flash',
];

export const THINKING_LEVELS = [
    { id: 'MINIMAL', name: 'Minimal' },
    { id: 'LOW', name: 'Low' },
    { id: 'MEDIUM', name: 'Medium' },
    { id: 'HIGH', name: 'High' },
];

export const DEFAULT_THINKING_LEVEL = 'HIGH';

export const THINKING_BUDGET_RANGES: { [key: string]: { min: number; max: number } } = {
    'gemini-2.5-flash': { min: 0, max: 32768 },
};

export const DEFAULT_TEMPERATURE = 1.0; 
export const DEFAULT_TOP_P = 0.95; 
export const DEFAULT_SHOW_THOUGHTS = true;
export const DEFAULT_THINKING_BUDGET = -1; // -1 for auto/unlimited budget
export const DEFAULT_TTS_VOICE = 'Zephyr';

export const DEFAULT_TRANSCRIPTION_MODEL_ID = 'gemini-2.5-flash';
export const DEFAULT_TTS_MODEL_ID = 'gemini-2.5-flash';

export const STATIC_TTS_MODELS: ModelOption[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', isPinned: true },
];

export const STATIC_IMAGEN_MODELS: ModelOption[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', isPinned: true },
];

export const AVAILABLE_TRANSCRIPTION_MODELS: { id: string; name: string }[] = [
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
];

export const AVAILABLE_TTS_VOICES: { id: string; name: string; styleKey: string }[] = [
    { id: 'Zephyr', name: 'Zephyr', styleKey: 'tts_style_bright' },
    { id: 'Puck', name: 'Puck', styleKey: 'tts_style_upbeat' },
    { id: 'Charon', name: 'Charon', styleKey: 'tts_style_informative' },
    { id: 'Kore', name: 'Kore', styleKey: 'tts_style_firm' },
    { id: 'Fenrir', name: 'Fenrir', styleKey: 'tts_style_excitable' },
    { id: 'Leda', name: 'Leda', styleKey: 'tts_style_youthful' },
    { id: 'Orus', name: 'Orus', styleKey: 'tts_style_firm' },
    { id: 'Aoede', name: 'Aoede', styleKey: 'tts_style_breezy' },
    { id: 'Callirrhoe', name: 'Callirrhoe', styleKey: 'tts_style_easy_going' },
    { id: 'Autonoe', name: 'Autonoe', styleKey: 'tts_style_bright' },
    { id: 'Enceladus', name: 'Enceladus', styleKey: 'tts_style_breathy' },
    { id: 'Iapetus', name: 'Iapetus', styleKey: 'tts_style_clear' },
    { id: 'Umbriel', name: 'Umbriel', styleKey: 'tts_style_easy_going' },
    { id: 'Algieba', name: 'Algieba', styleKey: 'tts_style_smooth' },
    { id: 'Despina', name: 'Despina', styleKey: 'tts_style_smooth' },
    { id: 'Erinome', name: 'Erinome', styleKey: 'tts_style_clear' },
    { id: 'Algenib', name: 'Algenib', styleKey: 'tts_style_gravelly' },
    { id: 'Rasalgethi', name: 'Rasalgethi', styleKey: 'tts_style_informative' },
    { id: 'Laomedeia', name: 'Laomedeia', styleKey: 'tts_style_upbeat' },
    { id: 'Achernar', name: 'Achernar', styleKey: 'tts_style_soft' },
    { id: 'Alnilam', name: 'Alnilam', styleKey: 'tts_style_firm' },
    { id: 'Schedar', name: 'Schedar', styleKey: 'tts_style_even' },
    { id: 'Gacrux', name: 'Gacrux', styleKey: 'tts_style_mature' },
    { id: 'Pulcherrima', name: 'Pulcherrima', styleKey: 'tts_style_forward' },
    { id: 'Achird', name: 'Achird', styleKey: 'tts_style_friendly' },
    { id: 'Zubenelgenubi', name: 'Zubenelgenubi', styleKey: 'tts_style_casual' },
    { id: 'Vindemiatrix', name: 'Vindemiatrix', styleKey: 'tts_style_gentle' },
    { id: 'Sadachbia', name: 'Sadachbia', styleKey: 'tts_style_lively' },
    { id: 'Sadaltager', name: 'Sadaltager', styleKey: 'tts_style_knowledgeable' },
    { id: 'Sulafat', name: 'Sulafat', styleKey: 'tts_style_warm' },
];
