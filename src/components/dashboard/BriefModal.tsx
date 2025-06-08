
import React, { useState } from "react";
import { Play, Pause, FileText, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import AddMissingContent from "./AddMissingContent";
import ActionItemFeedback from "./ActionItemFeedback";
import { useFeedbackTracking } from "./useFeedbackTracking";

interface BriefModalProps {
  open: boolean;
  onClose: () => void;
  briefId?: number;
}

const BriefModal = ({ open, onClose, briefId = 1 }: BriefModalProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(180); // 3 minutes in seconds
  const [showAllMessages, setShowAllMessages] = useState(false);

  const {
    handleActionRelevance,
    handleAddMissingContent
  } = useFeedbackTracking();

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Brief Paused" : "Playing Brief",
      description: isPlaying ? "Audio playback paused" : "Audio playback started"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenInPlatform = (platform: string, messageId: string) => {
    toast({
      title: `Opening in ${platform}`,
      description: `Redirecting to ${platform} message...`
    });
  };

  const handleShowPriorityReason = (itemId: string) => {
    toast({
      title: "Priority Reasoning",
      description: "This item was marked as priority due to deadline urgency and stakeholder importance."
    });
  };

  // Sample brief data with enhanced action items
  const briefData = {
    id: briefId,
    name: "Morning Brief",
    timeCreated: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    slackMessages: {
      total: 12,
      fromPriorityPeople: 3
    },
    emails: {
      total: 5,
      fromPriorityPeople: 2
    },
    actionItems: [
      {
        id: "1",
        text: "Review launch materials for marketing team (Due: 2 PM today)",
        source: "gmail",
        priority: "high",
        messageId: "msg_123",
        reasoning: "Time-sensitive deadline and critical for product launch timeline"
      },
      {
        id: "2", 
        text: "Approve Q4 budget allocations for finance team",
        source: "gmail",
        priority: "medium",
        messageId: "msg_456",
        reasoning: "Affects resource planning and team capacity for next quarter"
      },
      {
        id: "3",
        text: "Respond to Sarah about testing phase timeline concerns", 
        source: "slack",
        priority: "high",
        messageId: "slack_789",
        reasoning: "Blocking team progress and requires immediate leadership decision"
      },
      {
        id: "4",
        text: "Schedule follow-up meeting with product team for next week",
        source: "slack", 
        priority: "low",
        messageId: "slack_101",
        reasoning: "Important for alignment but not immediately blocking"
      }
    ],
    timeSaved: {
      reading: 25,
      processing: 8,
      total: 33
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/20 border-red-400/40";
      case "medium": return "text-orange-400 bg-orange-400/20 border-orange-400/40";
      case "low": return "text-green-400 bg-green-400/20 border-green-400/40";
      default: return "text-text-secondary bg-surface-raised/20 border-border-subtle";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "slack": return <MessageSquare className="h-4 w-4 text-accent-green" />;
      case "gmail": return <Mail className="h-4 w-4 text-blue-400" />;
      default: return <FileText className="h-4 w-4 text-text-secondary" />;
    }
  };

  React.useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] bg-surface border-border-subtle p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-text-primary">
                  {briefData.name}
                </DialogTitle>
                <p className="text-text-secondary">{briefData.timeCreated}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Header Stats and Controls */}
            <div className="space-y-4 mb-6">
              {/* Range */}
              <p className="text-text-secondary text-sm">
                Range: {briefData.timeRange}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent-primary" />
                  <span className="text-text-primary">{briefData.slackMessages.total} Slack Messages</span>
                  <span className="px-2 py-1 bg-accent-primary/20 text-accent-primary rounded-full text-xs">
                    {briefData.slackMessages.fromPriorityPeople} priority
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400" />
                  <span className="text-text-primary">{briefData.emails.total} Emails</span>
                  <span className="px-2 py-1 bg-blue-400/20 text-blue-400 rounded-full text-xs">
                    {briefData.emails.fromPriorityPeople} priority
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-orange-400" />
                  <span className="text-text-primary">{briefData.actionItems.length} Action Items</span>
                </div>
              </div>

              {/* Time Saved Breakdown */}
              <div className="flex items-center gap-2 text-sm text-text-secondary bg-surface-overlay/30 rounded-lg px-3 py-2 border border-border-subtle">
                <Clock className="h-4 w-4 text-green-400" />
                <span>
                  <span className="text-green-400 font-medium">Time saved:</span> ~{briefData.timeSaved.reading}min reading + {briefData.timeSaved.processing}min processing = <span className="text-green-400 font-medium">{briefData.timeSaved.total}min total</span>
                </span>
              </div>

              {/* Audio Player - Full Width Waveform */}
              <div className="bg-surface-overlay/50 rounded-xl p-4 border border-border-subtle">
                <div className="flex items-center gap-4 mb-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30"
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4 text-accent-primary" />
                    ) : (
                      <Play className="h-4 w-4 text-accent-primary" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm text-text-secondary mb-1">
                      <span>Audio Brief</span>
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Full Width Waveform Visualization */}
                <div className="w-full h-12 bg-surface-raised/30 rounded-lg p-2">
                  <div className="w-full h-full flex items-center justify-center gap-0.5">
                    {Array.from({ length: 120 }, (_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-300 ${
                          isPlaying && (currentTime * 120 / duration) > i
                            ? 'bg-accent-primary'
                            : 'bg-surface-raised'
                        }`}
                        style={{
                          height: `${20 + Math.sin(i * 0.3) * 15 + Math.cos(i * 0.1) * 10}%`,
                          animationDelay: `${i * 50}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Brief Content */}
            <div className="space-y-6">
              {/* Action Items Section - Enhanced */}
              <div className="border border-border-subtle rounded-xl p-6 bg-surface-overlay/30">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Action Items</h3>
                <div className="space-y-3">
                  {briefData.actionItems.map((item, index) => (
                    <div key={item.id} className="flex items-start gap-3 p-4 bg-surface-raised/50 rounded-lg group">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getSourceIcon(item.source)}
                        <Badge variant="secondary" className={`text-xs h-5 px-2 ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      </div>
                      
                      <span className="text-text-primary text-sm flex-1">{item.text}</span>
                      
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenInPlatform(item.source, item.messageId)}
                          className="h-6 w-6 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShowPriorityReason(item.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Info className="h-3 w-3" />
                        </Button>
                        <ActionItemFeedback 
                          itemId={item.id}
                          onRelevanceFeedback={(itemId, relevant) => handleActionRelevance(briefData.id.toString(), itemId, relevant)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Messages Section */}
              <div className="border border-border-subtle rounded-xl p-6 bg-surface-overlay/30">
                <Collapsible open={showAllMessages} onOpenChange={setShowAllMessages}>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                    <h3 className="text-lg font-semibold text-text-primary">All Messages & Items</h3>
                    {showAllMessages ? (
                      <ChevronUp className="h-4 w-4 text-text-secondary" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-text-secondary" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-text-primary flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-accent-green" />
                          Slack Messages ({briefData.slackMessages.total})
                        </h4>
                        <div className="space-y-1 text-sm text-text-secondary">
                          <div className="p-2 bg-surface-raised/30 rounded">Product launch timeline discussion</div>
                          <div className="p-2 bg-surface-raised/30 rounded">Testing phase concerns from Sarah</div>
                          <div className="p-2 bg-surface-raised/30 rounded">Team standup updates</div>
                          <div className="p-2 bg-surface-raised/30 rounded">+9 more messages</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-text-primary flex items-center gap-2">
                          <Mail className="h-4 w-4 text-blue-400" />
                          Emails ({briefData.emails.total})
                        </h4>
                        <div className="space-y-1 text-sm text-text-secondary">
                          <div className="p-2 bg-surface-raised/30 rounded">Marketing launch materials review</div>
                          <div className="p-2 bg-surface-raised/30 rounded">Q4 budget approval request</div>
                          <div className="p-2 bg-surface-raised/30 rounded">Weekly team updates</div>
                          <div className="p-2 bg-surface-raised/30 rounded">+2 more emails</div>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Add Missing Content */}
              <AddMissingContent 
                onAddContent={(content) => handleAddMissingContent(briefData.id.toString(), content)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
