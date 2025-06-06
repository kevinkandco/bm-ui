
import React, { useState } from "react";
import { X, Play, Pause, Download, FileText, MessageSquare, Mail, CheckSquare, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import AddMissingContent from "./AddMissingContent";
import SummaryFeedback from "./SummaryFeedback";
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

  const {
    handleSummaryFeedback,
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

  const handleDownload = () => {
    toast({
      title: "Downloading Brief",
      description: "Your brief transcript is being downloaded"
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Sample brief data
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
    actionItems: 4,
    timeSaved: {
      reading: 25,
      processing: 8,
      total: 33
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload} className="border-border-subtle">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
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
                  <span className="text-text-primary">{briefData.actionItems} Action Items</span>
                </div>
              </div>

              {/* Time Saved Breakdown */}
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <Clock className="h-4 w-4" />
                <span>
                  Time saved: ~{briefData.timeSaved.reading}min reading + {briefData.timeSaved.processing}min processing = {briefData.timeSaved.total}min total
                </span>
              </div>

              {/* Audio Player */}
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
                
                {/* Waveform Visualization */}
                <div className="w-full h-12 bg-surface-raised/30 rounded-lg p-2 flex items-center">
                  <div className="w-full h-full flex items-center justify-center gap-0.5">
                    {Array.from({ length: 60 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlaying && (currentTime * 60 / duration) > i
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
              {/* Summary Section */}
              <div className="border border-border-subtle rounded-xl p-6 bg-surface-overlay/30">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Executive Summary</h3>
                <div className="prose prose-invert max-w-none">
                  <p className="text-text-secondary leading-relaxed">
                    Your morning brief covers 12 Slack messages and 5 emails from 5:00 AM to 8:00 AM. 
                    Key highlights include 3 priority messages from your team about the product launch, 
                    2 urgent emails from stakeholders, and 4 action items that require your attention today.
                  </p>
                  <p className="text-text-secondary leading-relaxed mt-4">
                    The product team shared updates on the upcoming release timeline, with Sarah mentioning 
                    potential delays in the testing phase. Marketing requests your review of the launch 
                    materials by 2 PM today. Finance needs approval for Q4 budget allocations.
                  </p>
                </div>
                <SummaryFeedback 
                  briefId={briefData.id.toString()}
                  onFeedback={handleSummaryFeedback}
                />
              </div>

              {/* Action Items Section */}
              <div className="border border-border-subtle rounded-xl p-6 bg-surface-overlay/30">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Action Items</h3>
                <div className="space-y-3">
                  {[
                    "Review launch materials for marketing team (Due: 2 PM today)",
                    "Approve Q4 budget allocations for finance team",
                    "Respond to Sarah about testing phase timeline concerns",
                    "Schedule follow-up meeting with product team for next week"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-surface-raised/50 rounded-lg group">
                      <CheckSquare className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-text-primary text-sm flex-1">{item}</span>
                      <ActionItemFeedback 
                        itemId={`${briefData.id}-${index}`}
                        onRelevanceFeedback={(itemId, relevant) => handleActionRelevance(briefData.id.toString(), itemId, relevant)}
                      />
                    </div>
                  ))}
                </div>
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
