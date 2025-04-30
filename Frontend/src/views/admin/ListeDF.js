
import { useState, useEffect } from "react";
import { Search, AlertCircle, Check, X, Eye } from "lucide-react";
import axios from "axios"; // Assurez-vous d'installer axios: npm install axios

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
  
  .gav-search-container {
    position: relative;
    margin-bottom: 1rem;
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
    background-color: #f9fafb;
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
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }
  
  .gav-status-approved {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .gav-status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .gav-status-rejected {
    background-color: #fee2e2;
    color: #b91c1c;
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
  
  .gav-view-button:focus {
    outline: none;
    border-color: #14b8a6;
    ring: 2px solid #14b8a6;
  }
  
  .gav-motif-popup {
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
  
  .gav-motif-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #111827;
  }
  
  .gav-motif-text {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #4b5563;
  }
  
  .gav-response-title {
    font-size: 0.875rem;
    font-weight: 600;
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
    color: #111827;
  }
  
  .gav-response-text {
    font-style: italic;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #4b5563;
  }
  
  .gav-footer {
    padding: 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Styles pour les actions */
  .gav-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .gav-action-button {
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
  
  .gav-action-button:hover {
    background-color: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
  
  .gav-action-button-edit:hover {
    color: #2563eb;
    background-color: #eff6ff;
    border-color: #bfdbfe;
  }
  
  .gav-action-button-approve {
    color: #047857;
  }
  
  .gav-action-button-approve:hover {
    color: #047857;
    background-color: #ecfdf5;
    border-color: #a7f3d0;
  }
  
  .gav-action-button-reject {
    color: #b91c1c;
  }
  
  .gav-action-button-reject:hover {
    color: #dc2626;
    background-color: #fef2f2;
    border-color: #fecaca;
  }
  
  .gav-action-button-more {
    position: relative;
  }
  
  /* Styles pour le modal */
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
`;

export default function GestionAvances() {
  const [demandes, setDemandes] = useState([]);
  const [demandesFiltrees, setDemandesFiltrees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [demandeSelected, setDemandeSelected] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [personnelDetails, setPersonnelDetails] = useState({});

  // Charger les demandes d'avances depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/getdemandea');
      
        console.log(response.data.nom)
        
        if (response.data && response.data.success && response.data.data) {
          setDemandes(response.data.data);
          setDemandesFiltrees(response.data.data);
          
          // Récupérer les détails de personnel pour chaque demande
          const personnelIds = [...new Set(response.data.data.map(demande => demande.personnel))];
          await fetchPersonnelDetails(personnelIds);
        } else {
          throw new Error("Format de réponse incorrect");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des demandes:", err);
        setError("Impossible de charger les données. Veuillez réessayer plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  // Récupérer les détails du personnel
  const fetchPersonnelDetails = async (ids) => {
    try {
      const detailsObj = {};
      
      // Récupérer les détails de chaque employé en parallèle
      const promises = ids.map(async (id) => {
        try {
          const response = await axios.get(`/getpersonnel/${id}`);
          return { id, data: response.data };
        } catch (err) {
          console.error(`Erreur lors de la récupération des données pour l'employé ${id}:`, err);
          return { id, data: null };
        }
      });
  
      const results = await Promise.all(promises);
      
      // Construire l'objet de détails
      results.forEach(result => {
        if (result.data) {
          detailsObj[result.id] = result.data;
        }
      });
      
      setPersonnelDetails(detailsObj);
    } catch (err) {
      console.error("Erreur lors de la récupération des détails du personnel:", err);
    }
  };

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
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
      const personnel = personnelDetails[demande.personnel];
      if (!personnel) return false;
      
      return (
        (personnel.nom && personnel.nom.toLowerCase().includes(termeLower)) ||
        (personnel.prenom && personnel.prenom.toLowerCase().includes(termeLower)) ||
        demande.montant.toString().includes(terme)
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

  // Mapping des statuts API vers les statuts d'affichage
  const mapStatus = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return 'Complété';
      case 'pending':
        return 'En attente';
      case 'rejected':
        return 'Refusé';
      default:
        return status;
    }
  };

  // Actions des boutons 
  const handleApprove = async (id) => {
    try {
      // Implémentation à venir: appel API pour approuver la demande
      // Pour le moment, mise à jour de l'état local
      const demandesUpdated = demandes.map(demande => 
        demande._id === id 
          ? {...demande, status: 'approved', reponse: `Demande approuvée le ${new Date().toLocaleDateString('fr-FR')}`} 
          : demande
      );
      
      setDemandes(demandesUpdated);
      setDemandesFiltrees(
        demandesUpdated.filter(demande => {
          if (recherche.trim() === "") return true;
          
          const personnel = personnelDetails[demande.personnel];
          if (!personnel) return false;
          
          const termeLower = recherche.toLowerCase();
          return (
            personnel.nom.toLowerCase().includes(termeLower) ||
            personnel.prenom.toLowerCase().includes(termeLower) ||
            demande.montant.toString().includes(recherche)
          );
        })
      );
      
      alert(`La demande d'avance a été approuvée.`);
    } catch (err) {
      console.error("Erreur lors de l'approbation:", err);
      alert("Erreur lors de l'approbation de la demande.");
    }
  };

  const handleReject = async (id) => {
    try {
      // Implémentation à venir: appel API pour refuser la demande
      // Pour le moment, mise à jour de l'état local
      const demandesUpdated = demandes.map(demande => 
        demande._id === id 
          ? {...demande, status: 'rejected', reponse: `Demande refusée le ${new Date().toLocaleDateString('fr-FR')}`} 
          : demande
      );
      
      setDemandes(demandesUpdated);
      setDemandesFiltrees(
        demandesUpdated.filter(demande => {
          if (recherche.trim() === "") return true;
          
          const personnel = personnelDetails[demande.personnel];
          if (!personnel) return false;
          
          const termeLower = recherche.toLowerCase();
          return (
            personnel.nom.toLowerCase().includes(termeLower) ||
            personnel.prenom.toLowerCase().includes(termeLower) ||
            demande.montant.toString().includes(recherche)
          );
        })
      );
      
      alert(`La demande d'avance a été refusée.`);
    } catch (err) {
      console.error("Erreur lors du refus:", err);
      alert("Erreur lors du refus de la demande.");
    }
  };

  // Rendu du statut avec l'icône appropriée
  const renderStatus = (status) => {
    const displayStatus = mapStatus(status);
    
    switch (displayStatus) {
      case "Complété":
        return (
          <div className="gav-status-badge gav-status-approved">
            <Check size={14} />
            <span>Approuvé</span>
          </div>
        );
      case "En attente":
        return (
          <div className="gav-status-badge gav-status-pending">
            <AlertCircle size={14} />
            <span>En attente</span>
          </div>
        );
      case "Refusé":
        return (
          <div className="gav-status-badge gav-status-rejected">
            <X size={14} />
            <span>Refusé</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Afficher l'employé avec les détails récupérés
  const renderEmploye = (personnelId) => {
    const personnel = personnelDetails[personnelId];
    
    if (!personnel) {
      return (
        <>
          <div className="gav-employee-name">Chargement...</div>
          <div className="gav-employee-dept">...</div>
        </>
      );
    }
    
    return (
      <>
        <div className="gav-employee-name">
          {personnel.prenom} {personnel.nom}
        </div>
        <div className="gav-employee-dept">{personnel.role || "N/A"}</div>
      </>
    );
  };

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
          
          {/* Barre de recherche */}
          <div className="gav-search-container">
            <div className="gav-search-icon">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="gav-search-input"
              placeholder="Rechercher par nom ou montant..."
              value={recherche}
              onChange={(e) => filtrerDemandes(e.target.value)}
            />
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="gav-error">
            {error}
          </div>
        )}

        {/* Indicateur de chargement */}
        {loading ? (
          <div className="gav-loading">
            Chargement des données...
          </div>
        ) : (
          <>
            {/* Tableau des demandes */}
            <div className="gav-table-container">
              <table className="gav-table">
                <thead>
                  <tr>
                    <th className="gav-th">Employé</th>
                    <th className="gav-th">Montant</th>
                    <th className="gav-th">Type</th>
                    <th className="gav-th">Statut</th>
                    <th className="gav-th">Motif</th>
                    <th className="gav-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demandesFiltrees.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="gav-td" style={{ textAlign: 'center' }}>
                        Aucune demande d'avance trouvée
                      </td>
                    </tr>
                  ) : (
                    demandesFiltrees.map((demande) => (
                      <tr key={demande._id} className="gav-tr">
                        <td className="gav-td">
                          {renderEmploye(demande.personnel)}
                        </td>
                        <td className="gav-td">
                          <div className="gav-amount">
                            {demande.montant} €
                          </div>
                          <div className="gav-date">{formatDate(demande.createdAt)}</div>
                        </td>
                        <td className="gav-td">
                          <span className={`gav-badge ${demande.type === "urgent" ? "gav-badge-urgent" : "gav-badge-standard"}`}>
                            {demande.type === "urgent" ? "Urgente" : "Standard"}
                          </span>
                        </td>
                        <td className="gav-td">
                          {renderStatus(demande.status)}
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
                            {mapStatus(demande.status) === "En attente" && (
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
            
            {/* Information sur les résultats */}
            <div className="gav-footer">
              Affichage de {demandesFiltrees.length} sur {demandes.length} demandes d'avance
            </div>
          </>
        )}
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
                  <span className="gav-modal-info-label">Employé</span>
                  <span className="gav-modal-info-value">
                    {personnelDetails[demandeSelected.personnel] ? 
                      `${personnelDetails[demandeSelected.personnel].prenom} ${personnelDetails[demandeSelected.personnel].nom}` :
                      "Chargement..."}
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Département</span>
                  <span className="gav-modal-info-value">
                    {personnelDetails[demandeSelected.personnel]?.role || "N/A"}
                  </span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Montant</span>
                  <span className="gav-modal-info-value">{demandeSelected.montant} €</span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Date de demande</span>
                  <span className="gav-modal-info-value">{formatDate(demandeSelected.createdAt)}</span>
                </div>
                <div className="gav-modal-info-item">
                  <span className="gav-modal-info-label">Type</span>
                  <span className="gav-modal-info-value">
                    <span className={`gav-badge ${demandeSelected.typeDemande === "Urgente" ? "gav-badge-urgent" : "gav-badge-standard"}`}>
                      {demandeSelected.typeDemande}
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

              {demandeSelected.reponse && (
                <div className="gav-modal-section">
                  <h4 className="gav-modal-section-title">Réponse à la demande</h4>
                  <div className="gav-modal-section-content">
                    {demandeSelected.reponse}
                  </div>
                </div>
              )}
            </div>
            <div className="gav-modal-footer">
              <button className="gav-modal-button gav-modal-button-secondary" onClick={fermerModal}>
                Fermer
              </button>
              {demandeSelected.statut === "En attente" && (
                <>
                  <button 
                    className="gav-modal-button gav-modal-button-reject" 
                    onClick={() => {
                      handleReject(demandeSelected.id);
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
                    className="gav-modal-button gav-modal-button-primary" 
                    onClick={() => {
                      handleApprove(demandeSelected.id);
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