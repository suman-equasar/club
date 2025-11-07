import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useContext(AuthContext);

  if (loading) return null; // wait for context to load

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
}
