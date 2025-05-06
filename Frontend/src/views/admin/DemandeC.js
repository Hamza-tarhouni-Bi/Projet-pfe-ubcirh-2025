import { useState, useEffect } from "react";
import { Search, AlertCircle, CheckCircle2, XCircle, Eye, Filter, ChevronDown, Clock, Check, X } from "lucide-react";

const encapsulatedStyles = `
  .gdc-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  
  .gdc-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gdc-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .gdc-search-filter-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .gdc-search-container {
    position: relative;
    flex-grow: 1;
  }
  
  .gdc-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .gdc-search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }
  
  .gdc-search-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gdc-filter-container {
    position: relative;
    min-width: 180px;
  }
  
  .gdc-filter-select {
    appearance: none;
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  .gdc-filter-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  
  .gdc-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gdc-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gdc-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gdc-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gdc-tr {
    transition: background-color 0.2s ease;
  }
  
  .gdc-tr:hover {
    background-color: #f9fafb;
  }
  
  .gdc-employee-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gdc-period {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
  }
  
  .gdc-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  
  .gdc-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gdc-badge-annuel {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .gdc-badge-maladie {
    background-color: #ede9fe;
    color: #5b21b6;
  }
  
  .gdc-badge-exceptionnel {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .gdc-badge-maternite {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .gdc-status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.375rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }
  
  .gdc-status-approved {
    background-color: #ecfdf5;
    color: #059669;
  }
  
  .gdc-status-pending {
    background-color: #fffbeb;
    color: #d97706;
  }
  
  .gdc-status-rejected {
    background-color: #fef2f2;
    color: #dc2626;
  }
  
  .gdc-view-button {
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
  
  .gdc-view-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .gdc-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 8px;
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
  
  .gdc-action-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .gdc-action-button-approve {
    background-color: #10b981;
  }
  
  .gdc-action-button-approve:hover {
    background-color: #059669;
  }
  
  .gdc-action-button-reject {
    background-color: #ef4444;
  }
  
  .gdc-action-button-reject:hover {
    background-color: #dc2626;
  }
  
  .gdc-modal-overlay {
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
  
  .gdc-modal {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 90%;
    max-width: 32rem;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 60;
  }
  
  .gdc-modal-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .gdc-modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #111827;
  }
  
  .gdc-modal-close {
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
  
  .gdc-modal-close:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
  
  .gdc-modal-body {
    padding: 1.5rem;
  }
  
  .gdc-modal-section {
    margin-bottom: 1.5rem;
  }
  
  .gdc-modal-section:last-child {
    margin-bottom: 0;
  }
  
  .gdc-modal-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .gdc-modal-section-content {
    font-size: 0.875rem;
    line-height: 1.5;
    color: #4b5563;
    background-color: #f9fafb;
    padding: 1rem;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
  }
  
  .gdc-modal-info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .gdc-modal-info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .gdc-modal-info-label {
    font-size: 0.75rem;
    font-weight: 500;
    color: #6b7280;
  }
  
  .gdc-modal-info-value {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gdc-modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
  }
  
  .gdc-modal-button {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .gdc-modal-button-secondary {
    background-color: white;
    color: #4b5563;
    border: 1px solid #d1d5db;
  }
  
  .gdc-modal-button-secondary:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .gdc-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    font-size: 1rem;
    color: #6b7280;
  }

  .gdc-error {
    padding: 1rem;
    background-color: #fee2e2;
    color: #b91c1c;
    border-radius: 0.375rem;
    margin: 1rem;
    text-align: center;
  }

  .gdc-footer {
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

  .gdc-count {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    color: #334155;
  }

  .gdc-count-icon {
    color: #14b8a6;
  }

  /* Toast styles */
  .gdc-toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .gdc-toast {
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

  .gdc-toast-success {
    background-color: #10b981;
  }

  .gdc-toast-error {
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
`;

export default function GestionConges() {
  const [demandes, setDemandes] = useState([]);
  const [demandesFiltrees, setDemandesFiltrees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [demandeSelected, setDemandeSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await fetch('/alldemandeConge');
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

  useEffect(() => {
    let resultats = demandes;
    
    if (recherche.trim()) {
      const termeLower = recherche.toLowerCase();
      resultats = resultats.filter(demande => 
        (demande.nom && demande.nom.toLowerCase().includes(termeLower)) ||
        (demande.prenom && demande.prenom.toLowerCase().includes(termeLower)) ||
        (demande.type && demande.type.toLowerCase().includes(termeLower))
      );
    }
    
    if (filtreStatut !== "Tous") {
      resultats = resultats.filter(demande => demande.statut === filtreStatut);
    }
    
    setDemandesFiltrees(resultats);
  }, [recherche, filtreStatut, demandes]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  const calculerPeriode = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 'N/A';
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  const calculerJoursConges = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 0;
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

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

  const ouvrirModal = (demande) => {
    setDemandeSelected(demande);
    setModalVisible(true);
  };

  const fermerModal = () => {
    setModalVisible(false);
    setDemandeSelected(null);
  };

  // Alternative approach - directly send the decrement value and let the backend handle the calculation
  const updateSoldeConge = async (idPersonnel, joursConges) => {
    try {
      const response = await fetch(`/updatepersonnel/${idPersonnel}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          decrementSolde: joursConges
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Échec de la mise à jour du solde");
      }
      
      return true;
    } catch (err) {
      console.error('Error in updateSoldeConge:', err);
      throw err; // Propager l'erreur pour la gérer dans handleStatusUpdate
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const demandeToUpdate = demandes.find(demande => demande._id === id);
      if (!demandeToUpdate) throw new Error('Demande non trouvée');
  
      if (newStatus === "Approuvée" && demandeToUpdate.idpersonnel) {
        const joursConges = calculerJoursConges(demandeToUpdate.DateDebut, demandeToUpdate.DateFin);
        
        try {
          await updateSoldeConge(demandeToUpdate.idpersonnel, joursConges);
        } catch (soldeError) {
          // Annuler l'approbation si la mise à jour du solde échoue
          throw new Error(`Impossible de mettre à jour le solde: ${soldeError.message}`);
        }
      }
  
      const response = await fetch(`/updatedemandeconge/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut: newStatus })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour de la demande');
      }
      
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
      console.error("Erreur complète:", err);
    }
  };

  const handleApprove = (id) => {
    handleStatusUpdate(id, 'Approuvée');
  };

  const handleReject = (id) => {
    handleStatusUpdate(id, 'Rejetée');
  };

  const renderStatus = (status) => {
    switch (status) {
      case "Approuvée":
        return (
          <div className="gdc-status-badge gdc-status-approved">
            <CheckCircle2 size={16} />
            <span>Approuvé</span>
          </div>
        );
      case "En attente":
        return (
          <div className="gdc-status-badge gdc-status-pending">
            <Clock size={16} />
            <span>En attente</span>
          </div>
        );
      case "Rejetée":
        return (
          <div className="gdc-status-badge gdc-status-rejected">
            <XCircle size={16} />
            <span>Refusé</span>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTypeConge = (type) => {
    switch (type) {
      case "Annuel":
        return (
          <span className="gdc-badge gdc-badge-annuel">
            {type}
          </span>
        );
      case "Maladie":
        return (
          <span className="gdc-badge gdc-badge-maladie">
            {type}
          </span>
        );
      case "Exceptionnel":
        return (
          <span className="gdc-badge gdc-badge-exceptionnel">
            {type}
          </span>
        );
      case "Maternité":
        return (
          <span className="gdc-badge gdc-badge-maternite">
            {type}
          </span>
        );
      default:
        return (
          <span className="gdc-badge">
            {type}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <>
        <style>{encapsulatedStyles}</style>
        <div className="gdc-loading">Chargement des demandes de congé...</div>
      </>
    );
  }

  return (
    <>
      <style>{encapsulatedStyles}</style>
      
      <div className="gdc-container">
        <div className="gdc-header-section">
          <h1 className="gdc-title">
            Gestion des Demandes de Congé
          </h1>
          
          <div className="gdc-search-filter-container">
            <div className="gdc-search-container">
              <div className="gdc-search-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="gdc-search-input"
                placeholder="Rechercher par nom, prénom ou type..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>
            
            <div className="gdc-filter-container">
              <select
                className="gdc-filter-select"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Approuvée">Approuvée</option>
                <option value="Rejetée">Rejetée</option>
              </select>
              <div className="gdc-filter-icon">
                <Filter size={18} />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="gdc-error">
            {error}
          </div>
        )}

        <div className="gdc-table-container">
          <table className="gdc-table">
            <thead>
              <tr>
                <th className="gdc-th">Nom</th>
                <th className="gdc-th">Prénom</th>
                <th className="gdc-th">Date début</th>
                <th className="gdc-th">Date fin</th>
                <th className="gdc-th">Période</th>
                
                <th className="gdc-th">Statut</th>
                <th className="gdc-th">Motif</th>
                <th className="gdc-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandesFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="gdc-td" style={{ textAlign: 'center' }}>
                    Aucune demande de congé trouvée
                  </td>
                </tr>
              ) : (
                demandesFiltrees.map((demande) => (
                  <tr key={demande._id} className="gdc-tr">
                    <td className="gdc-td">
                      <div className="gdc-employee-name">
                        {demande.nom}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-employee-name">
                        {demande.prenom}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-date">
                        {formatDate(demande.DateDebut)}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-date">
                        {formatDate(demande.DateFin)}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-period">
                        {calculerPeriode(demande.DateDebut, demande.DateFin)}
                      </div>
                    </td>
                  
                    <td className="gdc-td">
                      {renderStatus(demande.statut)}
                    </td>
                    <td className="gdc-td">
                      <button
                        className="gdc-view-button"
                        onClick={() => ouvrirModal(demande)}
                      >
                        <Eye size={14} />
                        <span>Voir motif</span>
                      </button>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-actions">
                        {demande.statut === "En attente" && (
                          <>
                            <button 
                              className="gdc-action-button gdc-action-button-approve" 
                              onClick={() => handleApprove(demande._id)}
                              title="Approuver"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="gdc-action-button gdc-action-button-reject" 
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
        
        <div className="gdc-footer">
          <div className="gdc-count">
            <CheckCircle2 className="gdc-count-icon" size={16} />
            <span>Affichage de {demandesFiltrees.length} sur {demandes.length} demandes</span>
          </div>
          
        </div>
      </div>

      {modalVisible && demandeSelected && (
        <div className="gdc-modal-overlay" onClick={fermerModal}>
          <div className="gdc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gdc-modal-header">
              <h3 className="gdc-modal-title">Détails de la demande</h3>
              <button className="gdc-modal-close" onClick={fermerModal}>
                <X size={20} />
              </button>
            </div>
            <div className="gdc-modal-body">
              <div className="gdc-modal-info-grid">
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Nom</span>
                  <span className="gdc-modal-info-value">
                    {demandeSelected.nom}
                  </span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Prénom</span>
                  <span className="gdc-modal-info-value">
                    {demandeSelected.prenom}
                  </span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Email</span>
                  <span className="gdc-modal-info-value">
                    {demandeSelected.email || "N/A"}
                  </span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Date début</span>
                  <span className="gdc-modal-info-value">{formatDate(demandeSelected.DateDebut)}</span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Date fin</span>
                  <span className="gdc-modal-info-value">{formatDate(demandeSelected.DateFin)}</span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Période</span>
                  <span className="gdc-modal-info-value">
                    {calculerPeriode(demandeSelected.DateDebut, demandeSelected.DateFin)}
                  </span>
                </div>
               
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Statut</span>
                  <span className="gdc-modal-info-value">
                    {renderStatus(demandeSelected.statut)}
                  </span>
                </div>
              </div>

              <div className="gdc-modal-section">
                <h4 className="gdc-modal-section-title">Motif de la demande</h4>
                <div className="gdc-modal-section-content">
                  {demandeSelected.motif}
                </div>
              </div>
            </div>
            <div className="gdc-modal-footer">
              <button className="gdc-modal-button gdc-modal-button-secondary" onClick={fermerModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}