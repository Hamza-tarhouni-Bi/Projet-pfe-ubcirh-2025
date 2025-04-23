import React, { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash, 
  Plus, 
  X, 
  Search, 
  Filter,
  Check
} from 'lucide-react';
import axios from 'axios'; // Importation d'axios pour les requêtes HTTP

// CSS encapsulé avec préfixe "cr-" (Card Recrutement)
const encapsulatedStyles = `
  .cr-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    font-family: 'Arial, sans-serif';
  }
  
  .cr-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .cr-search-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .cr-search-input {
    flex: 1;
    position: relative;
  }
  
  .cr-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .cr-add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #14b8a6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  
  .cr-add-button:hover {
    background-color: #0d9488;
  }
  
  .cr-tab-button {
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .cr-tab-button.cr-active {
    border-bottom-color: #14b8a6;
    color: #14b8a6;
  }
  
  .cr-tab-button:hover:not(.cr-active) {
    color: #374151;
  }
  
  .cr-job-listing {
    background: #f9fafb;
    border-left: 5px solid #14b8a6;
    margin: 1rem 0;
    padding: 1rem;
    border-radius: 5px;
    position: relative;
  }
  
  .cr-job-title {
    color: #14b8a6;
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
  }
  
  .cr-job-detail {
    color: #4b5563;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .cr-job-badge {
    background-color: #e6fffa;
    color: #047857;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .cr-action-buttons {
    display: flex;
    gap: 0.5rem;
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
  
  .cr-action-button {
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  
  .cr-edit-button {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .cr-edit-button:hover {
    background-color: #bfdbfe;
  }
  
  .cr-delete-button {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .cr-delete-button:hover {
    background-color: #fecaca;
  }
  
  .cr-modal-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    z-index: 50;
  }
  
  .cr-modal-container {
    max-height: 90vh;
    overflow-y: auto;
    background-color: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    padding: 1.5rem;
    width: 100%;
    max-width: 500px;
  }
  
  .cr-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .cr-modal-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  
  .cr-modal-close {
    color: #6b7280;
    transition: color 0.2s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .cr-modal-close:hover {
    color: #1f2937;
  }
  
  .cr-form-group {
    margin-bottom: 1rem;
  }
  
  .cr-form-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .cr-form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .cr-form-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .cr-form-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .cr-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.5rem;
  }
  
  .cr-btn {
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  
  .cr-btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  .cr-btn-cancel:hover {
    background-color: #e5e7eb;
  }
  
  .cr-btn-save {
    background-color: #14b8a6;
    color: white;
  }
  
  .cr-btn-save:hover {
    background-color: #0d9488;
  }
  
  .cr-toast {
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
  
  .cr-toast-success {
    background-color: #10b981;
  }
  
  .cr-toast-error {
    background-color: #ef4444;
  }
  
  .cr-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  
  .cr-page-button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    background: none;
    cursor: pointer;
  }
  
  .cr-page-button.cr-active {
    background-color: #14b8a6;
    color: white;
    border-color: #14b8a6;
  }
  
  .cr-page-button:hover:not(.cr-active) {
    background-color: #f9fafb;
  }
`;

// Configuration de base pour les appels API
const API_URL = 'http://localhost:5000'; // Ajustez selon votre configuration

// Composant de toast pour les notifications
const Toast = ({ message, type, onClose }) => {
  const toastClass = type === 'success' ? 'cr-toast-success' : 'cr-toast-error';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`cr-toast ${toastClass}`}>
      {type === 'success' ? <Check size={20} /> : <X size={20} />}
      <p>{message}</p>
    </div>
  );
};

const CardRecrutement = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [currentOffer, setCurrentOffer] = useState(null);
  const [offerToDelete, setOfferToDelete] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les offres depuis le backend au chargement du composant
  useEffect(() => {
    fetchOffers();
  }, []);

  // Fonction pour récupérer les offres depuis l'API
  const fetchOffers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/alloffre`);
      
      // Transformer les données pour correspondre à notre structure
      const formattedOffers = response.data.map(offer => ({
        id: offer._id,
        title: offer.titre,
        location: offer.lieu,
        date: new Date(offer.date).toISOString().split('T')[0]
      }));
      
      setOffers(formattedOffers);
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
      setError('Impossible de charger les offres.');
      setIsLoading(false);
      showToast('Erreur lors du chargement des offres', 'error');
    }
  };

  // Effet pour filtrer les offres basé sur les critères de recherche et filtre
  useEffect(() => {
    let filtered = [...offers];
    
    // Filtre par lieu
    if (locationFilter !== 'all') {
      filtered = filtered.filter(offer => offer.location === locationFilter);
    }
    
    // Filtre par recherche
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(offer => 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOffers(filtered);
  }, [offers, searchTerm, locationFilter]);

  // Fonction pour afficher un toast
  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  // Fonction pour fermer le toast
  const closeToast = () => {
    setToast({ ...toast, show: false });
  };

  // Ouvrir le modal pour ajouter une offre
  const handleAddOffer = () => {
    setCurrentOffer({ title: '', location: '', date: new Date().toISOString().split('T')[0] });
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier une offre
  const handleEditOffer = (offer) => {
    setCurrentOffer({ ...offer });
    setIsModalOpen(true);
  };

  // Ouvrir le modal de confirmation de suppression
  const handleDeleteOffer = (offer) => {
    setOfferToDelete(offer);
    setIsDeleteModalOpen(true);
  };

  // Fermer les modals
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentOffer(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setOfferToDelete(null);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOffer({ ...currentOffer, [name]: value });
  };

  // Sauvegarder une offre (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentOffer.title || !currentOffer.location || !currentOffer.date) {
      showToast("Veuillez remplir tous les champs", "error");
      return;
    }
    
    try {
      // Adapter le format des données pour correspondre au backend
      const offerData = {
        titre: currentOffer.title,
        lieu: currentOffer.location,
        date: currentOffer.date
      };
      
      // Vérifier si c'est une modification ou un ajout
      if (currentOffer.id) {
        // Modification
        await axios.put(`/updateoffre/${currentOffer.id}`, offerData);
        showToast("Offre modifiée avec succès", "success");
      } else {
        // Ajout
        await axios.post(`/addoffre`, offerData);
        showToast("Offre ajoutée avec succès", "success");
      }
      
      // Recharger les offres
      fetchOffers();
      setIsModalOpen(false);
      setCurrentOffer(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'offre:', error);
      showToast(error.response?.data?.error || "Une erreur est survenue", "error");
    }
  };

  // Confirmer la suppression d'une offre
  const confirmDelete = async () => {
    if (offerToDelete) {
      try {
        await axios.delete(`/deleteoffre/${offerToDelete.id}`);
        showToast("Offre supprimée avec succès", "success");
        
        // Recharger les offres
        fetchOffers();
        setIsDeleteModalOpen(false);
        setOfferToDelete(null);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'offre:', error);
        showToast(error.response?.data?.error || "Une erreur est survenue lors de la suppression", "error");
      }
    }
  };

  // Générer les lieux uniques pour les filtres
  const uniqueLocations = ['all', ...new Set(offers.map(offer => offer.location))];

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <>
      {/* Injection du CSS */}
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"}>
      <style>{encapsulatedStyles}</style>
      
      <div className="cr-container">
        <div className="cr-header-section">
          <h1 className="cr-modal-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
            Offres d'Emploi
          </h1>
          
          {/* Section de recherche et filtres */}
          <div className="cr-search-container">
            <div className="cr-search-input">
              <div className="cr-search-icon">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Rechercher une offre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cr-form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={20} style={{ color: '#9ca3af' }} />
              <select 
                value={locationFilter} 
                onChange={(e) => setLocationFilter(e.target.value)}
                className="cr-form-select"
              >
                <option value="all">Tous les lieux</option>
                {uniqueLocations.filter(loc => loc !== 'all').map((location, idx) => (
                  <option key={idx} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <button className="cr-add-button" onClick={handleAddOffer}>
              <Plus size={20} />
              Ajouter une offre
            </button>
          </div>
          
          {/* État de chargement */}
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
              Chargement des offres...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#ef4444' }}>
              {error}
            </div>
          ) : (
            /* Liste des offres */
            filteredOffers.length > 0 ? (
              filteredOffers.map((offer) => (
                <div key={offer.id} className="cr-job-listing">
                  <h2 className="cr-job-title">{offer.title}</h2>
                  <div className="cr-job-detail">
                    <strong>Lieu:</strong>
                    <span className="cr-job-badge">{offer.location}</span>
                  </div>
                  <div className="cr-job-detail">
                    <strong>Date:</strong> {formatDate(offer.date)}
                  </div>
                  
                  <div className="cr-action-buttons">
                    <button 
                      className="cr-action-button cr-edit-button" 
                      onClick={() => handleEditOffer(offer)}
                      title="Modifier l'offre"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="cr-action-button cr-delete-button" 
                      onClick={() => handleDeleteOffer(offer)}
                      title="Supprimer l'offre"
                    >
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
                Aucune offre trouvée
              </div>
            )
          )}
          
          {/* Pagination */}
          {!isLoading && !error && filteredOffers.length > 0 && (
            <div className="cr-pagination">
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Affichage de {filteredOffers.length} sur {offers.length} offres
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="cr-page-button">
                  Précédent
                </button>
                <button className="cr-page-button cr-active">
                  1
                </button>
                <button className="cr-page-button">
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal pour ajouter/modifier une offre */}
      {isModalOpen && (
        <div className="cr-modal-overlay">
          <div className="cr-modal-container">
            <div className="cr-modal-header">
              <h2 className="cr-modal-title">
                {currentOffer.id ? "Modifier une offre" : "Ajouter une offre"}
              </h2>
              <button className="cr-modal-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="cr-form-group">
                <label className="cr-form-label">Titre de l'offre</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Ex: Développeur Frontend React"
                  className="cr-form-input"
                  value={currentOffer?.title || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="cr-form-group">
                <label className="cr-form-label">Lieu</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Ex: Tunis, Remote, etc."
                  className="cr-form-input"
                  value={currentOffer?.location || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="cr-form-group">
                <label className="cr-form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  className="cr-form-input"
                  value={currentOffer?.date || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="cr-modal-footer">
                <button 
                  type="button" 
                  className="cr-btn cr-btn-cancel" 
                  onClick={handleCloseModal}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="cr-btn cr-btn-save"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && offerToDelete && (
        <div className="cr-modal-overlay">
          <div className="cr-modal-container">
            <div className="cr-modal-header">
              <h2 className="cr-modal-title">Confirmation de suppression</h2>
              <button className="cr-modal-close" onClick={handleCloseDeleteModal}>
                <X size={24} />
              </button>
            </div>
            
            <div>
              <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                Êtes-vous sûr de vouloir supprimer l'offre <strong>{offerToDelete.title}</strong> ?
              </p>
              
              <div className="cr-modal-footer">
                <button 
                  className="cr-btn cr-btn-cancel" 
                  onClick={handleCloseDeleteModal}
                >
                  Annuler
                </button>
                <button 
                  className="cr-btn cr-btn-save" 
                  onClick={confirmDelete}
                  style={{ backgroundColor: '#ef4444' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast notifications */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
      )}
      </div>
    </>
  );
};

export default CardRecrutement;