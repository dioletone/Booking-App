import React, { useEffect } from 'react';
import { Navigate, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const AdminRoute = ({ element: Component, ...rest }) => {
  const { user, loading, handleLogout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) {
      handleLogout();
    }
  }, [loading, user, handleLogout, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (user && user.isAdmin) && <Component {...rest} />;
};

export default AdminRoute;