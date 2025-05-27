import { Outlet, Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader";
import useVerifyAuth from "@/hooks/useVerifyAuth";

const ProtectedOnboardingRoute = () => {
  const { checked, user } = useVerifyAuth();
  
  if (!checked) return <Loader />;
  
  // Only prevent access if user is already onboarded
  if (user?.is_onboard) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

export default ProtectedOnboardingRoute;