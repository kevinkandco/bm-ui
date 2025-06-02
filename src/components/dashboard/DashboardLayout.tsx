
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
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
  sidebarOpen,
  onToggleSidebar
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
    "flex-1 overflow-auto bg-ds-background",
    className
  ), [className]);

  return (
    <div className="flex min-h-screen bg-ds-background">
      {/* Top Bar - Mobile */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-ds-surface border-b border-ds-divider md:hidden h-64">
        <div className="flex items-center justify-between px-16 h-full">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-ds-accent-blue rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <span className="ml-12 font-semibold text-lg text-ds-text-primary">Brief-me</span>
          </div>
          
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <Menu className="h-5 w-5 text-ds-text-secondary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-none bg-ds-surface border-ds-divider">
              <div className="flex flex-col h-full">
                <div className="p-16 flex items-center justify-between border-b border-ds-divider h-64">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-ds-accent-blue rounded-md flex items-center justify-center">
                      <span className="font-bold text-white text-lg">B</span>
                    </div>
                    <span className="ml-12 font-semibold text-lg text-ds-text-primary">Brief-me</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setMobileNavOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5 text-ds-text-secondary" />
                  </Button>
                </div>
                
                <div className="flex-1 p-16">
                  <div className="space-y-16">
                    <button
                      onClick={() => {
                        navigate("/dashboard/briefs");
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-12 rounded-md hover:bg-ds-surface-raised text-ds-text-primary transition-colors duration-hover"
                    >
                      View All Briefs
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-12 rounded-md hover:bg-ds-surface-raised text-ds-text-primary transition-colors duration-hover"
                    >
                      Settings
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto p-16 border-t border-ds-divider">
                  <div className="flex items-center justify-between">
                    <span className="text-label text-ds-text-secondary">Version 1.0.0</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={mainContentClasses}>
        {/* Add top padding on mobile to account for fixed header */}
        <div className="pt-64 md:pt-0 min-h-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
