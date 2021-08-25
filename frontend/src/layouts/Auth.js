import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import Navbar from "components/Navbars/AuthNavbar.js";

// views

import Login from "views/auth/Login.js";
import { Component } from "react";

class Auth extends Component {
  state = {
    user: {}
  }
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user)
      this.setState({ user })
  }
  render() {
    return (
      <>

        <main>
          <section className="relative w-full h-full py-40 min-h-screen">
            <div
              className="absolute top-0 w-full h-full bg-no-repeat bg-blueGray-600"
              style={{
                backgroundImage:
                  "url(" + require("assets/img/register_bg_2.png").default + ")",
              }}
            ></div>
            <Switch>
             
                <Route path="/auth/login" exact component={Login} />
                <Redirect from="/auth" to="/auth/login" />
             

            </Switch>
          </section>
        </main>
      </>
    );
  }
}
export default Auth;
