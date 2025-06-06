import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BriefCard from "./BriefCard";
import UpcomingBriefCard from "./UpcomingBriefCard";
import { Button } from "@/components/ui/button";

interface Brief {
  id: number;
  name: string;
  timeCreated: string;
  timeRange: string;
  slackMessages: {
    total: number;
    fromPriorityPeople: number;
  };
  emails: {
    total: number;
    fromPriorityPeople: number;
  };
  actionItems: number;
  hasTranscript: boolean;
}

interface BriefsContainerProps {
  briefs: Brief[];
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onViewAllBriefs: () => void;
  onGetBriefedNow?: () => void;
  upcomingBrief?: {
    name: string;
    scheduledTime: string;
  };
}

const BriefsContainer = ({ 
  briefs, 
  onViewBrief, 
  onViewTranscript, 
  onPlayBrief, 
  playingBrief, 
  onViewAllBriefs,
  onGetBriefedNow,
  upcomingBrief
}: BriefsContainerProps) => {
  return (
    <Card 
      className="w-full rounded-xl shadow-none border-0" 
      style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}
    >
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Upcoming Brief Card */}
          {upcomingBrief && onGetBriefedNow && (
            <UpcomingBriefCard
              briefName={upcomingBrief.name}
              scheduledTime={upcomingBrief.scheduledTime}
              onGetBriefedNow={onGetBriefedNow}
            />
          )}

          {/* Existing Brief Cards */}
          {briefs.map((brief, index) => (
            <BriefCard
              key={brief.id}
              brief={brief}
              onViewBrief={onViewBrief}
              onViewTranscript={onViewTranscript}
              onPlayBrief={onPlayBrief}
              playingBrief={playingBrief}
              isLast={index === briefs.length - 1}
            />
          ))}
          
          {/* View All Briefs link at bottom right */}
          <div className="flex justify-end pt-1">
            <button 
              onClick={onViewAllBriefs} 
              className="text-sm text-text-secondary hover:text-text-primary transition-colors underline"
            >
              View all briefs
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(BriefsContainer);
