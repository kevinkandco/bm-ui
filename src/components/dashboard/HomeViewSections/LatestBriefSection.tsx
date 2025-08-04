
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LatestBriefSectionProps {
  onClick: () => void;
}

const LatestBriefSection = ({ onClick }: LatestBriefSectionProps) => {
  return (
    <div 
      className="p-4 rounded-lg bg-surface-raised/30 border border-border-subtle hover:bg-surface-raised/50 transition-colors cursor-pointer"
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
  );
};

export default React.memo(LatestBriefSection);
