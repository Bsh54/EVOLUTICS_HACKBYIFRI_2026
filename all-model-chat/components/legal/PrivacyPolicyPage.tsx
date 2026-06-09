import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle, Mail } from 'lucide-react';
import { EvoluticsLogo } from '../icons/EvoluticsLogo';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="h-screen w-full flex flex-col bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)] overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 bg-[var(--theme-bg-secondary)] border-b-2 border-[var(--theme-border-primary)] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <EvoluticsLogo className="h-8" />
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--theme-bg-tertiary)] rounded-xl border border-[var(--theme-border-primary)]">
              <Shield className="w-4 h-4 text-[var(--theme-bg-accent)]" />
              <span className="text-xs font-bold text-[var(--theme-text-tertiary)] uppercase tracking-wider">Mars 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-12 pb-32">
        
          {/* Hero */}
          <div className="text-center space-y-6 pb-10 border-b-2 border-[var(--theme-border-primary)]">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[var(--theme-bg-accent)] to-[var(--theme-bg-accent-hover)] shadow-xl shadow-[var(--theme-bg-accent)]/25">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-[var(--theme-text-secondary)] font-medium max-w-3xl mx-auto leading-relaxed">
              Chez EVOLUTICS, la protection de vos données personnelles est notre priorité absolue. 
              Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#2563eb] flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">1. Informations que nous collectons</h2>
            </div>
            <div className="space-y-5">
              <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 hover:border-[var(--theme-bg-accent)]/40 transition-all duration-300">
                <h3 className="font-black text-xl mb-4 tracking-tight">1.1 Informations fournies directement</h3>
                <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)]">
                  {[
                    { label: 'Informations de compte', desc: 'Nom complet, adresse email, mot de passe (crypté)' },
                    { label: 'Informations de profil', desc: 'Université, domaine d\'études, niveau d\'études, année de diplôme, compétences, expérience professionnelle, poste actuel' },
                    { label: 'Documents', desc: 'CV, lettres de motivation générés via notre plateforme' },
                    { label: 'Préférences', desc: 'Types d\'opportunités recherchées, localisations préférées' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--theme-bg-accent)]/10 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[var(--theme-bg-accent)]" />
                      </div>
                      <span className="font-medium"><strong className="text-[var(--theme-text-primary)]">{item.label} :</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 hover:border-[var(--theme-bg-accent)]/40 transition-all duration-300">
                <h3 className="font-black text-xl mb-4 tracking-tight">1.2 Informations collectées automatiquement</h3>
                <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)]">
                  {[
                    { label: 'Données d\'utilisation', desc: 'Pages visitées, fonctionnalités utilisées, temps passé sur la plateforme' },
                    { label: 'Données techniques', desc: 'Adresse IP, type de navigateur, système d\'exploitation, identifiant d\'appareil' },
                    { label: 'Interactions avec l\'IA', desc: 'Conversations avec le coach carrière, requêtes de génération de documents' }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--theme-bg-accent)]/10 flex items-center justify-center mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-[var(--theme-bg-accent)]" />
                      </div>
                      <span className="font-medium"><strong className="text-[var(--theme-text-primary)]">{item.label} :</strong> {item.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center shadow-lg">
                <Eye className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">2. Comment nous utilisons vos données</h2>
            </div>
            <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8">
              <ul className="space-y-5 text-sm text-[var(--theme-text-secondary)]">
                {[
                  { title: 'Personnalisation de l\'expérience', desc: 'Recommandations d\'opportunités adaptées à votre profil, suggestions de carrière personnalisées' },
                  { title: 'Génération de contenu IA', desc: 'Création de CV et lettres de motivation personnalisés, coaching carrière adapté à votre situation' },
                  { title: 'Amélioration du service', desc: 'Analyse des usages pour optimiser les fonctionnalités, correction de bugs, développement de nouvelles features' },
                  { title: 'Communication', desc: 'Notifications sur les nouvelles opportunités, mises à jour importantes, support technique' },
                  { title: 'Sécurité', desc: 'Prévention de la fraude, détection d\'activités suspectes, protection de votre compte' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[var(--theme-bg-accent)]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-sm font-black text-[var(--theme-bg-accent)]">{i + 1}</span>
                    </div>
                    <div>
                      <strong className="text-[var(--theme-text-primary)] font-bold block mb-1">{item.title} :</strong>
                      <p className="font-medium">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center shadow-lg">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">3. Protection de vos données</h2>
            </div>
            <div className="bg-gradient-to-br from-[var(--theme-bg-secondary)] to-[var(--theme-bg-tertiary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles robustes :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Cryptage SSL/TLS pour toutes les communications',
                  'Mots de passe hashés avec bcrypt',
                  'Hébergement sécurisé sur Supabase',
                  'Sauvegardes régulières et automatiques',
                  'Accès restreint aux données personnelles',
                  'Surveillance continue des menaces'
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-6 h-6 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[#10b981] font-bold text-xs">✓</span>
                    </div>
                    <span className="text-[var(--theme-text-primary)] font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#d97706] flex items-center justify-center shadow-lg">
                <Database className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">4. Partage de vos données</h2>
            </div>
            <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
              <div className="flex items-start gap-4 p-5 bg-[#f59e0b]/10 border-2 border-[#f59e0b]/30 rounded-2xl">
                <AlertCircle className="w-6 h-6 text-[#f59e0b] shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                  <strong className="text-[#f59e0b] font-black">Principe fondamental :</strong> Nous ne vendons JAMAIS vos données personnelles à des tiers.
                </p>
              </div>
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Vos données peuvent être partagées uniquement dans les cas suivants :
              </p>
              <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)]">
                {[
                  { label: 'Avec votre consentement explicite', desc: 'Lorsque vous postulez à une opportunité, nous partageons votre CV avec l\'organisation concernée' },
                  { label: 'Prestataires de services', desc: 'Google (authentification OAuth), Gemini AI (génération de contenu), Supabase (hébergement base de données)' },
                  { label: 'Obligations légales', desc: 'Si requis par la loi ou pour protéger nos droits légaux' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    </div>
                    <span className="font-medium"><strong className="text-[var(--theme-text-primary)]">{item.label} :</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ec4899] to-[#db2777] flex items-center justify-center shadow-lg">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">5. Vos droits</h2>
            </div>
            <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-6">
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Conformément au RGPD et aux lois sur la protection des données, vous disposez des droits suivants :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { title: 'Droit d\'accès', desc: 'Consulter toutes les données que nous détenons sur vous' },
                  { title: 'Droit de rectification', desc: 'Corriger ou mettre à jour vos informations personnelles' },
                  { title: 'Droit à l\'effacement', desc: 'Demander la suppression de vos données personnelles' },
                  { title: 'Droit à la portabilité', desc: 'Recevoir vos données dans un format structuré' },
                  { title: 'Droit d\'opposition', desc: 'Vous opposer au traitement de vos données' },
                  { title: 'Droit de limitation', desc: 'Limiter le traitement de vos données' }
                ].map((item, i) => (
                  <div key={i} className="space-y-2 p-4 bg-[var(--theme-bg-tertiary)] rounded-xl border border-[var(--theme-border-primary)]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#ec4899] rounded-full"></div>
                      <strong className="text-sm text-[var(--theme-text-primary)] font-bold">{item.title}</strong>
                    </div>
                    <p className="text-xs text-[var(--theme-text-secondary)] font-medium pl-4">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex items-center justify-center shadow-lg">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">6. Cookies et technologies similaires</h2>
            </div>
            <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-5">
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience :
              </p>
              <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)]">
                {[
                  { label: 'Cookies essentiels', desc: 'Nécessaires au fonctionnement de la plateforme (authentification, préférences)' },
                  { label: 'Cookies analytiques', desc: 'Pour comprendre comment vous utilisez notre service' },
                  { label: 'Cookies de préférence', desc: 'Pour mémoriser vos choix (thème, langue)' }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-[#ef4444]/10 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#ef4444]" />
                    </div>
                    <span className="font-medium"><strong className="text-[var(--theme-text-primary)]">{item.label} :</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--theme-text-tertiary)] italic font-medium pt-3 border-t border-[var(--theme-border-primary)]">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#4f46e5] flex items-center justify-center shadow-lg">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">7. Nous contacter</h2>
            </div>
            <div className="bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 border-2 border-[#6366f1]/30 rounded-[2rem] p-8 space-y-6">
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="space-y-4">
                <a href="mailto:privacy@evolutics.com" className="flex items-center gap-3 p-4 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl hover:border-[#6366f1]/40 transition-all group">
                  <Mail className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-sm font-bold text-[#6366f1] group-hover:underline">privacy@evolutics.com</span>
                </a>
                <a href="mailto:support@evolutics.com" className="flex items-center gap-3 p-4 bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl hover:border-[#6366f1]/40 transition-all group">
                  <Mail className="w-5 h-5 text-[#6366f1]" />
                  <span className="text-sm font-bold text-[#6366f1] group-hover:underline">support@evolutics.com</span>
                </a>
              </div>
              <p className="text-xs text-[var(--theme-text-tertiary)] font-medium pt-4 border-t border-[#6366f1]/20">
                Nous nous engageons à répondre à toutes les demandes dans un délai de 30 jours maximum.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#64748b] to-[#475569] flex items-center justify-center shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight">8. Modifications de cette politique</h2>
            </div>
            <div className="bg-[var(--theme-bg-secondary)] border-2 border-[var(--theme-border-primary)] rounded-[2rem] p-8 space-y-4">
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. 
                Nous vous informerons de tout changement significatif par email ou via une notification sur la plateforme.
              </p>
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium">
                La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-10 border-t-2 border-[var(--theme-border-primary)]">
            <div className="bg-gradient-to-br from-[var(--theme-bg-accent)]/10 to-[var(--theme-bg-accent-hover)]/10 border-2 border-[var(--theme-bg-accent)]/30 rounded-[2rem] p-10 text-center space-y-5">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--theme-bg-accent)] to-[var(--theme-bg-accent-hover)] shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <p className="text-xl font-black text-[var(--theme-text-primary)] tracking-tight">
                Votre confiance est notre priorité
              </p>
              <p className="text-sm text-[var(--theme-text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
                Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. 
                Cette politique de confidentialité est conforme au RGPD et aux meilleures pratiques internationales.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
