import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import "./styles/index.less";
import App from "./containers/App/index";
import { AuthProvider } from "./containers/App/Auth";

function NextApp() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default NextApp;
