import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";


// views

import Dashboard from "views/admin/Dashboard.js";

import Users from "views/admin/Users.js";
import City from "views/admin/City";
import Student from "views/admin/Student";
import Professor from "views/admin/Professor";
import Logs from "views/admin/Logs.js";
import Group from "views/admin/Group.js";

import Logout from "../components/logout/logout";
import PrivateRoute from "./PrivateRouter";
class Admin extends Component {
  state = {
    user: null
  }
  componentDidMount() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    if (user)
      this.setState({ user })
  }
  render() {

    return (
      <>
        <Sidebar user={this.state.user} />
        <div className="relative md:ml-64 bg-blueGray-100">
          <AdminNavbar />
          {/* Header */}
          <HeaderStats />
          <div className="px-4 md:px-10 mx-auto w-full -m-24">
            <Switch>
              {this.state.user !== null && this.state.user.roles === 'ROLE_ADMIN' ?
                <>
                  <PrivateRoute path="/admin/dashboard" exact component={Dashboard} />
                  <PrivateRoute path="/admin/students" exact component={Student} />
                  <PrivateRoute path="/admin/users" exact component={Users} />
                  <PrivateRoute path="/admin/city" exact component={City} />
                  <PrivateRoute path="/admin/professor" exact component={Professor} />
                  <PrivateRoute path="/admin/groups" exact component={Group} />

                  <PrivateRoute path="/admin/logs" exact component={Logs} />
                  
                  <Route path="/admin/logout" exact component={Logout} />
                  <Redirect from="/admin" to="/admin/dashboard" /></>
                : null}
            </Switch>
          </div>
        </div>
      </>
    );
  }
}
export default Admin;
