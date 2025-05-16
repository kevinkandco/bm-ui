
import React, { useState, useEffect, useCallback } from "react";
import { Clock, Headphones, Zap, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface StatusTimerProps {
  status: "active" | "away" | "focus" | "vacation";
  onToggleCatchMeUp?: () => void;
  onToggleFocusMode?: () => void;
}

const StatusTimer = React.memo(({ status, onToggleCatchMeUp, onToggleFocusMode }: StatusTimerProps) => {
  const { toast } = useToast();
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
  const [timeUntilNextBrief, setTimeUntilNextBrief] = useState<string>("00:00:00");
  const [startTime] = useState<number>(Date.now());
  
  // Calculate time until next brief (9AM tomorrow if after 8AM, otherwise 8AM today)
  const calculateTimeUntilNextBrief = useCallback(() => {
    const now = new Date();
    const nextBrief = new Date();
    
    // If it's after 8 AM, set next brief to 9 AM tomorrow
    if (now.getHours() >= 8) {
      nextBrief.setDate(nextBrief.getDate() + 1);
      nextBrief.setHours(9, 0, 0, 0);
    } else {
      // Otherwise set it to 8 AM today
      nextBrief.setHours(8, 0, 0, 0);
    }
    
    const diffMs = nextBrief.getTime() - now.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    
    const hours = Math.floor(diffSec / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((diffSec % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(diffSec % 60).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  useEffect(() => {
    // Update countdown timer
    const countdownTimer = setInterval(() => {
      if (status === "active") {
        setTimeUntilNextBrief(calculateTimeUntilNextBrief());
      }
    }, 1000);
    
    // Only update the elapsed timer if the user is not active
    if (status !== "active") {
      const elapsedTimer = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000); // seconds
        
        const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
        const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
        
        setTimeElapsed(`${hours}:${minutes}:${seconds}`);
      }, 1000);
      
      return () => {
        clearInterval(elapsedTimer);
        clearInterval(countdownTimer);
      };
    }
    
    return () => clearInterval(countdownTimer);
  }, [startTime, status, calculateTimeUntilNextBrief]);

  // Render different content based on user status - simplified design
  const renderContent = () => {
    switch (status) {
      case "focus":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="bg-accent-primary text-white p-2.5 rounded-full mr-3">
                <Headphones className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Focus Mode</h3>
                <p className="text-sm text-text-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle h-10"
                >
                  <Zap className="mr-2 h-4 w-4" /> Catch Me Up
                </Button>
              )}
            </div>
          </div>
        );
      
      case "away":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white p-2.5 rounded-full mr-3">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Away</h3>
                <p className="text-sm text-text-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle h-10"
                >
                  <Zap className="mr-2 h-4 w-4" /> Catch Me Up
                </Button>
              )}
            </div>
          </div>
        );
      
      case "vacation":
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="bg-blue-500 text-white p-2.5 rounded-full mr-3">
                <Plane className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Out of Office</h3>
                <p className="text-sm text-text-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle h-10"
                >
                  <Zap className="mr-2 h-4 w-4" /> Catch Me Up
                </Button>
              )}
            </div>
          </div>
        );
      
      default: // Active status - simplified
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <div className="bg-accent-primary text-white p-2.5 rounded-full mr-3">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary">Next Brief</h3>
                <p className="text-sm text-text-secondary">{timeUntilNextBrief}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {onToggleFocusMode && (
                <Button 
                  onClick={onToggleFocusMode}
                  variant="outline"
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle h-10"
                >
                  <Headphones className="mr-2 h-4 w-4" /> Focus Mode
                </Button>
              )}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all bg-accent-primary text-white h-10"
                >
                  <Zap className="mr-2 h-4 w-4" /> Catch Me Up
                </Button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-4 px-6 border-b border-border-subtle">
      {renderContent()}
    </div>
  );
});

StatusTimer.displayName = 'StatusTimer';
export default StatusTimer;
