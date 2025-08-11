import React, { useState } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckSquare, Play, Pause, Mail, MessageSquare, Clock, AlertCircle, ExternalLink, Users, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BriefDrawerProps {
  open: boolean;
  briefId: number | null;
  onClose: () => void;
}

const BriefDrawer = ({ open, briefId, onClose }: BriefDrawerProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  // Comprehensive brief data matching desktop view
  const briefData = {
    id: briefId,
    title: "Morning Brief",
    timestamp: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM", 
    timeSaved: "~25min reading + 8min processing = 33min total",
    type: "Scheduled",
    scheduledTime: "8:00 AM daily",
    briefLength: "2:35",
    messagesCount: 47,
    stats: {
      interruptsPrevented: 14,
      focusGained: "2h 17m",
      followUps: 7
    },
    audioUrl: "/path/to/audio.mp3",
    transcript: "Good morning! Here's your briefing for Thursday, July 3rd, 2025 from 5:00 AM to 8:00 AM. I've found 7 action items that need your attention and prevented 14 potential interruptions to help you maintain focus. Let me walk you through the most important updates...\n\nFirst, we have several critical emails that came in this morning. Sarah from the marketing team needs your urgent review of the launch materials - they're waiting for your approval by 2 PM today to stay on schedule. This includes the press release, social media assets, and updated landing page copy. I've flagged this as high priority due to the tight deadline and potential to block team progress.\n\nNext, the finance team has submitted the Q4 budget allocations for your approval. While this isn't as time-sensitive as the marketing materials, it's important for quarterly planning and I recommend reviewing it by end of week.\n\nFrom Slack, there's an important discussion in the #product-dev channel. Sarah Johnson raised concerns about the testing phase timeline and is suggesting we might need to extend it by a week to ensure quality. This could impact our overall project timeline, so I'd recommend addressing this in your next team meeting.\n\nI've also processed 47 other messages from across your connected apps - Gmail, Slack, and your calendar. Most of these were routine updates, newsletters, and FYIs that don't require immediate action, but I've included summaries in case you want to review them.\n\nIn terms of meetings, you have your weekly standup at 10 AM today with 4 team members attending. I've prepared talking points based on the recent project discussions and timeline concerns mentioned in Slack.\n\nBy consolidating all of this into this 2-minute brief, I've saved you approximately 25 minutes of reading time and 8 minutes of processing time, for a total of 33 minutes. I've also prevented 14 potential interruptions by batching these updates instead of letting them come in throughout your focused work time.\n\nThat's your brief for this morning. Focus on the marketing materials first, then the budget review, and address the testing timeline concerns with your team. Have a productive day!",
    followUps: [
      {
        id: 1,
        source: "gmail",
        badge: "Critical",
        title: "Review launch materials for marketing team",
        summary: "Marketing team needs approval for press release, social media assets, and landing page copy by 2 PM today.",
        time: "7:45 AM",
        sender: "Sarah Johnson",
        subject: "Urgent: Launch Materials Review Needed",
        originalMessage: "Hi Alex, I hope you're doing well. I wanted to follow up on the launch materials we discussed yesterday. The marketing team needs your review and approval by 2 PM today to stay on track with our product launch timeline. The materials include the press release, social media assets, and the updated landing page copy. Please let me know if you have any questions or need any changes. Thanks!",
        originalLink: "https://mail.google.com/mail/u/0/#inbox/message123",
      },
      {
        id: 2,
        source: "gmail",
        badge: "Approval", 
        title: "Approve Q4 budget allocations for finance team",
        summary: "Finance team requires approval to proceed with quarterly planning.",
        time: "6:30 AM",
        sender: "Finance Team",
        subject: "Q4 Budget Approval Required",
        originalMessage: "Please review and approve the Q4 budget allocations. The finance team needs your approval to proceed with the quarterly planning.",
        originalLink: "https://mail.google.com/mail/u/0/#inbox/message124",
      },
      {
        id: 3,
        source: "slack",
        badge: "Decision",
        title: "Respond to Sarah about testing phase timeline concerns", 
        summary: "Need to discuss potential timeline extension for testing phase to ensure quality.",
        time: "7:15 AM",
        sender: "Sarah Johnson",
        channel: "#product-dev",
        originalMessage: "Hey @channel, I'm concerned about the testing phase timeline. We might need to extend it by a week to ensure quality. Can we discuss this in our next meeting?",
        originalLink: "https://app.slack.com/client/workspace/channel/message456",
      }
    ],
    allMessages: [
      {
        id: 1,
        platform: "Gmail", 
        message: "Performance Improvement",
        sender: "Meta for Business",
        time: "7:04 AM",
        priority: "Medium"
      },
      {
        id: 2,
        platform: "Gmail",
        message: "Upcoming Meeting Overview", 
        sender: "Otter.ai Insights",
        time: "3:45 PM",
        priority: "High"
      },
      {
        id: 3,
        platform: "Slack",
        message: "New feature update discussion",
        sender: "#product-team", 
        time: "6:15 AM",
        priority: "Low"
      },
      {
        id: 4,
        platform: "Gmail",
        message: "Weekly team sync notes",
        sender: "Team Lead",
        time: "5:30 AM", 
        priority: "Medium"
      }
    ]
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Audio Paused" : "Playing Audio Brief",
      description: isPlaying ? "Audio brief paused" : "Starting audio playback"
    });
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Decision": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Approval": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "gmail": return <Mail className="h-4 w-4 text-red-400" />;
      case "slack": return <MessageSquare className="h-4 w-4 text-purple-400" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "gmail": return "📧";
      case "slack": return "💬";
      default: return platform.charAt(0);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-400";
      case "Medium": return "text-orange-400";
      case "Low": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  if (!briefId) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] bg-surface/80 backdrop-blur-xl border-t border-border-subtle flex flex-col">
        <DrawerHeader className="pb-2 flex-shrink-0">
          <DrawerTitle className="text-text-primary text-xl">{briefData.title}</DrawerTitle>
          <DrawerDescription className="text-text-secondary text-sm">
            {briefData.timestamp} • {briefData.timeRange} • {briefData.type}
          </DrawerDescription>
        </DrawerHeader>
        
        {/* Key Stats */}
        <div className="px-4 mb-4 flex-shrink-0">
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-surface-raised/20 rounded-lg p-3 border border-border-subtle">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-green-400" />
                <span className="text-xs text-text-secondary">Time Saved</span>
              </div>
              <div className="text-sm font-medium text-text-primary">{briefData.timeSaved}</div>
            </div>
            <div className="bg-surface-raised/20 rounded-lg p-3 border border-border-subtle">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-blue-400" />
                <span className="text-xs text-text-secondary">Messages</span>
              </div>
              <div className="text-sm font-medium text-text-primary">{briefData.messagesCount} summarized</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-raised/20 rounded-lg p-2 border border-border-subtle text-center">
              <div className="text-sm font-semibold text-text-primary">{briefData.stats.interruptsPrevented}</div>
              <div className="text-xs text-text-secondary">Interrupts Prevented</div>
            </div>
            <div className="bg-surface-raised/20 rounded-lg p-2 border border-border-subtle text-center">
              <div className="text-sm font-semibold text-text-primary">{briefData.stats.focusGained}</div>
              <div className="text-xs text-text-secondary">Focus Gained</div>
            </div>
            <div className="bg-surface-raised/20 rounded-lg p-2 border border-border-subtle text-center">
              <div className="text-sm font-semibold text-text-primary">{briefData.stats.followUps}</div>
              <div className="text-xs text-text-secondary">Follow-ups</div>
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-2 flex-1 overflow-hidden">
          <Tabs defaultValue="transcript" className="w-full h-full flex flex-col">
            <TabsList className="bg-surface-raised/20 border border-border-subtle w-full grid-cols-4 grid">
              <TabsTrigger value="transcript" className="text-xs data-[state=active]:bg-surface-raised/30">
                Transcript
              </TabsTrigger>
              <TabsTrigger value="audio" className="text-xs data-[state=active]:bg-surface-raised/30">
                <Play className="mr-1 h-3 w-3" />
                Audio
              </TabsTrigger>
              <TabsTrigger value="followups" className="text-xs data-[state=active]:bg-surface-raised/30">
                Follow-ups
              </TabsTrigger>
              <TabsTrigger value="messages" className="text-xs data-[state=active]:bg-surface-raised/30">
                All Messages
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-y-auto mt-4">
              <TabsContent value="transcript" className="mt-0">
                <div className="bg-surface-raised/20 rounded-xl p-4 border border-border-subtle">
                  <h3 className="text-sm font-medium text-text-primary mb-3">Brief Transcript</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {briefData.transcript}
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="audio" className="mt-0">
                <div className="bg-surface-raised/20 rounded-xl p-4 border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Button size="sm" variant="secondary" onClick={handlePlayPause}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                      <div>
                        <div className="text-sm font-medium text-text-primary">Audio Brief</div>
                        <div className="text-xs text-text-secondary">{briefData.briefLength}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Simple waveform visualization */}
                  <div className="h-16 bg-surface/60 rounded-lg flex items-end px-2 mb-3">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-accent-primary/60 rounded-sm mx-[1px] transition-all"
                        style={{ height: `${Math.random() * 80 + 10}%` }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>0:00</span>
                    <span>{briefData.briefLength}</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="followups" className="mt-0 space-y-3">
                {briefData.followUps.map((item) => (
                  <div key={item.id} className="bg-surface-raised/20 rounded-xl p-4 border border-border-subtle">
                    <div className="flex items-start gap-3">
                      {getSourceIcon(item.source)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`text-xs px-2 py-0.5 ${getBadgeColor(item.badge)}`}>
                            {item.badge}
                          </Badge>
                          <span className="text-xs text-text-secondary">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-medium text-text-primary mb-1">{item.title}</h4>
                        <p className="text-xs text-text-secondary mb-2">{item.summary}</p>
                        <div className="text-xs text-text-secondary">
                          <strong>From:</strong> {item.sender}
                        </div>
                        {item.originalLink && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 px-2 text-xs mt-2 text-accent-primary hover:text-accent-primary/80"
                            onClick={() => window.open(item.originalLink, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Original
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="messages" className="mt-0 space-y-2">
                {briefData.allMessages.map((message) => (
                  <div key={message.id} className="bg-surface-raised/20 rounded-lg p-3 border border-border-subtle">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getPlatformIcon(message.platform)}</span>
                        <span className="text-xs font-medium text-text-primary">{message.platform}</span>
                        <span className={`text-xs ${getPriorityColor(message.priority)}`}>
                          {message.priority}
                        </span>
                      </div>
                      <span className="text-xs text-text-secondary">{message.time}</span>
                    </div>
                    <div className="text-sm text-text-primary mb-1">{message.message}</div>
                    <div className="text-xs text-text-secondary">{message.sender}</div>
                  </div>
                ))}
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BriefDrawer;