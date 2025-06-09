
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
    <div className="w-full transition-all duration-300 rounded-xl overflow-hidden opacity-60 relative" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.3) 0%, rgba(43, 49, 54, 0.3) 100%)'
    }}>
      {/* Coming Soon Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/40">
          Coming Soon
        </div>
      </div>

      <div className="p-4 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Clock icon */}
            <div className="w-10 h-10 rounded-full bg-primary-teal/10 flex items-center justify-center opacity-50 flex-shrink-0">
              <Clock className="h-5 w-5 text-primary-teal" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-white-text/70">
                {briefName}
              </h3>
              {scheduledTime && <p className="text-xs text-light-gray-text/70">
                Scheduled for {scheduledTime}
              </p>}
            </div>
          </div>
          
          {/* Right side with buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {onUpdateSchedule && (
              <Button 
                onClick={onUpdateSchedule}
                variant="outline"
                size="sm" 
                className="border-light-gray-text/40 text-light-gray-text hover:border-light-gray-text/60 hover:text-white-text rounded-lg px-3 py-1 text-xs bg-transparent"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Update Schedule
              </Button>
            )}
            
            {onGetBriefedNow && (
              <Button 
                onClick={onGetBriefedNow}
                variant="outline"
                size="sm" 
                className="border-blue-500/60 text-blue-400 hover:border-blue-400 hover:text-blue-300 rounded-lg px-3 py-1 text-xs bg-transparent"
              >
                <Zap className="h-3 w-3 mr-1" />
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
