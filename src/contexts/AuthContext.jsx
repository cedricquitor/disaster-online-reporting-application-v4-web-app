import React, { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const createAdmin = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  return <UserContext.Provider value={createAdmin}>{children}</UserContext.Provider>;
};

export const UserAuth = () => {
  return useContext(UserContext);
};
