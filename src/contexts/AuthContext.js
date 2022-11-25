import { useState, useEffect, createContext, useContext } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../configs/firebase";
import { toast } from "react-toastify";

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
    return signInWithEmailAndPassword(auth, email, password).then((user) => {
      if (user.user.uid !== "AGyuYPeaLxTrwVdscteoff2dQeJ2") {
        toast.error("Invalid admin credentials!");
        return signOut(auth);
      } else {
        toast.success("Logged in successfully");
      }
    });
  };

  const logout = () => {
    return signOut(auth);
    console.log("Admin is logged out");
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log(currentUser ? currentUser : "No current user");
      console.log(currentUser ? currentUser.uid : "No current user uid");
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
