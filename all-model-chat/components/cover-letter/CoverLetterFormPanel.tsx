import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { CoverLetterTone } from '../../types/coverLetter';

interface LetterFormData {
  recipientName: string;
  recipientTitle: string;
  companyName: string;
  companyAddress: string;
  jobTitle: string;
  jobDescription: string;
  companyInfo: string;
  tone: CoverLetterTone;
  additionalInfo: string;
}

interface CoverLetterFormPanelProps {
  formData: LetterFormData;
  onChange: (data: LetterFormData) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  hasContent: boolean;
}

const CoverLetterFormPanel: React.FC<CoverLetterFormPanelProps> = ({
  formData,
  onChange,
  onGenerate,
  isGenerating,
  hasContent
}) => {
  const inputClass = "w-full px-3 py-2 bg-[var(--theme-bg-primary)] border border-[var(--theme-border-primary)] rounded-lg text-[var(--theme-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/30 transition-all";
  const labelClass = "block text-xs font-bold uppercase tracking-wider text-[var(--theme-text-secondary)] mb-2";

  const tones: { value: CoverLetterTone; label: string; emoji: string }[] = [
    { value: 'formal', label: 'Formel', emoji: '🎩' },
    { value: 'dynamic', label: 'Dynamique', emoji: '⚡' },
    { value: 'creative', label: 'Créatif', emoji: '🎨' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-3 mb-4">
        <h2 className="text-lg font-black text-[var(--theme-text-primary)] uppercase leading-none mb-1">
          Informations de la Lettre
        </h2>
        <p className="text-xs text-[var(--theme-text-secondary)]">
          Remplissez les champs pour générer votre lettre
        </p>
      </div>

      {/* Informations du poste */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
          <span>🎯</span> Poste Visé
        </h3>

        <div>
          <label className={labelClass}>Titre du Poste *</label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => onChange({ ...formData, jobTitle: e.target.value })}
            placeholder="Ex: Développeur Full Stack"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Entreprise *</label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => onChange({ ...formData, companyName: e.target.value })}
            placeholder="Ex: Google, Microsoft..."
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description de l'Offre</label>
          <textarea
            value={formData.jobDescription}
            onChange={(e) => onChange({ ...formData, jobDescription: e.target.value })}
            placeholder="Décrivez l'offre d'emploi : missions, responsabilités, compétences requises..."
            className={`${inputClass} min-h-[80px] resize-none`}
            rows={3}
          />
          <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
            💡 Copiez-collez la description de l'offre pour une lettre plus ciblée
          </p>
        </div>

        <div>
          <label className={labelClass}>Informations sur l'Entreprise</label>
          <textarea
            value={formData.companyInfo}
            onChange={(e) => onChange({ ...formData, companyInfo: e.target.value })}
            placeholder="Secteur d'activité, valeurs, projets récents, culture d'entreprise..."
            className={`${inputClass} min-h-[80px] resize-none`}
            rows={3}
          />
          <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
            💡 Ces infos permettront de personnaliser votre motivation
          </p>
        </div>
      </div>

      {/* Destinataire (optionnel) */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
          <span>👤</span> Destinataire (Optionnel)
        </h3>

        <div>
          <label className={labelClass}>Nom du Recruteur</label>
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => onChange({ ...formData, recipientName: e.target.value })}
            placeholder="Ex: M. Dupont"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Titre du Recruteur</label>
          <input
            type="text"
            value={formData.recipientTitle}
            onChange={(e) => onChange({ ...formData, recipientTitle: e.target.value })}
            placeholder="Ex: Responsable RH"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Adresse de l'Entreprise</label>
          <input
            type="text"
            value={formData.companyAddress}
            onChange={(e) => onChange({ ...formData, companyAddress: e.target.value })}
            placeholder="Ex: 123 Rue de Paris, 75001 Paris"
            className={inputClass}
          />
        </div>
      </div>

      {/* Ton de la lettre */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
          <span>🎭</span> Ton de la Lettre
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {tones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => onChange({ ...formData, tone: tone.value })}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                formData.tone === tone.value
                  ? 'border-[var(--theme-bg-accent)] bg-[var(--theme-bg-accent)]/10'
                  : 'border-[var(--theme-border-primary)] hover:border-[var(--theme-bg-accent)]/40'
              }`}
            >
              <div className="text-2xl mb-1">{tone.emoji}</div>
              <div className="text-xs font-bold">{tone.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Informations supplémentaires */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[var(--theme-text-primary)] flex items-center gap-2">
          <span>📝</span> Détails Supplémentaires
        </h3>

        <div>
          <label className={labelClass}>Informations Complémentaires</label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => onChange({ ...formData, additionalInfo: e.target.value })}
            placeholder="Ajoutez des détails sur vos motivations, projets pertinents, ou toute information que vous souhaitez mentionner..."
            className={`${inputClass} min-h-[100px] resize-none`}
            rows={4}
          />
          <p className="text-xs text-[var(--theme-text-tertiary)] mt-1">
            💡 Plus vous donnez de détails, plus la lettre sera personnalisée
          </p>
        </div>
      </div>

      {/* Bouton de génération */}
      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !formData.jobTitle || !formData.companyName}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              {hasContent ? 'Régénérer la Lettre' : 'Générer ma Lettre'}
            </>
          )}
        </button>
      </div>

      {hasContent && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 text-center">
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            ✅ Lettre générée ! Vous pouvez la modifier à droite
          </p>
        </div>
      )}
    </div>
  );
};

export default CoverLetterFormPanel;
