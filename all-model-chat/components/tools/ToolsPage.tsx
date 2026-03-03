import React, { useState } from 'react';
import { ArrowRight, FileText, MessageSquare, Users, Briefcase } from 'lucide-react';
import CVBuilderPage from '../cv/CVBuilderPage';
import { Opportunity } from '../../types/opportunity';

interface ToolsPageProps {
  themeId: string;
  onThemeChange: (themeId: string) => void;
  opportunityForCV?: Opportunity | null;
  onClearOpportunity?: () => void;
}

type ToolStatus = 'active' | 'coming-soon';

interface Tool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  status: ToolStatus;
  image: string;
}

const ToolsPage: React.FC<ToolsPageProps> = ({ themeId, onThemeChange, opportunityForCV, onClearOpportunity }) => {
  const [currentView, setCurrentView] = useState<'tools-list' | 'cv-builder'>('tools-list');

  // Ouvrir automatiquement le CV Builder si une opportunité est fournie
  React.useEffect(() => {
    if (opportunityForCV) {
      setCurrentView('cv-builder');
    }
  }, [opportunityForCV]);

  const tools: Tool[] = [
    {
      id: 'cv-builder',
      title: 'Création de CV',
      description: 'Créez votre CV professionnel en quelques clics avec nos templates modernes et personnalisables',
      icon: FileText,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070'
    },
    {
      id: 'cover-letter',
      title: 'Lettres de Motivation',
      description: 'Générez des lettres de motivation personnalisées et adaptées à chaque opportunité',
      icon: MessageSquare,
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=2070'
    },
    {
      id: 'interview-prep',
      title: 'Préparation Entretiens',
      description: 'Simulez des entretiens d\'embauche avec notre IA pour gagner en confiance',
      icon: Users,
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2070'
    },
    {
      id: 'portfolio',
      title: 'Portfolio Digital',
      description: 'Créez un portfolio en ligne pour mettre en valeur vos projets et réalisations',
      icon: Briefcase,
      status: 'coming-soon',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2070'
    }
  ];

  const handleToolClick = (toolId: string) => {
    if (toolId === 'cv-builder') {
      setCurrentView('cv-builder');
    } else {
      // Pour les autres outils pas encore disponibles
      console.log(`${toolId} sera bientôt disponible !`);
    }
  };

  const handleBackToTools = () => {
    setCurrentView('tools-list');
    // Nettoyer l'opportunité quand on revient à la liste
    if (onClearOpportunity) {
      onClearOpportunity();
    }
  };

  // Si on est dans le CV Builder, afficher la page dédiée
  if (currentView === 'cv-builder') {
    return (
      <CVBuilderPage
        onBack={handleBackToTools}
        themeId={themeId}
        onThemeChange={onThemeChange}
        opportunityForCV={opportunityForCV}
      />
    );
  }

  // Affichage de la liste des outils
  return (
    <div className="h-full overflow-y-auto bg-[var(--theme-bg-primary)] p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--theme-text-primary)] mb-2">
          🛠️ Outils Créatifs
        </h1>
        <p className="text-[var(--theme-text-secondary)]">
          Des outils pour booster votre recherche d'emploi
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            className={`group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden transition-all duration-500 relative animate-fade-in-up ${
              tool.status === 'active'
                ? 'cursor-pointer hover:border-[var(--theme-bg-accent)]/40 hover:shadow-xl hover:shadow-[var(--theme-bg-accent)]/10 hover:-translate-y-1'
                : 'opacity-75 cursor-not-allowed'
            }`}
          >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 z-10">
              {tool.status === 'active' ? (
                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Disponible
                </div>
              ) : (
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Bientôt
                </div>
              )}
            </div>

            {/* Image */}
            <div className="h-64 relative overflow-hidden">
              <img
                src={tool.image}
                className={`w-full h-full object-cover transition-transform duration-700 ${
                  tool.status === 'active' ? 'group-hover:scale-110' : ''
                }`}
                alt={tool.title}
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="p-8 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-xl ${
                      tool.status === 'active'
                        ? 'bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)]'
                        : 'bg-gray-500/10 text-gray-500'
                    }`}>
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-xl font-black transition-colors ${
                      tool.status === 'active'
                        ? 'text-[var(--theme-text-primary)] group-hover:text-[var(--theme-bg-accent)]'
                        : 'text-[var(--theme-text-secondary)]'
                    }`}>
                      {tool.title}
                    </h3>
                  </div>
                  <p className="text-[var(--theme-text-secondary)] text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                {tool.status === 'active' ? (
                  <>
                    <span className="text-xs font-bold text-[var(--theme-bg-accent)] uppercase tracking-wider">
                      Cliquez pour utiliser
                    </span>
                    <ArrowRight className="w-5 h-5 text-[var(--theme-text-tertiary)] group-hover:text-[var(--theme-bg-accent)] group-hover:translate-x-1 transition-all" />
                  </>
                ) : (
                  <span className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider mx-auto">
                    Prochainement disponible
                  </span>
                )}
              </div>
            </div>

            {/* Hover effect overlay */}
            {tool.status === 'active' && (
              <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default ToolsPage;