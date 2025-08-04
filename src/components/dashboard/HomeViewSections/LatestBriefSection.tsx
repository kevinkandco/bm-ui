
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
    }
  ];

  return (
    <div className="space-y-3">
      <div 
        className={cn(
          "p-4 rounded-lg border border-border-subtle hover:bg-surface-raised/50 transition-colors cursor-pointer",
          isSelected ? "bg-accent-primary/10 border-accent-primary" : "bg-surface-raised/30"
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
          className="flex items-center justify-between cursor-pointer hover:bg-surface-raised/20 p-2 rounded-lg transition-colors"
          onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-text-secondary">Upcoming</span>
            <span className="text-xs text-text-secondary">Daily Brief • Tomorrow at 7:30 AM</span>
          </div>
          {isUpcomingExpanded ? (
            <ChevronDown className="h-4 w-4 text-text-secondary" />
          ) : (
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          )}
        </div>

        {isUpcomingExpanded && (
          <div className="animate-fade-in p-4 rounded-lg border border-border-subtle bg-surface-raised/30">
            <div className="mb-3">
              <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent-primary/20 text-accent-primary mb-2">
                Coming Soon
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-1">Daily Brief</h3>
              <p className="text-sm text-text-secondary">
                Scheduled for Tomorrow at 7:30 AM
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                Update Schedule
              </Button>
              <Button 
                size="sm"
                className="flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Get Briefed Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(LatestBriefSection);
