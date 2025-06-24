
import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, Play, Pause, Users, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "./HomeViewSections/PrioritiesSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";
import ListeningScreen from "./ListeningScreen";
import CatchMeUpWithScheduling from "./CatchMeUpWithScheduling";

interface HomeViewProps {
  onOpenBrief: (briefId: string) => void;
  onViewTranscript: (briefId: string) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onStartFocusMode: () => void;
  onSignOffForDay: () => void;
}

const HomeView = ({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay
}: HomeViewProps) => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<string | null>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'initial' | 'added'>('initial');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'active' | 'focus' | 'offline'>('active');

  // Sample connected integrations
  const connectedIntegrations = [
    { name: "Slack", channels: 12 },
    { name: "Gmail", emails: 5 },
    { name: "Google Calendar", events: 3 }
  ];

  const showBriefDetails = useCallback(() => {
    onOpenBrief("1");
  }, [onOpenBrief]);
  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);
  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);
  const handleViewTranscript = useCallback((briefId: string) => {
    onViewTranscript(briefId);
  }, [onViewTranscript]);
  const handlePlayBrief = useCallback((briefId: string) => {
    if (playingBrief === briefId) {
      setPlayingBrief(null);
      toast({
        title: "Brief Paused",
        description: "Audio playback paused"
      });
    } else {
      setPlayingBrief(briefId);
      toast({
        title: "Playing Brief",
        description: "Audio playback started"
      });
    }
  }, [playingBrief, toast]);

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

  // Status management handlers
  const handleStatusChange = useCallback((status: 'focus' | 'offline') => {
    setCurrentStatus(status);
    setShowStatusModal(false);
    
    if (status === 'focus') {
      onStartFocusMode();
      toast({
        title: "Focus Mode Activated",
        description: "You won't receive notifications unless they're marked as urgent"
      });
    } else if (status === 'offline') {
      onSignOffForDay();
      toast({
        title: "Offline Mode Activated", 
        description: "Brief-me will monitor but won't send notifications"
      });
    }
  }, [onStartFocusMode, onSignOffForDay, toast]);

  const handleExitStatus = useCallback(() => {
    setCurrentStatus('active');
    toast({
      title: "Status Reset",
      description: "You're back to active monitoring"
    });
  }, [toast]);

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

  // Sample brief data - Updated to match new Brief interface
  const recentBriefs = [
    {
      id: "1",
      title: "Morning Brief",
      summary: "Key updates from your priority channels including budget discussions from Kelly and new project announcements",
      timestamp: "Today, 8:00 AM",
      priority: "high" as const,
      actionItems: [
        {
          id: "action-1",
          text: "Review budget proposal from Kelly",
          source: "Slack #finance",
          priority: "high" as const,
          autoAddedToTaskManager: "Asana"
        },
        {
          id: "action-2",
          text: "Respond to client email about project timeline",
          source: "Gmail",
          priority: "medium" as const
        }
      ],
      channels: ["#finance", "#marketing", "Gmail"],
      peopleCount: 8,
      location: "Remote",
      type: "general" as const
    },
    {
      id: "2", 
      title: "Evening Brief",
      summary: "End of day wrap-up with action items and tomorrow's priorities",
      timestamp: "Yesterday, 8:00 PM",
      priority: "medium" as const,
      actionItems: [
        {
          id: "action-3",
          text: "Prepare presentation for tomorrow's meeting",
          source: "Calendar",
          priority: "high" as const,
          autoAddedToTaskManager: "Todoist"
        }
      ],
      channels: ["#general", "Gmail"],
      peopleCount: 4,
      type: "general" as const
    },
    {
      id: "3",
      title: "Afternoon Brief", 
      summary: "Midday updates with priority messages and urgent items requiring attention",
      timestamp: "Yesterday, 4:00 PM",
      priority: "low" as const,
      actionItems: [
        {
          id: "action-4",
          text: "Schedule follow-up meeting with design team",
          source: "Slack #design",
          priority: "medium" as const
        }
      ],
      channels: ["#design", "#development", "Gmail"],
      peopleCount: 12,
      type: "general" as const
    }
  ];

  // Sample upcoming brief data
  const upcomingBrief = {
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  };

  // Latest brief (most recent) - Updated to match new format
  const latestBrief = {
    id: "1",
    title: "Morning Brief",
    summary: "Key updates from your priority channels including budget discussions from Kelly and new project announcements",
    timestamp: "Today, 8:00 AM",
    actionItems: 4
  };

  // Total briefs ever created (this would come from your backend/state in a real app)
  const totalBriefs = 47;

  // Mobile View
  if (isMobile) {
    return <div className="h-screen flex flex-col px-4 py-4 overflow-hidden">
        {/* Mobile Menu Button - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="w-10 h-10 rounded-full bg-deep-blue border border-light-gray-text/40 text-light-gray-text hover:border-light-gray-text/60" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-dark-navy/95 backdrop-blur-xl border-light-gray-text/20">
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white-text">Menu</h2>
                </div>

                {/* Simple Menu Links - Removed Settings link */}
                <div className="space-y-8">
                  <a href="/dashboard/settings" onClick={e => {
                  e.preventDefault();
                  navigate("/dashboard/settings");
                  setMobileMenuOpen(false);
                }} className="block text-lg text-white-text hover:text-primary-teal transition-colors">
                    Brief Schedule
                  </a>
                  
                  <a href="/dashboard/settings" onClick={e => {
                  e.preventDefault();
                  navigate("/dashboard/settings");
                  setMobileMenuOpen(false);
                }} className="block text-lg text-white-text hover:text-primary-teal transition-colors">
                    Priorities
                  </a>
                  
                  <a href="/dashboard/settings" onClick={e => {
                  e.preventDefault();
                  navigate("/dashboard/settings");
                  setMobileMenuOpen(false);
                }} className="block text-lg text-white-text hover:text-primary-teal transition-colors">
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
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-sm">Ready to catch up or focus?</p>
        </div>

        {/* Central Audio Wave with Status - Full Width with reduced padding */}
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
              {/* Status indicator */}
              {currentStatus !== 'active' && (
                <div className="mb-2 flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-deep-blue border border-light-gray-text/40 rounded-full">
                    {currentStatus === 'focus' ? (
                      <>
                        <Focus className="w-3 h-3 text-primary-teal" />
                        <span className="text-xs text-white-text">Focus Mode</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-orange-400" />
                        <span className="text-xs text-white-text">Offline</span>
                      </>
                    )}
                  </div>
                  <Button 
                    onClick={handleExitStatus}
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs text-light-gray-text hover:text-white-text"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
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

        {/* Upcoming Brief Section - More faded */}
        <div className="mb-3 flex-shrink-0">
          <div className="bg-deep-blue/20 border border-light-gray-text/10 rounded-xl p-3 opacity-40">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white-text/70">Upcoming Brief</h3>
              <Clock className="w-4 h-4 text-primary-teal/70" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-light-gray-text/70">{upcomingBrief.name}</p>
                <p className="text-xs text-light-gray-text/70">{upcomingBrief.scheduledTime}</p>
              </div>
              <Button 
                onClick={handleGetBriefedNow}
                size="sm"
                variant="outline"
                className="border-blue-500/60 text-blue-400 hover:border-blue-400 hover:text-blue-300 rounded-lg text-xs px-3 py-1 h-auto bg-transparent"
              >
                <Zap className="w-3 h-3 mr-1" />
                Get Briefed Now
              </Button>
            </div>
          </div>
        </div>

        {/* Latest Brief Section */}
        <div className="mb-3 flex-shrink-0">
          <div className="bg-deep-blue/50 border border-light-gray-text/20 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white-text">Latest Brief</h3>
              <FileText className="w-4 h-4 text-primary-teal" />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-light-gray-text">{latestBrief.title}</p>
                <p className="text-xs text-light-gray-text">{latestBrief.timestamp}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-light-gray-text">{latestBrief.actionItems} Actions</span>
                </div>
              </div>
              <Button 
                onClick={() => onOpenBrief(latestBrief.id)}
                size="sm"
                className="bg-primary-teal text-white-text rounded-lg hover:bg-accent-green text-xs px-3 py-1 h-auto ml-2"
              >
                View
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons - Updated with new structure */}
        <div className="flex justify-center items-center gap-4 mb-3 flex-shrink-0 my-[6px] py-[3px]">
          <Button 
            onClick={onToggleCatchMeUp}
            className="flex-1 bg-primary-teal text-white-text rounded-xl px-6 py-3 hover:bg-accent-green"
          >
            <Zap className="w-4 h-4 mr-2" />
            Brief Me
          </Button>

          <DropdownMenu open={showStatusModal} onOpenChange={setShowStatusModal}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="flex-1 bg-deep-blue border border-light-gray-text/40 text-light-gray-text rounded-xl px-6 py-3 hover:border-light-gray-text/60"
              >
                Set Status
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-dark-navy border-light-gray-text/20 w-48">
              <DropdownMenuItem 
                onClick={() => handleStatusChange('focus')}
                className="text-white-text hover:bg-deep-blue/50"
              >
                <Focus className="mr-2 h-4 w-4" />
                Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusChange('offline')}
                className="text-white-text hover:bg-deep-blue/50"
              >
                <Clock className="mr-2 h-4 w-4" />
                Offline Mode
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* View All Briefs Button */}
        <div className="mb-2 flex-shrink-0">
          <Button 
            onClick={handleViewAllBriefs} 
            variant="outline"
            className="w-full bg-deep-blue/30 border border-light-gray-text/20 text-light-gray-text rounded-xl px-4 py-3 hover:border-light-gray-text/40 hover:text-white-text"
          >
            <Archive className="w-4 h-4 mr-2" />
            View All Briefs ({totalBriefs})
          </Button>
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

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling
          open={showSchedulingModal}
          onClose={handleCloseSchedulingModal}
          onGenerateSummary={handleGenerateSummaryWithScheduling}
          upcomingBriefName={upcomingBrief.name}
          upcomingBriefTime={upcomingBrief.scheduledTime}
        />
      </div>;
  }

  // Desktop View
  return <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Good morning, Alex
            </h1>
            <p className="text-text-secondary font-light text-gray-50">Let's get you caught up.</p>
          </div>
          
          {/* Updated CTAs on the right with Profile Dropdown */}
          <div className="flex gap-3 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all">
                  Update Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface border-border-subtle">
                <DropdownMenuItem onClick={onStartFocusMode} className="text-text-primary hover:bg-white/5">
                  <Headphones className="mr-2 h-4 w-4" />
                  Start Focus Mode
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onSignOffForDay} className="text-text-primary hover:bg-white/5">
                  <Clock className="mr-2 h-4 w-4" />
                  Sign Off for the Day
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={onToggleCatchMeUp} className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all">
              <Zap className="mr-2 h-4 w-4" />
              Brief Me
            </Button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 h-auto">
                  <Avatar className="h-10 w-10 border-2 border-border-subtle hover:border-accent-primary transition-colors cursor-pointer">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt="Alex Johnson" />
                    <AvatarFallback className="bg-accent-primary/20 text-accent-primary font-medium">
                      AJ
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
                  onClick={() => navigate("/dashboard/settings")}
                  className="h-auto p-0 text-sm text-text-secondary hover:text-accent-primary"
                >
                  Edit
                </Button>
              </div>
              <div className="border border-border-subtle bg-surface-overlay/30 shadow-sm rounded-2xl">
                <PrioritiesSection />
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
          upcomingBriefName={upcomingBrief.name}
          upcomingBriefTime={upcomingBrief.scheduledTime}
        />
      </div>
    </div>;
};

export default React.memo(HomeView);
