import React, { useState, useEffect, useCallback } from "react";
import { Clock, Headphones, Zap, Plane, X, SquareArrowOutUpRight, Power, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { BriefSchedules, IStatus, UserSchedule } from "./types";

export interface StatusTimerProps {
  status: IStatus;
  focusModeAppType: "offline" | "DND" | null;
  focusTime?: number; //in seconds
  focusModeExitLoading?: boolean;
  briefSchedules?: BriefSchedules[];
  userSchedule?: UserSchedule;
  onExitFocusMode?: () => void;
  onSignBackOn?: () => void;
  onToggleCatchMeUp?: () => void;
  // isSignoff: boolean;
  // fetchDashboardData: () => void;
  onToggleFocusMode?: () => void;
  // onToggleSignOff?: () => void;
}

const StatusTimer = React.memo(
  ({
    status,
    focusModeAppType,
    focusTime,
    userSchedule,
    briefSchedules,
    onExitFocusMode,
    focusModeExitLoading,
    onSignBackOn,
    onToggleCatchMeUp,
    // isSignoff,
    // fetchDashboardData,
    onToggleFocusMode,
    // onToggleSignOff,
  }: StatusTimerProps) => {
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
    const [timeUntilNextBrief, setTimeUntilNextBrief] =
      useState<string>("00:00:00");
    const [startTime, setStartTime] = useState<number | null>(null);
    const [focusTimeRemaining, setFocusTimeRemaining] =
      useState<string>("00:00:00");
    const [hasExitedFocus, setHasExitedFocus] = useState(false);

    // For focus mode - default 30 minutes
    // const focusTime = 60; // 30 minutes in seconds

    useEffect(() => {
      if (status === "focus") {
        setHasExitedFocus(false);
        setStartTime(Date.now());
      }
    }, [status, focusTime]);

    useEffect(() => {
      if (status !== "focus") {
        setStartTime(null);
      }
    }, [status, focusTime]);

    // Calculate time until next brief (9AM tomorrow if after 8AM, otherwise 8AM today)
    const calculateTimeUntilNextBrief = useCallback(() => {
      const schedule = briefSchedules[0]; // assume 1 schedule for now
      const workdayStart = userSchedule?.workday_start || "08:00";
      const [hour, minute] = (
        status === "away" ? workdayStart : schedule.briefTime
      )
        .split(":")
        .map(Number);
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

      const scheduledDayIndexes = scheduledDays.map(
        (day) => dayNameToIndex[day]
      );

      const now = new Date();
      const nowDay = now.getDay();

      // Helper: create a brief datetime for a given offset (0 = today, 1 = tomorrow, etc.)
      const getBriefTime = (offset: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() + offset);
        date.setHours(hour, minute, 0, 0);
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
    }, [userSchedule, briefSchedules, status]);

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

      const hours = Math.floor(remainingSeconds / 3600)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((remainingSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor(remainingSeconds % 60)
        .toString()
        .padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    }, [startTime, focusTime]);

    useEffect(() => {
      // Update countdown timer
      const countdownTimer = setInterval(() => {
        if (status === "active" || status === "away") {
          setTimeUntilNextBrief(calculateTimeUntilNextBrief());
        } else if (status === "focus") {
          const remaining = calculateFocusTimeRemaining();
          setFocusTimeRemaining(remaining);
          setTimeElapsed(`${remaining} remaining`);

          if (remaining === "00:00:00" && !hasExitedFocus && onExitFocusMode) {
            setHasExitedFocus(true);
            onExitFocusMode();
          }
        }
      }, 1000);

      // Only update the elapsed timer if the user is not active
      const elapsedTimer = setInterval(() => {
        if (startTime && status !== "active" && status !== "focus") {
          const now = Date.now();
          const diff = Math.floor((now - startTime) / 1000);
          const hours = String(Math.floor(diff / 3600)).padStart(2, "0");
          const minutes = String(Math.floor((diff % 3600) / 60)).padStart(
            2,
            "0"
          );
          const seconds = String(diff % 60).padStart(2, "0");
          setTimeElapsed(`${hours}:${minutes}:${seconds}`);
        }
      }, 1000);

      return () => {
        clearInterval(countdownTimer);
        clearInterval(elapsedTimer);
      };
    }, [
      startTime,
      status,
      calculateTimeUntilNextBrief,
      calculateFocusTimeRemaining,
      focusTimeRemaining,
      onExitFocusMode,
      hasExitedFocus,
    ]);

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

      return (
        nextBrief.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }) +
        " on " +
        nextBrief.toLocaleDateString([], { month: "short", day: "numeric" })
      );
    };

  // Render different content based on user status - improved mobile layout
  const renderContent = () => {
    switch (status) {
      case "focus":
        // Focus mode UI is now handled inline in the header
        return null;
      case "away":
        return <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="bg-yellow-500 text-white p-2 rounded-full mr-2">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-medium text-text-primary">Away</h3>
                <p className="text-xs sm:text-sm text-text-secondary">You've signed off for today.</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              {onSignBackOn && <Button onClick={onSignBackOn} variant="black" size={isMobile ? "sm" : "default"} className="rounded-full">
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Sign back on</span>
                </Button>}
            </div>
          </div>;
      case "vacation":
        return <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
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
              {onSignBackOn && <Button onClick={onSignBackOn} variant="black" size={isMobile ? "sm" : "default"} className="rounded-full">
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Exit</span>
                </Button>}
            </div>
          </div>;
      default:
        // Active status - improved mobile layout
        return <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
            <div className="flex items-center">
              <div className="bg-accent-primary text-white p-2 rounded-full mr-2">
                <Zap className="h-4 w-4" />
              </div>

              {/* <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0"> */}
              {/* Theme toggle removed on mobile */}
              {!isMobile && <ThemeToggle className="h-8 w-8 sm:h-9 sm:w-9" />}
              
              {onToggleFocusMode && <Button onClick={onToggleFocusMode} variant="outline" size={isMobile ? "sm" : "default"} className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle">
                  <Headphones className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Focus</span>
                </Button>}
              
              {onToggleCatchMeUp && <Button onClick={onToggleCatchMeUp} size={isMobile ? "sm" : "default"} className="rounded-full shadow-subtle hover:shadow-glow transition-all bg-accent-primary text-white">
                  <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                  <span className="text-xs sm:text-sm">Catch Up</span>
                </Button>}
            </div>
          </div>;
    }
  };

  // Only show status timer for non-focus states
  if (status === "focus") {
    return null;
  }
  return <div className="py-2 px-3 sm:py-4 sm:px-6 border-b border-border-subtle">
      {renderContent()}
    </div>;
});
StatusTimer.displayName = 'StatusTimer';
export default StatusTimer;
