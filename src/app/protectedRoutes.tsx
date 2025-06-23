// components/ProtectedRoute.tsx

import { Navigate } from "react-router-dom";
import { useAuthenticateQuery } from "../store/api"; // adjust the import if needed
import type { JSX } from "react";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { data, error, isLoading } = useAuthenticateQuery({});

  if (isLoading) return <div>Loading...</div>;
    // console.log(data,error,isLoading,' data from api')
  if (error || !data) {
    // Not authenticated or error during auth check
    // console.log("Authentication error:", error);
    return <Navigate to="/login" />;
  }

  // User is authenticated
  return children;
};

export default ProtectedRoute;
