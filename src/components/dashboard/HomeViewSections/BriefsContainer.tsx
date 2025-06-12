import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronDown } from "lucide-react";
import BriefCard from "./BriefCard";
import { Summary } from "../types";
import ViewErrorMessage from "../ViewErrorMessage";
import BriefCardSkeleton from "./BriefCardSkeleton";
import UpcomingBriefCard from "./UpcomingBriefCard";
import { Button } from "@/components/ui/button";
interface BriefsContainerProps {
  briefs: Summary[];
  totalBriefs: number;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number, title: string, transcript: string) => void;
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onViewAllBriefs: () => void;
  onGetBriefedNow?: () => void;
  onUpdateSchedule?: () => void;
  upcomingBrief?: Summary;
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
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");  
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

            {/* Available Briefs Section */}
            {briefs ? (
              <div className="space-y-2">
                {briefs.length > 0 && <h3 className="text-sm font-medium text-white-text/80 px-1">Available</h3>}
                <div className="space-y-2">
                  {briefs.map((brief, index) => (
                    <BriefCard
                      key={brief.id}
                      brief={brief}
                      onViewBrief={onViewBrief}
                      onViewTranscript={onViewTranscript}
                      onPlayBrief={onPlayBrief}
                      playingBrief={playingBrief}
                      handleClick={handleClick}
                      isLast={index === briefs?.length - 1}
                    />
                  ))}
                </div>
              </div>
            ) : [...Array(3)].map(() => <BriefCardSkeleton />)}
            
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