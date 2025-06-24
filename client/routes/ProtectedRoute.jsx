import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../src/context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { userData, isLoggedIn } = useContext(AppContext);

  if (!isLoggedIn || !userData) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
