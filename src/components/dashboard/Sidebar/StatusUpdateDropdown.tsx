
import React from "react";
import { ChevronDown, Circle, Moon, Zap, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface StatusUpdateDropdownProps {
  currentStatus: "active" | "away" | "focus" | "vacation";
  onStatusChange: (status: "active" | "away" | "focus" | "vacation") => void;
  onToggleFocusMode: () => void;
  onSignOffForDay: () => void;
}

const StatusUpdateDropdown = ({ 
  currentStatus, 
  onStatusChange, 
  onToggleFocusMode, 
  onSignOffForDay 
}: StatusUpdateDropdownProps) => {
  const statusConfig = {
    active: { icon: Circle, label: "Active", color: "text-green-400" },
    away: { icon: Moon, label: "Away", color: "text-yellow-400" },
    focus: { icon: Zap, label: "Focus Mode", color: "text-blue-400" },
    vacation: { icon: Plane, label: "Vacation", color: "text-purple-400" }
  };

  const currentConfig = statusConfig[currentStatus];
  const CurrentIcon = currentConfig.icon;

  const handleStatusSelect = (status: "active" | "away" | "focus" | "vacation") => {
    if (status === "focus") {
      onToggleFocusMode();
    } else if (status === "away") {
      onSignOffForDay();
    } else {
      onStatusChange(status);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-between p-3 h-auto">
          <div className="flex items-center gap-2">
            <CurrentIcon className={`h-4 w-4 ${currentConfig.color}`} />
            <span className="text-text-primary">{currentConfig.label}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-text-secondary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-surface border border-border-subtle">
        {Object.entries(statusConfig).map(([status, config]) => {
          const IconComponent = config.icon;
          return (
            <DropdownMenuItem
              key={status}
              onClick={() => handleStatusSelect(status as any)}
              className="text-text-primary hover:bg-white/10 cursor-pointer"
            >
              <IconComponent className={`mr-2 h-4 w-4 ${config.color}`} />
              {config.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusUpdateDropdown;
