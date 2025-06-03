
import React from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BriefCardProps {
  brief: {
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
  };
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
}

const BriefCard = ({ brief, onViewBrief, onViewTranscript }: BriefCardProps) => {
  return (
    <Card className="w-full hover:shadow-md transition-all cursor-pointer overflow-hidden bg-transparent border-border-subtle/10" onClick={() => onViewBrief(brief.id)}>
      {/* Header Section - Very subtle */}
      <div className="bg-surface-raised/10 px-4 py-3 border-b border-border-subtle/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-teal" />
            <h3 className="text-base font-semibold text-white-text">
              {brief.name}
            </h3>
          </div>
          <div className="flex gap-2">
            {brief.hasTranscript && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTranscript(brief.id);
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Transcript
              </Button>
            )}
            <Button
              size="sm"
              className="h-7 px-3 text-xs rounded-lg bg-primary-teal hover:bg-accent-green"
              onClick={(e) => {
                e.stopPropagation();
                onViewBrief(brief.id);
              }}
            >
              View Brief
            </Button>
          </div>
        </div>
      </div>

      {/* Body Section - Almost transparent */}
      <CardContent className="p-4 bg-surface-overlay/5">
        {/* Time Info */}
        <div className="flex items-center gap-4 mb-3 text-xs text-light-gray-text">
          <span>Created: {brief.timeCreated}</span>
          <span>•</span>
          <span>Range: {brief.timeRange}</span>
        </div>

        {/* Stats Grid - Compact with no wrapping */}
        <div className="grid grid-cols-3 gap-4">
          {/* Slack Messages */}
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquare className="h-4 w-4 text-accent-green flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white-text whitespace-nowrap">
                {brief.slackMessages.total} Slack
              </p>
              {brief.slackMessages.fromPriorityPeople > 0 && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5 bg-primary-teal/20 text-primary-teal border-primary-teal/40 rounded-md whitespace-nowrap">
                  {brief.slackMessages.fromPriorityPeople} priority
                </Badge>
              )}
            </div>
          </div>

          {/* Emails */}
          <div className="flex items-center gap-2 min-w-0">
            <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white-text whitespace-nowrap">
                {brief.emails.total} Emails
              </p>
              {brief.emails.fromPriorityPeople > 0 && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5 bg-primary-teal/20 text-primary-teal border-primary-teal/40 rounded-md whitespace-nowrap">
                  {brief.emails.fromPriorityPeople} priority
                </Badge>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-2 min-w-0">
            <CheckSquare className="h-4 w-4 text-orange-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white-text whitespace-nowrap">
                {brief.actionItems} Actions
              </p>
              <p className="text-xs text-light-gray-text whitespace-nowrap">Auto-detected</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(BriefCard);
