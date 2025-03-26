import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

import Test from "views/Test";


import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
//Auth
import Signin from "views/auth/Signin";
import Signup from "views/auth/Signup";


import TestForm from "views/auth/TestForm";

import Landing from "views/Landing.js";
import Profile from "views/Profile.js";
import Index from "views/Index.js";
import Postule from "views/Postule";
ReactDOM.render(
  <BrowserRouter>
    <Switch>
      {/* add routes with layouts */}

      <Route path="/admin" component={Admin} />
      {/*Route pour signin et signup*/}
      <Route path="/signup" component={Signup} />
      <Route path="/signin" component={Signin} />
      <Route path="/auth" component={Auth} />
      <Route path="/test" component={Test} />
      <Route path="/postule" component={Postule} />

      <Route path="/testform" component={TestForm} />

      {/* add routes without layouts */}
      <Route path="/landing" exact component={Landing} />
      <Route path="/profile" exact component={Profile} />
      <Route path="/" exact component={Index} />
      {/* add redirect for first page */}
      <Redirect from="*" to="/" />
    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
