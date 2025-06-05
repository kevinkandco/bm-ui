import React, { useState, useEffect } from "react";
import { X, Play, Pause, SkipForward, SkipBack, Volume2, Download, Share, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ActionItemFeedback from "./ActionItemFeedback";
import AddMissingContent from "./AddMissingContent";
import { useFeedbackTracking } from "./useFeedbackTracking";

interface BriefModalProps {
  open: boolean;
  onClose: () => void;
}

const BriefModal = ({ open, onClose }: BriefModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(183); // 3:03 minutes to match image
  const [currentSection, setCurrentSection] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'none' | 'up' | 'down'>('none');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comment, setComment] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  const { handleSummaryFeedback, handleActionRelevance, handleAddMissingContent } = useFeedbackTracking();

  // Sample data matching the image
  const briefData = {
    id: "1",
    title: "Afternoon Catch-up Brief",
    timeRange: "2:00 PM - 4:30 PM Updates",
    monitoringTime: "1.25 hrs",
    summary: "A summary of 5 important messages from Slack and 3 emails requiring your attention. Key topics include the Q4 planning meeting and project deadlines.",
    stats: {
      messagesAnalyzed: 349,
      timeSaved: "48 Minutes",
      tasksFound: 4
    },
    sections: [
      {
        title: "Q4 Planning",
        timestamp: 28,
        content: "Team discussion about quarterly planning and resource allocation"
      },
      {
        title: "Project Deadlines", 
        timestamp: 45,
        content: "Multiple deadline updates and timeline adjustments"
      },
      {
        title: "Urgent Email",
        timestamp: 183,
        content: "High priority client communication requiring immediate attention"
      }
    ],
    messages: [
      {
        platform: "S",
        title: "Daily Standup Notes",
        sender: "@devops",
        time: "08:00 AM",
        priority: "High"
      },
      {
        platform: "M", 
        title: "Project Deadline Reminder",
        sender: "ali@apple.com",
        time: "09:00 AM",
        priority: "Medium"
      },
      {
        platform: "M",
        title: "Urgent Client Request", 
        sender: "jane@apple.com",
        time: "10:00 AM",
        priority: "High"
      },
      {
        platform: "M",
        title: "Lunch Meeting Agenda",
        sender: "john@apple.com", 
        time: "12:00 PM",
        priority: "Low"
      },
      {
        platform: "M",
        title: "Feedback on Design Mockup",
        sender: "design@brief.me",
        time: "02:00 PM", 
        priority: "Medium"
      }
    ],
    actionItems: [
      { id: "1", text: "Review and approve Q4 budget proposal by EOD", priority: "high" },
      { id: "2", text: "Schedule follow-up meeting with product team", priority: "medium" },
      { id: "3", text: "Update project timeline based on new requirements", priority: "high" },
      { id: "4", text: "Send weekly report to stakeholders", priority: "low" }
    ]
  };

  const sections = briefData.sections;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    // Update current section based on timestamp
    const currentSectionIndex = sections.findIndex((section, index) => {
      const nextSection = sections[index + 1];
      return currentTime >= section.timestamp && (!nextSection || currentTime < nextSection.timestamp);
    });
    if (currentSectionIndex !== -1) {
      setCurrentSection(currentSectionIndex);
    }
  }, [currentTime, sections]);

  useEffect(() => {
    // Hide tooltip after 3 seconds or 3 interactions
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  const togglePlayback = () => setIsPlaying(!isPlaying);

  const skipToSection = (sectionIndex: number) => {
    setCurrentTime(sections[sectionIndex].timestamp);
    setCurrentSection(sectionIndex);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (feedbackState !== 'none') return;
    
    setFeedbackState(type);
    
    if (type === 'up') {
      await handleSummaryFeedback(briefData.id, 'up');
    } else {
      setShowCommentInput(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await handleSummaryFeedback(briefData.id, 'down', comment.trim());
      setComment("");
    } else {
      await handleSummaryFeedback(briefData.id, 'down');
    }
    setShowCommentInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  const handleActionItemRelevance = async (itemId: string, relevant: boolean) => {
    await handleActionRelevance(briefData.id, itemId, relevant);
  };

  const handleAddMissing = async (content: string) => {
    await handleAddMissingContent(briefData.id, content);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-[#1a1f23] border-[#2a3038] text-white">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Brief Details</h2>
              <div className="text-sm text-gray-400">
                I've been monitoring your channels for <span className="text-primary-teal">{briefData.monitoringTime}</span>. Here's a brief of what you missed while you were away:
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2a3038] rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Messages Analyzed</div>
              <div className="text-2xl font-bold text-white">{briefData.stats.messagesAnalyzed}</div>
              <div className="text-xs text-gray-500">Emails, Threads, Messages</div>
            </div>
            <div className="bg-[#2a3038] rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Estimated Time Saved</div>
              <div className="text-2xl font-bold text-white">{briefData.stats.timeSaved}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>T</span><span>M</span><span>S</span>
              </div>
            </div>
            <div className="bg-[#2a3038] rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Tasks Found</div>
              <div className="text-2xl font-bold text-white">{briefData.stats.tasksFound}</div>
              <div className="text-xs text-gray-500">Detected and Saved</div>
            </div>
          </div>

          {/* Brief Summary with Feedback */}
          <div className="bg-[#2a3038] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{briefData.title}</h3>
              <div className="text-sm text-primary-teal">{briefData.monitoringTime} summarized in {formatTime(duration)}</div>
            </div>
            <div className="text-sm text-gray-400 mb-2">{briefData.timeRange}</div>
            <p className="text-gray-300 mb-4">{briefData.summary}</p>
            
            {/* Feedback Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('up')}
                  disabled={feedbackState !== 'none'}
                  className={`h-8 w-8 p-0 transition-all ${
                    feedbackState === 'up' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'text-gray-400 hover:text-green-400'
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeedback('down')}
                  disabled={feedbackState !== 'none'}
                  className={`h-8 w-8 p-0 transition-all ${
                    feedbackState === 'down' 
                      ? 'bg-red-500/20 text-red-400' 
                      : 'text-gray-400 hover:text-red-400'
                  }`}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Feedback Badge */}
              {feedbackState === 'up' && (
                <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/40">
                  Rated 👍
                </Badge>
              )}
              {feedbackState === 'down' && !showCommentInput && (
                <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-400 border-red-500/40">
                  Rated 👎
                </Badge>
              )}
            </div>

            {/* Comment Input for downvote */}
            {showCommentInput && (
              <div className="mt-3 animate-fade-in">
                <Input
                  placeholder="What did we miss?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onBlur={handleCommentSubmit}
                  className="bg-[#1a1f23] border-gray-600 text-white placeholder-gray-400"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Audio Controls */}
          <div className="bg-[#2a3038] rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
              <span className="text-sm text-gray-400">{formatTime(duration)}</span>
            </div>
            
            <Progress value={progress} className="mb-4" />
            
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={togglePlayback} size="icon" className="bg-primary-teal hover:bg-primary-teal/80 text-white">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <SkipForward className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Section Navigation */}
            <div className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => skipToSection(index)}
                  className={`w-full text-left p-2 rounded transition-colors ${
                    currentSection === index 
                      ? 'bg-primary-teal/20 text-primary-teal' 
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{section.title}</span>
                    <span className="text-xs text-gray-400">{formatTime(section.timestamp)}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="border-gray-600 text-primary-teal hover:text-primary-teal/80 ml-auto">
                View Transcript
              </Button>
            </div>
          </div>

          {/* Recent Messages Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
            <div className="bg-[#2a3038] rounded-lg overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-3 bg-[#1a1f23] text-sm text-gray-400">
                <div>Platform</div>
                <div>Message</div>
                <div>Sender</div>
                <div>Time</div>
                <div>Priority</div>
                <div>Action</div>
              </div>
              {briefData.messages.map((message, index) => (
                <div key={index} className="grid grid-cols-6 gap-4 p-3 border-t border-gray-700 text-sm">
                  <div className="text-white font-mono">{message.platform}</div>
                  <div className="text-white">{message.title}</div>
                  <div className="text-gray-300">{message.sender}</div>
                  <div className="text-gray-400">{message.time}</div>
                  <div>
                    <Badge 
                      variant={message.priority === 'High' ? 'destructive' : message.priority === 'Medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {message.priority}
                    </Badge>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm" className="text-primary-teal hover:text-primary-teal/80 text-xs">
                      View Transcript
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Action Items</h3>
            <div className="space-y-3">
              {briefData.actionItems.map((item) => (
                <div key={item.id} className="group flex items-start gap-3 p-3 rounded-lg bg-[#2a3038]">
                  <div className="w-2 h-2 bg-primary-teal rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white">{item.text}</p>
                    <Badge 
                      variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {item.priority} priority
                    </Badge>
                  </div>
                  <ActionItemFeedback 
                    itemId={item.id}
                    onRelevanceFeedback={handleActionItemRelevance}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Add Missing Content */}
          <AddMissingContent onAddContent={handleAddMissing} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
