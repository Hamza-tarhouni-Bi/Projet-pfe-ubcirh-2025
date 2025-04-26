import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Search, Check, X, Eye, Filter } from "lucide-react";
import axios from "axios";

// CSS encapsulé avec préfixe "gp-" (cohérent avec Gestion Personnel)
const encapsulatedStyles = `
  .gp-candidature-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .gp-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gp-search-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .gp-search-input {
    flex: 1;
    position: relative;
  }
  
  .gp-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }

  .gp-input-field {
    width: 100%;
    padding: 0.5rem 0.5rem 0.5rem 2rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-input-field:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gp-filter-dropdown {
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-filter-dropdown:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gp-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gp-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gp-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gp-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gp-tr:hover {
    background-color: #f9fafb;
  }
  
  .gp-status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gp-status-pending {
    background-color: #fef3c7;
    color: #d97706;
  }
  
  .gp-status-accepted {
    background-color: #d1fae5;
    color: #059669;
  }
  
  .gp-status-rejected {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  .gp-action-button {
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    margin-right: 0.5rem;
  }
  
  .gp-accept-button {
    background-color: #d1fae5;
    color: #059669;
  }
  
  .gp-accept-button:hover {
    background-color: #a7f3d0;
  }
  
  .gp-reject-button {
    background-color: #fee2e2;
    color: #dc2626;
  }
  
  .gp-reject-button:hover {
    background-color: #fecaca;
  }
  
  .gp-view-button {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .gp-view-button:hover {
    background-color: #bfdbfe;
  }
  
  .gp-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  
  .gp-modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
  }
  
  .gp-modal-container {
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    width: 100%;
    max-width: 28rem;
  }
  
  .gp-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .gp-modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .gp-modal-close {
    color: #6b7280;
    transition: color 0.2s ease;
  }
  
  .gp-modal-close:hover {
    color: #1f2937;
  }
  
  .gp-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  
  .gp-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .gp-btn-cancel:hover {
    background-color: #e5e7eb;
  }
  
  .gp-btn-confirm {
    background-color: #14b8a6;
    color: white;
  }
  
  .gp-btn-confirm:hover {
    background-color: #0d9488;
  }
  
  .gp-toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 1rem;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    z-index: 50;
  }
  
  .gp-toast-success {
    background-color: #10b981;
  }
  
  .gp-toast-error {
    background-color: #ef4444;
  }
  
  .gp-candidate-details {
    margin-bottom: 1.5rem;
  }
  
  .gp-detail-item {
    display: flex;
    margin-bottom: 0.75rem;
  }
  
  .gp-detail-label {
    font-weight: 500;
    color: #6b7280;
    width: 120px;
  }
  
  .gp-detail-value {
    color: #374151;
  }
  
  .gp-cv-download {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #3b82f6;
    font-weight: 500;
    margin-top: 1rem;
    text-decoration: none;
  }
  
  .gp-cv-download:hover {
    text-decoration: underline;
  }
`;

// Toast component for notifications
const Toast = ({ message, type, onClose }) => {
  const toastClass =
    type === "success"
      ? "gp-toast-success"
      : type === "error"
      ? "gp-toast-error"
      : "gp-toast-info";

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`gp-toast ${toastClass}`}>
      {type === "success" && <Check size={20} />}
      {type === "error" && <X size={20} />}
      <p>{message}</p>
    </div>
  );
};

export default function CardCandidature({ color = "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [candidatures, setCandidatures] = useState([]);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null);
  const [toast, setToast] = useState({ affiche: false, message: "", type: "" });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch candidatures on component mount
  useEffect(() => {
    fetchCandidatures();
  }, []);

  const fetchCandidatures = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/allcondidature");
    
      const formattedCandidatures = response.data.map(candidature => ({
        ...candidature,
        status: candidature.status || "pending",
        // Si le poste n'existe pas dans les données, attribuer une valeur par défaut
        poste: candidature.poste || "Non spécifié"
      }));
      setCandidatures(formattedCandidatures);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching candidatures:", error);
      afficherToast("Erreur lors du chargement des candidatures", "error");
      setIsLoading(false);
    }
  };

  const filteredCandidatures = candidatures
    .filter((candidature) => {
      // Filter by search term
      const searchMatch = 
        candidature.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidature.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (candidature.poste && candidature.poste.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status
      const statusMatch = 
        filterStatus === "all" || 
        candidature.status === filterStatus;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const afficherToast = (message, type) => {
    setToast({ affiche: true, message, type });
  };

  const fermerToast = () => {
    setToast({ ...toast, affiche: false });
  };

  const handleViewCandidature = (candidature) => {
    setSelectedCandidature(candidature);
    setIsViewModalOpen(true);
  };

  const handleStatusAction = (action, candidature) => {
    setSelectedCandidature(candidature);
    setStatusAction(action);
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      // Update the status in the API
      await axios.put(`/updatecondidature/${selectedCandidature._id}`, {
        status: statusAction
      });

      // Update local state
      const updatedCandidatures = candidatures.map((candidature) =>
        candidature._id === selectedCandidature._id
          ? { ...candidature, status: statusAction }
          : candidature
      );

      setCandidatures(updatedCandidatures);
      setIsStatusModalOpen(false);
      
      const actionText = statusAction === "accepted" ? "acceptée" : "refusée";
      afficherToast(`Candidature ${actionText} avec succès`, "success");
    } catch (error) {
      console.error("Error updating candidature status:", error);
      afficherToast("Erreur lors de la mise à jour du statut", "error");
    }
  };

  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'accepted':
        return <span className="gp-status-badge gp-status-accepted">Acceptée</span>;
      case 'rejected':
        return <span className="gp-status-badge gp-status-rejected">Refusée</span>;
      default:
        return <span className="gp-status-badge gp-status-pending">En attente</span>;
    }
  };

  return (
    <>
      <style>{encapsulatedStyles}</style>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
        <div className="gp-candidature-container">
          <div className="gp-header-section">
            <h1
              className="gp-modal-title"
              style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}
            >
              Liste des candidatures
            </h1>

            {/* Search and filter section */}
            <div className="gp-search-container">
              <div className="gp-search-input">
                <Search className="gp-search-icon" size={16} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, prénom, email ou poste..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="gp-input-field"
                />
              </div>
              <div>
                <select
                  className="gp-filter-dropdown"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="accepted">Acceptés</option>
                  <option value="rejected">Refusés</option>
                </select>
              </div>
            </div>

            {/* Candidatures table */}
            <div className="gp-table-container">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th className="gp-th">Nom</th>
                    <th className="gp-th">Prénom</th>
                    <th className="gp-th">Email</th>
                    <th className="gp-th">Poste</th>
                    <th className="gp-th">Téléphone</th>
                    <th className="gp-th">Date</th>
                    <th className="gp-th">Statut</th>
                    <th className="gp-th" style={{ textAlign: "center" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="8"
                        className="gp-td"
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "1.5rem 0",
                        }}
                      >
                        Chargement des candidatures...
                      </td>
                    </tr>
                  ) : filteredCandidatures.length > 0 ? (
                    filteredCandidatures.map((candidature) => (
                      <tr className="gp-tr" key={candidature._id}>
                        <td className="gp-td">{candidature.nom}</td>
                        <td className="gp-td">{candidature.prenom}</td>
                        <td className="gp-td">{candidature.email}</td>
                        <td className="gp-td">{candidature.poste}</td>
                        <td className="gp-td">{candidature.tel}</td>
                        <td className="gp-td">{formatDate(candidature.createdAt)}</td>
                        <td className="gp-td">
                          {getStatusBadge(candidature.status)}
                        </td>
                        <td className="gp-td">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              onClick={() => handleViewCandidature(candidature)}
                              className="gp-action-button gp-view-button"
                              title="Voir détails"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {candidature.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusAction("accepted", candidature)}
                                  className="gp-action-button gp-accept-button"
                                  title="Accepter"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleStatusAction("rejected", candidature)}
                                  className="gp-action-button gp-reject-button"
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
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="gp-td"
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "1.5rem 0",
                        }}
                      >
                        Aucune candidature trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="gp-pagination">
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Affichage de {filteredCandidatures.length} sur{" "}
                {candidatures.length} candidatures
              </div>
            </div>
          </div>
        </div>

        {/* View candidature details modal */}
        {isViewModalOpen && selectedCandidature && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container" style={{ maxWidth: "32rem" }}>
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Détails de la candidature</h2>
                <button onClick={() => setIsViewModalOpen(false)} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div className="gp-candidate-details">
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Nom:</span>
                  <span className="gp-detail-value">{selectedCandidature.nom}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Prénom:</span>
                  <span className="gp-detail-value">{selectedCandidature.prenom}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Email:</span>
                  <span className="gp-detail-value">{selectedCandidature.email}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Téléphone:</span>
                  <span className="gp-detail-value">{selectedCandidature.tel}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Poste:</span>
                  <span className="gp-detail-value">{selectedCandidature.poste}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Adresse:</span>
                  <span className="gp-detail-value">{selectedCandidature.adresse}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Date:</span>
                  <span className="gp-detail-value">{formatDate(selectedCandidature.createdAt)}</span>
                </div>
                <div className="gp-detail-item">
                  <span className="gp-detail-label">Statut:</span>
                  <span className="gp-detail-value">{getStatusBadge(selectedCandidature.status)}</span>
                </div>
                
                <a 
                  href={`http://localhost:5000/cv/${selectedCandidature.cv}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="gp-cv-download"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Télécharger le CV
                </a>
              </div>

              <div className="gp-modal-footer">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="gp-btn gp-btn-cancel"
                >
                  Fermer
                </button>
                
                {selectedCandidature.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleStatusAction("accepted", selectedCandidature);
                      }}
                      className="gp-btn gp-btn-confirm"
                      style={{ backgroundColor: "#059669" }}
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => {
                        setIsViewModalOpen(false);
                        handleStatusAction("rejected", selectedCandidature);
                      }}
                      className="gp-btn gp-btn-confirm"
                      style={{ backgroundColor: "#dc2626" }}
                    >
                      Refuser
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Confirm status change modal */}
        {isStatusModalOpen && selectedCandidature && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Confirmation</h2>
                <button onClick={() => setIsStatusModalOpen(false)} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div>
                <p style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
                  Êtes-vous sûr de vouloir {statusAction === "accepted" ? "accepter" : "refuser"} la candidature de{" "}
                  <strong>{selectedCandidature.nom} {selectedCandidature.prenom}</strong> pour le poste de <strong>{selectedCandidature.poste}</strong> ?
                </p>

                <div className="gp-modal-footer">
                  <button
                    onClick={() => setIsStatusModalOpen(false)}
                    className="gp-btn gp-btn-cancel"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleConfirmStatusChange}
                    className="gp-btn gp-btn-confirm"
                    style={{
                      backgroundColor: statusAction === "accepted" ? "#059669" : "#dc2626",
                    }}
                  >
                    {statusAction === "accepted" ? "Accepter" : "Refuser"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast notifications */}
        {toast.affiche && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={fermerToast}
          />
        )}
      </div>
    </>
  );
}

CardCandidature.propTypes = {
  color: PropTypes.string,
};