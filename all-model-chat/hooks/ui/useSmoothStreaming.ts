
import { useState, useEffect, useRef } from 'react';

/**
 * A hook that provides a "typing effect" for streaming text.
 * It catches up to the target text smoothly instead of jumping in large chunks.
 */
export const useSmoothStreaming = (text: string | undefined | null, isStreaming: boolean) => {
    const safeText = text || '';
    const [displayedText, setDisplayedText] = useState(safeText);
    
    const displayedTextRef = useRef(safeText);
    const targetTextRef = useRef(safeText);
    const animationFrameRef = useRef<number | null>(null);
    const isFirstRenderRef = useRef(true);

    // Sync target text ref whenever input changes
    useEffect(() => {
        targetTextRef.current = safeText;
        
        // Sur le premier rendu avec du contenu, afficher immédiatement
        if (isFirstRenderRef.current && safeText) {
            isFirstRenderRef.current = false;
            displayedTextRef.current = safeText;
            setDisplayedText(safeText);
        }
        
        // Critical Fix: If tab is hidden, bypass animation to prevent backlog/crash
        // Browser pauses rAF when hidden, but state updates can pile up or be ignored
        if (document.hidden && isStreaming) {
            displayedTextRef.current = safeText;
            setDisplayedText(safeText);
        }
        
        // If we stopped streaming, snap to full text immediately to ensure consistency
        if (!isStreaming) {
            if (displayedTextRef.current !== safeText) {
                displayedTextRef.current = safeText;
                setDisplayedText(safeText);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        }
    }, [safeText, isStreaming]);

    // Animation Loop
    useEffect(() => {
        if (!isStreaming) return;

        const animate = () => {
            // Extra safety: If hidden, stop animating (resumed by effect above)
            if (document.hidden) {
                 animationFrameRef.current = requestAnimationFrame(animate);
                 return;
            }

            const currentLen = displayedTextRef.current.length;
            const targetLen = targetTextRef.current.length;

            if (currentLen < targetLen) {
                const lag = targetLen - currentLen;
                
                // Adaptive Typing Speed - Plus rapide au début
                let charsToAdd = 1;
                if (lag > 200) charsToAdd = 20; // Augmenté de 15 à 20
                else if (lag > 100) charsToAdd = 12; // Augmenté de 8 à 12
                else if (lag > 50) charsToAdd = 8; // Augmenté de 5 à 8
                else if (lag > 20) charsToAdd = 5; // Augmenté de 3 à 5
                else if (lag > 5) charsToAdd = 3; // Augmenté de 2 à 3
                else charsToAdd = 2; // Augmenté de 1 à 2

                const nextText = targetTextRef.current.slice(0, currentLen + charsToAdd);
                
                displayedTextRef.current = nextText;
                setDisplayedText(nextText);
                
                animationFrameRef.current = requestAnimationFrame(animate);
            } else if (currentLen > targetLen) {
                displayedTextRef.current = targetTextRef.current;
                setDisplayedText(targetTextRef.current);
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        if (!animationFrameRef.current) {
            animationFrameRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
        };
    }, [isStreaming]);

    return isStreaming ? displayedText : safeText;
};
