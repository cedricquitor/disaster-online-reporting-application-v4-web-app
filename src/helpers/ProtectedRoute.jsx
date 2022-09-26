import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Instantiate AuthContext for use
  const { user, auth } = useAuthContext();

  // If user IS NOT logged in
  if (!user) {
    return <Navigate to="/login" />;
  }
  // If a user IS logged in BUT NOT authorized (NOT ADMIN)
  // TODO
  // Get auth.currentUser.uid
  // Find the uid in Firebase
  // If it does not exist, return to <Unauthorized />

  // If a user IS logged in AND authorized
  return children;
};

export default ProtectedRoute;
