import React, { useState } from "react";
import PropTypes from "prop-types";
import { MdDelete, MdVisibility, MdEdit } from "react-icons/md";

// Styles CSS pour les dialogs et modals
const styles = `
  .titre{
  text-align: center;
  text-transform: uppercase;
  color:darkblue;
   font-size: 2em;
  }

  .fixed-dialog-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 50;
    padding-top: 1rem; /* Marge en haut */
  }

  .dialog-content {
    background-color: aliceblue;
    padding: 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 24rem;
    width: 100%;
  }

  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 24rem;
    width: 100%;
  }

  .modal-content input,
  .modal-content select {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.25rem;
  }

  .modal-content button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
  }

  .modal-content button.cancel {
    background-color: #ccc;
    margin-right: 0.5rem;
  }

  .modal-content button.submit {
    background-color: #4CAF50;
    color: white;
  }

  .error-message {
    color: red;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .view-modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    max-width: 24rem;
    width: 100%;
  }

  .view-modal-content img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
  }

  .view-modal-content p {
    margin-bottom: 0.5rem;
  }
`;

export default function CardPersonnels({ color = "light" }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [personnels, setPersonnels] = useState([
    { id: 1, nom: "Jean Dupont", departement: "Informatique", image: "data:image/jpeg;base64,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", email: "jean.dupont@example.com", phone: "0123456789", status: "Actif", password: "password123" },
    { id: 2, nom: "Sophie Martin", departement: "Ressources Humaines", image: "data:image/jpeg;base64,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", email: "sophie.martin@example.com", phone: "0987654321", status: "Inactif", password: "password456" },
    { id: 3, nom: "Ali Ben Salah", departement: "Finance", image: "data:image/jpeg;base64,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", email: "ali.bensalah@example.com", phone: "0654321890", status: "Actif", password: "password789" },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPersonnelId, setSelectedPersonnelId] = useState(null);
  const [selectedPersonnelName, setSelectedPersonnelName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    nom: "",
    departement: "",
    image: "",
    email: "",
    phone: "",
    status: "",
    password: "",
  });
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [errors, setErrors] = useState({});

  const filteredPersonnels = personnels
    .filter((personnel) => {
      if (!isNaN(searchTerm)) {
        return personnel.id.toString().includes(searchTerm);
      }
      return personnel.nom.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (!sortOption) return 0;
      if (sortOption === "id-asc") return a.id - b.id;
      if (sortOption === "id-desc") return b.id - a.id;
      if (sortOption === "departement") return a.departement.localeCompare(b.departement);
      return 0;
    });

  const handleAction = (action, id, nom) => {
    switch (action) {
      case "voir":
        const personnelToView = personnels.find((personnel) => personnel.id === id);
        setSelectedPersonnel(personnelToView);
        setIsViewModalOpen(true);
        break;
      case "modifier":
        const personnelToEdit = personnels.find((personnel) => personnel.id === id);
        setSelectedPersonnel(personnelToEdit);
        setIsEditModalOpen(true);
        break;
      case "supprimer":
        setSelectedPersonnelId(id);
        setSelectedPersonnelName(nom);
        setIsDialogOpen(true);
        break;
      default:
        break;
    }
  };

  const handleConfirmDelete = () => {
    setPersonnels(personnels.filter((personnel) => personnel.id !== selectedPersonnelId));
    setIsDialogOpen(false);
    setSelectedPersonnelName("");
  };

  const handleCancelDelete = () => {
    setIsDialogOpen(false);
    setSelectedPersonnelName("");
  };

  const handleAddPersonnel = () => {
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newPersonnel.nom) newErrors.nom = "Le nom est obligatoire.";
    if (!newPersonnel.departement) newErrors.departement = "Le département est obligatoire.";
    if (!newPersonnel.email) newErrors.email = "L'email est obligatoire.";
    if (!newPersonnel.phone) newErrors.phone = "Le téléphone est obligatoire.";
    if (!newPersonnel.status) newErrors.status = "Le statut est obligatoire.";
    if (!newPersonnel.password) newErrors.password = "Le mot de passe est obligatoire.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModalSubmit = () => {
    if (!validateForm()) return;

    const newPersonnelEntry = {
      id: personnels.length + 1,
      nom: newPersonnel.nom,
      departement: newPersonnel.departement,
      image: newPersonnel.image || "https://via.placeholder.com/40",
      email: newPersonnel.email,
      phone: newPersonnel.phone,
      status: newPersonnel.status,
      password: newPersonnel.password,
    };
    setPersonnels([...personnels, newPersonnelEntry]);
    setIsModalOpen(false);
    setNewPersonnel({
      nom: "",
      departement: "",
      image: "",
      email: "",
      phone: "",
      status: "",
      password: "",
    });
    setErrors({});
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setNewPersonnel({
      nom: "",
      departement: "",
      image: "",
      email: "",
      phone: "",
      status: "",
      password: "",
    });
    setErrors({});
  };

  const handleEditSubmit = () => {
    if (validateForm()) return;

    // Mettre à jour le tableau personnels avec les nouvelles valeurs
    const updatedPersonnels = personnels.map((personnel) =>
      personnel.id === selectedPersonnel.id ? { ...selectedPersonnel } : personnel
    );

    // Mettre à jour l'état personnels
    setPersonnels(updatedPersonnels);

    // Fermer le modal de modification
    setIsEditModalOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      {/* Injection des styles CSS */}
      <style>{styles}</style>

      <div className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}>
        {/* Confirmation Dialog en Haut de la Page */}
        {isDialogOpen && (
          <div className="fixed-dialog-container">
            <div className="dialog-content">
              <p className="text-lg text-gray-700 mb-4">
                Êtes-vous sûr de vouloir supprimer <strong>{selectedPersonnelName}</strong> ?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour ajouter un personnel */}
        {isModalOpen && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Ajouter un personnel</h2>
              {errors.nom && <div className="error-message">{errors.nom}</div>}
              <input
                type="text"
                placeholder="Nom"
                value={newPersonnel.nom}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, nom: e.target.value })}
              />
              {errors.departement && <div className="error-message">{errors.departement}</div>}
              <input
                type="text"
                placeholder="Département"
                value={newPersonnel.departement}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, departement: e.target.value })}
              />
              <input
                type="text"
                placeholder="URL de l'image"
                value={newPersonnel.image}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, image: e.target.value })}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
              <input
                type="email"
                placeholder="Email"
                value={newPersonnel.email}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, email: e.target.value })}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
              <input
                type="text"
                placeholder="Téléphone"
                value={newPersonnel.phone}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, phone: e.target.value })}
              />
              {errors.status && <div className="error-message">{errors.status}</div>}
              <select
                value={newPersonnel.status}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, status: e.target.value })}
              >
                <option value="" disabled>Sélectionnez un statut</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              {errors.password && <div className="error-message">{errors.password}</div>}
              <input
                type="password"
                placeholder="Mot de passe"
                value={newPersonnel.password}
                onChange={(e) => setNewPersonnel({ ...newPersonnel, password: e.target.value })}
              />
              <div className="flex justify-end">
                <button onClick={handleModalCancel} className="cancel">
                  Annuler
                </button>
                <button onClick={handleModalSubmit} className="submit">
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour afficher les détails d'un personnel */}
        {isViewModalOpen && selectedPersonnel && (
          <div className="modal-container">
            <div className="view-modal-content">
              <h2 className="text-lg font-semibold mb-4">Détails du personnel</h2>
              <img src={selectedPersonnel.image} alt={selectedPersonnel.nom} />
              <p><strong>Nom:</strong> {selectedPersonnel.nom}</p>
              <p><strong>Département:</strong> {selectedPersonnel.departement}</p>
              <p><strong>Email:</strong> {selectedPersonnel.email}</p>
              <p><strong>Téléphone:</strong> {selectedPersonnel.phone}</p>
              <p><strong>Statut:</strong> {selectedPersonnel.status}</p>
              <div className="flex justify-end">
                <button onClick={() => setIsViewModalOpen(false)} className="cancel">
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal pour modifier un personnel */}
        {isEditModalOpen && selectedPersonnel && (
          <div className="modal-container">
            <div className="modal-content">
              <h2 className="text-lg font-semibold mb-4">Modifier le personnel</h2>
              <input
                type="text"
                placeholder="Nom"
                value={selectedPersonnel.nom}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, nom: e.target.value })}
              />
              <input
                type="text"
                placeholder="Département"
                value={selectedPersonnel.departement}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, departement: e.target.value })}
              />
              <input
                type="text"
                placeholder="URL de l'image"
                value={selectedPersonnel.image}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, image: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={selectedPersonnel.email}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Téléphone"
                value={selectedPersonnel.phone}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, phone: e.target.value })}
              />
              <select
                value={selectedPersonnel.status}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, status: e.target.value })}
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
              <input
                type="password"
                placeholder="Mot de passe"
                value={selectedPersonnel.password}
                onChange={(e) => setSelectedPersonnel({ ...selectedPersonnel, password: e.target.value })}
              />
              <div className="flex justify-end">
                <button onClick={handleEditCancel} className="cancel">
                  Annuler
                </button>
                <button onClick={handleEditSubmit} className="submit">
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}
<div className="titre"><h1>Gestion des personnels</h1></div>
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={"font-semibold text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
              Liste des personnels
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-between mt-4">
            <div className="flex items-center space-x-6">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="btn-filter py-2 border rounded-lg focus:outline-none btn-rech-id text-blueGray-700"
              >
                <option value="" disabled>Filtrer par</option>
                <option value="id-asc">ID Ascendant</option>
                <option value="id-desc">ID Descendant</option>
                <option value="departement">Par Département</option>
              </select>
              <input
                type="text"
                placeholder="Rechercher par nom ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:outline-none border-blueGray-300 text-blueGray-700 ml-4"
              />
            </div>
            <button
              onClick={handleAddPersonnel}
              className="px-4 py-2 rounded-lg font-semibold text-btn-ajouterp bg-blue-500 hover:bg-blue-600 focus:outline-none"
            >
              Ajouter un personnel
            </button>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                {["Id", "Image", "Nom", "Département", "Email", "Téléphone", "Statut", "Action"].map((header, index) => (
                  <th key={index} className="px-6 py-3 text-xs uppercase font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPersonnels.length > 0 ? (
                filteredPersonnels.map((personnel) => (
                  <tr key={personnel.id}>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.id}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <img src={personnel.image} alt={personnel.nom} className="w-10 h-10 rounded-full" />
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.nom}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.departement}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.email}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.phone}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">{personnel.status}</td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm">
                      <button onClick={() => handleAction("voir", personnel.id, personnel.nom)} className="bg-green-500 text-white p-2 rounded mr-2">
                        <MdVisibility />
                      </button>
                      <button onClick={() => handleAction("modifier", personnel.id, personnel.nom)} className="bg-yellow-500 text-white p-2 rounded mr-2">
                        <MdEdit />
                      </button>
                      <button onClick={() => handleAction("supprimer", personnel.id, personnel.nom)} className="bg-red-500 text-white p-2 rounded">
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Aucun résultat trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

CardPersonnels.propTypes = {
  color: PropTypes.string,
};