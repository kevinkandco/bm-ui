
import React, { useState, useEffect } from "react";
import { X, Play, Pause, SkipForward, SkipBack, Volume2, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import SummaryFeedback from "./SummaryFeedback";
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
  const [duration, setDuration] = useState(180); // 3 minutes sample
  const [currentSection, setCurrentSection] = useState(0);
  const [showTooltip, setShowTooltip] = useState(true);

  const { handleSummaryFeedback, handleActionRelevance, handleAddMissingContent } = useFeedbackTracking();

  // Sample data
  const briefData = {
    id: "1",
    title: "Morning Brief",
    date: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    summary: "Key highlights from your morning communications including project updates, meeting reminders, and priority messages from your team.",
    sections: [
      {
        title: "Priority Messages",
        content: "Sarah Johnson shared the Q4 roadmap updates in #product-team. The launch timeline has been moved up by one week.",
        timestamp: 15
      },
      {
        title: "Action Items",
        content: "Review budget proposal, Schedule team meeting, Update project timeline",
        timestamp: 45
      },
      {
        title: "Meetings Today",
        content: "10:00 AM - Weekly standup with engineering team. 2:00 PM - Budget review with finance.",
        timestamp: 75
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

  const handleFeedback = async (type: 'up' | 'down', comment?: string) => {
    await handleSummaryFeedback(briefData.id, type, comment);
    setShowTooltip(false);
  };

  const handleActionItemRelevance = async (itemId: string, relevant: boolean) => {
    await handleActionRelevance(briefData.id, itemId, relevant);
  };

  const handleAddMissing = async (content: string) => {
    await handleAddMissingContent(briefData.id, content);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-surface border-border-subtle">
        <div className="flex h-full">
          {/* Left Panel - Audio Controls & Summary */}
          <div className="w-1/2 p-6 border-r border-border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-text-primary">{briefData.title}</h2>
                <p className="text-sm text-text-secondary">{briefData.date}</p>
                <p className="text-xs text-text-secondary">Range: {briefData.timeRange}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Audio Controls */}
            <div className="bg-surface-overlay rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-text-secondary">{formatTime(currentTime)}</span>
                <span className="text-sm text-text-secondary">{formatTime(duration)}</span>
              </div>
              
              <Progress value={progress} className="mb-4" />
              
              <div className="flex items-center justify-center gap-4">
                <Button variant="ghost" size="icon">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={togglePlayback} size="icon" className="bg-accent-primary text-white">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon">
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary">Summary</h3>
              <p className="text-text-secondary leading-relaxed">{briefData.summary}</p>
              
              {/* Summary Feedback */}
              <SummaryFeedback 
                briefId={briefData.id}
                onFeedback={handleFeedback}
                showTooltip={showTooltip}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-6">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Right Panel - Sections & Actions */}
          <div className="w-1/2 flex flex-col">
            <ScrollArea className="flex-1 p-6">
              {/* Section Navigation */}
              <div className="mb-6">
                <h3 className="font-semibold text-text-primary mb-3">Jump to Section</h3>
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => skipToSection(index)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentSection === index 
                          ? 'bg-accent-primary/20 text-accent-primary' 
                          : 'bg-surface-overlay hover:bg-surface-overlay/80 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{section.title}</span>
                        <span className="text-xs text-text-secondary">{formatTime(section.timestamp)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-6 bg-border-subtle" />

              {/* Action Items */}
              <div className="space-y-4">
                <h3 className="font-semibold text-text-primary">Action Items</h3>
                <div className="space-y-3">
                  {briefData.actionItems.map((item) => (
                    <div key={item.id} className="group flex items-start gap-3 p-3 rounded-lg bg-surface-overlay">
                      <div className="w-2 h-2 bg-accent-primary rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary">{item.text}</p>
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
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
