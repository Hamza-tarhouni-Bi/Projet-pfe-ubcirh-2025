import { useState, useEffect } from 'react';
import axios from 'axios';

function CardDemandeFormation() {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [demandesEnvoyees, setDemandesEnvoyees] = useState([]);
  const [demandesApprouvees, setDemandesApprouvees] = useState([]);

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserInfo(parsedData);
      
      // Charger les demandes existantes de l'utilisateur
      fetchUserDemandes(parsedData._id);
    }
  }, []);

  // Récupérer les formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/getformation');
        
        const formattedFormations = response.data.map(formation => ({
          id: formation._id,
          titre: formation.titre,
          description: formation.description,
          date: new Date(formation.date).toISOString().split('T')[0],
          duree: formation.durée,
          places: formation.nbplaces,
          inscrits: formation.nbinscrits,
          statut: formation.statut,
          placesRestantes: formation.nbplaces - formation.nbinscrits
        }));
        
        setFormations(formattedFormations);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors du chargement des formations");
        setLoading(false);
        console.error("Erreur lors de la récupération des formations:", err);
      }
    };

    fetchFormations();
  }, []);

  // Charger les demandes existantes de l'utilisateur
  const fetchUserDemandes = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/alldemandeformation', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Séparer les demandes en attente et approuvées
      const userPendingDemandes = response.data.filter(
        demande => demande.idUser === userId && demande.statut === 'En attente'
      );
      
      const userApprovedDemandes = response.data.filter(
        demande => demande.idUser === userId && demande.statut === 'Approuvée'
      );
      
      setDemandesEnvoyees(userPendingDemandes.map(d => d.idFormation));
      setDemandesApprouvees(userApprovedDemandes.map(d => d.idFormation));
    } catch (err) {
      console.error("Erreur lors de la récupération des demandes:", err);
    }
  };

  // Filtrer les formations
  useEffect(() => {
    let result = formations.filter(formation => 
      formation.statut === 'Programmée' && 
      formation.inscrits < formation.places &&
      !demandesApprouvees.includes(formation.id) // Exclure les formations approuvées
    );
    
    if (searchTerm) {
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFormations(result);
  }, [formations, searchTerm, demandesApprouvees]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormations = filteredFormations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const isFormationDemandee = (formationId) => {
    return demandesEnvoyees.includes(formationId);
  };

  const isFormationApprouvee = (formationId) => {
    return demandesApprouvees.includes(formationId);
  };

  const handleRequestFormation = async (formation) => {
    if (!userInfo) {
      setError("Veuillez vous reconnecter");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      return;
    }

    if (isFormationDemandee(formation.id) || isFormationApprouvee(formation.id)) {
      setError("Vous avez déjà une demande pour cette formation");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/adddemandeformation', {
        nom: userInfo.nom || '',
        prenom: userInfo.prenom || '',
        email: userInfo.email || '',
        nomFormation: formation.titre || '',
        idFormation: formation.id || '',
        idUser: userInfo._id || ''
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setDemandesEnvoyees(prev => [...prev, formation.id]);
      setConfirmationMessage(`Demande envoyée pour "${formation.titre}" !`);
      setError(null);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Erreur lors de l'envoi";
      setError(errorMessage);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      
      if (errorMessage.includes("déjà une demande en attente")) {
        setDemandesEnvoyees(prev => [...prev, formation.id]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des formations...</p>
      </div>
    );
  }

  if (error && !showConfirmation) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Catalogue de formations</h1>
        <p>Découvrez et inscrivez-vous aux formations disponibles</p>
      </div>

      <div className="filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Rechercher une formation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="search-icon">🔍</div>
        </div>
      </div>

      <div className="formations-grid">
        {currentFormations.length > 0 ? (
          currentFormations.map(formation => (
            <div key={formation.id} className="formation-card">
              <div className="formation-header">
                <h3>{formation.titre}</h3>
                <span className={`places-badge ${formation.placesRestantes <= 3 ? 'low-places' : ''}`}>
                  {formation.placesRestantes} places restantes
                </span>
              </div>
              
              <div className="formation-content">
                <p className="formation-description">{formation.description}</p>
                
                <div className="formation-details">
                  <div className="detail-item">
                    <span className="detail-icon">📅</span>
                    <span>{formatDate(formation.date)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">⏱️</span>
                    <span>{formation.duree} heures</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon">👥</span>
                    <span>{formation.inscrits}/{formation.places} participants</span>
                  </div>
                </div>
              </div>
              
              <div className="formation-footer">
                <button 
                  className={`request-btn ${
                    isFormationApprouvee(formation.id) ? 'demande-approuvee' : 
                    isFormationDemandee(formation.id) ? 'demande-envoyee' : ''
                  }`}
                  onClick={() => handleRequestFormation(formation)}
                  disabled={isSubmitting || isFormationDemandee(formation.id) || isFormationApprouvee(formation.id)}
                >
                  {isSubmitting ? 'Envoi en cours...' : 
                   isFormationApprouvee(formation.id) ? 'Inscription confirmée' :
                   isFormationDemandee(formation.id) ? 'Demande en attente' : 
                   'Demander cette formation'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-formations">
            <p>Aucune formation disponible ne correspond à vos critères.</p>
          </div>
        )}
      </div>

      {filteredFormations.length > 0 && (
        <div className="pagination">
          <button 
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Précédent
          </button>
          
          <div className="page-info">
            Page {currentPage} sur {totalPages}
          </div>
          
          <button 
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Suivant
          </button>
        </div>
      )}

      {showConfirmation && (
        <div className={`toast-message ${error ? 'error' : 'success'}`}>
          <div className="toast-content">
            <span className="toast-icon">{error ? '⚠️' : '✓'}</span>
            <p>{error || confirmationMessage}</p>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Styles généraux */
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8fafc;
          min-height: 100vh;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding: 20px 0;
        }

        .header h1 {
          color: #1e40af;
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        .header p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        /* Filtres */
        .filters {
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-bottom: 30px;
        }

        .search-container {
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
        }

        /* Grille de formations */
        .formations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 25px;
          margin-bottom: 30px;
        }

        .formation-card {
          background-color: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .formation-card:hover {
          transform: translateY(-5px);
        }

        .formation-header {
          padding: 20px;
          background-color: #ebf5ff;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .formation-header h3 {
          margin: 0;
          color: #1e40af;
        }

        .places-badge {
          background-color: #bfdbfe;
          color: #1e40af;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .places-badge.low-places {
          background-color: #fecaca;
          color: #b91c1c;
        }

        .formation-content {
          padding: 20px;
        }

        .formation-description {
          margin-bottom: 20px;
          color: #4b5563;
        }

        .formation-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .formation-footer {
          padding: 15px 20px;
          background-color: #f9fafb;
        }

        .request-btn {
          width: 100%;
          padding: 10px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .request-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
        }

        .request-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .request-btn.demande-envoyee {
          background-color: #f59e0b;
        }

        .request-btn.demande-approuvee {
          background-color: #10b981;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 30px;
        }

        .page-btn {
          padding: 8px 16px;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .page-btn:hover:not(:disabled) {
          background-color: #f3f4f6;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

     
.toast-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #34d399;
  color: white;
  border-radius: 6px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-size: 13px;
  animation: slideUp 0.3s ease, fadeOut 0.5s ease 2.5s;
  max-width: 90%;
  width: fit-content;
  min-width: auto;
  white-space: nowrap;
}


.toast-message.error {
  background-color: #f87171;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-icon {
  font-size: 16px;
}


        .toast-message.success {
          background-color: #34d399;
          color: white;
        }

        .toast-message.error {
  background-color: #f87171;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}


        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Error */
        .error-container {
          text-align: center;
          padding: 20px;
        }

        .error-message {
          color: #b91c1c;
          margin-bottom: 15px;
        }

        .retry-btn {
          padding: 8px 16px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .retry-btn:hover {
          background-color: #1d4ed8;
        }

        /* Aucune formation */
        .no-formations {
          text-align: center;
          padding: 40px;
          color: #6b7280;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
}

export default CardDemandeFormation;