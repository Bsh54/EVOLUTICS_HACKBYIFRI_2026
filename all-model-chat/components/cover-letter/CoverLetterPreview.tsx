import React, { useRef, useEffect } from 'react';
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

  // Mettre à jour le contenu uniquement quand il change vraiment (génération)
  useEffect(() => {
    if (contentRef.current && content !== lastContentRef.current) {
      lastContentRef.current = content;
      // Petit délai pour s'assurer que le DOM est prêt
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.textContent = content;
          // Forcer le curseur au début
          const range = document.createRange();
          const sel = window.getSelection();
          if (contentRef.current.firstChild) {
            range.setStart(contentRef.current.firstChild, 0);
            range.collapse(true);
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }
      }, 10);
    }
  }, [content]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (contentRef.current) {
      const newContent = contentRef.current.textContent || '';
      lastContentRef.current = newContent;
      onContentChange(newContent);
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

  return (
    <div className="w-full max-w-[700px]">
      <div
        id="letter-preview"
        ref={contentRef}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        className="w-full bg-white rounded-lg shadow-2xl outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/20 transition-all cursor-text overflow-y-auto"
        style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '14px', 
          lineHeight: '1.8',
          color: '#000000',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          WebkitUserModify: 'read-write-plaintext-only',
          height: '297mm',
          maxHeight: '297mm',
          padding: '48px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default CoverLetterPreview;
