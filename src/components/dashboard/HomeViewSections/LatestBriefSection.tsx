
import React, { useState } from "react";
import { Mail, MessageSquare, ChevronDown, ChevronRight, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LatestBriefSectionProps {
  onClick: () => void;
  isSelected?: boolean;
}

const LatestBriefSection = ({ onClick, isSelected }: LatestBriefSectionProps) => {
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);

  const upcomingBriefs = [
    {
      id: 1,
      title: "Daily Brief",
      scheduledTime: "Tomorrow at 7:30 AM",
      isComingSoon: true
    },
    {
      id: 2,
      title: "Evening Summary",
      scheduledTime: "Tomorrow at 6:00 PM",
      isComingSoon: true
    }
  ];

  return (
    <div className="space-y-3">
      <div 
        className={cn(
          "py-4 hover:bg-[hsl(190,28%,22%)]/40 transition-colors cursor-pointer",
          isSelected ? "bg-[hsl(190,28%,22%)]/30" : "bg-[hsl(190,28%,22%)]/20"
        )}
        onClick={onClick}
      >
        <h3 className="text-sm font-medium text-text-primary mb-1">Morning Scheduled Brief</h3>
        <p className="text-xs text-text-secondary">
          Delivered at 7:00 AM on August 4, 2025
        </p>
        <p className="text-xs text-text-secondary/80">
          (Summarizing: 5:00 PM - 7:00 AM)
        </p>
      </div>

      {/* Upcoming Briefs Section */}
      <div className="space-y-2">
        <div 
          className="flex items-center justify-between cursor-pointer hover:bg-surface-raised/20 rounded-lg transition-colors"
          onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Upcoming</span>
            <span className="text-xs text-text-secondary">2 scheduled briefs today</span>
          </div>
          {isUpcomingExpanded ? (
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          )}
        </div>

        {isUpcomingExpanded && (
          <div className="animate-fade-in space-y-2">
            <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-raised/20 opacity-60">
              <div className="mb-2.5">
                <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-text-secondary/20 text-text-secondary/70 mb-1.5">
                  Coming Soon
                </div>
                <h4 className="text-xs font-medium text-text-secondary mb-0.5">Daily Brief</h4>
                <p className="text-xs text-text-secondary/70">
                  Scheduled for Tomorrow at 7:30 AM
                </p>
              </div>
              
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                  className="flex items-center gap-1 text-xs h-6 px-2 opacity-50"
                >
                  <Calendar className="h-2.5 w-2.5" />
                  Update Schedule
                </Button>
                <Button 
                  size="sm"
                  disabled
                  className="flex items-center gap-1 text-xs h-6 px-2 opacity-50"
                >
                  <Zap className="h-2.5 w-2.5" />
                  Get Briefed Now
                </Button>
              </div>
            </div>
            
            <div className="p-2.5 rounded-lg border border-border-subtle bg-surface-raised/20 opacity-60">
              <div className="mb-2.5">
                <div className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-text-secondary/20 text-text-secondary/70 mb-1.5">
                  Coming Soon
                </div>
                <h4 className="text-xs font-medium text-text-secondary mb-0.5">Evening Summary</h4>
                <p className="text-xs text-text-secondary/70">
                  Scheduled for Tomorrow at 6:00 PM
                </p>
              </div>
              
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled
                  className="flex items-center gap-1 text-xs h-6 px-2 opacity-50"
                >
                  <Calendar className="h-2.5 w-2.5" />
                  Update Schedule
                </Button>
                <Button 
                  size="sm"
                  disabled
                  className="flex items-center gap-1 text-xs h-6 px-2 opacity-50"
                >
                  <Zap className="h-2.5 w-2.5" />
                  Get Briefed Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LatestBriefSection);
