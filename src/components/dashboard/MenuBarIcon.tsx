
import React from "react";
import { Zap, ChevronDown, Calendar, ExternalLink, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuBarIconProps {
  onToggleMenu: () => void;
  onStatusChange: (status: "active" | "offline" | "dnd") => void;
  currentStatus: "active" | "offline" | "dnd";
  isMenuOpen?: boolean;
  onGetBriefedNow?: () => void;
  onUpdateSchedule?: () => void;
  onOpenDashboard?: () => void;
}

const MenuBarIcon = ({ 
  onToggleMenu, 
  onStatusChange, 
  currentStatus,
  isMenuOpen = false,
  onGetBriefedNow,
  onUpdateSchedule,
  onOpenDashboard
}: MenuBarIconProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "offline": return "bg-gray-500";
      case "dnd": return "bg-red-500";
      default: return "bg-green-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Active";
      case "offline": return "Offline";
      case "dnd": return "Do Not Disturb";
      default: return "Active";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-10 px-4 rounded-full transition-all duration-200 ease-in-out backdrop-blur-md bg-white/10 text-white hover:bg-white/20"
          >
            <div className="flex items-center gap-3">
              {/* Brief Me Icon */}
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-sm font-medium">Brief Me</span>
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(currentStatus)}`} />
                <span className="text-xs">{getStatusText(currentStatus)}</span>
              </div>
              
              {/* Dropdown Arrow */}
              <ChevronDown className="w-3 h-3" />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-white/95 backdrop-blur-xl border border-gray-200/50"
        >
          {/* Primary Actions */}
          {onGetBriefedNow && (
            <DropdownMenuItem 
              onClick={onGetBriefedNow}
              className="flex items-center gap-2 font-medium"
            >
              <Zap className="w-4 h-4" />
              Get Briefed Now
            </DropdownMenuItem>
          )}
          
          {onUpdateSchedule && (
            <DropdownMenuItem 
              onClick={onUpdateSchedule}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Update Schedule
            </DropdownMenuItem>
          )}
          
          {onOpenDashboard && (
            <DropdownMenuItem 
              onClick={onOpenDashboard}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open Dashboard
            </DropdownMenuItem>
          )}
          
          {(onGetBriefedNow || onUpdateSchedule || onOpenDashboard) && (
            <DropdownMenuSeparator />
          )}
          
          {/* Status Options */}
          <DropdownMenuItem 
            onClick={() => onStatusChange("active")}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Active
            {currentStatus === "active" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onStatusChange("offline")}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            Offline
            {currentStatus === "offline" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => onStatusChange("dnd")}
            className="flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-red-500" />
            Do Not Disturb
            {currentStatus === "dnd" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Open Full Menu Option */}
          <DropdownMenuItem onClick={onToggleMenu}>
            <Settings className="w-4 h-4 mr-2" />
            Open Full Menu
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default MenuBarIcon;
