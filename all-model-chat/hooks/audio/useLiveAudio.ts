import { useState, useEffect, useRef, useCallback } from 'react';

export interface LiveAudioConfig {
  enabled: boolean;
  autoStart: boolean;
  sampleRate: number;
  bufferSize: number;
}

export interface LiveAudioState {
  isRecording: boolean;
  isSupported: boolean;
  audioLevel: number;
  error: string | null;
}

const DEFAULT_CONFIG: LiveAudioConfig = {
  enabled: false, // Désactivé par défaut pour EVOLUTICS
  autoStart: false,
  sampleRate: 44100,
  bufferSize: 4096
};

export const useLiveAudio = (config: Partial<LiveAudioConfig> = {}) => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<LiveAudioState>({
    isRecording: false,
    isSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices,
    audioLevel: 0,
    error: null
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const startRecording = useCallback(async () => {
    if (!finalConfig.enabled) {
      setState(prev => ({ ...prev, error: 'Audio désactivé pour EVOLUTICS' }));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.start();
      setState(prev => ({ ...prev, isRecording: true, error: null }));

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erreur audio inconnue',
        isRecording: false
      }));
    }
  }, [finalConfig.enabled]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      setState(prev => ({ ...prev, isRecording: false }));
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, [state.isRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    ...state,
    startRecording,
    stopRecording,
    config: finalConfig
  };
};