import { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, AlertCircle, Info } from 'lucide-react';

function CardFormation() {
  const [formations, setFormations] = useState([]);
  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFormation, setCurrentFormation] = useState({
    id: null, titre: '', description: '', date: '', duree: 0, places: 0, inscrits: 0, statut: 'Programmée'
  });
  const [activeTab, setActiveTab] = useState('toutes');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({
    titre: false,
    description: false,
    date: false,
    duree: false,
    places: false,
    inscrits: false
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [formationsPerPage] = useState(5);

  const Toast = ({ message, type, onClose }) => {
    const toastClass = {
      success: 'toast-success',
      error: 'toast-error',
      info: 'toast-info',
      warning: 'toast-warning'
    }[type];

    const icon = {
      success: <Check size={20} />,
      error: <X size={20} />,
      info: <Info size={20} />,
      warning: <AlertCircle size={20} />
    }[type];

    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }, [onClose]);

    return (
      <div className={`toast ${toastClass}`}>
        <div className="toast-icon">{icon}</div>
        <p>{message}</p>
      </div>
    );
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/getformation');
        
        const formattedData = response.data.map(formation => ({
          id: formation._id,
          titre: formation.titre,
          description: formation.description,
          date: new Date(formation.date).toISOString().split('T')[0],
          duree: formation.durée,
          places: formation.nbplaces,
          inscrits: formation.nbinscrits,
          statut: formation.statut
        }));
        
        setFormations(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des formations:", err);
        setError("Impossible de charger les formations. Veuillez réessayer plus tard.");
        setLoading(false);
        showToast("Erreur lors du chargement des formations", "error");
      }
    };

    fetchFormations();
  }, []);

  useEffect(() => {
    let result = [...formations];
    
    if (activeTab !== 'toutes') {
      result = result.filter(formation => {
        if (activeTab === 'programmees') return formation.statut === 'Programmée';
        if (activeTab === 'completes') return formation.statut === 'Complète';
        if (activeTab === 'terminees') return formation.statut === 'Terminée';
        return true;
      });
    }
    
    if (searchTerm) {
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredFormations(result);
    setCurrentPage(1);
  }, [formations, searchTerm, sortConfig, activeTab]);

  const indexOfLastFormation = currentPage * formationsPerPage;
  const indexOfFirstFormation = indexOfLastFormation - formationsPerPage;
  const currentFormations = filteredFormations.slice(indexOfFirstFormation, indexOfLastFormation);
  const totalPages = Math.ceil(filteredFormations.length / formationsPerPage);

  const validateForm = () => {
    const today = new Date(new Date().setHours(0, 0, 0, 0));
    const selectedDate = new Date(currentFormation.date);
    
    const errors = {
      titre: !currentFormation.titre.trim(),
      description: !currentFormation.description.trim(),
      // Modification ici: pas de validation de date pour les modifications
      date: currentFormation.id ? false : (!currentFormation.date || selectedDate < today),
      duree: currentFormation.duree <= 0,
      places: currentFormation.places <= 0,
      inscrits: currentFormation.inscrits < 0 || currentFormation.inscrits > currentFormation.places
    };
    
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleBlur = (field) => {
    if (formSubmitted) {
      validateForm();
    }
  };

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleAddNew = () => {
    setCurrentFormation({
      id: null,
      titre: '',
      description: '',
      date: '',
      duree: 0,
      places: 0,
      inscrits: 0,
      statut: 'Programmée'
    });
    setValidationErrors({
      titre: false,
      description: false,
      date: false,
      duree: false,
      places: false,
      inscrits: false
    });
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const handleEdit = (formation) => {
    setCurrentFormation({...formation});
    setValidationErrors({
      titre: false,
      description: false,
      date: false,
      duree: false,
      places: false,
      inscrits: false
    });
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/deleteformation/${id}`);
      setFormations(formations.filter(formation => formation.id !== id));
      setConfirmDeleteId(null);
      showToast("Formation supprimée avec succès", "success");
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      showToast("Impossible de supprimer la formation. Veuillez réessayer.", "error");
    }
  };

  const handleSave = async () => {
    setFormSubmitted(true);
    if (!validateForm()) {
      showToast("Veuillez vérifiez les champs du formulaire", "error");
      return;
    }

    try {
      const formationData = {
        titre: currentFormation.titre,
        description: currentFormation.description,
        date: currentFormation.date,
        durée: currentFormation.duree,
        nbplaces: currentFormation.places,
        nbinscrits: currentFormation.inscrits,
        statut: currentFormation.statut
      };

      if (currentFormation.id) {
        await axios.put(`/api/updateformation/${currentFormation.id}`, formationData);
        setFormations(formations.map(formation => 
          formation.id === currentFormation.id ? {
            ...formation,
            titre: currentFormation.titre,
            description: currentFormation.description,
            date: currentFormation.date,
            duree: currentFormation.duree,
            places: currentFormation.places,
            inscrits: currentFormation.inscrits,
            statut: currentFormation.statut
          } : formation
        ));
        showToast("Formation mise à jour avec succès", "success");
      } else {
        const response = await axios.post('/api/addformation', formationData);
        const newFormation = {
          id: response.data._id,
          titre: response.data.titre,
          description: response.data.description,
          date: new Date(response.data.date).toISOString().split('T')[0],
          duree: response.data.durée,
          places: response.data.nbplaces,
          inscrits: response.data.nbinscrits,
          statut: response.data.statut
        };
        setFormations([...formations, newFormation]);
        showToast("Formation ajoutée avec succès", "success");
      }
      setModalOpen(false);
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      showToast("Erreur lors de l'enregistrement de la formation", "error");
    }
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setCurrentFormation({
      ...currentFormation,
      statut: newStatus
    });
    
    if (formSubmitted) {
      validateForm();
    }
  };

  const getStatusColor = (statut) => {
    switch(statut) {
      case 'Programmée': return 'status-blue';
      case 'Complète': return 'status-yellow';
      case 'Terminée': return 'status-green';
      default: return 'status-gray';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
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
        <button className="retry-button" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
      <div className="container">
        {toast.show && (
          <Toast message={toast.message} type={toast.type} onClose={hideToast} />
        )}

        <div className="gp-header-section">
          <h1 className="gp-modal-title" style={{ fontSize: "1.5rem", marginBottom: "" }}>
            Gestion des Formations
          </h1>
        </div>
          
        <div className="card">
          <div className="toolbar">
            <div className="toolbar-left">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher une formation..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="search-icon">&#128269;</div>
              </div>
              <div className="tabs">
                <button 
                  className={`tab ${activeTab === 'toutes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('toutes')}
                >
                  Toutes
                </button>
                <button 
                  className={`tab ${activeTab === 'programmees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('programmees')}
                >
                  Programmées
                </button>
                <button 
                  className={`tab ${activeTab === 'completes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completes')}
                >
                  Complètes
                </button>
                <button 
                  className={`tab ${activeTab === 'terminees' ? 'active' : ''}`}
                  onClick={() => setActiveTab('terminees')}
                >
                  Terminées
                </button>
              </div>
            </div>
            <button 
              className="btn-primary"
              onClick={handleAddNew}
            >
              <span className="icon">+</span>
              <span>Nouvelle formation</span>
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th className="sortable" onClick={() => requestSort('titre')}>
                    <div className="th-content">
                      Titre
                      {sortConfig.key === 'titre' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="sortable" onClick={() => requestSort('date')}>
                    <div className="th-content">
                      Date
                      {sortConfig.key === 'date' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="sortable" onClick={() => requestSort('duree')}>
                    <div className="th-content">
                      Durée
                      {sortConfig.key === 'duree' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th className="sortable" onClick={() => requestSort('places')}>
                    <div className="th-content">
                      Places
                      {sortConfig.key === 'places' && (
                        <span className="sort-icon">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentFormations.length > 0 ? (
                  currentFormations.map((formation) => (
                    <tr key={formation.id}>
                      <td>
                        <div className="formation-title">
                          <span className="title">{formation.titre}</span>
                          <span className="description">{formation.description}</span>
                        </div>
                      </td>
                      <td>
                        <div className="with-icon">
                          <span className="icon">📅</span>
                          <span>{formatDate(formation.date)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="with-icon">
                          <span className="icon">⏱️</span>
                          <span>{formation.duree} heures</span>
                        </div>
                      </td>
                      <td>
                        <div className="with-icon">
                          <span className="icon">👥</span>
                          <span>{formation.inscrits}/{formation.places}</span>
                          {formation.inscrits === formation.places && (
                            <span className="dot yellow-dot"></span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`status ${getStatusColor(formation.statut)}`}>
                          {formation.statut}
                        </span>
                      </td>
                      <td>
                        {confirmDeleteId === formation.id ? (
                          <div className="action-buttons">
                            <button onClick={() => handleDelete(formation.id)} className="btn-confirm">
                              ✓ Confirmer
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="btn-cancel">
                              ✕ Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button onClick={() => handleEdit(formation)} className="btn-edit">
                              ✎
                            </button>
                            <button onClick={() => setConfirmDeleteId(formation.id)} className="btn-delete">
                              🗑️
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-table">
                      Aucune formation trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <div className="pagination-info">
              Affichage de <span className="bold">{indexOfFirstFormation + 1}-{Math.min(indexOfLastFormation, filteredFormations.length)}</span> sur <span className="bold">{filteredFormations.length}</span> formation(s)
            </div>
            <div className="pagination-buttons">
              <button 
                className="btn-page" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`btn-page ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
              
              <button 
                className="btn-page" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>
                  {currentFormation.id ? 'Modifier la formation' : 'Ajouter une formation'}
                </h2>
              </div>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Titre de la formation</label>
                    <input 
                      type="text" 
                      className={`form-control ${validationErrors.titre ? 'error' : ''}`}
                      value={currentFormation.titre}
                      onChange={(e) => setCurrentFormation({...currentFormation, titre: e.target.value})}
                      onBlur={() => handleBlur('titre')}
                    />
                    {validationErrors.titre && (
                      <span className="error-message">Le titre est requis</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea 
                      className={`form-control ${validationErrors.description ? 'error' : ''}`}
                      rows="3"
                      value={currentFormation.description}
                      onChange={(e) => setCurrentFormation({...currentFormation, description: e.target.value})}
                      onBlur={() => handleBlur('description')}
                    ></textarea>
                    {validationErrors.description && (
                      <span className="error-message">La description est requise</span>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date</label>
                      <input 
                        type="date" 
                        className={`form-control ${validationErrors.date ? 'error' : ''}`}
                        value={currentFormation.date}
                        // Modification ici: pas de restriction min pour les modifications
                        min={currentFormation.id ? undefined : new Date().toISOString().split('T')[0]}
                        onChange={(e) => setCurrentFormation({...currentFormation, date: e.target.value})}
                        onBlur={() => handleBlur('date')}
                      />
                      {validationErrors.date && (
                        <span className="error-message">
                          {currentFormation.id ? "La date est requise" : "La date doit être aujourd'hui ou dans le futur"}
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Durée (heures)</label>
                      <input 
                        type="number" 
                        className={`form-control ${validationErrors.duree ? 'error' : ''}`}
                        value={currentFormation.duree}
                        min="1"
                        onChange={(e) => setCurrentFormation({...currentFormation, duree: parseInt(e.target.value) || 0})}
                        onBlur={() => handleBlur('duree')}
                      />
                      {validationErrors.duree && (
                        <span className="error-message">La durée doit être supérieure à 0</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Nombre de places</label>
                      <input 
                        type="number" 
                        className={`form-control ${validationErrors.places ? 'error' : ''}`}
                        value={currentFormation.places}
                        min="1"
                        onChange={(e) => setCurrentFormation({...currentFormation, places: parseInt(e.target.value) || 0})}
                        onBlur={() => handleBlur('places')}
                      />
                      {validationErrors.places && (
                        <span className="error-message">Le nombre de places doit être supérieur à 0</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Nombre d'inscrits</label>
                      <input 
                        type="number" 
                        className={`form-control ${validationErrors.inscrits ? 'error' : ''}`}
                        value={currentFormation.inscrits}
                        min="0"
                        max={currentFormation.places}
                        onChange={(e) => setCurrentFormation({...currentFormation, inscrits: parseInt(e.target.value) || 0})}
                        onBlur={() => handleBlur('inscrits')}
                      />
                      {validationErrors.inscrits && (
                        <span className="error-message">
                          {currentFormation.inscrits < 0 
                            ? "Le nombre d'inscrits ne peut pas être négatif" 
                            : "Le nombre d'inscrits ne peut pas dépasser le nombre de places"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Statut</label>
                    <select 
                      className="form-control"
                      value={currentFormation.statut}
                      onChange={handleStatusChange}
                    >
                      <option value="Programmée">Programmée</option>
                      <option value="Complète">Complète</option>
                      <option value="Terminée">Terminée</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleSave}
                >
                  {currentFormation.id ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        )}


        <style jsx>{`
          .container {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .card {
            max-width: 1200px;
            margin: 0 auto;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .gp-header-section {
            padding: 1.5rem;
          }

          .gp-modal-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #1f2937;
          }

          /* Toast Styles */
          .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
          }

          @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }

          .toast-success {
            background-color: #ecfdf5;
            color: #059669;
            border-left: 4px solid #10b981;
          }

          .toast-error {
            background-color: #fee2e2;
            color: #dc2626;
            border-left: 4px solid #ef4444;
          }

          .toast-info {
            background-color: #dbeafe;
            color: #2563eb;
            border-left: 4px solid #3b82f6;
          }

          .toast-warning {
            background-color: #fef3c7;
            color: #d97706;
            border-left: 4px solid #f59e0b;
          }

          .toast-icon {
            display: flex;
          }

          .toolbar {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
          }

          .toolbar-left {
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            flex: 1;
          }

          .search-container {
            position: relative;
            min-width: 250px;
          }

          .search-input {
            width: 100%;
            padding: 8px 16px 8px 40px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }

          .search-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
          }

          .tabs {
            display: flex;
            gap: 8px;
          }

          .tab {
            padding: 8px 16px;
            border-radius: 6px;
            background-color: #f1f5f9;
            border: none;
            color: #64748b;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, color 0.2s;
          }

          .tab:hover {
            background-color: #e2e8f0;
          }

          .tab.active {
            background-color: #3b82f6;
            color: white;
          }

          .btn-primary {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: background-color 0.2s;
          }

          .btn-primary:hover {
            background-color: #2563eb;
          }

          .btn-primary .icon {
            font-size: 18px;
          }

          .table-container {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th {
            text-align: left;
            padding: 12px 16px;
            background-color: #f8fafc;
            color: #64748b;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid #e2e8f0;
          }

          th.sortable {
            cursor: pointer;
          }

          .th-content {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .sort-icon {
            display: inline-block;
            font-size: 10px;
          }

          td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            color: #334155;
          }

          tr:hover {
            background-color: #f8fafc;
          }

          .formation-title {
            display: flex;
            flex-direction: column;
          }

          .formation-title .title {
            font-weight: 500;
            color: #1e293b;
          }

          .formation-title .description {
            font-size: 14px;
            color: #64748b;
            margin-top: 4px;
          }

          .with-icon {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .with-icon .icon {
            color: #94a3b8;
            font-size: 16px;
          }

          .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-left: 8px;
          }

          .yellow-dot {
            background-color: #facc15;
          }

          .status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
          }

          .status-blue {
            background-color: #dbeafe;
            color: #1e40af;
          }

          .status-yellow {
            background-color: #fef9c3;
            color: #854d0e;
          }

          .status-green {
            background-color: #dcfce7;
            color: #166534;
          }

          .status-gray {
            background-color: #f1f5f9;
            color: #475569;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
          }

          .btn-edit, .btn-delete {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 16px;
            padding: 4px;
            border-radius: 4px;
            transition: background-color 0.2s;
          }

          .btn-edit {
            color: #3b82f6;
          }

          .btn-edit:hover {
            background-color: #dbeafe;
          }

          .btn-delete {
            color: #ef4444;
          }

          .btn-delete:hover {
            background-color: #fee2e2;
          }

          .btn-confirm, .btn-cancel {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            padding: 4px 8px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: background-color 0.2s;
          }

          .btn-confirm {
            color: #ef4444;
          }

          .btn-confirm:hover {
            background-color: #fee2e2;
          }

          .btn-cancel {
            color: #64748b;
          }

          .btn-cancel:hover {
            background-color: #f1f5f9;
          }

          .empty-table {
            text-align: center;
            color: #94a3b8;
            padding: 32px;
          }

          .pagination {
            padding: 16px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .pagination-info {
            font-size: 14px;
            color: #64748b;
          }

          .pagination-info .bold {
            font-weight: 600;
            color: #334155;
          }

          .pagination-buttons {
            display: flex;
            gap: 8px;
          }

          .btn-page {
            padding: 8px 16px;
            background-color: white;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 14px;
            color: #475569;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
          }

          .btn-page:hover {
            background-color: #f8fafc;
            border-color: #94a3b8;
          }

          .btn-page:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .btn-page.active {
            background-color: #3b82f6;
            color: white;
            border-color: #3b82f6;
          }

          .modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
            z-index: 50;
          }

          .modal {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            max-width: 600px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
          }

          .modal-header {
            padding: 16px 24px;
            border-bottom: 1px solid #e2e8f0;
          }

          .modal-header h2 {
            font-size: 18px;
            font-weight: bold;
            color: #1e293b;
            margin: 0;
          }

          .modal-body {
            padding: 24px;
          }

          .modal-footer {
            padding: 16px 24px;
            border-top: 1px solid #e2e8f0;
            display: flex;
            justify-content: flex-end;
            gap: 12px;
          }

          .form-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .form-group label {
            font-size: 14px;
            font-weight: 500;
            color: #475569;
          }
          .form-control {
            padding: 8px 12px;
            border: 1px solid #cbd5e1;
            border-radius: 6px;
            font-size: 14px;
            color: #1e293b;
            width: 100%;
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .form-control:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }

          textarea.form-control {
            min-height: 80px;
            resize: vertical;
          }

          .btn-secondary {
            background-color: white;
            color: #475569;
            border: 1px solid #cbd5e1;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s;
          }

          .btn-secondary:hover {
            background-color: #f8fafc;
            border-color: #94a3b8;
          }

          .error {
            border-color: #ef4444 !important;
          }

          .error-message {
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
          }

          .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3b82f6;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .error-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 300px;
            color: #ef4444;
          }

          .error-message {
            margin-bottom: 20px;
          }

          .retry-button {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
          }

          @media (max-width: 768px) {
            .toolbar {
              flex-direction: column;
              align-items: stretch;
            }
            
          
            .toolbar-left {
              flex-direction: column;
            }
            
            .form-row {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default CardFormation;