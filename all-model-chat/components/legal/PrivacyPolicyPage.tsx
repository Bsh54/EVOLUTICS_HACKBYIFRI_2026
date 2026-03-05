import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck, FileText, AlertCircle, Mail } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onBack: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[var(--theme-bg-primary)] text-[var(--theme-text-primary)]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--theme-bg-secondary)] border-b border-[var(--theme-border-primary)] shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-bg-tertiary)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--theme-bg-accent)]" />
            <span className="text-sm font-bold text-[var(--theme-text-tertiary)]">Dernière mise à jour : Mars 2026</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8 pb-32">
        
        {/* Hero */}
        <div className="text-center space-y-4 pb-8 border-b border-[var(--theme-border-primary)]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">
            Politique de Confidentialité
          </h1>
          <p className="text-lg text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
            Chez EVOLUTICS, la protection de vos données personnelles est notre priorité absolue. 
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold">1. Informations que nous collectons</h2>
          </div>
          <div className="pl-13 space-y-4">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-[var(--theme-text-primary)]">1.1 Informations fournies directement</h3>
              <ul className="space-y-2 text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Informations de compte :</strong> Nom complet, adresse email, mot de passe (crypté)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Informations de profil :</strong> Université, domaine d'études, niveau d'études, année de diplôme, compétences, expérience professionnelle, poste actuel</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Documents :</strong> CV, lettres de motivation générés via notre plateforme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Préférences :</strong> Types d'opportunités recherchées, localisations préférées</span>
                </li>
              </ul>
            </div>

            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5 space-y-3">
              <h3 className="font-bold text-[var(--theme-text-primary)]">1.2 Informations collectées automatiquement</h3>
              <ul className="space-y-2 text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Données d'utilisation :</strong> Pages visitées, fonctionnalités utilisées, temps passé sur la plateforme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Données techniques :</strong> Adresse IP, type de navigateur, système d'exploitation, identifiant d'appareil</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span><strong>Interactions avec l'IA :</strong> Conversations avec le coach carrière, requêtes de génération de documents</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <h2 className="text-2xl font-bold">2. Comment nous utilisons vos données</h2>
          </div>
          <div className="pl-13 space-y-3">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5">
              <ul className="space-y-3 text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">1</span>
                  </div>
                  <div>
                    <strong className="text-[var(--theme-text-primary)]">Personnalisation de l'expérience :</strong>
                    <p className="mt-1">Recommandations d'opportunités adaptées à votre profil, suggestions de carrière personnalisées</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">2</span>
                  </div>
                  <div>
                    <strong className="text-[var(--theme-text-primary)]">Génération de contenu IA :</strong>
                    <p className="mt-1">Création de CV et lettres de motivation personnalisés, coaching carrière adapté à votre situation</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">3</span>
                  </div>
                  <div>
                    <strong className="text-[var(--theme-text-primary)]">Amélioration du service :</strong>
                    <p className="mt-1">Analyse des usages pour optimiser les fonctionnalités, correction de bugs, développement de nouvelles features</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">4</span>
                  </div>
                  <div>
                    <strong className="text-[var(--theme-text-primary)]">Communication :</strong>
                    <p className="mt-1">Notifications sur les nouvelles opportunités, mises à jour importantes, support technique</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-purple-500">5</span>
                  </div>
                  <div>
                    <strong className="text-[var(--theme-text-primary)]">Sécurité :</strong>
                    <p className="mt-1">Prévention de la fraude, détection d'activités suspectes, protection de votre compte</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">3. Protection de vos données</h2>
          </div>
          <div className="pl-13 space-y-3">
            <div className="bg-gradient-to-br from-green-500/5 to-blue-500/5 border border-green-500/20 rounded-xl p-5 space-y-4">
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles robustes :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Cryptage SSL/TLS pour toutes les communications</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Mots de passe hashés avec bcrypt</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Hébergement sécurisé sur Supabase</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Sauvegardes régulières et automatiques</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Accès restreint aux données personnelles</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-green-600 dark:text-green-400">✓</span>
                  </div>
                  <span className="text-[var(--theme-text-secondary)]">Surveillance continue des menaces</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold">4. Partage de vos données</h2>
          </div>
          <div className="pl-13 space-y-3">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[var(--theme-text-secondary)]">
                  <strong className="text-orange-600 dark:text-orange-400">Principe fondamental :</strong> Nous ne vendons JAMAIS vos données personnelles à des tiers.
                </p>
              </div>
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Vos données peuvent être partagées uniquement dans les cas suivants :
              </p>
              <ul className="space-y-2 text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span><strong>Avec votre consentement explicite :</strong> Lorsque vous postulez à une opportunité, nous partageons votre CV avec l'organisation concernée</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span><strong>Prestataires de services :</strong> Google (authentification OAuth), Gemini AI (génération de contenu), Supabase (hébergement base de données)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500 mt-1">•</span>
                  <span><strong>Obligations légales :</strong> Si requis par la loi ou pour protéger nos droits légaux</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-pink-500" />
            </div>
            <h2 className="text-2xl font-bold">5. Vos droits</h2>
          </div>
          <div className="pl-13 space-y-3">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5">
              <p className="text-sm text-[var(--theme-text-secondary)] mb-4">
                Conformément au RGPD et aux lois sur la protection des données, vous disposez des droits suivants :
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit d'accès</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Consulter toutes les données que nous détenons sur vous
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit de rectification</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Corriger ou mettre à jour vos informations personnelles
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit à l'effacement</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Demander la suppression de vos données personnelles
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit à la portabilité</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Recevoir vos données dans un format structuré
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit d'opposition</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Vous opposer au traitement de vos données
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <strong className="text-sm text-[var(--theme-text-primary)]">Droit de limitation</strong>
                  </div>
                  <p className="text-xs text-[var(--theme-text-secondary)] pl-4">
                    Limiter le traitement de vos données
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold">6. Cookies et technologies similaires</h2>
          </div>
          <div className="pl-13 space-y-3">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5 space-y-3">
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Nous utilisons des cookies et technologies similaires pour améliorer votre expérience :
              </p>
              <ul className="space-y-2 text-sm text-[var(--theme-text-secondary)]">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme (authentification, préférences)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Cookies analytiques :</strong> Pour comprendre comment vous utilisez notre service</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>Cookies de préférence :</strong> Pour mémoriser vos choix (thème, langue)</span>
                </li>
              </ul>
              <p className="text-xs text-[var(--theme-text-tertiary)] italic">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold">7. Nous contacter</h2>
          </div>
          <div className="pl-13">
            <div className="bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/20 rounded-xl p-6 space-y-4">
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits :
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <a href="mailto:privacy@evolutics.com" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    privacy@evolutics.com
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-indigo-500" />
                  <a href="mailto:support@evolutics.com" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                    support@evolutics.com
                  </a>
                </div>
              </div>
              <p className="text-xs text-[var(--theme-text-tertiary)] pt-3 border-t border-indigo-500/20">
                Nous nous engageons à répondre à toutes les demandes dans un délai de 30 jours maximum.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8 */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold">8. Modifications de cette politique</h2>
          </div>
          <div className="pl-13">
            <div className="bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-xl p-5">
              <p className="text-sm text-[var(--theme-text-secondary)]">
                Nous pouvons mettre à jour cette politique de confidentialité périodiquement pour refléter les changements dans nos pratiques ou pour d'autres raisons opérationnelles, légales ou réglementaires. 
                Nous vous informerons de tout changement significatif par email ou via une notification sur la plateforme.
              </p>
              <p className="text-sm text-[var(--theme-text-secondary)] mt-3">
                La date de dernière mise à jour est indiquée en haut de cette page.
              </p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-[var(--theme-border-primary)]">
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-500/20 rounded-xl p-6 text-center space-y-3">
            <Shield className="w-8 h-8 text-blue-500 mx-auto" />
            <p className="text-sm font-semibold text-[var(--theme-text-primary)]">
              Votre confiance est notre priorité
            </p>
            <p className="text-xs text-[var(--theme-text-secondary)] max-w-2xl mx-auto">
              Nous nous engageons à protéger vos données personnelles et à respecter votre vie privée. 
              Cette politique de confidentialité est conforme au RGPD et aux meilleures pratiques internationales.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
