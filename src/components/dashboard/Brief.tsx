import { Skeleton } from "@/components/ui/skeleton";
import { Summary } from "@/components/dashboard/types";
import { MessageSquare, Mail, Calendar } from "lucide-react";

interface BriefProps {
  brief: Summary;
  isPending?: boolean;
  handleOpenBrief?: (briefId: number, briefData: Summary) => void;
}

const Brief = ({ brief, handleOpenBrief, isPending=false }: BriefProps) => {
  const success = !!handleOpenBrief;
  return (
    <div
      key={brief?.id}
      className="py-6 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-md px-3"
      onClick={() => (success ? handleOpenBrief(brief?.id, brief) : null)}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
        <h3 className="text-text-primary text-lg font-medium">
          {brief?.title || "Slack Channel Updates"}
        </h3>
        {!brief?.read_at && (
          <span className="ml-2 h-2 w-2 bg-accent-primary rounded-full"></span>
        )}
        </div>
        {isPending ? (
          <span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-yellow-500 text-yellow-500">
            Generating summary
          </span>
        ) : success ? (
          <span className="text-sm text-text-secondary">
            {brief?.summaryTime || "Today at 10:00 AM"}
          </span>
        ) : (
          <span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-red-500 text-red-500">
            Failed to generate the summary
          </span>
        )}
      </div>
      <p className="text-text-secondary mb-4 text-sm">
        {brief?.description || "Upcoming project milestones this week"}
      </p>
      {isPending ? (
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
      ) : (
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
      )}
    </div>
  );
};

export default Brief;