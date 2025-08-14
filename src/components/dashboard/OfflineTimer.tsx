import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface OfflineTimerProps {
  startTime: Date;
  endTime: Date;
  onExtend?: (newEndTime: Date) => void;
  onEndNow?: () => void;
}

export function OfflineTimer({ 
  startTime, 
  endTime, 
  onExtend, 
  onEndNow 
}: OfflineTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = endTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeLeft("0m");
        onEndNow?.();
        return;
      }

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endTime, onEndNow]);

  const handleExtend = (extensionMinutes: number) => {
    const newEndTime = new Date(endTime.getTime() + extensionMinutes * 60 * 1000);
    onExtend?.(newEndTime);
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-500/10 border border-border-subtle">
      <Clock className="w-3 h-3 text-gray-500" />
      <span className="text-xs font-medium text-text-secondary">
        Offline for {timeLeft}
      </span>
      
      <div className="flex items-center gap-1 ml-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-6 px-2 text-xs hover:bg-gray-500/20"
            >
              <Plus className="w-3 h-3 mr-1" />
              Extend
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => handleExtend(30)}>
              +30 minutes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExtend(60)}>
              +1 hour
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExtend(120)}>
              +2 hours
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onEndNow}
          className="h-6 px-2 text-xs hover:bg-red-500/20 text-red-400 hover:text-red-300"
        >
          End Now
        </Button>
      </div>
    </div>
  );
}