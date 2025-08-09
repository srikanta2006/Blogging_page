// src/components/ProtectedRoute.jsx

import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // If the user is not logged in, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If the user is logged in, show the page they were trying to access
  return children;
}

export default ProtectedRoute;
