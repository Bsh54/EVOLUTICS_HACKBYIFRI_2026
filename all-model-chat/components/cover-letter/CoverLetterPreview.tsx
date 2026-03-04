import React, { useRef, useEffect, useState } from 'react';
import { UserProfile } from '../../types/user';

interface LetterFormData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  tone: string;
  additionalInfo: string;
}

interface CoverLetterPreviewProps {
  content: string;
  formData: LetterFormData;
  profile: UserProfile | null;
  onContentChange: (content: string) => void;
}

const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  content,
  formData,
  profile,
  onContentChange
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>('');
  const [wordCount, setWordCount] = useState(0);

  // Mettre à jour le contenu uniquement quand il change vraiment (génération)
  useEffect(() => {
    if (contentRef.current && content !== lastContentRef.current) {
      lastContentRef.current = content;
      contentRef.current.textContent = content;
      updateWordCount(content);
    }
  }, [content]);

  const updateWordCount = (text: string) => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      const newContent = contentRef.current.textContent || '';
      lastContentRef.current = newContent;
      onContentChange(newContent);
      updateWordCount(newContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Permettre tous les événements clavier normaux
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertText', false, '\n');
    }
  };

  if (!content) {
    return (
      <div className="w-full max-w-[700px] bg-white rounded-lg shadow-2xl p-12 min-h-[297mm]">
        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
          <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">Votre lettre apparaîtra ici</p>
          <p className="text-sm mt-2">Remplissez le formulaire et cliquez sur "Générer"</p>
        </div>
      </div>
    );
  }

  const isOverLimit = wordCount > 350;

  return (
    <div className="relative w-full max-w-[700px]">
      {/* Indicateur de page et compteur de mots */}
      <div className="absolute -top-8 left-0 right-0 flex items-center justify-between text-xs">
        <span className="text-[var(--theme-text-tertiary)]">
          📄 Format A4 - Une seule page
        </span>
        <span className={`font-medium ${isOverLimit ? 'text-red-500' : wordCount > 300 ? 'text-orange-500' : 'text-green-600'}`}>
          {wordCount} mots {isOverLimit ? '⚠️ Trop long' : wordCount > 300 ? '⚠️' : '✓'}
        </span>
      </div>
      
      <div
        id="letter-preview"
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="w-full bg-white rounded-lg shadow-2xl p-12 text-black outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/20 transition-all cursor-text overflow-y-auto"
        style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '14px', 
          lineHeight: '1.8',
          color: '#000000',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          WebkitUserModify: 'read-write-plaintext-only',
          height: '297mm', // Hauteur exacte d'une page A4
          maxHeight: '297mm'
        }}
      />
      
      {/* Ligne de limite de page */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t ${isOverLimit ? 'from-red-500/40' : 'from-blue-500/20'} to-transparent pointer-events-none rounded-b-lg`} />
    </div>
  );
};

export default CoverLetterPreview;
