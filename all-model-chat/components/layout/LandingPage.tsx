import React from 'react';
import {
  Sparkles,
  Briefcase,
  Bot,
  ArrowRight,
  Search,
  Shield,
  Zap,
  GraduationCap,
  MessageSquare,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onSignIn }) => {
  return (
    <div className="h-screen w-full overflow-y-auto overflow-x-hidden bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] custom-scrollbar">

      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
        {/* Background photo — career/tech ambiance */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
            alt="Background"
            className="w-full h-full object-cover opacity-20 blur-[1px]"
          />
          {/* Multi-layer overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--theme-bg-primary)] via-[var(--theme-bg-primary)]/90 to-[var(--theme-bg-primary)]" />
        </div>

        {/* Decorative blurs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#3b82f6]/20 blur-3xl landing-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#2563eb]/15 blur-3xl landing-float-slow" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-[#8b5cf6]/15 blur-3xl landing-float-delayed" />
        </div>

        {/* Elaborate SVG illustration overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.08]">
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice">
            {/* Grid pattern — tech feel */}
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="1440" height="800" fill="url(#grid)" />

            {/* Cityscape / career growth — more detailed */}
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

            {/* Right side buildings */}
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

            {/* Rising trend line — career growth */}
            <path d="M0 650 Q 150 640, 300 580 T 650 450 T 1000 320 T 1440 180" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="12 6" />
            {/* Trend nodes with glow */}
            <circle cx="300" cy="580" r="6" fill="currentColor" opacity="0.6" />
            <circle cx="300" cy="580" r="12" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="650" cy="450" r="8" fill="currentColor" opacity="0.7" />
            <circle cx="650" cy="450" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="1000" cy="320" r="8" fill="currentColor" opacity="0.7" />
            <circle cx="1000" cy="320" r="16" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />
            <circle cx="1350" cy="200" r="10" fill="currentColor" opacity="0.8" />
            <circle cx="1350" cy="200" r="20" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" />

            {/* Floating CV / Document — top left */}
            <g transform="translate(200, 100) rotate(-8)">
              <rect width="70" height="90" rx="8" fill="currentColor" opacity="0.5" />
              <circle cx="35" cy="22" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <line x1="15" y1="42" x2="55" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="52" x2="55" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="62" x2="45" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="72" x2="50" y2="72" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            </g>

            {/* Floating CV — top right */}
            <g transform="translate(1100, 80) rotate(5)">
              <rect width="70" height="90" rx="8" fill="currentColor" opacity="0.5" />
              <circle cx="35" cy="22" r="10" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />
              <line x1="15" y1="42" x2="55" y2="42" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="52" x2="55" y2="52" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="62" x2="45" y2="62" stroke="currentColor" strokeWidth="2" opacity="0.3" />
              <line x1="15" y1="72" x2="50" y2="72" stroke="currentColor" strokeWidth="2" opacity="0.3" />
            </g>

            {/* Graduation cap — center top */}
            <g transform="translate(700, 60)">
              <polygon points="0,30 40,10 80,30 40,50" fill="currentColor" opacity="0.6" />
              <rect x="37" y="50" width="6" height="20" fill="currentColor" opacity="0.6" />
              <line x1="80" y1="30" x2="80" y2="55" stroke="currentColor" strokeWidth="2" opacity="0.5" />
              <circle cx="80" cy="58" r="3" fill="currentColor" opacity="0.5" />
            </g>

            {/* AI Brain / neural network — center */}
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

            {/* Rocket — ambition */}
            <g transform="translate(1350, 120) rotate(25)">
              <path d="M15,50 L15,25 Q15,0 25,0 Q35,0 35,25 L35,50 Z" fill="currentColor" opacity="0.5" />
              <polygon points="10,45 15,35 15,50" fill="currentColor" opacity="0.4" />
              <polygon points="40,45 35,35 35,50" fill="currentColor" opacity="0.4" />
              <circle cx="25" cy="18" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
              {/* Flame */}
              <path d="M20,50 Q25,65 30,50" fill="currentColor" opacity="0.3" />
            </g>

            {/* Connection dots — scattered */}
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

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 landing-fade-in">
            <EvoluticsLogo className="w-14 h-14" />
            <span className="font-black text-3xl tracking-tighter uppercase">EVOLUTICS</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6 landing-fade-in-d1">
            Votre avenir professionnel,{' '}
            <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
              propulsé par l'IA
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-[var(--theme-text-secondary)] font-medium max-w-2xl leading-relaxed mb-10 landing-fade-in-d2">
            Explorez des centaines d'opportunités, préparez vos candidatures avec un coach IA et décrochez le poste de vos rêves — le tout sur une seule plateforme.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto landing-fade-in-d3">
            <button
              onClick={onGetStarted}
              className="flex items-center justify-center gap-3 bg-[var(--theme-bg-accent)] hover:bg-[var(--theme-bg-accent-hover)] text-[var(--theme-text-accent)] font-black py-4 px-8 rounded-2xl shadow-xl shadow-[var(--theme-bg-accent)]/25 transition-all active:scale-[0.98] text-sm uppercase tracking-widest group"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onSignIn}
              className="flex items-center justify-center gap-3 bg-transparent border-2 border-[var(--theme-border-primary)] hover:border-[var(--theme-bg-accent)] text-[var(--theme-text-primary)] hover:text-[var(--theme-bg-accent)] font-black py-4 px-8 rounded-2xl transition-all active:scale-[0.98] text-sm uppercase tracking-widest"
            >
              Se connecter
            </button>
          </div>

          {/* Scroll hint */}
          <div className="mt-16 landing-fade-in-d5 opacity-50">
            <ChevronRight className="w-5 h-5 rotate-90 animate-bounce" />
          </div>
        </div>
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

      {/* ═══════════ STATS SECTION ═══════════ */}
      <section className="relative px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-4">
            {[
              { number: '500+', label: 'Opportunités', icon: Briefcase },
              { number: '24/7', label: 'IA Coach disponible', icon: Zap },
              { number: '5', label: "Catégories d'offres", icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="text-center py-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[var(--theme-bg-accent)]/10 rounded-2xl mb-4">
                  <stat.icon className="w-6 h-6 text-[var(--theme-bg-accent)]" />
                </div>
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-widest">
                  {stat.label}
                </div>
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

          {/* Footer mention */}
          <div className="mt-16 text-[var(--theme-text-tertiary)] text-xs font-bold uppercase tracking-widest">
            HACKBYIFRI 2026
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
