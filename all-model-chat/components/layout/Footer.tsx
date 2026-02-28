import React from 'react';
import {
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Sparkles,
  Shield,
  Zap,
  Users,
  ArrowUp
} from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative bg-[var(--theme-bg-secondary)] border-t border-[var(--theme-border-primary)] ${className}`}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[var(--theme-bg-accent)]/5 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#8b5cf6]/5 blur-3xl" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern id="footer-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

            {/* Brand section */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <EvoluticsLogo className="h-12 w-auto" />
                  <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/20 blur-xl rounded-full scale-150 -z-10" />
                </div>
                <span className="font-black text-xl tracking-wider text-[var(--theme-text-primary)]">
                  EVOLUTICS
                </span>
              </div>

              <p className="text-[var(--theme-text-secondary)] font-medium leading-relaxed mb-8 max-w-sm">
                Propulsez votre carrière avec l'intelligence artificielle.
                Découvrez des opportunités, préparez vos candidatures et
                atteignez vos objectifs professionnels.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {[
                  { icon: Github, href: '#', label: 'GitHub' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="group relative w-11 h-11 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-xl flex items-center justify-center hover:border-[var(--theme-bg-accent)]/40 hover:bg-[var(--theme-bg-accent)]/5 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[var(--theme-bg-accent)] transition-colors duration-300" />
                    <div className="absolute inset-0 bg-[var(--theme-bg-accent)]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation sections */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

                {/* Plateforme */}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                    Plateforme
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Opportunités',
                      'Assistant IA',
                      'Suivi carrière',
                      'Tableau de bord',
                      'Notifications'
                    ].map((item, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-medium text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ressources */}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                    Ressources
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Guide carrière',
                      'Templates CV',
                      'Conseils entretien',
                      'Blog',
                      'Webinaires'
                    ].map((item, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-medium text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                    Support
                  </h3>
                  <ul className="space-y-3">
                    {[
                      'Centre d\'aide',
                      'FAQ',
                      'Contact',
                      'Signaler un bug',
                      'Statut système'
                    ].map((item, i) => (
                      <li key={i}>
                        <a
                          href="#"
                          className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-medium text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest text-[var(--theme-text-primary)] mb-6 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                    Contact
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-[var(--theme-bg-accent)] mt-0.5 flex-shrink-0" />
                      <a
                        href="mailto:hello@evolutics.com"
                        className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-medium text-sm transition-colors duration-200"
                      >
                        hello@evolutics.com
                      </a>
                    </li>
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[var(--theme-bg-accent)] mt-0.5 flex-shrink-0" />
                      <span className="text-[var(--theme-text-secondary)] font-medium text-sm">
                        Cotonou, Bénin
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-[var(--theme-bg-accent)] mt-0.5 flex-shrink-0" />
                      <a
                        href="tel:+22912345678"
                        className="text-[var(--theme-text-secondary)] hover:text-[var(--theme-bg-accent)] font-medium text-sm transition-colors duration-200"
                      >
                        +229 12 34 56 78
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements animation */}
      <style>{`
        @keyframes footer-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .footer-float {
          animation: footer-float 6s ease-in-out infinite;
        }

        .footer-float-delayed {
          animation: footer-float 6s ease-in-out infinite;
          animation-delay: -2s;
        }
      `}</style>
    </footer>
  );
};

export default Footer;