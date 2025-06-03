
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Summary } from "../types";

interface LatestBriefSectionProps {
  onClick: (briefId: number) => void;
  brief: Summary,
  handleMessageClick: (message: string) => void
}

const LatestBriefSection = ({ onClick, brief, handleMessageClick }: LatestBriefSectionProps) => {
  return (
    <div className="p-6 hover:bg-surface-raised/30 transition-colors cursor-pointer" onClick={brief?.status === "success" ? () => onClick(brief?.id) : null}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-text-primary text-lg font-medium">{brief?.title}</h2>
        {brief?.status === "success" && <span className="text-sm text-text-secondary">{brief?.summaryTime}</span>}
        {(brief?.status !== "failed" && brief?.status !== "success")  && (
          <span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-yellow-500 text-yellow-500">
            Generating summary
          </span>
        )}
        {brief?.status === "failed" && (
          <span onClick={() => handleMessageClick(brief?.error)} className="text-sm text-text-secondary border px-2 py-1 rounded-md border-red-500 text-red-500">
            Failed to generate the summary
          </span>
        )}
      </div>
      <p className="text-text-secondary mb-4 text-sm">{brief?.description}</p>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 flex-1">
          <Mail className="h-5 w-5 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{brief?.emailCount ? `${brief?.emailCount} emails` : "0 email"} reviewed</span>
        </div>
        
        <div className="flex items-center gap-2 flex-1">
          <MessageSquare className="h-5 w-5 text-accent-primary" />
          <span className="text-sm font-medium text-text-primary">{brief?.slackMessageCount  ? `${brief?.slackMessageCount} Slack messages` : "0 Slack message"}</span>
        </div>
        
        <Button variant="outline" size="sm" className="ml-auto border-border-subtle text-text-primary hover:bg-surface-raised/30 hover:text-accent-primary">
          View Full Brief
        </Button>
      </div>
    </div>
  );
};

export default React.memo(LatestBriefSection);
