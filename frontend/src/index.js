import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/styles/tailwind.css";

//redux
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer.js';
import Router from './layouts/router';
// views without layouts
//import Login from "views/auth/Login";
//import Dashboard from "views/admin/Dashboard";

const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
