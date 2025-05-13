
import React, { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const currentPath = useMemo(() => location.pathname, [location.pathname]);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      currentPath
    );
  }, [currentPath]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center p-8 rounded-xl bg-surface-raised shadow-neu-raised">
        <h1 className="text-4xl font-bold mb-4 tracking-tighter text-text-primary">404</h1>
        <p className="text-xl text-text-secondary mb-6">Oops! Page not found</p>
        <Link 
          to="/" 
          className="inline-flex text-accent-primary hover:underline underline-offset-4"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default React.memo(NotFound);
