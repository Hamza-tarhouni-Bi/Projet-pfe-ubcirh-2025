import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle2, XCircle, Eye, Filter, ChevronDown, Clock, Check, X } from "lucide-react";

// CSS encapsulé avec préfixe "gav-" (Gestion Avances)
const encapsulatedStyles = `
  .gav-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  
  .gav-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gav-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .gav-search-filter-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .gav-search-container {
    position: relative;
    flex-grow: 1;
  }
  
  .gav-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .gav-search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }
  
  .gav-search-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gav-filter-container {
    position: relative;
    min-width: 180px;
  }
  
  .gav-filter-select {
    appearance: none;
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  .gav-filter-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  
  .gav-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gav-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gav-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color:#f5f5f5;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gav-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gav-tr {
    transition: background-color 0.2s ease;
  }
  
  .gav-tr:hover {
    background-color: #f9fafb;
  }
  
  .gav-employee-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gav-employee-dept {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  
  .gav-amount {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }
  
  .gav-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  
  .gav-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gav-badge-standard {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .gav-badge-urgent {
    background-color: #ede9fe;
    color: #5b21b6;
  }
  
  .gav-status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }
  
  .gav-status-approved {
    background-color: #ecfdf5;
    color: #059669;
  }
  
  .gav-status-pending {
    background-color: #fffbeb;
    color: #d97706;
  }
  
  .gav-status-rejected {
    background-color: #fef2f2;
    color: #dc2626;
  }
  
  .gav-view-button {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.75rem;
    font-weight: 500;
    color: #4b5563;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .gav-view-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
.gav-action-button {
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  margin-right: 0.5rem;
}

.gav-action-button-approve {
  background-color: #d1fae5;
  color: #059669;
}

.gav-action-button-approve:hover {
  background-color: #a7f3d0;
}

.gav-action-button-reject {
  background-color: #fee2e2;
  color: #dc2626;
}

.gav-action-button-reject:hover {
  background-color: #fecaca;
}
  
  .gav-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }
  
  .gav-modal {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 60;
  }
  
  .gav-modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .gav-modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .gav-modal-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gav-modal-close:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .gav-modal-body {
    padding: 1.5rem;
  }
  
  .gav-modal-section {
    margin-bottom: 1.5rem;
  }
  
  .gav-modal-section:last-child {
    margin-bottom: 0;
  }
  
  .gav-modal-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .gav-modal-section-content {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #4b5563;
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }
  
  .gav-modal-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .gav-modal-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .gav-modal-info-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }
  
  .gav-modal-info-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gav-modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  
  .gav-modal-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .gav-modal-button-secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;
  }
  
  .gav-modal-button-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .gav-modal-button-primary {
    background-color: #14b8a6;
    color: white;
    border: 1px solid transparent;
  }
  
  .gav-modal-button-primary:hover {
    background-color: #0d9488;
  }

  .gav-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    font-size: 1rem;
    color: #6b7280;
  }

  .gav-error {
    padding: 1rem;
    background-color: #fee2e2;
    color: #b91c1c;
    border-radius: 0.375rem;
    margin: 1rem;
    text-align: center;
  }

  .gav-footer {
    padding: 1rem 1.5rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
    font-size: 0.875rem;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 8px 8px;
  }

  .gav-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #334155;
  }

  .gav-count-icon {
    color: #14b8a6;
  }

  /* Toast styles */
  .gav-toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .gav-toast {
    padding: 12px 24px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    align-items: center;
    gap: 8px;
    animation: slideIn 0.3s ease-out;
    margin-bottom: 10px;
  }

  .gav-toast-success {
    background-color: #10b981;
  }

  .gav-toast-error {
    background-color: #ef4444;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  /* Pagination styles */
  .gav-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
    background-color: #f8fafc;
    border-top: 1px solid #e2e8f0;
  }

  .gav-pagination-controls {
    display: flex;
    gap: 0.5rem;
  }

  .gav-page-button {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .gav-page-button:hover {
    background-color: #f3f4f6;
  }

  .gav-page-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .gav-page-button.active {
    background-color: #14b8a6;
    color: white;
    border-color: #14b8a6;
  }
`;

export default function GestionAvances() {
  const [demandes, setDemandes] = useState([]);
  const [demandesFiltrees, setDemandesFiltrees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [demandeSelected, setDemandeSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Charger les demandes depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await fetch('/alldemandeavance');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes');
        }
        const data = await response.json();
        setDemandes(data);
        setDemandesFiltrees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  // Filtrer les demandes basé sur la recherche et le statut
  useEffect(() => {
    let resultats = demandes;
    
    if (recherche.trim()) {
      const termeLower = recherche.toLowerCase();
      resultats = resultats.filter(demande => 
        (demande.nom && demande.nom.toLowerCase().includes(termeLower)) ||
        (demande.prenom && demande.prenom.toLowerCase().includes(termeLower)) ||
        (demande.montant && demande.montant.toString().includes(recherche))
      );
    }
    
    if (filtreStatut !== "Tous") {
      resultats = resultats.filter(demande => demande.statut === filtreStatut);
    }
    
    setDemandesFiltrees(resultats);
    setCurrentPage(1); // Reset à la première page quand les filtres changent
  }, [recherche, filtreStatut, demandes]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = demandesFiltrees.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(demandesFiltrees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Gestion des toasts
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    const newToast = { id, message, type };
    
    setToasts(prev => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Ouvrir le modal avec les détails de la demande
  const ouvrirModal = (demande) => {
    setDemandeSelected(demande);
    setModalVisible(true);
  };

  // Fermer le modal
  const fermerModal = () => {
    setModalVisible(false);
    setDemandeSelected(null);
  };

  // Mettre à jour le statut d'une demande
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Mettre à jour le statut de la demande via l'API
      const response = await fetch(`/updatedemandeAvance/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus })
      });
      
      if (!response.ok) throw new Error('Échec de la mise à jour de la demande');
      
      // Mettre à jour l'état local
      const demandesUpdated = demandes.map(demande => {
        if (demande._id === id) {
          return { ...demande, statut: newStatus };
        }
        return demande;
      });
      
      setDemandes(demandesUpdated);
      showToast(`Demande ${newStatus === 'Approuvée' ? 'approuvée' : 'refusée'}`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
      console.error(err);
    }
  };

  const handleApprove = (id) => {
    handleStatusUpdate(id, 'Approuvée');
  };

  const handleReject = (id) => {
    handleStatusUpdate(id, 'Rejetée');
  };

  // Rendu du statut avec l'icône appropriée
  const renderStatus = (status) => {
    switch (status) {
      case "Approuvée":
        return (
          <div className="gav-status-badge gav-status-approved">
            <CheckCircle2 size={16} />
            <span>Approuvé</span>
          </div>
        );
      case "En attente":
        return (
          <div className="gav-status-badge gav-status-pending">
            <Clock size={16} />
            <span>En attente</span>
          </div>
        );
      case "Rejetée":
        return (
          <div className="gav-status-badge gav-status-rejected">
            <XCircle size={16} />
            <span>Refusé</span>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <>
        <style>{encapsulatedStyles}</style>
        <div className="gav-loading">Chargement des demandes d'avance...</div>
      </>
    );
  }

  return (
    <>
      {/* Injection du CSS encapsulé */}
      <style>{encapsulatedStyles}</style>
      
      <div className="gav-container">
        {/* En-tête et recherche */}
        <div className="gav-header-section">
          <h1 className="gav-title">
            Gestion des Demandes d'Avances
          </h1>
          
          <div className="gav-search-filter-container">
            {/* Barre de recherche */}
            <div className="gav-search-container">
              <div className="gav-search-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="gav-search-input"
                placeholder="Rechercher par nom, prénom ou montant..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            
            {/* Filtre par statut */}
            <div className="gav-filter-container">
              <select
                className="gav-filter-select"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Approuvée">Approuvée</option>
                <option value="Rejetée">Rejetée</option>
              </select>
              <div className="gav-filter-icon">
                <Filter size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="gav-error">
            {error}
          </div>
        )}

        {/* Tableau des demandes */}
        <div className="gav-table-container">
          <table className="gav-table">
            <thead>
              <tr>
                <th className="gav-th">Nom</th>
                <th className="gav-th">Prénom</th>
                <th className="gav-th">Montant</th>
                <th className="gav-th">Type</th>
                <th className="gav-th">Statut</th>
                <th className="gav-th">Motif</th>
                <th className="gav-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="gav-td" style={{ textAlign: 'center' }}>
                    Aucune demande d'avance trouvée
                  </td>
                </tr>
              ) : (
                currentItems.map((demande) => (
                  <tr key={demande._id} className="gav-tr">
                    <td className="gav-td">
                      <div className="gav-employee-name">
                        {demande.nom}
                      </div>
                    </td>
                    <td className="gav-td">
                      <div className="gav-employee-name">
                        {demande.prenom}
                      </div>
                    </td>
                    <td className="gav-td">
                      <div className="gav-amount">
                        {demande.montant} TND
                      </div>
                      <div className="gav-date">{formatDate(demande.createdAt)}</div>
                    </td>
                    <td className="gav-td">
                      <span className={`gav-badge ${demande.type === "Urgente" ? "gav-badge-urgent" : "gav-badge-standard"}`}>
                        {demande.type}
                      </span>
                    </td>
                    <td className="gav-td">
                      {renderStatus(demande.statut)}
                    </td>
                    <td className="gav-td">
                      <button
                        className="gav-view-button"
                        onClick={() => ouvrirModal(demande)}
                      >
                        <Eye size={14} />
                        <span>Voir motif</span>
                      </button>
                    </td>
                    <td className="gav-td">
                      <div className="gav-actions">
                        {demande.statut === "En attente" && (
                          <>
                            <button 
                              className="gav-action-button gav-action-button-approve" 
                              onClick={() => handleApprove(demande._id)}
                              title="Approuver"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="gav-action-button gav-action-button-reject" 
                              onClick={() => handleReject(demande._id)}
                              title="Refuser"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="gav-pagination">
          <div className="gav-count">
            <CheckCircle2 className="gav-count-icon" size={16} />
            <span>Affichage de {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, demandesFiltrees.length)} sur {demandesFiltrees.length} demandes</span>
          </div>
          
          <div className="gav-pagination-controls">
            <button 
              onClick={() => paginate(currentPage - 1)} 
              disabled={currentPage === 1}
              className="gav-page-button"
            >
              Précédent
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`gav-page-button ${currentPage === number ? 'active' : ''}`}
              >
                {number}
              </button>
            ))}
            
            <button 
              onClick={() => paginate(currentPage + 1)} 
              disabled={currentPage === totalPages || totalPages === 0}
              className="gav-page-button"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal pour afficher le détail de la demande */}
      {modalVisible && demandeSelected && (
        <div className="gav-modal-overlay" onClick={fermerModal}>
          <div className="gav-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gav-modal-header">
              <h3 className="gav-modal-title">Détails de la demande</h3>
              <button className="gav-modal-close" onClick={fermerModal}>
                <X size={20} />
              </button>
            </div>
            <div className="gav-modal-body">
              <div className="gav-modal-info-grid">
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Nom</span>
                  <span className="gav-modal-info-value">
                    {demandeSelected.nom}
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Prénom</span>
                  <span className="gav-modal-info-value">
                    {demandeSelected.prenom}
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Email</span>
                  <span className="gav-modal-info-value">
                    {demandeSelected.email || "N/A"}
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Montant</span>
                  <span className="gav-modal-info-value">{demandeSelected.montant} TND</span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Date de demande</span>
                  <span className="gav-modal-info-value">{formatDate(demandeSelected.createdAt)}</span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Type</span>
                  <span className="gav-modal-info-value">
                    <span className={`gav-badge ${demandeSelected.type === "Urgente" ? "gav-badge-urgent" : "gav-badge-standard"}`}>
                      {demandeSelected.type}
                    </span>
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Statut</span>
                  <span className="gav-modal-info-value">
                    {renderStatus(demandeSelected.statut)}
                  </span>
                </div>
              </div>

              <div className="gav-modal-section">
                <h4 className="gav-modal-section-title">Motif de la demande</h4>
                <div className="gav-modal-section-content">
                  {demandeSelected.motif}
                </div>
              </div>
            </div>
            <div className="gav-modal-footer">
              <button className="gav-modal-button gav-modal-button-secondary" onClick={fermerModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notifications */}
      <div className="gav-toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`gav-toast gav-toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}