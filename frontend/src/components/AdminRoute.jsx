import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";
import Loading from "./Loading";

export default function AdminRoute({ children }) {
  const auth = useAuth();
  const location = useLocation();

  // Wait for auth to finish loading
  if (auth.loading) {
    return <Loading />;
  }

  if (!auth.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!auth || !auth.authorizeRole("admin")) {
    return <Navigate to="/dashboard" replace />
  }
  return children;
}
