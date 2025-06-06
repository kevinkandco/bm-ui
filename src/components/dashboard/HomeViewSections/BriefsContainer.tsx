
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
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
  onUpdateSchedule?: () => void;
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
  onUpdateSchedule,
  upcomingBrief
}: BriefsContainerProps) => {
  const [upcomingOpen, setUpcomingOpen] = useState(false);

  return (
    <Card 
      className="w-full rounded-xl shadow-none border-0" 
      style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}
    >
      <CardContent className="p-3">
        <div className="space-y-4">
          {/* Upcoming Briefs Section - Collapsible */}
          {upcomingBrief && (
            <div className="pt-2">
              <Collapsible open={upcomingOpen} onOpenChange={setUpcomingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <h3 className="text-sm font-medium text-white-text/80 px-1">Upcoming</h3>
                  <ChevronDown 
                    className={`h-4 w-4 text-white-text/60 transition-transform duration-200 ${
                      upcomingOpen ? 'transform rotate-180' : ''
                    }`} 
                  />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  <UpcomingBriefCard
                    briefName={upcomingBrief.name}
                    scheduledTime={upcomingBrief.scheduledTime}
                    onGetBriefedNow={onGetBriefedNow}
                    onUpdateSchedule={onUpdateSchedule}
                  />
                </CollapsibleContent>
              </Collapsible>
              <Separator className="mt-4 bg-white-text/10" />
            </div>
          )}

          {/* Available Briefs Section */}
          {briefs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white-text/80 px-1">Available</h3>
              <div className="space-y-2">
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
              </div>
            </div>
          )}
          
          {/* Bottom section with brief count and view all link */}
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm text-text-secondary">
              {briefs.length} brief{briefs.length !== 1 ? 's' : ''}
            </span>
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
