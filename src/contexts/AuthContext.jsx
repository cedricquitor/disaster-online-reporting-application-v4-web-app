import { createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const testContext = () => {
    console.log("UserContext is applied!");
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const contextValue = {
    testContext,
    createUser,
  };

  // return <UserContext.Provider value={(testContext, createUser)}>{children}</UserContext.Provider>;
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
