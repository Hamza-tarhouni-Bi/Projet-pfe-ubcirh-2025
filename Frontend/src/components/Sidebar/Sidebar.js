import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const history = useHistory();

  const handleLogout = async (e) => {
    // Empêcher le comportement par défaut du bouton
    e.preventDefault();
    
    try {
      // Vérifiez si votre API a le bon chemin - ajustez selon votre configuration
      await axios.post('/logout');
      
      // Clear any auth tokens or user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Redirection vers la page de connexion
      history.push('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Message d'erreur plus descriptif
      if (error.response) {
        // Le serveur a répondu avec un code d'état en dehors de la plage 2xx
        console.error("Status:", error.response.status);
        console.error("Data:", error.response.data);
        alert(`Échec de la déconnexion: ${error.response.data.message || 'Erreur serveur'}`);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error("No response received:", error.request);
        alert("Échec de la déconnexion: Le serveur ne répond pas.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error("Error message:", error.message);
        alert(`Échec de la déconnexion: ${error.message}`);
      }
    }
  };

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/"
          >
            <img
              src="https://www.ubci.tn/wp-content/themes/ubci/img/logo-banque-ubci-xs.png"
              alt="UBCI Logo"
              className="max-h-10"
            />
          </Link>

          {/* User */}
          <ul className="md:hidden items-center flex flex-wrap list-none">
            <li className="inline-block relative">
              <NotificationDropdown />
            </li>
            <li className="inline-block relative">
              <UserDropdown />
            </li>
          </ul>

          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link
                    className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
                    to="/"
                  >
                    UBCI
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form className="mt-6 mb-4 md:hidden">
              <div className="mb-3 pt-0">
                <input
                  type="text"
                  placeholder="Rechercher"
                  className="border-0 px-3 py-2 h-12 border border-solid border-blueGray-500 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-base leading-snug shadow-none outline-none focus:outline-none w-full font-normal"
                />
              </div>
            </form>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />

            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Espace Drh
            </h6>

            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {/* Dashboard */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.href.indexOf("/admin/dashboard") !== -1
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/dashboard"
                >
                  <i className="fas fa-tachometer-alt mr-3 text-lg"></i>
                  <span>Tableau de Bord</span>
                </Link>
              </li>

              {/* Personnel */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.href.indexOf("/admin/personnels") !== -1
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/personnels"
                >
                  <i className="fas fa-users mr-3 text-lg"></i>
                  <span>Personnels</span>
                </Link>
              </li>

              {/* Reste du menu... */}
              {/* Departements */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/admin/departement"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/departement"
                >
                  <i className="fas fa-building mr-3 text-lg"></i>
                  <span>Départements</span>
                </Link>
              </li>
              
              {/* Demande*/}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.href.indexOf("/admin/tables") !== -1
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/tables"
                >
                  <i className="fas fa-clipboard-list mr-3 text-lg"></i>
                  <span>Demandes</span>
                </Link>
              </li>

              {/* Recrutement */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/admin/recrutement"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/recrutement"
                >
                  <i className="fas fa-user-plus mr-3 text-lg"></i>
                  <span>Recrutement</span>
                </Link>
              </li>

              {/* Candidature - Nouveau lien */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/admin/condidature"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/condidature"
                >
                  <i className="fas fa-file-alt mr-3 text-lg"></i>
                  <span>Candidature</span>
                </Link>
              </li>

              {/* Congé */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (decodeURIComponent(window.location.pathname).toLowerCase() === "/admin/congé"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/congé"
                >
                  <i className="fas fa-calendar-alt mr-3 text-lg"></i>
                  <span>Congé</span>
                </Link>
              </li>

              {/* Formation */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.href.indexOf("/admin/formation") !== -1
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/formation"
                >
                  <i className="fas fa-graduation-cap mr-3 text-lg"></i>
                  <span>Formation</span>
                </Link>
              </li>

              {/* Settings */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.href.indexOf("/admin/settings") !== -1
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/admin/settings"
                >
                  <i className="fas fa-cog mr-3 text-lg"></i>
                  <span>Paramètres</span>
                </Link>
              </li>

              {/* Logout - Added Button */}
              <li className="items-center">
                <Link
                  className="text-sm py-3 font-medium flex items-center w-full text-left text-red-500 hover:text-red-700-sm py-3 font-medium flex items-center"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
                  <span>Déconnexion</span>
                </Link>
              </li>
            </ul>

            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
}