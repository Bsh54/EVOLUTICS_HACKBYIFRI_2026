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

  // Synchroniser le contenu avec le ref
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== content) {
      contentRef.current.innerText = content;
    }
  }, [content]);

  const handleInput = () => {
    if (contentRef.current) {
      onContentChange(contentRef.current.innerText);
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
    <div className="relative w-full max-w-[700px]">
      <div
        id="letter-preview"
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="w-full bg-white rounded-lg shadow-2xl p-12 min-h-[297mm] text-black outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/20 transition-all cursor-text"
        style={{ 
          fontFamily: 'Georgia, serif', 
          fontSize: '14px', 
          lineHeight: '1.8',
          color: '#000000',
          whiteSpace: 'pre-wrap'
        }}
      >
        {content}
      </div>
    </div>
  );
};

export default CoverLetterPreview;
