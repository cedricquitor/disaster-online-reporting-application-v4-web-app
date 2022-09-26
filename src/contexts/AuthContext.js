import { useState, useEffect, createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const testContext = () => {
    console.log("UserContext is applied!");
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password).then((res) => {
      setUser(res.user);
      console.log(user);
    });
  };

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
    console.log("Admin is logged out");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log(currentUser);
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const contextValue = {
    auth,
    user,
    testContext,
    createUser,
    signIn,
    logout,
  };

  // return <UserContext.Provider value={(testContext, createUser)}>{children}</UserContext.Provider>;
  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
