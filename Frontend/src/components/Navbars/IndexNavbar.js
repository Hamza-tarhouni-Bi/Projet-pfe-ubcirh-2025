/*eslint-disable*/
import React from "react";
import { Link } from "react-router-dom";
// components
import IndexDropdown from "components/Dropdowns/IndexDropdown.js";

export default function Navbar(props) {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              <img
                src="https://www.ubci.tn/wp-content/themes/ubci/img/logo-banque-ubci-xs.png"
                alt="UBCI Logo"
                style={{ height: "40px", width: "150px" }}
              />
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" +
              (navbarOpen ? " block" : " hidden")
            }
            id="example-navbar-warning"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto items-center">
              {/* Lien "Home" */}
              <li className="flex items-center">
                <Link
                  to="/"
                  className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block py-2 whitespace-nowrap uppercase hover:text-lightBlue-500"
                >
                  Home
                </Link>
              </li>
              {/* Espace entre "Home" et "Recrutement" */}
              <li className="flex items-center mx-4">
                {/* Espace ajouté ici */}
              </li>
              {/* Lien "Recrutement" */}
              <li className="flex items-center">
                <Link
                  to="/postule"
                  className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block py-2 whitespace-nowrap uppercase hover:text-lightBlue-500"
                >
                  Recrutement
                </Link>
              </li>
              {/* Bouton "Login" */}
              <li className="flex items-center">
                <Link
                  to="/signin"
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                >
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </li>
              {/* Bouton "Register" */}
              <li className="flex items-center">
                <Link
                  to="/signup"
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 text-xs font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none lg:mr-1 lg:mb-0 ml-3 mb-3 ease-linear transition-all duration-150"
                >
                  <i className="fas fa-user-plus"></i> Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}