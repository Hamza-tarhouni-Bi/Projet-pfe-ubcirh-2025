import { useState, useEffect } from "react";
import { Search, AlertCircle, Check, X, Eye } from "lucide-react";

// CSS encapsulé avec préfixe "gdc-" (Gestion Demandes Congé)
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
  
  .gdc-search-container {
    position: relative;
    margin-bottom: 1rem;
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
  
  .gdc-employee-dept {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
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
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }
  
  .gdc-status-approved {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .gdc-status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .gdc-status-rejected {
    background-color: #fee2e2;
    color: #b91c1c;
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
  
  .gdc-view-button:focus {
    outline: none;
    border-color: #14b8a6;
    ring: 2px solid #14b8a6;
  }
  
  .gdc-motif-popup {
    position: absolute;
    z-index: 10;
    margin-top: 0.5rem;
    width: 18rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    padding: 1rem;
    font-size: 0.875rem;
    color: #374151;
  }
  
  .gdc-motif-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #111827;
  }
  
  .gdc-motif-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #4b5563;
  }
  
  .gdc-response-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
    color: #111827;
  }
  
  .gdc-response-text {
    font-style: italic;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #4b5563;
  }
  
  .gdc-footer {
    padding: 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Styles pour les actions */
  .gdc-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .gdc-action-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 0.375rem;
    color: #6b7280;
    background-color: white;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .gdc-action-button:hover {
    background-color: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
  
  .gdc-action-button-edit:hover {
    color: #2563eb;
    background-color: #eff6ff;
    border-color: #bfdbfe;
  }
  
  .gdc-action-button-approve {
    color: #047857;
  }
  
  .gdc-action-button-approve:hover {
    color: #047857;
    background-color: #ecfdf5;
    border-color: #a7f3d0;
  }
  
  .gdc-action-button-reject {
    color: #b91c1c;
  }
  
  .gdc-action-button-reject:hover {
    color: #dc2626;
    background-color: #fef2f2;
    border-color: #fecaca;
  }
  
  .gdc-action-button-more {
    position: relative;
  }
  
  /* Styles pour le modal */
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
    gap: 0.5rem;
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
  
  .gdc-modal-button-primary {
    background-color: #14b8a6;
    color: white;
    border: 1px solid transparent;
  }
  
  .gdc-modal-button-primary:hover {
    background-color: #0d9488;
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
`;

export default function GestionConges() {
  const [demandes, setDemandes] = useState([]);
  const [demandesFiltrees, setDemandesFiltrees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [demandeSelected, setDemandeSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les demandes depuis l'API
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

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Calculer la période entre deux dates
  const calculerPeriode = (dateDebut, dateFin) => {
    if (!dateDebut || !dateFin) return 'N/A';
    
    const debut = new Date(dateDebut);
    const fin = new Date(dateFin);
    const diffTime = Math.abs(fin - debut);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  };

  // Filtrage des demandes basé sur la recherche
  const filtrerDemandes = (terme) => {
    setRecherche(terme);
    if (!terme.trim()) {
      setDemandesFiltrees(demandes);
      return;
    }
    
    const termeLower = terme.toLowerCase();
    const resultats = demandes.filter(demande => {
      return (
        (demande.nom && demande.nom.toLowerCase().includes(termeLower)) ||
        (demande.prenom && demande.prenom.toLowerCase().includes(termeLower)) ||
        (demande.type && demande.type.toLowerCase().includes(termeLower))
      );
    });
    
    setDemandesFiltrees(resultats);
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

  // Fermer le modal si on clique à l'extérieur
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        fermerModal();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Actions des boutons 
  const handleApprove = async (id) => {
    try {
      const response = await fetch(`/demandeConge/${id}/approve`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'approbation');
      }
      
      // Mise à jour de l'état local
      const demandesUpdated = demandes.map(demande => {
        if (demande._id === id) {
          return { ...demande, statut: 'Approuvée' };
        }
        return demande;
      });
      
      setDemandes(demandesUpdated);
      setDemandesFiltrees(
        demandesUpdated.filter(demande => {
          if (recherche.trim() === "") return true;
          
          const termeLower = recherche.toLowerCase();
          return (
            (demande.nom && demande.nom.toLowerCase().includes(termeLower)) ||
            (demande.prenom && demande.prenom.toLowerCase().includes(termeLower)) ||
            (demande.type && demande.type.toLowerCase().includes(termeLower))
          );
        })
      );
      
      alert(`La demande de congé a été approuvée.`);
    } catch (err) {
      console.error("Erreur lors de l'approbation:", err);
      alert("Erreur lors de l'approbation de la demande.");
    }
  };

  const handleReject = async (id) => {
    try {
      const response = await fetch(`/demandeConge/${id}/reject`, {
        method: 'PUT'
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors du refus');
      }
      
      // Mise à jour de l'état local
      const demandesUpdated = demandes.map(demande => {
        if (demande._id === id) {
          return { ...demande, statut: 'Rejetée' };
        }
        return demande;
      });
      
      setDemandes(demandesUpdated);
      setDemandesFiltrees(
        demandesUpdated.filter(demande => {
          if (recherche.trim() === "") return true;
          
          const termeLower = recherche.toLowerCase();
          return (
            (demande.nom && demande.nom.toLowerCase().includes(termeLower)) ||
            (demande.prenom && demande.prenom.toLowerCase().includes(termeLower)) ||
            (demande.type && demande.type.toLowerCase().includes(termeLower))
          );
        })
      );
      
      alert(`La demande de congé a été refusée.`);
    } catch (err) {
      console.error("Erreur lors du refus:", err);
      alert("Erreur lors du refus de la demande.");
    }
  };

  // Rendu du statut avec l'icône appropriée
  const renderStatus = (status) => {
    switch (status) {
      case "Approuvée":
        return (
          <div className="gdc-status-badge gdc-status-approved">
            <Check size={14} />
            <span>Approuvé</span>
          </div>
        );
      case "En attente":
        return (
          <div className="gdc-status-badge gdc-status-pending">
            <AlertCircle size={14} />
            <span>En attente</span>
          </div>
        );
      case "Rejetée":
        return (
          <div className="gdc-status-badge gdc-status-rejected">
            <X size={14} />
            <span>Refusé</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Rendu du type de congé avec le badge approprié
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
      {/* Injection du CSS encapsulé */}
      <style>{encapsulatedStyles}</style>
      
      <div className="gdc-container">
        {/* En-tête et recherche */}
        <div className="gdc-header-section">
          <h1 className="gdc-title">
            Gestion des Demandes de Congé
          </h1>
          
          {/* Barre de recherche */}
          <div className="gdc-search-container">
            <div className="gdc-search-icon">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="gdc-search-input"
              placeholder="Rechercher par nom, prénom ou type..."
              value={recherche}
              onChange={(e) => filtrerDemandes(e.target.value)}
            />
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="gdc-error">
            {error}
          </div>
        )}

        {/* Tableau des demandes */}
        <div className="gdc-table-container">
          <table className="gdc-table">
            <thead>
              <tr>
                <th className="gdc-th">Nom</th>
                <th className="gdc-th">Prénom</th>
                <th className="gdc-th">Date début</th>
                <th className="gdc-th">Date fin</th>
                <th className="gdc-th">Période</th>
                <th className="gdc-th">Type</th>
                <th className="gdc-th">Statut</th>
                <th className="gdc-th">Motif</th>
                <th className="gdc-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandesFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="9" className="gdc-td" style={{ textAlign: 'center' }}>
                    {loading ? 'Chargement...' : 'Aucune demande de congé trouvée'}
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
                        {formatDate(demande.dateDebut)}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-date">
                        {formatDate(demande.dateFin)}
                      </div>
                    </td>
                    <td className="gdc-td">
                      <div className="gdc-period">
                        {calculerPeriode(demande.dateDebut, demande.dateFin)}
                      </div>
                    </td>
                    <td className="gdc-td">
                      {renderTypeConge(demande.type)}
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
        
        {/* Information sur les résultats */}
        <div className="gdc-footer">
          Affichage de {demandesFiltrees.length} sur {demandes.length} demandes de congé
        </div>
      </div>

      {/* Modal pour afficher le détail de la demande */}
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
                  <span className="gdc-modal-info-value">{formatDate(demandeSelected.dateDebut)}</span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Date fin</span>
                  <span className="gdc-modal-info-value">{formatDate(demandeSelected.dateFin)}</span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Période</span>
                  <span className="gdc-modal-info-value">
                    {calculerPeriode(demandeSelected.dateDebut, demandeSelected.dateFin)}
                  </span>
                </div>
                <div className="gdc-modal-info-item">
                  <span className="gdc-modal-info-label">Type</span>
                  <span className="gdc-modal-info-value">
                    {renderTypeConge(demandeSelected.type)}
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
              {demandeSelected.statut === "En attente" && (
                <>
                  <button 
                    className="gdc-modal-button" 
                    onClick={() => {
                      handleReject(demandeSelected._id);
                      fermerModal();
                    }}
                    style={{ 
                      backgroundColor: "#fee2e2", 
                      color: "#b91c1c",
                      borderColor: "#fecaca" 
                    }}
                  >
                    Refuser
                  </button>
                  <button 
                    className="gdc-modal-button" 
                    onClick={() => {
                      handleApprove(demandeSelected._id);
                      fermerModal();
                    }}
                    style={{ 
                      backgroundColor: "#dcfce7", 
                      color: "#166534",
                      borderColor: "#86efac" 
                    }}
                  >
                    Approuver
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}