
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Play, Pause, MessageSquare, Mail, CheckSquare, Clock, ExternalLink, Calendar, Bell, Info, ChevronDown, ChevronRight, SkipBack, SkipForward, Download, BarChart3, AlertCircle, CheckCircle, Users, Share, Slack } from "lucide-react";
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
import { capitalizeFirstLetter, transformToStats } from "@/lib/utils";
import ActionItemFeedback from "@/components/dashboard/ActionItemFeedback";
import ActionItemControls from "@/components/dashboard/ActionItemControls";
import { useFeedbackTracking } from "@/components/dashboard/useFeedbackTracking";
import { AUDIO_URL } from "@/config";
import { BaseURL } from "@/config";
import { title } from "process";


const BriefDetail = () => {
  const { briefId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { call } = useApi();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedActionItem, setExpandedActionItem] = useState<number | null>(null);
  const [allMessagesOpen, setAllMessagesOpen] = useState(false);
  const [messages, setMessages] = useState<SummaryMassage[]>([]);
  const [selectedActionItem, setSelectedActionItem] = useState<any>(null);
  const [priorityModalOpen, setPriorityModalOpen] = useState(false);
  const [briefData, setBriefData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<'up' | 'down' | null>(null);
  const [followUps, setFollowUps] = useState<SummaryMassage[]>([]);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const { handleActionRelevance } = useFeedbackTracking();
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
    playbackRate,
    updatePlaybackRate
  } = useAudioPlayer(
    briefData?.audioPath ? AUDIO_URL + briefData?.audioPath : null,
    false
  );


    const getBriefData = useCallback(async (): Promise<void> => {
    setLoading(true);

    const response = await call("get", `/summary/${briefId}/show`, {
      showToast: true,
      toastTitle: "Failed to fetch brief",
      toastDescription: "Could not retrieve brief data.",
      returnOnFailure: false,
    });

    if (response) {
    //   const stats = transformToStats(response?.data);
      setBriefData({...response?.data, 
        //stats
    });
      setFollowUps(response?.data?.follow_ups);
      setMessages(response?.data?.all_messages);
      setSelectedFeedback(response?.data?.vote ? response?.data?.vote === "like" ? "up" : "down" : null);
    }
    setLoading(false);
  }, [call, briefId]);

  // const statsConfig = [
  //   {
  //     icon: BarChart3,
  //     label: "Total Messages Analyzed",
  //     value: briefData?.stats?.totalMessagesAnalyzed?.total,
  //     breakdown: briefData?.stats?.totalMessagesAnalyzed?.breakdown,
  //     color: "text-blue-400"
  //   },
  //   {
  //     icon: CheckCircle,
  //     label: "Low Priority",
  //     value: briefData?.stats?.lowPriority?.total,
  //     breakdown: briefData?.stats?.lowPriority?.breakdown,
  //     color: "text-gray-400"
  //   },
  //   {
  //     icon: AlertCircle,
  //     label: "Medium Priority",
  //     value: briefData?.stats?.mediumPriority?.total,
  //     breakdown: briefData?.stats?.mediumPriority?.breakdown,
  //     color: "text-orange-400"
  //   },
  //   {
  //     icon: AlertCircle,
  //     label: "High Priority",
  //     value: briefData?.stats?.highPriority?.total,
  //     breakdown: briefData?.stats?.highPriority?.breakdown,
  //     color: "text-red-400"
  //   },
  //   {
  //     icon: CheckSquare,
  //     label: "Action Items",
  //     value: briefData?.stats?.actionItems?.total,
  //     breakdown: briefData?.stats?.actionItems?.breakdown,
  //           color: "text-accent-primary"
  //   }
  // ];

  // Mock data - in a real app this would be fetched based on briefId

  const statsConfig = [
    {
      icon: AlertCircle,
      label: "Interrupts Prevented",
    //   value: briefData?.stats?.interruptsPrevented || 14,
      value: 14,
      color: "text-blue-400"
    },
    {
      icon: Clock,
      label: "Focus Gained", 
    //   value: briefData?.stats?.focusGained || 45,
      value: 45,
      color: "text-green-400"
    },
    {
      icon: CheckSquare,
      label: "Follow-ups",
    //   value: briefData?.stats?.followUps || 5,
      value: 5,
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

  const handleActionClick = async (action: string, item: SummaryMassage) => {

    const response = await call("post", `/tasks/asana`, {
      body: {
        title: item?.title,
        notes: item?.message,
      },
      showToast: true,
      toastTitle: "Action Failed",
      toastDescription: `Failed to apply action "${action}" to: ${item.title}`,
      returnOnFailure: false,

    });

    if (!response) return;


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

  const toggleActionItem = (itemId: number | string) => {
    setExpandedActionItem(expandedActionItem === itemId ? null : itemId);
  };

  const handleInfoClick = (item: SummaryMassage) => {
    setSelectedActionItem(item);
    setPriorityModalOpen(true);
  };

  const handleDownload = async () => {
    const downloadUrl = `${AUDIO_URL}/summary/${briefData.id}/download-audio`;

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
    updatePlaybackRate(speed);
  };

  const handleActionItemFeedback = async (itemId: string, relevant: boolean, feedback?: string) => {
    await handleActionRelevance(briefData.id, itemId, relevant, feedback);
    toast({
      title: relevant ? "Preference Saved" : "Training AI",
      description: feedback 
        ? `AI will learn: "${feedback.slice(0, 50)}${feedback.length > 50 ? '...' : ''}"` 
        : relevant 
          ? "Thank you for confirming this action item is relevant" 
          : "AI will learn from this feedback to improve future briefs"
    });
  };

  const handleActionItemThumbsUp = (itemId: string) => {
    toast({
      title: "Action Item Marked Helpful",
      description: "Thank you for the feedback!"
    });
  };

  const handleActionItemSnooze = (itemId: string, reason: any, feedback?: string) => {
    toast({
      title: "Action Item Snoozed",
      description: "This item has been snoozed forever"
    });
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Decision": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Approval": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Heads-Up": return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getBadgeEmoji = (badge: string) => {
    switch (badge) {
      case "Critical": return "🔴";
      case "Decision": return "🔵";
      case "Approval": return "🟠";
      case "Heads-Up": return "⚫";
      default: return "⚫";
    }
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
    console.log(source);
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

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const timeRange =
    briefData?.start_at && briefData?.ended_at
      ? `Range: ${briefData?.start_at} - ${briefData?.ended_at}`
      : "";

    const handleTranscriptOpen = () => {
      if (!briefData?.summary) {
        toast({
          title: "Transcript Not found",
          description: "Transcript not found. Please try again",
          variant: "destructive",
      });
      return;
      }
      setTranscriptOpen(true)
    }

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
                <p className="text-sm text-text-secondary">Here's your briefing for {briefData?.delivery_at} from {briefData?.start_at} - {briefData?.ended_at} :</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Stats Section */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              {/* Time Saved Banner */}
              {briefData?.savedTime?.total_saved_minutes && <div className="flex items-center gap-2 text-sm text-green-400 bg-green-400/10 rounded-lg px-3 py-2 border border-green-400/20 mb-4">
                <Clock className="h-4 w-4" />
                <span>Time saved: ~{Math.round(briefData?.savedTime?.breakdown?.context_saved + briefData?.savedTime?.breakdown?.reading_saved)}min reading + {Math.round(briefData?.savedTime?.breakdown?.processing_saved)}min processing = {Math.round(briefData?.savedTime?.total_saved_minutes)}min total</span>
              </div>}

              {/* Horizontal Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {statsConfig.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-surface-raised/30">
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
                    briefData?.audioPath ? AUDIO_URL + briefData?.audioPath : null
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
                          {playbackRate}x
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
                
                {/* Subscribe to podcast link */}
                <div className="mt-3 text-center">
                  <a 
                    href="#" 
                    className="text-sm text-accent-primary hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        title: "RSS Feed",
                        description: "Subscribe to your brief podcast feature coming soon!"
                      });
                    }}
                  >
                    Subscribe to your brief podcast
                  </a>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleDownload} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button onClick={handleTranscriptOpen} variant="outline" size="sm" className="border-gray-600 text-primary-teal hover:text-primary-teal/80 ml-auto">
                      View Transcript
                    </Button>
                  </div>
              </div>
            </div>

            {/* Follow-ups Section with Feedback */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4">Follow-ups</h2>
              
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-text-secondary px-1">Badge</TableHead>
                    <TableHead className="text-text-secondary px-1">Title + Summary</TableHead>
                    <TableHead className="text-text-secondary px-1">Action Menu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUps.map((item) => (
                    <React.Fragment key={item.id}>
                      <TableRow 
                        className="border-white/10 hover:bg-white/5 cursor-pointer group"
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
                            {item.tag && <Badge className={`text-xs border ${getBadgeColor(capitalizeFirstLetter(item.tag))} flex items-center gap-1`}>
                              <span>{getBadgeEmoji(capitalizeFirstLetter(item.tag))}</span>
                              {capitalizeFirstLetter(item.tag)}
                            </Badge>}
                            {item.priority && <Badge className={`text-xs border ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                            </Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="px-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-text-primary font-medium">
                                {item.title}
                              </div>
                              {/* <div className="text-xs text-text-secondary mt-1">
                                {item.message}
                              </div> */}
                            </div>

                              {/* <div className="flex items-center gap-2">
                              <ActionItemControls
                                itemId={item?.messageId}
                                itemTitle={item.title}
                                sender={item.sender}
                                onThumbsUp={handleActionItemThumbsUp}
                                onSnooze={handleActionItemSnooze}
                                size="sm"
                              />
                              <ActionItemFeedback 
                              itemId={item.messageId} 
                              onRelevanceFeedback={handleActionItemFeedback}
                              /> 
                            </div> */}
                          </div>
                        </TableCell>
                        <TableCell className="px-1">
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                const channelName = item.platform === 'slack' ? 'Slack' : item.platform === 'gmail' ? 'Email' : 'Asana';
                                // handleActionClick(`Open in ${channelName}`, item);
                                handleActionClick(`Open in asana`, item);
                              }}
                              className="text-xs px-2 py-1 h-auto"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              Add to asana
                              {/* {item.platform === 'slack' ? 'Slack' : item.platform === 'gmail' ? 'Email' : 'Asana'} */}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(item.redirectLink, '_blank')
                              }}
                              className="text-xs px-2 py-1 h-auto ml-2"
                            >
                              {item.platform === 'slack' ? <Slack className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                              open in {item.platform === 'slack' ? 'Slack' : item.platform === 'gmail' ? 'Email' : 'Slack'}
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
                                   {item.platform === 'slack' ? <Slack className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                                   Open in {item.platform === 'slack' ? 'Slack' : item.platform === 'gmail' ? 'Email' : 'Channel'}
                                 </Button>
                              </div>
                              
                              <div>
                                <div className="text-sm font-medium text-text-primary mb-2">Full Message:</div>
                                <div className="text-sm text-text-secondary bg-white/5 rounded p-3 border border-white/10">
                                  {item?.message}
                                </div>
                              </div>

                              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <div className="text-sm font-medium text-text-primary mb-1">Relevancy:</div>
                                  <div className="text-sm text-text-secondary">{item.relevancy}</div>
                                </div>
                                 <div>
                                   <div className="text-sm font-medium text-text-primary mb-1">Why this is a follow-up:</div>
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
                      {messages?.map((message) => (
                        <TableRow key={message.id} className="border-white/10 hover:bg-white/5">
                          <TableCell>
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-white/10 text-sm font-medium">
                              {getPlatformIcon(message.platform)}
                            </div>
                          </TableCell>
                          <TableCell className="text-text-primary break-all">{message.message}</TableCell>
                          <TableCell className="text-text-secondary break-all">{message.sender}</TableCell>
                          <TableCell className="text-text-secondary break-all">{message.time}</TableCell>
                          <TableCell>
                            <Badge className={`text-xs border capitalize ${getBadgeColor(message.priority)}`}>
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
                selectedFeedback={selectedFeedback}
                setSelectedFeedback={setSelectedFeedback}
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
                id: selectedActionItem?.id,
                text: selectedActionItem?.title,
                source: selectedActionItem?.message,
                priority: selectedActionItem?.priority,
                messageId: selectedActionItem?.messageId,
                reasoning: selectedActionItem?.justification,
                fullMessage: selectedActionItem?.originalMessage,
                time: selectedActionItem?.time,
                sender: selectedActionItem?.sender,
                subject: selectedActionItem?.subject,
                channel: selectedActionItem?.channel,
                relevancy: selectedActionItem?.relevancy,
                triggerPhrase: selectedActionItem?.triggerPhrase,
                ruleHit: selectedActionItem?.ruleHit,
                priorityLogic: selectedActionItem?.priorityLogic,
                confidence: selectedActionItem?.confidence
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
