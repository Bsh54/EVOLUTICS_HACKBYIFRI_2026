import React from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface CoverLetterTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'professionnel' | 'moderne' | 'creatif';
  isAvailable: boolean;
}

interface CoverLetterTemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  onBack: () => void;
  themeId: string;
}

const CoverLetterTemplateSelector: React.FC<CoverLetterTemplateSelectorProps> = ({
  onSelectTemplate,
  onBack,
  themeId
}) => {
  const templates: CoverLetterTemplate[] = [
    {
      id: 'professionnel-01',
      name: 'Professionnel Moderne',
      description: 'Format classique et élégant, adapté à tous les secteurs professionnels',
      preview: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400',
      category: 'professionnel',
      isAvailable: true
    },
    {
      id: 'moderne-01',
      name: 'Moderne Dynamique',
      description: 'Design contemporain pour les secteurs tech et startups',
      preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=400',
      category: 'moderne',
      isAvailable: false
    },
    {
      id: 'creatif-01',
      name: 'Créatif Original',
      description: 'Style unique pour les métiers créatifs et artistiques',
      preview: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400',
      category: 'creatif',
      isAvailable: false
    }
  ];

  return (
    <div className={`h-full overflow-y-auto bg-[var(--theme-bg-primary)] theme-${themeId}`}>
      {/* Header */}
      <div className="sticky top-0 bg-[var(--theme-bg-primary)] border-b border-[var(--theme-border-primary)] p-6 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-[var(--theme-bg-secondary)] rounded-xl transition-colors"
          >
            <ArrowRight className="w-5 h-5 text-[var(--theme-text-primary)] rotate-180" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--theme-text-primary)]">
              ✉️ Choisissez votre Template de Lettre
            </h1>
            <p className="text-[var(--theme-text-secondary)]">
              Sélectionnez le style qui correspond à votre candidature
            </p>
          </div>
        </div>
      </div>

      {/* Grille des templates */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`group relative bg-[var(--theme-bg-secondary)] border-2 rounded-3xl overflow-hidden transition-all duration-300 ${
                template.isAvailable
                  ? 'border-[var(--theme-border-primary)] hover:border-[var(--theme-bg-accent)] cursor-pointer hover:shadow-xl hover:shadow-[var(--theme-bg-accent)]/10 hover:-translate-y-2'
                  : 'border-[var(--theme-border-secondary)] opacity-60'
              }`}
              onClick={() => template.isAvailable && onSelectTemplate(template.id)}
            >
              {/* Badge de statut */}
              <div className="absolute top-4 right-4 z-10">
                {template.isAvailable ? (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Disponible
                  </div>
                ) : (
                  <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Bientôt
                  </div>
                )}
              </div>

              {/* Preview image */}
              <div className="h-64 relative overflow-hidden">
                <img
                  src={template.preview}
                  alt={template.name}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    template.isAvailable ? 'group-hover:scale-110' : ''
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* Category badge */}
                <div className="absolute bottom-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    template.category === 'professionnel' ? 'bg-blue-500/80 text-white' :
                    template.category === 'moderne' ? 'bg-purple-500/80 text-white' :
                    'bg-pink-500/80 text-white'
                  }`}>
                    {template.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className={`text-xl font-black mb-2 transition-colors ${
                  template.isAvailable
                    ? 'text-[var(--theme-text-primary)] group-hover:text-[var(--theme-bg-accent)]'
                    : 'text-[var(--theme-text-secondary)]'
                }`}>
                  {template.name}
                </h3>
                <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed mb-4">
                  {template.description}
                </p>

                {/* Action button */}
                {template.isAvailable ? (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--theme-bg-accent)] uppercase tracking-wider">
                      Cliquez pour utiliser
                    </span>
                    <ArrowRight className="w-5 h-5 text-[var(--theme-text-tertiary)] group-hover:text-[var(--theme-bg-accent)] group-hover:translate-x-1 transition-all" />
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">
                      Prochainement disponible
                    </span>
                  </div>
                )}
              </div>

              {/* Hover effect overlay */}
              {template.isAvailable && (
                <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterTemplateSelector;
