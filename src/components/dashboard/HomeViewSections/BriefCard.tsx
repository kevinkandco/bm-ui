import React, { useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, ChevronDown, ChevronUp, Play, ThumbsUp, ThumbsDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useFeedbackTracking } from "../useFeedbackTracking";

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

const BriefCard = ({
  brief,
  onViewBrief,
  onViewTranscript,
  onPlayBrief,
  playingBrief,
  isLast
}: BriefCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'none' | 'up' | 'down'>('none');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAddMissing, setShowAddMissing] = useState(false);
  const [comment, setComment] = useState("");
  const [missingContent, setMissingContent] = useState("");
  const {
    handleSummaryFeedback,
    handleAddMissingContent
  } = useFeedbackTracking();

  // Sample time saved data - in a real app this would come from the brief data
  const timeSaved = {
    reading: 25,
    processing: 8,
    total: 33
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFeedback = async (type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (feedbackState === type) return; // Already rated

    setFeedbackState(type);
    if (type === 'up') {
      await handleSummaryFeedback(brief.id.toString(), 'up');
    } else {
      setShowCommentInput(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await handleSummaryFeedback(brief.id.toString(), 'down', comment.trim());
      setComment("");
    } else {
      await handleSummaryFeedback(brief.id.toString(), 'down');
    }
    setShowCommentInput(false);
  };

  const handleAddMissingSubmit = async () => {
    if (missingContent.trim()) {
      await handleAddMissingContent(brief.id.toString(), missingContent.trim());
      setMissingContent("");
    }
    setShowAddMissing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'comment' | 'missing') => {
    if (e.key === 'Enter') {
      if (type === 'comment') {
        handleCommentSubmit();
      } else {
        handleAddMissingSubmit();
      }
    }
  };

  return (
    <div className="w-full transition-all duration-300 cursor-pointer rounded-xl overflow-hidden hover:scale-[1.02] group" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)'
    }} onClick={handleCardClick}>
      {/* Collapsed Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Play button moved to the left, doc icon removed */}
            <button onClick={e => {
              e.stopPropagation();
              onPlayBrief(brief.id);
            }} className="w-10 h-10 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors flex-shrink-0">
              {playingBrief === brief.id ? (
                <div className="flex items-center gap-0.5">
                  <div className="w-0.5 h-3 bg-primary-teal rounded-full animate-pulse" style={{
                    animationDelay: '0ms'
                  }} />
                  <div className="w-0.5 h-4 bg-primary-teal rounded-full animate-pulse" style={{
                    animationDelay: '150ms'
                  }} />
                  <div className="w-0.5 h-3 bg-primary-teal rounded-full animate-pulse" style={{
                    animationDelay: '300ms'
                  }} />
                  <div className="w-0.5 h-2 bg-primary-teal rounded-full animate-pulse" style={{
                    animationDelay: '450ms'
                  }} />
                </div>
              ) : (
                <Play className="h-5 w-5 text-primary-teal" />
              )}
            </button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white-text truncate">
                  {brief.name}
                </h3>
                
                {/* Feedback Controls - Show on hover, next to brief name */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={e => handleFeedback('up', e)} disabled={feedbackState !== 'none'} className={`h-6 w-6 p-0 transition-all ${feedbackState === 'up' ? 'bg-green-500/20 text-green-400' : 'text-text-secondary hover:text-green-400'}`}>
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={e => handleFeedback('down', e)} disabled={feedbackState !== 'none'} className={`h-6 w-6 p-0 transition-all ${feedbackState === 'down' ? 'bg-red-500/20 text-red-400' : 'text-text-secondary hover:text-red-400'}`}>
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>

                {/* Feedback Badge - Always visible when rated */}
                {feedbackState === 'up' && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-green-500/20 text-green-400 border-green-500/40">
                    👍
                  </Badge>
                )}
                {feedbackState === 'down' && !showCommentInput && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-red-500/20 text-red-400 border-red-500/40">
                    👎
                  </Badge>
                )}
              </div>
              
              {/* Updated timestamp and range format */}
              <p className="text-xs text-light-gray-text">
                Delivered at {brief.timeCreated.split(', ')[1].replace(':00 ', '')} (Summarizing: {brief.timeRange.replace(':00 ', '').replace(':00', '')})
              </p>
            </div>
          </div>
          
          {/* Stacked right side items with center alignment */}
          <div className="flex items-center gap-6 flex-shrink-0">
            {/* Stacked stats and time saved */}
            <div className="flex flex-col items-end gap-1">
              {/* Stats group */}
              <div className="flex items-center gap-4 text-xs text-light-gray-text">
                <span className="whitespace-nowrap">{brief.slackMessages.total} Slack</span>
                <span className="whitespace-nowrap">{brief.emails.total} Emails</span>
                <span className="whitespace-nowrap">{brief.actionItems} Actions</span>
              </div>
              
              {/* Time Saved */}
              <div className="flex items-center gap-1 text-xs text-light-gray-text bg-green-400/10 rounded py-px px-podia-padding">
                <Clock className="h-2.5 w-2.5 text-green-400" />
                <span className="text-green-400 font-medium">~{timeSaved.total}min saved</span>
              </div>
            </div>
            
            {/* Chevron */}
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-light-gray-text" />
              ) : (
                <ChevronDown className="h-4 w-4 text-light-gray-text" />
              )}
            </div>
          </div>
        </div>
        
        {/* Comment Input for downvote */}
        {showCommentInput && (
          <div className="mt-3 animate-fade-in" onClick={e => e.stopPropagation()}>
            <Input 
              placeholder="What did we miss?" 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              onKeyPress={e => handleKeyPress(e, 'comment')} 
              onBlur={handleCommentSubmit} 
              className="bg-white/5 border-white/20 text-text-primary h-7 text-xs" 
              autoFocus 
            />
          </div>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="border-t border-white/20 pt-3">
            {/* Time Saved Breakdown - Expanded State */}
            <div className="flex items-center gap-2 text-sm text-text-secondary bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20 mb-3">
              <Clock className="h-4 w-4 text-green-400" />
              <span>
                <span className="text-green-400 font-medium">Time saved:</span> ~{timeSaved.reading}min reading + {timeSaved.processing}min processing = <span className="text-green-400 font-medium">{timeSaved.total}min total</span>
              </span>
            </div>

            {/* Condensed Stats Grid */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              {/* Slack Messages */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-accent-green flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.slackMessages.total} Slack Messages
                  </p>
                </div>
                {brief.slackMessages.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                    {brief.slackMessages.fromPriorityPeople} priority
                  </Badge>
                )}
              </div>

              {/* Emails */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.emails.total} Emails
                  </p>
                </div>
                {brief.emails.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="text-xs h-4 px-2 bg-primary-teal/20 text-primary-teal border-primary-teal/40">
                    {brief.emails.fromPriorityPeople} priority
                  </Badge>
                )}
              </div>

              {/* Action Items */}
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-raised/30">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-4 w-4 text-orange-400 flex-shrink-0" />
                  <p className="text-sm font-medium text-white-text">
                    {brief.actionItems} Action Items
                  </p>
                </div>
              </div>
            </div>

            {/* Add Missing Content */}
            {!showAddMissing ? (
              <div className="mb-3">
                <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  setShowAddMissing(true);
                }} className="text-text-secondary hover:text-text-primary text-xs h-7 px-2">
                  Add what's missing
                </Button>
              </div>
            ) : (
              <div className="mb-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                <Input 
                  placeholder="What important information did we miss?" 
                  value={missingContent} 
                  onChange={e => setMissingContent(e.target.value)} 
                  onKeyPress={e => handleKeyPress(e, 'missing')} 
                  onBlur={handleAddMissingSubmit} 
                  className="bg-white/5 border-white/20 text-text-primary h-7 text-xs" 
                  autoFocus 
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-1">
              {brief.hasTranscript && (
                <Button variant="outline" size="sm" className="h-7 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent" onClick={e => {
                  e.stopPropagation();
                  onViewTranscript(brief.id);
                }}>
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Transcript
                </Button>
              )}
              <Button size="sm" className="h-7 px-4 text-xs rounded-lg bg-primary-teal hover:bg-accent-green" onClick={e => {
                e.stopPropagation();
                onViewBrief(brief.id);
              }}>
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
