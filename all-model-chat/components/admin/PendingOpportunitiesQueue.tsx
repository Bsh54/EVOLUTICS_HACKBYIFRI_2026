import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  X,
  Eye,
  Edit3,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Bot,
  AlertTriangle,
  ExternalLink,
  MessageSquare,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PendingOpportunity, QueueStats } from '../../types/pendingOpportunity';
import { pendingOpportunityService } from '../../services/pendingOpportunityService';
import { aiAnalysisService } from '../../services/aiAnalysisService';
import { useAuth } from '../../contexts/AuthContext';

interface PendingOpportunitiesQueueProps {
  onRefresh?: () => void;
}

export const PendingOpportunitiesQueue: React.FC<PendingOpportunitiesQueueProps> = ({ onRefresh }) => {
  const { profile } = useAuth();
  const [pendingOpps, setPendingOpps] = useState<PendingOpportunity[]>([]);
  const [selectedOpp, setSelectedOpp] = useState<PendingOpportunity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Charger les opportunités en attente
  const loadPendingOpportunities = async () => {
    setIsLoading(true);
    try {
      const [opps, queueStats] = await Promise.all([
        pendingOpportunityService.getAll(statusFilter === 'all' ? undefined : statusFilter),
        pendingOpportunityService.getStats()
      ]);
      setPendingOpps(opps);
      setStats(queueStats);
    } catch (error) {
      console.error('Erreur chargement file d\'attente:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingOpportunities();
  }, [statusFilter]);

  // Filtrer les opportunités
  const filteredOpps = useMemo(() => {
    if (!searchQuery) return pendingOpps;
    return pendingOpps.filter(opp =>
      opp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [pendingOpps, searchQuery]);

  // Approuver une opportunité
  const handleApprove = async (opp: PendingOpportunity) => {
    if (!profile?.id) return;

    setIsProcessing(opp.id);
    try {
      await pendingOpportunityService.approve(opp.id, adminNotes, profile.id);
      await loadPendingOpportunities();
      setSelectedOpp(null);
      setAdminNotes('');
      onRefresh?.();
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setIsProcessing(null);
    }
  };

  // Rejeter une opportunité
  const handleReject = async (opp: PendingOpportunity) => {
    if (!profile?.id) return;

    const reason = adminNotes || 'Opportunité rejetée par l\'administrateur';
    setIsProcessing(opp.id);
    try {
      await pendingOpportunityService.reject(opp.id, reason, profile.id);
      await loadPendingOpportunities();
      setSelectedOpp(null);
      setAdminNotes('');
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('Erreur lors du rejet');
    } finally {
      setIsProcessing(null);
    }
  };

  // Re-analyser avec l'IA
  const handleReanalyze = async (opp: PendingOpportunity) => {
    setIsProcessing(opp.id);
    try {
      const result = await aiAnalysisService.analyzeOpportunity(opp.sourceUrl);
      if (result) {
        await pendingOpportunityService.update(opp.id, {
          ...result,
          aiConfidence: result.confidence,
          aiProcessed: true,
          extractedData: {
            title: result.title,
            organization: result.organization,
            type: result.type,
            confidence: result.confidence
          }
        });
        await loadPendingOpportunities();
      }
    } catch (error) {
      console.error('Erreur re-analyse:', error);
      alert('Erreur lors de la re-analyse');
    } finally {
      setIsProcessing(null);
    }
  };

  // Supprimer une opportunité
  const handleDelete = async (opp: PendingOpportunity) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ?')) return;

    setIsProcessing(opp.id);
    try {
      await pendingOpportunityService.delete(opp.id);
      await loadPendingOpportunities();
      setSelectedOpp(null);
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setIsProcessing(null);
    }
  };

  // Actions en lot
  const handleBulkApprove = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Approuver ${selectedIds.size} opportunités ?`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedIds) {
        await pendingOpportunityService.approve(id, 'Approbation en lot', profile?.id);
      }
      await loadPendingOpportunities();
      setSelectedIds(new Set());
      onRefresh?.();
    } catch (error) {
      console.error('Erreur approbation en lot:', error);
      alert('Erreur lors de l\'approbation en lot');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Rejeter ${selectedIds.size} opportunités ?`)) return;

    setIsLoading(true);
    try {
      for (const id of selectedIds) {
        await pendingOpportunityService.reject(id, 'Rejet en lot', profile?.id);
      }
      await loadPendingOpportunities();
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Erreur rejet en lot:', error);
      alert('Erreur lors du rejet en lot');
    } finally {
      setIsLoading(false);
    }
  };

  // Sélection multiple
  const toggleSelection = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredOpps.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredOpps.map(opp => opp.id)));
    }
  };

  // Rendu des statistiques
  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">En attente</span>
          </div>
          <div className="text-2xl font-black text-blue-900">{stats.pending}</div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Approuvées</span>
          </div>
          <div className="text-2xl font-black text-green-900">{stats.approved}</div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <X className="w-4 h-4 text-red-600" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Rejetées</span>
          </div>
          <div className="text-2xl font-black text-red-900">{stats.rejected}</div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Confiance IA</span>
          </div>
          <div className="text-2xl font-black text-purple-900">
            {Math.round(stats.averageConfidence * 100)}%
          </div>
        </div>
      </div>
    );
  };

  // Rendu d'une carte d'opportunité
  const renderOpportunityCard = (opp: PendingOpportunity) => {
    const isSelected = selectedIds.has(opp.id);
    const isCurrentlyProcessing = isProcessing === opp.id;

    return (
      <div
        key={opp.id}
        className={`bg-white border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        } ${selectedOpp?.id === opp.id ? 'ring-2 ring-blue-500' : ''}`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox de sélection */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => toggleSelection(opp.id)}
            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />

          <div className="flex-1 min-w-0">
            {/* En-tête */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    opp.type === 'Emploi' ? 'bg-green-100 text-green-800' :
                    opp.type === 'Stage' ? 'bg-blue-100 text-blue-800' :
                    opp.type === 'Bourse' ? 'bg-purple-100 text-purple-800' :
                    opp.type === 'Concours' ? 'bg-orange-100 text-orange-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {opp.type}
                  </span>

                  {opp.aiConfidence && (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                      opp.aiConfidence > 0.8 ? 'bg-green-100 text-green-800' :
                      opp.aiConfidence > 0.6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      IA: {Math.round(opp.aiConfidence * 100)}%
                    </span>
                  )}

                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    opp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    opp.status === 'approved' ? 'bg-green-100 text-green-800' :
                    opp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opp.status}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 truncate">{opp.title}</h3>
                <p className="text-sm text-gray-600 truncate">{opp.organization}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setSelectedOpp(selectedOpp?.id === opp.id ? null : opp)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Voir la source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                {opp.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(opp)}
                      disabled={isCurrentlyProcessing}
                      className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Approuver"
                    >
                      {isCurrentlyProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleReject(opp)}
                      disabled={isCurrentlyProcessing}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Rejeter"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => handleReanalyze(opp)}
                  disabled={isCurrentlyProcessing}
                  className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Re-analyser avec l'IA"
                >
                  <Bot className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(opp)}
                  disabled={isCurrentlyProcessing}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {opp.description}
            </p>

            {/* Métadonnées */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {opp.location && (
                <span>📍 {opp.location}</span>
              )}
              {opp.deadline && (
                <span>⏰ {new Date(opp.deadline).toLocaleDateString('fr-FR')}</span>
              )}
              <span>🕒 {new Date(opp.createdAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* En-tête */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">File d'attente IA</h2>
            <p className="text-gray-600">Validation des opportunités analysées automatiquement</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadPendingOpportunities}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Actualiser
            </button>
          </div>
        </div>

        {/* Statistiques */}
        {renderStats()}

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, organisation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="pending">En attente</option>
            <option value="approved">Approuvées</option>
            <option value="rejected">Rejetées</option>
            <option value="all">Toutes</option>
          </select>

          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {selectedIds.size} sélectionnée(s)
              </span>
              <button
                onClick={handleBulkApprove}
                className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Approuver
              </button>
              <button
                onClick={handleBulkReject}
                className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Rejeter
              </button>
            </div>
          )}
        </div>

        {/* Sélection multiple */}
        {filteredOpps.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <input
              type="checkbox"
              checked={selectedIds.size === filteredOpps.length}
              onChange={selectAll}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Tout sélectionner</span>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Liste des opportunités */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredOpps.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Aucune opportunité</h3>
              <p className="text-gray-600">
                {statusFilter === 'pending'
                  ? 'Aucune opportunité en attente de validation'
                  : 'Aucune opportunité trouvée avec ces filtres'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOpps.map(renderOpportunityCard)}
            </div>
          )}
        </div>

        {/* Panneau de détails */}
        {selectedOpp && (
          <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Détails</h3>
                <button
                  onClick={() => setSelectedOpp(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contenu de l'opportunité */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{selectedOpp.title}</h4>
                  <p className="text-gray-600">{selectedOpp.organization}</p>
                </div>

                {selectedOpp.description && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Description</h5>
                    <p className="text-sm text-gray-600">{selectedOpp.description}</p>
                  </div>
                )}

                {selectedOpp.fullContent && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Contenu complet</h5>
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {selectedOpp.fullContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {selectedOpp.aiGreeting && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Message IA</h5>
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      {selectedOpp.aiGreeting}
                    </p>
                  </div>
                )}

                {/* Métadonnées */}
                <div className="space-y-2 text-sm">
                  {selectedOpp.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lieu:</span>
                      <span className="text-gray-900">{selectedOpp.location}</span>
                    </div>
                  )}
                  {selectedOpp.deadline && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date limite:</span>
                      <span className="text-gray-900">
                        {new Date(selectedOpp.deadline).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  )}
                  {selectedOpp.reward && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Récompense:</span>
                      <span className="text-gray-900">{selectedOpp.reward}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Confiance IA:</span>
                    <span className="text-gray-900">
                      {Math.round((selectedOpp.aiConfidence || 0) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {selectedOpp.tags && selectedOpp.tags.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Tags</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedOpp.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes admin */}
                {selectedOpp.status === 'pending' && (
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Notes administrateur</h5>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Ajouter des notes (optionnel)..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>
                )}

                {/* Actions */}
                {selectedOpp.status === 'pending' && (
                  <div className="flex gap-2 pt-4 border-t">
                    <button
                      onClick={() => handleApprove(selectedOpp)}
                      disabled={isProcessing === selectedOpp.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approuver
                    </button>
                    <button
                      onClick={() => handleReject(selectedOpp)}
                      disabled={isProcessing === selectedOpp.id}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Rejeter
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};