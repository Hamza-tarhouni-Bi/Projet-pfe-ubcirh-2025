import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";


// views

import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import Personnels from "views/admin/Personnels";
import Departement from "views/admin/Departement";
import Congé from "views/admin/Congé";
import Formation from "views/admin/Formation";
import Recrutement from "views/Recrutement";
import DemandeFormation from "views/employe/DemandeFormation";
import Condidature from "views/admin/Condidature";
import DemandeF from "views/admin/DemandeF";
import DemandeA from "views/admin/DemandeA";
import DemandeC from "views/admin/DemandeC";
export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
     
        
       <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/personnels" exact component={Personnels} />
            <Route path="/admin/departement" exact component={Departement} />
            <Route path="/admin/congé" exact component={Congé} />
            <Route path="/admin/formation" exact component={Formation} />
            <Route path="/admin/demandeformation" exact component={DemandeFormation} />
           <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Route path="/admin/recrutement" exact component={Recrutement} />
            <Route path="/admin/demandef" exact component={DemandeF} />
            <Route path="/admin/demandea" exact component={DemandeA} />
            <Route path="/admin/demandec" exact component={DemandeC} />

            
            <Route path="/admin/condidature" exact component={Condidature} />
           <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>
          <FooterAdmin />
     </div>
      </div>
    </>
  );
}
