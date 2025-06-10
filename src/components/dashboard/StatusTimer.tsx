import React, { useState, useEffect, useCallback } from "react";
import { Clock, Headphones, Zap, Plane, X, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";

interface StatusTimerProps {
  status: "active" | "away" | "focus" | "vacation";
  onToggleCatchMeUp?: () => void;
  onToggleFocusMode?: () => void;
  onExitFocusMode?: () => void;
}

const StatusTimer = React.memo(({ status, onToggleCatchMeUp, onToggleFocusMode, onExitFocusMode }: StatusTimerProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
  const [timeUntilNextBrief, setTimeUntilNextBrief] = useState<string>("00:00:00");
  const [startTime] = useState<number>(Date.now());
  const [focusTimeRemaining, setFocusTimeRemaining] = useState<string>("00:29:56");
  
  // For focus mode - default 30 minutes
  const focusDuration = 30 * 60; // 30 minutes in seconds
  
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

  // Calculate remaining focus time
  const calculateFocusTimeRemaining = useCallback(() => {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const remainingSeconds = Math.max(0, focusDuration - elapsedSeconds);
    
    const hours = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(remainingSeconds % 60).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }, [startTime]);

  useEffect(() => {
    // Update countdown timer
    const countdownTimer = setInterval(() => {
      if (status === "active") {
        setTimeUntilNextBrief(calculateTimeUntilNextBrief());
      } else if (status === "focus") {
        setFocusTimeRemaining(calculateFocusTimeRemaining());
        setTimeElapsed(`${focusTimeRemaining} remaining`);
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
        
        if (status !== "focus") {
          setTimeElapsed(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);
      
      return () => {
        clearInterval(elapsedTimer);
        clearInterval(countdownTimer);
      };
    }
    
    return () => clearInterval(countdownTimer);
  }, [startTime, status, calculateTimeUntilNextBrief, calculateFocusTimeRemaining, focusTimeRemaining]);

  // Render different content with glass styling
  const renderContent = () => {
    switch (status) {
      case "focus":
        return (
          <div className="w-full glass-panel-elevated py-4 px-6">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="glass-thick p-2 rounded-full">
                  <Headphones className="h-5 w-5 glass-icon" />
                </div>
                <div>
                  <h3 className="text-glass-primary font-medium text-lg">Focus Mode</h3>
                  <p className="text-glass-secondary text-sm">{focusTimeRemaining} remaining</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="chrome-pill w-10 h-10"
                >
                  <Sun className="h-5 w-5 glass-icon" />
                </Button>
                <Button 
                  onClick={onExitFocusMode}
                  variant="outline"
                  size="default"
                  className="chrome-pill px-6"
                >
                  <X className="h-4 w-4 mr-2 glass-icon" /> 
                  Exit
                </Button>
              </div>
            </div>
          </div>
        );
      
      case "away":
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="glass-thick p-2 rounded-full mr-2 status-glow-amber">
                <Clock className="h-4 w-4 glass-icon" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-glass-primary">Away</h3>
                <p className="text-xs sm:text-sm text-glass-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="chrome-pill"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 glass-icon" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>
              )}
            </div>
          </div>
        );
      
      case "vacation":
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="glass-thick p-2 rounded-full mr-2 status-glow-amber">
                <Plane className="h-4 w-4 glass-icon" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-glass-primary">Out of Office</h3>
                <p className="text-xs sm:text-sm text-glass-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="chrome-pill"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 glass-icon" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>
              )}
            </div>
          </div>
        );
      
      default: // Active status
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="glass-thick p-2 rounded-full mr-2 status-glow-green">
                <Zap className="h-4 w-4 glass-icon" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-glass-primary">Next Brief</h3>
                <p className="text-xs sm:text-sm text-glass-secondary">{timeUntilNextBrief}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleFocusMode && (
                <Button 
                  onClick={onToggleFocusMode}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="chrome-pill"
                >
                  <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 glass-icon" /> 
                  <span className="text-xs sm:text-sm">Focus</span>
                </Button>
              )}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  size={isMobile ? "sm" : "default"}
                  className="chrome-pill"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2 glass-icon" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>
              )}
            </div>
          </div>
        );
    }
  };

  // Focus mode gets full glass treatment
  if (status === "focus") {
    return renderContent();
  }

  return (
    <div className="glass-thin py-2 px-3 sm:py-4 sm:px-6 glass-divider">
      {renderContent()}
    </div>
  );
});

StatusTimer.displayName = 'StatusTimer';
export default StatusTimer;
