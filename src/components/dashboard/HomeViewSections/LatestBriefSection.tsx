import React, { useState } from "react";
import { Mail, MessageSquare, ChevronDown, ChevronRight, Calendar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface LatestBriefSectionProps {
  onClick: () => void;
  isSelected?: boolean;
}
const LatestBriefSection = ({
  onClick,
  isSelected
}: LatestBriefSectionProps) => {
  const [isUpcomingExpanded, setIsUpcomingExpanded] = useState(false);
  const upcomingBriefs = [{
    id: 1,
    title: "Daily Brief",
    scheduledTime: "Tomorrow at 7:30 AM",
    isComingSoon: true
  }, {
    id: 2,
    title: "Evening Summary",
    scheduledTime: "Tomorrow at 6:00 PM",
    isComingSoon: true
  }];
  return <div className="space-y-4">
      <div 
        className={cn(
          "p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--brand-600)] hover:bg-white/[0.04] transition-colors cursor-pointer",
          isSelected && "bg-white/[0.04]"
        )} 
        onClick={onClick}
      >
        <div className="space-y-3">
          <h2 className="text-xl font-semibold leading-7" style={{color: 'var(--text-primary)'}}>
            Latest Brief
          </h2>
          <div className="flex items-center gap-1 text-xs" style={{color: 'var(--text-muted)'}}>
            <span>Monday @7:30am PT</span>
            <span>•</span>
            <span>12 messages</span>
            <span>•</span>
            <span>3 actions</span>
          </div>
          <Button size="sm" className="bg-gradient-to-r from-[#1B5862] to-[#277F64] text-white">
            View Brief
          </Button>
        </div>
      </div>

      {/* Upcoming Briefs Section */}
      <div className="space-y-2">
        <div 
          onClick={() => setIsUpcomingExpanded(!isUpcomingExpanded)} 
          className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] rounded-xl p-3 transition-colors"
        >
          <div className="space-y-1">
            <h3 className="text-sm font-medium" style={{color: 'var(--text-primary)'}}>
              Upcoming
            </h3>
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs" style={{color: 'var(--text-secondary)'}}>
                <span>Tomorrow 7:30 AM</span>
                <span>•</span>
                <span>Daily Brief</span>
              </div>
              <div className="flex items-center gap-1 text-xs" style={{color: 'var(--text-secondary)'}}>
                <span>Tomorrow 6:00 PM</span>
                <span>•</span>
                <span>Evening Summary</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" style={{color: 'var(--text-secondary)'}}>
            View all
          </Button>
        </div>

      </div>
    </div>;
};
export default React.memo(LatestBriefSection);