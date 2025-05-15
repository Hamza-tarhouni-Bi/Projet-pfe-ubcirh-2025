import { useState, useEffect } from "react";
import { Search, AlertCircle, Check, X, Filter } from "lucide-react";
import axios from "axios";

const encapsulatedStyles = `
  .gf-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  
  .gf-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gf-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: #1f2937;
  }
  
  .gf-search-filter-container {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .gf-search-container {
    position: relative;
    flex-grow: 1;
  }
  
  .gf-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .gf-search-input {
    width: 100%;
    padding: 0.5rem 0.75rem 0.5rem 2.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }
  
  .gf-search-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gf-filter-container {
    position: relative;
    min-width: 180px;
  }
  
  .gf-filter-select {
    appearance: none;
    width: 100%;
    padding: 0.5rem 2.5rem 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    cursor: pointer;
  }
  
  .gf-filter-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    pointer-events: none;
  }
  
  .gf-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gf-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gf-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f5f5f5;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gf-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gf-tr {
    transition: background-color 0.2s ease;
  }
  
  .gf-tr:hover {
    background-color: #f9fafb;
  }
  
  .gf-nom {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gf-prenom {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gf-formation-titre {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .gf-date {
    font-size: 0.75rem;
    color: #6b7280;
    margin-top: 0.25rem;
  }
  
  .gf-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gf-badge-obligatoire {
    background-color: #dbeafe;
    color: #1e40af;
  }
  
  .gf-badge-optionnel {
    background-color: #ede9fe;
    color: #5b21b6;
  }
  
  .gf-status-badge {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }
  
  .gf-status-accepte {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .gf-status-en-cours {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .gf-status-refuse {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .gf-view-button {
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
  
  .gf-view-button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .gf-view-button:focus {
    outline: none;
    border-color: #14b8a6;
    ring: 2px solid #14b8a6;
  }
  
  .gf-footer {
    padding: 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  /* Styles pour les actions */
  .gf-actions {
    display: flex;
    gap: 0.5rem;
  }
  
  .gf-action-button {
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    margin-right: 0.5rem;
  }

  .gf-action-button-accepter {
    background-color: #d1fae5;
    color: #059669;
  }

  .gf-action-button-accepter:hover {
    background-color: #a7f3d0;
  }

  .gf-action-button-refuser {
    background-color: #fee2e2;
    color: #dc2626;
  }

  .gf-action-button-refuser:hover {
    background-color: #fecaca;
  }
  
  .gf-loading {
    text-align: center;
    padding: 1rem;
    color: #6b7280;
  }

  .gf-id {
    font-size: 0.75rem;
    color: #6b7280;
    font-family: monospace;
  }

  /* Toast styles */
  .gf-toast-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }

  .gf-toast {
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

  .gf-toast-success {
    background-color: #10b981;
  }

  .gf-toast-error {
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
  .gf-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
  }
  
  .gf-pagination-info {
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .gf-pagination-controls {
    display: flex;
    gap: 0.5rem;
  }
  
  .gf-pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    background-color: white;
    color: #334155;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  .gf-pagination-button:hover {
    background-color: #f1f5f9;
  }
  
  .gf-pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .gf-pagination-button.active {
    background-color: #14b8a6;
    color: white;
    border-color: #14b8a6;
  }
`;

const GestionFormations = () => {
  const [demandes, setDemandes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const response = await axios.get('/alldemandeformation');
        setDemandes(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des demandes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  const filteredDemandes = demandes.filter(demande => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (
      demande.nom.toLowerCase().includes(searchLower) ||
      demande.prenom.toLowerCase().includes(searchLower) ||
      demande.nomFormation.toLowerCase().includes(searchLower) ||
      demande._id.toLowerCase().includes(searchLower)
    );
    
    const matchesStatus = filtreStatut === "Tous" || 
      (filtreStatut === "Approuvée" && demande.statut === "Approuvée") ||
      (filtreStatut === "En attente" && demande.statut === "En attente") ||
      (filtreStatut === "Rejetée" && demande.statut === "Rejetée");
    
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDemandes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDemandes.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const updateStatut = async (_id, newStatus) => {
    try {
      const statusMap = {
        accepte: 'Approuvée',
        refuse: 'Rejetée',
        en_cours: 'En attente'
      };

      const backendStatus = statusMap[newStatus];
      if (!backendStatus) throw new Error("Statut invalide");

      // Trouver la demande complète
      const demande = demandes.find(d => d._id === _id);
      if (!demande) throw new Error("Demande introuvable");

      // Mettre à jour le statut de la demande
      await axios.put(`/updatedemandeformation/${_id}`, { statut: backendStatus });

      // Si la demande est acceptée, incrémenter le nombre d'inscrits
      if (newStatus === 'accepte' && demande.idFormation) {
        try {
          await axios.put(`/updatenbinscrit/${demande.idFormation}`, {
            action: 'increment'
          });
        } catch (err) {
          console.error("Erreur lors de la mise à jour du nombre d'inscrits:", err);
          throw new Error("La demande a été acceptée mais l'incrémentation du nombre d'inscrits a échoué");
        }
      }

      // Mettre à jour le state
      setDemandes(prev => prev.map(item => 
        item._id === _id ? { ...item, statut: backendStatus } : item
      ));

      showToast(`Statut mis à jour avec succès ! Demande ${newStatus === 'accepte' ? 'acceptée' : 'refusée'}`);
    } catch (err) {
      console.error("Erreur de mise à jour:", err);
      showToast("Échec de la mise à jour: " + (err.response?.data?.message || err.message), 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approuvée':
        return (
          <div className="gf-status-badge gf-status-accepte">
            <Check size={14} />
            <span>Accepté</span>
          </div>
        );
      case 'En attente':
        return (
          <div className="gf-status-badge gf-status-en-cours">
            <AlertCircle size={14} />
            <span>En cours</span>
          </div>
        );
      case 'Rejetée':
        return (
          <div className="gf-status-badge gf-status-refuse">
            <X size={14} />
            <span>Refusé</span>
          </div>
        );
      default:
        return <div>{status}</div>;
    }
  };

  return (
    <>
      <style>{encapsulatedStyles}</style>
      
      <div className="gf-container">
        <div className="gf-header-section">
          <h1 className="gf-title">Gestion des Demandes de Formation</h1>
          
          <div className="gf-search-filter-container">
            <div className="gf-search-container">
              <div className="gf-search-icon">
                <Search size={18} />
              </div>
              <input
                type="text"
                className="gf-search-input"
                placeholder="Rechercher par ID, nom, prénom ou formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="gf-filter-container">
              <select
                className="gf-filter-select"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="Approuvée">Approuvée</option>
                <option value="Rejetée">Rejetée</option>
              </select>
              <div className="gf-filter-icon">
                <Filter size={18} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="gf-loading">Chargement en cours...</div>
        ) : error ? (
          <div className="gf-loading" style={{ color: '#b91c1c' }}>{error}</div>
        ) : (
          <>
            <div className="gf-table-container">
              <table className="gf-table">
                <thead>
                  <tr>
                    <th className="gf-th">Nom</th>
                    <th className="gf-th">Prénom</th>
                    <th className="gf-th">Formation</th>
                    <th className="gf-th">Statut</th>
                    <th className="gf-th">Date</th>
                    <th className="gf-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="gf-td" style={{ textAlign: 'center' }}>
                        Aucune demande trouvée
                      </td>
                    </tr>
                  ) : (
                    currentItems.map(demande => (
                      <tr key={demande._id} className="gf-tr">
                        <td className="gf-td">
                          <div className="gf-nom">{demande.nom}</div>
                        </td>
                        <td className="gf-td">
                          <div className="gf-prenom">{demande.prenom}</div>
                        </td>
                        <td className="gf-td">
                          <div className="gf-formation-titre">{demande.nomFormation}</div>
                        </td>
                        <td className="gf-td">
                          {renderStatusBadge(demande.statut)}
                        </td>
                        <td className="gf-td">
                          <div className="gf-date">{formatDate(demande.dateDemande)}</div>
                        </td>
                        <td className="gf-td">
                          {demande.statut === 'En attente' && (
                            <div className="gf-actions">
                              <button
                                className="gf-action-button gf-action-button-accepter"
                                onClick={() => updateStatut(demande._id, 'accepte')}
                                title="Accepter"
                              >
                                <Check size={16} />
                              </button>
                              <button
                                className="gf-action-button gf-action-button-refuser"
                                onClick={() => updateStatut(demande._id, 'refuse')}
                                title="Refuser"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="gf-pagination">
              <div className="gf-pagination-info">
                Affichage de {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredDemandes.length)} sur {filteredDemandes.length} demandes
              </div>
              <div className="gf-pagination-controls">
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  disabled={currentPage === 1}
                  className="gf-pagination-button"
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`gf-pagination-button ${currentPage === number ? 'active' : ''}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="gf-pagination-button"
                >
                  Suivant
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Toast notifications */}
      <div className="gf-toast-container">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className={`gf-toast gf-toast-${toast.type}`}
            onClick={() => removeToast(toast.id)}
          >
            {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
};

export default GestionFormations;