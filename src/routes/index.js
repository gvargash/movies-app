import React from "react";
import { Switch, Route } from "react-router-dom";
import Movies from "./Movies/index";
import Dashboard from "./Dashboard/index";
import Turns from "./Turns/index";

const App = ({ match }) => {
  return (
    <Switch>
      <Route path={`${match.url}dashboard`} component={Dashboard} exact />
      <Route path={`${match.url}movies`} component={Movies} exact />
      <Route path={`${match.url}turns`} component={Turns} exact />
    </Switch>
  );
};

export default App;
