
import React, { useState, useEffect } from "react";
import { Clock, Headphones, Zap, Plane } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatusTimerProps {
  status: "active" | "away" | "focus" | "vacation";
}

const StatusTimer = React.memo(({ status }: StatusTimerProps) => {
  const [timeElapsed, setTimeElapsed] = useState<string>("00:00:00");
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    // Only update the timer if the user is not active
    if (status === "active") return;
    
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - startTime) / 1000); // seconds
      
      const hours = Math.floor(diff / 3600).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
      const seconds = Math.floor(diff % 60).toString().padStart(2, '0');
      
      setTimeElapsed(`${hours}:${minutes}:${seconds}`);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime, status]);

  const renderContent = () => {
    switch (status) {
      case "focus":
        return (
          <div className="flex items-center">
            <div className="bg-accent-primary text-white p-3 rounded-full mr-4">
              <Headphones className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-text-primary">Focus Mode</h3>
              <p className="text-text-secondary">Time in focus: {timeElapsed}</p>
            </div>
          </div>
        );
      
      case "away":
        return (
          <div className="flex items-center">
            <div className="bg-yellow-500 text-white p-3 rounded-full mr-4">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-text-primary">Away</h3>
              <p className="text-text-secondary">Time away: {timeElapsed}</p>
            </div>
          </div>
        );
      
      case "vacation":
        return (
          <div className="flex items-center">
            <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-text-primary">Out of Office</h3>
              <p className="text-text-secondary">Time OOO: {timeElapsed}</p>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center">
            <div className="bg-accent-primary text-white p-3 rounded-full mr-4">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-text-primary">Latest Brief</h3>
              <p className="text-text-secondary">Morning Brief - Today, 8:00 AM</p>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="p-4 md:p-6 border-border-subtle shadow-subtle rounded-3xl">
      {renderContent()}
    </Card>
  );
});

StatusTimer.displayName = 'StatusTimer';
export default StatusTimer;
