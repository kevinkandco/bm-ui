
import React from "react";
import { Clock, Zap, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpcomingBriefCardProps {
  briefName: string;
  scheduledTime: string;
  onGetBriefedNow?: () => void;
  onUpdateSchedule?: () => void;
}

const UpcomingBriefCard = ({ briefName, scheduledTime, onGetBriefedNow, onUpdateSchedule }: UpcomingBriefCardProps) => {
  return (
    <div className="w-full brief-glass-card opacity-60 relative">
      {/* Coming Soon Badge - glass styling */}
      <div className="absolute top-3 left-3 z-10">
        <div className="glass-badge text-blue-400">
          Coming Soon
        </div>
      </div>

      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Clock icon with glass styling */}
            <div className="glass-ultra-thin w-10 h-10 rounded-full flex items-center justify-center opacity-50 flex-shrink-0">
              <Clock className="h-5 w-5 text-accent-primary glass-icon" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-glass-primary/70">
                {briefName}
              </h3>
              <p className="text-xs text-glass-secondary/70">
                Scheduled for {scheduledTime}
              </p>
            </div>
          </div>
          
          {/* Right side with glass buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onUpdateSchedule && (
              <Button 
                onClick={onUpdateSchedule}
                variant="outline"
                size="sm" 
                className="monitoring-chip text-xs bg-transparent"
              >
                <Calendar className="h-3 w-3 mr-1 glass-icon" />
                Update Schedule
              </Button>
            )}
            
            {onGetBriefedNow && (
              <Button 
                onClick={onGetBriefedNow}
                variant="outline"
                size="sm" 
                className="monitoring-chip text-blue-400 text-xs bg-transparent"
              >
                <Zap className="h-3 w-3 mr-1 glass-icon" />
                Get Briefed Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpcomingBriefCard);
