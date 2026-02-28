import React, { useState, useMemo, useEffect } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Type,
  FileText,
  Calendar,
  CheckCircle,
  Eye,
  Plus,
  Sparkles,
  Clock,
  Trash2,
  Edit3,
  Settings2,
  LayoutGrid,
  Search,
  Lock,
  Bot,
  RefreshCw,
  MessageSquare,
  BarChart3,
  Users
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { OPPORTUNITIES_DATA } from '../../constants/opportunities';
import { Opportunity } from '../../types/opportunity';
import { geminiServiceInstance } from '../../services/geminiService';
import { opportunityService } from '../../services/opportunityService';
import { DEFAULT_CHAT_SETTINGS } from '../../constants/appConstants';
import { PendingOpportunitiesQueue } from '../admin/PendingOpportunitiesQueue';
import { ThemeToggle } from '../ui/ThemeToggle';

interface AddOpportunityFormProps {
  onClose: () => void;
  onAdd: (allOpportunities: Opportunity[]) => void;
  themeId?: string;
  onThemeChange?: (themeId: string) => void;
}

/**
 * Composant principal de gestion des opportunités (Dashboard Admin).
 * Permet la création, modification et suppression.
 */
export const AddOpportunityForm: React.FC<AddOpportunityFormProps> = ({
  onClose,
  onAdd,
  themeId = 'midnight',
  onThemeChange
}) => {
  const [adminTab, setAdminTab] = useState<'create' | 'manage' | 'queue' | 'analytics'>('queue');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    type: 'Stage' as const,
    title: '',
    organization: '',
    description: '',
    fullContent: '',
    deadline: '',
    location: '',
    image: '',
    link: '',
    contactEmail: '',
    applyMethod: 'link' as 'link' | 'email',
    status: 'Ouvert' as const,
    reward: '',
    tags: [] as string[],
    salary: '',
    contractType: '',
    duration: '3 MOIS',
    durationValue: '3',
    durationUnit: 'Mois',
    level: '',
    prizes: '',
    speakers: '',
    schedule: '09:00 - 18:00',
    startTime: '09:00',
    endTime: '18:00',
    aiGreeting: ''
  });

  const [allOpps, setAllOpps] = useState<Opportunity[]>([]);

  const loadOpportunities = async () => {
    setIsLoading(true);
    try {
      const opps = await opportunityService.getAll();
      setAllOpps(opps);
    } catch (error) {
      console.error("Erreur chargement:", error);
      // alert("Erreur de connexion à la base de données."); // Optionnel, pour éviter le spam
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement initial depuis Supabase
  useEffect(() => {
    loadOpportunities();
  }, []);
  const filteredOpps = useMemo(() => {
    if (!searchQuery) return allOpps;
    return allOpps.filter(o =>
      (o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (o.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );
  }, [allOpps, searchQuery]);

  const [isPreview, setIsPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingId) {
        await opportunityService.update({ ...formData, id: editingId });
      } else {
        const newOpp = { ...formData, id: Date.now().toString() };
        await opportunityService.create(newOpp);
      }

      await loadOpportunities();
      window.dispatchEvent(new Event('storage'));

      if (onAdd) {
        const updatedOpps = await opportunityService.getAll();
        onAdd(updatedOpps);
      }

      setShowSuccess(true);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert("Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setShowSuccess(false);
    setEditingId(null);
    setFormData({
      type: 'Stage' as const,
      title: '',
      organization: '',
      description: '',
      fullContent: '',
      deadline: '',
      location: '',
      image: '',
      link: '',
      status: 'Ouvert' as const,
      reward: '',
      tags: [],
      salary: '',
      contractType: '',
      duration: '3 MOIS',
      durationValue: '3',
      durationUnit: 'Mois',
      level: '',
      prizes: '',
      speakers: '',
      schedule: '09:00 - 18:00',
      startTime: '09:00',
      endTime: '18:00'
    });
    setIsPreview(false);
    setAdminTab('create');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Supprimer cette opportunité définitivement ?')) {
      const updated = allOpps.filter(o => o.id !== id);
      setAllOpps(updated);
      localStorage.setItem('shads_opps_master', JSON.stringify(updated));

      // Signaler le changement immédiatement au Hub
      window.dispatchEvent(new Event('storage'));

      onAdd(updated);
    }
  };

  // Supprimer une opportunité publiée de la base de données Supabase
  const handleDeleteOpportunity = async (id: string) => {
    setIsLoading(true);
    try {
      await opportunityService.delete(id);
      // Recharger la liste des opportunités
      await loadOpportunities();
      console.log('Opportunité supprimée avec succès');
    } catch (error) {
      console.error('Erreur suppression opportunité:', error);
      alert('Erreur lors de la suppression de l\'opportunité');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (opp: Opportunity) => {
    setFormData({
      ...opp,
      type: opp.type as any,
      status: opp.status as any
    });
    setEditingId(opp.id);
    setAdminTab('create');
  };

  const inputClass = "w-full bg-[var(--theme-bg-tertiary)] border border-[var(--theme-border-primary)] rounded-xl px-4 py-3 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)] transition-all";
  const labelClass = "text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-tertiary)] mb-2 block";

  return (
    <div className={`flex flex-col h-full bg-[var(--theme-bg-primary)] animate-in fade-in duration-500 theme-${themeId}`}>
      {/* Admin Navbar */}
      <div className="flex items-center justify-between p-6 border-b border-[var(--theme-border-primary)] bg-[var(--theme-bg-secondary)]/50 backdrop-blur-md sticky top-0 z-[100]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--theme-bg-accent)] rounded-xl flex items-center justify-center text-white shadow-lg">
              <Settings2 className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tighter hidden md:block">Admin Dashboard</h2>
          </div>

          <nav className="flex bg-[var(--theme-bg-tertiary)] rounded-xl p-1 border border-[var(--theme-border-primary)]">
            <button
              onClick={() => { setAdminTab('queue'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'queue' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <Bot className="w-3.5 h-3.5" /> File IA
            </button>
            <button
              onClick={() => { setAdminTab('create'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'create' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <Plus className="w-3.5 h-3.5" /> {editingId ? 'Modifier' : 'Nouveau'}
            </button>
            <button
              onClick={() => { setAdminTab('manage'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'manage' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5" /> Gestion ({filteredOpps.length})
            </button>
            <button
              onClick={() => { setAdminTab('analytics'); setShowSuccess(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${adminTab === 'analytics' ? 'bg-[var(--theme-bg-accent)] text-white shadow-md' : 'text-[var(--theme-text-tertiary)] hover:text-[var(--theme-text-primary)]'}`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Analytics
            </button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {adminTab === 'create' && !showSuccess && (
            <button
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${isPreview ? 'bg-[var(--theme-bg-accent)] text-white' : 'hover:bg-[var(--theme-bg-secondary)] text-[var(--theme-text-secondary)] border border-transparent hover:border-[var(--theme-border-primary)]'}`}
            >
              {isPreview ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreview ? "Éditer" : "Aperçu"}
            </button>
          )}

          {/* Theme Toggle */}
          {onThemeChange && (
            <ThemeToggle
              currentThemeId={themeId}
              onThemeChange={onThemeChange}
              size="sm"
            />
          )}

          <button
            onClick={() => {
              setAdminTab('queue');
              setShowSuccess(false);
              setEditingId(null);
            }}
            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
            title="Retour à la page principale admin"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {showSuccess ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-in fade-in zoom-in duration-500">
            <div className="w-32 h-32 bg-[var(--theme-bg-accent)] rounded-full flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(var(--theme-bg-accent-rgb),0.4)] animate-bounce text-white">
              <CheckCircle className="w-16 h-16" />
            </div>
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-6 text-[var(--theme-text-primary)]">
              {editingId ? 'Mise à jour Réussie !' : 'Publication Réussie !'}
            </h3>
            <p className="text-2xl text-[var(--theme-text-secondary)] font-medium max-w-xl opacity-90 mb-12">
              Vos modifications ont été enregistrées avec succès.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleReset}
                className="group flex items-center gap-4 bg-[var(--theme-bg-accent)] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                Nouveau Contenu
              </button>
              <button
                onClick={() => setAdminTab('manage')}
                className="px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest border-2 border-[var(--theme-border-primary)] hover:bg-[var(--theme-bg-secondary)] transition-all"
              >
                Gérer la liste
              </button>
            </div>
          </div>
        ) : adminTab === 'create' ? (
          <div className="p-6 md:p-12 animate-in slide-in-from-bottom-4 duration-500">
            {!isPreview ? (
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-12">
                {/* Étape 1 : Type d'opportunité mis en exergue */}
                <div className="bg-[var(--theme-bg-secondary)] p-8 rounded-3xl border-2 border-[var(--theme-bg-accent)] shadow-lg animate-in zoom-in duration-300">
                  <label className="text-xs font-black uppercase tracking-[0.3em] text-[var(--theme-bg-accent)] mb-4 block text-center">Quelle opportunité publiez-vous ?</label>
                  <div className="flex flex-wrap justify-center gap-3">
                    {['Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData({...formData, type: t as any})}
                        className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2 ${formData.type === t ? 'bg-[var(--theme-bg-accent)] border-[var(--theme-bg-accent)] text-white shadow-xl scale-110' : 'bg-transparent border-[var(--theme-border-primary)] text-[var(--theme-text-tertiary)] hover:border-[var(--theme-bg-accent)] hover:text-[var(--theme-bg-accent)]'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2 space-y-4">
                    <label className={labelClass}>Image de couverture (URL)</label>
                    <input type="text" className={inputClass} placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
                    {formData.image && <img src={formData.image} className="h-32 w-full object-cover rounded-xl mt-2 border border-[var(--theme-border-primary)]" alt="" />}
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Titre de l'opportunité</label>
                    <input type="text" className={inputClass} placeholder="Titre de l'annonce" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Organisation</label>
                    <input type="text" className={inputClass} placeholder="Nom de l'entreprise" value={formData.organization} onChange={e => setFormData({...formData, organization: e.target.value})} />
                  </div>

                  {/* Choix de la méthode de candidature */}
                  <div className="md:col-span-2 space-y-4 bg-[var(--theme-bg-tertiary)]/50 p-6 rounded-2xl border border-[var(--theme-border-primary)]">
                    <label className={labelClass}>Comment postuler ?</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, applyMethod: 'link'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border-2 ${formData.applyMethod === 'link' ? 'bg-[var(--theme-bg-accent)] border-[var(--theme-bg-accent)] text-white shadow-lg' : 'border-[var(--theme-border-primary)] text-[var(--theme-text-tertiary)]'}`}
                      >
                        <LinkIcon className="w-4 h-4" /> LIEN WEB
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, applyMethod: 'email'})}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs transition-all border-2 ${formData.applyMethod === 'email' ? 'bg-[var(--theme-bg-accent)] border-[var(--theme-bg-accent)] text-white shadow-lg' : 'border-[var(--theme-border-primary)] text-[var(--theme-text-tertiary)]'}`}
                      >
                        <X className="w-4 h-4 rotate-45" /> ADRESSE EMAIL
                      </button>
                    </div>

                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                      {formData.applyMethod === 'link' ? (
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-[var(--theme-text-tertiary)]">Lien de l'offre (URL)</label>
                          <input type="text" className={inputClass} placeholder="https://..." value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-[var(--theme-text-tertiary)]">Email de réception des dossiers</label>
                          <input type="email" className={inputClass} placeholder="recrutement@entreprise.com" value={formData.contactEmail} onChange={e => setFormData({...formData, contactEmail: e.target.value})} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className={labelClass}>Date Limite</label>
                    <input type="date" className={inputClass} value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                  </div>
                  <div className="space-y-4">
                    <label className={labelClass}>Lieu</label>
                    <input type="text" className={inputClass} placeholder="Ex: Paris / Remote" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  </div>

                  <div className="space-y-4">
                    <label className={labelClass}>Statut</label>
                    <select className={inputClass} value={formData.status} onChange={(e: any) => setFormData({...formData, status: e.target.value})}>
                      {['Ouvert', 'Bientôt fini', 'Fermé'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Champ Tags masqué
                  <div className="md:col-span-2 space-y-4">
                    <label className={labelClass}>Tags / Spécialités (séparés par des virgules)</label>
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Ex: Génie Logiciel, React, Cybersécurité"
                      value={formData.tags?.join(', ') || ''}
                      onChange={e => setFormData({...formData, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t !== '')})}
                    />
                  </div>
                  */}

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
                          <span className="text-[var(--theme-text-tertiary)] font-bold">À</span>
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

                  <div className="md:col-span-2 space-y-4">
                    <label className={labelClass}>Contenu Markdown</label>
                    <textarea className={`${inputClass} min-h-[300px] font-mono text-sm`} placeholder="Détails de l'opportunité..." value={formData.fullContent} onChange={e => setFormData({...formData, fullContent: e.target.value})} />
                  </div>

                  {/* Section IA Générative */}
                  <div className="md:col-span-2 bg-[var(--theme-bg-tertiary)]/30 border border-[var(--theme-border-primary)] rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                          <Bot className="w-4 h-4 text-[var(--theme-bg-accent)]" />
                          Assistant IA - Message d'Accueil
                        </h4>
                        <p className="text-[10px] text-[var(--theme-text-tertiary)] mt-1">Générez un message d'accueil personnalisé pour le chat.</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateAiGreeting}
                        disabled={isGeneratingAi}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isGeneratingAi ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--theme-bg-accent)] text-white hover:scale-105 shadow-lg'}`}
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
                          <MessageSquare className="w-12 h-12 text-[var(--theme-text-tertiary)]" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button type="submit" className="md:col-span-2 w-full bg-[var(--theme-bg-accent)] text-white font-black py-5 rounded-2xl shadow-xl hover:scale-[1.02] transition-all uppercase tracking-widest active:scale-95">
                    {editingId ? 'Sauvegarder les modifications' : 'Publier l\'opportunité'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-[var(--theme-bg-secondary)] p-8 rounded-3xl border border-[var(--theme-border-primary)] shadow-2xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                    h1: (props) => <h1 className="text-3xl font-black text-[var(--theme-text-primary)] mb-6 mt-8 uppercase border-b-2 border-[var(--theme-bg-accent)] pb-2" {...props} />,
                    h2: (props) => <h2 className="text-xl font-black text-[var(--theme-text-primary)] mb-4 mt-6 uppercase flex items-center gap-2 before:content-[''] before:w-1.5 before:h-6 before:bg-[var(--theme-bg-accent)] before:rounded-full" {...props} />,
                    p: (props) => <p className="text-base leading-relaxed mb-4 opacity-90" {...props} />,
                    strong: (props) => <strong className="text-[var(--theme-bg-accent)] font-black" {...props} />,
                    ul: (props) => <ul className="space-y-2 mb-6 ml-4" {...props} />,
                    li: (props) => <li className="flex items-start gap-2 text-sm"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--theme-bg-accent)] shrink-0" /><span {...props} /></li>,
                  }}>
                    {formData.fullContent || "*Contenu vide*"}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ) : adminTab === 'queue' ? (
          <PendingOpportunitiesQueue onRefresh={loadOpportunities} />
        ) : adminTab === 'manage' ? (
          <div className="p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Gestion des Opportunités</h2>
                <p className="text-gray-600">Gérer les opportunités déjà publiées sur la plateforme</p>
              </div>

              {/* Barre de recherche */}
              <div className="mb-6">
                <div className="relative max-w-md mx-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher une opportunité..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Liste des opportunités publiées */}
              {filteredOpps.length === 0 ? (
                <div className="text-center py-12">
                  <LayoutGrid className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune opportunité</h3>
                  <p className="text-gray-600">
                    {searchQuery ? 'Aucune opportunité trouvée pour cette recherche' : 'Aucune opportunité publiée pour le moment'}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredOpps.map((opp) => (
                    <div
                      key={opp.id}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => {
                        setEditingId(opp.id);
                        setFormData({
                          type: opp.type,
                          title: opp.title,
                          organization: opp.organization,
                          description: opp.description,
                          fullContent: opp.fullContent,
                          deadline: opp.deadline,
                          location: opp.location,
                          image: opp.image,
                          link: opp.link,
                          contactEmail: opp.contactEmail,
                          applyMethod: opp.applyMethod,
                          status: opp.status,
                          reward: opp.reward,
                          tags: opp.tags || [],
                          salary: opp.salary,
                          contractType: opp.contractType,
                          duration: opp.duration,
                          level: opp.level,
                          prizes: opp.prizes,
                          speakers: opp.speakers,
                          schedule: opp.schedule,
                          aiGreeting: opp.aiGreeting,
                          isPartner: opp.isPartner
                        });
                        setAdminTab('create');
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                              opp.type === 'Emploi' ? 'bg-green-100 text-green-800' :
                              opp.type === 'Stage' ? 'bg-blue-100 text-blue-800' :
                              opp.type === 'Bourse' ? 'bg-purple-100 text-purple-800' :
                              opp.type === 'Concours' ? 'bg-orange-100 text-orange-800' :
                              'bg-pink-100 text-pink-800'
                            }`}>
                              {opp.type}
                            </span>
                          </div>
                          <h3 className="font-bold text-gray-900 text-lg mb-1">{opp.title}</h3>
                          <p className="text-gray-600 mb-2">{opp.organization}</p>
                          <p className="text-sm text-gray-500 line-clamp-2">{opp.description}</p>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                            {opp.location && <span>📍 {opp.location}</span>}
                            {opp.deadline && <span>⏰ {new Date(opp.deadline).toLocaleDateString('fr-FR')}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) {
                                handleDeleteOpportunity(opp.id);
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : adminTab === 'analytics' ? (
          <div className="p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Statistiques et métriques de performance</p>
              </div>

              {/* Statistiques principales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Total Opportunités</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">{allOpps.length}</div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Analysées par IA</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {allOpps.filter(opp => opp.aiGreeting).length}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Ce mois</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {allOpps.filter(opp => {
                      const created = new Date(opp.createdAt || Date.now());
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                    }).length}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Taux de conversion</span>
                  </div>
                  <div className="text-3xl font-black text-gray-900">
                    {allOpps.length > 0 ? Math.round((allOpps.filter(opp => opp.status === 'Ouvert').length / allOpps.length) * 100) : 0}%
                  </div>
                </div>
              </div>

              {/* Répartition par type */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Répartition par type</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {['Emploi', 'Stage', 'Bourse', 'Concours', 'Conférences'].map(type => {
                    const count = allOpps.filter(opp => opp.type === type).length;
                    const percentage = allOpps.length > 0 ? Math.round((count / allOpps.length) * 100) : 0;
                    return (
                      <div key={type} className="text-center">
                        <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center text-white font-bold ${
                          type === 'Emploi' ? 'bg-green-500' :
                          type === 'Stage' ? 'bg-blue-500' :
                          type === 'Bourse' ? 'bg-purple-500' :
                          type === 'Concours' ? 'bg-orange-500' :
                          'bg-pink-500'
                        }`}>
                          {count}
                        </div>
                        <div className="text-sm font-bold text-gray-900">{type}</div>
                        <div className="text-xs text-gray-500">{percentage}%</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Activité récente */}
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {allOpps.slice(0, 5).map(opp => (
                    <div key={opp.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-3 h-3 rounded-full ${
                        opp.type === 'Emploi' ? 'bg-green-500' :
                        opp.type === 'Stage' ? 'bg-blue-500' :
                        opp.type === 'Bourse' ? 'bg-purple-500' :
                        opp.type === 'Concours' ? 'bg-orange-500' :
                        'bg-pink-500'
                      }`} />
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{opp.title}</div>
                        <div className="text-sm text-gray-600">{opp.organization} • {opp.type}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(opp.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 md:p-12 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--theme-text-tertiary)] group-focus-within:text-[var(--theme-bg-accent)] transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher une opportunité..."
                  className="w-full bg-[var(--theme-bg-secondary)] border border-[var(--theme-border-primary)] rounded-2xl pl-12 pr-4 py-4 text-[var(--theme-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-bg-accent)]/50 transition-all shadow-inner"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Opportunities List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredOpps.length === 0 ? (
                  <div className="text-center py-20 bg-[var(--theme-bg-secondary)] rounded-3xl border-2 border-dashed border-[var(--theme-border-primary)]">
                    <p className="text-[var(--theme-text-tertiary)] font-bold uppercase tracking-widest">Aucun résultat trouvé</p>
                  </div>
                ) : (
                  filteredOpps.map((opp: any) => (
                    <div key={opp.id} className="bg-[var(--theme-bg-secondary)] p-5 rounded-2xl border border-[var(--theme-border-primary)] flex items-center justify-between group hover:border-[var(--theme-bg-accent)]/50 transition-all shadow-sm">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md shrink-0 border border-[var(--theme-border-primary)]">
                          <img src={opp.image} alt={opp.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg leading-tight mb-1 text-[var(--theme-text-primary)]">{opp.title || "Sans titre"}</h4>
                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-black uppercase tracking-wider">
                            <span className="text-[var(--theme-bg-accent)]">{opp.type}</span>
                            <span className="text-[var(--theme-text-tertiary)]">•</span>
                            <span className="text-[var(--theme-text-tertiary)]">{opp.organization || "Anonyme"}</span>
                            {opp.deadline && (
                              <>
                                <span className="text-[var(--theme-text-tertiary)]">•</span>
                                <span className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
                                  <Clock className="w-3 h-3" /> {opp.deadline}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button aria-label="Modifier l opportunity" onClick={() => startEdit(opp)} className="p-3 bg-[var(--theme-bg-tertiary)] text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button aria-label="Supprimer l opportunity" onClick={() => handleDelete(opp.id)} className="p-3 bg-[var(--theme-bg-tertiary)] text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// Button styles constants
