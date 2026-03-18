// components/RoleBasedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: Array<"patient" | "doctor" | "admin">;
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = "/login",
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} />;
  }

  if (user && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardPath = `/${user.role}/dashboard`;
    return <Navigate to={dashboardPath} />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
