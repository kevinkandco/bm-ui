
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import BriefCard from "./BriefCard";
import { Summary } from "../types";
import ViewErrorMessage from "../ViewErrorMessage";
import BriefCardSkeleton from "./BriefCardSkeleton";

interface BriefsContainerProps {
  briefs: Summary[];
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (message: string, briefId: number) => void;
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
}

const BriefsContainer = ({ briefs, onViewBrief, onViewTranscript, onPlayBrief, playingBrief }: BriefsContainerProps) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const handleClick = (message: string) => {
    setOpen(true);
    setMessage(message);
  };
  
  const handleClose = () => {
    setOpen(false);
  }

  console.log(briefs);

  return (
    <>
    <Card 
      className="w-full rounded-xl shadow-none border-0" 
      style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {briefs ? briefs?.map((brief, index) => (
            <BriefCard
              key={brief.id}
              brief={brief}
              onViewBrief={onViewBrief}
              onViewTranscript={onViewTranscript}
              onPlayBrief={onPlayBrief}
              playingBrief={playingBrief}
              handleClick={handleClick}
              isLast={index === briefs.length - 1}
            />
          )) : [...Array(3)].map(() => <BriefCardSkeleton />)}
        </div>
      </CardContent>
    </Card>
    <ViewErrorMessage open={open} onClose={handleClose} message={message} />
    </>
  );
};

export default React.memo(BriefsContainer);
