import React from 'react';
import { Mic, Square, Trash2, Check, Loader2 } from 'lucide-react';

interface RecorderControlsProps {
  viewState: 'idle' | 'recording' | 'review';
  isInitializing: boolean;
  isSaving: boolean;
  onStart: () => void;
  onStop: () => void;
  onCancel: () => void;
  onDiscard: () => void;
  onSave: () => void;
}

export const RecorderControls: React.FC<RecorderControlsProps> = ({
  viewState,
  isInitializing,
  isSaving,
  onStart,
  onStop,
  onCancel,
  onDiscard,
  onSave,
}) => {
  return (
    <div className="flex items-center justify-center gap-3 px-6 py-4 border-t border-[var(--theme-border-secondary)] bg-[var(--theme-bg-primary)]">
      {viewState === 'idle' && (
        <>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onStart}
            disabled={isInitializing}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Mic size={18} />
            Start Recording
          </button>
        </>
      )}

      {viewState === 'recording' && (
        <button
          onClick={onStop}
          className="flex items-center gap-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <Square size={18} />
          Stop Recording
        </button>
      )}

      {viewState === 'review' && (
        <>
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-danger)] transition-colors disabled:opacity-50"
          >
            <Trash2 size={18} />
            Discard
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-[var(--theme-bg-accent)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={18} />
                Save Recording
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
};
