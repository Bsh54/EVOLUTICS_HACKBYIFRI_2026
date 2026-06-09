
import React from 'react';
import { Mic, Info, AudioLines } from 'lucide-react';
import { AVAILABLE_TRANSCRIPTION_MODELS, AVAILABLE_TTS_VOICES } from '../../../constants/appConstants';
import { Tooltip } from '../../shared/Tooltip';
import { Select } from '../../shared/Select';

interface VoiceControlProps {
  transcriptionModelId: string;
  setTranscriptionModelId: (value: string) => void;
  ttsVoice?: string;
  setTtsVoice?: (value: string) => void;
  t: (key: string) => string;
}

export const VoiceControl: React.FC<VoiceControlProps> = ({
  t
}) => {
  return (
    <div className="space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text-tertiary)] flex items-center gap-2">
            <Mic size={14} strokeWidth={1.5} /> Audio & Speech
        </h4>

        <div className="p-3 rounded-xl bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-secondary)]">
            <p className="text-xs text-[var(--theme-text-secondary)]">
                Les fonctions vocales avancées (TTS/Transcription native) ne sont pas disponibles avec la configuration actuelle du modèle unique.
            </p>
        </div>
    </div>
  );
};
