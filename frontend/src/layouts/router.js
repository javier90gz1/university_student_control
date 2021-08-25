import React, { Component } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import Admin from "layouts/Admin.js";
import Auth from "layouts/Auth.js";
import PrivateRoute from './PrivateRouter';
class Router extends Component {
    state = {
        user: null
    }
    componentDidMount() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user)
            this.setState({ user })
    }
    render() {
        return (
            <>
                <Switch>
                    {/* add routes with layouts */}
                            <Route path="/admin" component={Admin} />
                            <Route path="/auth" component={Auth} />

                    {/* add redirect for first page */}
                    <Redirect from="/" to="/auth/login" />
                </Switch>
            </>
        )
    }
}
export default Router;