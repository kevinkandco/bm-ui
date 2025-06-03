
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import BriefCard from "./BriefCard";

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
}

const BriefsContainer = ({ briefs, onViewBrief, onViewTranscript }: BriefsContainerProps) => {
  return (
    <Card 
      className="w-full border border-border-subtle/20 rounded-xl shadow-none" 
      style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}
    >
      <CardContent className="p-4">
        {briefs.map((brief, index) => (
          <BriefCard
            key={brief.id}
            brief={brief}
            onViewBrief={onViewBrief}
            onViewTranscript={onViewTranscript}
            isLast={index === briefs.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default React.memo(BriefsContainer);
