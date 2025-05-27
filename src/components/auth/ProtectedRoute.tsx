import { Outlet, Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import useVerifyAuth from "@/hooks/useVerifyAuth";

const ProtectedRoute = ({ element }: { element: "protected" | "unprotected" }) => {
  const location = useLocation();
  const { checked, validSession, user } = useVerifyAuth();
  const authToken = localStorage.getItem("token");

  if (!checked) return <Loader />;

  // Always allow access to onboarding regardless of auth state
  if (location.pathname === "/onboarding") {
    return <Outlet />;
  }

  if (element === "unprotected") {
    // If valid session exists, redirect to dashboard
    if (validSession) {
      return <Navigate to="/dashboard" replace />;
    }
    // Otherwise show the unprotected page (Index)
    return <Outlet />;
  }

  // Protected routes below
  if (element === "protected") {
    if (!authToken || !validSession) {
      return <Navigate to="/" replace />;
    }

    if (!user?.is_onboard) {
      return <Navigate to="/onboarding" replace />;
    }

    return <Outlet />;
  }

  return null;
};


export default ProtectedRoute;