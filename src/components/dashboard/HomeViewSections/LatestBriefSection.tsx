
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LatestBriefSectionProps {
  onClick: () => void;
}

const LatestBriefSection = ({ onClick }: LatestBriefSectionProps) => {
  return (
    <div className="p-card-padding hover:bg-card/20 transition-all duration-200 cursor-pointer" onClick={onClick}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-heading-md text-text-headline font-medium">Latest Brief</h2>
        <span className="text-meta text-text-secondary">Today, 8:00 AM</span>
      </div>
      <p className="text-body text-text-secondary mb-4">Quick summary of your morning updates</p>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1 bg-card/50 rounded-md p-2">
          <Mail className="h-5 w-5 text-icon" />
          <span className="text-body font-medium text-text-headline">5 emails reviewed</span>
        </div>
        
        <div className="flex items-center gap-2 flex-1 bg-card/50 rounded-md p-2">
          <MessageSquare className="h-5 w-5 text-icon" />
          <span className="text-body font-medium text-text-headline">12 Slack messages</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-auto"
        >
          View Full Brief
        </Button>
      </div>
    </div>
  );
};

export default React.memo(LatestBriefSection);
