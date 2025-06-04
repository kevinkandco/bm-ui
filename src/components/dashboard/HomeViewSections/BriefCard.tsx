
import React, { useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Summary } from "../types";

interface BriefCardProps {
  brief: Summary;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (message: string, briefId: number) => void;
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  isLast?: boolean;
}

const BriefCard = ({ brief, onViewBrief, onViewTranscript, onPlayBrief, playingBrief, isLast }: BriefCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const timeRange = brief?.start_at && brief?.ended_at ? `Range: ${brief?.start_at} - ${brief?.ended_at}` : "";

  return (
    <div 
      className="w-full transition-all duration-300 cursor-pointer rounded-xl overflow-hidden hover:scale-[1.02]"
      style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)',
      }}
      onClick={handleCardClick}
    >
      {/* Collapsed Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-surface-raised/50 flex items-center justify-center flex-shrink-0">
              <FileText className="h-5 w-5 text-primary-teal" />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayBrief(brief.id);
              }}
              className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors flex-shrink-0"
            >
              {playingBrief === brief.id ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-0.5 h-3 bg-primary-teal rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-0.5 h-4 bg-primary-teal rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-0.5 h-3 bg-primary-teal rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  <div className="w-0.5 h-2 bg-primary-teal rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                </div>
              ) : (
                <Play className="h-3 w-3 text-primary-teal" />
              )}
            </button>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-white-text truncate">
                {brief?.title}
              </h3>
              <p className="text-xs text-light-gray-text truncate">
                {brief?.summaryTime}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-4 text-xs text-light-gray-text">
              <span className="whitespace-nowrap">{brief?.slackMessageCount} Slack</span>
              <span className="whitespace-nowrap">{brief?.emailCount} Emails</span>
              <span className="whitespace-nowrap">{brief?.actionCount} Actions</span>
            </div>
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-light-gray-text" />
              ) : (
                <ChevronDown className="h-4 w-4 text-light-gray-text" />
              )}
            </div>
          </div>
        </div>
        
        {/* Time Range - Now above the line */}
        <div className="text-xs text-light-gray-text mt-2">
          {timeRange}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-white/20 pt-3">
            {/* Condensed Stats Grid */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              {/* Slack Messages */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-accent-green flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.slackMessageCount} Slack Messages
                  </p>
                </div>
                {/* {brief.slackMessages.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                    {brief.slackMessages.fromPriorityPeople} priority
                  </Badge>
                )} */}
              </div>

              {/* Emails */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.emailCount} Emails
                  </p>
                </div>
                {/* {brief.emails.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                    {brief.emails.fromPriorityPeople} priority
                  </Badge>
                )} */}
              </div>

              {/* Action Items */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.actionCount} Action Items
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - Moved to right side */}
            <div className="flex justify-end gap-2 pt-1">
              {brief.summary && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewTranscript(brief.summary, brief.id);
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Transcript
                </Button>
              )}
              <Button
                size="sm"
                className="h-7 px-4 text-xs rounded-lg bg-primary-teal hover:bg-accent-green"
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
      )}
    </div>
  );
};

export default React.memo(BriefCard);
