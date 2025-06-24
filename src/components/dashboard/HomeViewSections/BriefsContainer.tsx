
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown, Clock, Zap } from "lucide-react";
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
  const isFirstTimeUser = briefs.length === 0 && totalBriefs === 0 && upcomingBrief;

  const handleClick = (message: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
    setMessage(message);
  };
  
  const handleClose = () => {
    setOpen(false);
  }
  return (<>
    <Card className="w-full rounded-xl shadow-none border-0" style={{
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
                        {upcomingBrief?.title} {upcomingBrief && `• ${upcomingBrief?.time}`}
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
                <Separator className="mt-4 bg-white-text/10" />
              </div>}

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-white-text/80 px-1">Ready</h3>

              {!briefsLoading ? isFirstTimeUser ? (
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
                  {onGetBriefedNow && (
                    <Button 
                      onClick={onGetBriefedNow}
                      size="sm"
                      className="bg-accent-primary text-white hover:bg-accent-primary/90 rounded-lg px-4 py-2"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Get briefed now
                    </Button>
                  )}
                </div>
              ) : briefs.length > 0 ? (
                  <div className="space-y-2">
                    {briefs.map((brief, index) => (
                      <BriefCard
                        key={brief.id}
                        brief={brief}
                        onViewBrief={onViewBrief}
                        onViewTranscript={onViewTranscript}
                        handleClick={handleClick}
                        isLast={index === briefs?.length - 1}
                        playingBrief={playingBrief}
                        onPlayBrief={onPlayBrief}
                        audioPlayer={audioPlayer}
                      />
                    ))}
                </div>
              ) : (
                // Empty state for returning users with no current briefs
                <div className="text-center py-6 px-4">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-surface-overlay/30 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-text-secondary" />
                  </div>
                  <p className="text-xs text-text-secondary">
                    No briefs ready right now
                  </p>
                </div>
              ) : [...Array(3)].map((_, idx) => <BriefCardSkeleton key={idx} />)}
            </div>
            
            {/* Bottom section with brief count and view all link */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm text-text-secondary">
                {totalBriefs} brief{totalBriefs !== 1 ? 's' : ''}
              </span>
              <button onClick={onViewAllBriefs} className="text-sm text-text-secondary hover:text-text-primary transition-colors underline">
                View all briefs
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
      <ViewErrorMessage open={open} onClose={handleClose} message={message} />
    </>
  );
};

export default React.memo(BriefsContainer);
