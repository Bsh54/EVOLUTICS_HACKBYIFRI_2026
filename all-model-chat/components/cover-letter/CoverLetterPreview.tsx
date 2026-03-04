import React, { useState } from 'react';
import { Edit3, Eye } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);

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

  const formatContentForDisplay = (text: string) => {
    return text.split('\n').map((line, i) => (
      <p key={i} className={line.trim() === '' ? 'mb-4' : 'mb-2'} style={{ textAlign: 'justify' }}>
        {line || '\u00A0'}
      </p>
    ));
  };

  return (
    <div className="relative w-full max-w-[700px]">
      {/* Toggle Edit/Preview - Visible sur tous les écrans */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-secondary)] hover:bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] rounded-xl transition-all text-sm font-medium text-[var(--theme-text-primary)]"
        >
          {isEditing ? (
            <>
              <Eye className="w-4 h-4" />
              Aperçu
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4" />
              Modifier
            </>
          )}
        </button>
      </div>

      <div
        id="letter-preview"
        className="w-full bg-white rounded-lg shadow-2xl p-12 min-h-[297mm]"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="w-full h-full min-h-[800px] border-none outline-none resize-none bg-transparent text-black leading-relaxed"
            style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '14px', 
              lineHeight: '1.8',
              color: '#000000'
            }}
          />
        ) : (
          <div 
            className="text-black"
            style={{ 
              fontFamily: 'Georgia, serif', 
              fontSize: '14px', 
              lineHeight: '1.8',
              color: '#000000'
            }}
          >
            {formatContentForDisplay(content)}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPreview;
