import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Circle } from "lucide-react";

interface StatusUpdateDropdownProps {
  currentStatus?: string;
  onStatusChange?: (status: string) => void;
}

const StatusUpdateDropdown = ({ currentStatus = "online", onStatusChange }: StatusUpdateDropdownProps) => {
  const statuses = [
    { value: "online", label: "Online", color: "text-green-500" },
    { value: "away", label: "Away", color: "text-yellow-500" },
    { value: "busy", label: "Busy", color: "text-red-500" },
    { value: "offline", label: "Offline", color: "text-gray-500" }
  ];

  const currentStatusData = statuses.find(s => s.value === currentStatus) || statuses[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Circle className={`h-3 w-3 fill-current ${currentStatusData.color}`} />
          <span className="text-sm">{currentStatusData.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statuses.map((status) => (
          <DropdownMenuItem
            key={status.value}
            onClick={() => onStatusChange?.(status.value)}
            className="gap-2"
          >
            <Circle className={`h-3 w-3 fill-current ${status.color}`} />
            {status.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusUpdateDropdown;