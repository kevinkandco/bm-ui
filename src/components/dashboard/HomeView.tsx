import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, Play, Pause, Users, User, Settings, LogOut } from "lucide-react";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "./HomeViewSections/PrioritiesSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import {
  NextBriefSection,
  UpcomingMeetingsSection,
} from "./HomeViewSections/SidebarSections";
import { Priorities, PriorityPeople, Summary } from "./types";
import useAuthStore from "@/store/useAuthStore";
import ListeningScreen from "./ListeningScreen";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import Audio from "./Audio";
import ViewTranscript from "./ViewTranscript";

const BaseURL = import.meta.env.VITE_API_HOST;
import CatchMeUpWithScheduling from "./CatchMeUpWithScheduling";
import SlackSettingsModal from "../settings/modal/SlackSettingsModal";

interface HomeViewProps {
  status: "active" | "away" | "focus" | "vacation";
  priorities: Priorities | null;
  recentBriefs: Summary[];
  totalBriefs: number;
  upcomingBrief: Summary | null;
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number, title: string, transcript: string) => void;
  onStartFocusMode: (focusTime: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onExitFocusMode: () => void;
  onSignOffForDay: () => void;
  fetchDashboardData: () => void;
}

const HomeView = ({
  status,
  priorities,
  recentBriefs,
  totalBriefs,
  upcomingBrief,
  onOpenBrief,
  onViewTranscript,
  onStartFocusMode,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onSignOffForDay,
  fetchDashboardData,
}: HomeViewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [isSlackModalOpen, setSlackModalOpen] = useState(false);
  const [showMessageTranscript, setMessageTranscript] = useState({
    open: false,
    message: "",
  });

  const handleOpenSettings = () => {
      setSlackModalOpen(true);
    };
  
    const handleCloseSettings = () => {
      setSlackModalOpen(false);
      fetchDashboardData();
    };

  const currentAudioUrl = useMemo(() => {
    const audioPath = recentBriefs?.find(
      (v) => v.id === playingBrief
    )?.audioPath;
    if (!audioPath) return null;
    return audioPath?.includes("storage") ? BaseURL + audioPath : audioPath;
  }, [recentBriefs, playingBrief]);

  const handleAudioEnded = useCallback(() => {
    setPlayingBrief(null); // Stop the animation and indicate no brief is playing
    toast({
      title: "Brief Finished",
      description: "Audio playback completed.",
    });
  }, [toast]);

  const { audioRef } = useAudioPlayer(currentAudioUrl, true, handleAudioEnded);

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
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'initial' | 'added'>('initial');

  // Sample connected integrations
  const connectedIntegrations = [
    { name: "Slack", channels: 12 },
    { name: "Gmail", emails: 5 },
    { name: "Google Calendar", events: 3 }
  ];

  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);

  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

  const handleViewTranscript = useCallback((briefId: number, title: string, transcript: string) => {
    onViewTranscript(briefId, title, transcript);
  }, [onViewTranscript]);


  const handleGetBriefedNow = useCallback(() => {
    setShowSchedulingModal(true);
  }, []);

  const handleCloseSchedulingModal = useCallback(() => {
    setShowSchedulingModal(false);
  }, []);

  const handleGenerateSummaryWithScheduling = useCallback((timeDescription: string, skipScheduled?: boolean) => {
    setShowSchedulingModal(false);
    
    if (skipScheduled) {
      toast({
        title: "Brief Generated",
        description: "Your catch-up summary is ready and the scheduled brief has been skipped"
      });
    } else {
      toast({
        title: "Brief Generated", 
        description: "Your catch-up summary is ready. Your scheduled brief will still arrive on time."
      });
    }
  }, [toast]);

  const handleTeamInterest = useCallback(() => {
    setWaitlistStatus('added');
  }, []);
    

  const handleClose = () => {
    setMessageTranscript({
      open: false,
      message: "",
    });
  }

  // Profile dropdown handlers
  const handleProfileClick = useCallback(() => {
    navigate("/dashboard/settings", { state: { activeSection: "profile" } });
  }, [navigate]);

  const handleIntegrationsClick = useCallback(() => {
    navigate("/dashboard/settings", { state: { activeSection: "integrations" } });
  }, [navigate]);

  const handleBriefConfigClick = useCallback(() => {
    navigate("/dashboard/settings", { state: { activeSection: "brief-config" } });
  }, [navigate]);

  const handleAllSettingsClick = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  // Sample brief data
  // const recentBriefs = [{
  //   id: 1,
  //   name: "Morning Brief",
  //   timeCreated: "Today, 8:00 AM",
  //   timeRange: "5:00 AM - 8:00 AM",
  //   slackMessages: {
  //     total: 12,
  //     fromPriorityPeople: 3
  //   },
  //   emails: {
  //     total: 5,
  //     fromPriorityPeople: 2
  //   },
  //   actionItems: 4,
  //   hasTranscript: true
  // }, {
  //   id: 2,
  //   name: "Midday Brief",
  //   timeCreated: "Today, 12:30 PM",
  //   timeRange: "8:00 AM - 12:30 PM",
  //   slackMessages: {
  //     total: 18,
  //     fromPriorityPeople: 5
  //   },
  //   emails: {
  //     total: 8,
  //     fromPriorityPeople: 3
  //   },
  //   actionItems: 6,
  //   hasTranscript: true
  // }, {
  //   id: 3,
  //   name: "Evening Brief",
  //   timeCreated: "Yesterday, 6:00 PM",
  //   timeRange: "12:30 PM - 6:00 PM",
  //   slackMessages: {
  //     total: 14,
  //     fromPriorityPeople: 2
  //   },
  //   emails: {
  //     total: 6,
  //     fromPriorityPeople: 1
  //   },
  //   actionItems: 3,
  //   hasTranscript: false
  // }];

  // Sample upcoming brief data
  // const upcomingBrief = {
  //   name: "Midday Brief",
  //   scheduledTime: "Today at 12:30 PM"
  // };

  const handlePlayBrief = useCallback(
    (briefId: number) => {
      const brief = recentBriefs?.find((b) => b.id === briefId);
      if (!brief?.audioPath) {
        toast({
          title: "Audio not found",
          description: `Audio not found, please try again`,
          variant: "destructive",
        })
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

  // Mobile View
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col px-4 py-4 overflow-hidden">
        {/* Mobile Menu Button - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="w-10 h-10 rounded-full bg-deep-blue border border-light-gray-text/40 text-light-gray-text hover:border-light-gray-text/60"
                variant="outline"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-[80vh] bg-dark-navy/95 backdrop-blur-xl border-light-gray-text/20"
            >
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white-text">
                    Menu
                  </h2>
                </div>

                {/* Simple Menu Links - Removed Settings link */}
                <div className="space-y-8">
                  <a
                    href="/dashboard/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block text-lg text-white-text hover:text-primary-teal transition-colors"
                  >
                    Brief Schedule
                  </a>

                  <a
                    href="/dashboard/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block text-lg text-white-text hover:text-primary-teal transition-colors"
                  >
                    Priorities
                  </a>

                  <a
                    href="/dashboard/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block text-lg text-white-text hover:text-primary-teal transition-colors"
                  >
                    Integrations
                  </a>

                  <span className="block text-lg text-light-gray-text">
                    Feedback
                  </span>

                  <span className="block text-lg text-light-gray-text">
                    Contact Us
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Welcome Section - Compact with reduced spacing */}
        <div className="text-center flex-shrink-0 mt-4 mb-1">
          <h1 className="text-xl font-semibold text-white-text mb-0">
            Good morning, {user?.name}
          </h1>
          <p className="text-light-gray-text text-sm">
            Ready to catch up or focus?
          </p>
        </div>

        {/* Central Audio Wave - Full Width with reduced padding */}
        <div className="flex-1 flex flex-col items-center justify-center mx-0 px-0 py-2">
          <div className="w-full px-8">
            <div className="w-full h-12 flex items-center justify-center gap-1">
              {/* Audio Wave Bars */}
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-primary-teal rounded-full transition-all duration-300"
                  style={{
                    width: '3px',
                    height: `${15 + Math.sin((Date.now() / 500) + i * 0.5) * 10}px`,
                    animation: `audioWave 1.5s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div className="text-center mt-3">
              <p className="text-white text-sm mb-2">brief-me is monitoring</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-light-gray-text">
                {connectedIntegrations.map((integration, index) => (
                  <span key={integration.name} className="flex items-center">
                    <span>{integration.name}</span>
                    {integration.channels && <span className="ml-1">({integration.channels} channels)</span>}
                    {integration.emails && <span className="ml-1">({integration.emails} emails)</span>}
                    {integration.events && <span className="ml-1">({integration.events} events)</span>}
                    {index < connectedIntegrations.length - 1 && <span className="mx-1">•</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons - Updated to separate status buttons */}
        <div className="flex justify-center items-center gap-4 mb-3 flex-shrink-0 my-[6px] py-[3px]">
          <button
            onClick={onOpenBriefModal}
            className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95"
          >
            <FileText className="w-4 h-4 text-light-gray-text" />
          </button>

          <button onClick={() => onStartFocusMode(30)} className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <Focus className="w-4 h-4 text-light-gray-text" />
          </button>

          <button onClick={onSignOffForDay} className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <Clock className="w-4 h-4 text-light-gray-text" />
          </button>

          <button
            onClick={onToggleCatchMeUp}
            className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95"
          >
            <Zap className="w-4 h-4 text-light-gray-text" />
          </button>
        </div>

        {/* Mobile Recent Briefs - Below action buttons - Very compact */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white-text">
              Recent Briefs
            </h2>
            <Button
              onClick={handleViewAllBriefs}
              variant="ghost"
              size="sm"
              className="text-light-gray-text text-xs"
            >
              View All
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {recentBriefs?.map((brief) => (
                <div
                  key={brief.id}
                  className="flex-none w-48 border border-light-gray-text/20 rounded-xl p-2 bg-deep-blue/30"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-surface-raised/50 flex items-center justify-center">
                      <FileText className="h-2 w-2 text-primary-teal" />
                    </div>
                    <button
                      onClick={() => handlePlayBrief(brief.id)}
                      className="w-4 h-4 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
                    >
                      {playingBrief === brief.id ? (
                        <div className="flex items-center gap-0.5">
                          <div
                            className="w-0.5 h-1.5 bg-primary-teal rounded-full animate-pulse"
                            style={{
                              animationDelay: "0ms",
                            }}
                          />
                          <div
                            className="w-0.5 h-2 bg-primary-teal rounded-full animate-pulse"
                            style={{
                              animationDelay: "150ms",
                            }}
                          />
                          <div
                            className="w-0.5 h-1.5 bg-primary-teal rounded-full animate-pulse"
                            style={{
                              animationDelay: "300ms",
                            }}
                          />
                        </div>
                      ) : (
                        <Play className="h-1.5 w-1.5 text-primary-teal" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold text-white-text truncate">
                        {brief.title}
                      </h3>
                      <p className="text-xs text-light-gray-text truncate">
                        {brief.summaryTime}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-1">
                    <div className="flex items-center justify-between text-xs text-light-gray-text">
                      <span>{brief.slackMessageCount} Slack</span>
                      <span>{brief.emailCount} Emails</span>
                      <span>{brief.actionCount} Actions</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => onOpenBrief(brief.id)}
                    size="sm"
                    className="w-full bg-primary-teal text-white-text rounded-lg hover:bg-accent-green text-xs py-0.5 h-6"
                  >
                    View Brief
                  </Button>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <style>{`
          @keyframes audioWave {
            0%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(2);
            }
          }
        `}</style>
      </div>
      )
  }

  // Desktop View
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Good morning, {user.name}
            </h1>
            <p className="text-text-secondary font-light text-gray-50">
              Let's get you caught up.
            </p>
          </div>
          
          {/* Updated CTAs on the right with Profile Dropdown */}
          <div className="flex gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
                >
                  Update Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface border-border-subtle">
                <DropdownMenuItem
                  disabled={status === "focus" || status === "away"}
                  className="text-text-primary hover:bg-white/5 p-0"
                >
                  <div className="flex items-center pl-2 py-1.5" onClick={() => onStartFocusMode(30)}>
                    <Headphones className="mr-2 h-4 w-4" />
                    Start Focus Mode
                  </div>
                  <div className="flex items-center rounded-full p-1 text-sm cursor-pointer" onClick={onToggleFocusMode}>
                     <Settings size={16}>Configure Slack</Settings>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onSignOffForDay}
                  disabled={status === "focus" || status === "away"}
                  className="text-text-primary hover:bg-white/5"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Sign Off for the Day
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={onToggleCatchMeUp}
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Brief Me
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                  <Avatar className="h-10 w-10 border-2 border-border-subtle border-accent-primary transition-colors cursor-pointer">
                    <AvatarImage src={BaseURL + user.profile_path} alt={user.name} onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                    <AvatarFallback className="bg-accent-primary/20 text-accent-primary font-medium">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface border-border-subtle w-56" align="end">
                <DropdownMenuItem onClick={handleProfileClick} className="text-text-primary hover:bg-white/5">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleIntegrationsClick} className="text-text-primary hover:bg-white/5">
                  <Zap className="mr-2 h-4 w-4" />
                  Integrations
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBriefConfigClick} className="text-text-primary hover:bg-white/5">
                  <FileText className="mr-2 h-4 w-4" />
                  Brief Configuration
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleAllSettingsClick} className="text-text-primary hover:bg-white/5">
                  <Settings className="mr-2 h-4 w-4" />
                  All Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Connected Channels Section - Desktop Only */}
        <div className="mb-6">
          <ConnectedChannelsSection showAsHorizontal={true} />
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="col-span-8 space-y-6">
            {/* Briefs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Briefs</h2>
              </div>
              
              {/* Unified Brief Container with upcoming brief */}
              <BriefsContainer 
                briefs={recentBriefs} 
                totalBriefs={totalBriefs}
                onViewBrief={onOpenBrief} 
                onViewTranscript={handleViewTranscript} 
                onPlayBrief={handlePlayBrief} 
                playingBrief={playingBrief} 
                onViewAllBriefs={handleViewAllBriefs}
                onGetBriefedNow={handleGetBriefedNow}
                onUpdateSchedule={handleUpdateSchedule}
                upcomingBrief={upcomingBrief}
              />
              <Audio audioSrc={currentAudioUrl} audioRef={audioRef} />
            </div>
          </div>

          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-4">
            {/* Priorities Section with title outside */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Priorities</h2>
                <Button 
                  variant="ghost" 
                  onClick={handleOpenSettings}
                  className="h-auto p-0 text-sm text-text-secondary hover:text-accent-primary"
                >
                  Edit
                </Button>
              </div>
              <div className="border border-border-subtle bg-surface-overlay/30 shadow-sm rounded-2xl">
                <PrioritiesSection
                priorities={priorities}
                fetchDashboardData={fetchDashboardData}
              />
              </div>
            </div>
            
            {/* Brief Me Teams - With enhanced blurred background mockups */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm relative overflow-hidden">
              {/* Enhanced blurred background mockups */}
              <div className="absolute inset-0 opacity-40 blur-[1px] pointer-events-none">
                <div className="grid grid-cols-2 gap-4 h-full p-4">
                  {/* Team card mockup */}
                  <div className="bg-gradient-to-br from-accent-primary/50 to-accent-primary/70 rounded-xl p-4 shadow-lg">
                    {/* Team header with profile pics */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 bg-white/70 rounded-full border-2 border-white/50"></div>
                        <div className="w-6 h-6 bg-white/70 rounded-full border-2 border-white/50"></div>
                        <div className="w-6 h-6 bg-white/70 rounded-full border-2 border-white/50"></div>
                        <div className="w-6 h-6 bg-white/70 rounded-full border-2 border-white/50 flex items-center justify-center">
                          <span className="text-xs text-white/90 font-medium">+5</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Team stats bars */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-white/40 rounded-full h-3 w-full"></div>
                      <div className="bg-white/35 rounded-full h-3 w-3/4"></div>
                      <div className="bg-white/30 rounded-full h-3 w-1/2"></div>
                    </div>
                    
                    {/* Team name */}
                    <div className="bg-white/50 rounded-lg h-4 w-2/3"></div>
                  </div>
                  
                  {/* Analytics card mockup */}
                  <div className="bg-gradient-to-br from-surface/90 to-surface/95 rounded-xl p-4 shadow-lg">
                    {/* Chart header */}
                    <div className="bg-white/40 rounded-lg h-3 w-2/3 mb-4"></div>
                    
                    {/* Mock chart bars - more detailed */}
                    <div className="flex items-end gap-2 h-16 mb-3">
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-8"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-12"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-6"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-14"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-10"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-16"></div>
                      <div className="bg-accent-primary/70 rounded-sm w-3 h-4"></div>
                    </div>
                    
                    {/* Analytics labels */}
                    <div className="space-y-2">
                      <div className="bg-white/35 rounded h-2 w-full"></div>
                      <div className="bg-white/30 rounded h-2 w-3/4"></div>
                      <div className="bg-white/25 rounded h-2 w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Clear content with better contrast */}
              <div className="relative z-10 bg-surface-overlay/70 backdrop-blur-sm rounded-xl p-4">
                <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Brief Me Teams
                </h2>
                
                <p className="text-text-secondary text-sm mb-4">Coming soon...</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <p className="text-sm text-text-primary">AI meeting proxy</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <p className="text-sm text-text-primary">Onboarding/new hire briefs</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <p className="text-sm text-text-primary">Pre-meeting, handoff, and shared daily briefs</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <p className="text-sm text-text-primary">Team analytics</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <p className="text-sm text-text-primary">and more...</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleTeamInterest}
                  size="sm" 
                  className={`rounded-lg px-4 py-2 text-sm w-full ${
                    waitlistStatus === 'added' 
                      ? 'bg-green-600 text-white hover:bg-green-600' 
                      : 'bg-accent-primary text-white hover:bg-accent-primary/90'
                  }`}
                  disabled={waitlistStatus === 'added'}
                >
                  {waitlistStatus === 'added' ? 'Added to waitlist' : 'Join waitlist'}
                </Button>
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
      <SlackSettingsModal
        open={isSlackModalOpen}
        onClose={handleCloseSettings}
        initialTab={"priorityPeople"}
      />
    </div>
  );
};
export default React.memo(HomeView);
