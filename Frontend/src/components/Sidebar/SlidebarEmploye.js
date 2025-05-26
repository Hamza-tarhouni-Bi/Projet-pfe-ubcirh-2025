/* eslint-disable */
import React from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import NotificationDropdown from "components/Dropdowns/NotificationDropdown.js";
import UserDropdown from "components/Dropdowns/UserDropdown.js";

export default function SidebarEmploye() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const history = useHistory();

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await axios.post('/api/logout', {}, {
        withCredentials: true
      });
      
      // Clear any local storage items if needed
      localStorage.removeItem('user');
      
      // Redirect to login page using history instead of navigate
      history.push('/signin');
    } catch (error) {
      console.error("Logout failed:", error);
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

            {/* Search Form */}
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
              Espace Personnel
            </h6>

            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              {/* Formation Request */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/employe/demandeformation"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/employe/demandeformation"
                >
                  <i className="fas fa-graduation-cap mr-3 text-lg"></i>
                  <span>Demande de Formation</span>
                </Link>
              </li>

              {/* Advance Request */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/employe/demandeavance"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/employe/demandeavance"
                >
                  <i className="fas fa-money-bill-wave mr-3 text-lg"></i>
                  <span>Demande d'Avance</span>
                </Link>
              </li>

              {/* Leave Request */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/employe/demandeconge"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/employe/demandeconge"
                >
                  <i className="fas fa-calendar-alt mr-3 text-lg"></i>
                  <span>Demande de Congé</span>
                </Link>
              </li>

              {/* Settings */}
              <li className="items-center">
                <Link
                  className={
                    "text-sm py-3 font-medium flex items-center " +
                    (window.location.pathname.toLowerCase() === "/employe/settingsemploye"
                      ? "text-blue-600 hover:text-blue-700"
                      : "text-gray-700 hover:text-gray-500")
                  }
                  to="/employe/settingsemploye"
                >
                  <i className="fas fa-cog mr-3 text-lg"></i>
                  <span>Paramètres</span>
                </Link>
              </li>
              
              {/* Logout - Added new logout button */}
              <li className="items-center">
                <Link
                  onClick={handleLogout}
                  className="text-sm py-3 font-medium flex items-center w-full text-left text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-sign-out-alt mr-3 text-lg"></i>
                  <span>Déconnexion</span>
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
          </div>
        </div>
      </nav>
    </>
  );
}