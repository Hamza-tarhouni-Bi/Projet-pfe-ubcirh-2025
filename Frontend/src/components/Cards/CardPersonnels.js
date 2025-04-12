import { useState, useEffect } from 'react';
import { Search, Edit, Trash, Plus, X, Check, Filter, Eye, Copy } from 'lucide-react';

// CSS encapsulé avec préfixe "gp-" (Gestion Personnel)
const encapsulatedStyles = `
  .gp-personnel-container {
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
  
  .gp-tab-button {
    padding: 0.5rem 1rem;
    border-bottom: 2px solid transparent;
    color: #6b7280;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-tab-button.gp-active {
    border-bottom-color: #14b8a6;
    color: #14b8a6;
  }
  
  .gp-tab-button:hover:not(.gp-active) {
    color: #374151;
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
  
  .gp-department-badge {
    background-color: #e6fffa;
    color: #047857;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gp-status-badge {
    background-color: #dcfce7;
    color: #166534;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
  
  .gp-action-button {
    padding: 0.375rem;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-view-button {
    background-color: #e6fffa;
    color: #0d9488;
  }
  
  .gp-view-button:hover {
    background-color: #ccfbf1;
  }
  
  .gp-edit-button {
    background-color: #dbeafe;
    color: #3b82f6;
  }
  
  .gp-edit-button:hover {
    background-color: #bfdbfe;
  }
  
  .gp-delete-button {
    background-color: #fee2e2;
    color: #ef4444;
  }
  
  .gp-delete-button:hover {
    background-color: #fecaca;
  }
  
  .gp-add-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background-color: #14b8a6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .gp-add-button:hover {
    background-color: #0d9488;
  }
  
  .gp-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding: 0 1rem;
  }
  
  .gp-page-button {
    padding: 0.375rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .gp-page-button.gp-active {
    background-color: #14b8a6;
    color: white;
    border-color: #14b8a6;
  }
  
  .gp-page-button:hover:not(.gp-active) {
    background-color: #f9fafb;
  }
  
  .gp-employee-image {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 9999px;
    object-fit: cover;
    border: 2px solid #99f6e4;
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
   max-height: 90vh; /* Utilise 90% de la hauteur de l'écran */
  overflow-y: auto; 
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  width: 100%;
  max-width: 50rem; 
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
  
  .gp-form-group {
    margin-bottom: 1rem;
  }
  
  .gp-form-label {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }
  
  .gp-form-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-form-input:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
  }
  
  .gp-form-input:disabled {
    background-color: #f3f4f6;
  }
  
  .gp-form-select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    transition: all 0.2s ease;
  }
  
  .gp-form-select:focus {
    outline: none;
    border-color: #14b8a6;
    box-shadow: 0 0 0 2px rgba(20, 184, 166, 0.2);
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
  
  .gp-btn-save {
    background-color: #14b8a6;
    color: white;
  }
  
  .gp-btn-save:hover {
    background-color: #0d9488;
  }
  
  .gp-details-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .gp-details-image {
    width: 6rem;
    height: 6rem;
    border-radius: 9999px;
    margin-bottom: 0.75rem;
    object-fit: cover;
    border: 3px solid #99f6e4;
  }
  
  .gp-details-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
  }
  
  .gp-details-department {
    color: #6b7280;
  }
  
  .gp-details-row {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  .gp-details-label {
    width: 33.333333%;
    font-weight: 500;
    color: #374151;
  }
  
  .gp-details-value {
    color: #4b5563;
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
  
  .gp-toast-info {
    background-color: #3b82f6;
  }

  .gp-password-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .gp-password-input {
    flex: 1;
  }

  .gp-copy-button {
    background-color: #dbeafe;
    color: #3b82f6;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .gp-copy-button:hover {
    background-color: #bfdbfe;
  }

  .gp-generate-button {
    background-color: #e6fffa;
    color: #0d9488;
    padding: 0.5rem;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .gp-generate-button:hover {
    background-color: #ccfbf1;
  }

  .gp-conge-badge {
    background-color: #f0f9ff;
    color: #0369a1;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
`;

// Fonction pour générer un mot de passe aléatoire
const generatePassword = () => {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Composant Modal pour les détails
const DetailsModal = ({ employe, onClose }) => {
  if (!employe) return null;
  
  return (
    <div className="gp-modal-overlay">
      <div className="gp-modal-container">
        <div className="gp-modal-header">
          <h2 className="gp-modal-title">Détails de l'employé</h2>
          <button onClick={onClose} className="gp-modal-close">
            <X size={24} />
          </button>
        </div>
        
        <div className="gp-details-container">
          <img src={employe.image} alt="Employé" className="gp-details-image" />
          <h3 className="gp-details-name">{employe.nom} {employe.prenom}</h3>
          <p className="gp-details-department">{employe.departement}</p>
        </div>
        
        <div>
          <div className="gp-details-row">
            <span className="gp-details-label">ID:</span>
            <span className="gp-details-value">{employe.id}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Nom complet:</span>
            <span className="gp-details-value">{employe.nom} {employe.prenom}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Sexe:</span>
            <span className="gp-details-value">{employe.sexe}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Email:</span>
            <span className="gp-details-value">{employe.email}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Département:</span>
            <span className="gp-details-value">{employe.departement}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Date d'embauche:</span>
            <span className="gp-details-value">{employe.dateEmbauche || "01/01/2023"}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Solde de congé:</span>
            <span className="gp-conge-badge">
              {employe.soldeConge || 30} jours restants
            </span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Statut:</span>
            <span className="gp-status-badge">
              Actif
            </span>
          </div>
        </div>
        
        <div className="gp-modal-footer">
          <button 
            onClick={onClose}
            className="gp-btn gp-btn-cancel"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de toast pour les notifications
const Toast = ({ message, type, onClose }) => {
  const toastClass = type === 'success' ? 'gp-toast-success' : 
                  type === 'error' ? 'gp-toast-error' : 'gp-toast-info';
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`gp-toast ${toastClass}`}>
      {type === 'success' && <Check size={20} />}
      {type === 'error' && <X size={20} />}
      {type === 'info' && <Search size={20} />}
      <p>{message}</p>
    </div>
  );
};

// Composant principal de gestion du personnel
export default function GestionPersonnel() {
  // Données des employés
  const [employes, setEmployes] = useState([
    { 
      id: 1, 
      image: "", 
      nom: "Dupont", 
      prenom: "Jean",
      email: "jean.dupont@example.com", 
      departement: "Marketing", 
      sexe: "Homme", 
      dateEmbauche: "15/02/2022",
      soldeConge: 25,
      password: generatePassword()
    },
    { 
      id: 2, 
      image: "", 
      nom: "Lambert", 
      prenom: "Marie",
      email: "marie.lambert@example.com", 
      departement: "RH", 
      sexe: "Femme", 
      dateEmbauche: "03/05/2023",
      soldeConge: 30,
      password: generatePassword()
    },
    { 
      id: 3, 
      image: "", 
      nom: "Martin", 
      prenom: "Paul",
      email: "paul.martin@example.com", 
      departement: "Technique", 
      sexe: "Homme", 
      dateEmbauche: "10/12/2021",
      soldeConge: 18,
      password: generatePassword()
    },
    { 
      id: 4, 
      image: "", 
      nom: "Bernard", 
      prenom: "Sophie",
      email: "sophie.bernard@example.com", 
      departement: "Finance", 
      sexe: "Femme", 
      dateEmbauche: "22/08/2023",
      soldeConge: 30,
      password: generatePassword()
    }
  ]);
  
  const [employesAffiches, setEmployesAffiches] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreType, setFiltreType] = useState("nom");
  const [filtreDepartement, setFiltreDepartement] = useState("tous");
  const [modalOuvert, setModalOuvert] = useState(false);
  const [detailsModalOuvert, setDetailsModalOuvert] = useState(false);
  const [suppressionModalOuvert, setSuppressionModalOuvert] = useState(false);
  const [employeActuel, setEmployeActuel] = useState(null);
  const [employeDetails, setEmployeDetails] = useState(null);
  const [employeASupprimer, setEmployeASupprimer] = useState(null);
  const [toast, setToast] = useState({ affiche: false, message: "", type: "" });

  // Nouvel employé vide pour le formulaire d'ajout
  const employeVide = { 
    id: "", 
    image: "", 
    nom: "", 
    prenom: "",
    email: "", 
    departement: "", 
    sexe: "",
    dateEmbauche: new Date().toLocaleDateString('fr-FR'),
    soldeConge: 30,
    password: generatePassword()
  };
  
  // Filtrer les employés en fonction de la recherche et du département
  useEffect(() => {
    let filtres = [...employes];
    
    // Filtre par département
    if (filtreDepartement !== "tous") {
      filtres = filtres.filter(e => e.departement === filtreDepartement);
    }
    
    // Filtre par recherche
    if (recherche !== "") {
      filtres = filtres.filter(employe => {
        if (filtreType === "nom") {
          return employe.nom.toLowerCase().includes(recherche.toLowerCase()) || 
                 employe.prenom.toLowerCase().includes(recherche.toLowerCase());
        } else {
          return employe.id.toString().includes(recherche);
        }
      });
    }
    
    setEmployesAffiches(filtres);
  }, [recherche, filtreType, filtreDepartement, employes]);

  // Afficher un toast
  const afficherToast = (message, type) => {
    setToast({ affiche: true, message, type });
  };

  // Fermer le toast
  const fermerToast = () => {
    setToast({ ...toast, affiche: false });
  };

  // Ouvrir le modal pour ajouter/modifier un employé
  const ouvrirModal = (employe = null) => {
    const nouvelId = employes.length > 0 ? Math.max(...employes.map(e => e.id)) + 1 : 1;
    setEmployeActuel(employe || { 
      ...employeVide, 
      id: nouvelId,
      password: generatePassword()
    });
    setModalOuvert(true);
  };

  // Fermer le modal
  const fermerModal = () => {
    setModalOuvert(false);
    setEmployeActuel(null);
  };
  
  // Ouvrir le modal de détails
  const ouvrirDetailsModal = (employe) => {
    setEmployeDetails(employe);
    setDetailsModalOuvert(true);
  };
  
  // Fermer le modal de détails
  const fermerDetailsModal = () => {
    setDetailsModalOuvert(false);
    setEmployeDetails(null);
  };

  // Ouvrir le modal de confirmation de suppression
  const ouvrirSuppressionModal = (employe) => {
    setEmployeASupprimer(employe);
    setSuppressionModalOuvert(true);
  };

  // Fermer le modal de confirmation de suppression
  const fermerSuppressionModal = () => {
    setSuppressionModalOuvert(false);
    setEmployeASupprimer(null);
  };

  // Gérer les changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeActuel(prev => ({ ...prev, [name]: value }));
  };

  // Générer un nouveau mot de passe
  const genererNouveauMotDePasse = () => {
    setEmployeActuel(prev => ({ ...prev, password: generatePassword() }));
  };

  // Copier le mot de passe dans le presse-papiers
  const copierMotDePasse = () => {
    navigator.clipboard.writeText(employeActuel.password);
    afficherToast("Mot de passe copié !", "success");
  };

  // Sauvegarder l'employé (ajout ou modification)
  const sauvegarderEmploye = () => {
    // Vérifier si tous les champs sont remplis
    if (!employeActuel.nom || !employeActuel.prenom || !employeActuel.email || !employeActuel.departement || !employeActuel.sexe) {
      afficherToast("Veuillez remplir tous les champs", "error");
      return;
    }

    // Vérifier si c'est une modification ou un ajout
    const index = employes.findIndex(e => e.id === employeActuel.id);
    
    if (index !== -1) {
      // Modification
      const nouveauxEmployes = [...employes];
      nouveauxEmployes[index] = employeActuel;
      setEmployes(nouveauxEmployes);
      afficherToast("Employé modifié avec succès", "success");
    } else {
      // Ajout
      setEmployes([...employes, employeActuel]);
      afficherToast("Employé ajouté avec succès", "success");
    }
    
    fermerModal();
  };

  // Supprimer un employé après confirmation
  const confirmerSuppression = () => {
    if (employeASupprimer) {
      setEmployes(employes.filter(e => e.id !== employeASupprimer.id));
      afficherToast("Employé supprimé avec succès", "error");
      fermerSuppressionModal();
    }
  };

  return (
    <>
      {/* Injection du CSS */}
      <style>{encapsulatedStyles}</style>
      
      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded"}>
        <div className="gp-personnel-container">
          <div className="gp-header-section">
            <h1 className="gp-modal-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Gestion du Personnel</h1>
            
            {/* Partie recherche et filtration */}
            <div className="gp-search-container">
              <div className="gp-search-input">
                <div className="gp-search-icon">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder={`Rechercher par ${filtreType === 'nom' ? 'nom' : 'ID'}`}
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="gp-form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Filter size={20} style={{ color: '#9ca3af' }} />
                <select 
                  value={filtreType} 
                  onChange={(e) => setFiltreType(e.target.value)}
                  className="gp-form-select"
                >
                  <option value="nom">Filtrer par Nom</option>
                  <option value="id">Filtrer par ID</option>
                </select>
              </div>
              
              <button 
                onClick={() => ouvrirModal()}
                className="gp-add-button"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>
            
            {/* Onglets de filtration */}
            <div style={{ display: 'flex', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
              <button 
                className={`gp-tab-button ${filtreDepartement === "tous" ? "gp-active" : ""}`}
                onClick={() => setFiltreDepartement("tous")}
              >
                Tous
              </button>
              <button 
                className={`gp-tab-button ${filtreDepartement === "Marketing" ? "gp-active" : ""}`}
                onClick={() => setFiltreDepartement("Marketing")}
              >
                Marketing
              </button>
              <button 
                className={`gp-tab-button ${filtreDepartement === "Technique" ? "gp-active" : ""}`}
                onClick={() => setFiltreDepartement("Technique")}
              >
                Technique
              </button>
              <button 
                className={`gp-tab-button ${filtreDepartement === "RH" ? "gp-active" : ""}`}
                onClick={() => setFiltreDepartement("RH")}
              >
                RH
              </button>
              <button 
                className={`gp-tab-button ${filtreDepartement === "Finance" ? "gp-active" : ""}`}
                onClick={() => setFiltreDepartement("Finance")}
              >
                Finance
              </button>
            </div>
            
            {/* Tableau des employés */}
            <div className="gp-table-container">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th className="gp-th">ID</th>
                    <th className="gp-th">Image</th>
                    <th className="gp-th">Nom</th>
                    <th className="gp-th">Prénom</th>
                    <th className="gp-th">Email</th>
                    <th className="gp-th">Département</th>
                    <th className="gp-th">Solde Congé</th>
                    <th className="gp-th" style={{ textAlign: 'center' }}>Statut</th>
                    <th className="gp-th" style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employesAffiches.length > 0 ? (
                    employesAffiches.map((employe) => (
                      <tr className="gp-tr" key={employe.id}>
                        <td className="gp-td">{employe.id}</td>
                        <td className="gp-td">
                          <img src={employe.image} alt="" className="gp-employee-image" />
                        </td>
                        <td className="gp-td" style={{ fontWeight: 500 }}>{employe.nom}</td>
                        <td className="gp-td" style={{ fontWeight: 500 }}>{employe.prenom}</td>
                        <td className="gp-td">{employe.email}</td>
                        <td className="gp-td">
                          <span className="gp-department-badge">
                            {employe.departement}
                          </span>
                        </td>
                        <td className="gp-td">
                          <span className="gp-conge-badge">
                            {employe.soldeConge} jours
                          </span>
                        </td>
                        <td className="gp-td" style={{ textAlign: 'center' }}>
                          <span className="gp-status-badge">
                            Actif
                          </span>
                        </td>
                        <td className="gp-td">
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                            <button 
                              onClick={() => ouvrirDetailsModal(employe)} 
                              className="gp-action-button gp-view-button"
                              title="Voir détails"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => ouvrirModal(employe)} 
                              className="gp-action-button gp-edit-button"
                              title="Modifier"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => ouvrirSuppressionModal(employe)} 
                              className="gp-action-button gp-delete-button"
                              title="Supprimer"
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="gp-td" style={{ textAlign: 'center', color: '#6b7280', padding: '1.5rem 0' }}>
                        Aucun employé trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="gp-pagination">
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                Affichage de {employesAffiches.length} sur {employes.length} employés
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="gp-page-button">
                  Précédent
                </button>
                <button className="gp-page-button gp-active">
                  1
                </button>
                <button className="gp-page-button">
                  2
                </button>
                <button className="gp-page-button">
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Modal pour ajouter/modifier un employé */}
        {modalOuvert && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">
                  {employeActuel && employes.some(e => e.id === employeActuel.id) 
                    ? "Modifier un employé" 
                    : "Ajouter un employé"
                  }
                </h2>
                <button onClick={fermerModal} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>
              
              <div>
                <div className="gp-form-group">
                  <label className="gp-form-label">ID</label>
                  <input 
                    type="number" 
                    name="id" 
                    value={employeActuel?.id || ""} 
                    disabled 
                    className="gp-form-input"
                    style={{ backgroundColor: '#f3f4f6' }}
                  />
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Nom</label>
                  <input 
                    type="text" 
                    name="nom" 
                    value={employeActuel?.nom || ""} 
                    onChange={handleChange} 
                    className="gp-form-input"
                  />
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Prénom</label>
                  <input 
                    type="text" 
                    name="prenom" 
                    value={employeActuel?.prenom || ""} 
                    onChange={handleChange} 
                    className="gp-form-input"
                  />
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={employeActuel?.email || ""} 
                    onChange={handleChange} 
                    className="gp-form-input"
                  />
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Mot de passe</label>
                  <div className="gp-password-container">
                    <input 
                      type="text" 
                      name="password" 
                      value={employeActuel?.password || ""} 
                      onChange={handleChange} 
                      className="gp-form-input gp-password-input"
                      readOnly
                    />
                    <button 
                      onClick={copierMotDePasse}
                      className="gp-copy-button"
                      title="Copier le mot de passe"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={genererNouveauMotDePasse}
                    className="gp-generate-button"
                  >
                    Générer un nouveau mot de passe
                  </button>
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Département</label>
                  <select 
                    name="departement" 
                    value={employeActuel?.departement || ""} 
                    onChange={handleChange} 
                    className="gp-form-select"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Marketing">Marketing</option>
                    <option value="RH">RH</option>
                    <option value="Technique">Technique</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Sexe</label>
                  <select 
                    name="sexe" 
                    value={employeActuel?.sexe || ""} 
                    onChange={handleChange} 
                    className="gp-form-select"
                  >
                    <option value="">Sélectionner</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Solde de congé (jours)</label>
                  <input 
                    type="number" 
                    name="soldeConge" 
                    min="0"
                    max="30"
                    value={employeActuel?.soldeConge || 30} 
                    onChange={handleChange} 
                    className="gp-form-input"
                  />
                </div>
                
                <div className="gp-form-group">
                  <label className="gp-form-label">Date d'embauche</label>
                  <input 
                    type="text" 
                    name="dateEmbauche" 
                    value={employeActuel?.dateEmbauche || ""} 
                    onChange={handleChange} 
                    className="gp-form-input"
                    placeholder="JJ/MM/AAAA"
                  />
                </div>
                
                <div className="gp-modal-footer">
                  <button 
                    onClick={fermerModal} 
                    className="gp-btn gp-btn-cancel"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={sauvegarderEmploye} 
                    className="gp-btn gp-btn-save"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal pour afficher les détails */}
        {detailsModalOuvert && (
          <DetailsModal employe={employeDetails} onClose={fermerDetailsModal} />
        )}
        
        {/* Modal de confirmation de suppression */}
        {suppressionModalOuvert && employeASupprimer && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Confirmation de suppression</h2>
                <button onClick={fermerSuppressionModal} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>
              
              <div>
                <p style={{ marginBottom: '1.5rem', color: '#4b5563' }}>
                  Êtes-vous sûr de vouloir supprimer l'employé <strong>{employeASupprimer.nom} {employeASupprimer.prenom}</strong> ?
                </p>
                
                <div className="gp-modal-footer">
                  <button 
                    onClick={fermerSuppressionModal} 
                    className="gp-btn gp-btn-cancel"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmerSuppression} 
                    className="gp-btn gp-btn-save"
                    style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                  >
                    Supprimer
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