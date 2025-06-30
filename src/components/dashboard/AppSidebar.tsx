
import React, { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Archive, 
  CheckSquare, 
  Calendar, 
  Settings, 
  Users, 
  Gift, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Focus,
  Clock,
  Zap,
  User,
  FileText,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";

interface AppSidebarProps {
  currentStatus: "active" | "focus" | "offline";
  onStatusChange: (status: "focus" | "offline") => void;
  onExitStatus: () => void;
  onStartFocusMode: () => void;
  onSignOffForDay: () => void;
  onTeamInterest: () => void;
  waitlistStatus: "initial" | "added";
}

const AppSidebar = ({
  currentStatus,
  onStatusChange,
  onExitStatus,
  onStartFocusMode,
  onSignOffForDay,
  onTeamInterest,
  waitlistStatus
}: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [prioritiesOpen, setPrioritiesOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  const handleStatusChange = useCallback((status: 'focus' | 'offline') => {
    setShowStatusModal(false);
    if (status === 'focus') {
      onStartFocusMode();
    } else if (status === 'offline') {
      onSignOffForDay();
    }
  }, [onStartFocusMode, onSignOffForDay]);

  const handleProfileClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "profile" }
    });
  }, [navigate]);

  const handleIntegrationsClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "integrations" }
    });
  }, [navigate]);

  const handleBriefConfigClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "brief-config" }
    });
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { title: "Briefs", path: "/dashboard/briefs", icon: Archive },
    { title: "Tasks", path: "/dashboard/tasks", icon: CheckSquare },
    { title: "Meetings", path: "/dashboard/meetings", icon: Calendar },
  ];

  const prioritySubItems = [
    { title: "People", path: "/dashboard/settings?section=people" },
    { title: "Channels", path: "/dashboard/settings?section=channels" },
    { title: "Triggers", path: "/dashboard/settings?section=triggers" },
    { title: "Integrations", path: "/dashboard/settings?section=integrations" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-60 bg-surface/80 backdrop-blur-xl border-r border-border-subtle z-50 flex flex-col">
      {/* Product Name */}
      <div className="p-6 border-b border-border-subtle">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="p-0 h-auto font-semibold text-lg text-text-primary hover:text-accent-primary"
        >
          Brief Me
        </Button>
      </div>

      {/* Update Status */}
      <div className="px-6 py-4 border-b border-border-subtle">
        {currentStatus !== 'active' ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentStatus === 'focus' ? (
                <>
                  <Focus className="w-4 h-4 text-accent-primary" />
                  <span className="text-sm text-text-primary">Focus Mode</span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-orange-400" />
                  <span className="text-sm text-text-primary">Offline</span>
                </>
              )}
            </div>
            <Button
              onClick={onExitStatus}
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
            >
              ×
            </Button>
          </div>
        ) : (
          <DropdownMenu open={showStatusModal} onOpenChange={setShowStatusModal}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between text-text-primary border-border-subtle hover:border-accent-primary"
              >
                Update Status
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-surface border-border-subtle w-56">
              <DropdownMenuItem
                onClick={() => handleStatusChange('focus')}
                className="text-text-primary hover:bg-white/5"
              >
                <Focus className="mr-2 h-4 w-4" />
                Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange('offline')}
                className="text-text-primary hover:bg-white/5"
              >
                <Clock className="mr-2 h-4 w-4" />
                Offline Mode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Search */}
      <div className="px-6 py-4 border-b border-border-subtle">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-surface-overlay border-border-subtle text-text-primary placeholder:text-text-secondary"
          />
          <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-text-secondary bg-surface-overlay border border-border-subtle rounded px-1">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 px-6 py-4 space-y-2 overflow-auto">
        {/* Primary Views */}
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant={isActive(item.path) ? "default" : "ghost"}
            onClick={() => navigate(item.path)}
            className={`w-full justify-start ${
              isActive(item.path)
                ? "bg-accent-primary text-white"
                : "text-text-primary hover:bg-white/5"
            }`}
          >
            <item.icon className="mr-3 h-4 w-4" />
            {item.title}
          </Button>
        ))}

        {/* Priorities - Collapsible */}
        <Collapsible open={prioritiesOpen} onOpenChange={setPrioritiesOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-text-primary hover:bg-white/5"
            >
              <div className="flex items-center">
                <Settings className="mr-3 h-4 w-4" />
                Priorities
              </div>
              {prioritiesOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 pl-7 pt-2">
            {prioritySubItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className="w-full justify-start text-sm text-text-secondary hover:text-text-primary hover:bg-white/5"
              >
                {item.title}
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Teams */}
        <Button
          variant="ghost"
          onClick={onTeamInterest}
          className="w-full justify-start text-text-primary hover:bg-white/5"
        >
          <Users className="mr-3 h-4 w-4" />
          Invite team
        </Button>

        {/* Referral */}
        <Button
          variant="ghost"
          className="w-full justify-start text-text-primary hover:bg-white/5"
        >
          <Gift className="mr-3 h-4 w-4" />
          Give a month, get a month
        </Button>
      </div>

      {/* Profile - Bottom */}
      <div className="p-6 border-t border-border-subtle">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-0">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt="Alex Johnson" />
                <AvatarFallback className="bg-accent-primary/20 text-accent-primary font-medium">
                  AJ
                </AvatarFallback>
              </Avatar>
              <span className="text-text-primary">Alex Johnson</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-surface border-border-subtle w-56" align="start" side="right">
            <DropdownMenuItem onClick={handleProfileClick} className="text-text-primary hover:bg-white/5">
              <User className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleIntegrationsClick} className="text-text-primary hover:bg-white/5">
              <Zap className="mr-2 h-4 w-4" />
              Integrations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleBriefConfigClick} className="text-text-primary hover:bg-white/5">
              <FileText className="mr-2 h-4 w-4" />
              Brief Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-text-primary hover:bg-white/5">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default AppSidebar;
