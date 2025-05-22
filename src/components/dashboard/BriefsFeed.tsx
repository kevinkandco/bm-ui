
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import Http from "@/Http";
import { Summary } from "./types";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface BriefsFeedProps {
  briefs: Summary[] | null;
  onOpenBrief: (briefId: number, briefData: Summary) => void;
  onCatchMeUp: () => void;
  onFocusMode: () => void;
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
        {briefs?.map((brief) => (
          <div 
            key={brief.id}
            className="py-6 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-md px-3" 
            onClick={() => handleOpenBrief(brief.id, brief)}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-text-primary text-lg font-medium">{brief.title || 'Slack Channel Updates'}</h3>
              <span className="text-sm text-text-secondary">{brief.summaryTime || '2 days ago'}</span>
            </div>
            <p className="text-text-secondary mb-4 text-sm">{brief.description || 'Upcoming project milestones this week'}</p>
            <div className="flex flex-wrap gap-4 items-center">
              {brief?.emailCount > 0 && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.emailCount || '2'} emails</span>
                </div>
              )}
              
              {brief?.slackMessageCount > 0 && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.slackMessageCount || '4'} messages</span>
                </div>
              )}
              
              {brief?.meetingCount > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.meetingCount || '9'} meetings</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

BriefsFeed.displayName = 'BriefsFeed';
export default BriefsFeed;
