import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Home, Archive, CheckSquare, Video, Zap, Settings, HelpCircle, Menu, Clock, Headphones, Calendar, ChevronRight, ChevronLeft, X , LogOut} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/use-theme";
import useAuthStore from "@/store/useAuthStore";
import { useBriefStore } from "@/store/useBriefStore";
import { useApi } from "@/hooks/useApi";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  currentPage?: string;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

// Optimize by memoizing static data
const navItems = [{
  icon: Home,
  label: "Home",
  path: "/dashboard",
  id: "home"
}, {
  icon: Archive,
  label: "Briefs",
  path: "/dashboard/briefs",
  id: "briefs",
  badge: null
}, {
  icon: CheckSquare,
  label: "Tasks",
  path: "/dashboard/tasks",
  id: "tasks"
}, {
  icon: Video,
  label: "Meetings",
  path: "/dashboard/meetings",
  id: "meetings"
}, {
  icon: Zap,
  label: "Catch Me Up",
  path: "/dashboard/catch-up",
  id: "catch-up"
}, {
  icon: Settings,
  label: "Settings",
  path: "/dashboard/settings",
  id: "settings"
},
{
  icon: LogOut,
  label: "Logout",
  path: "",
  id: "logout"
}];

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
  const {logout} = useAuthStore();
  const {getUnreadCount, unreadCount} = useBriefStore();
  const { call } = useApi();

  // Close mobile nav when changing routes
  useEffect(() => {
    if (isMobile) {
      setMobileNavOpen(false);
    }
    getUnreadCount();
    navItems[1].badge = unreadCount; 
  }, [currentPage, isMobile, getUnreadCount, unreadCount]);

  const handleClick = useCallback(async (path: string, id: string) => {
    if (id === "logout") {
      const response = await call("get", "/api/logout", {
        toastTitle: "Error",
        toastDescription: "Failed to log out. Please try again.",
        toastVariant: "destructive",
      });

      if (response) {
        logout();
        navigate("/");
      }
      return;
    }

    navigate(path);
    if (isMobile) {
      setMobileNavOpen(false);
    }
  }, [navigate, isMobile, logout, call]);


  // Memoize sidebar classes to prevent recalculation on every render
  const sidebarClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 md:relative flex flex-col transition-all duration-300 ease-in-out bg-surface border-r border-border-subtle shadow-xl z-20",
    sidebarOpen ? "w-64 left-0" : "w-16 left-0",
    "md:left-0 hidden md:flex" // Hide on mobile, show on desktop
  ), [sidebarOpen]);

  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn(
    "flex-1 overflow-auto pb-16 md:pb-0 z-10",
    className
  ), [className]);

  // NavItems component to optimize render cycles
  const NavItems = useCallback(() => (
    <div className="flex-1 py-6 flex flex-col gap-1">
      {navItems.map(({ icon: Icon, label, path, id, badge }) => (
        <button
          key={id}
          onClick={() => handleClick(path, id)}
          className={cn(
            "flex items-center px-4 py-3 text-sm relative transition-colors",
            currentPage === id 
              ? "bg-white/10 text-accent-primary font-medium" 
              : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {(sidebarOpen || isMobile) && <span className="ml-4 whitespace-nowrap">{label}</span>}
          {badge && (sidebarOpen || isMobile) && (
            <span className="absolute right-3 bg-accent-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  ), [sidebarOpen, currentPage, handleClick, isMobile]);

  return (
    <div className="flex min-h-screen bg-surface relative">
      {/* Desktop Sidebar Navigation */}
      <div className={sidebarClasses}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            {sidebarOpen && <span className="ml-3 font-semibold text-lg text-text-primary">Brief-me</span>}
          </div>
          
          {/* Toggle sidebar button */}
          <Button size="icon" variant="ghost" onClick={onToggleSidebar} className="text-text-secondary hover:text-text-primary">
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <NavItems />
        
        <div className="p-4 border-t border-border-subtle">
          <button
            className="flex items-center w-full text-text-secondary hover:text-text-primary text-sm"
            onClick={() => toast({
              title: "Help",
              description: "Opening help & feedback panel"
            })}
          >
            <HelpCircle className="h-5 w-5" />
            {sidebarOpen && <span className="ml-4 whitespace-nowrap">Help & Feedback</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Hamburger Menu - Moved to right side */}
      <div className="fixed top-3 right-3 z-50 md:hidden">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="h-9 w-9 bg-surface border border-border-subtle rounded-full">
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
                {/* Single X button for closing the menu */}
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setMobileNavOpen(false)}
                  className="h-8 w-8"
                >
                  <X className="h-5 w-5 text-text-secondary" />
                </Button>
              </div>
              
              <NavItems />
              
              <div className="mt-auto p-4 border-t border-border-subtle">
                <button
                  className="flex items-center w-full text-text-secondary hover:text-text-primary text-sm"
                  onClick={() => {
                    setMobileNavOpen(false);
                    toast({
                      title: "Help",
                      description: "Opening help & feedback panel"
                    });
                  }}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="ml-4 whitespace-nowrap">Help & Feedback</span>
                </button>
                
                {/* Theme toggle removed on mobile as requested */}
                <div className="mt-4 flex items-center justify-between md:hidden">
                  <span className="text-xs text-text-secondary">Version 1.0.0</span>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Main Content */}
      <div className={mainContentClasses}>
        {children}
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border-subtle md:hidden flex justify-around z-10 h-16">
        {navItems.slice(0, 5).map(({ icon: Icon, id, path }) => (
          <button
            key={id}
            onClick={() => handleClick(path, id)}
            className={cn(
              "p-2 flex flex-col items-center justify-center",
              currentPage === id ? "text-accent-primary" : "text-text-secondary"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">{id === "catch-up" ? "Catch Up" : id.charAt(0).toUpperCase() + id.slice(1)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
