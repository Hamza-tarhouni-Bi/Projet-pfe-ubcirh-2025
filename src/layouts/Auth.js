import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components
import Navbar from "components/Navbars/IndexNavbar";


// views
import Signin from "views/auth/Signin";
import Signup from "views/auth/Signup";
import Forget from "views/auth/forget";

export default function Auth() {
  return (
    <>
      <Navbar transparent />
      <main>
      
          
          <Switch>
            <Route path="/auth/signin" exact component={Signin} />
           
            <Route path="/auth/signup" exact component={Signup} />
            
          
         
            
           
          </Switch>
       
        
      </main>
    </>
  );
}
