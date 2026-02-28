import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  X,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Bot,
  AlertTriangle,
  MessageSquare,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { PendingOpportunity, QueueStats } from '../../types/pendingOpportunity';
import { pendingOpportunityService } from '../../services/pendingOpportunityService';
import { aiAnalysisService } from '../../services/aiAnalysisService';
import { useAuth } from '../../contexts/AuthContext';
import { EditOpportunityModal } from './EditOpportunityModal';

interface PendingOpportunitiesQueueProps {
  onRefresh?: () => void;
}

export const PendingOpportunitiesQueue: React.FC<PendingOpportunitiesQueueProps> = ({ onRefresh }) => {
  const { profile } = useAuth();
  const [pendingOpps, setPendingOpps] = useState<PendingOpportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingOpp, setEditingOpp] = useState<PendingOpportunity | null>(null);

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

  // Gérer l'édition d'une opportunité
  const handleEdit = (opp: PendingOpportunity) => {
    setEditingOpp(opp);
  };

  // Sauvegarder les modifications
  const handleSaveEdit = async (updatedOpp: PendingOpportunity) => {
    try {
      await pendingOpportunityService.update(updatedOpp.id, updatedOpp);
      await loadPendingOpportunities();
      setEditingOpp(null);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
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

  // Rendu des statistiques compactes (sans confiance IA)
  const renderStats = () => {
    if (!stats) return null;

    return (
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 mb-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">En attente</span>
            <span className="text-lg font-bold text-blue-900">{stats.pending}</span>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Approuvées</span>
            <span className="text-lg font-bold text-green-900">{stats.approved}</span>
          </div>

          <div className="flex items-center gap-2">
            <X className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-gray-600">Rejetées</span>
            <span className="text-lg font-bold text-red-900">{stats.rejected}</span>
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
        className={`bg-white border rounded-lg p-3 transition-all duration-200 hover:shadow-md cursor-pointer ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
        }`}
        onClick={() => handleEdit(opp)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox de sélection */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              toggleSelection(opp.id);
            }}
            className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />

          <div className="flex-1 min-w-0">
            {/* En-tête compact */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    opp.type === 'Emploi' ? 'bg-green-100 text-green-800' :
                    opp.type === 'Stage' ? 'bg-blue-100 text-blue-800' :
                    opp.type === 'Bourse' ? 'bg-purple-100 text-purple-800' :
                    opp.type === 'Concours' ? 'bg-orange-100 text-orange-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {opp.type}
                  </span>

                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    opp.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    opp.status === 'approved' ? 'bg-green-100 text-green-800' :
                    opp.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {opp.status}
                  </span>
                </div>

                <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{opp.title}</h3>
                <p className="text-sm text-gray-600 truncate">{opp.organization}</p>
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
    <div className="min-h-screen bg-gray-50">
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
      </div>

      {/* Liste des opportunités - Affichage direct sur la page */}
      <div className="p-6">
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
                : 'Aucune opportunité trouvée'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOpps.map(renderOpportunityCard)}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      {editingOpp && (
        <EditOpportunityModal
          opportunity={editingOpp}
          onClose={() => setEditingOpp(null)}
          onSave={handleSaveEdit}
          onDelete={async (oppId) => {
            await loadPendingOpportunities();
            setEditingOpp(null);
          }}
          onApprove={async (opp) => {
            if (!profile?.id) return;
            try {
              await pendingOpportunityService.approve(opp.id, '', profile.id);
              await loadPendingOpportunities();
              onRefresh?.();
              setEditingOpp(null);
            } catch (error) {
              console.error('Erreur approbation:', error);
              alert('Erreur lors de l\'approbation');
            }
          }}
        />
      )}
    </div>
  );
};