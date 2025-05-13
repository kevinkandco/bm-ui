
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LatestBriefSectionProps {
  onClick: () => void;
}

const LatestBriefSection = ({ onClick }: LatestBriefSectionProps) => {
  return (
    <div className="p-6 hover:bg-surface-raised/30 transition-colors cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-text-primary text-lg font-medium">Latest Brief</h2>
        <span className="text-sm text-text-secondary">Today, 8:00 AM</span>
      </div>
      <p className="text-text-secondary mb-4 text-sm">Quick summary of your morning updates</p>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Mail className="h-5 w-5 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">5 emails reviewed</span>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <MessageSquare className="h-5 w-5 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">12 Slack messages</span>
        </div>
        
        <Button variant="outline" size="sm" className="ml-auto border-border-subtle text-text-primary hover:bg-surface-raised/30 hover:text-accent-primary shadow-subtle">
          View Full Brief
        </Button>
      </div>
    </div>
  );
};

export default React.memo(LatestBriefSection);
