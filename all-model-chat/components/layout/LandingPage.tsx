import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Briefcase,
  Bot,
  ArrowRight,
  Search,
  Zap,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';
import { Footer } from './Footer';
import { ThemeToggle } from '../ui/ThemeToggle';
import { opportunityService } from '../../services/opportunityService';
import { Opportunity } from '../../types/opportunity';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  themeId: string;
  onThemeChange: (themeId: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn, themeId, onThemeChange }) => {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [latestOpportunities, setLatestOpportunities] = useState<Opportunity[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);

  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        const opps = await opportunityService.getAll();
        setLatestOpportunities(opps.slice(0, 4));
      } catch (error) {
        console.error('Erreur chargement opportunités:', error);
      } finally {
        setIsLoadingOpps(false);
      }
    };
    loadOpportunities();
  }, []);

  // auto slide
  useEffect(() => {
    if (latestOpportunities.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % latestOpportunities.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [latestOpportunities.length]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] custom-scrollbar">

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle
          currentThemeId={themeId}
          onThemeChange={onThemeChange}
          size="md"
          className="shadow-lg"
        />
      </div>

      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop"
            alt="Étudiants travaillant ensemble"
            className="w-full h-full object-cover object-center opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--theme-bg-secondary)] via-[var(--theme-bg-secondary)]/95 to-[var(--theme-bg-accent)]/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-[#09090b]/40" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#3b82f6]/20 blur-3xl landing-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#2563eb]/15 blur-3xl landing-float-slow" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#8b5cf6]/15 blur-3xl landing-float-delayed" />
        </div>

        {/* bg illustration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="1440" height="800" fill="url(#grid)" />

            <rect x="50" y="450" width="50" height="350" rx="4" fill="currentColor" opacity="0.6" />
            <rect x="55" y="460" width="15" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="80" y="460" width="15" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="55" y="485" width="15" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="80" y="485" width="15" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            <rect x="120" y="350" width="70" height="450" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="130" y="365" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="160" y="365" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="130" y="395" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="160" y="395" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            <rect x="210" y="400" width="55" height="400" rx="4" fill="currentColor" opacity="0.4" />
            <rect x="290" y="300" width="80" height="500" rx="4" fill="currentColor" opacity="0.7" />
            <rect x="300" y="315" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="335" y="315" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="300" y="350" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="335" y="350" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            <rect x="400" y="380" width="50" height="420" rx="4" fill="currentColor" opacity="0.45" />
            <rect x="470" y="280" width="65" height="520" rx="4" fill="currentColor" opacity="0.55" />
            <rect x="560" y="350" width="55" height="450" rx="4" fill="currentColor" opacity="0.4" />

            <rect x="900" y="420" width="50" height="380" rx="4" fill="currentColor" opacity="0.45" />
            <rect x="970" y="320" width="70" height="480" rx="4" fill="currentColor" opacity="0.6" />
            <rect x="980" y="335" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="1010" y="335" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            <rect x="1060" y="380" width="55" height="420" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="1140" y="250" width="80" height="550" rx="4" fill="currentColor" opacity="0.65" />
            <rect x="1150" y="265" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="1185" y="265" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="1150" y="300" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
            <rect x="1185" y="300" width="25" height="25" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

            <rect x="1240" y="370" width="50" height="430" rx="4" fill="currentColor" opacity="0.4" />
            <rect x="1310" y="420" width="60" height="380" rx="4" fill="currentColor" opacity="0.5" />
            <rect x="1390" y="350" width="50" height="450" rx="4" fill="currentColor" opacity="0.45" />

            {/* trend line */}
            <path d="M0 650 Q 150 640, 300 580 T 650 450 T 1000 320 T 1440 180" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="12 6" />
            <circle cx="300" cy="580" r="6" fill="currentColor" opacity="0.6" />
            <circle cx="300" cy="580" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="650" cy="450" r="8" fill="currentColor" opacity="0.7" />
            <circle cx="650" cy="450" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="1000" cy="320" r="8" fill="currentColor" opacity="0.7" />
            <circle cx="1000" cy="320" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="1350" cy="200" r="10" fill="currentColor" opacity="0.8" />
            <circle cx="1350" cy="200" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />

            <g transform="translate(200, 100) rotate(-8)">
              <rect width="70" height="90" rx="8" fill="currentColor" opacity="0.5" />
              <circle cx="35" cy="22" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <line x1="15" y1="42" x2="55" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="52" x2="55" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="62" x2="45" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="72" x2="50" y2="72" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            </g>

            <g transform="translate(1100, 80) rotate(5)">
              <rect width="70" height="90" rx="8" fill="currentColor" opacity="0.5" />
              <circle cx="35" cy="22" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <line x1="15" y1="42" x2="55" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="52" x2="55" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="62" x2="45" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="72" x2="50" y2="72" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            </g>

            <g transform="translate(700, 60)">
              <polygon points="0,30 40,10 80,30 40,50" fill="currentColor" opacity="0.6" />
              <rect x="37" y="50" width="6" height="20" fill="currentColor" opacity="0.6" />
              <line x1="80" y1="30" x2="80" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.5" />
              <circle cx="80" cy="58" r="3" fill="currentColor" opacity="0.5" />
            </g>

            <g transform="translate(680, 350)" opacity="0.4">
              <circle cx="40" cy="40" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="25" cy="30" r="4" fill="currentColor" />
              <circle cx="55" cy="30" r="4" fill="currentColor" />
              <circle cx="40" cy="50" r="4" fill="currentColor" />
              <circle cx="20" cy="50" r="4" fill="currentColor" />
              <circle cx="60" cy="50" r="4" fill="currentColor" />
              <circle cx="40" cy="25" r="4" fill="currentColor" />
              <line x1="25" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="1" />
              <line x1="25" y1="30" x2="40" y2="50" stroke="currentColor" strokeWidth="1" />
              <line x1="55" y1="30" x2="40" y2="50" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="50" x2="40" y2="25" stroke="currentColor" strokeWidth="1" />
              <line x1="60" y1="50" x2="40" y2="25" stroke="currentColor" strokeWidth="1" />
              <line x1="20" y1="50" x2="60" y2="50" stroke="currentColor" strokeWidth="1" />
            </g>

            <g transform="translate(1350, 120) rotate(25)">
              <path d="M15,50 L15,25 Q15,0 25,0 Q35,0 35,25 L35,50 Z" fill="currentColor" opacity="0.5" />
              <polygon points="10,45 15,35 15,50" fill="currentColor" opacity="0.4" />
              <polygon points="40,45 35,35 35,50" fill="currentColor" opacity="0.4" />
              <circle cx="25" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              <path d="M20,50 Q25,65 30,50" fill="currentColor" opacity="0.3" />
            </g>

            <circle cx="800" cy="180" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="830" cy="200" r="2" fill="currentColor" opacity="0.2" />
            <circle cx="780" cy="210" r="2" fill="currentColor" opacity="0.2" />
            <line x1="800" y1="180" x2="830" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="800" y1="180" x2="780" y2="210" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

            <circle cx="550" cy="150" r="3" fill="currentColor" opacity="0.3" />
            <circle cx="580" cy="130" r="2" fill="currentColor" opacity="0.2" />
            <circle cx="530" cy="170" r="2" fill="currentColor" opacity="0.2" />
            <line x1="550" y1="150" x2="580" y2="130" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="550" y1="150" x2="530" y2="170" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto -mt-8 md:-mt-12 lg:-mt-14">
          <div className="flex items-center gap-4 mb-8 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border-2 border-white/20 shadow-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <EvoluticsLogo className="h-20 w-auto drop-shadow-sm border-2 border-white/30 rounded-xl p-1" />
            <span className="font-black text-2xl tracking-widest text-white drop-shadow-sm">EVOLUTICS</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-white animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Votre avenir professionnel,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              propulsé par l'IA
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-white/80 font-medium max-w-2xl leading-relaxed mb-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Explorez des centaines d'opportunités, préparez vos candidatures avec un coach IA et décrochez le poste de vos rêves — le tout sur une seule plateforme.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <button
              onClick={onGetStarted}
              className="relative flex items-center justify-center gap-3 bg-white text-[var(--theme-bg-accent)] hover:bg-gray-50 font-black py-3.5 px-8 rounded-2xl shadow-[0_8px_30px_rgb(255,255,255,0.2)] transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest group overflow-hidden hover:shadow-[0_12px_40px_rgb(255,255,255,0.3)] hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative z-10">Commencer gratuitement</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
            </button>
            <button
              onClick={onSignIn}
              className="relative flex items-center justify-center gap-3 bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40 hover:border-white/40 text-white font-bold py-3.5 px-8 rounded-2xl transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest group overflow-hidden hover:shadow-[0_8px_25px_rgba(255,255,255,0.1)] hover:scale-105"
            >
              <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/30 rounded-2xl transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="relative z-10 group-hover:text-blue-100 transition-colors duration-300">Se connecter</span>
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-20 opacity-60 text-white animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
            <ChevronRight className="w-6 h-6 rotate-90 animate-bounce" />
          </div>
        </div>

        {/* Styles CSS pour les animations */}
        <style>{`
          @keyframes fade-in-up {
            0% {
              opacity: 0;
              transform: translateY(30px) scale(0.95);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          .animate-fade-in-up {
            opacity: 0;
            animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}</style>
      </section>

      {/* ═══════════ FEATURES SECTION ═══════════ */}
      <section className="relative px-6 py-24 md:py-32">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-bg-accent)] mb-4 block">
              Fonctionnalités
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Tout pour réussir
            </h2>
            <p className="text-[var(--theme-text-secondary)] font-medium max-w-lg mx-auto">
              Une plateforme complète qui vous accompagne à chaque étape de votre parcours professionnel.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Briefcase,
                title: "Hub d'Opportunités",
                description: 'Emplois, stages, bourses et concours — toutes les offres centralisées et filtrables en temps réel.',
                gradient: 'from-[#3b82f6] to-[#2563eb]',
              },
              {
                icon: Bot,
                title: 'Assistant IA Coach',
                description: 'Génération de CV, lettres de motivation et simulation d\'entretien propulsées par l\'intelligence artificielle.',
                gradient: 'from-[#8b5cf6] to-[#6d28d9]',
              },
              {
                icon: TrendingUp,
                title: 'Suivi de Carrière',
                description: 'Suivez votre progression, recevez des recommandations personnalisées et atteignez vos objectifs professionnels.',
                gradient: 'from-[#10b981] to-[#059669]',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-3xl p-8 hover:border-[var(--theme-bg-accent)]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--theme-bg-accent)]/5 hover:-translate-y-1"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-[var(--theme-text-secondary)] font-medium leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ OPPORTUNITÉS RÉCENTES - SLIDER ═══════════ */}
      <section className="relative px-6 py-20 md:py-24 bg-[var(--theme-bg-secondary)]">
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-12">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-bg-accent)] mb-4 block">
              Opportunités du moment
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Dernières offres disponibles
            </h2>
            <p className="text-[var(--theme-text-secondary)] font-medium max-w-lg mx-auto">
              Découvrez les opportunités les plus récentes et ne manquez aucune chance de réussir.
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] shadow-xl">
            {isLoadingOpps ? (
              // Loading skeleton
              <div className="h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-[var(--theme-bg-accent)] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[var(--theme-text-secondary)] font-medium">Chargement des opportunités...</p>
                </div>
              </div>
            ) : latestOpportunities.length === 0 ? (
              // Empty state
              <div className="h-[400px] md:h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-[var(--theme-text-tertiary)]" />
                  <p className="text-[var(--theme-text-secondary)] font-medium">Aucune opportunité disponible pour le moment</p>
                </div>
              </div>
            ) : (
              <>
                {/* Slides */}
                <div className="relative h-[400px] md:h-[500px]">
                  {latestOpportunities.map((opp, index) => (
                    <div
                      key={opp.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                        index === currentSlide
                          ? 'opacity-100 translate-x-0 z-10'
                          : index < currentSlide
                          ? 'opacity-0 -translate-x-full z-0'
                          : 'opacity-0 translate-x-full z-0'
                      }`}
                    >
                      <div className="h-full grid grid-cols-1 md:grid-cols-2 gap-0">
                        {/* Image */}
                        <div className="relative h-48 md:h-full overflow-hidden">
                          <img
                            src={opp.image || 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070'}
                            alt={opp.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Type badge */}
                          <div className="absolute top-6 left-6">
                            <span className="bg-[var(--theme-bg-accent)] text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                              {opp.type}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col justify-center p-8 md:p-12 bg-[var(--theme-bg-primary)]">
                          <div className="space-y-6">
                            {/* Organization */}
                            <p className="text-[var(--theme-bg-accent)] text-[10px] font-black uppercase tracking-[0.2em]">
                              {opp.organization || 'Organisation'}
                            </p>

                            {/* Title */}
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight leading-tight line-clamp-2">
                              {opp.title || 'Opportunité sans titre'}
                            </h3>

                            {/* Description */}
                            <p className="text-[var(--theme-text-secondary)] font-medium leading-relaxed line-clamp-3">
                              {opp.description || 'Aucune description disponible.'}
                            </p>

                            {/* Meta info */}
                            <div className="flex flex-wrap gap-4 pt-4 border-t border-[var(--theme-border-primary)]">
                              {opp.location && (
                                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-secondary)]">
                                  <MapPin className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                                  <span className="font-medium">{opp.location}</span>
                                </div>
                              )}
                              {opp.deadline && (
                                <div className="flex items-center gap-2 text-sm text-[var(--theme-text-secondary)]">
                                  <Clock className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                                  <span className="font-medium">{formatDate(opp.deadline)}</span>
                                </div>
                              )}
                            </div>

                            {/* CTA Button */}
                            <button
                              onClick={onGetStarted}
                              className="inline-flex items-center justify-center gap-3 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-white font-black py-3 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest group w-full md:w-auto"
                            >
                              Voir l'opportunité
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  {latestOpportunities.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 rounded-full ${
                        index === currentSlide
                          ? 'w-8 h-2 bg-white'
                          : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                      }`}
                      aria-label={`Aller à la slide ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Navigation arrows - Desktop only */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + latestOpportunities.length) % latestOpportunities.length)}
                  className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/40 transition-all group"
                  aria-label="Slide précédente"
                >
                  <ChevronRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % latestOpportunities.length)}
                  className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-12 h-12 bg-black/20 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-black/40 transition-all group"
                  aria-label="Slide suivante"
                >
                  <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* CTA to see all opportunities */}
          <div className="text-center mt-10">
            <button
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 text-[var(--theme-bg-accent)] hover:text-[var(--theme-bg-accent-hover)] font-bold text-sm uppercase tracking-widest transition-all group"
            >
              Voir toutes les opportunités
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING SECTION ═══════════ */}
      <section className="relative px-6 py-24 md:py-32 bg-[var(--theme-bg-primary)] overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-[var(--theme-bg-accent)] blur-3xl" />
          <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-blue-500 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-bg-accent)] mb-4 block">
              Tarification
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-[var(--theme-text-secondary)] font-medium max-w-2xl mx-auto">
              Des solutions adaptées à tous les besoins, des étudiants aux institutions.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Freemium Card */}
            <div className="group relative bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2.5rem] p-8 md:p-10 hover:border-[var(--theme-bg-accent)]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[var(--theme-bg-accent)]/5">
              <div className="space-y-6">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[var(--theme-bg-tertiary)] px-4 py-2 rounded-full border border-[var(--theme-border-primary)]">
                  <Sparkles className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-[var(--theme-text-primary)]">Freemium</span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black tracking-tight">Gratuit</span>
                  </div>
                  <p className="text-[var(--theme-text-secondary)] font-medium text-sm">Pour commencer votre parcours</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 pt-6 border-t border-[var(--theme-border-primary)]">
                  {[
                    'Accès illimité aux opportunités',
                    'Génération de 5 CV optimisés par mois',
                    '3 simulations d\'entretiens par mois',
                    'Recommandations de base',
                    'Limite de tokens IA'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--theme-bg-accent)]/10 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[var(--theme-bg-accent)]" />
                      </div>
                      <span className="text-[var(--theme-text-primary)] font-medium text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={onGetStarted}
                  className="w-full flex items-center justify-center gap-3 bg-[var(--theme-bg-tertiary)] hover:bg-[var(--theme-bg-accent)] hover:text-white border border-[var(--theme-border-primary)] text-[var(--theme-text-primary)] font-black py-4 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest group/btn mt-8"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Premium Card */}
            <div className="group relative bg-gradient-to-br from-[var(--theme-bg-accent)] to-[var(--theme-bg-accent-hover)] rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-[var(--theme-bg-accent)]/20 hover:shadow-[var(--theme-bg-accent)]/30 transition-all duration-300 hover:scale-[1.02]">
              {/* Popular badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="bg-white text-[var(--theme-bg-accent)] px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
                  ⭐ Populaire
                </div>
              </div>

              <div className="space-y-6 text-white">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl md:text-6xl font-black tracking-tight">3 000</span>
                    <span className="text-2xl font-bold opacity-90">FCFA</span>
                  </div>
                  <p className="text-white/80 font-medium text-sm">Par mois • Sans engagement</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 pt-6 border-t border-white/20">
                  {[
                    'Génération illimitée de CV et lettres',
                    'Simulations d\'entretiens illimitées',
                    'Recommandations avancées par IA',
                    'Accès prioritaire aux nouvelles opportunités',
                    'Support prioritaire 24/7'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                      <span className="text-white font-medium text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={onGetStarted}
                  className="w-full flex items-center justify-center gap-3 bg-white text-[var(--theme-bg-accent)] hover:bg-white/90 font-black py-4 px-6 rounded-xl transition-all duration-300 active:scale-[0.98] text-sm uppercase tracking-widest group/btn mt-8 shadow-lg"
                >
                  Passer à Premium
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="relative px-6 py-24 md:py-32 bg-[var(--theme-bg-secondary)]">
        <div className="max-w-5xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--theme-bg-accent)] mb-4 block">
              Comment ça marche
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4">
              3 étapes simples
            </h2>
            <p className="text-[var(--theme-text-secondary)] font-medium max-w-lg mx-auto">
              De la création de votre profil à la préparation de vos entretiens, tout est pensé pour être simple.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                step: '01',
                icon: GraduationCap,
                title: 'Créez votre profil',
                description: 'Inscrivez-vous en quelques secondes et personnalisez votre profil pour recevoir des recommandations adaptées.',
                gradient: 'from-[#667eea] to-[#764ba2]',
              },
              {
                step: '02',
                icon: Search,
                title: 'Explorez les opportunités',
                description: 'Parcourez emplois, stages, bourses et concours. Filtrez par catégorie et trouvez l\'offre idéale.',
                gradient: 'from-[#4facfe] to-[#00f2fe]',
              },
              {
                step: '03',
                icon: MessageSquare,
                title: "Préparez-vous avec l'IA",
                description: 'Générez CV et lettres de motivation, simulez des entretiens et boostez votre confiance avant le jour J.',
                gradient: 'from-[#43e97b] to-[#38f9d7]',
              },
            ].map((item, i) => (
              <div key={i} className="relative flex flex-col items-center text-center">
                {/* Step number */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                  <span className="text-2xl font-black text-white">{item.step}</span>
                </div>
                {/* Connector line (hidden on last item and mobile) */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-[var(--theme-border-primary)] to-transparent" />
                )}
                <h3 className="text-lg font-black mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[var(--theme-text-secondary)] font-medium text-sm leading-relaxed max-w-xs">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FOOTER CTA ═══════════ */}
      <section className="relative px-6 py-24 md:py-32 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--theme-bg-accent)] via-[var(--theme-bg-accent-hover)] to-[var(--theme-bg-secondary)] opacity-[0.07]" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-10 -right-10 w-80 h-80 rounded-full bg-[#3b82f6]/10 blur-3xl" />
          <div className="absolute -top-10 -left-10 w-64 h-64 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-6">
            Prêt à transformer{' '}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              votre carrière ?
            </span>
          </h2>
          <p className="text-[var(--theme-text-secondary)] font-medium mb-10 max-w-xl mx-auto">
            Rejoignez EVOLUTICS dès aujourd'hui et accédez à des centaines d'opportunités propulsées par l'intelligence artificielle.
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center gap-3 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-4 px-10 rounded-2xl shadow-xl shadow-[var(--theme-bg-accent)]/25 transition-all active:scale-[0.98] text-sm uppercase tracking-widest group"
          >
            Rejoindre EVOLUTICS
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ═══════════ FOOTER ═══════════ */}
      <Footer />
    </div>
  );
};

export default LandingPage;
