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

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  // Récupérer les formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/getformation');
        
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

  // Filtrer les formations
  useEffect(() => {
    let result = formations.filter(formation => 
      formation.statut === 'Programmée' && 
      formation.inscrits < formation.places
    );
    
    if (searchTerm) {
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredFormations(result);
  }, [formations, searchTerm]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormations = filteredFormations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleRequestFormation = async (formation) => {
    if (!userInfo) {
      setError("Veuillez vous reconnecter");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      return;
    }
  
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/adddemandeformation', {
        nom: userInfo.nom || '',
        prenom: userInfo.prenom || '',
        email: userInfo.email || '',
        nomFormation: formation.titre || '',
        idFormation: formation.id || '',  // Added formation ID
        idUser: userInfo._id || ''        // Added user ID if needed
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      setConfirmationMessage(`Demande envoyée pour "${formation.titre}" !`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
      
    } catch (err) {
      console.error("Erreur:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Erreur lors de l'envoi");
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
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

  if (error) {
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
                <span className={`places-badge ${formation.places - formation.inscrits <= 3 ? 'low-places' : ''}`}>
                  {formation.places - formation.inscrits} places restantes
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
                  className="request-btn"
                  onClick={() => handleRequestFormation(formation)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Demander cette formation'}
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

<style>
        {`
        /* Styles généraux */
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: '#334155';
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
          position: relative;
          display: inline-block;
          padding-bottom: 15px;
        }

        .header h1::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 4px;
          background: linear-gradient(90deg, #1e40af, #3b82f6);
          border-radius: 2px;
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-items: center;
        }

        .search-container {
          flex: 1;
          min-width: 200px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 12px 20px 12px 45px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        .search-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
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
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .formation-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .formation-header {
          padding: 20px;
          background-color: #ebf5ff;
          border-bottom: 1px solid #dbeafe;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .formation-header h3 {
          margin: 0;
          color: #1e40af;
          font-size: 1.2rem;
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
          flex-grow: 1;
        }

        .formation-description {
          margin-top: 0;
          margin-bottom: 20px;
          color: #4b5563;
          line-height: 1.5;
        }

        .formation-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .detail-icon {
          font-size: 1.2rem;
          color: #6b7280;
        }

        .formation-footer {
          padding: 15px 20px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .request-btn {
          width: 100%;
          padding: 10px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .request-btn:hover:not(:disabled) {
          background-color: #1d4ed8;
        }
        
        .request-btn.disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }
        
        .request-btn:disabled {
          background-color: #9ca3af;
          cursor: not-allowed;
        }

        .no-formations {
          grid-column: 1 / -1;
          padding: 40px;
          text-align: center;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .no-formations p {
          color: #6b7280;
          font-size: 1.1rem;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          margin-top: 30px;
          margin-bottom: 30px;
        }

        .page-btn {
          padding: 8px 16px;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-btn:hover:not(:disabled) {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #4b5563;
          font-weight: 500;
        }

        /* Toast de confirmation */
        .toast-message {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 12px;
          padding: 5px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          animation: slideUp 0.3s ease, fadeOut 0.5s ease 2.5s;
          min-width: 300px;
          max-width: 600px;
        }

        .toast-message.success {
          background-color: #34d399;
          color: white;
        }

        .toast-message.error {
          background-color: #f87171;
          color: white;
        }

        .toast-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px 20px;
        }

        .toast-icon {
          font-size: 1.2rem;
          background-color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .toast-message.success .toast-icon {
          color: #34d399;
        }

        .toast-message.error .toast-icon {
          color: #f87171;
        }

        .toast-content p {
          margin: 0;
          flex-grow: 1;
        }

        /* Historique des demandes */
        .demandes-section {
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          margin-top: 40px;
        }

        .demandes-section h2 {
          color: #1e40af;
          margin-top: 0;
          margin-bottom: 20px;
          font-size: 1.5rem;
        }

        .demandes-list table {
          width: 100%;
          border-collapse: collapse;
        }

        .demandes-list th {
          text-align: left;
          padding: 12px;
          border-bottom: 2px solid #e5e7eb;
          color: #4b5563;
          font-weight: 600;
        }

        .demandes-list td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-badge.en-attente {
          background-color: #fef3c7;
          color: #92400e;
        }

        .status-badge.approuvée {
          background-color: #d1fae5;
          color: #065f46;
        }

        .status-badge.rejetée {
          background-color: #fee2e2;
          color: #b91c1c;
        }

        /* Animations */
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

        /* Responsive */
        @media (max-width: 768px) {
          .formations-grid {
            grid-template-columns: 1fr;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .toast-message {
            width: 90%;
          }
        }
        `}
      </style>
    </div>
  );
}

export default CardDemandeFormation;