
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Menu, X, Zap, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import MenuBarIcon from "./MenuBarIcon";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

type StatusType = "active" | "offline" | "dnd";

const DashboardLayout = ({
  children,
  className,
  currentPage = "home",
  sidebarOpen,
  onToggleSidebar
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("active");
  
  // Close mobile nav when changing routes
  useEffect(() => {
    if (isMobile) {
      setMobileNavOpen(false);
    }
  }, [currentPage, isMobile]);

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus === "dnd" ? "Do Not Disturb" : newStatus}`
    });
  };

  const handleGetBriefedNow = () => {
    toast({
      title: "Brief Generated",
      description: "Your brief is ready"
    });
  };

  const handleUpdateSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "Your brief schedule has been updated"
    });
  };

  const handleOpenDashboard = () => {
    toast({
      title: "Opening Dashboard",
      description: "Navigating to main dashboard"
    });
  };

  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn(
    "flex-1 overflow-auto",
    className
  ), [className]);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Header - Brief Me Button */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
        <MenuBarIcon 
          onToggleMenu={() => setMobileNavOpen(!mobileNavOpen)}
          onStatusChange={handleStatusChange}
          currentStatus={status}
          isMenuOpen={mobileNavOpen}
          onGetBriefedNow={handleGetBriefedNow}
          onUpdateSchedule={handleUpdateSchedule}
          onOpenDashboard={handleOpenDashboard}
          integrations={[
            { name: "Slack", count: 12, isConnected: true },
            { name: "Mail", count: 5, isConnected: false },
            { name: "Actions", count: 4, isConnected: false }
          ]}
        />
      </div>
      
      {/* Main Content */}
      <div className={mainContentClasses}>
        {/* Add top padding on mobile to account for fixed header */}
        <div className="pt-20 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
