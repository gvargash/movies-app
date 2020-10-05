import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import MainApp from "./MainApp";
import Login from "./../Login/index";
import { AuthContext } from "./Auth";

const RestrictedRoute = ({ component: Component, token, ...rest }) => {
  return <Route {...rest} render={(props) => (token ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />)} />;
};

const App = (props) => {
  const { match } = props;
  const [token, setToken] = useState(null);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    setToken(currentUser);
  }, [currentUser]);

  return (
    <Switch>
      <Route exact path="/login" component={Login} />
      <RestrictedRoute path={match.url} token={token} component={MainApp} />
    </Switch>
  );
};

export default App;
