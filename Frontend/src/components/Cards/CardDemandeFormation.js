import { useState, useEffect } from 'react';
import axios from 'axios';

function CardDemandeFormation() {
  // État pour stocker les formations
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour le filtrage et la pagination
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);
  
  // États pour la demande de formation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    departement: '',
    justification: '',
    formation: null
  });
  
  // État pour afficher la confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [demandes, setDemandes] = useState([]);

  // Récupérer les formations depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/getformation');
        
        // Transformer les données pour correspondre à la structure attendue
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

  // Effet pour filtrer les formations
  useEffect(() => {
    let result = formations.filter(formation => 
      // Ne montrer que les formations programmées (pas complètes ou terminées)
      formation.statut === 'Programmée' && 
      // Vérifier qu'il reste des places
      formation.inscrits < formation.places
    );
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      result = result.filter(formation => {
        // Exemple de catégorisation basée sur les titres, peut être remplacé par une catégorisation réelle
        const title = formation.titre.toLowerCase();
        if (selectedCategory === 'tech') {
          return title.includes('react') || title.includes('excel') || title.includes('développement');
        }
        if (selectedCategory === 'management') {
          return title.includes('leadership') || title.includes('management');
        }
        if (selectedCategory === 'soft') {
          return title.includes('communication') || title.includes('rgpd');
        }
        return true;
      });
    }
    
    setFilteredFormations(result);
  }, [formations, searchTerm, selectedCategory]);

  // Calcul de la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFormations = filteredFormations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredFormations.length / itemsPerPage);

  // Formatage de la date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Gérer la demande d'inscription à une formation
  const handleRequestFormation = (formation) => {
    setSelectedFormation(formation);
    setFormData({...formData, formation: formation});
    setIsModalOpen(true);
  };

  // Gérer les changements dans le formulaire
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Créer un objet demande
    const newDemande = {
      id: Date.now(),
      ...formData,
      status: 'En attente',
      dateCreation: new Date().toISOString()
    };
    
    // Ajouter la demande à la liste
    setDemandes([...demandes, newDemande]);
    
    // Fermer le modal et montrer la confirmation
    setIsModalOpen(false);
    setShowConfirmation(true);
    
    // Réinitialiser le formulaire
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      departement: '',
      justification: '',
      formation: null
    });
    
    // Fermer la confirmation après 3 secondes
    setTimeout(() => {
      setShowConfirmation(false);
    }, 3000);
  };

  // Afficher un message de chargement pendant la récupération des données
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement des formations...</p>
      </div>
    );
  }

  // Afficher un message d'erreur si la récupération a échoué
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
      {/* Header */}
      <div className="header">
        <h1>Catalogue de formations</h1>
        <p>Découvrez et inscrivez-vous aux formations disponibles</p>
      </div>

      {/* Filtres */}
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

      {/* Liste des formations */}
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
                >
                  Demander cette formation
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

      {/* Pagination */}
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

      {/* Modal de demande */}
      {isModalOpen && selectedFormation && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Demande de formation</h2>
              <button 
                className="close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="formation-info">
                <h3>{selectedFormation.titre}</h3>
                <p>{formatDate(selectedFormation.date)} | {selectedFormation.duree} heures</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nom">Nom</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="prenom">Prénom</label>
                    <input
                      type="text"
                      id="prenom"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email professionnel</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="departement">Département</label>
                  <select
                    id="departement"
                    name="departement"
                    value={formData.departement}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Sélectionnez votre département</option>
                    <option value="IT">IT & Digital</option>
                    <option value="RH">Ressources Humaines</option>
                    <option value="Finance">Finance & Comptabilité</option>
                    <option value="Marketing">Marketing & Communication</option>
                    <option value="Operations">Opérations</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="justification">Justification de la demande</label>
                  <textarea
                    id="justification"
                    name="justification"
                    rows="4"
                    value={formData.justification}
                    onChange={handleFormChange}
                    placeholder="Expliquez en quoi cette formation contribuera à vos objectifs professionnels..."
                    required
                  ></textarea>
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                  >
                    Soumettre la demande
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Message de confirmation */}
      {showConfirmation && (
        <div className="confirmation-message">
          <div className="confirmation-content">
            <span className="confirmation-icon">✓</span>
            <p>Votre demande a été soumise avec succès! Votre responsable sera informé de votre requête.</p>
          </div>
        </div>
      )}

      {/* Historique des demandes */}
      {demandes.length > 0 && (
        <div className="demandes-section">
          <h2>Mes demandes de formation</h2>
          <div className="demandes-list">
            <table>
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Date de la demande</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map(demande => (
                  <tr key={demande.id}>
                    <td>{demande.formation.titre}</td>
                    <td>{new Date(demande.dateCreation).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`status-badge ${demande.status.toLowerCase().replace(' ', '-')}`}>
                        {demande.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>
        {`
        /* Styles généraux */
        .container {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 1200px
          
          margin: 0 auto;
          padding: 20px;
          background-color: '#334155'
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

        .category-filter {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .filter-label {
          font-weight: 500;
          color: #4b5563;
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .category-btn {
          padding: 8px 16px;
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .category-btn:hover {
          background-color: #e5e7eb;
        }

        .category-btn.active {
          background-color: #3b82f6;
          border-color: #3b82f6;
          color: white;
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

        .request-btn:hover {
          background-color: #1d4ed8;
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

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background-color: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          color: #1e40af;
          font-size: 1.5rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        }

        .modal-content {
          padding: 20px;
        }

        .formation-info {
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f3f4f6;
          border-radius: 8px;
        }

        .formation-info h3 {
          margin-top: 0;
          margin-bottom: 10px;
          color: #1e40af;
        }

        .formation-info p {
          margin: 0;
          color: #4b5563;
        }

        /* Form */
        form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: flex;
          gap: 15px;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        label {
          font-weight: 500;
          color: #4b5563;
        }

        input, select, textarea {
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 10px;
        }

        .cancel-btn {
          padding: 10px 20px;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          color: #4b5563;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background-color: #f3f4f6;
          border-color: #9ca3af;
        }

        .submit-btn {
          padding: 10px 20px;
          background-color: #2563eb;
          border: none;
          border-radius: 6px;
          color: white;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .submit-btn:hover {
          background-color: #1d4ed8;
        }

        /* Message de confirmation */
        .confirmation-message {
          position: fixed;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #34d399;
          color: white;
          border-radius: 12px;
          padding: 5px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          z-index: 1000;
          animation: slideUp 0.3s ease, fadeOut 0.5s ease 2.5s;
        }

        .confirmation-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px;
        }

        .confirmation-icon {
          font-size: 1.5rem;
          background-color: white;
          color: #34d399;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
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

          .form-row {
            flex-direction: column;
          }

          .filters {
            flex-direction: column;
            align-items: stretch;
          }
        }
        `}
      </style>
    </div>
  );
}

export default CardDemandeFormation;

