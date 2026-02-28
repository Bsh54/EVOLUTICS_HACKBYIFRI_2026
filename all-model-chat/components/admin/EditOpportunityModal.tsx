import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Upload,
  Link as LinkIcon,
  Type,
  FileText,
  Calendar,
  Bot,
  Sparkles,
  Trash2,
  CheckCircle,
  RefreshCw,
  MessageSquare
} from 'lucide-react';
import { PendingOpportunity } from '../../types/pendingOpportunity';
import { pendingOpportunityService } from '../../services/pendingOpportunityService';
import { geminiServiceInstance } from '../../services/geminiService';

interface EditOpportunityModalProps {
  opportunity: PendingOpportunity;
  onClose: () => void;
  onSave: (updatedOpp: PendingOpportunity) => void;
  onDelete?: (oppId: string) => void;
  onApprove?: (opp: PendingOpportunity) => void;
}

export const EditOpportunityModal: React.FC<EditOpportunityModalProps> = ({
  opportunity,
  onClose,
  onSave,
  onDelete,
  onApprove
}) => {
  const [formData, setFormData] = useState({
    type: opportunity.type || 'Stage',
    title: opportunity.title || '',
    organization: opportunity.organization || '',
    description: opportunity.description || '',
    fullContent: opportunity.fullContent || '',
    deadline: opportunity.deadline || '',
    location: opportunity.location || '',
    image: opportunity.image || '',
    link: opportunity.link || '',
    contactEmail: opportunity.contactEmail || '',
    applyMethod: opportunity.applyMethod || 'link',
    status: 'Ouvert',
    reward: opportunity.reward || '',
    tags: opportunity.tags || [],
    salary: opportunity.salary || '',
    contractType: opportunity.contractType || '',
    duration: opportunity.duration || '3 MOIS',
    durationValue: opportunity.duration ? opportunity.duration.split(' ')[0] : '3',
    durationUnit: opportunity.duration ? (opportunity.duration.includes('SEMAINES') ? 'Semaines' : 'Mois') : 'Mois',
    level: opportunity.level || '',
    prizes: opportunity.prizes || '',
    speakers: opportunity.speakers || '',
    schedule: opportunity.schedule || '09:00 - 18:00',
    startTime: opportunity.schedule ? opportunity.schedule.split(' - ')[0] : '09:00',
    endTime: opportunity.schedule ? opportunity.schedule.split(' - ')[1] : '18:00',
    aiGreeting: opportunity.aiGreeting || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Générer le message d'accueil IA
  const handleGenerateAiGreeting = async () => {
    if (!formData.title || !formData.organization) {
      alert("Veuillez d'abord remplir le Titre et l'Organisation pour donner du contexte à l'IA.");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const prompt = `Tu es un Coach Carrière Expert pour la plateforme étudiante EVOLUTICS.

      TÂCHE : Rédige un message d'accueil court, chaleureux et professionnel pour l'Assistant IA qui va aider un étudiant sur cette opportunité précise.

      DÉTAILS DE L'OPPORTUNITÉ :
      - Type : ${formData.type}
      - Titre : ${formData.title}
      - Organisation : ${formData.organization}
      - Description : ${formData.description || "Non spécifiée"}

      CONTENU DU MESSAGE D'ACCUEIL :
      1. Salue l'étudiant (ex: "Bonjour ! 👋").
      2. Montre que tu connais déjà l'offre (cite le poste/titre).
      3. Propose 3 pistes d'aide concrètes adaptées à ce type d'offre (ex: pour un stage -> CV/Lettre; pour un concours -> Idées/Pitch).
      4. Sois encourageant.

      Format : Markdown, avec emojis, concis (max 100 mots).`;

      const parts = [{ text: prompt }];

      // Utilisation d'une clé dummy car l'API proxy gère l'auth
      await geminiServiceInstance.sendMessageNonStream(
        "dummy-key",
        "gemini-2.5-flash",
        [], // Historique vide
        parts,
        { temperature: 0.7 },
        new AbortController().signal,
        (error) => {
          console.error("Erreur génération IA:", error);
          alert("Erreur lors de la génération. Vérifiez votre connexion.");
          setIsGeneratingAi(false);
        },
        (responseParts) => {
          if (responseParts && responseParts.length > 0 && responseParts[0].text) {
             setFormData(prev => ({ ...prev, aiGreeting: responseParts[0].text }));
          }
          setIsGeneratingAi(false);
        }
      );
    } catch (e) {
      console.error(e);
      setIsGeneratingAi(false);
    }
  };

  // Sauvegarde
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Exclure le champ status du formData car il contient 'Ouvert'
      // qui n'est pas valide pour pending_opportunities (doit être pending/approved/rejected/processing)
      const { status, durationValue, durationUnit, startTime, endTime, ...validFormData } = formData;

      const updatedOpp = {
        ...opportunity,
        ...validFormData,
        // Reconstruire les champs composés
        duration: `${formData.durationValue} ${formData.durationUnit.toUpperCase()}`,
        // Ne pas reconstruire schedule - utiliser startTime directement ou null
        schedule: formData.startTime || null,
        updatedAt: new Date().toISOString()
      };

      await pendingOpportunityService.update(opportunity.id, updatedOpp);
      onSave(updatedOpp);
      onClose();
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer l'opportunité
  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) return;

    setIsLoading(true);
    try {
      await pendingOpportunityService.delete(opportunity.id);
      onDelete?.(opportunity.id);
      onClose();
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  // Approuver l'opportunité
  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // Préparer les données mises à jour
      const { status, durationValue, durationUnit, startTime, endTime, ...validFormData } = formData;

      const updatedOpp = {
        ...opportunity,
        ...validFormData,
        // Reconstruire les champs composés
        duration: `${formData.durationValue} ${formData.durationUnit.toUpperCase()}`,
        // Ne pas reconstruire schedule - utiliser startTime directement ou null
        schedule: formData.startTime || null,
        updatedAt: new Date().toISOString()
      };

      // Sauvegarder les modifications dans pending_opportunities
      await pendingOpportunityService.update(opportunity.id, updatedOpp);

      // Puis approuver l'opportunité (qui utilisera les données mises à jour)
      await pendingOpportunityService.approve(opportunity.id);

      onApprove?.(updatedOpp);
      onClose();
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation: ' + (error?.message || 'Erreur inconnue'));
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-gray-600 mb-2 block";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50 backdrop-blur-md sticky top-0 z-[100]">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter">Modifier l'opportunité</h2>
            <p className="text-gray-600 text-sm">Ajustez les informations selon le type</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type d'opportunité */}
            <div className="space-y-4">
              <label className={labelClass}>Quelle opportunité publiez-vous ?</label>
              <select
                className={inputClass}
                value={formData.type}
                onChange={(e: any) => setFormData({...formData, type: e.target.value})}
              >
                {['Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences'].map(t =>
                  <option key={t} value={t}>{t}</option>
                )}
              </select>
            </div>

            {/* Image de couverture */}
            <div className="space-y-4">
              <label className={labelClass}>Image de couverture (URL)</label>
              <input
                type="url"
                className={inputClass}
                placeholder="https://..."
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
              />
            </div>

            {/* Titre */}
            <div className="space-y-4">
              <label className={labelClass}>Titre de l'opportunité</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Titre de l'annonce"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            {/* Organisation */}
            <div className="space-y-4">
              <label className={labelClass}>Organisation</label>
              <input
                type="text"
                className={inputClass}
                placeholder="Nom de l'entreprise"
                value={formData.organization}
                onChange={e => setFormData({...formData, organization: e.target.value})}
              />
            </div>

            {/* Comment postuler */}
            <div className="space-y-4">
              <label className={labelClass}>Comment postuler ?</label>
              <div className="flex bg-gray-100 rounded-xl p-1 border border-gray-200">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, applyMethod: 'link'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-black uppercase transition-all ${formData.applyMethod === 'link' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <LinkIcon className="w-3.5 h-3.5" /> LIEN WEB
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, applyMethod: 'email'})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-black uppercase transition-all ${formData.applyMethod === 'email' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Type className="w-3.5 h-3.5" /> ADRESSE EMAIL
                </button>
              </div>
            </div>

            {/* Lien ou Email selon le choix */}
            <div className="space-y-4">
              {formData.applyMethod === 'link' ? (
                <div>
                  <label className={labelClass}>Lien de l'offre (URL)</label>
                  <input type="url" className={inputClass} placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                </div>
              ) : (
                <div>
                  <label className={labelClass}>Email de contact</label>
                  <input type="email" className={inputClass} placeholder="recrutement@entreprise.com" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                </div>
              )}
            </div>

            {/* Date limite */}
            <div className="space-y-4">
              <label className={labelClass}>Date Limite</label>
              <input type="date" className={inputClass} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
            </div>

            {/* Lieu */}
            <div className="space-y-4">
              <label className={labelClass}>Lieu</label>
              <input type="text" className={inputClass} placeholder="Ex: Paris / Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
            </div>

            {/* Statut */}
            <div className="space-y-4">
              <label className={labelClass}>Statut</label>
              <select className={inputClass} value={formData.status} onChange={(e: any) => setFormData({...formData, status: e.target.value})}>
                {['Ouvert', 'Bientôt fini', 'Fermé'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Champs dynamiques selon le type */}
            {formData.type === 'Emploi' && (
              <>
                <div className="space-y-4 animate-in slide-in-from-left duration-300">
                  <label className={labelClass}>Salaire Proposé (Optionnel)</label>
                  <input type="text" className={inputClass} placeholder="Ex: Non spécifié / À débattre" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
                </div>
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <label className={labelClass}>Type de Contrat</label>
                  <select className={inputClass} value={formData.contractType} onChange={e => setFormData({...formData, contractType: e.target.value})}>
                    <option value="">Sélectionner...</option>
                    {['CDI', 'CDD', 'Stage Pro', 'Freelance', 'Prestation'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}

            {formData.type === 'Stage' && (
              <>
                <div className="space-y-4 animate-in slide-in-from-left duration-300">
                  <label className={labelClass}>Durée du Stage</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className={`${inputClass} w-24`}
                      value={formData.durationValue}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData({...formData, durationValue: val, duration: `${val} ${formData.durationUnit}`.toUpperCase()});
                      }}
                    />
                    <select
                      className={inputClass}
                      value={formData.durationUnit}
                      onChange={e => {
                        const unit = e.target.value;
                        setFormData({...formData, durationUnit: unit, duration: `${formData.durationValue} ${unit}`.toUpperCase()});
                      }}
                    >
                      {['Semaines', 'Mois'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <label className={labelClass}>Niveau Requis</label>
                  <input type="text" className={inputClass} placeholder="Ex: Licence 3 / Master 1" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
                </div>
              </>
            )}

            {formData.type === 'Bourse' && (
              <div className="md:col-span-2 space-y-4 animate-in fade-in duration-300">
                <label className={labelClass}>Montant de la Bourse / Récompense</label>
                <input type="text" className={inputClass} placeholder="Ex: 500.000 FCFA / an" value={formData.reward} onChange={e => setFormData({...formData, reward: e.target.value})} />
              </div>
            )}

            {formData.type === 'Concours' && (
              <div className="md:col-span-2 space-y-4 animate-in fade-in duration-300">
                <label className={labelClass}>Récompenses / Prix à gagner</label>
                <input type="text" className={inputClass} placeholder="Ex: 1er Prix : 100.000 FCFA + Mentorat" value={formData.prizes} onChange={e => setFormData({...formData, prizes: e.target.value})} />
              </div>
            )}

            {formData.type === 'Conférences' && (
              <>
                <div className="space-y-4 animate-in slide-in-from-left duration-300">
                  <label className={labelClass}>Heure / Planning</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      className={inputClass}
                      value={formData.startTime}
                      onChange={e => {
                        const start = e.target.value;
                        setFormData({...formData, startTime: start, schedule: `${start} - ${formData.endTime}`});
                      }}
                    />
                    <span className="text-gray-600 font-bold">À</span>
                    <input
                      type="time"
                      className={inputClass}
                      value={formData.endTime}
                      onChange={e => {
                        const end = e.target.value;
                        setFormData({...formData, endTime: end, schedule: `${formData.startTime} - ${end}`});
                      }}
                    />
                  </div>
                </div>
                <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  <label className={labelClass}>Intervenants</label>
                  <input type="text" className={inputClass} placeholder="Ex: Experts Google, DG Isocel..." value={formData.speakers} onChange={e => setFormData({...formData, speakers: e.target.value})} />
                </div>
              </>
            )}

            {formData.type === 'Bourse' && (
              <div className="md:col-span-2 space-y-4 animate-in fade-in duration-300">
                <label className={labelClass}>Conditions d'éligibilité (Court)</label>
                <input type="text" className={inputClass} placeholder="Ex: Moyenne > 14, Résider au Bénin..." value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} />
              </div>
            )}

            {/* Contenu Markdown */}
            <div className="md:col-span-2 space-y-4">
              <label className={labelClass}>Contenu Markdown</label>
              <textarea className={`${inputClass} min-h-[300px] font-mono text-sm`} placeholder="Détails de l'opportunité..." value={formData.fullContent} onChange={e => setFormData({...formData, fullContent: e.target.value})} />
            </div>

            {/* Section IA Générative */}
            <div className="md:col-span-2 bg-gray-50/30 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    Assistant IA - Message d'Accueil
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">Générez un message d'accueil personnalisé pour le chat.</p>
                </div>
                <button
                  type="button"
                  onClick={handleGenerateAiGreeting}
                  disabled={isGeneratingAi}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isGeneratingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:scale-105 shadow-lg'}`}
                >
                  {isGeneratingAi ? (
                    <><RefreshCw className="w-3 h-3 animate-spin" /> Génération...</>
                  ) : (
                    <><Sparkles className="w-3 h-3" /> Générer avec l'IA</>
                  )}
                </button>
              </div>

              <div className="relative">
                <textarea
                  className={`${inputClass} min-h-[150px] text-xs leading-relaxed`}
                  placeholder="Le message d'accueil généré par l'IA apparaîtra ici..."
                  value={formData.aiGreeting}
                  onChange={e => setFormData({...formData, aiGreeting: e.target.value})}
                />
                {!formData.aiGreeting && !isGeneratingAi && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <MessageSquare className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-gray-200 bg-gray-50">
          {/* Bouton Supprimer à gauche */}
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
          >
            <Trash2 className="w-4 h-4" />
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </button>

          {/* Boutons centraux */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
            </button>
          </div>

          {/* Bouton Approuver à droite */}
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? 'Approbation...' : 'Approuver'}
          </button>
        </div>
      </div>
    </div>
  );
};