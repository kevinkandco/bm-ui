
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { 
  Home, Archive, CheckSquare, Video, 
  Zap, Settings, HelpCircle, Menu, Clock, 
  Headphones, Calendar, ChevronRight, ChevronLeft
} from "lucide-react";
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
  const { toast } = useToast();
  
  const handleNavClick = useCallback((path: string) => {
    if (path === currentPage) return;
    // This would navigate in a real app, but we'll just show a toast for now
    toast({
      title: "Navigation",
      description: `Navigating to ${path}`
    });
  }, [currentPage, toast]);

  // Memoize sidebar classes to prevent recalculation on every render
  const sidebarClasses = useMemo(() => cn(
    "fixed top-0 bottom-0 md:relative flex flex-col transition-all duration-200 ease-out bg-base border-r border-divider z-20", 
    sidebarOpen ? "w-64 left-0" : "w-16 left-0", 
    "md:left-0"
  ), [sidebarOpen]);

  // Memoize main content classes
  const mainContentClasses = useMemo(() => cn("flex-1 overflow-auto pb-16 md:pb-0 z-10", className), [className]);

  // NavItems component to optimize render cycles
  const NavItems = useMemo(() => (
    <div className="flex-1 py-6 flex flex-col gap-1">
      {navItems.map(({ icon: Icon, label, path, id, badge }) => (
        <button 
          key={id} 
          onClick={() => handleNavClick(path)} 
          className={cn(
            "flex items-center px-4 py-3 text-body relative transition-colors duration-200", 
            currentPage === id 
              ? "bg-surface text-accent-blue font-medium" 
              : "text-text-secondary hover:bg-surface hover:text-text-headline"
          )}
        >
          <Icon className="h-5 w-5 shrink-0" />
          {sidebarOpen && <span className="ml-4 whitespace-nowrap">{label}</span>}
          {badge && sidebarOpen && (
            <span className="absolute right-3 bg-accent-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  ), [sidebarOpen, currentPage, handleNavClick]);

  // Memoize mobile navigation to prevent unnecessary re-renders
  const MobileNav = useMemo(() => (
    <div className="fixed bottom-0 left-0 right-0 bg-base border-t border-divider md:hidden flex justify-around z-10">
      {navItems.slice(0, 5).map(({ icon: Icon, id }) => (
        <button 
          key={id} 
          onClick={() => handleNavClick(id)} 
          className={cn(
            "p-3 flex flex-col items-center justify-center", 
            currentPage === id ? "text-accent-blue" : "text-text-secondary"
          )}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  ), [currentPage, handleNavClick]);

  return (
    <div className="flex min-h-screen bg-base relative">
      {/* Sidebar Navigation Toggle Button */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={onToggleSidebar}
          className="bg-surface border-divider"
        >
          <Menu className="h-5 w-5 text-text-headline" />
        </Button>
      </div>
      
      {/* Sidebar Navigation */}
      <div className={sidebarClasses}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-accent-blue rounded-md flex items-center justify-center">
              <span className="font-bold text-white text-lg">B</span>
            </div>
            {sidebarOpen && <span className="ml-3 font-semibold text-lg text-text-headline">Brief-me</span>}
          </div>
          
          {/* Toggle sidebar button */}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onToggleSidebar} 
            className="text-text-secondary hover:text-text-headline"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        {NavItems}
        
        <div className="p-4 border-t border-divider">
          <button 
            className="flex items-center w-full text-text-secondary hover:text-text-headline text-sm"
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
      
      {/* Mobile Bottom Nav */}
      {MobileNav}
      
      {/* Main Content */}
      <div className={mainContentClasses}>
        {children}
      </div>
    </div>
  );
};

export default React.memo(DashboardLayout);
