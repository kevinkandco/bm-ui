import React, { useEffect, useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, ChevronDown, ChevronUp, Play, ThumbsUp, ThumbsDown, Clock, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Summary } from "../types";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFeedbackTracking } from "../useFeedbackTracking";

interface BriefCardProps {
  brief: Summary;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number, title: string, transcript: string) => void;
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
	handleClick: (message: string, e: React.MouseEvent) => void
  isLast?: boolean;
}

const BriefCard = ({ brief, onViewBrief, onViewTranscript, onPlayBrief, playingBrief, handleClick, isLast }: BriefCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'none' | 'up' | 'down'>('none');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAddMissing, setShowAddMissing] = useState(false);
  const [comment, setComment] = useState("");
  const [missingContent, setMissingContent] = useState("");
  
  // Audio player state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes mock duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
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

  // Mock priority breakdown based on total messages
  const totalMessages = 10 + 20;
  const mockStats = {
    totalMessagesAnalyzed: {
      total: totalMessages,
      breakdown: { slack: 10, gmail: 20 }
    },
    lowPriority: {
      total: Math.floor(totalMessages * 0.4),
      breakdown: { slack: Math.floor(10 * 0.4), gmail: Math.floor(20 * 0.4) }
    },
    mediumPriority: {
      total: Math.floor(totalMessages * 0.35),
      breakdown: { slack: Math.floor(10 * 0.35), gmail: Math.floor(20 * 0.35) }
    },
    highPriority: {
      total: Math.floor(totalMessages * 0.25),
      breakdown: { slack: Math.floor(10 * 0.25), gmail: Math.floor(20 * 0.25) }
    },
    actionItems: {
      total: 20,
      breakdown: { slack: Math.floor(20 * 0.5), gmail: Math.ceil(20 * 0.5) }
    }
  };

  const statsConfig = [
    {
      icon: BarChart3,
      label: "Total Messages Analyzed",
      value: mockStats.totalMessagesAnalyzed.total,
      breakdown: mockStats.totalMessagesAnalyzed.breakdown,
      color: "text-blue-400"
    },
    {
      icon: CheckCircle,
      label: "Low Priority",
      value: mockStats.lowPriority.total,
      breakdown: mockStats.lowPriority.breakdown,
      color: "text-gray-400"
    },
    {
      icon: AlertCircle,
      label: "Medium Priority",
      value: mockStats.mediumPriority.total,
      breakdown: mockStats.mediumPriority.breakdown,
      color: "text-orange-400"
    },
    {
      icon: AlertCircle,
      label: "High Priority",
      value: mockStats.highPriority.total,
      breakdown: mockStats.highPriority.breakdown,
      color: "text-red-400"
    },
    {
      icon: CheckSquare,
      label: "Action Items",
      value: mockStats.actionItems.total,
      breakdown: mockStats.actionItems.breakdown,
      color: "text-accent-primary"
    }
  ];

  const playbackSpeeds = [1, 1.1, 1.2, 1.5, 2, 3];

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const timeRange = brief?.start_at && brief?.ended_at ? `${brief?.start_at} - ${brief?.ended_at}` : "";
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true); // Open the dropdown
    onPlayBrief(brief.id);
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleAudioToggle = () => {
    setIsAudioPlaying(!isAudioPlaying);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleTimeChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFeedback = async (type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    if (feedbackState === type) return; // Already rated

    setFeedbackState(type);
    if (type === 'up') {
      await handleSummaryFeedback(brief?.id, 'up');
    } else {
      setShowCommentInput(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await handleSummaryFeedback(brief?.id, 'down', comment.trim());
      setComment("");
    } else {
      await handleSummaryFeedback(brief?.id, 'down');
    }
    setShowCommentInput(false);
  };

  const handleAddMissingSubmit = async () => {
    if (missingContent.trim()) {
      await handleAddMissingContent(brief?.id, missingContent.trim());
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
    <TooltipProvider>
      <div className="w-full transition-all duration-300 cursor-pointer rounded-xl overflow-hidden hover:scale-[1.02] group" style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)'
      }} onClick={handleCardClick}>
        {/* Collapsed Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Play button moved to the left, doc icon removed */}
              <button onClick={handlePlayClick} className="w-10 h-10 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors flex-shrink-0">
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
                    {brief.title}
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
                  Delivered at {brief?.delivery_at} (Summarizing: {timeRange})
                </p>
              </div>
            </div>
            
            {/* Right side items with new layout */}
            <div className="flex items-center gap-6 flex-shrink-0">
              {/* Stats and time saved section */}
              <div className="flex flex-col items-end gap-2">
                {/* Horizontally aligned stats */}
                <div className="flex items-center gap-3 text-xs text-light-gray-text">
                  <span className="whitespace-nowrap">{brief.slackMessageCount} Slack</span>
                  <span className="whitespace-nowrap">{brief.emailCount} Emails</span>
                  <span className="whitespace-nowrap">{brief.actionCount} Actions</span>
                </div>
                
                {/* Time Saved below the stats */}
                <div className="flex items-center gap-1 text-xs text-light-gray-text bg-green-400/10 rounded py-px px-2">
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
          
          <div className="flex items-center justify-between mt-3">
					<div className="text-xs text-light-gray-text mt-2">
						{brief?.description}
					</div>
					<div>
						{(brief?.status !== "failed" && brief?.status !== "success")  && (
							<span className="text-sm text-text-secondary border px-2 py-1 rounded-md border-yellow-500 text-yellow-500">
								Generating summary
							</span>
						)}
						{brief?.status === "failed" && (
							<span onClick={(e) => handleClick(brief?.error, e)} className="text-sm text-text-secondary border px-2 py-1 rounded-md border-red-500 text-red-500">
								Failed to generate the summary
							</span>
						)}
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
              {/* Audio Player Section - Only show when playing */}
              {playingBrief === brief.id && (
                <div className="mb-4 p-4 rounded-lg bg-surface-raised/20 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleAudioToggle}
                        className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
                      >
                        {isAudioPlaying ? (
                          <Pause className="h-4 w-4 text-primary-teal" />
                        ) : (
                          <Play className="h-4 w-4 text-primary-teal" />
                        )}
                      </button>
                      
                      <div className="text-sm">
                        <div className="text-white-text font-medium">Playing: {brief.title}</div>
                        <div className="text-light-gray-text text-xs">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="px-2 py-1 text-xs rounded bg-white/10 text-white-text hover:bg-white/20 transition-colors">
                            {playbackSpeed}x
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface-raised border border-white/20">
                          {playbackSpeeds.map((speed) => (
                            <DropdownMenuItem
                              key={speed}
                              onClick={() => handleSpeedChange(speed)}
                              className="text-white-text hover:bg-white/10 cursor-pointer"
                            >
                              {speed}x
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <button 
                        onClick={handleMuteToggle}
                        className="w-6 h-6 flex items-center justify-center text-light-gray-text hover:text-white-text transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={handleTimeChange}
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Time Saved Breakdown - Expanded State */}
              <div className="flex items-center gap-2 text-sm text-text-secondary bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20 mb-3">
                <Clock className="h-4 w-4 text-green-400" />
                <span>
                  <span className="text-green-400 font-medium">Time saved:</span> ~{timeSaved.reading}min reading + {timeSaved.processing}min processing = <span className="text-green-400 font-medium">{timeSaved.total}min total</span>
                </span>
              </div>

              {/* New Stats Grid with Tooltips */}
              <div className="grid grid-cols-5 gap-2 mb-3">
                {statsConfig.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center p-2 rounded-lg bg-surface-raised/30 cursor-pointer hover:bg-surface-raised/50 transition-colors">
                          <IconComponent className={`h-4 w-4 ${stat.color} mb-1`} />
                          <div className="text-lg font-semibold text-text-primary">
                            {stat.value}
                          </div>
                          <div className="text-xs text-text-secondary text-center leading-tight">
                            {stat.label}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-surface-raised border border-white/20">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-text-primary">{stat.label}</div>
                          <div className="space-y-1">
                            {Object.entries(stat.breakdown).map(([platform, count]) => (
                              <div key={platform} className="flex justify-between text-xs">
                                <span className="text-text-secondary capitalize">{platform}:</span>
                                <span className="text-text-primary font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
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
                {brief.summary && (
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent" onClick={e => {
                    e.stopPropagation();
                    onViewTranscript(brief.id, brief.title, brief.summary);
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
    </TooltipProvider>
  );
};

export default React.memo(BriefCard);
