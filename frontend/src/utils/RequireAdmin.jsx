import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (!user.is_staff) {
    return <div className="container"><h4>Forbidden</h4><p>Admin access required.</p></div>;
  }
  return children;
}

export default RequireAdmin;