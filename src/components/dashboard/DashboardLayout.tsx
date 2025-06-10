
import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

const DashboardLayout = ({
  children,
  className,
  currentPage = "home",
  onToggleSidebar
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close mobile nav when changing routes
  useEffect(() => {
    if (isMobile) {
      setMobileNavOpen(false);
    }
  }, [currentPage, isMobile]);

  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn(
    "flex-1 overflow-auto",
    className
  ), [className]);

  return (
    <div className="flex min-h-screen relative">
      {/* Main Content */}
      <div className={mainContentClasses}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
