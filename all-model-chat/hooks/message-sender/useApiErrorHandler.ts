
import { useCallback } from 'react';
import { logService } from '../../utils/appUtils';
import { SavedChatSession } from '../../types';

type SessionsUpdater = (updater: (prev: SavedChatSession[]) => SavedChatSession[]) => void;

export const useApiErrorHandler = (updateAndPersistSessions: SessionsUpdater) => {
    const handleApiError = useCallback((
        error: unknown, 
        sessionId: string, 
        modelMessageId: string, 
        errorPrefix: string = "Error",
        partialContent?: string,
        partialThoughts?: string
    ) => {
        const isAborted = error instanceof Error && (error.name === 'AbortError' || error.message === 'aborted');
        logService.error(`API Error (${errorPrefix}) for message ${modelMessageId} in session ${sessionId}`, { error, isAborted });
        
        if (isAborted) {
            // If we have partial content to save during an abort, update the state.
            if (partialContent !== undefined || partialThoughts !== undefined) {
                 updateAndPersistSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(msg => 
                    msg.id === modelMessageId 
                        ? { 
                            ...msg, 
                            content: partialContent !== undefined ? partialContent : msg.content,
                            thoughts: partialThoughts !== undefined ? partialThoughts : msg.thoughts,
                            isLoading: false,
                            generationEndTime: new Date()
                          } 
                        : msg
                )}: s));
            }
            // Optimistic update in useMessageActions.handleStopGenerating also handles the UI change.
            return;
        }

        let errorMessage = "Une erreur inconnue est survenue.";
        if (error instanceof Error) {
            if (error.message.includes('429')) {
                errorMessage = "Désolé, le service est indisponible pour le moment. Veuillez réessayer dans quelques secondes.";

                // --- Logique de suppression automatique après 1 minute ---
                setTimeout(() => {
                    updateAndPersistSessions(prev => prev.map(s => s.id === sessionId ? {
                        ...s,
                        messages: s.messages.filter(msg => msg.id !== modelMessageId)
                    } : s));
                }, 60000); // 60 secondes
            } else {
                errorMessage = error.name === 'SilentError'
                    ? "La clé API n'est pas configurée dans les paramètres."
                    : `${errorPrefix}: ${error.message}`;
            }
        } else {
            errorMessage = `${errorPrefix}: ${String(error)}`;
        }

        updateAndPersistSessions(prev => prev.map(s => s.id === sessionId ? { ...s, messages: s.messages.map(msg => 
            msg.id === modelMessageId 
                ? { 
                    ...msg, 
                    role: 'error', 
                    // Use partial content if available, otherwise append to existing content
                    content: (partialContent !== undefined ? partialContent : (msg.content || '')).trim() + `\n\n[${errorMessage}]`, 
                    thoughts: partialThoughts !== undefined ? partialThoughts : msg.thoughts,
                    isLoading: false, 
                    generationEndTime: new Date() 
                  } 
                : msg
        )}: s));
    }, [updateAndPersistSessions]);

    return { handleApiError };
};
