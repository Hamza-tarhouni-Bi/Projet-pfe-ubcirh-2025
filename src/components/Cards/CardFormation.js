//Partie admin formation
import { useState, useEffect } from 'react';

// Composant principal
function CardFormation() {
  const [formations, setFormations] = useState([
    { id: 1, titre: "Développement React Avancé", description: "Formation complète sur les concepts avancés de React", date: "2025-04-15", duree: 21, places: 12, inscrits: 8, statut: "Programmée" },
    { id: 2, titre: "Leadership et Management d'Équipe", description: "Techniques de management pour les chefs d'équipe", date: "2025-05-10", duree: 14, places: 15, inscrits: 15, statut: "Complète" },
    { id: 3, titre: "Excel pour RH", description: "Utilisation avancée d'Excel pour les professionnels RH", date: "2025-04-22", duree: 7, places: 20, inscrits: 5, statut: "Programmée" },
    { id: 4, titre: "Communication Professionnelle", description: "Améliorer sa communication en milieu professionnel", date: "2025-06-05", duree: 14, places: 18, inscrits: 12, statut: "Programmée" },
    { id: 5, titre: "RGPD et Conformité", description: "Les bases de la conformité RGPD pour les équipes RH", date: "2025-03-25", duree: 7, places: 25, inscrits: 20, statut: "Terminée" }
  ]);

  const [filteredFormations, setFilteredFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFormation, setCurrentFormation] = useState({
    id: null, titre: '', description: '', date: '', duree: 0, places: 0, inscrits: 0, statut: 'Programmée'
  });
  const [activeTab, setActiveTab] = useState('toutes');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Filtrer les formations
  useEffect(() => {
    let result = [...formations];
    
    // Filtre par statut
    if (activeTab !== 'toutes') {
      result = result.filter(formation => {
        if (activeTab === 'programmees') return formation.statut === 'Programmée';
        if (activeTab === 'completes') return formation.statut === 'Complète';
        if (activeTab === 'terminees') return formation.statut === 'Terminée';
        return true;
      });
    }
    
    // Filtre par recherche
    if (searchTerm) {
      result = result.filter(formation => 
        formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formation.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Tri
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
  }, [formations, searchTerm, sortConfig, activeTab]);

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
    setModalOpen(true);
  };

  const handleEdit = (formation) => {
    setCurrentFormation({...formation});
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    setFormations(formations.filter(formation => formation.id !== id));
    setConfirmDeleteId(null);
  };

  const handleSave = () => {
    if (currentFormation.id) {
      // Édition
      setFormations(formations.map(formation => 
        formation.id === currentFormation.id ? currentFormation : formation
      ));
    } else {
      // Création
      const newId = Math.max(...formations.map(f => f.id)) + 1;
      setFormations([...formations, {...currentFormation, id: newId}]);
    }
    setModalOpen(false);
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

  return (
    <div className="container">
        
      <div className="card">
        {/* Header */}
        

        {/* Toolbar */}
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

        {/* Table */}
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
              {filteredFormations.length > 0 ? (
                filteredFormations.map((formation) => (
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

        {/* Pagination */}
        <div className="pagination">
          <div className="pagination-info">
            Affichage de <span className="bold">{filteredFormations.length}</span> formation(s)
          </div>
          <div className="pagination-buttons">
            <button className="btn-page">
              Précédent
            </button>
            <button className="btn-page">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                  <label>
                    Titre de la formation
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={currentFormation.titre}
                    onChange={(e) => setCurrentFormation({...currentFormation, titre: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>
                    Description
                  </label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    value={currentFormation.description}
                    onChange={(e) => setCurrentFormation({...currentFormation, description: e.target.value})}
                  ></textarea>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Date
                    </label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={currentFormation.date}
                      onChange={(e) => setCurrentFormation({...currentFormation, date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Durée (heures)
                    </label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={currentFormation.duree}
                      onChange={(e) => setCurrentFormation({...currentFormation, duree: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>
                      Nombre de places
                    </label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={currentFormation.places}
                      onChange={(e) => setCurrentFormation({...currentFormation, places: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="form-group">
                    <label>
                      Nombre d'inscrits
                    </label>
                    <input 
                      type="number" 
                      className="form-control"
                      value={currentFormation.inscrits}
                      onChange={(e) => setCurrentFormation({...currentFormation, inscrits: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>
                    Statut
                  </label>
                  <select 
                    className="form-control"
                    value={currentFormation.statut}
                    onChange={(e) => setCurrentFormation({...currentFormation, statut: e.target.value})}
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

      {/* CSS intégré */}
      <style jsx>{`
        /* Styles généraux */
        .container {
          background-color: #f5f7fa;
          min-height: 100vh;
          padding: 20px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .card {
          max-width: 1200px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        /* Header */
        .header {
          padding: 20px;
         
        }

     .header h1 {
    text-align: center;
    text-transform: uppercase;
    color: #1E3A8A;
    font-size: 2.5em;
    font-weight: 700;
    letter-spacing: 2px;
    padding: 20px 0;
    margin: 15px auto 30px;
    position: relative;
    display: inline-block;
    background: linear-gradient(120deg, #E0E7FF 0%, #ffffff 100%);
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(30, 58, 138, 0.15);
    width: 100%;
    max-width: 800px;
}

.header h1::before {
    content: "";
    position: absolute;
    bottom: -3px;
    left: 10%;
    width: 80%;
    height: 4px;
    background: linear-gradient(90deg, transparent, #1E3A8A, transparent);
    border-radius: 2px;
}

.header h1::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at top right, rgba(224, 231, 255, 0.8), transparent 70%);
    border-radius: 8px;
    z-index: -1;
}


        .header p {
          color: #64748b;
          margin: 0;
        }

        /* Toolbar */
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

        /* Table */
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

        /* Pagination */
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

        /* Modal */
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

        /* Responsive */
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
  );
}

export default CardFormation;