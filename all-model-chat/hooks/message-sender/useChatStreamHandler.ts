
import React, { Dispatch, SetStateAction, useCallback } from 'react';
import { AppSettings, SavedChatSession, ChatMessage, ChatSettings as IndividualChatSettings } from '../../types';
import { Part, UsageMetadata } from '@google/genai';
import { useApiErrorHandler } from './useApiErrorHandler';
import { logService, showNotification, calculateTokenStats, playCompletionSound } from '../../utils/appUtils';
import { APP_LOGO_SVG_DATA_URI } from '../../constants/appConstants';
import { finalizeMessages, updateMessagesWithBatch } from '../chat-stream/processors';
import { streamingStore } from '../../services/streamingStore';

type SessionsUpdater = (updater: (prev: SavedChatSession[]) => SavedChatSession[], options?: { persist?: boolean }) => void;

interface ChatStreamHandlerProps {
    appSettings: AppSettings;
    updateAndPersistSessions: SessionsUpdater;
    setSessionLoading: (sessionId: string, isLoading: boolean) => void;
    activeJobs: React.MutableRefObject<Map<string, AbortController>>;
}

export const useChatStreamHandler = ({
    appSettings,
    updateAndPersistSessions,
    setSessionLoading,
    activeJobs
}: ChatStreamHandlerProps) => {
    const { handleApiError } = useApiErrorHandler(updateAndPersistSessions);

    const getStreamHandlers = useCallback((
        currentSessionId: string,
        generationId: string,
        abortController: AbortController,
        generationStartTime: Date,
        currentChatSettings: IndividualChatSettings,
        onSuccess?: (generationId: string, finalContent: string) => void
    ) => {
        const newModelMessageIds = new Set<string>([generationId]);
        let firstContentPartTime: Date | null = null;
        let firstTokenTime: Date | null = null; // Track first token (thought or content) for TTFT
        let accumulatedText = "";
        let accumulatedThoughts = "";

        // Reset store for this new generation
        streamingStore.clear(generationId);
        
        // Helper to record TTFT immediately on first activity
        const recordFirstToken = () => {
            if (!firstTokenTime) {
                firstTokenTime = new Date();
                const ttft = firstTokenTime.getTime() - generationStartTime.getTime();
                
                updateAndPersistSessions(prev => {
                    const sessionIndex = prev.findIndex(s => s.id === currentSessionId);
                    if (sessionIndex === -1) return prev;
                    const newSessions = [...prev];
                    const sessionToUpdate = { ...newSessions[sessionIndex] };
                    
                    // Update only the specific message with TTFT to trigger UI update
                    sessionToUpdate.messages = sessionToUpdate.messages.map(m => {
                        if (m.id === generationId) {
                            return { ...m, firstTokenTimeMs: ttft };
                        }
                        return m;
                    });
                    
                    newSessions[sessionIndex] = sessionToUpdate;
                    return newSessions;
                }, { persist: false });
            }
        };

        const streamOnError = (error: Error) => {
            // Pass accumulated content so it can be saved even on error/abort
            handleApiError(error, currentSessionId, generationId, "Error", accumulatedText, accumulatedThoughts);
            setSessionLoading(currentSessionId, false);
            activeJobs.current.delete(generationId);
            streamingStore.clear(generationId);
        };

        const streamOnComplete = (usageMetadata?: UsageMetadata, groundingMetadata?: any, urlContextMetadata?: any) => {
            const lang = appSettings.language === 'system' 
                ? (navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en')
                : appSettings.language;

            if (appSettings.isStreamingEnabled && !firstContentPartTime) {
                firstContentPartTime = new Date();
            }

            if (usageMetadata) {
                const { promptTokens, completionTokens } = calculateTokenStats(usageMetadata);
                logService.recordTokenUsage(
                    currentChatSettings.modelId,
                    promptTokens,
                    completionTokens
                );
            }

            // Perform the Final Update to State (and DB)
            updateAndPersistSessions(prev => {
                const sessionIndex = prev.findIndex(s => s.id === currentSessionId);
                if (sessionIndex === -1) return prev;

                const newSessions = [...prev];
                const sessionToUpdate = { ...newSessions[sessionIndex] };
                
                // Construct a virtual "final" part containing the full text from the store
                // We use updateMessagesWithBatch but we manually inject the accumulated text
                // because the state messages haven't been updating with text during the stream.
                
                // 1. First, make sure the message exists and has basic structure (it was created at start)
                // 2. Update its content with accumulatedText and accumulatedThoughts
                
                let updatedMessages = sessionToUpdate.messages.map(msg => {
                    if (msg.id === generationId) {
                        return {
                            ...msg,
                            content: (msg.content || '') + accumulatedText,
                            thoughts: (msg.thoughts || '') + accumulatedThoughts
                        };
                    }
                    return msg;
                });
                
                // 3. Finalize (mark loading false, set stats)
                const finalizationResult = finalizeMessages(
                    updatedMessages,
                    generationStartTime,
                    newModelMessageIds,
                    currentChatSettings,
                    lang,
                    firstContentPartTime,
                    usageMetadata,
                    groundingMetadata,
                    urlContextMetadata,
                    abortController.signal.aborted
                );

                sessionToUpdate.messages = finalizationResult.updatedMessages;
                newSessions[sessionIndex] = sessionToUpdate;

                if (finalizationResult.completedMessageForNotification) {
                    if (appSettings.isCompletionSoundEnabled) {
                        playCompletionSound();
                    }
                    if (appSettings.isCompletionNotificationEnabled && document.hidden) {
                        const msg = finalizationResult.completedMessageForNotification;
                        const notificationBody = (msg.content || "Media or tool response received").substring(0, 150) + (msg.content && msg.content.length > 150 ? '...' : '');
                        showNotification(
                            'Response Ready', 
                            {
                                body: notificationBody,
                                icon: APP_LOGO_SVG_DATA_URI,
                            }
                        );
                    }
                }

                return newSessions;
            }, { persist: true });

            setSessionLoading(currentSessionId, false);
            activeJobs.current.delete(generationId);
            streamingStore.clear(generationId);

            if (onSuccess && !abortController.signal.aborted) {
                setTimeout(() => onSuccess(generationId, accumulatedText), 0);
            }
        };

        const streamOnPart = (part: Part) => {
            recordFirstToken(); // Capture TTFT
            
            const anyPart = part as any;
            
            // 1. Accumulate plain text
            let chunkText = "";
            if (anyPart.text) {
                chunkText = anyPart.text;
                
                // Correction du premier chunk si tronqué (problème DeepSeek)
                if (accumulatedText === '' && chunkText.length > 0) {
                    console.log('🔍 [ChatStream] Premier chunk reçu:', {
                        text: chunkText.substring(0, 50),
                        charCode: chunkText.charCodeAt(0),
                        length: chunkText.length
                    });
                    
                    // Dictionnaire des mots tronqués courants et leurs corrections
                    const truncationFixes: { [key: string]: string } = {
                        'jour': 'Bonjour',
                        'onjour': 'Bonjour',
                        'alut': 'Salut',
                        'ien sûr': 'Bien sûr',
                        'ien': 'Bien',
                        'vec plaisir': 'Avec plaisir',
                        'olontiers': 'Volontiers',
                        'xcellent': 'Excellent',
                        'arfait': 'Parfait',
                        'ntendu': 'Entendu',
                        'accord': "D'accord",
                        'e comprends': 'Je comprends',
                        'e vais': 'Je vais',
                        'e peux': 'Je peux',
                        'e suis': 'Je suis',
                        'oici': 'Voici',
                        'oilà': 'Voilà',
                        'our': 'Pour',
                        'rès bien': 'Très bien'
                    };
                    
                    // Vérifier si le chunk correspond à un mot tronqué connu
                    let corrected = false;
                    for (const [truncated, full] of Object.entries(truncationFixes)) {
                        if (chunkText.toLowerCase().startsWith(truncated.toLowerCase())) {
                            const remainder = chunkText.substring(truncated.length);
                            chunkText = full + remainder;
                            console.log(`🔧 [ChatStream] Correction appliquée: "${truncated}" → "${full}"`);
                            corrected = true;
                            break;
                        }
                    }
                    
                    if (!corrected) {
                        // Vérifier si le premier caractère est une minuscule (signe de troncature)
                        const firstChar = chunkText.charAt(0);
                        if (firstChar === firstChar.toLowerCase() && firstChar !== firstChar.toUpperCase()) {
                            console.warn('⚠️ [ChatStream] Premier chunk semble tronqué (commence par minuscule)');
                            // Mettre en majuscule le premier caractère comme solution de secours
                            chunkText = firstChar.toUpperCase() + chunkText.substring(1);
                            console.log(`🔧 [ChatStream] Majuscule appliquée: "${firstChar}" → "${firstChar.toUpperCase()}"`);
                        }
                    }
                }
                
                accumulatedText += chunkText;
                streamingStore.updateContent(generationId, chunkText);
            }

            // 2. Handle Tools / Code (Convert to text representation for the store)
            if (anyPart.executableCode) {
                const codePart = anyPart.executableCode as { language: string, code: string };
                const toolContent = `\`\`\`${codePart.language.toLowerCase() || 'python'}\n${codePart.code}\n\`\`\``;
                accumulatedText += toolContent;
                streamingStore.updateContent(generationId, toolContent);
            } else if (anyPart.codeExecutionResult) {
                const resultPart = anyPart.codeExecutionResult as { outcome: string, output?: string };
                const escapeHtml = (unsafe: string) => {
                    if (typeof unsafe !== 'string') return '';
                    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
                };
                let toolContent = `<div class="tool-result outcome-${resultPart.outcome.toLowerCase()}"><strong>Execution Result (${resultPart.outcome}):</strong>`;
                if (resultPart.output) {
                    toolContent += `<pre><code class="language-text">${escapeHtml(resultPart.output)}</code></pre>`;
                }
                toolContent += '</div>';
                accumulatedText += toolContent;
                streamingStore.updateContent(generationId, toolContent);
            } else if (anyPart.inlineData) {
                // For files, we still MUST update the session state because they are objects, not just text string.
                // We use a simplified update that ONLY targets the file array for this message.
                // This will trigger a React update, but it's infrequent (once per image generation usually).
                updateAndPersistSessions(prev => {
                     const sessionIndex = prev.findIndex(s => s.id === currentSessionId);
                     if (sessionIndex === -1) return prev;
                     const newSessions = [...prev];
                     const sessionToUpdate = { ...newSessions[sessionIndex] };
                     // Only apply parts to messages, assume no thought here
                     sessionToUpdate.messages = updateMessagesWithBatch(
                         sessionToUpdate.messages,
                         [part], 
                         "", 
                         generationStartTime, 
                         newModelMessageIds, 
                         firstContentPartTime
                     );
                     newSessions[sessionIndex] = sessionToUpdate;
                     return newSessions;
                }, { persist: false });
            }

            const hasMeaningfulContent = 
                (anyPart.text && anyPart.text.trim().length > 0) || 
                anyPart.executableCode || 
                anyPart.codeExecutionResult || 
                anyPart.inlineData;

            if (appSettings.isStreamingEnabled && !firstContentPartTime && hasMeaningfulContent) {
                firstContentPartTime = new Date();
            }
        };
        
        const onThoughtChunk = (thoughtChunk: string) => {
            recordFirstToken(); // Capture TTFT (thoughts usually come first)
            
            accumulatedThoughts += thoughtChunk;
            streamingStore.updateThoughts(generationId, thoughtChunk);
        };
        
        return { streamOnError, streamOnComplete, streamOnPart, onThoughtChunk };

    }, [appSettings.isStreamingEnabled, appSettings.isCompletionNotificationEnabled, appSettings.isCompletionSoundEnabled, appSettings.language, updateAndPersistSessions, handleApiError, setSessionLoading, activeJobs]);
    
    return { getStreamHandlers };
};
