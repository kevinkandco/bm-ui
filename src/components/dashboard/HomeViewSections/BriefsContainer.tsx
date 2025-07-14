import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Clock, Zap, ArrowRight } from "lucide-react";
import BriefCard from "./BriefCard";
import { Summary } from "../types";
import ViewErrorMessage from "../ViewErrorMessage";
import BriefCardSkeleton from "./BriefCardSkeleton";
import UpcomingBriefCard from "./UpcomingBriefCard";
import { Button } from "@/components/ui/button";
import { UseAudioPlayerType } from "@/hooks/useAudioPlayer";

interface BriefsContainerProps {
  briefs: Summary[];
  totalBriefs: number;
  briefsLoading: boolean;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number, title: string, transcript: string) => void;
  onViewAllBriefs: () => void;
  onGetBriefedNow?: () => void;
  onUpdateSchedule?: () => void;
  upcomingBrief?: Summary;
  playingBrief: number | null;
  onPlayBrief: (briefId: number) => void
  audioPlayer: UseAudioPlayerType;
}

const BriefsContainer = ({
  briefs,
  totalBriefs,
  briefsLoading,
  onViewBrief,
  onViewTranscript,
  onViewAllBriefs,
  onGetBriefedNow,
  onUpdateSchedule,
  upcomingBrief,
  playingBrief,
  onPlayBrief,
  audioPlayer
}: BriefsContainerProps) => {
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  // Check if user is new (no briefs and has upcoming brief)
  const isFirstTimeUser = briefs?.length === 0 && totalBriefs === 0 && upcomingBrief;

  // Filter briefs for today vs past
  const todaysBriefs = briefs.filter(brief => brief?.time?.includes("Today"));
  const pastBriefs = briefs.filter(brief => !brief?.time?.includes("Today"));

  const handleClick = (message: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
    setMessage(message);
  };
  
  const handleClose = () => {
    setOpen(false);
  }
  return (
    <Card className="w-full rounded-xl shadow-none border-0" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
      boxShadow: 'none'
    }}>
      <CardContent className="p-3">
        <div className="space-y-4">
          {/* Upcoming Briefs Section - Collapsible (moved above) */}
          {upcomingBrief && (
            <div className="pt-2">
              <Collapsible open={upcomingOpen} onOpenChange={setUpcomingOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-white-text/80 px-1">Upcoming</h3>
                    <span className="text-xs text-white-text/60">
                      {upcomingBrief?.title} • {upcomingBrief?.time}
                    </span>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-white-text/60 transition-transform duration-200 ${upcomingOpen ? 'transform rotate-180' : ''}`} />
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pt-2">
                  <UpcomingBriefCard
                    briefName={upcomingBrief?.title}
                    scheduledTime={upcomingBrief?.time}
                    onGetBriefedNow={onGetBriefedNow}
                    onUpdateSchedule={onUpdateSchedule}
                  />
                </CollapsibleContent>
              </Collapsible>
              {todaysBriefs.length > 0 && <Separator className="mt-4 bg-white-text/10" />}
            </div>
          )}

          {/* Today's Briefs Section - Show if there are any briefs from today */}
          {briefs?.length > 0 && (
            <div className="pt-2">
              <h3 className="text-sm font-medium text-white-text/80 px-1 mb-2">Today's Briefs</h3>
              <div className="space-y-2">
                {briefs?.map((brief, index) => (
                  <BriefCard
                    key={brief.id}
                    brief={brief}
                    onViewBrief={onViewBrief}
                    onViewTranscript={onViewTranscript}
                    onPlayBrief={onPlayBrief}
                    playingBrief={playingBrief}
                    isLast={index === todaysBriefs.length - 1}
                    audioPlayer={audioPlayer}
                    handleClick={handleClick}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </CardContent>
      <ViewErrorMessage open={open} onClose={handleClose} message={message} />
    </Card>
  );
};

export default React.memo(BriefsContainer);
