import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, FileText, Calendar, ClipboardCheck, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusUpdateDropdown from "../StatusUpdateDropdown";

interface DashboardSidebarProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
  userStatus?: string;
  onStatusChange?: (status: string) => void;
}

const DashboardSidebar = ({ 
  currentView = "home", 
  onViewChange, 
  userStatus = "online",
  onStatusChange 
}: DashboardSidebarProps) => {
  const sidebarItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "briefs", label: "Briefs", icon: FileText },
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: ClipboardCheck },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="w-64 h-full bg-surface-raised border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-5 w-5 text-text-secondary" />
          <span className="font-medium text-text-primary">Brief Me</span>
        </div>
        <StatusUpdateDropdown 
          currentStatus={userStatus} 
          onStatusChange={onStatusChange} 
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-10",
                currentView === item.id && "bg-accent-primary/10 text-accent-primary"
              )}
              onClick={() => onViewChange?.(item.id)}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border-subtle">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-3">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;