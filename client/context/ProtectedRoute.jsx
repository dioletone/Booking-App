// ProtectedRoute.jsx

import React from 'react';
import { Navigate, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Component {...rest} /> : <Navigate to="/login" 
  
  />;
};

export default ProtectedRoute;
