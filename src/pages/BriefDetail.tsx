
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Calendar, Bell, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import SummaryFeedback from "@/components/dashboard/SummaryFeedback";

const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock data - in a real app this would be fetched based on briefId
  const briefData = {
    id: briefId,
    title: "Morning Brief",
    timestamp: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    timeSaved: "~25min reading + 8min processing = 33min total",
    stats: {
      slackMessages: { total: 12, priority: 3 },
      emails: { total: 5, priority: 2 },
      actionItems: 4
    },
    audioUrl: "/path/to/audio.mp3", // Mock audio URL
    audioDuration: "3:00"
  };

  const actionItems = [
    {
      id: 1,
      source: "email",
      priority: "high",
      title: "Review launch materials for marketing team",
      subtitle: "(Due: 2 PM today)",
      time: "7:45 AM",
      actions: ["Add to Asana", "Follow-up", "Reminder"]
    },
    {
      id: 2,
      source: "email", 
      priority: "medium",
      title: "Approve Q4 budget allocations for finance team",
      subtitle: "",
      time: "6:30 AM",
      actions: ["Add to Asana", "Follow-up", "Reminder"]
    },
    {
      id: 3,
      source: "slack",
      priority: "high", 
      title: "Respond to Sarah about testing phase timeline concerns",
      subtitle: "",
      time: "7:15 AM",
      actions: ["Add to Asana", "Follow-up", "Reminder"]
    },
    {
      id: 4,
      source: "slack",
      priority: "low",
      title: "Schedule follow-up meeting with product team for next week",
      subtitle: "",
      time: "5:30 AM",
      actions: ["Add to Asana", "Follow-up", "Reminder"]
    }
  ];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Audio Paused" : "Playing Audio Brief",
      description: isPlaying ? "Audio brief paused" : "Starting audio playback"
    });
  };

  const handleActionClick = (action: string, item: any) => {
    toast({
      title: `${action}`,
      description: `Action "${action}" applied to: ${item.title}`
    });
  };

  const handleFeedback = (type: 'up' | 'down', comment?: string) => {
    toast({
      title: "Feedback Received",
      description: `Thank you for your ${type === 'up' ? 'positive' : 'constructive'} feedback!`
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "medium": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "low": return "bg-green-500/20 text-green-400 border-green-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email": return <Mail className="h-4 w-4" />;
      case "slack": return <MessageSquare className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary">
      {/* Header */}
      <div className="border-b border-border-subtle bg-surface-secondary/50">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-6 w-6 text-accent-primary" />
              <div>
                <h1 className="text-xl font-semibold text-text-primary">{briefData.title}</h1>
                <p className="text-sm text-text-secondary">{briefData.timestamp}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-text-secondary hover:text-text-primary"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Stats Row */}
        <div className="mb-6">
          <p className="text-sm text-text-secondary mb-4">Range: {briefData.timeRange}</p>
          
          <div className="flex flex-wrap gap-6 mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-accent-primary" />
              <span className="font-semibold text-text-primary">{briefData.stats.slackMessages.total} Slack Messages</span>
              <Badge variant="secondary" className="text-xs">{briefData.stats.slackMessages.priority} priority</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-accent-primary" />
              <span className="font-semibold text-text-primary">{briefData.stats.emails.total} Emails</span>
              <Badge variant="secondary" className="text-xs">{briefData.stats.emails.priority} priority</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-accent-primary" />
              <span className="font-semibold text-text-primary">{briefData.stats.actionItems} Action Items</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-green-400">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Time saved: {briefData.timeSaved}</span>
          </div>
        </div>

        {/* Audio Brief Section */}
        <div className="mb-8">
          <div className="bg-surface-overlay/20 rounded-lg p-4 border border-border-subtle">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-8 w-8"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <span className="font-medium text-text-primary">Audio Brief</span>
              </div>
              <span className="text-sm text-text-secondary">0:00 / {briefData.audioDuration}</span>
            </div>
            
            {/* Audio waveform placeholder */}
            <div className="mt-3 h-12 bg-surface-overlay/30 rounded flex items-center px-4">
              <div className="flex items-center gap-1 h-full">
                {Array.from({ length: 60 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-accent-primary/40 rounded-full"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Items Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Action Items</h2>
          
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 text-sm text-text-secondary font-medium pb-2 border-b border-border-subtle">
              <div className="col-span-2">Source</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-5">Action Item</div>
              <div className="col-span-2">Time</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Action Items */}
            {actionItems.map((item, index) => (
              <div key={item.id} className="group">
                <div className="grid grid-cols-12 gap-4 py-3 items-center hover:bg-surface-overlay/10 rounded-lg px-2 -mx-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-surface-overlay/20 rounded">
                        <ExternalLink className="h-3 w-3 text-text-secondary" />
                      </button>
                      {getSourceIcon(item.source)}
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <Badge className={`text-xs border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </Badge>
                  </div>
                  
                  <div className="col-span-5">
                    <div className="text-sm text-text-primary font-medium">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <div className="text-xs text-text-secondary">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2">
                    <span className="text-sm text-text-secondary">{item.time}</span>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="flex gap-1">
                      {item.actions.map((action) => (
                        <Button
                          key={action}
                          variant="outline"
                          size="sm"
                          onClick={() => handleActionClick(action, item)}
                          className="text-xs px-2 py-1 h-auto"
                        >
                          {action === "Add to Asana" && <ExternalLink className="h-3 w-3 mr-1" />}
                          {action === "Follow-up" && <Calendar className="h-3 w-3 mr-1" />}
                          {action === "Reminder" && <Bell className="h-3 w-3 mr-1" />}
                          {action === "Add to Asana" ? "Add to Asana" : 
                           action === "Follow-up" ? "Follow-up" : 
                           action === "Reminder" ? "Reminder" : action}
                        </Button>
                      ))}
                      <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto">
                        <Info className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < actionItems.length - 1 && <Separator className="bg-border-subtle" />}
              </div>
            ))}
          </div>
        </div>

        {/* All Messages & Items Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text-primary">All Messages & Items</h2>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-surface-overlay/10 rounded-lg p-4 border border-border-subtle">
            <p className="text-text-secondary text-sm">Detailed message list would appear here...</p>
          </div>
        </div>

        {/* Add What's Missing Section */}
        <div className="mb-8">
          <Button variant="outline" className="w-full" size="lg">
            <span className="mr-2">+</span>
            Add what's missing
          </Button>
        </div>

        {/* Feedback Section */}
        <SummaryFeedback 
          briefId={briefData.id || "1"} 
          onFeedback={handleFeedback}
          showTooltip={true}
        />
      </div>
    </div>
  );
};

export default BriefDetail;
