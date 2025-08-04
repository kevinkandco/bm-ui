
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LatestBriefSectionProps {
  onClick: () => void;
  isSelected?: boolean;
}

const LatestBriefSection = ({ onClick, isSelected }: LatestBriefSectionProps) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-text-primary">Latest Brief</h2>
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
    </div>
  );
};

export default React.memo(LatestBriefSection);
