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
    "flex-1 overflow-auto",
    className
  ), [className]);

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-md border-b border-border-subtle md:hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            <span className="ml-3 font-semibold text-lg text-text-primary">Brief-me</span>
          </div>
          
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="ghost" className="h-9 w-9">
                <Menu className="h-4 w-4 text-text-primary" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-none bg-surface border-border-subtle">
              <div className="flex flex-col h-full">
                <div className="p-4 flex items-center justify-between border-b border-border-subtle">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-md flex items-center justify-center">
                      <span className="font-bold text-white text-lg">B</span>
                    </div>
                    <span className="ml-3 font-semibold text-lg text-text-primary">Brief-me</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setMobileNavOpen(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5 text-text-secondary" />
                  </Button>
                </div>
                
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-text-primary"
                    >
                      Brief Schedule
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-text-primary"
                    >
                      Priorities
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/dashboard/settings");
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-text-primary"
                    >
                      Integrations
                    </button>
                    
                    <button
                      onClick={() => {
                        toast({
                          title: "Feedback",
                          description: "Feedback feature coming soon"
                        });
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-text-primary"
                    >
                      Feedback
                    </button>
                    
                    <button
                      onClick={() => {
                        toast({
                          title: "Contact Us",
                          description: "Contact feature coming soon"
                        });
                        setMobileNavOpen(false);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-white/5 text-text-primary"
                    >
                      Contact Us
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto p-4 border-t border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Version 1.0.0</span>
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
        <div className="pt-20 md:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
