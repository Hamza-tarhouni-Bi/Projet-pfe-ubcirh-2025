import { useState, useEffect } from "react";
import { Search, AlertCircle, Check, X, Eye } from "lucide-react";
import axios from "axios";

// CSS encapsulé avec préfixe "gf-" (Gestion Formations)
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
  
  .gf-search-container {
    position: relative;
    margin-bottom: 1rem;
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
    background-color: #f9fafb;
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
  
  .gf-action-button:hover {
    background-color: #f9fafb;
    color: #111827;
    border-color: #d1d5db;
  }
  
  .gf-action-button-accepter:hover {
    color: #047857;
    background-color: #ecfdf5;
    border-color: #a7f3d0;
  }
  
  .gf-action-button-accepter {
    color: #047857;
  }
  
  .gf-action-button-refuser {
    color: #b91c1c;
  }
  
  .gf-action-button-refuser:hover {
    color: #dc2626;
    background-color: #fef2f2;
    border-color: #fecaca;
  }
  
  .gf-loading {
    text-align: center;
    padding: 1rem;
    color: #6b7280;
  }
`;

export default function GestionFormations() {
  const [formations, setFormations] = useState([]);
  const [formationsFiltrees, setFormationsFiltrees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les données depuis l'API
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const response = await axios.get('/alldemandeformation');
        // Transformer les données pour correspondre à notre structure
        const formattedData = response.data.map(item => ({
          _id: item._id,
          nom: item.nom,
          prenom: item.prenom,
          titre: item.nomFormation,
          statut: item.statut.toLowerCase().replace(' ', '_'),
          dateDemande: item.dateDemande
        }));
        
        setFormations(formattedData);
        setFormationsFiltrees(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des formations:", err);
        setError("Erreur lors du chargement des formations");
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  // Formater la date pour l'affichage
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  };

  // Filtrage des formations basé sur la recherche
  const filtrerFormations = (terme) => {
    setRecherche(terme);
    if (!terme.trim()) {
      setFormationsFiltrees(formations);
      return;
    }
    
    const termeLower = terme.toLowerCase();
    const resultats = formations.filter(formation => {
      return (
        formation.nom.toLowerCase().includes(termeLower) ||
        formation.prenom.toLowerCase().includes(termeLower) ||
        formation.titre.toLowerCase().includes(termeLower)
      );
    });
    
    setFormationsFiltrees(resultats);
  };

  // Mapping des statuts API vers les statuts d'affichage
  const mapStatus = (status) => {
    switch (status) {
      case 'accepte':
      case 'approuvée':
        return 'Accepté';
      case 'en_cours':
      case 'en_attente':
        return 'En cours';
      case 'refuse':
      case 'rejetée':
        return 'Refusé';
      default:
        return status;
    }
  };

  // Mettre à jour le statut d'une formation
  const updateStatut = async (id, nouveauStatut) => {
    try {
      // Convertir notre statut vers le format attendu par le backend
      const backendStatut = nouveauStatut === 'accepte' ? 'Approuvée' : 
                          nouveauStatut === 'refuse' ? 'Rejetée' : 'En attente';
      
      await axios.put(`/api/demandeformation/${id}`, { statut: backendStatut });
      
      // Mise à jour de l'état local
      const formationsUpdated = formations.map(formation => {
        if (formation._id === id) {
          return {
            ...formation, 
            statut: nouveauStatut
          };
        }
        return formation;
      });
      
      setFormations(formationsUpdated);
      setFormationsFiltrees(
        formationsUpdated.filter(formation => {
          if (recherche.trim() === "") return true;
          
          const termeLower = recherche.toLowerCase();
          return (
            formation.nom.toLowerCase().includes(termeLower) ||
            formation.prenom.toLowerCase().includes(termeLower) ||
            formation.titre.toLowerCase().includes(termeLower)
          );
        })
      );
      
      alert(`La formation a été ${mapStatus(nouveauStatut).toLowerCase()}.`);
    } catch (err) {
      console.error("Erreur lors de la mise à jour:", err);
      alert("Erreur lors de la mise à jour de la formation.");
    }
  };

  // Actions des boutons
  const handleAccepter = (id) => updateStatut(id, 'accepte');
  const handleRefuser = (id) => updateStatut(id, 'refuse');

  // Rendu du statut avec l'icône appropriée
  const renderStatus = (status) => {
    const displayStatus = mapStatus(status);
    
    switch (status) {
      case "accepte":
      case "approuvée":
        return (
          <div className="gf-status-badge gf-status-accepte">
            <Check size={14} />
            <span>Accepté</span>
          </div>
        );
      case "en_cours":
      case "en_attente":
        return (
          <div className="gf-status-badge gf-status-en-cours">
            <AlertCircle size={14} />
            <span>En cours</span>
          </div>
        );
      case "refuse":
      case "rejetée":
        return (
          <div className="gf-status-badge gf-status-refuse">
            <X size={14} />
            <span>Refusé</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Injection du CSS encapsulé */}
      <style>{encapsulatedStyles}</style>
      
      <div className="gf-container">
        {/* En-tête et recherche */}
        <div className="gf-header-section">
          <h1 className="gf-title">
            Gestion des Formations
          </h1>
          
          {/* Barre de recherche */}
          <div className="gf-search-container">
            <div className="gf-search-icon">
              <Search size={18} />
            </div>
            <input
              type="text"
              className="gf-search-input"
              placeholder="Rechercher par nom, prénom ou titre de formation..."
              value={recherche}
              onChange={(e) => filtrerFormations(e.target.value)}
            />
          </div>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="gf-error">
            {error}
          </div>
        )}

        {/* Tableau des formations */}
        <div className="gf-table-container">
          <table className="gf-table">
            <thead>
              <tr>
                <th className="gf-th">Nom</th>
                <th className="gf-th">Prénom</th>
                <th className="gf-th">Titre de Formation</th>
                <th className="gf-th">Statut</th>
                <th className="gf-th">Date de demande</th>
                <th className="gf-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="gf-td gf-loading">
                    Chargement en cours...
                  </td>
                </tr>
              ) : formationsFiltrees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="gf-td" style={{ textAlign: 'center' }}>
                    {recherche ? "Aucune formation ne correspond à votre recherche" : "Aucune formation trouvée"}
                  </td>
                </tr>
              ) : (
                formationsFiltrees.map((formation) => (
                  <tr key={formation._id} className="gf-tr">
                    <td className="gf-td">
                      <div className="gf-nom">{formation.nom}</div>
                    </td>
                    <td className="gf-td">
                      <div className="gf-prenom">{formation.prenom}</div>
                    </td>
                    <td className="gf-td">
                      <div className="gf-formation-titre">{formation.titre}</div>
                    </td>
                    <td className="gf-td">
                      {renderStatus(formation.statut)}
                    </td>
                    <td className="gf-td">
                      <div className="gf-date">{formatDate(formation.dateDemande)}</div>
                    </td>
                    <td className="gf-td">
                      <div className="gf-actions">
                        {(formation.statut === "en_cours" || formation.statut === "en_attente") && (
                          <>
                            <button 
                              className="gf-action-button gf-action-button-accepter" 
                              onClick={() => handleAccepter(formation._id)}
                              title="Accepter"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              className="gf-action-button gf-action-button-refuser" 
                              onClick={() => handleRefuser(formation._id)}
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
        <div className="gf-footer">
          Affichage de {formationsFiltrees.length} sur {formations.length} formations
        </div>
      </div>
    </>
  );
}