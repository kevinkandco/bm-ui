
import React from "react";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import { Summary } from "./types";
import Brief from "@/components/dashboard/Brief";

interface BriefsFeedProps {
  briefs: Summary[] | null;
  onOpenBrief: (briefId: number, briefData: Summary) => void;
}

const BaseURL = import.meta.env.VITE_API_HOST;

const BriefsFeed = React.memo(({ briefs, onOpenBrief }: BriefsFeedProps) => {

  const handleOpenBrief = (briefId: number, briefData: Summary) => {
    onOpenBrief(briefId, briefData);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-text-primary">Your Brief Feed</h2>
      </div>
      <p className="text-text-secondary mt-1 mb-4">Stay updated with your latest briefs</p>

      
      <div className="divide-y divide-border-subtle">
        {briefs?.map((brief) => {
          if (brief.status === "success") return <Brief key={brief.id}  brief={brief} handleOpenBrief={handleOpenBrief} />
          if (brief.status === "failed") return <Brief key={brief.id}  brief={brief} />
          return <Brief key={brief.id} brief={brief} isPending={true} />
        })}
      </div>
    </div>
  );
});

BriefsFeed.displayName = 'BriefsFeed';
export default BriefsFeed;