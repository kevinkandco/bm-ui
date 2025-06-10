import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Calendar, Bell, Info, ChevronDown, ChevronRight, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SummaryFeedback from "@/components/dashboard/SummaryFeedback";
import PriorityReasoningModal from "@/components/dashboard/PriorityReasoningModal";

const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedActionItem, setExpandedActionItem] = useState<number | null>(null);
  const [allMessagesOpen, setAllMessagesOpen] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<any>(null);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);

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
      actionItems: 4,
      messagesAnalyzed: 46,
      timeSaved: "Minutes",
      tasksFound: 8
    },
    audioUrl: "/path/to/audio.mp3",
    audioDuration: "3:00"
  };

  const actionItems = [
    {
      id: 1,
      source: "gmail",
      priority: "high",
      title: "Review launch materials for marketing team",
      subtitle: "(Due: 2 PM today)",
      time: "7:45 AM",
      sender: "Sarah Johnson",
      subject: "Urgent: Launch Materials Review Needed",
      originalMessage: "Hi Alex, I hope you're doing well. I wanted to follow up on the launch materials we discussed yesterday. The marketing team needs your review and approval by 2 PM today to stay on track with our product launch timeline. The materials include the press release, social media assets, and the updated landing page copy. Please let me know if you have any questions or need any changes. Thanks!",
      justification: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
      originalLink: "https://mail.google.com/mail/u/0/#inbox/message123",
      relevancy: "Critical - blocking marketing team progress",
      triggerPhrase: "needs your review and approval by 2 PM today",
      ruleHit: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
      priorityLogic: "Ranked as High priority due to same-day deadline (2 PM today) and potential to block team progress if delayed.",
      confidence: "High",
      messageId: "msg_123"
    },
    {
      id: 2,
      source: "gmail", 
      priority: "medium",
      title: "Approve Q4 budget allocations for finance team",
      subtitle: "",
      time: "6:30 AM",
      sender: "Finance Team <finance@company.com>",
      subject: "Q4 Budget Approval Required",
      originalMessage: "Please review and approve the Q4 budget allocations. The finance team needs your approval to proceed with the quarterly planning.",
      justification: "Requires approval action from the recipient and involves budget decisions that impact quarterly planning.",
      originalLink: "https://mail.google.com/mail/u/0/#inbox/message124",
      relevancy: "Important - quarterly planning dependency",
      triggerPhrase: "review and approve",
      ruleHit: "Contains approval request with business impact",
      priorityLogic: "Medium priority due to quarterly timeline and business planning impact.",
      confidence: "Medium",
      messageId: "msg_124"
    },
    {
      id: 3,
      source: "slack",
      priority: "high", 
      title: "Respond to Sarah about testing phase timeline concerns",
      subtitle: "",
      time: "7:15 AM",
      sender: "Sarah Johnson",
      channel: "#product-dev",
      originalMessage: "Hey @channel, I'm concerned about the testing phase timeline. We might need to extend it by a week to ensure quality. Can we discuss this in our next meeting?",
      justification: "Direct mention requiring response about timeline concerns that could impact project delivery.",
      originalLink: "https://app.slack.com/client/workspace/channel/message456",
      relevancy: "Critical - project timeline impact",
      triggerPhrase: "Can we discuss this",
      ruleHit: "Direct mention with discussion request about project concerns",
      priorityLogic: "High priority due to potential project timeline impact and quality concerns.",
      confidence: "High",
      messageId: "msg_456"
    },
    {
      id: 4,
      source: "slack",
      priority: "low",
      title: "Schedule follow-up meeting with product team for next week",
      subtitle: "",
      time: "5:30 AM",
      sender: "Product Team",
      channel: "#general",
      originalMessage: "We should schedule a follow-up meeting to discuss the roadmap updates. Next week would work well for most of the team.",
      justification: "Scheduling request that requires coordination but is not time-sensitive.",
      originalLink: "https://app.slack.com/client/workspace/channel/message789",
      relevancy: "Low - scheduling coordination",
      triggerPhrase: "should schedule",
      ruleHit: "Contains scheduling request without urgency",
      priorityLogic: "Low priority due to flexible timeline and routine coordination.",
      confidence: "Medium",
      messageId: "msg_789"
    }
  ];

  const recentMessages = [
    {
      id: 1,
      platform: "Gmail",
      message: "Performance Improvement",
      sender: "Meta for Business <update@global.metamail.com>",
      time: "7:04 AM",
      priority: "Medium"
    },
    {
      id: 2,
      platform: "Gmail",
      message: "Upcoming Meeting Overview",
      sender: "Otter.ai Insights <no-reply@otter.ai>",
      time: "3:45 PM",
      priority: "High"
    },
    {
      id: 3,
      platform: "Gmail",
      message: "New Property Listing",
      sender: "Redfin <redmail@redfin.com>",
      time: "5:35 PM",
      priority: "Medium"
    },
    {
      id: 4,
      platform: "Gmail",
      message: "Product Demo",
      sender: "Atomic Thoughts <techtwitter@substack.com>",
      time: "6:33 PM",
      priority: "Low"
    },
    {
      id: 5,
      platform: "Gmail",
      message: "Business for Sale",
      sender: "newbizopps@bizbuysell.com",
      time: "7:44 PM",
      priority: "High"
    }
  ];

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

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

  const toggleActionItem = (itemId: number) => {
    setExpandedActionItem(expandedActionItem === itemId ? null : itemId);
  };

  const handleInfoClick = (item: any) => {
    setSelectedActionItem(item);
    setPriorityModalOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Medium": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "medium": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Low": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      case "low": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
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
      case "gmail": return "G";
      default: return platform.charAt(0);
    }
  };

  return (
    <DashboardLayout 
      currentPage="briefs" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="min-h-screen bg-surface px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/dashboard')}
                className="cursor-pointer hover:text-accent-primary"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate('/dashboard/briefs')}
                className="cursor-pointer hover:text-accent-primary"
              >
                Briefs
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{briefData.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="h-6 w-6 text-accent-primary flex-shrink-0" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{briefData.title}</h1>
              <p className="text-sm text-text-secondary">{briefData.timestamp}</p>
            </div>
          </div>
          <p className="text-sm text-text-secondary">Range: {briefData.timeRange}</p>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Stats Row */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <div className="flex flex-wrap gap-4 md:gap-6 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-accent-primary" />
                <span className="font-semibold text-text-primary text-sm md:text-base">{briefData.stats.slackMessages.total} Slack Messages</span>
                <Badge variant="secondary" className="text-xs">{briefData.stats.slackMessages.priority} priority</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent-primary" />
                <span className="font-semibold text-text-primary text-sm md:text-base">{briefData.stats.emails.total} Emails</span>
                <Badge variant="secondary" className="text-xs">{briefData.stats.emails.priority} priority</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-accent-primary" />
                <span className="font-semibold text-text-primary text-sm md:text-base">{briefData.stats.actionItems} Action Items</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time saved: {briefData.timeSaved}</span>
            </div>
          </div>

          {/* Audio Brief Section */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Audio Brief</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-text-primary">{briefData.stats.messagesAnalyzed}</div>
                <div className="text-sm text-text-secondary">Messages Analyzed</div>
                <div className="text-xs text-text-secondary mt-1">Emails, Threads, Messages</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-text-primary">{briefData.stats.timeSaved}</div>
                <div className="text-sm text-text-secondary">Estimated Time Saved</div>
                <div className="text-xs text-text-secondary mt-1">T M S</div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-text-primary">{briefData.stats.tasksFound}</div>
                <div className="text-sm text-text-secondary">Tasks Found</div>
                <div className="text-xs text-text-secondary mt-1">Detected and Saved</div>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              {/* Waveform */}
              <div className="h-32 bg-surface/60 rounded-lg flex items-end px-6 mb-4 relative overflow-hidden">
                <div className="flex items-end gap-[2px] h-full w-full">
                  {Array.from({ length: 120 }).map((_, i) => {
                    const height = Math.random();
                    const isActive = i < 30; // Simulate progress
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-sm transition-all duration-200 ${
                          isActive 
                            ? 'bg-accent-primary' 
                            : 'bg-text-secondary/40'
                        }`}
                        style={{ 
                          height: `${Math.max(8, height * 80)}%`,
                          minHeight: '4px'
                        }}
                      />
                    );
                  })}
                </div>
                
                {/* Progress indicator */}
                <div className="absolute left-6 top-0 bottom-0 w-[25%] pointer-events-none">
                  <div className="h-full w-px bg-accent-primary/60 ml-auto" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">0:45</span>
                
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="primary"
                    size="icon"
                    onClick={handlePlayPause}
                    className="h-16 w-16 rounded-full"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
                  </Button>
                  
                  <Button variant="ghost" size="icon" className="h-12 w-12">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                <span className="text-sm text-text-secondary">{briefData.audioDuration}</span>
              </div>
            </div>
          </div>

          {/* Action Items Section */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Action Items</h2>
            
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-text-secondary px-1">Source</TableHead>
                  <TableHead className="text-text-secondary px-1">Priority</TableHead>
                  <TableHead className="text-text-secondary px-1">Action Item</TableHead>
                  <TableHead className="text-text-secondary px-1">Time</TableHead>
                  <TableHead className="text-text-secondary px-1">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <TableRow 
                      className="border-white/10 hover:bg-white/5 cursor-pointer"
                      onClick={() => toggleActionItem(item.id)}
                    >
                      <TableCell className="px-1">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 p-0"
                          >
                            {expandedActionItem === item.id ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronRight className="h-3 w-3" />
                            )}
                          </Button>
                          {getSourceIcon(item.source)}
                        </div>
                      </TableCell>
                      <TableCell className="px-1">
                        <Badge className={`text-xs border ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-1">
                        <div className="text-sm text-text-primary font-medium">
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-xs text-text-secondary">
                            {item.subtitle}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-1">
                        <span className="text-sm text-text-secondary">{item.time}</span>
                      </TableCell>
                      <TableCell className="px-1">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleActionClick("Add to Asana", item);
                            }}
                            className="text-xs px-2 py-1 h-auto"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Add to Asana
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs px-2 py-1 h-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInfoClick(item);
                            }}
                          >
                            <Info className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Details */}
                    {expandedActionItem === item.id && (
                      <TableRow className="border-white/10">
                        <TableCell colSpan={5} className="px-1">
                          <div className="bg-white/5 rounded-lg p-4 space-y-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-text-primary mb-1">From: {item.sender}</div>
                                {item.subject && (
                                  <div className="text-sm font-medium text-text-primary mb-1">Subject: {item.subject}</div>
                                )}
                                {item.channel && (
                                  <div className="text-sm font-medium text-text-primary mb-1">Channel: {item.channel}</div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(item.originalLink, '_blank')}
                                className="text-xs flex items-center gap-1"
                              >
                                <Mail className="h-3 w-3" />
                                Open in {item.source === 'slack' ? 'Slack' : 'Gmail'}
                              </Button>
                            </div>
                            
                            <div>
                              <div className="text-sm font-medium text-text-primary mb-2">Full Message:</div>
                              <div className="text-sm text-text-secondary bg-white/5 rounded p-3 border border-white/10">
                                {item.originalMessage}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium text-text-primary mb-1">Relevancy:</div>
                                <div className="text-sm text-text-secondary">{item.relevancy}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-text-primary mb-1">Why this is an action item:</div>
                                <div className="text-sm text-text-secondary">{item.justification}</div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* All Messages & Items Section */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <Collapsible open={allMessagesOpen} onOpenChange={setAllMessagesOpen}>
              <div className="flex items-center justify-between mb-4">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto">
                    <h2 className="text-lg font-semibold text-text-primary">All Messages & Items</h2>
                    {allMessagesOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              <CollapsibleContent className="space-y-1">
                <div className="text-lg font-semibold text-text-primary mb-4">Recent Messages</div>
                
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-text-secondary">Platform</TableHead>
                      <TableHead className="text-text-secondary">Message</TableHead>
                      <TableHead className="text-text-secondary">Sender</TableHead>
                      <TableHead className="text-text-secondary">Time</TableHead>
                      <TableHead className="text-text-secondary">Priority</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMessages.map((message) => (
                      <TableRow key={message.id} className="border-white/10 hover:bg-white/5">
                        <TableCell>
                          <div className="flex items-center justify-center w-8 h-8 rounded bg-white/10 text-sm font-medium">
                            {getPlatformIcon(message.platform)}
                          </div>
                        </TableCell>
                        <TableCell className="text-text-primary">{message.message}</TableCell>
                        <TableCell className="text-text-secondary">{message.sender}</TableCell>
                        <TableCell className="text-text-secondary">{message.time}</TableCell>
                        <TableCell>
                          <Badge className={`text-xs border ${getPriorityColor(message.priority)}`}>
                            {message.priority}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Add What's Missing Section */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <Button variant="outline" className="w-full" size="lg">
              <span className="mr-2">+</span>
              Add what's missing
            </Button>
          </div>

          {/* Feedback Section */}
          <div className="glass-card rounded-2xl p-4 md:p-6">
            <SummaryFeedback 
              briefId={briefData.id || "1"} 
              onFeedback={handleFeedback}
              showTooltip={true}
            />
          </div>
        </div>

        {/* Priority Reasoning Modal */}
        {selectedActionItem && (
          <PriorityReasoningModal
            open={priorityModalOpen}
            onClose={() => {
              setPriorityModalOpen(false);
              setSelectedActionItem(null);
            }}
            actionItem={{
              id: selectedActionItem.messageId,
              text: selectedActionItem.title,
              source: selectedActionItem.source,
              priority: selectedActionItem.priority,
              messageId: selectedActionItem.messageId,
              reasoning: selectedActionItem.justification,
              fullMessage: selectedActionItem.originalMessage,
              time: selectedActionItem.time,
              sender: selectedActionItem.sender,
              subject: selectedActionItem.subject,
              channel: selectedActionItem.channel,
              relevancy: selectedActionItem.relevancy,
              triggerPhrase: selectedActionItem.triggerPhrase,
              ruleHit: selectedActionItem.ruleHit,
              priorityLogic: selectedActionItem.priorityLogic,
              confidence: selectedActionItem.confidence
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default BriefDetail;
