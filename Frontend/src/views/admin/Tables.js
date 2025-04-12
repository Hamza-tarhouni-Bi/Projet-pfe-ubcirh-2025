import { useState, useEffect } from "react";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Eye,
  Check,
  X,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";

// CSS encapsulé avec préfixe "gdp-" (Gestion Demandes Personnel)
const encapsulatedStyles = `
  .gdp-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
  }
  
  .gdp-header-section {
    padding: 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .gdp-search-container {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .gdp-search-input {
    flex: 1;
    position: relative;
  }
  
  .gdp-search-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  .gdp-tab-button {
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gdp-tab-button.gdp-active {
    border-bottom-color: #14b8a6;
    color: #14b8a6;
  }
  
  .gdp-tab-button:hover:not(.gdp-active) {
    color: #374151;
  }
  
  .gdp-table-container {
    width: 100%;
    overflow-x: auto;
  }
  
  .gdp-table {
    width: 100%;
    border-collapse: collapse;
  }
  
  .gdp-th {
    text-align: left;
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: #6b7280;
    background-color: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gdp-td {
    padding: 1rem;
    vertical-align: middle;
    color: #374151;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .gdp-tr {
    cursor: pointer;
  }
  
  .gdp-tr:hover {
    background-color: #f9fafb;
  }
  
  .gdp-department-badge {
    background-color: #e6fffa;
    color: #047857;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gdp-type-badge {
    background-color: #ede9fe;
    color: #5b21b6;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gdp-status-badge {
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    width: fit-content;
  }
  
  .gdp-status-completed {
    background-color: #dcfce7;
    color: #166534;
  }
  
  .gdp-status-pending {
    background-color: #fef3c7;
    color: #92400e;
  }
  
  .gdp-status-rejected {
    background-color: #fee2e2;
    color: #b91c1c;
  }
  
  .gdp-expanded-row {
    background-color: #f8fafc;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .gdp-expanded-content {
    padding: 1.5rem;
  }
  
  .gdp-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  
  .gdp-page-button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .gdp-page-button.gdp-active {
    background-color: #14b8a6;
    color: white;
    border-color: #14b8a6;
  }
  
  .gdp-page-button:hover:not(.gdp-active) {
    background-color: #f9fafb;
  }
  
  .gdp-form-group {
    margin-bottom: 1rem;
  }
  
  .gdp-form-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .gdp-form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gdp-form-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gdp-form-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gdp-form-select:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gdp-expanded-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .gdp-detail-row {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .gdp-detail-label {
    width: 33.333333%;
    font-weight: 500;
    color: #374151;
  }
  
  .gdp-detail-value {
    flex: 1;
    color: #4b5563;
  }
  
  .gdp-expander-icon {
    color: #6b7280;
    transition: transform 0.2s ease;
  }
  
  /* Nouveaux styles pour les boutons d'action et les toasts */
  .gdp-action-buttons {
    display: flex;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .gdp-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    cursor: pointer;
  }
  
  .gdp-btn-success {
    background-color: #10b981;
    color: white;
  }
  
  .gdp-btn-success:hover {
    background-color: #059669;
  }
  
  .gdp-btn-danger {
    background-color: #ef4444;
    color: white;
  }
  
  .gdp-btn-danger:hover {
    background-color: #dc2626;
  }
  
  .gdp-btn-disabled {
    background-color: #d1d5db;
    color: #6b7280;
    cursor: not-allowed;
  }
  
  /* Toast notifications */
  .gdp-toast-container {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 50;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .gdp-toast {
    min-width: 300px;
    padding: 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 0.75rem;
    animation: gdp-slide-in 0.3s ease, gdp-fade-out 0.5s ease 4.5s forwards;
  }
  
  .gdp-toast-success {
    background-color: #dcfce7;
    border-left: 4px solid #10b981;
    color: #166534;
  }
  
  .gdp-toast-error {
    background-color: #fee2e2;
    border-left: 4px solid #ef4444;
    color: #b91c1c;
  }
  
  .gdp-toast-info {
    background-color: #dbeafe;
    border-left: 4px solid #3b82f6;
    color: #1e40af;
  }
  
  @keyframes gdp-slide-in {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes gdp-fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

// Composant Toast
const Toast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  let icon;
  let toastClass;

  switch (type) {
    case "success":
      icon = <Check size={20} />;
      toastClass = "gdp-toast-success";
      break;
    case "error":
      icon = <X size={20} />;
      toastClass = "gdp-toast-error";
      break;
    default:
      icon = <AlertCircle size={20} />;
      toastClass = "gdp-toast-info";
  }

  return (
    <div className={`gdp-toast ${toastClass}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default function Tables() {
  // Données fictives des demandes
  const [demandes, setDemandes] = useState([
    {
      id: 1,
      employeId: 1,
      nom: "Dupont",
      prenom: "Jean",
      departement: "Marketing",
      typeDemande: "Demande de congé",
      statut: "Complété",
      dateDemande: "12/03/2025",
      dateDebut: "20/04/2025",
      dateFin: "30/04/2025",
      motif: "Vacances annuelles",
      commentaire:
        "Je souhaite prendre mes congés annuels pour partir en voyage avec ma famille.",
      reponse: "Demande approuvée. Bon congé !",
    },
    {
      id: 2,
      employeId: 2,
      nom: "Lambert",
      prenom: "Marie",
      departement: "RH",
      typeDemande: "Demande d'avance sur salaire",
      statut: "En attente",
      dateDemande: "05/04/2025",
      montant: "1500",
      motif: "Achat d'équipement",
      commentaire:
        "J'ai besoin d'une avance pour l'achat d'un ordinateur nécessaire à mon travail à distance.",
      reponse: "",
    },
    {
      id: 3,
      employeId: 3,
      nom: "Martin",
      prenom: "Paul",
      departement: "Technique",
      typeDemande: "Demande de formation",
      statut: "Refusé",
      dateDemande: "28/03/2025",
      formation: "Développement React avancé",
      cout: "2500",
      dateDebut: "15/05/2025",
      dateFin: "20/05/2025",
      motif: "Amélioration des compétences",
      commentaire:
        "Cette formation me permettrait d'améliorer mes compétences en React pour les projets à venir.",
      reponse:
        "Budget formation épuisé pour ce trimestre. Veuillez réessayer plus tard.",
    },
    {
      id: 4,
      employeId: 4,
      nom: "Bernard",
      prenom: "Sophie",
      departement: "Finance",
      typeDemande: "Demande de congé",
      statut: "Complété",
      dateDemande: "01/04/2025",
      dateDebut: "12/04/2025",
      dateFin: "14/04/2025",
      motif: "Raison familiale",
      commentaire: "Besoin de m'absenter pour un événement familial important.",
      reponse: "Demande approuvée.",
    },
    {
      id: 5,
      employeId: 1,
      nom: "Dupont",
      prenom: "Jean",
      departement: "Marketing",
      typeDemande: "Demande de formation",
      statut: "En attente",
      dateDemande: "08/04/2025",
      formation: "Marketing digital",
      cout: "1800",
      dateDebut: "10/05/2025",
      dateFin: "12/05/2025",
      motif: "Formation professionnelle",
      commentaire:
        "Cette formation me permettrait de mieux comprendre les nouvelles stratégies de marketing digital.",
      reponse: "",
    },
  ]);

  const [demandesAffichees, setDemandesAffichees] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("tous");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const [expandedRowId, setExpandedRowId] = useState(null);
  
  // État pour les toasts
  const [toasts, setToasts] = useState([]);

  // Filtrer les demandes en fonction de la recherche et des filtres
  useEffect(() => {
    let filtres = [...demandes];

    // Filtre par type de demande
    if (filtreType !== "tous") {
      filtres = filtres.filter((d) => d.typeDemande === filtreType);
    }

    // Filtre par statut
    if (filtreStatut !== "tous") {
      filtres = filtres.filter((d) => d.statut === filtreStatut);
    }

    // Filtre par recherche (nom ou ID)
    if (recherche !== "") {
      filtres = filtres.filter((demande) => {
        const searchTerm = recherche.toLowerCase();
        return (
          demande.nom.toLowerCase().includes(searchTerm) ||
          demande.prenom.toLowerCase().includes(searchTerm) ||
          demande.employeId.toString().includes(searchTerm)
        );
      });
    }

    setDemandesAffichees(filtres);
  }, [recherche, filtreType, filtreStatut, demandes]);

  // Basculer l'affichage des détails d'une demande
  const toggleExpandedRow = (id) => {
    setExpandedRowId(expandedRowId === id ? null : id);
  };

  // Fonction pour ajouter un toast
  const addToast = (type, message) => {
    const id = Date.now();
    setToasts((prevToasts) => [...prevToasts, { id, type, message }]);
  };

  // Fonction pour supprimer un toast
  const removeToast = (id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  // Fonction pour accepter une demande
  const accepterDemande = (e, demande) => {
    e.stopPropagation(); // Empêcher la propagation du clic
    
    // Mettre à jour l'état de la demande
    const demandesUpdated = demandes.map((d) => {
      if (d.id === demande.id) {
        return {
          ...d,
          statut: "Complété",
          reponse: "Demande approuvée le " + new Date().toLocaleDateString(),
        };
      }
      return d;
    });
    
    setDemandes(demandesUpdated);
    
    // Afficher le toast
    addToast("success", `Demande de ${demande.prenom} ${demande.nom} acceptée avec succès`);
  };

  // Fonction pour refuser une demande
  const refuserDemande = (e, demande) => {
    e.stopPropagation(); // Empêcher la propagation du clic
    
    // Mettre à jour l'état de la demande
    const demandesUpdated = demandes.map((d) => {
      if (d.id === demande.id) {
        return {
          ...d,
          statut: "Refusé",
          reponse: "Demande refusée le " + new Date().toLocaleDateString(),
        };
      }
      return d;
    });
    
    setDemandes(demandesUpdated);
    
    // Afficher le toast
    addToast("error", `Demande de ${demande.prenom} ${demande.nom} refusée`);
  };

  // Rendu des détails du formulaire de demande
  const renderFormDetails = (demande) => {
    switch (demande.typeDemande) {
      case "Demande de congé":
        return (
          <>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Date de début:</span>
              <span className="gdp-detail-value">{demande.dateDebut}</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Date de fin:</span>
              <span className="gdp-detail-value">{demande.dateFin}</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Motif:</span>
              <span className="gdp-detail-value">{demande.motif}</span>
            </div>
          </>
        );
      case "Demande d'avance sur salaire":
        return (
          <>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Montant demandé:</span>
              <span className="gdp-detail-value">{demande.montant} €</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Motif:</span>
              <span className="gdp-detail-value">{demande.motif}</span>
            </div>
          </>
        );
      case "Demande de formation":
        return (
          <>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Formation:</span>
              <span className="gdp-detail-value">{demande.formation}</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Coût:</span>
              <span className="gdp-detail-value">{demande.cout} €</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Date de début:</span>
              <span className="gdp-detail-value">{demande.dateDebut}</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Date de fin:</span>
              <span className="gdp-detail-value">{demande.dateFin}</span>
            </div>
            <div className="gdp-detail-row">
              <span className="gdp-detail-label">Motif:</span>
              <span className="gdp-detail-value">{demande.motif}</span>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Rendu du statut avec l'icône appropriée
  const renderStatus = (statut) => {
    switch (statut) {
      case "Complété":
        return (
          <span className="gdp-status-badge gdp-status-completed">
            <Check size={14} />
            Complété
          </span>
        );
      case "En attente":
        return (
          <span className="gdp-status-badge gdp-status-pending">
            <AlertCircle size={14} />
            En attente
          </span>
        );
      case "Refusé":
        return (
          <span className="gdp-status-badge gdp-status-rejected">
            <X size={14} />
            Refusé
          </span>
        );
      default:
        return null;
    }
  };

  // Rendu des boutons d'action en fonction du statut
  const renderActionButtons = (demande) => {
    // Si la demande n'est pas en attente, désactiver les boutons
    if (demande.statut !== "En attente") {
      return (
        <div className="gdp-action-buttons">
          <button className="gdp-btn gdp-btn-disabled" disabled>
            <ThumbsUp size={16} />
            Accepter
          </button>
          <button className="gdp-btn gdp-btn-disabled" disabled>
            <ThumbsDown size={16} />
            Refuser
          </button>
        </div>
      );
    }

    return (
      <div className="gdp-action-buttons">
        <button 
          className="gdp-btn gdp-btn-success"
          onClick={(e) => accepterDemande(e, demande)}
        >
          <ThumbsUp size={16} />
          Accepter
        </button>
        <button 
          className="gdp-btn gdp-btn-danger"
          onClick={(e) => refuserDemande(e, demande)}
        >
          <ThumbsDown size={16} />
          Refuser
        </button>
      </div>
    );
  };

  return (
    <>
      <div
        className={
          "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"
        }
      >
        {/* Injection du CSS */}
        <style>{encapsulatedStyles}</style>

        <div className="gdp-container">
          <div className="gdp-header-section">
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                color: "#1f2937",
              }}
            >
              Gestion des demandes de personnel
            </h1>

            {/* Partie recherche et filtration */}
            <div className="gdp-search-container">
              <div className="gdp-search-input">
                <div className="gdp-search-icon">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher par nom ou ID d'employé"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="gdp-form-input"
                  style={{ paddingLeft: "2.5rem" }}
                />
              </div>

              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Filter size={20} style={{ color: "#9ca3af" }} />
                <select
                  value={filtreType}
                  onChange={(e) => setFiltreType(e.target.value)}
                  className="gdp-form-select"
                >
                  <option value="tous">Tous les types</option>
                  <option value="Demande de congé">Demande de congé</option>
                  <option value="Demande d'avance sur salaire">
                    Demande d'avance sur salaire
                  </option>
                  <option value="Demande de formation">
                    Demande de formation
                  </option>
                </select>
              </div>
            </div>

            {/* Onglets de filtration par statut */}
            <div
              style={{
                display: "flex",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <button
                className={`gdp-tab-button ${
                  filtreStatut === "tous" ? "gdp-active" : ""
                }`}
                onClick={() => setFiltreStatut("tous")}
              >
                Tous
              </button>
              <button
                className={`gdp-tab-button ${
                  filtreStatut === "Complété" ? "gdp-active" : ""
                }`}
                onClick={() => setFiltreStatut("Complété")}
              >
                Complété
              </button>
              <button
                className={`gdp-tab-button ${
                  filtreStatut === "En attente" ? "gdp-active" : ""
                }`}
                onClick={() => setFiltreStatut("En attente")}
              >
                En attente
              </button>
              <button
                className={`gdp-tab-button ${
                  filtreStatut === "Refusé" ? "gdp-active" : ""
                }`}
                onClick={() => setFiltreStatut("Refusé")}
              >
                Refusé
              </button>
            </div>

            {/* Tableau des demandes */}
            <div className="gdp-table-container">
              <table className="gdp-table">
                <thead>
                  <tr>
                    <th className="gdp-th" style={{ width: "5%" }}></th>
                    <th className="gdp-th" style={{ width: "8%" }}>
                      ID
                    </th>
                    <th className="gdp-th" style={{ width: "15%" }}>
                      Nom
                    </th>
                    <th className="gdp-th" style={{ width: "15%" }}>
                      Prénom
                    </th>
                    <th className="gdp-th" style={{ width: "12%" }}>
                      Département
                    </th>
                    <th className="gdp-th" style={{ width: "25%" }}>
                      Type de demande
                    </th>
                    <th className="gdp-th" style={{ width: "20%" }}>
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {demandesAffichees.length > 0 ? (
                    demandesAffichees.map((demande) => (
                      <>
                        <tr
                          key={demande.id}
                          className="gdp-tr"
                          onClick={() => toggleExpandedRow(demande.id)}
                        >
                          <td
                            className="gdp-td"
                            style={{ textAlign: "center" }}
                          >
                            {expandedRowId === demande.id ? (
                              <ChevronUp
                                size={20}
                                className="gdp-expander-icon"
                              />
                            ) : (
                              <ChevronDown
                                size={20}
                                className="gdp-expander-icon"
                              />
                            )}
                          </td>
                          <td className="gdp-td">{demande.employeId}</td>
                          <td className="gdp-td" style={{ fontWeight: 500 }}>
                            {demande.nom}
                          </td>
                          <td className="gdp-td" style={{ fontWeight: 500 }}>
                            {demande.prenom}
                          </td>
                          <td className="gdp-td">
                            <span className="gdp-department-badge">
                              {demande.departement}
                            </span>
                          </td>
                          <td className="gdp-td">
                            <span className="gdp-type-badge">
                              {demande.typeDemande}
                            </span>
                          </td>
                          <td className="gdp-td">
                            {renderStatus(demande.statut)}
                          </td>
                        </tr>
                        {expandedRowId === demande.id && (
                          <tr className="gdp-expanded-row">
                            <td colSpan="7" className="gdp-expanded-content">
                              <h3 className="gdp-expanded-title">
                                Détails de la demande #{demande.id}
                              </h3>

                              <div className="gdp-detail-row">
                                <span className="gdp-detail-label">
                                  Employé:
                                </span>
                                <span className="gdp-detail-value">
                                  {demande.nom} {demande.prenom} (ID:{" "}
                                  {demande.employeId})
                                </span>
                              </div>
                              <div className="gdp-detail-row">
                                <span className="gdp-detail-label">
                                  Type de demande:
                                </span>
                                <span className="gdp-detail-value">
                                  {demande.typeDemande}
                                </span>
                              </div>

                              <div className="gdp-detail-row">
                                <span className="gdp-detail-label">
                                  Date de la demande:
                                </span>
                                <span className="gdp-detail-value">
                                  {demande.dateDemande}
                                </span>
                              </div>

                              {renderFormDetails(demande)}

                              <div className="gdp-detail-row">
                                <span className="gdp-detail-label">
                                  Commentaire:
                                </span>
                                <span className="gdp-detail-value">
                                  {demande.commentaire}
                                </span>
                              </div>

                              <div className="gdp-detail-row">
                                <span className="gdp-detail-label">
                                  Statut:
                                </span>
                                <span className="gdp-detail-value">
                                  {renderStatus(demande.statut)}
                                </span>
                              </div>

                              {demande.reponse && (
                                <div className="gdp-detail-row">
                                  <span className="gdp-detail-label">
                                    Réponse:
                                  </span>
                                  <span className="gdp-detail-value">
                                    {demande.reponse}
                                  </span>
                                </div>
                              )}
                              
                              {/* Ajout des boutons d'action */}
                              {renderActionButtons(demande)}
                            </td>
                          </tr>
                        )}
                      </>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="gdp-td"
                        style={{
                          textAlign: "center",
                          color: "#6b7280",
                          padding: "1.5rem 0",
                        }}
                      >
                        Aucune demande trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="gdp-pagination">
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Affichage de {demandesAffichees.length} sur {demandes.length}{" "}
                demandes
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="gdp-page-button">Précédent</button>
                <button className="gdp-page-button gdp-active">1</button>
                <button className="gdp-page-button">2</button>
                <button className="gdp-page-button">Suivant</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteneur des toasts */}
      <div className="gdp-toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </>
  );
}