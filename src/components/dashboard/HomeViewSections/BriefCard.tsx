import React, { useEffect, useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, ChevronDown, ChevronUp, Play, ThumbsUp, ThumbsDown, Clock, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionItem, Summary } from "../types";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFeedbackTracking } from "../useFeedbackTracking";
import { UseAudioPlayerType } from "@/hooks/useAudioPlayer";
import ActionItemFeedback from "../ActionItemFeedback";
import ActionItemControls from "../ActionItemControls";
interface BriefCardProps {
  brief: Summary;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number, title: string, transcript: string) => void;
	handleClick: (message: string, e: React.MouseEvent) => void
  isLast?: boolean;
  playingBrief: number | null;
  onPlayBrief: (briefId: number) => void;
  audioPlayer: UseAudioPlayerType;
}
const BriefCard = ({
  brief,
  onViewBrief,
  onViewTranscript,
  handleClick,
  isLast,
  playingBrief,
  onPlayBrief,
  audioPlayer,
}: BriefCardProps) => {
  const {
    isPlaying,
    currentTime,
    duration,
    formatDuration,
    handleMuteToggle,
    handlePlayPause,
    isMuted,
    playbackRate,
    seekTo,
    updatePlaybackRate,
  } = audioPlayer;
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackState, setFeedbackState] = useState<'none' | 'up' | 'down'>('none');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showAddMissing, setShowAddMissing] = useState(false);
  const [comment, setComment] = useState("");
  const [missingContent, setMissingContent] = useState("");
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);  
  
  const {
    handleSummaryFeedback,
    handleAddMissingContent,
    handleActionRelevance
  } = useFeedbackTracking();

  // Sample time saved data - in a real app this would come from the brief data
  const timeSaved = {
    reading: 25,
    processing: 8,
    total: 33
  };

  useEffect(() => {
    setFeedbackState(brief?.vote ? brief?.vote === "like" ? "up" : "down" : "none");

    const transformToActionItem = (item: any): ActionItem => {
      return {
        id: String(`${item?.platform}-${item.id}`),
        title: item.title,
        platform: item.platform,
        message: item?.message,
        sender: item?.sender || "Unknown",
        isVip: false, // Placeholder – set via business logic
        priorityPerson: undefined, // Set if needed by keyword/name detection
        triggerKeyword: undefined, // Set if keyword-based filtering is applied
        urgency: item.priority as 'critical' | 'high' | 'medium' | 'low',
        isNew: !item.status,
        createdAt: item.created_at,
        threadUrl: item.redirect_link,
        completed: item.status,
        vote: item?.vote
      };
    };

    const data = brief?.messages?.map(transformToActionItem);
    setActionItems(data);
  }, [brief?.vote, brief?.messages]);

  // const statsConfig = [
  //   {
  //     icon: BarChart3,
  //     label: "Total Messages Analyzed",
  //     value: brief?.stats?.totalMessagesAnalyzed?.total,
  //     breakdown: brief?.stats?.totalMessagesAnalyzed.breakdown,
  //     color: "text-blue-400"
  //   },
  //   {
  //     icon: CheckCircle,
  //     label: "Low Priority",
  //     value: brief?.stats?.lowPriority?.total,
  //     breakdown: brief?.stats?.lowPriority?.breakdown,
  //     color: "text-gray-400"
  //   },
  //   {
  //     icon: AlertCircle,
  //     label: "Medium Priority",
  //     value: brief?.stats?.mediumPriority?.total,
  //     breakdown: brief?.stats?.mediumPriority?.breakdown,
  //     color: "text-orange-400"
  //   },
  //   {
  //     icon: AlertCircle,
  //     label: "High Priority",
  //     value: brief?.stats?.highPriority?.total,
  //     breakdown: brief?.stats?.highPriority?.breakdown,
  //     color: "text-red-400"
  //   },
  //   {
  //     icon: CheckSquare,
  //     label: "Action Items",
  //     value: brief?.stats?.actionItems?.total,
  //     breakdown: brief?.stats?.actionItems?.breakdown,
  //     color: "text-accent-primary"
  //   }
  // ];

  const statsConfig = [{
    icon: AlertCircle,
    label: "Interrupts Prevented",
    value: 14,
    color: "text-blue-400"
  }, {
    icon: Clock,
    label: "Focus Gained",
    value: "2h 17m",
    color: "text-green-400"
  }, {
    icon: CheckSquare,
    label: "Follow-ups",
    value: brief.actionItems,
    color: "text-accent-primary"
  }];
  
  const playbackSpeeds = [1, 1.1, 1.2, 1.5, 2, 3];
  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  const timeRange = brief?.start_at && brief?.ended_at ? `${brief?.start_at} - ${brief?.ended_at}` : "";

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    updatePlaybackRate(1.0);
    setIsExpanded(true);
    onPlayBrief(brief.id);
  };
  const handleAudioToggle = () => {
    handlePlayPause();
  };
  const handleSpeedChange = (speed: number) => {
    updatePlaybackRate(speed);
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
  const handleActionItemFeedback = async (itemId: string, relevant: boolean, feedback?: string) => {
    await handleActionRelevance(brief?.id, itemId, relevant, feedback);
  };
  const handleActionItemSnooze = (itemId: string, reason: any, feedback?: string) => {
    console.log(`Snoozed action item: ${itemId}`, {
      reason,
      feedback
    });
    // Add your snooze logic here  
  };

  // Extract date and time from the timeCreated string
  const formatDeliveryText = (timeCreated: string, timeRange: string) => {
    // Parse the timeCreated string (e.g., "Today, 8:00 AM" or "December 8, 2024, 8:00 AM")
    const [datePart, timePart] = timeCreated.split(', ');
    const time = timePart?.replace(':00 ', '').replace(':00', '') || '8am';
    const formattedTimeRange = timeRange.replace(':00 ', '').replace(':00', '');

    // Handle different date formats
    let dateText = datePart;
    if (datePart === 'Today') {
      const today = new Date();
      dateText = today.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } else if (datePart === 'Yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      dateText = yesterday.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return `Delivered at ${time} on ${dateText} (Summarizing: ${formattedTimeRange})`;
  };
  return <TooltipProvider>
      <div className="w-full transition-all duration-300 cursor-pointer rounded-xl overflow-hidden group" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)'
    }} onClick={handleCardClick}>
        {/* Collapsed Header */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* Play button moved to the left, doc icon removed */}
              <button onClick={handlePlayClick} className="w-10 h-10 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors flex-shrink-0">
                {playingBrief === brief.id ? <div className="flex items-center gap-0.5">
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
                  </div> : <Play className="h-5 w-5 text-primary-teal" />}
              </button>
              
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-white-text truncate font-normal text-sm">
                    {brief?.title}
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
                  {feedbackState === 'up' && <Badge variant="secondary" className="text-xs h-4 px-2 bg-green-500/20 text-green-400 border-green-500/40">
                      👍
                    </Badge>}
                  {feedbackState === 'down' && !showCommentInput && <Badge variant="secondary" className="text-xs h-4 px-2 bg-red-500/20 text-red-400 border-red-500/40">
                      👎
                    </Badge>}
                </div>
                
                {/* Updated timestamp and range format with date */}
                <p className="text-xs text-light-gray-text font-extralight">
                  Delivered at {brief?.delivery_at} (Summarizing: {timeRange})
                  {/* {formatDeliveryText(brief?.timeCreated, brief?.timeRange)} */}
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
                {isExpanded ? <ChevronUp className="h-4 w-4 text-light-gray-text" /> : <ChevronDown className="h-4 w-4 text-light-gray-text" />}
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
          {showCommentInput && <div className="mt-3 animate-fade-in" onClick={e => e.stopPropagation()}>
              <Input placeholder="What did we miss?" value={comment} onChange={e => setComment(e.target.value)} onKeyPress={e => handleKeyPress(e, 'comment')} onBlur={handleCommentSubmit} className="bg-white/5 border-white/20 text-text-primary h-7 text-xs" autoFocus />
            </div>}
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="px-6 pb-6" onClick={e => e.stopPropagation()}>
            <div className="border-t border-white/20 pt-3">
              {/* Audio Player Section - Only show when playing */}
              {playingBrief === brief.id && <div className="mb-4 p-4 rounded-lg bg-surface-raised/20 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={handleAudioToggle}
                        className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
                      >
                        {playingBrief === brief.id && isPlaying ? (
                          <Pause className="h-4 w-4 text-primary-teal" />
                        ) : (
                          <Play className="h-4 w-4 text-primary-teal" />
                        )}
                      </button>
                      
                      <div className="text-sm">
                        <div className="text-white-text font-medium">Playing: {brief.title}</div>
                        <div className="text-light-gray-text text-xs">
                          {formatDuration(currentTime)} / {formatDuration(duration)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="px-2 py-1 text-xs rounded bg-white/10 text-white-text hover:bg-white/20 transition-colors">
                            {playbackRate}x
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface-raised border border-white/20">
                          {playbackSpeeds.map(speed => <DropdownMenuItem key={speed} onClick={() => handleSpeedChange(speed)} className="text-white-text hover:bg-white/10 cursor-pointer">
                              {speed}x
                            </DropdownMenuItem>)}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <button onClick={handleMuteToggle} className="w-6 h-6 flex items-center justify-center text-light-gray-text hover:text-white-text transition-colors">
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-2">
                    <Slider
                      value={[currentTime]}
                      max={duration}
                      step={1}
                      onValueChange={([value]) => {
                        seekTo(value);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>}

              {/* Time Saved Breakdown - Expanded State */}
              <div className="flex items-center gap-2 text-sm text-text-secondary bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20 mb-3">
                <Clock className="h-4 w-4 text-green-400" />
                <span>
                  <span className="text-green-400 font-medium">Time saved:</span> ~{timeSaved.reading}min reading + {timeSaved.processing}min processing = <span className="text-green-400 font-medium">{timeSaved.total}min total</span>
                </span>
              </div>

              {/* Compact Stats Grid */}
              <div className="grid grid-cols-3 gap-1 mb-2">
                {statsConfig.map((stat, index) => {
              const IconComponent = stat.icon;
              return <div key={index} className="flex flex-col items-center p-1.5 rounded-md bg-surface-raised/20">
                        <IconComponent className={`h-3 w-3 ${stat.color} mb-0.5`} />
                        <div className="text-sm font-semibold text-text-primary">
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-text-secondary text-center leading-tight">
                          {stat.label}
                        </div>
                      </div>;
            })}
              </div>

              {/* Follow-ups with Feedback */}
              <div className="mb-3">
                <h4 className="text-sm font-medium text-text-primary mb-2">Follow-ups</h4>
                <div className="space-y-2">
                  {actionItems?.slice(0, 5)?.map((item, i) => (
                    <div key={item?.id ? (item?.platform + item?.id) : i} className="group flex items-center justify-between p-2 rounded-lg bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {item?.platform === 'gmail' ? (
                            <Mail className="h-3 w-3 text-red-400" />
                          ) : (
                            <MessageSquare className="h-3 w-3 text-purple-400" />
                          )}
                          <Badge className={`text-xs px-1 py-0 ${
                            item?.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                            item?.urgency === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {item?.urgency}
                          </Badge>
                        </div>
                        <span className="text-sm text-text-primary">{item?.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ActionItemControls itemId={item.id} itemTitle={item.title} sender={item?.sender} platform={item?.platform} vote={item?.vote} onSnooze={handleActionItemSnooze} size="sm" />
                        <ActionItemFeedback itemId={item.id} onRelevanceFeedback={handleActionItemFeedback} />
                      </div>
                    </div>))}
                </div>
                
                {/* View All Link */}
                <div className="mt-2 text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewBrief(brief.id);
                    }}
                    className="text-xs text-text-secondary hover:text-primary-teal h-6 px-2"
                  >
                    View all
                  </Button>
                </div>
              </div>

              {/* Add Missing Content */}
              {/* {!showAddMissing ? (
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
              )} */}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                {brief.summary && (
                  <Button variant="outline" size="sm" className="h-7 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent" onClick={e => {
                    e.stopPropagation();
                    onViewTranscript(brief.id, brief.title, brief.summary);
                  }}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Transcript
                  </Button>)}
                <Button size="sm" className="h-7 px-4 text-xs rounded-lg bg-primary-teal hover:bg-accent-green" onClick={e => {
              e.stopPropagation();
              onViewBrief(brief.id);
            }}>
                  View Brief
                </Button>
              </div>
            </div>
          </div>)}
      </div>
    </TooltipProvider>;
};
export default React.memo(BriefCard);
