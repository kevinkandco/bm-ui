
import React from "react";
import { Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpcomingBriefCardProps {
  briefName: string;
  scheduledTime: string;
  onGetBriefedNow: () => void;
}

const UpcomingBriefCard = ({ briefName, scheduledTime, onGetBriefedNow }: UpcomingBriefCardProps) => {
  return (
    <div className="w-full transition-all duration-300 rounded-xl overflow-hidden opacity-60 relative" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.3) 0%, rgba(43, 49, 54, 0.3) 100%)'
    }}>
      {/* Coming Soon Overlay */}
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/40">
          Coming Soon
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Disabled play button */}
            <div className="w-10 h-10 rounded-full bg-primary-teal/10 flex items-center justify-center opacity-50 flex-shrink-0">
              <Clock className="h-5 w-5 text-primary-teal" />
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-white-text/70">
                {briefName}
              </h3>
              <p className="text-xs text-light-gray-text/70">
                Scheduled for {scheduledTime}
              </p>
            </div>
          </div>
          
          {/* Right side with Get Briefed Now button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button 
              onClick={onGetBriefedNow}
              size="sm" 
              className="bg-blue-600/80 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-xs"
            >
              <Zap className="h-3 w-3 mr-1" />
              Get Briefed Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpcomingBriefCard);
