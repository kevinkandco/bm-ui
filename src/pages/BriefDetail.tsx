
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Calendar, Bell, Info } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SummaryFeedback from "@/components/dashboard/SummaryFeedback";

const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 md:p-6 space-y-6">
            {/* Stats Row */}
            <div>
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

            <Separator className="bg-border-subtle" />

            {/* Audio Brief Section */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">Audio Brief</h2>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between mb-3">
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
                <div className="h-12 bg-white/5 rounded flex items-center px-4">
                  <div className="flex items-center gap-1 h-full">
                    {Array.from({ length: 40 }).map((_, i) => (
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

            <Separator className="bg-border-subtle" />

            {/* Action Items Section */}
            <div>
              <h2 className="text-lg font-semibold text-text-primary mb-4">Action Items</h2>
              
              {/* Mobile-first action items */}
              <div className="space-y-4">
                {actionItems.map((item, index) => (
                  <div key={item.id} className="group">
                    <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
                      {/* Mobile Layout */}
                      <div className="block md:hidden space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button className="p-1 hover:bg-white/10 rounded">
                              <ExternalLink className="h-3 w-3 text-text-secondary" />
                            </button>
                            {getSourceIcon(item.source)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 mb-2">
                              <Badge className={`text-xs border ${getPriorityColor(item.priority)} flex-shrink-0`}>
                                {item.priority}
                              </Badge>
                              <span className="text-xs text-text-secondary">{item.time}</span>
                            </div>
                            <div className="text-sm text-text-primary font-medium mb-1">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-xs text-text-secondary mb-2">
                                {item.subtitle}
                              </div>
                            )}
                            <div className="flex flex-wrap gap-1">
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
                                  {action}
                                </Button>
                              ))}
                              <Button variant="ghost" size="sm" className="text-xs px-2 py-1 h-auto">
                                <Info className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop Layout */}
                      <div className="hidden md:grid md:grid-cols-12 md:gap-4 md:items-center">
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-white/10 rounded">
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
                    </div>
                    {index < actionItems.length - 1 && <Separator className="bg-border-subtle" />}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-border-subtle" />

            {/* All Messages & Items Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary">All Messages & Items</h2>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-text-secondary text-sm">Detailed message list would appear here...</p>
              </div>
            </div>

            <Separator className="bg-border-subtle" />

            {/* Add What's Missing Section */}
            <div>
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
      </div>
    </DashboardLayout>
  );
};

export default BriefDetail;
