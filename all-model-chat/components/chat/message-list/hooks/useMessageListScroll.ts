
import { useRef, useState, useCallback, useEffect } from 'react';
import { VirtuosoHandle } from 'react-virtuoso';
import { ChatMessage } from '../../../types';

interface UseMessageListScrollProps {
    messages: ChatMessage[];
    setScrollContainerRef: (node: HTMLDivElement | null) => void;
    activeSessionId: string | null;
}

export const useMessageListScroll = ({ messages, setScrollContainerRef, activeSessionId }: UseMessageListScrollProps) => {
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [atBottom, setAtBottom] = useState(true);
    const [scrollerRef, setInternalScrollerRef] = useState<HTMLElement | null>(null);
    const visibleRangeRef = useRef({ startIndex: 0, endIndex: 0 });

    const lastRestoredSessionIdRef = useRef<string | null>(null);
    const lastScrollTarget = useRef<number | null>(null);
    const prevMsgCount = useRef(messages.length);

    const lastMessage = messages[messages.length - 1];
    const isStreaming = lastMessage?.role === 'model' && lastMessage?.isLoading;
    const lastContentLength = useRef(0);

    // Sync internal scroller ref with parent
    useEffect(() => {
        if (scrollerRef) {
            setScrollContainerRef(scrollerRef as HTMLDivElement);
        }
    }, [scrollerRef, setScrollContainerRef]);

    // Range tracking for navigation
    const onRangeChanged = useCallback(({ startIndex, endIndex }: { startIndex: number, endIndex: number }) => {
        visibleRangeRef.current = { startIndex, endIndex };
    }, []);

    // --- Progressive Auto-scroll Logic ---
    useEffect(() => {
        if (isStreaming && atBottom) {
            const currentLength = lastMessage?.content?.length || 0;
            if (currentLength > lastContentLength.current) {
                requestAnimationFrame(() => {
                    virtuosoRef.current?.scrollToIndex({
                        index: messages.length - 1,
                        align: 'end',
                        behavior: 'auto'
                    });
                });
            }
            lastContentLength.current = currentLength;
        } else if (!isStreaming) {
            lastContentLength.current = 0;
        }
    }, [lastMessage?.content, isStreaming, atBottom, messages.length]);

    // --- Sticky Scroll Logic (Session change & New messages) ---
    useEffect(() => {
        if (!activeSessionId || messages.length === 0) return;

        // On session change -> Instant jump to bottom
        if (lastRestoredSessionIdRef.current !== activeSessionId) {
            lastRestoredSessionIdRef.current = activeSessionId;
            prevMsgCount.current = messages.length;

            setTimeout(() => {
                virtuosoRef.current?.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end',
                    behavior: 'auto'
                });
                setAtBottom(true);
            }, 100);
            return;
        }

        // On new messages -> Smooth scroll if already at bottom
        if (messages.length > prevMsgCount.current) {
            if (atBottom) {
                virtuosoRef.current?.scrollToIndex({
                    index: messages.length - 1,
                    align: 'end',
                    behavior: 'smooth'
                });
            }
            prevMsgCount.current = messages.length;
        }
    }, [activeSessionId, messages, atBottom]);

    // --- Navigation Logic ---
    const scrollToPrevTurn = useCallback(() => {
        const currentStartIndex = visibleRangeRef.current.startIndex;
        let targetIndex = -1;
        for (let i = Math.max(0, currentStartIndex - 1); i >= 0; i--) {
             if (messages[i].role === 'user') {
                 targetIndex = i;
                 break;
             }
        }
        if (targetIndex !== -1) {
             lastScrollTarget.current = targetIndex;
             virtuosoRef.current?.scrollToIndex({ index: targetIndex, align: 'start', behavior: 'smooth' });
        } else {
             virtuosoRef.current?.scrollToIndex({ index: 0, align: 'start', behavior: 'smooth' });
        }
    }, [messages]);

    const scrollToNextTurn = useCallback(() => {
        const currentStartIndex = visibleRangeRef.current.startIndex;
        let targetIndex = -1;
        let startSearchIndex = currentStartIndex + 1;
        if (lastScrollTarget.current !== null && Math.abs(currentStartIndex - lastScrollTarget.current) <= 1) {
             startSearchIndex = Math.max(startSearchIndex, lastScrollTarget.current + 1);
        }
        for (let i = startSearchIndex; i < messages.length; i++) {
             if (messages[i].role === 'user') {
                 targetIndex = i;
                 break;
             }
        }
        if (targetIndex !== -1) {
             lastScrollTarget.current = targetIndex;
             virtuosoRef.current?.scrollToIndex({ index: targetIndex, align: 'start', behavior: 'smooth' });
        } else {
             lastScrollTarget.current = messages.length - 1;
             virtuosoRef.current?.scrollToIndex({ index: messages.length - 1, align: 'end', behavior: 'smooth' });
        }
    }, [messages]);

    const handleScroll = useCallback(() => {
        if (document.hidden || !scrollerRef) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollerRef;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
        if (isAtBottom !== atBottom) {
            setAtBottom(isAtBottom);
        }
    }, [scrollerRef, atBottom]);

    useEffect(() => {
        const container = scrollerRef;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [scrollerRef, handleScroll]);

    const showScrollDown = !atBottom;
    const showScrollUp = messages.length > 2 && visibleRangeRef.current.startIndex > 0;

    return {
        virtuosoRef,
        setInternalScrollerRef,
        setAtBottom,
        onRangeChanged,
        scrollToPrevTurn,
        scrollToNextTurn,
        showScrollDown,
        showScrollUp,
        scrollerRef,
        handleScroll
    };
};
