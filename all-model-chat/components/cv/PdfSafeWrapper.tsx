import React from 'react';

interface PdfSafeWrapperProps {
  children: React.ReactNode;
}

/**
 * Ce wrapper garantit un export PDF fidèle à la prévisualisation
 * en neutralisant les couleurs oklch de Tailwind 4 et en fixant les dimensions A4.
 */
export const PdfSafeWrapper: React.FC<PdfSafeWrapperProps> = ({ children }) => {
  return (
    <div className="pdf-safe-container relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page { margin: 0; size: A4; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }

        /* CONFIGURATION PAGE UNIQUE A4 (794px x 1123px à 96 DPI) */
        .pdf-export-mode {
          width: 794px !important;
          height: 1123px !important;
          min-height: 1123px !important;
          max-height: 1123px !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: white !important;
          overflow: hidden !important; /* Force la page unique */
          display: flex !important;
          flex-direction: row !important;
          position: relative !important;
          box-shadow: none !important;
          transform: none !important;
          border: none !important;
        }

        /* FIX POUR LES ICÔNES ET COULEURS (html2canvas ne supporte pas oklch) */
        .pdf-export-mode * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
        }

        /* Traduction de la palette Slate (Tailwind 4) en HEX pour le moteur PDF */
        .pdf-export-mode .text-slate-800 { color: #1e293b !important; }
        .pdf-export-mode .text-slate-700 { color: #334155 !important; }
        .pdf-export-mode .text-slate-600 { color: #475569 !important; }
        .pdf-export-mode .text-slate-500 { color: #64748b !important; }
        .pdf-export-mode .text-slate-400 { color: #94a3b8 !important; }
        .pdf-export-mode .bg-slate-50 { background-color: #f8fafc !important; }
        .pdf-export-mode .bg-slate-100 { background-color: #f1f5f9 !important; }
        .pdf-export-mode .border-slate-100 { border-color: #f1f5f9 !important; }
        .pdf-export-mode .bg-[#f0f7f7] { background-color: #f0f7f7 !important; }

        /* Couleur Primaire (Teal #00a99d) */
        .pdf-export-mode .text-\[\#00a99d\] { color: #00a99d !important; }
        .pdf-export-mode .bg-\[\#00a99d\] { background-color: #00a99d !important; }
        .pdf-export-mode [style*="background-color: rgb(0, 169, 157)"] { background-color: #00a99d !important; }
        .pdf-export-mode [style*="color: rgb(0, 169, 157)"] { color: #00a99d !important; }

        /* Correction des Icônes Lucide */
        .pdf-export-mode svg {
          display: inline-block !important;
          vertical-align: middle !important;
          stroke: currentColor !important;
          fill: none !important;
        }

        /* Forcer les polices et lissage */
        .pdf-export-mode {
          font-family: ui-sans-serif, system-ui, -apple-system, sans-serif !important;
          -webkit-font-smoothing: antialiased !important;
          color: #1e293b !important;
        }

        .pdf-export-mode aside {
          width: 38% !important;
          background-color: #f0f7f7 !important;
          height: 100% !important;
        }

        .pdf-export-mode main {
          width: 62% !important;
          background-color: #ffffff !important;
          height: 100% !important;
        }
      `}} />
      {children}
    </div>
  );
};
