import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Clock, Zap } from "lucide-react";
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
  const [upcomingOpen, setUpcomingOpen] = useState(true);

  // Check if user is new (no briefs and has upcoming brief)
  const isFirstTimeUser = briefs.length === 0 && totalBriefs === 0 && upcomingBrief;
  return <Card className="w-full rounded-xl shadow-none border-0" style={{
    background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
    boxShadow: 'none'
  }}>
      <CardContent className="p-3">
        <div className="space-y-4">
          {/* Upcoming Briefs Section - Collapsible */}
          {upcomingBrief && <div className="pt-2">
              <Collapsible open={upcomingOpen} onOpenChange={setUpcomingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white-text/80 px-1">Upcoming</h3>
                    <span className="text-xs text-white-text/60">
                      {upcomingBrief.name} • {upcomingBrief.scheduledTime}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white-text/60 transition-transform duration-200 ${upcomingOpen ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  <UpcomingBriefCard briefName={upcomingBrief.name} scheduledTime={upcomingBrief.scheduledTime} onGetBriefedNow={onGetBriefedNow} onUpdateSchedule={onUpdateSchedule} />
                </CollapsibleContent>
              </Collapsible>
              <Separator className="mt-4 bg-white-text/10" />
            </div>}

          {/* Ready Section - Show empty state for first-time users, normal view for others */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-white-text/80 px-1">Past briefs</h3>
            
            {isFirstTimeUser ?
          // Empty state for first-time users
          <div className="text-center py-8 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-overlay/50 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-text-secondary" />
                </div>
                <h4 className="text-sm font-medium text-text-primary mb-2">
                  Your first brief is on the way!
                </h4>
                <p className="text-xs text-text-secondary mb-4 max-w-xs mx-auto">
                  We're monitoring your connected accounts. Your first brief will appear here once it's ready based on your schedule.
                </p>
                {onGetBriefedNow && <Button onClick={onGetBriefedNow} size="sm" className="bg-accent-primary text-white hover:bg-accent-primary/90 rounded-lg px-4 py-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Get briefed now
                  </Button>}
              </div> : briefs.length > 0 ?
          // Normal view when briefs are available
          <div className="space-y-2">
                {briefs.map((brief, index) => <BriefCard key={brief.id} brief={brief} onViewBrief={onViewBrief} onViewTranscript={onViewTranscript} onPlayBrief={onPlayBrief} playingBrief={playingBrief} isLast={index === briefs.length - 1} />)}
              </div> :
          // Empty state for returning users with no current briefs
          <div className="text-center py-6 px-4">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-overlay/30 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-text-secondary" />
                </div>
                <p className="text-xs text-text-secondary">
                  No briefs ready right now
                </p>
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
};
export default React.memo(BriefsContainer);