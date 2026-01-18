// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    // still checking /me; avoid flash redirect
    return <div>Loading...</div>; // or your spinner
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}