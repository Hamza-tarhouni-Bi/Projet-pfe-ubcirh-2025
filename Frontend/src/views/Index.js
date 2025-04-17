import React from "react";
import { Link } from "react-router-dom";

import IndexNavbar from "components/Navbars/IndexNavbar.js";
import Signin from "./auth/Signin";
import Postule from "./Postule";

export default function Index() {
  return (
    <>
      <IndexNavbar fixed />
      <section className="header relative pt-16 items-center flex h-screen max-h-860-px">
        <div className="container mx-auto items-center flex flex-wrap">
          <div className="w-full md:w-8/12 lg:w-6/12 xl:w-6/12 px-4">
            <div className="pt-32 sm:pt-0">
              <h2 className="font-semibold text-4xl text-blueGray-600">
               BIENVENUE SUR UBCI HR MANAGER
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-blueGray-500">
              UBCI RH est un site web dédié à la gestion des ressources humaines de la banque UBCI, facilitant le suivi du personnel, la gestion des congés et l'automatisation des tâches administratives.
              </p>
              <div className="mt-12">
                <Link
                  to="/postule"
                  className="get-started text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-lightBlue-500 active:bg-lightBlue-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Postuler
                </Link>
                <Link
                  to="/signin"
                  className="github-star ml-1 text-white font-bold px-6 py-4 rounded outline-none focus:outline-none mr-1 mb-1 bg-blueGray-700 active:bg-blueGray-600 uppercase text-sm shadow hover:shadow-lg ease-linear transition-all duration-150"
                >
                  Mon Espace
                </Link>
              </div>
            </div>
          </div>
        </div>

        <img
          className="absolute top-0 right-0 pt-1 sm:w-6/12 sm:max-h-full -mt-48 sm:mt-0 w-full h-full object-cover"
          src={require("assets/img/ubci.jpg").default}
          alt="..."
        />
      </section>
    </>
  );
}