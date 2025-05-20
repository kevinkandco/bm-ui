
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import Http from "@/Http";
import { Summary } from "./types";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface BriefsFeedProps {
  onOpenBrief: (briefId: number, briefData: Summary) => void;
  onCatchMeUp: () => void;
  onFocusMode: () => void;
}

const BaseURL = import.meta.env.VITE_API_HOST;

const BriefsFeed = React.memo(({ onOpenBrief }: BriefsFeedProps) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [briefs, setBriefs] = useState<Summary[] | null>(null);

    const getBriefs = useCallback(async (): Promise<void> => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }
        Http.setBearerToken(token);
        const response = await Http.callApi("get",`${BaseURL}/api/summaries`);
        if (response) {
          setBriefs(response?.data?.summaries?.data);
        } else {
          console.error("Failed to fetch summaries data");
        }
      } catch (error) {
        console.error("Error fetching summaries data:", error);
      }
    }, [navigate]);

    useEffect(() => {
      const tokenFromUrl = searchParams.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          url.searchParams.delete("provider");
          window.history.replaceState({}, document.title, url.pathname + url.search);
      }

      getBriefs();
    }, [getBriefs, searchParams]);

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
              <span className="text-sm text-text-secondary">{brief.timestamp || '2 days ago'}</span>
            </div>
            <p className="text-text-secondary mb-4 text-sm">{brief.description || 'Upcoming project milestones this week'}</p>
            <div className="flex flex-wrap gap-4 items-center">
              {brief?.stats?.emails > 0 && (
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.emails || '2'} emails</span>
                </div>
              )}
              
              {brief?.stats?.messages > 0 && (
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.messages || '4'} messages</span>
                </div>
              )}
              
              {brief?.stats?.meetings > 0 && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-accent-primary" />
                  <span className="text-sm font-medium text-text-primary">{brief?.stats?.meetings || '9'} meetings</span>
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
