import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

export default function RoleRoute({ children, roles = [] }) {
  const { usuario, loading } = useAuth();
  if (loading) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!roles.includes(usuario.rol)) return <Navigate to="/" replace />;
  return children;
}
