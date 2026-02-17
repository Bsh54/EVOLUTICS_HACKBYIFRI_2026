
import { useState, useRef, useEffect } from 'react';
import { SavedChatSession, ChatGroup, ChatMessage } from '../../../types';
import { ACTIVE_CHAT_SESSION_ID_KEY } from '../../../constants/appConstants';

export const useSessionData = () => {
    // Session Metadata List (messages field is usually empty in this array to save memory)
    const [savedSessions, setSavedSessions] = useState<SavedChatSession[]>([]);
    const [savedGroups, setSavedGroups] = useState<ChatGroup[]>([]);
    
    // Active Session State
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [activeMessages, setActiveMessages] = useState<ChatMessage[]>([]);
    
    // Refs to access latest state inside heavy updaters without adding dependencies
    const activeMessagesRef = useRef<ChatMessage[]>([]);
    const activeSessionIdRef = useRef<string | null>(null);

    useEffect(() => { activeMessagesRef.current = activeMessages; }, [activeMessages]);
    useEffect(() => { activeSessionIdRef.current = activeSessionId; }, [activeSessionId]);

    // Sync active session ID to sessionStorage ONLY (URL is handled by ShadsAIHub)
    useEffect(() => {
        // CRITICAL: Do not intercept URL if we are on the admin portal
        if (window.location.pathname === '/admin-portal') return;

        if (activeSessionId) {
            try {
                sessionStorage.setItem(ACTIVE_CHAT_SESSION_ID_KEY, activeSessionId);
            } catch (e) {}

            // OLD URL LOGIC REMOVED TO PREVENT CONFLICTS WITH HUB NAVIGATION
            // The URL state is now fully managed by ShadsAIHub.tsx using query params (?tab=chat)
        } else {
            try {
                sessionStorage.removeItem(ACTIVE_CHAT_SESSION_ID_KEY);
            } catch (e) {}
        }
    }, [activeSessionId]);

    return {
        savedSessions, setSavedSessions,
        savedGroups, setSavedGroups,
        activeSessionId, setActiveSessionId,
        activeMessages, setActiveMessages,
        activeSessionIdRef,
        activeMessagesRef
    };
};
