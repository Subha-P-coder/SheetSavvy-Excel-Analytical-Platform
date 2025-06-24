import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const AdminRoute = ({ children }) => {
  const { userData, isLoggedIn } = useContext(AppContext);

  if (!isLoggedIn || !userData) {

    return <div>Loading...</div>;
  }

  if (userData.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute;

