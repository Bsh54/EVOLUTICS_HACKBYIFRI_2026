import React, { useState, useEffect } from 'react';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  MessageSquare,
  Lightbulb,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  Clock,
  Plus,
  Search,
  Heart,
  User,
  Palette,
  FileText
} from 'lucide-react';

// Imports des composants originaux
import { HistorySidebar } from '../sidebar/HistorySidebar';
import { ChatArea } from './ChatArea';
import { AppModals } from '../modals/AppModals';
import { SidePanel } from './SidePanel';
import ProfilePage from '../auth/ProfilePage';
import ToolsPage from '../tools/ToolsPage';
import DocumentGeneratorModal from '../modals/DocumentGeneratorModal';
import { useAuth } from '../../contexts/AuthContext';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';
import { ThemeToggle } from '../ui/ThemeToggle';

// Types et Données externalisés
import { Opportunity } from '../../types/opportunity';
import { opportunityService } from '../../services/opportunityService';

interface ShadsAIHubProps {
  sidebarProps: any;
  chatAreaProps: any;
  appModalsProps: any;
  isHistorySidebarOpen: boolean;
  setIsHistorySidebarOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
  sidePanelContent: any;
  onCloseSidePanel: () => void;
  themeId: string;
  onThemeChange: (themeId: string) => void;
  currentTheme: any;
}

const ShadsAIHub: React.FC<ShadsAIHubProps> = (props) => {
  const {
    sidebarProps,
    chatAreaProps,
    appModalsProps,
    isHistorySidebarOpen,
    setIsHistorySidebarOpen,
    sidePanelContent,
    onCloseSidePanel,
    themeId,
    onThemeChange,
  } = props;

  const { profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'opportunities' | 'tools' | 'profile'>('opportunities');
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [filterType, setFilterType] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [opportunityForCV, setOpportunityForCV] = useState<Opportunity | null>(null);
  const [opportunityForLetter, setOpportunityForLetter] = useState<Opportunity | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedOpportunityForModal, setSelectedOpportunityForModal] = useState<Opportunity | null>(null);

  // Vérifier si le profil est incomplet
  const isProfileIncomplete = profile && (
    !profile.university || 
    !profile.field_of_study || 
    !profile.education_level || 
    !profile.graduation_year ||
    !profile.skills || profile.skills.length === 0 ||
    !profile.current_position ||
    profile.experience_years === undefined || profile.experience_years === null
  );

  // --- Initialisation du tab depuis l'URL (une seule fois) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');

    if (tabParam === 'chat') {
      setActiveTab('chat');
    } else if (tabParam === 'profile') {
      setActiveTab('profile');
    } else if (tabParam === 'tools') {
      setActiveTab('tools');
    } else {
      setActiveTab('opportunities');
    }
  }, []); // Exécuté une seule fois au montage

  // --- Gestion du bouton Précédent/Suivant ---
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state;
      if (state) {
        if (state.view === 'chat') {
          setActiveTab('chat');
          setSelectedOpp(null);
        } else if (state.view === 'profile') {
          setActiveTab('profile');
          setSelectedOpp(null);
        } else if (state.view === 'opportunity' && state.oppId) {
          setActiveTab('opportunities');
          const found = opportunities.find(o => o.id === state.oppId);
          if (found) setSelectedOpp(found);
        } else {
          setActiveTab('opportunities');
          setSelectedOpp(null);
        }
      } else {
        setActiveTab('opportunities');
        setSelectedOpp(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [opportunities]);

  // Fonctions de navigation wrapper
  const navigateToTab = (tab: 'chat' | 'opportunities' | 'tools' | 'profile') => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    url.searchParams.delete('oppId');
    window.history.pushState({ view: tab }, '', url.toString());
  };

  const navigateToOpp = (opp: Opportunity | null) => {
    setSelectedOpp(opp);
    const url = new URL(window.location.href);
    if (opp) {
      url.searchParams.set('tab', 'opportunities'); // On reste dans l'onglet opps
      url.searchParams.set('oppId', opp.id);
      window.history.pushState({ view: 'opportunity', oppId: opp.id }, '', url.toString());
    } else {
      url.searchParams.set('tab', 'opportunities');
      url.searchParams.delete('oppId');
      window.history.pushState({ view: 'opportunities' }, '', url.toString());
    }
  };
  // ---------------------------------------------

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('shads_opps_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Sauvegarde des favoris
  React.useEffect(() => {
    localStorage.setItem('shads_opps_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Chargement des données depuis Supabase
  const loadOpportunities = async () => {
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data);
    } catch (error) {
      console.error("Erreur de chargement des opportunités:", error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    loadOpportunities();

    // Écouter les changements (depuis l'admin ou autre onglet)
    const handleStorageChange = () => {
      // Un petit délai pour laisser le temps à Supabase de propager
      setTimeout(loadOpportunities, 500);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', loadOpportunities);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', loadOpportunities);
    };
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      // Si c'est déjà un format texte lisible, on le garde
      if (dateStr.includes(' ') && isNaN(Date.parse(dateStr))) return dateStr;

      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getUrgencyColor = (dateStr: string) => {
    if (!dateStr) return 'text-[var(--theme-text-tertiary)]';
    try {
      const deadline = new Date(dateStr);
      const today = new Date();
      const diffTime = deadline.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) return 'bg-red-600 text-white px-2 py-0.5 rounded font-black';
      if (diffDays <= 3) return 'text-red-500 font-black animate-pulse scale-110 origin-left';
      if (diffDays <= 7) return 'text-orange-500 font-black';
      return 'text-[var(--theme-text-primary)] font-bold';
    } catch (e) {
      return 'text-[var(--theme-text-tertiary)]';
    }
  };

  const getMainInfo = (opp: Opportunity) => {
    switch (opp.type) {
      case 'Emploi': return { icon: '💰', value: opp.salary || opp.contractType || 'CDI/CDD' };
      case 'Stage': return { icon: '⏳', value: opp.duration || 'STAGE' };
      case 'Bourse': return { icon: '💎', value: opp.reward || 'BOURSE' };
      case 'Concours': return { icon: '🏆', value: opp.prizes || opp.reward || 'CONCOURS' };
      case 'Conférences': return { icon: '🕒', value: opp.schedule || 'CONFÉRENCE' };
      default: return null;
    }
  };

  const otherOpps = opportunities
    .filter(o => (filterType === 'Tous' || o.type === filterType || (filterType === 'Favoris' && favorites.includes(o.id))))
    .filter(o => (
      (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (o.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    ));

  return (
    <div className={`flex flex-col h-full w-full overflow-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] transition-colors duration-300 relative`}>

      {/* MOBILE HEADER */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100]">
        <div className="flex items-center gap-2">
          <EvoluticsLogo className="w-10 h-10" />
          <span className="font-black text-sm uppercase tracking-tighter">EVOLUTICS</span>
        </div>

        {/* Toggle de thème mobile */}
        <ThemeToggle
          currentThemeId={themeId}
          onThemeChange={onThemeChange}
          size="sm"
          className="flex-shrink-0"
        />
      </header>

      {/* HEADER DESKTOP */}
      <header className="hidden md:flex items-center justify-between px-6 py-3 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)] z-[100] shadow-sm">
        <div className="flex items-center gap-3">
          <EvoluticsLogo className="w-10 h-10" />
          <span className="font-black text-lg tracking-tighter uppercase">EVOLUTICS</span>
        </div>

        <nav className="flex bg-[var(--theme-bg-tertiary)] rounded-2xl p-1 border border-[var(--theme-border-primary)]">
          <button
            onClick={() => navigateToTab('opportunities')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'opportunities' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <Lightbulb className="w-4 h-4" /> EXPLORER
          </button>
          <button
            onClick={() => navigateToTab('chat')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'chat' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <MessageSquare className="w-4 h-4" /> ASSISTANT
          </button>
          <button
            onClick={() => navigateToTab('tools')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === 'tools' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <Palette className="w-4 h-4" /> OUTILS
          </button>
          <button
            onClick={() => navigateToTab('profile')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative ${activeTab === 'profile' ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-xl' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
          >
            <User className="w-4 h-4" /> PROFIL
            {/* Badge de notification si profil incomplet */}
            {isProfileIncomplete && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-[var(--theme-bg-primary)] shadow-lg animate-pulse">
                !
              </span>
            )}
          </button>
        </nav>

        {/* Toggle de thème desktop */}
        <ThemeToggle
          currentThemeId={themeId}
          onThemeChange={onThemeChange}
          size="md"
          className="flex-shrink-0"
        />
      </header>

      <div className="flex-1 relative overflow-hidden">
        {/* Contenu principal */}
        <div className={`absolute inset-0 flex pb-16 md:pb-0 ${activeTab === 'chat' ? 'flex z-10' : 'hidden'}`}>
          {isHistorySidebarOpen && <div onClick={() => setIsHistorySidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 md:hidden" />}
          <HistorySidebar {...sidebarProps} />
          <div className="flex-1 flex flex-col min-w-0 h-full relative">
            <ChatArea {...chatAreaProps} />
          </div>
          {sidePanelContent && <SidePanel content={sidePanelContent} onClose={onCloseSidePanel} themeId={themeId} />}
          <AppModals {...appModalsProps} />
        </div>

        <div className={`absolute inset-0 overflow-y-auto bg-[var(--theme-bg-primary)] pb-16 md:pb-0 ${activeTab === 'opportunities' ? 'block z-20' : 'hidden'}`}>
          <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
            {!selectedOpp ? (
              <>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[var(--theme-border-primary)] pb-8">
                  <div className="space-y-4 flex-1">
                    <h3 className="text-3xl font-black uppercase tracking-tight text-[var(--theme-text-primary)]">Opportunities Board</h3>
                    <div className="relative max-w-md group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                      <input
                        type="text"
                        placeholder="Rechercher une annonce..."
                        className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 p-1.5 bg-[var(--theme-bg-secondary)] rounded-2xl border border-[var(--theme-border-primary)]">
                    {['Tous', 'Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences', 'Favoris'].map(t => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${filterType === t ? 'bg-[var(--theme-bg-accent)] text-[var(--theme-text-accent)] shadow-lg' : 'text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)]'}`}
                      >
                        {t === 'Favoris' && <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-current' : ''}`} />}
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[...Array(6)].map((_, index) => (
                      <div
                        key={index}
                        className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden relative animate-skeleton-pulse"
                        style={{
                          animationDelay: `${index * 0.2}s`
                        }}
                      >
                        {/* Effet de glow qui pulse */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-accent)]/10 via-transparent to-blue-500/5 animate-skeleton-glow rounded-[2.5rem]"></div>

                        {/* Particules flottantes */}
                        <div className="absolute top-4 right-4 w-2 h-2 bg-[var(--theme-bg-accent)]/30 rounded-full animate-skeleton-float"></div>
                        <div className="absolute top-8 right-8 w-1 h-1 bg-blue-400/40 rounded-full animate-skeleton-float-delayed"></div>
                        <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-purple-400/20 rounded-full animate-skeleton-float-slow"></div>

                        {/* Image skeleton avec effet de scan */}
                        <div className="relative h-48 bg-gradient-to-br from-[var(--theme-bg-tertiary)] to-[var(--theme-bg-secondary)] overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-skeleton-scan"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-accent)]/5 to-transparent animate-skeleton-breathe"></div>

                          {/* Lignes de scan */}
                          <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--theme-bg-accent)]/20 to-transparent animate-skeleton-line"></div>
                          <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/15 to-transparent animate-skeleton-line-delayed"></div>
                          <div className="absolute top-3/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/10 to-transparent animate-skeleton-line-slow"></div>
                        </div>

                        {/* Content skeleton avec clignotements */}
                        <div className="p-8 flex-1 flex flex-col justify-between space-y-6 relative">
                          {/* Effet de particules dans le contenu */}
                          <div className="absolute top-2 left-2 w-1 h-1 bg-[var(--theme-bg-accent)]/20 rounded-full animate-skeleton-blink"></div>
                          <div className="absolute bottom-4 right-4 w-1 h-1 bg-blue-400/25 rounded-full animate-skeleton-blink-delayed"></div>

                          <div className="space-y-4">
                            {/* Organization skeleton avec clignotement */}
                            <div className="relative">
                              <div className="h-3 bg-gradient-to-r from-[var(--theme-bg-tertiary)] via-[var(--theme-bg-accent)]/10 to-[var(--theme-bg-tertiary)] rounded-full w-24 animate-skeleton-shimmer"></div>
                              <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/20 rounded-full animate-skeleton-flash"></div>
                            </div>

                            {/* Title skeleton avec effet de typing */}
                            <div className="space-y-2">
                              <div className="relative">
                                <div className="h-6 bg-gradient-to-r from-[var(--theme-bg-tertiary)] via-[var(--theme-bg-accent)]/15 to-[var(--theme-bg-tertiary)] rounded w-full animate-skeleton-shimmer"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-[var(--theme-bg-accent)]/40 animate-skeleton-cursor"></div>
                              </div>
                              <div className="relative">
                                <div className="h-6 bg-gradient-to-r from-[var(--theme-bg-tertiary)] via-blue-400/10 to-[var(--theme-bg-tertiary)] rounded w-3/4 animate-skeleton-shimmer-delayed"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-400/30 animate-skeleton-cursor-delayed"></div>
                              </div>
                            </div>
                          </div>

                          {/* Footer skeleton avec pulsations */}
                          <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)] relative">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-[var(--theme-bg-tertiary)] to-[var(--theme-bg-accent)]/20 rounded-lg animate-skeleton-rotate"></div>
                                <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/10 rounded-lg animate-skeleton-ping"></div>
                              </div>
                              <div className="h-4 bg-gradient-to-r from-[var(--theme-bg-tertiary)] via-purple-400/10 to-[var(--theme-bg-tertiary)] rounded w-20 animate-skeleton-wave"></div>
                            </div>
                            <div className="relative">
                              <div className="h-8 bg-gradient-to-r from-[var(--theme-bg-tertiary)] via-[var(--theme-bg-accent)]/15 to-[var(--theme-bg-tertiary)] rounded-xl w-24 animate-skeleton-bounce"></div>
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-skeleton-sweep"></div>
                            </div>
                          </div>
                        </div>

                        {/* Bordure qui pulse */}
                        <div className="absolute inset-0 border-2 border-[var(--theme-bg-accent)]/0 rounded-[2.5rem] animate-skeleton-border-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {otherOpps.map((opp, index) => (
                    <div
                      key={opp.id}
                      onClick={() => navigateToOpp(opp)}
                      className="group flex flex-col bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-secondary)] rounded-[2.5rem] overflow-hidden cursor-pointer hover:border-[var(--theme-bg-accent)]/40 transition-all duration-500 relative animate-fade-in-up opacity-0"
                      style={{
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: 'forwards'
                      }}
                    >
                      {/* Favorite Toggle */}
                      <button
                        onClick={(e) => toggleFavorite(e, opp.id)}
                        className="absolute top-6 right-6 z-30 w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-[var(--theme-bg-accent)] transition-all group/fav"
                      >
                        <Heart className={`w-5 h-5 transition-transform group-hover/fav:scale-125 ${favorites.includes(opp.id) ? 'fill-white text-white' : 'text-white/70'}`} />
                      </button>

                      <div className="h-64 relative overflow-hidden">
                        <img src={opp.image || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070"} className="w-full h-full object-cover transition-transform duration-700 scale-100 group-hover:scale-110" />
                        <div className="absolute top-6 left-6 flex flex-col gap-2">
                           <span className="bg-black/50 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">{opp.type}</span>
                        </div>

                        {/* Badge de l'info majeure (Sug. 1) */}
                        {getMainInfo(opp) && (
                          <div className="absolute bottom-6 right-6 z-20 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-2xl transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                            <div className="flex flex-col items-end">
                              <span className="text-white font-black text-sm whitespace-nowrap drop-shadow-md">
                                {getMainInfo(opp)?.icon} {getMainInfo(opp)?.value}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <p className="text-[var(--theme-bg-accent)] text-[10px] font-black uppercase tracking-[0.2em]">{opp.organization || "Anonyme"}</p>
                          <h4 className="text-2xl font-bold leading-tight group-hover:text-[var(--theme-text-link)] transition-colors line-clamp-2">{opp.title || "Opportunité sans titre"}</h4>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-[var(--theme-border-primary)]">
                          <div className={`flex items-center gap-3 text-sm font-black uppercase tracking-tight ${getUrgencyColor(opp.deadline)}`}>
                            <div className="p-2 bg-[var(--theme-bg-tertiary)] rounded-lg border border-[var(--theme-border-primary)]">
                              <Clock className="w-4 h-4" />
                            </div>
                            <span>{formatDate(opp.deadline) || "Date à venir"}</span>
                          </div>

                          <div className="bg-[var(--theme-bg-tertiary)] px-3 py-1.5 rounded-xl border border-[var(--theme-border-primary)] flex items-center gap-2 hover:bg-[var(--theme-bg-accent)] hover:text-white transition-all">
                             <ArrowRight className="w-3.5 h-3.5" />
                             <span className="text-[9px] font-black uppercase">Voir détails</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </>
            ) : (
              <div className="animate-in slide-in-from-right duration-700 pb-20">
                <div className="relative h-[45vh] md:h-[70vh] w-full overflow-hidden rounded-b-[5rem] shadow-2xl group/hero">
                  <img
                    src={selectedOpp.image}
                    className="w-full h-full object-cover object-[50%_35%] scale-110 group-hover/hero:scale-[1.15] transition-transform duration-[2000ms] ease-out"
                  />
                  {/* Overlay dégradé multicouche pour un rendu cinéma */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-transparent"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-primary)] via-transparent to-transparent opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute top-8 left-8 z-10">
                    <button onClick={() => navigateToOpp(null)} className="group flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 px-5 py-2.5 rounded-2xl text-white hover:bg-[var(--theme-bg-accent)] transition-all font-bold uppercase text-[10px] tracking-[0.2em]">
                      <ChevronLeft className="w-4 h-4" /> RETOUR
                    </button>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-16 relative">
                  <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-6">
                      <span className="bg-[var(--theme-bg-accent)] text-white px-4 py-1 rounded-full font-black text-[9px] uppercase tracking-widest inline-block shadow-lg">{selectedOpp.type}</span>
                      <h1 className="text-2xl md:text-6xl font-black tracking-tighter text-[var(--theme-text-primary)] leading-tight">{selectedOpp.title}</h1>

                      {/* Barre d'informations clés */}
                      <div className="flex flex-wrap gap-4 pt-4">
                        <div className={`flex items-center gap-3 px-6 py-3 bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg ${getUrgencyColor(selectedOpp.deadline)}`}>
                          <Clock className="w-5 h-5" /> {formatDate(selectedOpp.deadline) || "Date limite non spécifiée"}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl text-xs font-bold uppercase tracking-wider">
                          <Sparkles className="w-4 h-4 text-[var(--theme-bg-accent)]" /> {selectedOpp.location}
                        </div>
                        {selectedOpp.reward && (
                          <div className="flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-accent)]/10 border border-[var(--theme-bg-accent)]/20 rounded-xl text-xs font-black text-[var(--theme-bg-accent)] uppercase tracking-wider">
                            ✨ {selectedOpp.reward}
                          </div>
                        )}
                      </div>

                      {/* Fiche Technique Visuelle (Sug. 1) */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                        {selectedOpp.type === 'Emploi' && (
                          <>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Salaire</span>
                              <span className="text-lg font-bold">💰 {selectedOpp.salary || 'À débattre'}</span>
                            </div>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Contrat</span>
                              <span className="text-lg font-bold">📄 {selectedOpp.contractType || 'CDI'}</span>
                            </div>
                          </>
                        )}
                        {selectedOpp.type === 'Stage' && (
                          <>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Durée</span>
                              <span className="text-lg font-bold">⏳ {selectedOpp.duration || 'N/A'}</span>
                            </div>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Niveau</span>
                              <span className="text-lg font-bold">🎓 {selectedOpp.level || 'Étudiant'}</span>
                            </div>
                          </>
                        )}
                        {selectedOpp.type === 'Concours' && (
                          <div className="col-span-2 bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                            <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Prix à gagner</span>
                            <span className="text-lg font-bold">🏆 {selectedOpp.prizes || selectedOpp.reward}</span>
                          </div>
                        )}
                        {selectedOpp.type === 'Conférences' && (
                          <>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Horaire</span>
                              <span className="text-lg font-bold">🕒 {selectedOpp.schedule || '09:00'}</span>
                            </div>
                            <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)]">
                              <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Intervenants</span>
                              <span className="text-lg font-bold truncate">👥 {selectedOpp.speakers || 'Experts'}</span>
                            </div>
                          </>
                        )}
                        <div className="bg-[var(--theme-bg-tertiary)] p-4 rounded-2xl border border-[var(--theme-border-primary)] hidden">
                          <span className="text-[10px] font-black text-[var(--theme-text-tertiary)] uppercase block mb-1">Spécialités</span>
                          <div className="flex gap-2 flex-wrap">
                            {selectedOpp.tags?.slice(0, 3).map(tag => (
                              <span key={tag} className="text-sm font-bold px-3 py-1.5 bg-[var(--theme-bg-accent)]/10 text-[var(--theme-bg-accent)] rounded-lg border border-[var(--theme-bg-accent)]/20">#{tag}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[var(--theme-text-secondary)] max-w-none pt-8 border-t border-[var(--theme-border-primary)]">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-4xl font-black text-[var(--theme-text-primary)] mb-8 mt-12 tracking-tighter uppercase border-b-4 border-[var(--theme-bg-accent)] w-fit pb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-2xl font-black text-[var(--theme-text-primary)] mb-6 mt-10 tracking-tight uppercase flex items-center gap-3 before:content-[''] before:w-2 before:h-8 before:bg-[var(--theme-bg-accent)] before:rounded-full" {...props} />,
                          strong: ({node, ...props}) => <strong className="text-[var(--theme-bg-accent)] font-black px-1.5 py-0.5 bg-[var(--theme-bg-accent)]/10 rounded-md" {...props} />,
                          ul: ({node, ...props}) => <ul className="space-y-4 mb-8 ml-4" {...props} />,
                          li: ({node, ...props}) => (
                            <li className="flex items-start gap-3 text-lg md:text-xl">
                              <span className="mt-2.5 w-2 h-2 rounded-full bg-[var(--theme-bg-accent)] shrink-0" />
                              <span {...props} />
                            </li>
                          ),
                          p: ({node, ...props}) => <p className="text-lg md:text-xl leading-relaxed mb-6 opacity-90 font-medium" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[var(--theme-border-primary)] pl-6 italic my-8 text-2xl font-light opacity-80" {...props} />,
                        }}
                      >
                        {selectedOpp.fullContent}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    {/* PC: Reste centré et fixe au scroll dans sa colonne | Mobile: Suit le flux du texte */}
                    <div className="lg:sticky lg:top-[25%] space-y-3 w-full max-w-sm mx-auto lg:mx-0 lg:ml-auto lg:mr-32 mt-12 lg:mt-0 z-50">
                      <button
                        onClick={(e) => toggleFavorite(e, selectedOpp.id)}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold uppercase tracking-wide transition-all border-2 text-base ${favorites.includes(selectedOpp.id) ? 'bg-red-500 border-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-transparent border-[var(--theme-border-secondary)] text-[var(--theme-text-primary)] hover:border-red-500 hover:text-red-500'}`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.includes(selectedOpp.id) ? 'fill-current' : ''}`} />
                        {favorites.includes(selectedOpp.id) ? 'ENREGISTRÉ' : 'SAUVEGARDER'}
                      </button>
                      <button
                        onClick={() => {
                          if (selectedOpp.link || selectedOpp.contactEmail) {
                            if (selectedOpp.contactEmail) {
                              window.location.href = `mailto:${selectedOpp.contactEmail}?subject=Candidature : ${selectedOpp.title}`;
                            } else {
                              const url = selectedOpp.link.startsWith('http') ? selectedOpp.link : `https://${selectedOpp.link}`;
                              window.open(url, '_blank', 'noopener,noreferrer');
                            }
                          }
                        }}
                        className="w-full bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-bold py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95 text-base uppercase tracking-tight"
                      >
                        {selectedOpp.contactEmail ? 'POSTULER PAR EMAIL' : 'POSTULER MAINTENANT'} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </button>
                      <button
                        onClick={() => {
                          const getSystemInstruction = (opp: Opportunity) => {
                            const base = `Tu es un Coach Carrière Expert pour la plateforme EVOLUTICS. Ton rôle est d'accompagner l'étudiant pour maximiser ses chances d'obtenir l'opportunité suivante :

Titre: ${opp.title}
Organisation: ${opp.organization}
Type: ${opp.type}
Date limite: ${opp.deadline || 'Non spécifiée'}
Lieu: ${opp.location || 'Non spécifié'}

DÉTAILS COMPLETS DE L'OFFRE :
---
${opp.fullContent}
---

TES OBJECTIFS :
1. Analyser le profil de l'étudiant (pose des questions si besoin).
2. Proposer des conseils stratégiques personnalisés (CV, Lettre de motivation, Entretien).
3. Être encourageant, précis et orienté résultat.
4. Si l'étudiant te demande de rédiger quelque chose, base-toi STRICTEMENT sur les détails de l'offre ci-dessus.

RÈGLES DE COMPORTEMENT :
- Sois proactif : ne te contente pas de répondre, propose la prochaine étape logique.
- Adopte un ton professionnel mais bienveillant.
- Utilise le format Markdown pour structurer tes réponses (listes à puces, gras pour les mots-clés).`;

                            return base;
                          };

                          const getInitialGreeting = (opp: Opportunity) => {
                            // 0. Priorité absolue : Message pré-généré par l'IA Admin
                            if (opp.aiGreeting) {
                              return opp.aiGreeting;
                            }

                            // 1. Analyse rapide des mots-clés pour la personnalisation (Fallback)
                            const contentLower = opp.fullContent.toLowerCase();
                            const isTech = contentLower.includes('python') || contentLower.includes('javascript') || contentLower.includes('react') || contentLower.includes('dev');
                            const isManagement = contentLower.includes('gestion') || contentLower.includes('équipe') || contentLower.includes('projet');

                            // 2. Construction des suggestions dynamiques selon le type
                            let specificSuggestions = "";
                            let contextIntro = "";

                            switch(opp.type) {
                              case 'Concours':
                              case 'Hackathon': // Cas géré si le type est Hackathon
                                contextIntro = "J'ai analysé le règlement et les critères de ce concours.";
                                specificSuggestions = `*   💡 **Brainstormer des idées** innovantes pour le thème
*   🚀 **Structurer le Pitch** pour convaincre le jury
*   📋 **Planifier la roadmap** du projet
*   ⚖️ **Analyser les critères** de notation`;
                                break;

                              case 'Emploi':
                                contextIntro = isTech
                                  ? "J'ai repéré les compétences techniques demandées (Stack technique)."
                                  : "J'ai analysé les responsabilités du poste et le profil recherché.";

                                specificSuggestions = `*   🎯 **Adapter mon CV** aux mots-clés de l'annonce
*   ✍️ **Rédiger une lettre** qui prouve ma valeur
*   🏰 **Simuler l'entretien** ${isTech ? 'technique et ' : ''}culturel
*   💰 **Conseils pour la négociation** de salaire`;
                                break;

                              case 'Stage':
                                contextIntro = "C'est une excellente opportunité pour apprendre.";
                                specificSuggestions = `*   🎓 **Valoriser mes projets** académiques pour ce stage
*   ✉️ **Écrire une candidature** spontanée et motivée
*   🗣️ **Préparer ma présentation** pour l'entretien
*   ❓ **Quelles questions poser** au recruteur ?`;
                                break;

                              case 'Bourse':
                                contextIntro = "L'obtention de cette bourse dépend beaucoup de la clarté de ton projet.";
                                specificSuggestions = `*   📝 **Rédiger mon projet d'étude** de façon convaincante
*   🆘 **Justifier ma situation** sociale/financière
*   📂 **Vérifier la complétude** de mon dossier
*   🎙️ **Préparer l'oral** de motivation`;
                                break;

                              default:
                                contextIntro = "Je suis prêt à t'accompagner sur cette opportunité.";
                                specificSuggestions = `*   🔍 **Analyser les points clés** de l'offre
*   📝 **M'aider à rédiger** ma candidature
*   🗣️ **M'entraîner** pour l'entretien`;
                            }

                            return `Bonjour ! 👋\n\nJe suis ton coach dédié pour **"${opp.title}"** chez *${opp.organization}*.\n\n${contextIntro}\n\nVoici comment je peux t'aider concrètement :\n\n${specificSuggestions}`;
                          };

                          const systemInstruction = getSystemInstruction(selectedOpp);
                          const greeting = getInitialGreeting(selectedOpp);

                          if (chatAreaProps.onStartContextualChat) {
                            chatAreaProps.onStartContextualChat(systemInstruction, greeting);
                            navigateToTab('chat');
                          }
                        }}
                        className="w-full bg-transparent border-2 border-[var(--theme-border-secondary)] text-[var(--theme-text-primary)] font-bold py-3.5 rounded-xl hover:bg-[var(--theme-bg-accent)] hover:border-[var(--theme-bg-accent)] hover:text-white transition-all flex items-center justify-center gap-2 group text-base uppercase tracking-tight"
                      >
                        PRÉPARER AVEC L'IA <Sparkles className="w-5 h-5 text-[var(--theme-bg-accent)] group-hover:text-white" />
                      </button>
                      {/* Bouton GÉNÉRER DOCUMENTS - Uniquement pour Emploi, Stage et Bourse */}
                      {(selectedOpp.type === 'Emploi' || selectedOpp.type === 'Stage' || selectedOpp.type === 'Bourse') && (
                        <button
                          onClick={() => {
                            setSelectedOpportunityForModal(selectedOpp);
                            setIsDocumentModalOpen(true);
                          }}
                          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 group text-base uppercase tracking-tight"
                        >
                          GÉNÉRER DOCUMENTS <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAGE PROFIL — rendu comme un onglet */}
        <div className={`absolute inset-0 overflow-y-auto bg-[var(--theme-bg-primary)] pb-16 md:pb-0 ${activeTab === 'profile' ? 'block z-30' : 'hidden'}`}>
          {profile && (
            <ProfilePage
              profile={profile}
              onBack={() => navigateToTab('opportunities')}
              onSignOut={signOut}
              onUpdateProfile={updateProfile}
              onNavigateToTab={(tab) => navigateToTab(tab)}
            />
          )}
        </div>

        {/* PAGE OUTILS — rendu comme un onglet */}
        <div className={`absolute inset-0 overflow-y-auto bg-[var(--theme-bg-primary)] pb-16 md:pb-0 ${activeTab === 'tools' ? 'block z-40' : 'hidden'}`}>
          <ToolsPage
            themeId={themeId}
            onThemeChange={onThemeChange}
            opportunityForCV={opportunityForCV}
            opportunityForLetter={opportunityForLetter}
            onClearOpportunity={() => {
              setOpportunityForCV(null);
              setOpportunityForLetter(null);
            }}
            userProfile={profile}
          />
        </div>
      </div>

      {/* MOBILE APP BAR - 4 ONGLETS */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--theme-bg-primary)] border-t border-[var(--theme-border-primary)] z-[999] grid grid-cols-4 items-center shadow-[0_-4px_20px_rgba(0,0,0,0.1)] backdrop-blur-xl">
        <button
          onClick={() => navigateToTab('opportunities')}
          className={`h-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group ${
            activeTab === 'opportunities'
              ? 'text-[var(--theme-bg-accent)]'
              : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'
          }`}
        >
          <div className="p-2 rounded-xl transition-all duration-300">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Explorer</span>
        </button>

        <button
          onClick={() => navigateToTab('chat')}
          className={`h-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group ${
            activeTab === 'chat'
              ? 'text-[var(--theme-bg-accent)]'
              : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'
          }`}
        >
          <div className="p-2 rounded-xl transition-all duration-300">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Assistant</span>
        </button>

        <button
          onClick={() => navigateToTab('tools')}
          className={`h-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group ${
            activeTab === 'tools'
              ? 'text-[var(--theme-bg-accent)]'
              : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'
          }`}
        >
          <div className="p-2 rounded-xl transition-all duration-300">
            <Palette className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Outils</span>
        </button>

        <button
          onClick={() => navigateToTab('profile')}
          className={`h-full flex flex-col items-center justify-center transition-all duration-300 active:scale-95 relative group ${
            activeTab === 'profile'
              ? 'text-[var(--theme-bg-accent)]'
              : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'
          }`}
        >
          <div className="p-2 rounded-xl transition-all duration-300 relative">
            <User className="w-5 h-5" />
            {/* Badge de notification si profil incomplet */}
            {isProfileIncomplete && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full border-2 border-[var(--theme-bg-primary)] shadow-lg animate-pulse">
                !
              </span>
            )}
          </div>
          <span className="text-[9px] font-black mt-1 uppercase tracking-wider">Profil</span>
        </button>
      </nav>

      {/* Styles CSS pour les animations */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Animations pour les cartes squelettes */
        @keyframes skeleton-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.02);
            opacity: 1;
          }
        }

        @keyframes skeleton-glow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes skeleton-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-10px) rotate(180deg);
            opacity: 0.8;
          }
        }

        @keyframes skeleton-float-delayed {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          50% {
            transform: translateY(-8px) rotate(-180deg);
            opacity: 0.6;
          }
        }

        @keyframes skeleton-float-slow {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-6px) scale(1.2);
            opacity: 0.4;
          }
        }

        @keyframes skeleton-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes skeleton-breathe {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }

        @keyframes skeleton-line {
          0%, 100% {
            opacity: 0;
            transform: scaleX(0);
          }
          50% {
            opacity: 1;
            transform: scaleX(1);
          }
        }

        @keyframes skeleton-line-delayed {
          0%, 100% {
            opacity: 0;
            transform: scaleX(0) translateX(20px);
          }
          50% {
            opacity: 0.8;
            transform: scaleX(1) translateX(0);
          }
        }

        @keyframes skeleton-line-slow {
          0%, 100% {
            opacity: 0;
            transform: scaleX(0) translateX(-20px);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1) translateX(0);
          }
        }

        @keyframes skeleton-blink {
          0%, 50%, 100% { opacity: 0.2; }
          25%, 75% { opacity: 0.8; }
        }

        @keyframes skeleton-blink-delayed {
          0%, 25%, 50%, 75%, 100% { opacity: 0.1; }
          12.5%, 37.5%, 62.5%, 87.5% { opacity: 0.6; }
        }

        @keyframes skeleton-shimmer {
          0% {
            background-position: -200% 0;
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.8;
          }
        }

        @keyframes skeleton-shimmer-delayed {
          0% {
            background-position: -200% 0;
            opacity: 0.6;
          }
          50% {
            opacity: 0.9;
          }
          100% {
            background-position: 200% 0;
            opacity: 0.6;
          }
        }

        @keyframes skeleton-flash {
          0%, 90%, 100% { opacity: 0; }
          5%, 85% { opacity: 0.4; }
        }

        @keyframes skeleton-cursor {
          0%, 50% { opacity: 0; }
          25%, 75% { opacity: 1; }
        }

        @keyframes skeleton-cursor-delayed {
          0%, 25%, 50%, 75% { opacity: 0; }
          12.5%, 37.5%, 62.5%, 87.5% { opacity: 0.8; }
        }

        @keyframes skeleton-rotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes skeleton-ping {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.1;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }

        @keyframes skeleton-wave {
          0%, 100% {
            transform: translateX(0) scaleX(1);
            opacity: 0.7;
          }
          50% {
            transform: translateX(5px) scaleX(1.05);
            opacity: 1;
          }
        }

        @keyframes skeleton-bounce {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-2px);
            opacity: 1;
          }
        }

        @keyframes skeleton-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(100%) skewX(-15deg); }
        }

        @keyframes skeleton-border-pulse {
          0%, 100% {
            border-color: transparent;
            box-shadow: 0 0 0 0 var(--theme-bg-accent);
          }
          50% {
            border-color: var(--theme-bg-accent);
            box-shadow: 0 0 20px 2px rgba(79, 70, 229, 0.1);
          }
        }

        @keyframes mobile-tab-indicator {
          0% {
            transform: scaleX(0);
            opacity: 0;
          }
          50% {
            transform: scaleX(1.2);
            opacity: 1;
          }
          100% {
            transform: scaleX(1);
            opacity: 1;
          }
        }

        @keyframes mobile-tab-glow {
          0%, 100% {
            opacity: 0.05;
          }
          50% {
            opacity: 0.1;
          }
        }

        /* Application des animations */
        .animate-fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-mobile-tab-indicator {
          animation: mobile-tab-indicator 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-mobile-tab-glow {
          animation: mobile-tab-glow 2s ease-in-out infinite;
        }

        .animate-skeleton-pulse { animation: skeleton-pulse 3s ease-in-out infinite; }
        .animate-skeleton-glow { animation: skeleton-glow 2s ease-in-out infinite; }
        .animate-skeleton-float { animation: skeleton-float 4s ease-in-out infinite; }
        .animate-skeleton-float-delayed { animation: skeleton-float-delayed 4.5s ease-in-out infinite; }
        .animate-skeleton-float-slow { animation: skeleton-float-slow 5s ease-in-out infinite; }
        .animate-skeleton-scan { animation: skeleton-scan 3s linear infinite; }
        .animate-skeleton-breathe { animation: skeleton-breathe 2.5s ease-in-out infinite; }
        .animate-skeleton-line { animation: skeleton-line 2s ease-in-out infinite; }
        .animate-skeleton-line-delayed { animation: skeleton-line-delayed 2.3s ease-in-out infinite; }
        .animate-skeleton-line-slow { animation: skeleton-line-slow 2.7s ease-in-out infinite; }
        .animate-skeleton-blink { animation: skeleton-blink 1.5s ease-in-out infinite; }
        .animate-skeleton-blink-delayed { animation: skeleton-blink-delayed 1.8s ease-in-out infinite; }
        .animate-skeleton-shimmer {
          background-size: 200% 100%;
          animation: skeleton-shimmer 2s ease-in-out infinite;
        }
        .animate-skeleton-shimmer-delayed {
          background-size: 200% 100%;
          animation: skeleton-shimmer-delayed 2.2s ease-in-out infinite;
        }
        .animate-skeleton-flash { animation: skeleton-flash 3s ease-in-out infinite; }
        .animate-skeleton-cursor { animation: skeleton-cursor 1s ease-in-out infinite; }
        .animate-skeleton-cursor-delayed { animation: skeleton-cursor-delayed 1.2s ease-in-out infinite; }
        .animate-skeleton-rotate { animation: skeleton-rotate 4s linear infinite; }
        .animate-skeleton-ping { animation: skeleton-ping 2s ease-in-out infinite; }
        .animate-skeleton-wave { animation: skeleton-wave 1.8s ease-in-out infinite; }
        .animate-skeleton-bounce { animation: skeleton-bounce 1.5s ease-in-out infinite; }
        .animate-skeleton-sweep { animation: skeleton-sweep 2.5s ease-in-out infinite; }
        .animate-skeleton-border-pulse { animation: skeleton-border-pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Modal de sélection de document */}
      <DocumentGeneratorModal
        isOpen={isDocumentModalOpen}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setSelectedOpportunityForModal(null);
        }}
        onSelectCV={() => {
          setOpportunityForCV(selectedOpportunityForModal);
          navigateToTab('tools');
        }}
        onSelectCoverLetter={() => {
          setOpportunityForLetter(selectedOpportunityForModal);
          navigateToTab('tools');
        }}
        opportunityTitle={selectedOpportunityForModal?.title}
      />

    </div>
  );
};

export default ShadsAIHub;
