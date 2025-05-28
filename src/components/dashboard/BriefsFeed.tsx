
import React from "react";
import { MessageSquare, Mail, Calendar } from "lucide-react";
import { Summary } from "./types";
import { Skeleton } from "../ui/skeleton";

interface BriefsFeedProps {
  briefs: Summary[] | null;
  setIsPending: (loading: boolean) => void;
  onOpenBrief: (briefId: number, briefData: Summary) => void;
}

const BaseURL = import.meta.env.VITE_API_HOST;

const BriefsFeed = React.memo(({ briefs, onOpenBrief, setIsPending }: BriefsFeedProps) => {

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
          if (brief.status === "pending") {
            setIsPending(true)
            return <BriefSkeleton key={brief.id} />
          }
          if(brief.status === "failed") return <Brief  key={brief.id}  brief={brief} />
          return <Brief  key={brief.id}  brief={brief} handleOpenBrief={handleOpenBrief} />
        })}
      </div>
    </div>
  );
});

BriefsFeed.displayName = 'BriefsFeed';
export default BriefsFeed;

interface BriefProps {
  brief: Summary;
  disableClick?: boolean;
  handleOpenBrief?: (briefId: number, briefData: Summary) => void;
}

const Brief = ({ brief, handleOpenBrief, disableClick = false }: BriefProps) => {
  return (
    <div
      key={brief?.id}
      className="py-6 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-md px-3"
      onClick={() => disableClick && handleOpenBrief ? handleOpenBrief(brief?.id, brief) : null}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-text-primary text-lg font-medium">
          {brief?.title || "Slack Channel Updates"}
        </h3>
        <span className="text-sm text-text-secondary">
          {brief?.summaryTime || "2 days ago"}
        </span>
      </div>
      <p className="text-text-secondary mb-4 text-sm">
        {brief?.description || "Upcoming project milestones this week"}
      </p>
      <div className="flex flex-wrap gap-4 items-center">
        {brief?.emailCount > 0 && (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-accent-primary" />
            <span className="text-sm font-medium text-text-primary">
              {brief?.emailCount || "2"} emails
            </span>
          </div>
        )}

        {brief?.slackMessageCount > 0 && (
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-accent-primary" />
            <span className="text-sm font-medium text-text-primary">
              {brief?.slackMessageCount || "4"} messages
            </span>
          </div>
        )}

        {brief?.meetingCount > 0 && (
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent-primary" />
            <span className="text-sm font-medium text-text-primary">
              {brief?.meetingCount || "9"} meetings
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const BriefSkeleton = () => {
  return (
    <div className="py-6 px-3 rounded-md">
      {/* Title and Timestamp */}
      <div className="flex justify-between items-center mb-2">
        <Skeleton className=" !scale-100 h-5 w-1/2" />
        <Skeleton className=" !scale-100 h-4 w-20" />
      </div>

      {/* Description */}
      <Skeleton className=" !scale-100 h-4 w-full mb-2" />
      <Skeleton className=" !scale-100 h-4 w-3/4 mb-4" />

      {/* Icons and Count placeholders */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Skeleton className=" !scale-100 h-5 w-5 rounded-full" />
          <Skeleton className=" !scale-100 h-4 w-16" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className=" !scale-100 h-5 w-5 rounded-full" />
          <Skeleton className=" !scale-100 h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className=" !scale-100 h-5 w-5 rounded-full" />
          <Skeleton className=" !scale-100 h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
