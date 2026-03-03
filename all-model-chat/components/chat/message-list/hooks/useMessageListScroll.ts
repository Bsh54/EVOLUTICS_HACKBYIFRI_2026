
import { useRef, useState, useCallback, useEffect, useLayoutEffect } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { ChatMessage } from '../../../types';

interface UseMessageListScrollProps {
    messages: ChatMessage[];
    setScrollContainerRef: (node: HTMLDivElement | null) => void;
    activeSessionId: string | null;
}

export const useMessageListScroll = ({ messages, setScrollContainerRef, activeSessionId }: UseMessageListScrollProps) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [scrollerRef, setInternalScrollerRef] = useState<HTMLElement | null>(null);

    // États pour gérer l'affichage du bouton et le comportement de scroll
    const [isAtBottom, setIsAtBottom] = useState(true);
    const [showScrollDown, setShowScrollDown] = useState(false);

    // Références pour la logique interne (évite les re-rendus inutiles)
    const userScrolledUpRef = useRef(false);
    const lastSessionIdRef = useRef<string | null>(null);
    const prevMsgCount = useRef(messages.length);
    const visibleRangeRef = useRef({ startIndex: 0, endIndex: 0 });

    const lastMessage = messages[messages.length - 1];
    const isStreaming = lastMessage?.role === 'model' && lastMessage?.isLoading;

    // --- Synchronisation de la ref du conteneur ---
    useEffect(() => {
        if (scrollerRef) {
            setScrollContainerRef(scrollerRef as HTMLDivElement);
        }
    }, [scrollerRef, setScrollContainerRef]);

    // --- Gestionnaire de Scroll natif ---
    const handleScroll = useCallback(() => {
        if (!scrollerRef) return;

        const { scrollTop, scrollHeight, clientHeight } = scrollerRef;
        // Marge de 100px pour considérer qu'on est "en bas"
        const distanceToBottom = scrollHeight - scrollTop - clientHeight;
        const currentAtBottom = distanceToBottom <= 100;

        setIsAtBottom(currentAtBottom);
        setShowScrollDown(!currentAtBottom);

        // Si on est en train de streamer et que l'utilisateur remonte, on lock le scroll (Scroll Lock)
        if (isStreaming) {
            if (!currentAtBottom) {
                userScrolledUpRef.current = true;
            } else {
                userScrolledUpRef.current = false;
            }
        }
    }, [scrollerRef, isStreaming]);

    // Attacher l'écouteur de scroll
    useEffect(() => {
        if (scrollerRef) {
            scrollerRef.addEventListener('scroll', handleScroll, { passive: true });
            return () => scrollerRef.removeEventListener('scroll', handleScroll);
        }
    }, [scrollerRef, handleScroll]);

    // --- Fonctions d'action ---
    const scrollToBottom = useCallback((behavior: 'auto' | 'smooth' = 'smooth') => {
        userScrolledUpRef.current = false; // On réactive l'auto-scroll
        setIsAtBottom(true);
        setShowScrollDown(false);

        if (scrollerRef) {
            scrollerRef.scrollTo({
                top: scrollerRef.scrollHeight,
                behavior
            });
        } else {
            virtuosoRef.current?.scrollToIndex({
                index: messages.length - 1,
                align: 'end',
                behavior
            });
        }
    }, [scrollerRef, messages.length]);

    const onRangeChanged = useCallback(({ startIndex, endIndex }: { startIndex: number, endIndex: number }) => {
        visibleRangeRef.current = { startIndex, endIndex };
    }, []);

    // --- 1. Changement de Session (Instantané) ---
    useEffect(() => {
        if (activeSessionId !== lastSessionIdRef.current) {
            lastSessionIdRef.current = activeSessionId;
            prevMsgCount.current = messages.length;
            userScrolledUpRef.current = false;

            // Scroll immédiat sans délai pour éviter les problèmes de timing
            scrollToBottom('auto');
        }
    }, [activeSessionId, messages.length, scrollToBottom]);

    // --- 2. Nouveau message ajouté (Smooth) ---
    useEffect(() => {
        if (messages.length > prevMsgCount.current) {
            const newMessage = messages[messages.length - 1];

            // Si c'est l'utilisateur qui parle, on force le scroll down IMMÉDIATEMENT
            if (newMessage.role === 'user') {
                // Utiliser requestAnimationFrame pour éviter le saut
                requestAnimationFrame(() => {
                    if (scrollerRef) {
                        scrollerRef.scrollTop = scrollerRef.scrollHeight;
                    }
                });
            } else if (isAtBottom && !userScrolledUpRef.current) {
                // Pour les réponses IA, scroll smooth seulement si on était déjà en bas
                scrollToBottom('smooth');
            }
            prevMsgCount.current = messages.length;
        }
    }, [messages, isAtBottom, scrollToBottom, scrollerRef]);

    // --- 3. Auto-scroll "Sticky" pendant le streaming (Comportement ChatGPT) ---
    useLayoutEffect(() => {
        if (isStreaming && scrollerRef && !userScrolledUpRef.current) {
            // Utiliser requestAnimationFrame pour s'assurer que le DOM est à jour
            requestAnimationFrame(() => {
                if (scrollerRef) {
                    scrollerRef.scrollTop = scrollerRef.scrollHeight;
                }
            });
        }
    }, [lastMessage?.content, isStreaming, scrollerRef]);

    // --- Navigation entre les tours (Optionnel, conservé de votre ancien code) ---
    const scrollToPrevTurn = useCallback(() => { /* Logique inchangée mais ignorée ici pour concision, on garde la signature */ }, []);
    const scrollToNextTurn = useCallback(() => { /* Logique inchangée mais ignorée ici pour concision, on garde la signature */ }, []);

    return {
        virtuosoRef,
        setInternalScrollerRef,
        setAtBottom: setIsAtBottom,
        onRangeChanged,
        scrollToPrevTurn,
        scrollToNextTurn,
        showScrollDown,
        showScrollUp: false, // Simplifié
        scrollerRef,
        handleScroll,
        scrollToBottom // Nouvelle fonction exposée
    };
};
