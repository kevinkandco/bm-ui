
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
    <div 
      className="w-full glass-card glass-caustic cursor-pointer group" 
      onClick={handleCardClick}
    >
      {/* Collapsed Header */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Play button with glass effect */}
            <button 
              onClick={e => {
                e.stopPropagation();
                onPlayBrief(brief.id);
              }} 
              className="w-10 h-10 rounded-full glass-thin glass-press flex items-center justify-center hover:glass-regular transition-all flex-shrink-0"
            >
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
                <Play className="h-5 w-5 text-primary-teal glass-icon" />
              )}
            </button>
            
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-glass-primary truncate">
                  {brief.name}
                </h3>
                
                {/* Feedback Controls with glass styling */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={e => handleFeedback('up', e)} 
                    disabled={feedbackState !== 'none'} 
                    className={`h-6 w-6 p-0 glass-ultra-thin transition-all ${feedbackState === 'up' ? 'status-glow-green text-green-400' : 'text-glass-secondary hover:text-green-400'}`}
                  >
                    <ThumbsUp className="h-3 w-3 glass-icon" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={e => handleFeedback('down', e)} 
                    disabled={feedbackState !== 'none'} 
                    className={`h-6 w-6 p-0 glass-ultra-thin transition-all ${feedbackState === 'down' ? 'bg-red-500/20 text-red-400' : 'text-glass-secondary hover:text-red-400'}`}
                  >
                    <ThumbsDown className="h-3 w-3 glass-icon" />
                  </Button>
                </div>

                {/* Feedback Badges with glass styling */}
                {feedbackState === 'up' && (
                  <Badge variant="secondary" className="glass-badge text-xs h-4 px-2 border-green-500/40">
                    👍
                  </Badge>
                )}
                {feedbackState === 'down' && !showCommentInput && (
                  <Badge variant="secondary" className="glass-badge text-xs h-4 px-2 border-red-500/40">
                    👎
                  </Badge>
                )}
              </div>
              
              <p className="text-xs text-glass-muted">
                Delivered at {brief.timeCreated.split(', ')[1].replace(':00 ', '').replace(':00', '')} (Summarizing: {brief.timeRange.replace(':00 ', '').replace(':00', '')})
              </p>
            </div>
          </div>
          
          {/* Right side with glass styling */}
          <div className="flex items-center gap-6 flex-shrink-0">
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 text-xs text-glass-muted">
                <span className="whitespace-nowrap">{brief.slackMessages.total} Slack</span>
                <span className="whitespace-nowrap">{brief.emails.total} Emails</span>
                <span className="whitespace-nowrap">{brief.actionItems} Actions</span>
              </div>
              
              <div className="glass-badge flex items-center gap-1 text-xs border-green-400/30">
                <Clock className="h-2.5 w-2.5 text-green-400 glass-icon" />
                <span className="text-green-400 font-medium">~{timeSaved.total}min saved</span>
              </div>
            </div>
            
            <div className="ml-2">
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-glass-muted glass-icon" />
              ) : (
                <ChevronDown className="h-4 w-4 text-glass-muted glass-icon" />
              )}
            </div>
          </div>
        </div>
        
        {/* Comment Input with glass styling */}
        {showCommentInput && (
          <div className="mt-3 animate-fade-in" onClick={e => e.stopPropagation()}>
            <Input 
              placeholder="What did we miss?" 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              onKeyPress={e => handleKeyPress(e, 'comment')} 
              onBlur={handleCommentSubmit} 
              className="glass-input h-7 text-xs" 
              autoFocus 
            />
          </div>
        )}
      </div>

      {/* Expanded Content with glass effects */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="glass-divider pt-3">
            {/* Time Saved with enhanced glass styling */}
            <div className="glass-badge flex items-center gap-2 text-sm mb-3 border-green-400/20">
              <Clock className="h-4 w-4 text-green-400 glass-icon" />
              <span>
                <span className="text-green-400 font-medium">Time saved:</span> ~{timeSaved.reading}min reading + {timeSaved.processing}min processing = <span className="text-green-400 font-medium">{timeSaved.total}min total</span>
              </span>
            </div>

            {/* Stats with glass styling */}
            <div className="grid grid-cols-1 gap-2 mb-3">
              <div className="flex items-center justify-between p-2 rounded-lg glass-ultra-thin">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-4 w-4 text-accent-green glass-icon flex-shrink-0" />
                  <p className="text-sm font-medium text-glass-primary">
                    {brief.slackMessages.total} Slack Messages
                  </p>
                </div>
                {brief.slackMessages.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="glass-badge text-xs h-4 px-2 border-primary-teal/40">
                    {brief.slackMessages.fromPriorityPeople} priority
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg glass-ultra-thin">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-blue-400 glass-icon flex-shrink-0" />
                  <p className="text-sm font-medium text-glass-primary">
                    {brief.emails.total} Emails
                  </p>
                </div>
                {brief.emails.fromPriorityPeople > 0 && (
                  <Badge variant="secondary" className="glass-badge text-xs h-4 px-2 border-primary-teal/40">
                    {brief.emails.fromPriorityPeople} priority
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg glass-ultra-thin">
                <div className="flex items-center gap-3">
                  <CheckSquare className="h-4 w-4 text-orange-400 glass-icon flex-shrink-0" />
                  <p className="text-sm font-medium text-glass-primary">
                    {brief.actionItems} Action Items
                  </p>
                </div>
              </div>
            </div>

            {/* Add Missing Content with glass styling */}
            {!showAddMissing ? (
              <div className="mb-3">
                <Button variant="ghost" size="sm" onClick={e => {
                  e.stopPropagation();
                  setShowAddMissing(true);
                }} className="text-glass-secondary hover:text-glass-primary text-xs h-7 px-2 glass-ultra-thin">
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
                  className="glass-input h-7 text-xs" 
                  autoFocus 
                />
              </div>
            )}

            {/* Action Buttons with glass styling */}
            <div className="flex justify-end gap-2 pt-1">
              {brief.hasTranscript && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 px-3 text-xs rounded-lg glass-thin border-rim-light hover:border-rim-light-hover" 
                  onClick={e => {
                    e.stopPropagation();
                    onViewTranscript(brief.id);
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1 glass-icon" />
                  Transcript
                </Button>
              )}
              <Button 
                size="sm" 
                className="h-7 px-4 text-xs rounded-lg glass-button-primary" 
                onClick={e => {
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
