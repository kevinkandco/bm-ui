import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, ChevronRight, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight, Home, ChevronLeft, Calendar, Network, Mail, ArrowLeft, Cog } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();

  const handleToggleNav = useCallback(() => {
    setIsNavCollapsed(!isNavCollapsed);
  }, [isNavCollapsed]);

  const handleAllSettingsClick = () => {
    navigate('/dashboard/settings');
  };

  const handleProfileClick = () => {
    toast({
      title: "Profile",
      description: "Profile menu would open here",
    });
  };

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/briefs', icon: FileText, label: 'Briefs' },
    { path: '/dashboard/follow-ups', icon: CheckSquare, label: 'Follow-ups' },
    { path: '/dashboard/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/dashboard/catch-up', icon: Network, label: 'Catch Up' },
    { path: '/dashboard/meetings', icon: Calendar, label: 'Meetings' },
    { path: '/dashboard/settings', icon: Cog, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-surface-dark text-white">
      <div className="flex">
        {/* Left Navigation */}
        <div 
          className={`bg-surface-darker border-r border-border-muted transition-all duration-300 ease-in-out ${
            isNavCollapsed ? 'w-16' : 'w-72'
          } relative flex flex-col h-screen`}
          onClick={isNavCollapsed ? handleToggleNav : undefined}
        >
          <div className="p-4 pt-12 space-y-4 flex-1">
            {/* Profile Section */}
            <div 
              className={`flex items-center gap-3 p-3 rounded-lg relative group transition-all duration-200 ${isNavCollapsed ? 'justify-center' : ''} ${isProfileHovered ? 'bg-white/5' : ''}`}
              onMouseEnter={() => setIsProfileHovered(true)}
              onMouseLeave={() => setIsProfileHovered(false)}
            >
              <Avatar className={`${isNavCollapsed ? 'w-6 h-6' : 'w-8 h-8'}`}>
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary-teal text-white text-sm">AK</AvatarFallback>
              </Avatar>
              {!isNavCollapsed && (
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">Alex Kim</p>
                </div>
              )}
              {!isNavCollapsed && isProfileHovered && (
                <button
                  onClick={handleToggleNav}
                  className="absolute right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-light-gray-text" />
                </button>
              )}
            </div>

            <Separator className="bg-border-muted" />

            {/* Navigation Items */}
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveRoute(item.path);
                
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-start gap-3 p-2 text-left rounded-lg transition-all duration-200 group ${
                      isNavCollapsed ? 'justify-center' : ''
                    } ${
                      isActive 
                        ? 'bg-primary-teal/10 border border-primary-teal/20' 
                        : 'hover:bg-surface-raised/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-all ${
                      isActive 
                        ? 'text-primary-teal' 
                        : 'text-light-gray-text group-hover:text-primary-teal group-hover:scale-110'
                    }`} />
                    {!isNavCollapsed && (
                      <span className={`transition-colors text-sm ${
                        isActive 
                          ? 'text-primary-teal font-medium' 
                          : 'text-light-gray-text group-hover:text-white'
                      }`}>
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header with hamburger menu for mobile */}
          {isNavCollapsed && isMobile && (
            <div className="p-4">
              <button
                onClick={handleToggleNav}
                className="p-2 hover:bg-surface-raised/60 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5 text-light-gray-text" />
              </button>
            </div>
          )}

          {/* Page Content */}
          <div className="p-6 flex-1">
            <div className="col-span-3 card-dark p-6 h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}