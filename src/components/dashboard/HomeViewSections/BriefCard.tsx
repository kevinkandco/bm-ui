
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
    <Card className="w-full hover:shadow-md transition-all cursor-pointer" onClick={() => onViewBrief(brief.id)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-teal" />
              {brief.name}
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              Created: {brief.timeCreated}
            </p>
            <p className="text-sm text-text-secondary">
              Time Range: {brief.timeRange}
            </p>
          </div>
          <div className="flex gap-2">
            {brief.hasTranscript && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewTranscript(brief.id);
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Transcript
              </Button>
            )}
            <Button
              size="sm"
              className="rounded-xl bg-primary-teal hover:bg-accent-green"
              onClick={(e) => {
                e.stopPropagation();
                onViewBrief(brief.id);
              }}
            >
              View Brief
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Slack Messages */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay/30">
            <MessageSquare className="h-5 w-5 text-accent-green" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {brief.slackMessages.total} Slack Messages
              </p>
              {brief.slackMessages.fromPriorityPeople > 0 && (
                <Badge variant="secondary" className="text-xs bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                  {brief.slackMessages.fromPriorityPeople} from priority people
                </Badge>
              )}
            </div>
          </div>

          {/* Emails */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay/30">
            <Mail className="h-5 w-5 text-blue-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {brief.emails.total} Emails
              </p>
              {brief.emails.fromPriorityPeople > 0 && (
                <Badge variant="secondary" className="text-xs bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                  {brief.emails.fromPriorityPeople} from priority people
                </Badge>
              )}
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-overlay/30">
            <CheckSquare className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                {brief.actionItems} Action Items
              </p>
              <p className="text-xs text-text-secondary">Detected automatically</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(BriefCard);
