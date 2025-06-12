
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Calendar, Bell, Info, ChevronDown, ChevronRight, SkipBack, SkipForward, Download, BarChart3, AlertCircle, CheckCircle, Users } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SummaryFeedback from "@/components/dashboard/SummaryFeedback";
import PriorityReasoningModal from "@/components/dashboard/PriorityReasoningModal";
import { useApi } from "@/hooks/useApi";
import { Summary, SummaryMassage } from "@/components/dashboard/types";
import Audio from "@/components/dashboard/Audio";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import TranscriptView from "@/components/dashboard/TranscriptView";
import { transformToStats } from "@/lib/utils";

const BaseURL = import.meta.env.VITE_API_HOST;

const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { call } = useApi();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedActionItem, setExpandedActionItem] = useState<number | null>(null);
  // const [allMessagesOpen, setAllMessagesOpen] = useState(false);
  const [selectedActionItem, setSelectedActionItem] = useState<any>(null);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [briefData, setBriefData] = useState<Summary | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<'up' | 'down' | null>(null);
  const [actionItems, setActionItems] = useState<SummaryMassage[]>([]);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handlePlayPause,
    formatDuration,
    barRef,
    handlePause,
    handleSeekStart,
    handleSeekEnd,
    handleSeekMove,
  } = useAudioPlayer(
    briefData?.audioPath ? BaseURL + briefData?.audioPath : null,
    false
  );

    const getBriefData = useCallback(async (): Promise<void> => {
    setLoading(true);

    const response = await call("get", `/api/summary/${briefId}/show`, {
      showToast: true,
      toastTitle: "Failed to fetch brief",
      toastDescription: "Could not retrieve brief data.",
      returnOnFailure: false,
    });

    if (response) {
      const stats = transformToStats(response?.data);
      setBriefData({...response?.data, stats});
      setActionItems(response?.data?.messages?.map((item: SummaryMassage, index: number) => ({...item, id: index})));
      setSelectedFeedback(response?.data?.vote ? response?.data?.vote === "like" ? "up" : "down" : null);
    }
    setLoading(false);
  }, [call, briefId]);

  const statsConfig = [
    {
      icon: BarChart3,
      label: "Total Messages Analyzed",
      value: briefData?.stats?.totalMessagesAnalyzed?.total,
      breakdown: briefData?.stats?.totalMessagesAnalyzed?.breakdown,
      color: "text-blue-400"
    },
    {
      icon: CheckCircle,
      label: "Low Priority",
      value: briefData?.stats?.lowPriority?.total,
      breakdown: briefData?.stats?.lowPriority?.breakdown,
      color: "text-gray-400"
    },
    {
      icon: AlertCircle,
      label: "Medium Priority",
      value: briefData?.stats?.mediumPriority?.total,
      breakdown: briefData?.stats?.mediumPriority?.breakdown,
      color: "text-orange-400"
    },
    {
      icon: AlertCircle,
      label: "High Priority",
      value: briefData?.stats?.highPriority?.total,
      breakdown: briefData?.stats?.highPriority?.breakdown,
      color: "text-red-400"
    },
    {
      icon: CheckSquare,
      label: "Action Items",
      value: briefData?.stats?.actionItems?.total,
      breakdown: briefData?.stats?.actionItems?.breakdown,
      color: "text-accent-primary"
    }
  ];

  const playbackSpeeds = [1, 1.1, 1.2, 1.5, 2, 3];

  useEffect(() => {
    if (briefId) {
      getBriefData();
    }

    return () => {

      setBriefData(null);
    };
  }, [briefId, getBriefData]);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handlePlayStopBrief = useCallback(
      () => {
        if (!briefData?.audioPath) {
          toast({
            title: "Audio not found",
            description: `Audio not found, please try again`,
            variant: "destructive",
          })
          return;
        }
        handlePlayPause();
      },
      [toast, handlePlayPause, briefData?.audioPath]
    );

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

  const handleDownload = async () => {
    const downloadUrl = `${BaseURL}/api/summary/${briefData.id}/download-audio`;

    try {
      const response = await fetch(downloadUrl, {
        method: "GET",
        headers: {
          "authorization": `Bearer ${localStorage.getItem("token")}`,
          'ngrok-skip-browser-warning': 'true'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from server:", errorText.slice(0, 200));
        toast({
          title: "Download failed",
          description: "Download failed: file not found or server error",
          variant: "destructive",
        })
        return;
      }

      const contentType = response.headers.get("Content-Type");
      if (!contentType?.startsWith("audio/")) {
        const text = await response.text();
        console.error("Expected audio, got:", text.slice(0, 200));
        toast({
          title: "Download failed",
          description: "Download failed: invalid file type received",
          variant: "destructive",
        })
        return;
      }

      // If all checks pass, download the file
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "audio.mp3");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed due to error:", error);
      alert("Download failed. Check your internet connection or try again.");
    }
  };
  
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
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
      case "G": return <Mail className="h-4 w-4 text-red-400" />;
      case "S": return <MessageSquare className="h-4 w-4 text-purple-400" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "gmail": return "G";
      default: return platform.charAt(0);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const timeRange =
    briefData?.start_at && briefData?.ended_at
      ? `Range: ${briefData?.start_at} - ${briefData?.ended_at}`
      : "";

  return (
    <TooltipProvider>
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
                <BreadcrumbPage>{briefData?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckSquare className="h-6 w-6 text-accent-primary flex-shrink-0" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{briefData?.title}</h1>
                <p className="text-sm text-text-secondary">{briefData?.timestamp}</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary">{timeRange}</p>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Section */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              {/* Time Saved Banner */}
              <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20 mb-4">
                <Clock className="h-4 w-4" />
                <span>Time saved: {briefData?.savedTime}</span>
              </div>

              {/* Horizontal Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {statsConfig.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-surface-raised/30 cursor-pointer hover:bg-surface-raised/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <IconComponent className={`h-4 w-4 ${stat.color} flex-shrink-0`} />
                            <div>
                              <div className="text-lg font-semibold text-text-primary">
                                {stat.value}
                              </div>
                              <div className="text-xs text-text-secondary">
                                {stat.label}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-surface-raised border border-white/20">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-text-primary">{stat.label}</div>
                          <div className="space-y-1">
                            {stat?.breakdown && Object?.entries(stat?.breakdown)?.map(([platform, count]) => (
                              <div key={platform} className="flex justify-between text-xs">
                                <span className="text-text-secondary capitalize">{platform}:</span>
                                <span className="text-text-primary font-medium">{count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Audio Brief Section */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Audio Brief</h2>
              
              {/* Audio Player */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                {/* Waveform */}
                <div {...(briefData?.audioPath ? {
                ref: barRef,
                onMouseDown: handleSeekStart,
                onMouseMove: handleSeekMove,
                onMouseUp: handleSeekEnd,
                onTouchStart: handleSeekStart,
                onTouchMove: handleSeekMove,
                onTouchEnd: handleSeekEnd,
              } : {})}
              className="relative mb-6 h-16 bg-gradient-to-r from-transparent via-primary-teal/20 to-transparent rounded-lg flex items-center justify-center overflow-hidden">
                {/* Simple waveform representation */}
                <div className="flex items-center gap-1 h-full w-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 bg-gradient-to-t ${
                        i < (progress / 100) * 100 
                          ? 'from-primary-teal to-primary-teal/50' 
                          : 'from-gray-600 to-gray-700'
                      }`}
                      style={{
                        height: `${Math.random() * 40 + 20}%`,
                      }}
                    />
                  ))}
                </div>
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  style={{ left: `${progress}%` }}
                />
                <Audio
                  audioSrc={
                    briefData?.audioPath ? BaseURL + briefData?.audioPath : null
                  }
                  audioRef={audioRef}
                />
                {/* Current position marker */}
              </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">{formatDuration(currentTime)}</span>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="primary"
                      size="icon"
                      onClick={handlePlayPause}
                      className="h-12 w-12 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                    </Button>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="px-2 py-1 text-xs rounded bg-white/10 text-white-text hover:bg-white/20 transition-colors">
                          {playbackSpeed}x
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-surface-raised border border-white/20">
                        {playbackSpeeds.map((speed) => (
                          <DropdownMenuItem
                            key={speed}
                            onClick={() => handleSpeedChange(speed)}
                            className="text-white-text hover:bg-white/10 cursor-pointer"
                          >
                            {speed}x
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <span className="text-sm text-text-secondary">{formatDuration(duration)}</span>
                  </div>
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
                            {getSourceIcon(item.platform)}
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
                          {/* {item?.subtitle && (
                            <div className="text-xs text-text-secondary">
                              {item?.subtitle}
                            </div>
                          )} */}
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
                                  {item.title && (
                                    <div className="text-sm font-medium text-text-primary mb-1">Subject: {item.title}</div>
                                  )}
                                  {item.channel && (
                                    <div className="text-sm font-medium text-text-primary mb-1">Channel: {item.channel}</div>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(item.redirectLink, '_blank')}
                                  className="text-xs flex items-center gap-1"
                                >
                                  <Mail className="h-3 w-3" />
                                  Open in {item.platform === 'S' ? 'Slack' : 'Gmail'}
                                </Button>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-text-primary mb-2">Full Message:</div>
                                <div className="text-sm text-text-secondary bg-white/5 rounded p-3 border border-white/10">
                                  {item.message}
                                </div>
                              </div>

                              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm font-medium text-text-primary mb-1">Relevancy:</div>
                                  <div className="text-sm text-text-secondary">{item.relevancy}</div>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-text-primary mb-1">Why this is an action item:</div>
                                  <div className="text-sm text-text-secondary">{item.justification}</div>
                                </div>
                              </div> */}
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
            {/* <div className="glass-card rounded-2xl p-4 md:p-6">
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
            </div> */}

            {/* Add What's Missing Section */}
            {/* <div className="glass-card rounded-2xl p-4 md:p-6">
              <Button variant="outline" className="w-full" size="lg">
                <span className="mr-2">+</span>
                Add what's missing
              </Button>
            </div> */}

            {/* Feedback Section */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <SummaryFeedback 
                briefId={briefData?.id || 1} 
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
      <TranscriptView 
        open={transcriptOpen}
        onClose={() => setTranscriptOpen(false)}
        briefId={briefData?.id}
        transcript={briefData?.summary}
        title={briefData?.title}
      />
    </TooltipProvider>
  );
};

export default BriefDetail;
