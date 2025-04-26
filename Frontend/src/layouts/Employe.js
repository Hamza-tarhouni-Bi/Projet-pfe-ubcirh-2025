import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import SidebarEmploye from "components/Sidebar/SlidebarEmploye";

import FooterAdmin from "components/Footers/FooterAdmin.js";
import DemandeFormation from "views/employe/DemandeFormation";
import DemandeAvance from "views/employe/DemandeAvance";
import CardDemandeConge from "components/Cards/CardDemandeConge";
import SettingsEmploye from "views/employe/SettingsEmploye";




export default function Employe() {
  return (
    <>
      <SidebarEmploye />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />

        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route
              path="/employe/demandeformation"
              exact
              component={DemandeFormation}
            />
            <Route
              path="/employe/demandeconge"
              exact
              component={CardDemandeConge}
            />
             <Route
              path="/employe/settingsemploye"
              exact
              component={SettingsEmploye}
            />

<Route
              path="/employe/demandeavance"
              exact
              component={DemandeAvance}
            />  

            <Redirect from="/employe" to="/employe/demandeformation" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
