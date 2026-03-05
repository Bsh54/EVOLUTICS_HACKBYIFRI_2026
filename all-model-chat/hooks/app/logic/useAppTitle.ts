
import { useState, useMemo, useEffect } from 'react';
import { ChatMessage } from '../../../types';

interface UseAppTitleProps {
    isLoading: boolean;
    messages: ChatMessage[];
    language: 'en' | 'zh';
    sessionTitle: string;
}

export const useAppTitle = ({ isLoading, messages, language, sessionTitle }: UseAppTitleProps) => {
    const [generationTime, setGenerationTime] = useState(0);

    // trouver le temps de début de génération
    const currentGenerationStartTime = useMemo(() => {
        if (!isLoading) return null;
        for (let i = messages.length - 1; i >= 0; i--) {
            const m = messages[i];
            if ((m.role === 'model' || m.role === 'error') && m.isLoading) {
                return m.generationStartTime ? new Date(m.generationStartTime).getTime() : Date.now();
            }
        }
        return null;
    }, [messages, isLoading]);

    // timer update
    useEffect(() => {
        let intervalId: number;
        if (currentGenerationStartTime) {
            const update = () => {
                setGenerationTime(Math.max(0, Math.floor((Date.now() - currentGenerationStartTime) / 1000)));
            };
            update();
            intervalId = window.setInterval(update, 1000);
        } else {
            setGenerationTime(0);
        }
        return () => clearInterval(intervalId);
    }, [currentGenerationStartTime]);

    // mettre à jour le titre du document
    useEffect(() => {
        const updateTitle = () => {
            let statusPrefix = '';
            if (isLoading) {
                const timeDisplay = ` (${generationTime}s)`;
                statusPrefix = (language === 'zh' ? `Génération${timeDisplay}... | ` : `Generating${timeDisplay}... | `);
            }
            
            const suffix = sessionTitle === 'EVOLUTICS' ? '' : ' • EVOLUTICS';
            const cleanTitle = sessionTitle || 'New Chat';

            document.title = `${statusPrefix}${cleanTitle}${suffix}`;
        };

        updateTitle();

        // restaurer le titre quand l'utilisateur revient sur l'onglet
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                updateTitle();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [sessionTitle, isLoading, language, generationTime]);
};
