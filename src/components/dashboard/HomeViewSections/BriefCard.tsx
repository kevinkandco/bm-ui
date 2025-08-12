import React, { useState } from "react";
import { FileText, MessageSquare, Mail, CheckSquare, ExternalLink, Play, ThumbsUp, ThumbsDown, Clock, Pause, Volume2, VolumeX, RotateCcw, SkipBack, SkipForward, BarChart3, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFeedbackTracking } from "../useFeedbackTracking";
import ActionItemFeedback from "../ActionItemFeedback";
import ActionItemControls from "../ActionItemControls";
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
    isGenerating?: boolean;
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

  // Audio player state
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(300); // 5 minutes mock duration
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
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

  // Mock priority breakdown based on total messages
  const totalMessages = brief.slackMessages.total + brief.emails.total;
  const mockStats = {
    totalMessagesAnalyzed: {
      total: totalMessages,
      breakdown: {
        slack: brief.slackMessages.total,
        gmail: brief.emails.total
      }
    },
    lowPriority: {
      total: Math.floor(totalMessages * 0.4),
      breakdown: {
        slack: Math.floor(brief.slackMessages.total * 0.4),
        gmail: Math.floor(brief.emails.total * 0.4)
      }
    },
    mediumPriority: {
      total: Math.floor(totalMessages * 0.35),
      breakdown: {
        slack: Math.floor(brief.slackMessages.total * 0.35),
        gmail: Math.floor(brief.emails.total * 0.35)
      }
    },
    highPriority: {
      total: Math.floor(totalMessages * 0.25),
      breakdown: {
        slack: Math.floor(brief.slackMessages.total * 0.25),
        gmail: Math.floor(brief.emails.total * 0.25)
      }
    },
    actionItems: {
      total: brief.actionItems,
      breakdown: {
        slack: Math.floor(brief.actionItems * 0.5),
        gmail: Math.ceil(brief.actionItems * 0.5)
      }
    }
  };
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
  const handleActionItemFeedback = async (itemId: string, relevant: boolean, feedback?: string) => {
    await handleActionRelevance(brief.id.toString(), itemId, relevant, feedback);
  };
  const handleActionItemThumbsUp = (itemId: string) => {
    console.log(`Thumbs up for action item: ${itemId}`);
    // Add your thumbs up logic here
  };
  const handleActionItemSnooze = (itemId: string, reason: any, feedback?: string) => {
    console.log(`Snoozed action item: ${itemId}`, {
      reason,
      feedback
    });
    // Add your snooze logic here  
  };

  // Mock action items for demonstration
  const mockActionItems = [{
    id: '1',
    title: 'Review Q3 budget proposal',
    source: 'gmail',
    priority: 'high'
  }, {
    id: '2',
    title: 'Respond to Sarah about timeline',
    source: 'slack',
    priority: 'medium'
  }, {
    id: '3',
    title: 'Schedule team standup',
    source: 'slack',
    priority: 'low'
  }];

  // Extract date and time from the timeCreated string
  const formatDeliveryText = (timeCreated: string, timeRange: string) => {
    // Parse the timeCreated string (e.g., "Today, 8:00 AM" or "December 8, 2024, 8:00 AM")
    const [datePart, timePart] = timeCreated.split(', ');
    
    // Convert delivery time to HH:MM format
    const deliveryTime = timePart ? timePart.replace(/(\d{1,2}):00\s*(AM|PM)/i, (match, hour, period) => {
      let hourNum = parseInt(hour);
      if (period.toUpperCase() === 'PM' && hourNum !== 12) hourNum += 12;
      if (period.toUpperCase() === 'AM' && hourNum === 12) hourNum = 0;
      return hourNum.toString().padStart(2, '0') + ':00';
    }) : '08:00';
    
    // Parse time range and format as DD/MM HH:MM to DD/MM HH:MM
    const formatRange = (range: string) => {
      // Example range: "6:00 AM - 8:00 AM" or "December 8, 6:00 AM - December 8, 8:00 AM"
      const parts = range.split(' - ');
      if (parts.length !== 2) return range;
      
      const formatDateTime = (dateTimeStr: string) => {
        const today = new Date();
        let day = today.getDate().toString().padStart(2, '0');
        let month = (today.getMonth() + 1).toString().padStart(2, '0');
        
        // Handle different date formats in range
        if (datePart === 'Yesterday') {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          day = yesterday.getDate().toString().padStart(2, '0');
          month = (yesterday.getMonth() + 1).toString().padStart(2, '0');
        }
        
        // Extract time and convert to HH:MM
        const timeMatch = dateTimeStr.match(/(\d{1,2}):00\s*(AM|PM)/i);
        if (timeMatch) {
          let hourNum = parseInt(timeMatch[1]);
          const period = timeMatch[2].toUpperCase();
          if (period === 'PM' && hourNum !== 12) hourNum += 12;
          if (period === 'AM' && hourNum === 12) hourNum = 0;
          const time = hourNum.toString().padStart(2, '0') + ':00';
          return `${day}/${month} ${time}`;
        }
        return `${day}/${month} 08:00`;
      };
      
      return `${formatDateTime(parts[0])} to ${formatDateTime(parts[1])}`;
    };
    
    return `${deliveryTime} Range: ${formatRange(timeRange)}`;
  };
  return <TooltipProvider>
      <div className="w-full transition-all duration-300 cursor-pointer rounded-xl overflow-hidden group" style={{
      background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.6) 0%, rgba(43, 49, 54, 0.6) 100%)'
    }} onClick={handleCardClick}>
        {/* Collapsed Header */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-2">
            {/* Play button moved to the left */}
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
            
            {/* Title Row: Brief title, status badge, counts */}
            <div className="flex items-center justify-between flex-1 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-white-text truncate font-semibold text-base">
                  {brief.name}
                </h3>
                
                {/* Status/emoji badge - Always visible when rated */}
                {feedbackState === 'up' && (
                  <span className="text-sm">👍</span>
                )}
                {feedbackState === 'down' && !showCommentInput && (
                  <span className="text-sm">👎</span>
                )}
                {playingBrief === brief.id && (
                  <span className="text-sm">▶️</span>
                )}
                
                {/* Feedback Controls - Show on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={e => handleFeedback('up', e)} disabled={feedbackState !== 'none'} className={`h-6 w-6 p-0 transition-all ${feedbackState === 'up' ? 'bg-green-500/20 text-green-400' : 'text-text-secondary hover:text-green-400'}`}>
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={e => handleFeedback('down', e)} disabled={feedbackState !== 'none'} className={`h-6 w-6 p-0 transition-all ${feedbackState === 'down' ? 'bg-red-500/20 text-red-400' : 'text-text-secondary hover:text-red-400'}`}>
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              {/* Counts on the right side of title row */}
              <div className="flex items-center gap-4 text-sm text-light-gray-text flex-shrink-0">
                <span className="whitespace-nowrap">{brief.slackMessages.total} Slack</span>
                <span className="whitespace-nowrap">{brief.emails.total} Email</span>
                <span className="whitespace-nowrap">{brief.actionItems} Actions</span>
              </div>
            </div>
          </div>
          
          {/* Meta Row: Delivery text and time saved */}
          <div className="flex items-center justify-between pl-14">
            <p className="text-xs text-light-gray-text font-light">
              {formatDeliveryText(brief.timeCreated, brief.timeRange)}
            </p>
            
            {/* Time saved badge or generating pill aligned right with meta row */}
            {brief.isGenerating ? (
              <div className="flex items-center gap-1 text-xs bg-blue-400/10 rounded-full py-1 px-2">
                <span className="text-blue-400 font-medium">Generating summary</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-xs bg-green-400/10 rounded-full py-1 px-2">
                <Clock className="h-3 w-3 text-green-400" />
                <span className="text-green-400 font-medium">~{timeSaved.total}min saved</span>
              </div>
            )}
          </div>
          
          {/* Comment Input for downvote */}
          {showCommentInput && <div className="mt-3 animate-fade-in" onClick={e => e.stopPropagation()}>
              <Input placeholder="What did we miss?" value={comment} onChange={e => setComment(e.target.value)} onKeyPress={e => handleKeyPress(e, 'comment')} onBlur={handleCommentSubmit} className="bg-white/5 border-white/20 text-text-primary h-7 text-xs" autoFocus />
            </div>}
        </div>

        {/* Expanded Content */}
        {isExpanded && <div className="px-6 pb-6">
            <div className="border-t border-white/20 pt-3">
              {/* Audio Player Section - Only show when playing */}
              {playingBrief === brief.id && <div className="mb-4 p-4 rounded-lg bg-surface-raised/20 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button onClick={handleAudioToggle} className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors">
                        {isAudioPlaying ? <Pause className="h-4 w-4 text-primary-teal" /> : <Play className="h-4 w-4 text-primary-teal" />}
                      </button>
                      
                      <div className="text-sm">
                        <div className="text-white-text font-medium">Playing: {brief.name}</div>
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
                    <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleTimeChange} className="w-full" />
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
                  {mockActionItems.map(item => <div key={item.id} className="group flex items-center justify-between p-2 rounded-lg bg-surface-raised/30 hover:bg-surface-raised/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                          {item.source === 'gmail' ? <Mail className="h-3 w-3 text-red-400" /> : <MessageSquare className="h-3 w-3 text-purple-400" />}
                          <Badge className={`text-xs px-1 py-0 ${item.priority === 'high' ? 'bg-red-500/20 text-red-400' : item.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                            {item.priority}
                          </Badge>
                        </div>
                        <span className="text-sm text-text-primary">{item.title}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <ActionItemControls itemId={item.id} itemTitle={item.title} sender={item.source === 'gmail' ? 'example@company.com' : 'Sarah'} onThumbsUp={handleActionItemThumbsUp} onSnooze={handleActionItemSnooze} size="sm" />
                        <ActionItemFeedback itemId={item.id} onRelevanceFeedback={handleActionItemFeedback} />
                      </div>
                    </div>)}
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
              {!showAddMissing ? <div className="mb-3">
                  <Button variant="ghost" size="sm" onClick={e => {
              e.stopPropagation();
              setShowAddMissing(true);
            }} className="text-text-secondary hover:text-text-primary text-xs h-7 px-2">
                    Add what's missing
                  </Button>
                </div> : <div className="mb-3 animate-fade-in" onClick={e => e.stopPropagation()}>
                  <Input placeholder="What important information did we miss?" value={missingContent} onChange={e => setMissingContent(e.target.value)} onKeyPress={e => handleKeyPress(e, 'missing')} onBlur={handleAddMissingSubmit} className="bg-white/5 border-white/20 text-text-primary h-7 text-xs" autoFocus />
                </div>}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-1">
                {brief.hasTranscript && <Button variant="outline" size="sm" className="h-7 px-3 text-xs rounded-lg border-border-subtle/20 hover:border-border-subtle/40 bg-transparent" onClick={e => {
              e.stopPropagation();
              onViewTranscript(brief.id);
            }}>
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Transcript
                  </Button>}
                <Button size="sm" className="h-7 px-4 text-xs rounded-lg bg-primary-teal hover:bg-accent-green" onClick={e => {
              e.stopPropagation();
              onViewBrief(brief.id);
            }}>
                  View Brief
                </Button>
              </div>
            </div>
          </div>}
      </div>
    </TooltipProvider>;
};
export default React.memo(BriefCard);
