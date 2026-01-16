import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/userContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();       // always defined (object with user,setUser)

  console.log( user);

  if (!user) {
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default ProtectedRoute;