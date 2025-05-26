import { useState, useEffect } from "react";
import {
  Search,
  Edit,
  Trash,
  Plus,
  X,
  Check,
  Filter,
  Eye,
  Copy,
} from "lucide-react";
import "../../assets/styles/PersonnelStyle.css";
import axios from "axios";

// générer un mot de passe aléatoire
const generatePassword = () => {
  const length = 10;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Fonctions de validation
const isPhoneValid = (phone) => /^[2579]\d{7}$/.test(phone);
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isAlpha = (str) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(str);

// Composant Modal pour les détails
const DetailsModal = ({ employe, onClose }) => {
  if (!employe) return null;

  return (
    <div className="gp-modal-overlay">
      <div className="gp-modal-container">
        <div className="gp-modal-header">
          <h2 className="gp-modal-title">Détails du personnel:</h2>
          <button onClick={onClose} className="gp-modal-close">
            <X size={24} />
          </button>
        </div>

        <div className="gp-details-container">
          <h3 className="gp-details-name">
            {employe.nom} {employe.prenom}
          </h3>
          <p className="gp-details-department">{employe.departement}</p>
        </div>

        <div>
          <div className="gp-details-row">
            <span className="gp-details-label">ID:</span>
            <span className="gp-details-value">{employe._id}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Nom complet:</span>
            <span className="gp-details-value">
              {employe.nom} {employe.prenom}
            </span>
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
            <span className="gp-details-label">Téléphone:</span>
            <span className="gp-details-value">{employe.tel}</span>
          </div>
          <div className="gp-details-row">
            <span className="gp-details-label">Département:</span>
            <span className="gp-details-value">{employe.departement}</span>
          </div>

          <div className="gp-details-row">
            <span className="gp-details-label">Salaire:</span>
            <span className="gp-salary-badge">
              {employe.salaire ? `${employe.salaire} TND` : "Non défini"}
            </span>
          </div>

          <div className="gp-details-row">
            <span className="gp-details-label">Solde de congé:</span>
            <span className="gp-conge-badge">
              {employe.soldeConge || employe.soldedeconge || 30} jours restants
            </span>
          </div>

          <div className="gp-details-row">
            <span className="gp-details-label">Statut:</span>
            <span className="gp-status-badge">Actif</span>
          </div>
        </div>

        <div className="gp-modal-footer">
          <button onClick={onClose} className="gp-btn gp-btn-cancel">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant de toast pour les notifications
const Toast = ({ message, type, onClose }) => {
  const toastClass =
    type === "success"
      ? "gp-toast-success"
      : type === "error"
      ? "gp-toast-error"
      : "gp-toast-info";

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`gp-toast ${toastClass}`}>
      {type === "success" && <Check size={20} />}
      {type === "error" && <X size={20} />}
      {type === "info" && <Search size={20} />}
      <p>{message}</p>
    </div>
  );
};

// Composant principal de gestion du personnel
export default function GestionPersonnel() {
  // Données des employés
  const [employes, setEmployes] = useState([]);
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
  const [departements, setDepartements] = useState([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Charger les départements
  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await fetch("/api/alldepartment");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des départements");
        }
        const data = await response.json();
        setDepartements(data);
      } catch (error) {
        console.error("Erreur:", error);
        afficherToast("Erreur lors du chargement des départements", "error");
      }
    };

    fetchDepartements();
  }, []);

  // Nouvel employé vide pour le formulaire d'ajout
  const employeVide = {
    id: "",
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    departement: "",
    sexe: "",
    salaire: "",
    soldeConge: 30,
    password: generatePassword(),
  };

  // Filtrer les employés en fonction de la recherche et du département
  useEffect(() => {
    let filtres = [...employes];

    // Filtre par département
    if (filtreDepartement !== "tous") {
      filtres = filtres.filter((e) => e.departement === filtreDepartement);
    }

    // Filtre par recherche
    if (recherche !== "") {
      filtres = filtres.filter((employe) => {
        if (filtreType === "nom") {
          return (
            employe.nom.toLowerCase().includes(recherche.toLowerCase()) ||
            employe.prenom.toLowerCase().includes(recherche.toLowerCase())
          );
        } else if (filtreType === "id") {
          return employe._id.toString().includes(recherche);
        }
        return true;
      });
    }

    setEmployesAffiches(filtres);
    setCurrentPage(1); // Reset à la première page quand les filtres changent
  }, [recherche, filtreType, filtreDepartement, employes]);

  // Afficher un toast
  const afficherToast = (message, type) => {
    setToast({ affiche: true, message, type });
  };

  // Fermer le toast
  const fermerToast = () => {
    setToast({ ...toast, affiche: false });
  };

  // Ouvrir le modal d'ajout/modification
  const ouvrirModal = (employe = null) => {
    if (employe) {
      setEmployeActuel({
        _id: employe._id,
        nom: employe.nom,
        prenom: employe.prenom,
        email: employe.email,
        telephone: employe.tel,
        departement: employe.departement,
        sexe: employe.sexe.charAt(0).toUpperCase() + employe.sexe.slice(1),
        salaire: employe.salaire,
        soldeConge: employe.soldedeconge || 30,
        password: employe.password || "",
      });
    } else {
      setEmployeActuel({
        ...employeVide,
        password: generatePassword(),
      });
    }
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
    setEmployeActuel((prev) => ({ ...prev, [name]: value }));
  };

  // Générer un nouveau mot de passe
  const genererNouveauMotDePasse = () => {
    setEmployeActuel((prev) => ({ ...prev, password: generatePassword() }));
  };

  // Copier le mot de passe dans le presse-papiers
  const copierMotDePasse = () => {
    navigator.clipboard.writeText(employeActuel.password);
    afficherToast("Mot de passe copié !", "success");
  };

  // Charger la liste des employés
  useEffect(() => {
    const fetchEmployes = async () => {
      try {
        const response = await axios.get("/api/allpersonnel");
        // Filtrer pour exclure les DRH
        const filteredEmployes = response.data.filter(employe => 
          !employe.role || employe.role.toLowerCase() !== "drh"
        );
        setEmployes(filteredEmployes);
      } catch (error) {
        console.error("Erreur lors du chargement des employés:", error);
        afficherToast("Erreur lors du chargement des employés", "error");
      }
    };

    fetchEmployes();
  }, []);

  // Logique de pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employesAffiches.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(employesAffiches.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sauvegarder l'employé (ajout ou modification)
  const sauvegarderEmploye = async () => {
    // Validation des champs obligatoires
    if (
      !employeActuel.nom ||
      !employeActuel.prenom ||
      !employeActuel.email ||
      !employeActuel.telephone ||
      !employeActuel.departement ||
      !employeActuel.sexe
    ) {
      afficherToast("Veuillez remplir tous les champs obligatoires (*)", "error");
      return;
    }

    // Validation nom et prénom alphabétiques
    if (!isAlpha(employeActuel.nom)) {
      afficherToast("Le nom ne doit contenir que des lettres", "error");
      return;
    }

    if (!isAlpha(employeActuel.prenom)) {
      afficherToast("Le prénom ne doit contenir que des lettres", "error");
      return;
    }

    // Validation email
    if (!isEmailValid(employeActuel.email)) {
      afficherToast("Veuillez entrer une adresse email valide (ex: exemple@domaine.com)", "error");
      return;
    }

    // Validation téléphone
    if (!isPhoneValid(employeActuel.telephone)) {
      afficherToast(
        "Le numéro de téléphone doit contenir exactement 8 chiffres et commencer par 2, 5, 7 ou 9",
        "error"
      );
      return;
    }

    // Validation salaire
    if (employeActuel.salaire && (isNaN(employeActuel.salaire) || employeActuel.salaire < 0)) {
      afficherToast("Le salaire doit être un nombre positif (ex: 1500)", "error");
      return;
    }

    // Validation solde congé
    if (employeActuel.soldeConge < 0 || !Number.isInteger(Number(employeActuel.soldeConge))) {
      afficherToast("Le solde de congé doit être un nombre entier positif (ex: 30)", "error");
      return;
    }

    try {
      // Préparer les données pour l'envoi
      const employeData = {
        nom: employeActuel.nom,
        prenom: employeActuel.prenom,
        email: employeActuel.email,
        tel: employeActuel.telephone,
        password: employeActuel.password,
        departement: employeActuel.departement,
        sexe: employeActuel.sexe.toLowerCase(),
        soldedeconge: employeActuel.soldeConge,
        salaire: employeActuel.salaire,
      };

      if (employeActuel._id) {
        // Modification
        await axios.put(`/api/updatepersonnel/${employeActuel._id}`, employeData);
        afficherToast("Employé modifié avec succès", "success");
      } else {
        // Ajout
        await axios.post("/api/addPersonnel", employeData);
        afficherToast("Employé ajouté avec succès", "success");
      }

      // Recharger les données
      const { data } = await axios.get("/api/allpersonnel");
      const filteredEmployes = data.filter(employe => 
        !employe.role || employe.role.toLowerCase() !== "drh"
      );
      setEmployes(filteredEmployes);
      fermerModal();
    } catch (error) {
      console.error("Erreur:", error);
      let errorMessage = "Erreur lors de l'opération";
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Cet email est déjà utilisé par un autre personnel";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      afficherToast("Cet email est déjà utilisé par un autre personnel", "error");
    }
  };

  // Supprimer un employé
  const confirmerSuppression = async () => {
    if (!employeASupprimer) return;

    try {
      await axios.delete(`/api/deletepersonnel/${employeASupprimer._id}`);
      
      // Recharger les données
      const { data } = await axios.get("/api/allpersonnel");
      const filteredEmployes = data.filter(employe => 
        !employe.role || employe.role.toLowerCase() !== "drh"
      );
      setEmployes(filteredEmployes);
      
      afficherToast("Employé supprimé avec succès", "success");
      fermerSuppressionModal();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      let errorMessage = "Erreur lors de la suppression";
      
      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = "Employé introuvable - peut-être déjà supprimé";
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      afficherToast(errorMessage, "error");
    }
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded">
        <div className="gp-personnel-container">
          <div className="gp-header-section">
            <h1
              className="gp-modal-title"
              style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}
            >
              Gestion du Personnel
            </h1>

            <div className="gp-search-container">
              <div className="gp-search-input">
                <div className="gp-search-icon">
                  <Search size={20} />
                </div>
                <input
                  type="text"
                  placeholder={`Rechercher par ${
                    filtreType === "nom" ? "nom" : "ID"
                  }`}
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                  className="gp-form-input"
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
                  className="gp-form-select"
                >
                  <option value="nom">Filtrer par Nom</option>
                  <option value="id">Filtrer par ID</option>
                </select>
              </div>

              <button onClick={() => ouvrirModal()} className="gp-add-button">
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            <div
              style={{
                display: "flex",
                marginBottom: "1.5rem",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <button
                className={`gp-tab-button ${
                  filtreDepartement === "tous" ? "gp-active" : ""
                }`}
                onClick={() => setFiltreDepartement("tous")}
              >
                Tous
              </button>
              {departements.map((dept) => (
                <button
                  key={dept._id}
                  className={`gp-tab-button ${
                    filtreDepartement === dept.nom ? "gp-active" : ""
                  }`}
                  onClick={() => setFiltreDepartement(dept.nom)}
                >
                  {dept.nom}
                </button>
              ))}
            </div>

            {/* Tableau des employés */}
            <div className="gp-table-container">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th className="gp-th">Nom</th>
                    <th className="gp-th">Prénom</th>
                    <th className="gp-th">Email</th>
                    <th className="gp-th">Téléphone</th>
                    <th className="gp-th">Département</th>
                    <th className="gp-th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((employe, index) => (
                      <tr key={index} className="gp-tr">
                        <td className="gp-td">{employe.nom}</td>
                        <td className="gp-td">{employe.prenom}</td>
                        <td className="gp-td">{employe.email}</td>
                        <td className="gp-td">{employe.tel}</td>
                        <td className="gp-td">
                          <span className="gp-department-badge">
                            {employe.departement}
                          </span>
                        </td>
                        <td className="gp-td">
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => ouvrirDetailsModal(employe)}
                              className="gp-action-button gp-view-button"
                              title="Voir détails"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => ouvrirModal(employe)}
                              className="gp-action-button gp-edit-button"
                              title="Modifier"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => ouvrirSuppressionModal(employe)}
                              className="gp-action-button gp-delete-button"
                              title="Supprimer"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        className="gp-td"
                        colSpan="6"
                        style={{ textAlign: "center" }}
                      >
                        Aucun employé trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="gp-pagination">
              <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                Affichage de {indexOfFirstItem + 1} à{" "}
                {Math.min(indexOfLastItem, employesAffiches.length)} sur{" "}
                {employesAffiches.length} employés
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  onClick={() => paginate(currentPage - 1)} 
                  className="gp-page-button" 
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`gp-page-button ${currentPage === number ? "gp-active" : ""}`}
                  >
                    {number}
                  </button>
                ))}
                
                <button 
                  onClick={() => paginate(currentPage + 1)} 
                  className="gp-page-button" 
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal d'ajout/modification d'employé */}
        {modalOuvert && employeActuel && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container">
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">
                  {employeActuel.nom
                    ? `Modifier ${employeActuel.prenom} ${employeActuel.nom}`
                    : "Ajouter un employé"}
                </h2>
                <button onClick={fermerModal} className="gp-modal-close">
                  <X size={24} />
                </button>
              </div>

              <div>
                <div className="gp-form-group">
                  <label className="gp-form-label">ID</label>
                  <input
                    type="text"
                    name="id"
                    value={employeActuel._id}
                    onChange={handleChange}
                    className="gp-form-input"
                    disabled
                  />
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={employeActuel.nom}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.nom && !isAlpha(employeActuel.nom) ? 'gp-input-error' : ''
                    }`}
                    required
                  />
                  {employeActuel.nom && !isAlpha(employeActuel.nom) && (
                    <p className="gp-error-message">Le nom ne doit contenir que des lettres</p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    value={employeActuel.prenom}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.prenom && !isAlpha(employeActuel.prenom) ? 'gp-input-error' : ''
                    }`}
                    required
                  />
                  {employeActuel.prenom && !isAlpha(employeActuel.prenom) && (
                    <p className="gp-error-message">Le prénom ne doit contenir que des lettres</p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={employeActuel.email}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.email && !isEmailValid(employeActuel.email) ? 'gp-input-error' : ''
                    }`}
                    required
                  />
                  {employeActuel.email && !isEmailValid(employeActuel.email) && (
                    <p className="gp-error-message">Format d'email invalide (ex: exemple@domaine.com)</p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Téléphone *</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={employeActuel.telephone}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.telephone && !isPhoneValid(employeActuel.telephone) ? 'gp-input-error' : ''
                    }`}
                    required
                    placeholder="Ex: 50123456"
                  />
                  {employeActuel.telephone && !isPhoneValid(employeActuel.telephone) && (
                    <p className="gp-error-message">
                      Doit contenir exactement 8 chiffres et commencer par 2, 5, 7 ou 9
                    </p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Département *</label>
                  <select
                    name="departement"
                    value={employeActuel.departement}
                    onChange={handleChange}
                    className="gp-form-select"
                    required
                  >
                    <option value="">Sélectionnez un département</option>
                    {departements.map((dept) => (
                      <option key={dept._id} value={dept.nom}>
                        {dept.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Sexe *</label>
                  <select
                    name="sexe"
                    value={employeActuel.sexe}
                    onChange={handleChange}
                    className="gp-form-select"
                    required
                  >
                    <option value="">Sélectionnez le sexe</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Salaire (TND) *</label>
                  <input
                    type="number"
                    name="salaire"
                    value={employeActuel.salaire}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.salaire && (isNaN(employeActuel.salaire)) || employeActuel.salaire < 0 ? 'gp-input-error' : ''
                    }`}
                    placeholder="Salaire mensuel en TND"
                    required
                  />
                  {employeActuel.salaire && (isNaN(employeActuel.salaire) || employeActuel.salaire < 0) && (
                    <p className="gp-error-message">Doit être un nombre positif (ex: 1500)</p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Solde de congé *</label>
                  <input
                    type="number"
                    name="soldeConge"
                    value={employeActuel.soldeConge}
                    onChange={handleChange}
                    className={`gp-form-input ${
                      employeActuel.soldeConge < 0 || !Number.isInteger(Number(employeActuel.soldeConge)) ? 'gp-input-error' : ''
                    }`}
                    placeholder="Jours de congés restants"
                    required
                  />
                  {(employeActuel.soldeConge < 0 || !Number.isInteger(Number(employeActuel.soldeConge))) && (
                    <p className="gp-error-message">Doit être un nombre entier positif (ex: 30)</p>
                  )}
                </div>

                <div className="gp-form-group">
                  <label className="gp-form-label">Mot de passe</label>
                  <div className="gp-password-container">
                    <input
                      type="text"
                      name="password"
                      value={employeActuel.password}
                      onChange={handleChange}
                      className="gp-form-input gp-password-input"
                      readOnly
                    />
                    <button
                      onClick={copierMotDePasse}
                      className="gp-copy-button"
                      title="Copier le mot de passe"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <button
                    onClick={genererNouveauMotDePasse}
                    className="gp-generate-button"
                  >
                    Générer un nouveau mot de passe
                  </button>
                </div>
              </div>

              <div className="gp-modal-footer">
                <button onClick={fermerModal} className="gp-btn gp-btn-cancel">
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
        )}

        {/* Modal de détails d'employé */}
        {detailsModalOuvert && (
          <DetailsModal employe={employeDetails} onClose={fermerDetailsModal} />
        )}

        {/* Modal de confirmation de suppression */}
        {suppressionModalOuvert && (
          <div className="gp-modal-overlay">
            <div className="gp-modal-container" style={{ maxWidth: "28rem" }}>
              <div className="gp-modal-header">
                <h2 className="gp-modal-title">Confirmer la suppression</h2>
                <button
                  onClick={fermerSuppressionModal}
                  className="gp-modal-close"
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ marginBottom: "1.5rem", color: "#4b5563" }}>
                Êtes-vous sûr de vouloir supprimer l'employé{" "}
                <strong>
                  {employeASupprimer?.prenom} {employeASupprimer?.nom}
                </strong>{" "}
                ? Cette action est irréversible.
              </div>

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
                  style={{ backgroundColor: "#ef4444", borderColor: "#ef4444" }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast pour les notifications */}
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