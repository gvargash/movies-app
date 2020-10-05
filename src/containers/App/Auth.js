import React, { useEffect, useState } from "react";
import app from "./../../util/firebaseApp";

export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(app.auth().currentUser ?? null);
  useEffect(() => {
    app.auth().onAuthStateChanged(setCurrentUser);
  }, []);
  return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};
