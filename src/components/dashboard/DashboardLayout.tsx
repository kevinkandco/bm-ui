
import React, { useState, useEffect } from "react";
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

const DashboardLayout = ({ 
  children, 
  className, 
  currentPage = "home", 
  sidebarOpen, 
  onToggleSidebar 
}: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/dashboard", id: "home" },
    { icon: Archive, label: "Briefs", path: "/dashboard/briefs", id: "briefs", badge: 3 },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks", id: "tasks" },
    { icon: Video, label: "Meetings", path: "/dashboard/meetings", id: "meetings" },
    { icon: Zap, label: "Catch Me Up", path: "/dashboard/catch-up", id: "catch-up" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings", id: "settings" },
  ];

  const handleNavClick = (path: string) => {
    if (path === currentPage) return;
    // This would navigate in a real app, but we'll just show a toast for now
    toast({
      title: "Navigation",
      description: `Navigating to ${path}`,
    });
  };
  
  return (
    <div className="flex min-h-screen bg-white relative">
      {/* Background with warm gradient and grain texture */}
      <div className="absolute inset-0 w-full h-full bg-grain">
        <div className="absolute inset-0 bg-gradient-to-t from-white via-lake-blue/5 to-peach/5 opacity-90"></div>
        
        {/* Warm gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#F7F9FC] via-[#FEC6A1]/10 to-transparent"></div>
        
        {/* Floating glass orbs */}
        <div className="absolute left-1/4 top-1/3 w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 animate-float hidden lg:block"></div>
        <div className="absolute right-1/4 bottom-1/3 w-16 h-16 rounded-full bg-white/5 backdrop-blur-md border border-white/10 animate-float-delay hidden lg:block"></div>
      </div>
      
      {/* Sidebar Navigation Toggle Button */}
      <div className="fixed top-4 left-4 z-30 md:hidden">
        <Button 
          size="icon" 
          variant="outline" 
          onClick={onToggleSidebar} 
          className="bg-white/30 backdrop-blur-md border border-white/30"
        >
          <Menu className="h-5 w-5 text-deep-teal" />
        </Button>
      </div>
      
      {/* Sidebar Navigation */}
      <div className={cn(
        "fixed top-0 bottom-0 md:relative flex flex-col transition-all duration-300 ease-in-out bg-white/25 backdrop-blur-md border-r border-white/30 shadow-xl z-20",
        sidebarOpen ? "w-64 left-0" : "w-16 left-0",
        "md:left-0"
      )}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-br from-neon-mint to-lake-blue rounded-md flex items-center justify-center">
              <span className="font-bold text-deep-teal text-lg">B</span>
            </div>
            {sidebarOpen && (
              <span className="ml-3 font-semibold text-lg text-deep-teal">Brief.me</span>
            )}
          </div>
          
          {/* Toggle sidebar button */}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={onToggleSidebar} 
            className="text-deep-teal"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-1">
          {navItems.map(({ icon: Icon, label, path, id, badge }) => (
            <button
              key={id}
              onClick={() => handleNavClick(path)}
              className={cn(
                "flex items-center px-4 py-3 text-sm relative transition-colors",
                currentPage === id 
                  ? "bg-white/35 text-glass-blue font-medium" 
                  : "text-deep-teal hover:bg-white/25 hover:text-glass-blue"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {sidebarOpen && (
                <span className="ml-4 whitespace-nowrap">{label}</span>
              )}
              {badge && sidebarOpen && (
                <span className="absolute right-3 bg-neon-mint text-forest-green text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t border-white/20">
          <button 
            className="flex items-center w-full text-deep-teal/80 hover:text-glass-blue text-sm"
            onClick={() => toast({
              title: "Help",
              description: "Opening help & feedback panel",
            })}
          >
            <HelpCircle className="h-5 w-5" />
            {sidebarOpen && (
              <span className="ml-4 whitespace-nowrap">Help & Feedback</span>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/25 backdrop-blur-md border-t border-white/30 md:hidden flex justify-around z-10">
        {navItems.slice(0, 5).map(({ icon: Icon, id }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={cn(
              "p-3 flex flex-col items-center justify-center",
              currentPage === id ? "text-glass-blue" : "text-deep-teal"
            )}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </div>
      
      {/* Main Content */}
      <div className={cn("flex-1 overflow-auto pb-16 md:pb-0 z-10", className)}>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
