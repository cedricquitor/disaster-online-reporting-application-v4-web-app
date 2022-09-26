import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Instantiate AuthContext for use
  const { auth } = useAuthContext();

  // If user IS NOT logged in
  if (auth.currentUser === null) {
    return <Navigate to="/login" />;
  }
  // If a user IS logged in BUT NOT authorized (NOT ADMIN)

  // If a user IS logged in AND authorized
  return children;
};

export default ProtectedRoute;
