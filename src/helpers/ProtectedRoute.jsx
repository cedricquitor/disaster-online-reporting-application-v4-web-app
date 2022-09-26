import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  // Instantiate useLocation to get current URL
  const location = useLocation();

  // Instantiate AuthContext for use
  const { user, auth } = useAuthContext();

  // If user IS NOT logged in
  if (!user) {
    return <Navigate to="/login" state={location} replace />;
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
