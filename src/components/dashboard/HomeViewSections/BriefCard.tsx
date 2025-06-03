
import React from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink } from "lucide-react";
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
  isLast?: boolean;
}

const BriefCard = ({ brief, onViewBrief, onViewTranscript, isLast }: BriefCardProps) => {
  return (
    <div className="px-4">
      <div 
        className={`w-full transition-all cursor-pointer overflow-hidden ${!isLast ? 'border-b border-white/30 pb-4 mb-4' : ''}`}
        style={{
          background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.2) 0%, rgba(43, 49, 54, 0.2) 100%)',
        }}
        onClick={() => onViewBrief(brief.id)}
      >
        {/* Header Section - Very subtle */}
        <div className="bg-surface-raised/5 px-4 py-3 border-b border-border-subtle/10 rounded-t-xl">
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
        <div className="p-4 bg-surface-overlay/3">
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
                <p className="text-sm font-medium text-white-text whitespace-nowrap overflow-hidden text-ellipsis">
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
                <p className="text-sm font-medium text-white-text whitespace-nowrap overflow-hidden text-ellipsis">
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
                <p className="text-sm font-medium text-white-text whitespace-nowrap overflow-hidden text-ellipsis">
                  {brief.actionItems} Actions
                </p>
                <p className="text-xs text-light-gray-text whitespace-nowrap overflow-hidden text-ellipsis">Auto-detected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BriefCard);
