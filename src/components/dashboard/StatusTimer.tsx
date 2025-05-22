import React, { useState, useEffect, useCallback } from "react";
import { Clock, Headphones, Zap, Plane, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { BriefSchedules } from "./types";

interface StatusTimerProps {
  status: "active" | "away" | "focus" | "vacation";
  focusTime: number; //in seconds
  focusModeExitLoading: boolean;
  briefSchedules: BriefSchedules[];
  onToggleCatchMeUp?: () => void;
  onToggleFocusMode?: () => void;
  onExitFocusMode?: () => void;
}

const StatusTimer = React.memo(({ status, focusTime, focusModeExitLoading, briefSchedules, onToggleCatchMeUp, onToggleFocusMode, onExitFocusMode }: StatusTimerProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
  const [timeUntilNextBrief, setTimeUntilNextBrief] = useState<string>("00:00:00");
  const [startTime, setStartTime] = useState<number | null>(null);
  const [focusTimeRemaining, setFocusTimeRemaining] = useState<string>("00:00:00");
  
  // For focus mode - default 30 minutes
  // const focusTime = 60; // 30 minutes in seconds

    useEffect(() => {
			if (status === "focus") {
				setStartTime(Date.now());
			}
		}, [status]);

		useEffect(() => {
			if (status !== "focus") {
				setStartTime(null);
			}
		}, [status]);

  
  // Calculate time until next brief (9AM tomorrow if after 8AM, otherwise 8AM today)
  const calculateTimeUntilNextBrief = useCallback(() => {
		const schedule = briefSchedules[0]; // assume 1 schedule for now
		const [briefHour, briefMinute] = schedule.briefTime.split(":").map(Number);
		const scheduledDays = schedule.days; // e.g., ["Monday", "Tuesday", ...]

		const dayNameToIndex: Record<string, number> = {
			Sunday: 0,
			Monday: 1,
			Tuesday: 2,
			Wednesday: 3,
			Thursday: 4,
			Friday: 5,
			Saturday: 6,
		};

		const scheduledDayIndexes = scheduledDays.map((day) => dayNameToIndex[day]);

		const now = new Date();
		const nowDay = now.getDay();

		// Helper: create a brief datetime for a given offset (0 = today, 1 = tomorrow, etc.)
		const getBriefTime = (offset: number) => {
			const date = new Date(now);
			date.setDate(date.getDate() + offset);
			date.setHours(briefHour, briefMinute, 0, 0);
			return date;
		};

		// Step 1: check today
		const todayBrief = getBriefTime(0);
		if (scheduledDayIndexes.includes(nowDay) && now < todayBrief) {
			const diffMs = todayBrief.getTime() - now.getTime();
			return formatDiff(diffMs);
		}

		// Step 2: find next matching day
		for (let i = 1; i <= 7; i++) {
			const futureDay = (nowDay + i) % 7;
			if (scheduledDayIndexes.includes(futureDay)) {
				const nextBrief = getBriefTime(i);
				const diffMs = nextBrief.getTime() - now.getTime();
				return formatDiff(diffMs);
			}
		}

		// fallback
		return "00:00:00";
	}, [briefSchedules]);

	const formatDiff = (diffMs: number) => {
		const diffSec = Math.floor(diffMs / 1000);
		const hours = Math.floor(diffSec / 3600)
			.toString()
			.padStart(2, "0");
		const minutes = Math.floor((diffSec % 3600) / 60)
			.toString()
			.padStart(2, "0");
		const seconds = Math.floor(diffSec % 60)
			.toString()
			.padStart(2, "0");
		return `${hours}:${minutes}:${seconds}`;
	};


  // Calculate remaining focus time
  const calculateFocusTimeRemaining = useCallback(() => {
    if (!startTime) return "00:00:00";
    
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const remainingSeconds = Math.max(0, focusTime - elapsedSeconds);

    const hours = Math.floor(remainingSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((remainingSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = Math.floor(remainingSeconds % 60).toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }, [startTime, focusTime]);


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

  // Calculate next brief time after focus mode
  const getNextBriefAfterFocus = () => {
    const now = new Date();
    const focusEndTime = new Date(startTime + focusTime * 1000);
    
    // If focus ends before 9 AM tomorrow, next brief at 9 AM
    const nextBrief = new Date(focusEndTime);
    if (focusEndTime.getHours() >= 9) {
      nextBrief.setDate(nextBrief.getDate() + 1);
    }
    nextBrief.setHours(9, 0, 0, 0);
    
    return nextBrief.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + 
           ' on ' + 
           nextBrief.toLocaleDateString([], {month: 'short', day: 'numeric'});
  };

  // Render different content based on user status - improved mobile layout
  const renderContent = () => {
    switch (status) {
      case "focus":
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="bg-accent-primary text-white p-2 rounded-full mr-2">
                <Headphones className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-text-primary">Focus Mode</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{focusTimeRemaining} remaining</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {/* Theme toggle removed on mobile */}
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onExitFocusMode && (
                <Button 
                  onClick={onExitFocusMode}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className={`rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle`}
                  disabled={focusModeExitLoading}
                >
                  {focusModeExitLoading ? (
                    <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    ) : <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  } 
                  <span className="text-xs sm:text-sm">Exit</span>
                </Button>
              )}
            </div>
          </div>
        );
      
      case "away":
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white p-2 rounded-full mr-2">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-text-primary">Away</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {/* Theme toggle removed on mobile */}
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
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
              <div className="bg-blue-500 text-white p-2 rounded-full mr-2">
                <Plane className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-text-primary">Out of Office</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{timeElapsed}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {/* Theme toggle removed on mobile */}
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>
              )}
            </div>
          </div>
        );
      
      default: // Active status - improved mobile layout
        return (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="bg-accent-primary text-white p-2 rounded-full mr-2">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-text-primary">Next Brief</h3>
                <p className="text-xs sm:text-sm text-text-secondary">{timeUntilNextBrief}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
              {/* Theme toggle removed on mobile */}
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleFocusMode && (
                <Button 
                  onClick={onToggleFocusMode}
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle"
                >
                  <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Focus</span>
                </Button>
              )}
              
              {onToggleCatchMeUp && (
                <Button 
                  onClick={onToggleCatchMeUp}
                  size={isMobile ? "sm" : "default"}
                  className="rounded-full shadow-subtle hover:shadow-glow transition-all bg-accent-primary text-white"
                >
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="py-2 px-3 sm:py-4 sm:px-6 border-b border-border-subtle">
      {renderContent()}
    </div>
  );
});

StatusTimer.displayName = 'StatusTimer';
export default StatusTimer;
