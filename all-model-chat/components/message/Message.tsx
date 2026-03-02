
import React, { useMemo } from 'react';
import { ChatMessage, UploadedFile, AppSettings, SideViewContent } from '../../types';
import { MessageContent } from './MessageContent';
import { translations } from '../../utils/appUtils';
import { MessageActions } from './MessageActions';

interface MessageProps {
    message: ChatMessage;
    sessionTitle?: string;
    prevMessage?: ChatMessage;
    messageIndex: number;
    onEditMessage: (messageId: string, mode: 'update' | 'resend') => void;
    onDeleteMessage: (messageId: string) => void;
    onRetryMessage: (messageId: string) => void; 
    onImageClick: (file: UploadedFile) => void; // Renamed to onFileClick in logic, kept name for props compat
    onOpenHtmlPreview: (html: string, options?: { initialTrueFullscreen?: boolean }) => void;
    showThoughts: boolean;
    themeId: string;
    baseFontSize: number;
    expandCodeBlocksByDefault: boolean;
    isMermaidRenderingEnabled: boolean;
    isGraphvizRenderingEnabled: boolean;
    onTextToSpeech: (messageId: string, text: string) => void;
    onGenerateCanvas: (messageId: string, text: string) => void;
    onContinueGeneration: (messageId: string) => void;
    ttsMessageId: string | null;
    onSuggestionClick?: (suggestion: string) => void;
    t: (key: keyof typeof translations) => string;
    appSettings: AppSettings;
    onOpenSidePanel: (content: SideViewContent) => void;
    onConfigureFile?: (file: UploadedFile, messageId: string) => void;
    isGemini3?: boolean;
}

export const Message: React.FC<MessageProps> = React.memo((props) => {
    const { message, prevMessage, messageIndex, t } = props;
    
    const isGrouped = prevMessage &&
        prevMessage.role === message.role &&
        !prevMessage.isLoading &&
        !message.isLoading &&
        (new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime() < 5 * 60 * 1000);

    const isModelThinkingOrHasThoughts = message.role === 'model' && (message.isLoading || (message.thoughts && props.showThoughts));
    
    // User messages align right, model messages align left (default)
    const messageContainerClasses = `flex items-start gap-2 sm:gap-4 group ${isGrouped ? 'mt-1.5' : 'mt-6'} ${message.role === 'user' ? 'justify-end' : 'justify-start'}`;
    
    // Width constraints
    // Mobile: User messages capped at 80% for better visual separation. Model messages use available space (minus actions gap).
    const widthConstraints = message.role === 'user' 
        ? "max-w-[80%] sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl"
        : "max-w-[calc(100%-2.5rem)] sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl";

    let bubbleClasses = `flex flex-col min-w-0 transition-all duration-200 ${widthConstraints} message-content-container `;

    if (message.role === 'user') {
        // User Message: Bubble style
        bubbleClasses += "w-fit px-5 py-3.5 shadow-md ";
        bubbleClasses += "bg-[var(--theme-bg-user-message)] text-[var(--theme-bg-user-message-text)] rounded-3xl rounded-br-sm border border-transparent shadow-[0_4px_14px_0_rgba(0,0,0,0.08)]";
    } else if (message.role === 'model') {
        // Model Message: No bubble style
        // Ajout de padding-top pour aligner avec l'icône et éviter le chevauchement
        bubbleClasses += `w-full pt-2 py-1 text-[var(--theme-text-primary)] leading-relaxed text-[1.05em] ${isModelThinkingOrHasThoughts ? 'sm:min-w-[320px]' : ''}`;
    } else {
        // Error Message: Bubble style (Red)
        bubbleClasses += "w-fit px-5 py-3.5 shadow-md ";
        bubbleClasses += "bg-[var(--theme-bg-error-message)] text-[var(--theme-bg-error-message-text)] rounded-3xl border border-red-500/20";
    }

    return (
        <div 
            className="relative"
            data-message-id={message.id} 
            data-message-role={message.role}
        >
            <div className={`${messageContainerClasses}`}>
                {message.role !== 'user' && <MessageActions {...props} isGrouped={isGrouped} />}
                <div className={`${bubbleClasses}`}>
                    <MessageContent {...props} />
                </div>
                {message.role === 'user' && <MessageActions {...props} isGrouped={isGrouped} />}
            </div>
        </div>
    );
});