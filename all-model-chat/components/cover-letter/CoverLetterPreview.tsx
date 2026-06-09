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
  onContentChange
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const isUpdatingFromProp = useRef(false);

  // Synchroniser avec le contenu généré
  useEffect(() => {
    console.log('🔍 [CoverLetterPreview] Content reçu:', {
      contentLength: content?.length,
      firstChars: content?.substring(0, 50),
      hasRef: !!contentRef.current
    });

    if (content && contentRef.current) {
      isUpdatingFromProp.current = true;
      
      console.log('🧹 [CoverLetterPreview] Nettoyage du DOM...');
      // Vider d'abord le contenu
      contentRef.current.innerHTML = '';
      
      // Attendre un tick pour que le DOM soit nettoyé
      requestAnimationFrame(() => {
        if (contentRef.current) {
          const htmlContent = content.replace(/\n/g, '<br>');
          console.log('📝 [CoverLetterPreview] Insertion du contenu:', {
            originalLength: content.length,
            htmlLength: htmlContent.length,
            firstCharsOriginal: content.substring(0, 50),
            firstCharsHTML: htmlContent.substring(0, 50)
          });
          
          // Insérer le nouveau contenu avec les sauts de ligne convertis en <br>
          contentRef.current.innerHTML = htmlContent;
          
          console.log('✅ [CoverLetterPreview] Contenu inséré dans le DOM:', {
            innerHTML: contentRef.current.innerHTML.substring(0, 100),
            innerText: contentRef.current.innerText.substring(0, 100),
            textContent: contentRef.current.textContent?.substring(0, 100)
          });
          
          // Remettre le flag après un court délai
          setTimeout(() => {
            isUpdatingFromProp.current = false;
            console.log('🔓 [CoverLetterPreview] Flag de mise à jour désactivé');
          }, 50);
        }
      });
    }
  }, [content]);

  const handleInput = () => {
    if (isUpdatingFromProp.current || !contentRef.current) {
      console.log('⏸️ [CoverLetterPreview] Input ignoré (mise à jour en cours)');
      return;
    }
    
    // Récupérer le texte brut (innerText préserve les sauts de ligne)
    const newContent = contentRef.current.innerText || '';
    console.log('✏️ [CoverLetterPreview] Contenu modifié par l\'utilisateur:', {
      length: newContent.length,
      firstChars: newContent.substring(0, 50)
    });
    onContentChange(newContent);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Insérer un saut de ligne
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        const br = document.createElement('br');
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        selection.removeAllRanges();
        selection.addRange(range);
      }
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
          height: '297mm',
          maxHeight: '297mm',
          minHeight: '297mm',
          padding: '48px',
          boxSizing: 'border-box'
        }}
      />
    </div>
  );
};

export default CoverLetterPreview;
