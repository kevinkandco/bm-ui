
import React, { useState } from "react";
import { Zap, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MenuBarIconProps {
  onToggleMenu: () => void;
  onStatusChange: (status: "active" | "offline" | "dnd") => void;
  currentStatus: "active" | "offline" | "dnd";
  isMenuOpen?: boolean;
}

const MenuBarIcon = ({ 
  onToggleMenu, 
  onStatusChange, 
  currentStatus,
  isMenuOpen = false 
}: MenuBarIconProps) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statuses: ("active" | "offline" | "dnd")[] = ["active", "offline", "dnd"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(nextStatus);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <div 
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Button
          onClick={handleStatusClick}
          variant="ghost"
          className={`h-10 px-4 rounded-full transition-all duration-200 ease-in-out backdrop-blur-md ${
            isMenuOpen 
              ? "bg-white/20 text-white shadow-lg" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
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
            
            {/* Expand Arrow */}
            <ChevronDown 
              className={`w-3 h-3 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`} 
            />
          </div>
        </Button>
        
        {/* Expand Button */}
        <Button
          onClick={onToggleMenu}
          variant="ghost"
          size="sm"
          className="absolute -right-2 top-1/2 -translate-y-1/2 w-6 h-6 p-0 rounded-full bg-white/10 hover:bg-white/20 text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
        >
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

export default MenuBarIcon;
