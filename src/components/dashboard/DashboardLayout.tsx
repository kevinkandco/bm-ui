
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { Home, Archive, CheckSquare, Video, Zap, Settings, HelpCircle, Menu, Clock, Headphones, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  badge: 3
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
}];
const DashboardLayout = ({
  children,
  className,
  currentPage = "home",
  sidebarOpen,
  onToggleSidebar
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleNavClick = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Memoize sidebar classes to prevent recalculation on every render
  const sidebarClasses = useMemo(() => cn("fixed top-0 bottom-0 md:relative flex flex-col transition-all duration-300 ease-in-out backdrop-blur-xl bg-surface-overlay border-r border-border-subtle shadow-xl z-20", sidebarOpen ? "w-64 left-0" : "w-16 left-0", "md:left-0"), [sidebarOpen]);

  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn("flex-1 overflow-auto pb-16 md:pb-0 z-10", className), [className]);

  // NavItems component to optimize render cycles
  const NavItems = useMemo(() => <div className="flex-1 py-6 flex flex-col gap-1">
      {navItems.map(({
      icon: Icon,
      label,
      path,
      id,
      badge
    }) => <button key={id} onClick={() => handleNavClick(path)} className={cn("flex items-center px-4 py-3 text-sm relative transition-colors", currentPage === id ? "bg-white/10 text-accent-primary font-medium" : "text-text-secondary hover:bg-white/5 hover:text-text-primary")}>
          <Icon className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span className="ml-4 whitespace-nowrap">{label}</span>}
          {badge && sidebarOpen && <span className="absolute right-3 bg-accent-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {badge}
            </span>}
        </button>)}
    </div>, [sidebarOpen, currentPage, handleNavClick]);

  // Memoize mobile navigation to prevent unnecessary re-renders
  const MobileNav = useMemo(() => <div className="fixed bottom-0 left-0 right-0 bg-surface-overlay backdrop-blur-xl border-t border-border-subtle md:hidden flex justify-around z-10">
      {navItems.slice(0, 5).map(({
      icon: Icon,
      id,
      path
    }) => <button key={id} onClick={() => handleNavClick(path)} className={cn("p-3 flex flex-col items-center justify-center", currentPage === id ? "text-accent-primary" : "text-text-secondary")}>
          <Icon className="h-5 w-5" />
        </button>)}
    </div>, [currentPage, handleNavClick]);
  return <div className="flex min-h-screen bg-surface relative">
      {/* Background with gradient and grain texture */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface-raised to-surface opacity-90"></div>
        
        {/* Floating glass orbs */}
        <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-float hidden lg:block"></div>
        <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-float-delay hidden lg:block"></div>
      </div>
      
      {/* Sidebar Navigation Toggle Button */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <Button size="icon" variant="outline" onClick={onToggleSidebar} className="bg-surface-overlay backdrop-blur-md border border-border-subtle">
          <Menu className="h-5 w-5 text-text-primary" />
        </Button>
      </div>
      
      {/* Sidebar Navigation */}
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
        
        {NavItems}
        
        <div className="p-4 border-t border-border-subtle">
          <button className="flex items-center w-full text-text-secondary hover:text-text-primary text-sm" onClick={() => toast({
          title: "Help",
          description: "Opening help & feedback panel"
        })}>
            <HelpCircle className="h-5 w-5" />
            {sidebarOpen && <span className="ml-4 whitespace-nowrap">Help & Feedback</span>}
          </button>
        </div>
      </div>
      
      {/* Mobile Bottom Nav */}
      {MobileNav}
      
      {/* Main Content */}
      <div className={mainContentClasses}>
        {children}
      </div>
    </div>;
};
export default React.memo(DashboardLayout);
