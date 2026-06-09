
import React, { useCallback, Dispatch, SetStateAction } from 'react';
import { AppSettings, ChatMessage, ChatSettings as IndividualChatSettings, UploadedFile, SavedChatSession } from '../../../types';
import { createChatHistoryForApi, isGemini3Model, logService } from '../../../utils/appUtils';
import { buildGenerationConfig } from '../../../services/api/baseApi';
import { geminiServiceInstance } from '../../../services/geminiService';
import { isLikelyHtml } from '../../../utils/codeUtils';
import { GetStreamHandlers } from '../types';
import { ContentPart } from '../../../types/chat';

type SessionsUpdater = (updater: (prev: SavedChatSession[]) => SavedChatSession[]) => void;

interface UseApiInteractionProps {
    appSettings: AppSettings;
    messages: ChatMessage[];
    getStreamHandlers: GetStreamHandlers;
    handleGenerateCanvas: (sourceMessageId: string, content: string) => Promise<void>;
    setSessionLoading: (sessionId: string, isLoading: boolean) => void;
    activeJobs: React.MutableRefObject<Map<string, AbortController>>;
    updateAndPersistSessions: SessionsUpdater;
}

export const useApiInteraction = ({
    appSettings,
    messages,
    getStreamHandlers,
    handleGenerateCanvas,
    setSessionLoading,
    activeJobs,
    updateAndPersistSessions
}: UseApiInteractionProps) => {

    const performApiCall = useCallback(async (params: {
        finalSessionId: string;
        generationId: string;
        generationStartTime: Date;
        keyToUse: string;
        activeModelId: string;
        promptParts: ContentPart[];
        effectiveEditingId: string | null;
        isContinueMode: boolean;
        isRawMode: boolean;
        sessionToUpdate: IndividualChatSettings;
        aspectRatio: string;
        imageSize: string | undefined;
        newAbortController: AbortController;
        textToUse: string; 
        enrichedFiles: UploadedFile[];
    }) => {
        const {
            finalSessionId, generationId, generationStartTime, keyToUse, activeModelId,
            promptParts, effectiveEditingId, isContinueMode, isRawMode,
            sessionToUpdate, aspectRatio, imageSize, newAbortController,
            textToUse, enrichedFiles
        } = params;

        let baseMessagesForApi: ChatMessage[] = messages;

        if (effectiveEditingId) {
            const index = messages.findIndex(m => m.id === effectiveEditingId);
            if (index !== -1) {
                baseMessagesForApi = messages.slice(0, index);
            }
        }

        let finalRole: 'user' | 'model' = 'user';
        let finalParts = promptParts;

        if (isContinueMode) {
            finalRole = 'model';
            const targetMsg = messages.find(m => m.id === effectiveEditingId);
            const currentContent = targetMsg?.content || '';
            const isG3 = isGemini3Model(activeModelId);

            let prefillContent = currentContent;
            if (!prefillContent.trim()) {
                prefillContent = isG3 ? "<thinking>I have finished reasoning</thinking>" : " ";
            }
            finalParts = [{ text: prefillContent }];

        } else if (isRawMode) {
            const tempUserMsg: ChatMessage = { 
                id: 'temp-raw-user', 
                role: 'user', 
                content: textToUse.trim(), 
                files: enrichedFiles, 
                timestamp: new Date() 
            };
            baseMessagesForApi = [...baseMessagesForApi, tempUserMsg];

            finalRole = 'model';
            finalParts = [{ text: '<thinking>' }];
            
        } else if (promptParts.length === 0) {
            setSessionLoading(finalSessionId, false);
            activeJobs.current.delete(generationId);
            return;
        }

        const shouldStripThinking = sessionToUpdate.hideThinkingInContext ?? appSettings.hideThinkingInContext;
        const historyForChat = await createChatHistoryForApi(baseMessagesForApi, shouldStripThinking);

        const config = buildGenerationConfig(
            activeModelId,
            sessionToUpdate.systemInstruction,
            { temperature: sessionToUpdate.temperature, topP: sessionToUpdate.topP },
            sessionToUpdate.showThoughts,
            sessionToUpdate.thinkingBudget,
            !!sessionToUpdate.isGoogleSearchEnabled,
            !!sessionToUpdate.isCodeExecutionEnabled,
            !!sessionToUpdate.isUrlContextEnabled,
            sessionToUpdate.thinkingLevel,
            aspectRatio,
            sessionToUpdate.isDeepSearchEnabled,
            imageSize,
            sessionToUpdate.safetySettings,
            sessionToUpdate.mediaResolution
        );

        // Helper pour générer et sauvegarder le titre
        const generateAndSaveTitle = async (sessionId: string, userPrompt: string, modelResponse: string) => {
            try {
                // Déterminer la langue (défaut 'en' si system ou autre)
                const lang = appSettings.language === 'zh' ? 'zh' : 'en';

                // Appel API pour générer le titre
                const newTitle = await geminiServiceInstance.generateTitle(
                    keyToUse,
                    userPrompt,
                    modelResponse,
                    lang
                );

                // Mise à jour optimiste de la session avec le nouveau titre
                updateAndPersistSessions(prev => {
                    const sessionIndex = prev.findIndex(s => s.id === sessionId);
                    if (sessionIndex === -1) return prev;

                    const newSessions = [...prev];
                    newSessions[sessionIndex] = {
                        ...newSessions[sessionIndex],
                        title: newTitle
                    };
                    return newSessions;
                });

                logService.info("Auto-generated title applied", { sessionId, newTitle });
            } catch (error) {
                logService.warn("Failed to auto-generate title", { error });
            }
        };

        const { streamOnError, streamOnComplete, streamOnPart, onThoughtChunk } = getStreamHandlers(
            finalSessionId,
            generationId,
            newAbortController,
            generationStartTime,
            sessionToUpdate,
            (msgId, content) => {
                if (!isContinueMode && appSettings.autoCanvasVisualization && content && content.length > 50 && !isLikelyHtml(content)) {
                    const trimmed = content.trim();
                    if (trimmed.startsWith('```') && trimmed.endsWith('```')) return;
                    logService.info("Auto-triggering Canvas visualization for message", { msgId });
                    handleGenerateCanvas(msgId, content);
                }

                // Logique de génération de titre automatique
                const isFirstTurn = messages.length === 0;
                if (isFirstTurn && content && content.length > 10) {
                    generateAndSaveTitle(finalSessionId, textToUse, content);
                }
            }
        );

        setSessionLoading(finalSessionId, true);
        activeJobs.current.set(generationId, newAbortController);

        if (appSettings.isStreamingEnabled) {
            await geminiServiceInstance.sendMessageStream(
                keyToUse,
                activeModelId,
                historyForChat,
                finalParts,
                config,
                newAbortController.signal,
                streamOnPart,
                onThoughtChunk,
                streamOnError,
                streamOnComplete,
                finalRole
            );
        } else {
            await geminiServiceInstance.sendMessageNonStream(
                keyToUse,
                activeModelId,
                historyForChat,
                finalParts,
                config,
                newAbortController.signal,
                streamOnError,
                (parts, thoughts, usage, grounding) => {
                    for (const part of parts) streamOnPart(part);
                    if (thoughts) onThoughtChunk(thoughts);
                    streamOnComplete(usage, grounding);
                }
            );
        }
    }, [appSettings, messages, getStreamHandlers, handleGenerateCanvas, setSessionLoading, activeJobs]);

    return { performApiCall };
};
