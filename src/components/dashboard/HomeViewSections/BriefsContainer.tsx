import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Clock, Zap, ArrowRight } from "lucide-react";
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
  totalBriefs: number;
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
  totalBriefs,
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

  // Check if user is new (no briefs and has upcoming brief)
  const isFirstTimeUser = briefs.length === 0 && totalBriefs === 0 && upcomingBrief;

  // Filter briefs for today vs past
  const todaysBriefs = briefs.filter(brief => brief.timeCreated.includes("Today"));
  const pastBriefs = briefs.filter(brief => !brief.timeCreated.includes("Today"));

  return (
    <Card className="section-card">
      <CardContent className="p-0">
        <div className="space-y-6">
          {/* Today's Briefs Section - Show if there are any briefs from today */}
          {todaysBriefs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-4">Today's Briefs</h3>
              <div className="space-y-3">
                {todaysBriefs.map((brief, index) => (
                  <BriefCard
                    key={brief.id}
                    brief={brief}
                    onViewBrief={onViewBrief}
                    onViewTranscript={onViewTranscript}
                    onPlayBrief={onPlayBrief}
                    playingBrief={playingBrief}
                    isLast={index === todaysBriefs.length - 1}
                  />
                ))}
              </div>
              {upcomingBrief && <hr className="border-border-light mt-6" />}
            </div>
          )}

          {/* Upcoming Briefs Section - Collapsible */}
          {upcomingBrief && (
            <div>
              <Collapsible open={upcomingOpen} onOpenChange={setUpcomingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left hover:bg-muted/20 rounded-lg p-2 transition-colors">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">Upcoming</h3>
                    <span className="text-xs text-text-secondary">
                      {upcomingBrief.name} • {upcomingBrief.scheduledTime}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform duration-150 ${upcomingOpen ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-3 pt-3">
                  <UpcomingBriefCard
                    briefName={upcomingBrief.name}
                    scheduledTime={upcomingBrief.scheduledTime}
                    onGetBriefedNow={onGetBriefedNow}
                    onUpdateSchedule={onUpdateSchedule}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(BriefsContainer);
