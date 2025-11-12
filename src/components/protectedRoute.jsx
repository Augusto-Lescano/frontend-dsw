import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function ProtectedRoute({ children }) {
  const { usuario, loading } = useAuth();
  if (loading) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  return children;
}
