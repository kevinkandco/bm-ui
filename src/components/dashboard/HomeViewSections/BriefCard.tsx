
import React, { useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, ChevronDown, ChevronUp, Play } from "lucide-react";
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
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  isLast?: boolean;
}

const BriefCard = ({ brief, onViewBrief, onViewTranscript, onPlayBrief, playingBrief, isLast }: BriefCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

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
                {brief.name}
              </h3>
              <p className="text-xs text-light-gray-text truncate">
                {brief.timeCreated}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-4 text-xs text-light-gray-text">
              <span className="whitespace-nowrap">{brief.slackMessages.total} Slack</span>
              <span className="whitespace-nowrap">{brief.emails.total} Emails</span>
              <span className="whitespace-nowrap">{brief.actionItems} Actions</span>
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
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="border-t border-white/20 pt-4">
            <div className="mb-4">
              <div className="text-xs text-light-gray-text mb-3">
                <span>Range: {brief.timeRange}</span>
              </div>

              {/* Detailed Stats Grid */}
              <div className="grid grid-cols-1 gap-4 mb-4">
                {/* Slack Messages */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/30">
                  <MessageSquare className="h-5 w-5 text-accent-green flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-text">
                      {brief.slackMessages.total} Slack Messages
                    </p>
                    {brief.slackMessages.fromPriorityPeople > 0 && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs h-5 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                          {brief.slackMessages.fromPriorityPeople} from priority people
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Emails */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/30">
                  <Mail className="h-5 w-5 text-blue-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-text">
                      {brief.emails.total} Emails
                    </p>
                    {brief.emails.fromPriorityPeople > 0 && (
                      <div className="mt-1">
                        <Badge variant="secondary" className="text-xs h-5 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                          {brief.emails.fromPriorityPeople} from priority people
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Items */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-raised/30">
                  <CheckSquare className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white-text">
                      {brief.actionItems} Action Items
                    </p>
                    <p className="text-xs text-light-gray-text">Auto-detected</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {brief.hasTranscript && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent"
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
                  className="h-8 px-4 text-xs rounded-lg bg-primary-teal hover:bg-accent-green"
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
        </div>
      )}
    </div>
  );
};

export default React.memo(BriefCard);
