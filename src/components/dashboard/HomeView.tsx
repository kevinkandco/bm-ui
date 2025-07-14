import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, ChevronRight, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight, Home, ChevronLeft, Calendar, Network, Mail, ArrowLeft, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatusTimer, {
  StatusTimerProps,
} from "@/components/dashboard/StatusTimer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "./HomeViewSections/PrioritiesSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import {
  NextBriefSection,
  UpcomingMeetingsSection,
} from "./HomeViewSections/SidebarSections";
import {
  BackendIntegration,
  CalendarEvent,
  CalenderData,
  Integration,
  Priorities,
  PriorityPeople,
  Summary,
} from "./types";
import useAuthStore from "@/store/useAuthStore";
import ListeningScreen from "./ListeningScreen";
import useAudioPlayer, { UseAudioPlayerType } from "@/hooks/useAudioPlayer";
import Audio from "./Audio";
import ViewTranscript from "./ViewTranscript";
import CatchMeUpWithScheduling from "./CatchMeUpWithScheduling";
import { AUDIO_URL } from "@/config";
import ActionItemsPanel from "./ActionItemsPanel";
import CalendarSection from "./HomeViewSections/CalendarSection";

interface HomeViewProps {
  status: "active" | "away" | "focus" | "vacation";
  priorities: Priorities | null;
  recentBriefs: Summary[];
  totalBriefs: number;
  briefsLoading: boolean;
  upcomingBrief: Summary | null;
  calendarData: CalenderData;
  connectedPlatforms: Integration[];
  selectedDate: string;
  IntegrationWarning: BackendIntegration[];
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (
    briefId: number,
    title: string,
    transcript: string
  ) => void;
  onStartFocusMode: (focusTime: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onExitFocusMode: () => void;
  onSignOffForDay: () => void;
  fetchDashboardData: () => void;
  handlePreviousDay: () => void;
  handleNextDay: () => void;
}
const HomeView = ({
  status,
  priorities,
  recentBriefs,
  totalBriefs,
  briefsLoading,
  upcomingBrief,
  calendarData,
  connectedPlatforms,
  selectedDate,
  IntegrationWarning,
  onOpenBrief,
  onViewTranscript,
  onStartFocusMode,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onSignOffForDay,
  fetchDashboardData,
  handlePreviousDay,
  handleNextDay,
}: HomeViewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [isSlackModalOpen, setSlackModalOpen] = useState(false);
  const [actionItemsCount, setActionItemsCount] = useState<number>(0);
  const [showMessageTranscript, setMessageTranscript] = useState({
    open: false,
    message: "",
  });
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<"initial" | "added">(
    "initial"
  );
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isActionItemsHovered, setIsActionItemsHovered] = useState(false);
  const [isPrioritiesHovered, setIsPrioritiesHovered] = useState(false);
  const [isBriefsHovered, setIsBriefsHovered] = useState(false);
  const [showBriefDetail, setShowBriefDetail] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<Summary | null>(null);
  const [showUpcomingBrief, setShowUpcomingBrief] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [fullPlayingBrief, setFullPlayingBrief] = useState<Summary | null>(
    recentBriefs?.[0] || null
  );

  const currentAudioUrl = useMemo(() => {
    const audioPath = recentBriefs?.find(
      (v) => v.id === playingBrief
    )?.audioPath;
    if (!audioPath) return null;
    return audioPath?.includes("storage") ? AUDIO_URL + audioPath : audioPath;
  }, [recentBriefs, playingBrief]);

  const handleAudioEnded = useCallback(() => {
    setPlayingBrief(null); // Stop the animation and indicate no brief is playing
    toast({
      title: "Brief Finished",
      description: "Audio playback completed.",
    });
  }, [toast]);

  const audioPlayer: UseAudioPlayerType = useAudioPlayer(
    currentAudioUrl,
    true,
    handleAudioEnded,
    1.0
  );
  const { audioRef } = audioPlayer;

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioRef]);

  useEffect(() => {
    return () => {
      setMessageTranscript({
        open: false,
        message: "",
      });
    };
  }, []);

  const handleOpenSettings = () => {
    navigate("/dashboard/settings", {
      state: { activeSection: "integrations" },
    });
  };

  const handleCloseSettings = () => {
    setSlackModalOpen(false);
    fetchDashboardData();
  };

  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);

  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

  const handleViewAllSchedule = useCallback(
    (isPast: boolean) => {
      navigate("/dashboard/meetings", { state: { isPast } });
    },
    [navigate]
  );

  const handleViewAllTasks = useCallback(() => {
    navigate("/dashboard/follow-ups");
  }, [navigate]);

  const handleViewTranscript = useCallback(
    (briefId: number, title: string, transcript: string) => {
      onViewTranscript(briefId, title, transcript);
    },
    [onViewTranscript]
  );

  const handleGetBriefedNow = useCallback(() => {
    setShowSchedulingModal(true);
  }, []);
  const handleCloseSchedulingModal = useCallback(() => {
    setShowSchedulingModal(false);
  }, []);
  const handleGenerateSummaryWithScheduling = useCallback(
    (timeDescription: string, skipScheduled?: boolean) => {
      setShowSchedulingModal(false);
      if (skipScheduled) {
        toast({
          title: "Brief Generated",
          description:
            "Your catch-up summary is ready and the scheduled brief has been skipped",
        });
      } else {
        toast({
          title: "Brief Generated",
          description:
            "Your catch-up summary is ready. Your scheduled brief will still arrive on time.",
        });
      }
    },
    [toast]
  );
  const handleTeamInterest = useCallback(() => {
    setWaitlistStatus("added");
  }, []);

  const handleClose = () => {
    setMessageTranscript({
      open: false,
      message: "",
    });
  };

  // Status management handlers
  const handleStatusChange = useCallback(
    (status: "focus" | "offline") => {
      setShowStatusModal(false);
      if (status === "focus") {
        onToggleFocusMode();
      } else if (status === "offline") {
        onSignOffForDay();
        toast({
          title: "Offline Mode Activated",
          description: "Brief-me will monitor but won't send notifications",
        });
      }
    },
    [onToggleFocusMode, onSignOffForDay, toast]
  );
  const handleExitStatus = useCallback(() => {
    toast({
      title: "Status Reset",
      description: "You're back to active monitoring",
    });
  }, [toast]);

  // Profile dropdown handlers
  const handleProfileClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: {
        activeSection: "profile",
      },
    });
  }, [navigate]);
  const handleIntegrationsClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: {
        activeSection: "integrations",
      },
    });
  }, [navigate]);
  const handleBriefConfigClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: {
        activeSection: "brief-config",
      },
    });
  }, [navigate]);
  const handleAllSettingsClick = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  // Navigation collapse handlers
  const handleToggleNav = useCallback(() => {
    setIsNavCollapsed(!isNavCollapsed);
  }, [isNavCollapsed]);

  const handlePlayBrief = useCallback(
    (briefId: number) => {
      const brief = recentBriefs?.find((b) => b.id === briefId);
      if (!brief?.audioPath) {
        toast({
          title: "Audio not found",
          description: `Audio not found, please try again`,
          variant: "destructive",
        });
        return;
      }

      if (playingBrief === briefId) {
        setPlayingBrief(null);
        toast({
          title: "Brief Paused",
          description: "Audio playback paused",
        });
      } else {
        setPlayingBrief(briefId);
        toast({
          title: "Playing Brief",
          description: "Audio playback started",
        });
      }
    },
    [playingBrief, toast, recentBriefs]
  );

  const dotColors = ["bg-primary-teal", "bg-orange-400", "bg-purple-400"];

  // Mobile View
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Floating Status Pill - Top Left when active status */}
        {status !== "active" && (
          <div className="fixed top-3 left-3 z-40">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-surface-raised/90 backdrop-blur-md border border-white/20 rounded-full">
              {status === "focus" ? (
                <>
                  <Focus className="w-3 h-3 text-primary-teal" />
                  <span className="text-xs text-white-text">Focus</span>
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-white-text">Away</span>
                </>
              )}
              <button
                onClick={handleExitStatus}
                className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Welcome Header Section */}
        <div className="text-center px-4 py-4 flex-shrink-0">
          <h1 className="text-lg font-semibold text-white-text mb-1">
            Good morning, {user?.name}
          </h1>
          <p className="text-light-gray-text text-sm mb-3">
            Ready to catch up or focus?
          </p>

          {/* Monitoring Section */}
          <div className="flex items-center justify-center">
            <ConnectedChannelsSection showAsHorizontal={true} connectedPlatforms={connectedPlatforms} />
          </div>
        </div>

        {/* Main Content - Fixed height container with padding for fixed nav */}
        <div className="flex-1 px-4 space-y-3 overflow-y-auto pb-32">

          {/* Meetings - Reduced height */}
          <div className="space-y-2">
            <h2 className="text-text-primary text-sm font-medium">Meetings</h2>
            <div className="space-y-1.5">
              {calendarData?.today?.map((event, index) => {
                const colorClass = dotColors[index % dotColors.length];
                return (
                  <div className="p-2.5 rounded-lg bg-surface-raised/30 border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${colorClass} flex-shrink-0`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white-text font-medium">{event.title}</p>
                        <p className="text-xs text-light-gray-text">Today at {event.start_time}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-light-gray-text" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Briefs Section - Reduced spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-sm font-medium">Briefs</h2>
              {/* Day Picker */}
              <div className="flex items-center gap-1 bg-surface-raised/40 rounded-full px-2 py-1 border border-white/10">
                <button onClick={handlePreviousDay} disabled={selectedDate === "2 days ago"} className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-3.5 h-3.5 text-light-gray-text" />
                </button>
                <div className="flex items-center gap-1 px-2">
                  <Calendar className="w-3 h-3 text-light-gray-text" />
                  <span className="text-xs text-white-text font-medium min-w-[50px] text-center">{selectedDate}</span>
                </div>
                <button onClick={handleNextDay} disabled={selectedDate === "Today"} className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="w-3.5 h-3.5 text-light-gray-text" />
                </button>
              </div>
            </div>
            {recentBriefs.map((brief) => (
              <div className="p-2.5 rounded-lg bg-surface-raised/30 border border-white/10 cursor-pointer hover:bg-surface-raised/40 transition-colors" onClick={() => {
              handlePlayBrief(brief?.id);
              setShowBriefDetail(true);
            }}>
                <div className="flex items-center gap-2.5">
                  <div
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePlayBrief(brief?.id);
                        setFullPlayingBrief(brief);
                      }}
                  className="w-9 h-9 rounded-full bg-primary-teal/20 flex items-center justify-center flex-shrink-0">
                    {playingBrief === brief?.id ? <Pause className="h-4 w-4 text-primary-teal" /> : <Play className="h-4 w-4 text-primary-teal" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-white-text font-medium">{brief?.title}</h3>
                    <p className="text-xs text-light-gray-text">{brief?.time}</p>
                    <div className="flex items-center gap-3 text-xs text-light-gray-text mt-0.5">
                      <span>{brief?.stats?.totalMessagesAnalyzed?.breakdown?.slack} Slack</span>
                      <span>{brief?.stats?.totalMessagesAnalyzed?.breakdown?.gmail} Emails</span>
                      <span>{brief?.stats?.actionItems?.total} Actions</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Brief - Collapsible Toggle - Reduced spacing */}
          <div className="space-y-1">
            <button onClick={() => setShowUpcomingBrief(!showUpcomingBrief)} className="flex items-center justify-between w-full text-left">
              <h2 className="text-text-primary text-xs font-normal text-slate-400">Upcoming</h2>
              {showUpcomingBrief ? <ChevronDown className="w-4 h-4 text-light-gray-text" /> : <ChevronRight className="w-4 h-4 text-light-gray-text" />}
            </button>
            
            {showUpcomingBrief && <div className="p-2.5 rounded-lg bg-surface-raised/20 border border-white/10 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-primary-teal" />
                    <div>
                      <p className="text-sm text-white-text font-medium">
                        {upcomingBrief?.title}
                      </p>
                      <p className="text-xs text-light-gray-text">
                        {upcomingBrief?.time}
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleGetBriefedNow} size="sm" variant="outline" className="border-primary-teal/60 text-primary-teal hover:border-primary-teal hover:text-white text-xs px-2.5 py-1 h-auto bg-transparent">
                    <Zap className="w-3 h-3 mr-1" />
                    Now
                  </Button>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Audio Player - Above Bottom Nav */}
        {recentBriefs?.[0] && (
          <div
            className="fixed bottom-16 left-0 right-0 border-t border-white/10 px-4 py-2 bg-surface-raised/80 backdrop-blur-md cursor-pointer hover:bg-surface-raised/90 transition-colors"
            onClick={() => {
              setSelectedBrief(fullPlayingBrief);
              setShowBriefDetail(true);
            }}
          >
            <div className="flex items-center gap-2.5">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (playingBrief) {
                    handlePlayBrief(playingBrief);
                  } else {
                    handlePlayBrief(fullPlayingBrief?.id);
                  }
                }}
                className="w-7 h-7 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
              >
                {playingBrief ? (
                  <Pause className="h-3.5 w-3.5 text-primary-teal" />
                ) : (
                  <Play className="h-3.5 w-3.5 text-primary-teal" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white-text font-medium truncate">
                  {fullPlayingBrief?.title}
                </div>
                <div className="text-xs text-light-gray-text">
                  {playingBrief
                    ? `${audioPlayer?.formatDuration(
                        audioPlayer?.currentTime
                      )} / ${audioPlayer?.formatDuration(
                        audioPlayer?.duration
                      )}`
                    : "Ready to play"}
                </div>
              </div>
              {playingBrief && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlayingBrief(null);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <ChevronDown className="h-4 w-4 text-light-gray-text" />
            </div>
            {playingBrief && <Button variant="ghost" size="sm" onClick={e => {
            e.stopPropagation();
            setPlayingBrief(null);
          }} className="h-7 w-7 p-0">
                <X className="h-3.5 w-3.5" />
              </Button>}
            <ChevronDown className="h-4 w-4 text-light-gray-text" />
          </div>
        )}
        <Audio audioSrc={currentAudioUrl} audioRef={audioRef} />

        {/* Bottom Navigation - Fixed at bottom of screen */}
        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-surface-raised/90 backdrop-blur-md pb-safe">
          <div className="grid grid-cols-4 px-2 py-1.5">
            {/* Home */}
            <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-0.5 p-2.5 text-primary-teal">
              <Home className="h-5 w-5" />
              <span className="text-xs font-medium">Home</span>
            </button>

            {/* Briefs */}
            <button onClick={handleViewAllBriefs} className="flex flex-col items-center gap-0.5 p-2.5 text-light-gray-text hover:text-white-text transition-colors">
              <FileText className="h-5 w-5" />
              <span className="text-xs font-medium">Briefs</span>
            </button>

            {/* Status */}
            <Sheet open={showStatusModal} onOpenChange={setShowStatusModal}>
              <SheetTrigger asChild>
                <button className="flex flex-col items-center gap-0.5 p-2.5 relative">
                  {/* Status indicator with better visual feedback */}
                  <div className="relative">
                    {status === "active" && (
                      <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                    {status === "focus" && (
                      <div className="w-5 h-5 rounded-full bg-primary-teal/20 flex items-center justify-center border-2 border-primary-teal">
                        <Focus className="h-3 w-3 text-primary-teal" />
                      </div>
                    )}
                    {status === "away" && (
                      <div className="w-5 h-5 rounded-full bg-orange-400/20 flex items-center justify-center border-2 border-orange-400">
                        <Clock className="h-3 w-3 text-orange-400" />
                      </div>
                    )}
                    {/* Active indicator dot */}
                    {status !== "active" && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></div>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      status === "active"
                        ? "text-green-400"
                        : status === "focus"
                        ? "text-primary-teal"
                        : "text-orange-400"
                    }`}
                  >
                    Status
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent
                side="bottom"
                className="h-[40vh] bg-dark-navy/95 backdrop-blur-xl border-white/20"
              >
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-white-text">
                    Set Status
                  </h2>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setShowStatusModal(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                      <span className="text-white-text">Active</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange("focus")}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Focus className="h-4 w-4 text-primary-teal" />
                      <span className="text-white-text">Focus Mode</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange("offline")}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <Clock className="h-4 w-4 text-orange-400" />
                      <span className="text-white-text">Away</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Settings */}
            <button onClick={() => navigate('/dashboard/settings')} className="flex flex-col items-center gap-0.5 p-2.5 text-light-gray-text hover:text-white-text transition-colors">
              <Settings className="h-5 w-5" />
              <span className="text-xs font-medium">Settings</span>
            </button>
          </div>
        </div>

        {/* Brief Detail Sheet */}
        <Sheet open={showBriefDetail} onOpenChange={setShowBriefDetail}>
          <SheetContent
            side="bottom"
            className="h-[90vh] bg-dark-navy/95 backdrop-blur-xl border-white/20 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white-text">
                    {selectedBrief?.title}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowBriefDetail(false);
                      setSelectedBrief(null);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-light-gray-text mt-1">
                  {selectedBrief?.delivery_at}{" "}
                  {selectedBrief?.delivery_at && selectedBrief?.ended_at && "•"}{" "}
                  {selectedBrief?.start_at} - {selectedBrief?.ended_at}
                </p>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Summary */}
                  {selectedBrief?.summary && (
                    <div>
                      <h3 className="text-lg font-medium text-white-text mb-3">
                        Summary
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {selectedBrief?.summary}
                      </p>
                    </div>
                  )}

                  {/* Action Items */}
                  {selectedBrief?.follow_ups?.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium text-white-text mb-3">
                        Action Items ({selectedBrief?.follow_ups?.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedBrief?.follow_ups?.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg bg-surface-raised/30 border border-white/10"
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-4 h-4 rounded border border-light-gray-text/30 mt-0.5 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-sm text-white-text font-medium">
                                  {item?.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-light-gray-text">
                                  <span className="break-all">
                                    from {item?.sender}
                                  </span>
                                  {/* {item.isVip && <>
                                    <span>•</span>
                                    <Star className="w-3 h-3 text-green-400" fill="currentColor" />
                                  </>} */}
                                  <span>•</span>
                                  <span
                                    className={`px-1.5 py-0.5 rounded text-xs ${
                                      item?.priority === "critical"
                                        ? "bg-red-500/20 text-red-400"
                                        : item.priority === "high"
                                        ? "bg-orange-500/20 text-orange-400"
                                        : item.priority === "medium"
                                        ? "bg-yellow-500/20 text-yellow-400"
                                        : "bg-gray-500/20 text-gray-400"
                                    }`}
                                  >
                                    {item?.priority}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Messages Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-white-text mb-3">
                      Messages Analyzed
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-surface-raised/30">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                          <span className="text-sm font-medium text-white-text">
                            Slack
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-white-text">
                          {
                            selectedBrief?.stats?.totalMessagesAnalyzed
                              ?.breakdown?.slack
                          }
                        </p>
                        <p className="text-xs text-light-gray-text">
                          {selectedBrief?.stats?.actionItems?.breakdown?.slack}{" "}
                          from priority people
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-raised/30">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                          <span className="text-sm font-medium text-white-text">
                            Gmail
                          </span>
                        </div>
                        <p className="text-lg font-semibold text-white-text">
                          {
                            selectedBrief?.stats?.totalMessagesAnalyzed
                              ?.breakdown?.gmail
                          }
                        </p>
                        <p className="text-xs text-light-gray-text">
                          {selectedBrief?.stats?.actionItems?.breakdown?.gmail}{" "}
                          from priority people
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling
          open={showSchedulingModal}
          onClose={handleCloseSchedulingModal}
          onGenerateSummary={handleGenerateSummaryWithScheduling}
          upcomingBriefName={upcomingBrief.title}
          upcomingBriefTime={upcomingBrief.time}
        />
      </div>
    );
  }

  // Desktop View
  return <div className="min-h-screen flex">
      {/* Full Height Sidebar - Made Narrower and Collapsible */}
      <div 
        className={`${isNavCollapsed ? 'w-16 cursor-pointer' : 'w-64'} bg-surface-raised/20 flex flex-col transition-all duration-300 ease-in-out`}
        onClick={isNavCollapsed ? handleToggleNav : undefined}
      >
        <div className="p-4 pt-12 space-y-4 flex-1">
          {/* Profile Section - Moved to top, removed email */}
          <div 
            className={`flex items-center gap-3 p-3 rounded-lg relative group transition-all duration-200 ${isNavCollapsed ? 'justify-center' : ''} ${isProfileHovered ? 'bg-white/5' : ''}`}
            onMouseEnter={() => setIsProfileHovered(true)}
            onMouseLeave={() => setIsProfileHovered(false)}
          >
            <Avatar className={`${isNavCollapsed ? 'w-6 h-6' : 'w-8 h-8'}`}>
              <AvatarImage src={
                        user?.profile_path
                          ? user?.profile_path
                          : "/images/default.png"
                      } alt={user.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }} />
              <AvatarFallback className="bg-primary-teal text-white text-sm">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {!isNavCollapsed && (
              <div className="text-left">
                <p className="text-white-text text-sm font-medium">{user.name}</p>
              </div>
            )}
            {/* Desktop collapse arrow - only show on hover and when not collapsed */}
            {!isNavCollapsed && isProfileHovered && (
              <button
                onClick={handleToggleNav}
                className="absolute right-3 p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-light-gray-text" />
              </button>
            )}
          </div>

          {/* Connected Integrations Status - Full Width */}
          {!isNavCollapsed && (
            <div className="flex gap-2">
              {connectedPlatforms.map((integration, i) => (
                <div key={i} className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200 flex-1 justify-center">
                  <div className="flex items-center justify-center relative">
                    {integration.name === 'Slack' && <div className="w-3 h-3 text-primary-teal"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg></div>}
                    {(integration.name === 'Google' || integration.name === 'Gmail') && <Mail className="w-3 h-3 text-primary-teal" />}
                    {integration.name === 'Calendar' && <Calendar className="w-3 h-3 text-primary-teal" />}
                    {/* Status dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 bg-green-400"></div>
                  </div>
                  {/* Count badge */}
                  <span className="text-xs font-medium text-white">
                    {integration.totalCount}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming Brief - Time on right side */}
          {!isNavCollapsed && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-text-secondary text-xs text-left">Upcoming brief</p>
                <p className="text-text-primary text-xs font-medium">{upcomingBrief.time}</p>
              </div>
            </div>
          )}

          {/* Brief Me Button - Left aligned */}
          <Button onClick={onToggleCatchMeUp} className={`w-full bg-primary-teal hover:bg-primary-teal/90 text-white rounded-md py-2 font-medium text-sm shadow-none ${isNavCollapsed ? 'justify-center px-0' : 'justify-start'}`}>
            {isNavCollapsed ? <Zap className="w-4 h-4" /> : 'Brief Me'}
          </Button>

          {/* Navigation Items - Added hover states, reduced text size, left aligned */}
          <div className="space-y-1">
            <button onClick={() => navigate('/dashboard')} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 text-primary-teal group ${isNavCollapsed ? 'justify-center' : ''}`}>
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {!isNavCollapsed && <span className="font-medium text-sm">Home</span>}
            </button>
            <button onClick={handleViewAllBriefs} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''}`}>
              <FileText className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              {!isNavCollapsed && <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Briefs</span>}
            </button>
            <button onClick={handleViewAllTasks} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''}`}>
              <CheckSquare className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              {!isNavCollapsed && <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Follow-ups</span>}
            </button>
            <button className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''}`}>
              <Calendar className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              {!isNavCollapsed && <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Meetings</span>}
            </button>
            <button onClick={handleAllSettingsClick} className={`w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group ${isNavCollapsed ? 'justify-center' : ''}`}>
              <Cog className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              {!isNavCollapsed && <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Settings</span>}
            </button>
          </div>

          {/* Brief Me Teams Card */}
          {!isNavCollapsed && (
            <div className="rounded-lg p-3 bg-surface-overlay/30 shadow-sm relative overflow-hidden">
              {/* Enhanced blurred background mockups */}
              <div className="absolute inset-0 opacity-20 blur-[1px] pointer-events-none">
                <div className="grid grid-cols-1 gap-2 h-full p-2">
                  {/* Team card mockup */}
                  <div className="bg-gradient-to-br from-accent-primary/50 to-accent-primary/70 rounded-lg p-2 shadow-lg">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex -space-x-1">
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                        <div className="w-3 h-3 bg-white/70 rounded-full border border-white/50"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white/40 rounded h-1.5 w-full"></div>
                      <div className="bg-white/35 rounded h-1.5 w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear content with better contrast */}
              <div className="relative z-10 bg-surface-overlay/70 backdrop-blur-sm rounded-lg p-3">
                <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Brief Me Teams
                </h3>
                
                <p className="text-text-secondary text-xs mb-3">Coming soon...</p>
                
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">AI meeting proxy</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">Team analytics</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                    <p className="text-xs text-text-primary">Shared briefs</p>
                  </div>
                </div>
                
                <button onClick={handleTeamInterest} className={`text-xs w-full text-left p-0 h-auto font-normal ${waitlistStatus === 'added' ? 'text-green-400' : 'text-text-primary hover:text-text-secondary'} transition-colors`} disabled={waitlistStatus === 'added'}>
                  {waitlistStatus === 'added' ? 'Added to waitlist' : 'Join waitlist'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Settings - Fixed at bottom */}
        <div className="p-4 border-t border-white/10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group">
                <Settings className="w-5 h-5 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
                <span className="text-light-gray-text group-hover:text-white transition-colors">Settings</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56 bg-surface border-border-subtle">
              <DropdownMenuItem onClick={handleIntegrationsClick} className="text-text-primary hover:bg-white/5 cursor-pointer">
                <span>Integrations</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleBriefConfigClick} className="text-text-primary hover:bg-white/5 cursor-pointer">
                <span>Brief Schedule</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-text-primary hover:bg-white/5 cursor-pointer">
                <span>Referrals</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAllSettingsClick} className="text-text-primary hover:bg-white/5 cursor-pointer">
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          {/* Two-Column Content Grid with Unified Background */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            {/* Combined Briefs and Follow-ups area with shared background */}
            <div className="col-span-3 card-dark p-6" style={{
            background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)'
          }}>
              {/* Connected Channels Section */}
              <div className="mb-6">
                <ConnectedChannelsSection showAsHorizontal={true} connectedPlatforms={connectedPlatforms} />
              </div>
              
              <div className="grid grid-cols-3 gap-6">
                {/* Briefs area (2/3) */}
                <div className="col-span-2">
                  {/* Hamburger Menu - show whenever nav is collapsed */}
                  {isNavCollapsed && (
                    <div className="mb-4">
                      <button
                        onClick={handleToggleNav}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Menu className="w-5 h-5 text-text-primary" />
                      </button>
                    </div>
                  )}

                  {/* Good morning greeting */}
                  <div className="mb-6">
                    <h1 className="font-bold text-text-primary text-2xl">
                      Good morning, {user?.name}
                    </h1>
                  </div>
                  {IntegrationWarning.map((integration) => (
                    <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                      {integration.error}
                    </div>
                  ))}
                  
                  {/* Day Picker */}
                  <div className="flex items-center justify-end mb-6">
                    <div className="flex items-center gap-1 bg-surface-raised/40 rounded-full px-3 py-2">
                      <button onClick={handlePreviousDay} disabled={selectedDate === "2 days ago"} className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronLeft className="w-4 h-4 text-light-gray-text" />
                      </button>
                      <div className="flex items-center gap-2 px-3">
                        <Calendar className="w-4 h-4 text-light-gray-text" />
                        <span className="text-sm text-white-text font-medium min-w-[70px] text-center">{selectedDate}</span>
                      </div>
                      <button onClick={handleNextDay} disabled={selectedDate === "Today"} className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ChevronRight className="w-4 h-4 text-light-gray-text" />
                      </button>
                    </div>
                  </div>
                  <BriefsContainer
                    briefs={recentBriefs}
                    totalBriefs={totalBriefs}
                    briefsLoading={briefsLoading}
                    onViewBrief={onOpenBrief}
                    onViewTranscript={handleViewTranscript}
                    onViewAllBriefs={handleViewAllBriefs}
                    onGetBriefedNow={handleGetBriefedNow}
                    onUpdateSchedule={handleUpdateSchedule}
                    upcomingBrief={upcomingBrief}
                    playingBrief={playingBrief}
                    onPlayBrief={handlePlayBrief}
                    audioPlayer={audioPlayer}
                  />
                  <Audio audioSrc={currentAudioUrl} audioRef={audioRef} />
                </div>
                
                {/* Right content area (1/3) - Task Triage */}
                <div className="space-y-6">
                  {/* Follow-ups List */}
                  <div className="space-y-3 relative" onMouseEnter={() => setIsActionItemsHovered(true)} onMouseLeave={() => setIsActionItemsHovered(false)}>
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-text-primary text-lg">Follow ups</h2>
                      {isActionItemsHovered && <Button variant="ghost" onClick={handleViewAllTasks} className="absolute right-0 top-0 px-3 py-1.5 text-sm text-text-secondary hover:text-accent-primary hover:bg-white/10 flex items-center gap-1 rounded-lg transition-all duration-200 z-10">
                          View all
                          <ArrowRight className="w-3 h-3" />
                        </Button>}
                    </div>
                    <ActionItemsPanel setActionItemsCount={setActionItemsCount} />
                  </div>
                  
                  {/* Calendar Section */}
                  <CalendarSection calendarData={calendarData} onViewAllSchedule={handleViewAllSchedule} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling
          open={showSchedulingModal}
          onClose={handleCloseSchedulingModal}
          onGenerateSummary={handleGenerateSummaryWithScheduling}
          upcomingBriefName={upcomingBrief?.title}
          upcomingBriefTime={upcomingBrief?.time}
        />
      </div>
      <ViewTranscript
        open={showMessageTranscript?.open}
        summary={showMessageTranscript.message}
        onClose={handleClose}
      />
    </div>
};
export default React.memo(HomeView);
