import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, ChevronRight, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight, Home, ChevronLeft, Calendar, Network, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "./HomeViewSections/PrioritiesSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";
import ListeningScreen from "./ListeningScreen";
import CatchMeUpWithScheduling from "./CatchMeUpWithScheduling";
import ActionItemsPanel from "./ActionItemsPanel";
import CalendarSection from "./HomeViewSections/CalendarSection";
interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
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
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [showSchedulingModal, setShowSchedulingModal] = useState(false);
  const [waitlistStatus, setWaitlistStatus] = useState<'initial' | 'added'>('initial');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<'active' | 'focus' | 'offline'>('active');
  const [isActionItemsHovered, setIsActionItemsHovered] = useState(false);
  const [isPrioritiesHovered, setIsPrioritiesHovered] = useState(false);
  const [isBriefsHovered, setIsBriefsHovered] = useState(false);
  const [showBriefDetail, setShowBriefDetail] = useState(false);
  const [showUpcomingBrief, setShowUpcomingBrief] = useState(false);
  const [selectedDate, setSelectedDate] = useState("Today");

  // Sample connected integrations
  const connectedIntegrations = [{
    name: "Slack",
    channels: 12
  }, {
    name: "Gmail",
    emails: 5
  }, {
    name: "Google Calendar",
    events: 3
  }];

  // Sample action items for mobile with proper typing
  const [actionItems] = useState<Array<{
    id: string;
    title: string;
    source: 'slack' | 'gmail';
    sender: string;
    isVip: boolean;
    priorityPerson?: string;
    triggerKeyword?: string;
    urgency?: 'critical' | 'high' | 'medium' | 'low';
    isNew: boolean;
    createdAt: string;
    threadUrl: string;
    completed: boolean;
    lastActivity: string;
  }>>([{
    id: '1',
    title: 'Approve Q3 budget proposal',
    source: 'slack' as const,
    sender: 'Sarah Chen',
    isVip: true,
    priorityPerson: 'Sarah Chen',
    triggerKeyword: 'budget',
    urgency: 'critical' as const,
    isNew: false,
    createdAt: '2024-06-30T08:00:00Z',
    threadUrl: 'https://app.slack.com/client/T123/C456/p789',
    completed: false,
    lastActivity: '2024-06-30T08:00:00Z'
  }, {
    id: '2',
    title: 'Review contract amendments',
    source: 'gmail' as const,
    sender: 'legal@company.com',
    isVip: false,
    urgency: 'high' as const,
    isNew: true,
    createdAt: '2024-06-30T09:30:00Z',
    threadUrl: 'https://mail.google.com/mail/u/0/#inbox/abc123',
    completed: false,
    lastActivity: '2024-06-30T09:30:00Z'
  }, {
    id: '3',
    title: 'Sign off on marketing campaign',
    source: 'slack' as const,
    sender: 'Mike Johnson',
    isVip: true,
    priorityPerson: 'Mike J',
    triggerKeyword: 'urgent',
    urgency: 'critical' as const,
    isNew: false,
    createdAt: '2024-06-29T14:20:00Z',
    threadUrl: 'https://app.slack.com/client/T123/C456/p790',
    completed: false,
    lastActivity: '2024-06-29T14:20:00Z'
  }, {
    id: '4',
    title: 'Provide feedback on design mockups',
    source: 'gmail' as const,
    sender: 'design@company.com',
    isVip: false,
    urgency: 'medium' as const,
    isNew: true,
    createdAt: '2024-06-29T11:15:00Z',
    threadUrl: 'https://mail.google.com/mail/u/0/#inbox/def456',
    completed: false,
    lastActivity: '2024-06-29T11:15:00Z'
  }, {
    id: '5',
    title: 'Update quarterly presentation slides',
    source: 'slack' as const,
    sender: 'team@company.com',
    isVip: false,
    urgency: 'low' as const,
    isNew: false,
    createdAt: '2024-06-28T16:30:00Z',
    threadUrl: 'https://app.slack.com/client/T123/C456/p791',
    completed: false,
    lastActivity: '2024-06-28T16:30:00Z'
  }]);
  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);
  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);
  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);
  const handleViewAllTasks = useCallback(() => {
    navigate("/dashboard/tasks");
  }, [navigate]);
  const handleViewTranscript = useCallback((briefId: number) => {
    onViewTranscript(briefId);
  }, [onViewTranscript]);
  const handlePlayBrief = useCallback((briefId: number) => {
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

  // Day picker handlers
  const handlePreviousDay = useCallback(() => {
    console.log("Previous day clicked, current selectedDate:", selectedDate);
    if (selectedDate === "Today") {
      setSelectedDate("Yesterday");
    } else if (selectedDate === "Yesterday") {
      setSelectedDate("2 days ago");
    }
  }, [selectedDate]);
  const handleNextDay = useCallback(() => {
    console.log("Next day clicked, current selectedDate:", selectedDate);
    if (selectedDate === "2 days ago") {
      setSelectedDate("Yesterday");
    } else if (selectedDate === "Yesterday") {
      setSelectedDate("Today");
    }
  }, [selectedDate]);

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
    navigate("/dashboard/settings", {
      state: {
        activeSection: "profile"
      }
    });
  }, [navigate]);
  const handleIntegrationsClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: {
        activeSection: "integrations"
      }
    });
  }, [navigate]);
  const handleBriefConfigClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: {
        activeSection: "brief-config"
      }
    });
  }, [navigate]);
  const handleAllSettingsClick = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  // Sample brief data
  const recentBriefs = [{
    id: 1,
    name: "Morning Brief",
    timeCreated: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    slackMessages: {
      total: 12,
      fromPriorityPeople: 3
    },
    emails: {
      total: 5,
      fromPriorityPeople: 2
    },
    actionItems: 4,
    hasTranscript: true
  }, {
    id: 2,
    name: "Evening Brief",
    timeCreated: "Yesterday, 8:00 PM",
    timeRange: "5:00 PM - 8:00 PM",
    slackMessages: {
      total: 8,
      fromPriorityPeople: 1
    },
    emails: {
      total: 3,
      fromPriorityPeople: 0
    },
    actionItems: 2,
    hasTranscript: true
  }, {
    id: 3,
    name: "Afternoon Brief",
    timeCreated: "Yesterday, 4:00 PM",
    timeRange: "1:00 PM - 4:00 PM",
    slackMessages: {
      total: 15,
      fromPriorityPeople: 4
    },
    emails: {
      total: 7,
      fromPriorityPeople: 3
    },
    actionItems: 5,
    hasTranscript: true
  }];

  // Sample upcoming brief data
  const upcomingBrief = {
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  };

  // Latest brief (most recent)
  const latestBrief = {
    id: 1,
    name: "Morning Brief",
    timeCreated: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    slackMessages: {
      total: 12,
      fromPriorityPeople: 3
    },
    emails: {
      total: 5,
      fromPriorityPeople: 2
    },
    actionItems: 4
  };

  // Total briefs ever created (this would come from your backend/state in a real app)
  const totalBriefs = 47;

  // Mobile View  
  if (isMobile) {
    return <div className="h-screen flex flex-col overflow-hidden">

        {/* Floating Status Pill - Top Left when active status */}
        {currentStatus !== 'active' && <div className="fixed top-3 left-3 z-40">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-surface-raised/90 backdrop-blur-md border border-white/20 rounded-full">
              {currentStatus === 'focus' ? <>
                  <Focus className="w-3 h-3 text-primary-teal" />
                  <span className="text-xs text-white-text">Focus</span>
                </> : <>
                  <Clock className="w-3 h-3 text-orange-400" />
                  <span className="text-xs text-white-text">Away</span>
                </>}
              <button onClick={handleExitStatus} className="ml-1 hover:bg-white/10 rounded-full p-0.5 transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>}

        {/* Welcome Header Section - Optimized spacing */}
        <div className="text-center px-4 py-3 flex-shrink-0">
          <h1 className="text-lg font-semibold text-white-text mb-1">
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-sm mb-3">Ready to catch up or focus?</p>
          
          {/* Monitoring Section */}
          <div className="flex items-center justify-center">
            <ConnectedChannelsSection showAsHorizontal={true} />
          </div>
        </div>

        {/* Main Content - Fixed height container with padding for fixed nav */}
        <div className="flex-1 px-4 space-y-3 overflow-y-auto pb-32">

          {/* Meetings - Reduced height */}
          <div className="space-y-2">
            <h2 className="text-text-primary text-sm font-medium">Meetings</h2>
            <div className="space-y-1.5">
              <div className="p-2.5 rounded-lg bg-surface-raised/30 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-primary-teal flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white-text font-medium">Team Standup</p>
                    <p className="text-xs text-light-gray-text">Today at 10:00 AM</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-light-gray-text" />
                </div>
              </div>
              
              <div className="p-2.5 rounded-lg bg-surface-raised/30 border border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white-text font-medium">Product Review</p>
                    <p className="text-xs text-light-gray-text">Today at 2:00 PM</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-light-gray-text" />
                </div>
              </div>
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
            <div className="p-2.5 rounded-lg bg-surface-raised/30 border border-white/10 cursor-pointer hover:bg-surface-raised/40 transition-colors" onClick={() => {
            handlePlayBrief(latestBrief.id);
            setShowBriefDetail(true);
          }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary-teal/20 flex items-center justify-center flex-shrink-0">
                  <Play className="h-4 w-4 text-primary-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white-text font-medium">{latestBrief.name}</h3>
                  <p className="text-xs text-light-gray-text">{latestBrief.timeCreated}</p>
                  <div className="flex items-center gap-3 text-xs text-light-gray-text mt-0.5">
                    <span>{latestBrief.slackMessages.total} Slack</span>
                    <span>{latestBrief.emails.total} Emails</span>
                    <span>{latestBrief.actionItems} Actions</span>
                  </div>
                </div>
              </div>
            </div>
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
                      <p className="text-sm text-white-text font-medium">{upcomingBrief.name}</p>
                      <p className="text-xs text-light-gray-text">{upcomingBrief.scheduledTime}</p>
                    </div>
                  </div>
                  <Button onClick={handleGetBriefedNow} size="sm" variant="outline" className="border-primary-teal/60 text-primary-teal hover:border-primary-teal hover:text-white text-xs px-2.5 py-1 h-auto bg-transparent">
                    <Zap className="w-3 h-3 mr-1" />
                    Now
                  </Button>
                </div>
              </div>}
          </div>
        </div>

        {/* Fixed Audio Player - Above Bottom Nav */}
        <div className="fixed bottom-16 left-0 right-0 border-t border-white/10 px-4 py-2 bg-surface-raised/80 backdrop-blur-md cursor-pointer hover:bg-surface-raised/90 transition-colors" onClick={() => setShowBriefDetail(true)}>
          <div className="flex items-center gap-2.5">
            <button onClick={e => {
            e.stopPropagation();
            playingBrief ? handlePlayBrief(playingBrief) : handlePlayBrief(latestBrief.id);
          }} className="w-7 h-7 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors">
              {playingBrief ? <Pause className="h-3.5 w-3.5 text-primary-teal" /> : <Play className="h-3.5 w-3.5 text-primary-teal" />}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white-text font-medium truncate">
                {playingBrief ? "Morning Brief" : latestBrief.name}
              </div>
              <div className="text-xs text-light-gray-text">
                {playingBrief ? "2:34 / 5:12" : "Ready to play"}
              </div>
            </div>
            {playingBrief && <Button variant="ghost" size="sm" onClick={e => {
            e.stopPropagation();
            setPlayingBrief(null);
          }} className="h-7 w-7 p-0">
                <X className="h-3.5 w-3.5" />
              </Button>}
            <ChevronDown className="h-4 w-4 text-light-gray-text" />
          </div>
        </div>

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
                    {currentStatus === 'active' && <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>}
                    {currentStatus === 'focus' && <div className="w-5 h-5 rounded-full bg-primary-teal/20 flex items-center justify-center border-2 border-primary-teal">
                        <Focus className="h-3 w-3 text-primary-teal" />
                      </div>}
                    {currentStatus === 'offline' && <div className="w-5 h-5 rounded-full bg-orange-400/20 flex items-center justify-center border-2 border-orange-400">
                        <Clock className="h-3 w-3 text-orange-400" />
                      </div>}
                    {/* Active indicator dot */}
                    {currentStatus !== 'active' && <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 border border-white"></div>}
                  </div>
                  <span className={`text-xs font-medium ${currentStatus === 'active' ? 'text-green-400' : currentStatus === 'focus' ? 'text-primary-teal' : 'text-orange-400'}`}>Status</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[40vh] bg-dark-navy/95 backdrop-blur-xl border-white/20">
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-semibold text-white-text">Set Status</h2>
                  
                  <div className="space-y-3">
                    <button onClick={() => {
                    setCurrentStatus('active');
                    setShowStatusModal(false);
                  }} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <div className="w-4 h-4 rounded-full bg-green-400"></div>
                      <span className="text-white-text">Active</span>
                    </button>
                    
                    <button onClick={() => handleStatusChange('focus')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Focus className="h-4 w-4 text-primary-teal" />
                      <span className="text-white-text">Focus Mode</span>
                    </button>
                    
                    <button onClick={() => handleStatusChange('offline')} className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
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
          <SheetContent side="bottom" className="h-[90vh] bg-dark-navy/95 backdrop-blur-xl border-white/20 overflow-hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white-text">Morning Brief</h2>
                  <Button variant="ghost" size="sm" onClick={() => setShowBriefDetail(false)} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-light-gray-text mt-1">Today, 8:00 AM • 5:00 AM - 8:00 AM</p>
              </div>

              {/* Content */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-6">
                  {/* Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-white-text mb-3">Summary</h3>
                    <p className="text-text-secondary leading-relaxed">
                      This morning's brief covers critical updates from your priority channels. Sarah Chen requires urgent approval for the Q3 budget proposal, and there are several high-priority items requiring your attention before the team standup at 10 AM.
                    </p>
                  </div>

                  {/* Action Items */}
                  <div>
                    <h3 className="text-lg font-medium text-white-text mb-3">Action Items ({actionItems.length})</h3>
                    <div className="space-y-3">
                      {actionItems.map(item => <div key={item.id} className="p-3 rounded-lg bg-surface-raised/30 border border-white/10">
                          <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded border border-light-gray-text/30 mt-0.5 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm text-white-text font-medium">{item.title}</p>
                              <div className="flex items-center gap-2 mt-1 text-xs text-light-gray-text">
                                <span>from {item.sender}</span>
                                {item.isVip && <>
                                    <span>•</span>
                                    <Star className="w-3 h-3 text-green-400" fill="currentColor" />
                                  </>}
                                <span>•</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${item.urgency === 'critical' ? 'bg-red-500/20 text-red-400' : item.urgency === 'high' ? 'bg-orange-500/20 text-orange-400' : item.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {item.urgency}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </div>

                  {/* Messages Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-white-text mb-3">Messages Analyzed</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-surface-raised/30">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                          <span className="text-sm font-medium text-white-text">Slack</span>
                        </div>
                        <p className="text-lg font-semibold text-white-text">{latestBrief.slackMessages.total}</p>
                        <p className="text-xs text-light-gray-text">{latestBrief.slackMessages.fromPriorityPeople} from priority people</p>
                      </div>
                      <div className="p-3 rounded-lg bg-surface-raised/30">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
                          <span className="text-sm font-medium text-white-text">Gmail</span>
                        </div>
                        <p className="text-lg font-semibold text-white-text">{latestBrief.emails.total}</p>
                        <p className="text-xs text-light-gray-text">{latestBrief.emails.fromPriorityPeople} from priority people</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling open={showSchedulingModal} onClose={handleCloseSchedulingModal} onGenerateSummary={handleGenerateSummaryWithScheduling} upcomingBriefName={upcomingBrief.name} upcomingBriefTime={upcomingBrief.scheduledTime} />
      </div>;
  }

  // Desktop View
  return <div className="min-h-screen flex">
      {/* Full Height Sidebar - Made Narrower */}
      <div className="w-64 bg-surface-raised/20 flex flex-col">
        <div className="p-4 space-y-4 flex-1">
          {/* Profile Section - Moved to top, removed email */}
          <div className="flex items-center gap-3 p-3 rounded-lg">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary-teal text-white text-sm">AK</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white-text text-sm font-medium">Alex</p>
            </div>
          </div>

          {/* Connected Integrations Status */}
          <div className="flex items-center justify-center gap-2">
            {connectedIntegrations.map((integration, i) => (
              <div key={i} className="relative flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200">
                <div className="flex items-center justify-center relative">
                  {integration.name === 'Slack' && <div className="w-3 h-3 text-primary-teal"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></svg></div>}
                  {integration.name === 'Gmail' && <Mail className="w-3 h-3 text-primary-teal" />}
                  {integration.name === 'Calendar' && <Calendar className="w-3 h-3 text-primary-teal" />}
                  {/* Status dot */}
                  <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 bg-green-400"></div>
                </div>
                {/* Count badge */}
                {(integration.channels || integration.emails || integration.events) > 1 && (
                  <span className="text-xs font-medium text-white bg-white/20 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                    {integration.channels || integration.emails || integration.events}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Upcoming Brief - Moved above Brief Me button */}
          <div className="space-y-1">
            <p className="text-text-secondary text-xs">Upcoming brief</p>
            <p className="text-text-primary text-xs font-medium">{upcomingBrief.scheduledTime}</p>
          </div>

          {/* Brief Me Button - Removed shadow, smaller */}
          <Button onClick={onOpenBriefModal} className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white rounded-md py-2 font-medium text-sm shadow-none">
            Brief Me
          </Button>

          {/* Navigation Items - Added hover states, reduced text size, left aligned */}
          <div className="space-y-1">
            <button onClick={handleViewAllBriefs} className="w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 text-primary-teal group">
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">Briefs</span>
            </button>
            <button onClick={handleViewAllTasks} className="w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group">
              <CheckSquare className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Follow-ups</span>
            </button>
            <button className="w-full flex items-start gap-3 p-2 text-left hover:bg-surface-raised/60 rounded-lg transition-all duration-200 group">
              <Calendar className="w-4 h-4 text-light-gray-text group-hover:text-primary-teal group-hover:scale-110 transition-all" />
              <span className="text-light-gray-text group-hover:text-white transition-colors text-sm">Meetings</span>
            </button>
          </div>

          {/* Brief Me Teams Card */}
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
              
              <Button onClick={handleTeamInterest} size="sm" className={`rounded-lg px-3 py-1.5 text-xs w-full ${waitlistStatus === 'added' ? 'bg-green-600 text-white hover:bg-green-600' : 'bg-accent-primary text-white hover:bg-accent-primary/90'}`} disabled={waitlistStatus === 'added'}>
                {waitlistStatus === 'added' ? 'Added to waitlist' : 'Join waitlist'}
              </Button>
            </div>
          </div>
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
          {/* Connected Channels Section */}
          <div className="mb-6">
            <ConnectedChannelsSection showAsHorizontal={true} />
          </div>

          {/* Two-Column Content Grid with Unified Background */}
          <div className="grid grid-cols-3 gap-6">
            {/* Combined Briefs and Follow-ups area with shared background */}
            <div className="col-span-3 card-dark p-6" style={{
            background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)'
          }}>
              <div className="grid grid-cols-3 gap-6">
                {/* Briefs area (2/3) */}
                <div className="col-span-2">
                  {/* Stats Row - Moved from sidebar */}
                  

                  {/* Good morning greeting */}
                  <div className="mb-6">
                    <h1 className="font-bold text-text-primary text-2xl">
                      Good morning, Alex
                    </h1>
                  </div>
                  
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
                  
                  <BriefsContainer briefs={recentBriefs} totalBriefs={totalBriefs} onViewBrief={onOpenBrief} onViewTranscript={handleViewTranscript} onPlayBrief={handlePlayBrief} playingBrief={playingBrief} onViewAllBriefs={handleViewAllBriefs} onGetBriefedNow={handleGetBriefedNow} onUpdateSchedule={handleUpdateSchedule} upcomingBrief={upcomingBrief} />
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
                    <ActionItemsPanel />
                  </div>
                  
                  {/* Calendar Section */}
                  <CalendarSection />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling open={showSchedulingModal} onClose={handleCloseSchedulingModal} onGenerateSummary={handleGenerateSummaryWithScheduling} upcomingBriefName={upcomingBrief.name} upcomingBriefTime={upcomingBrief.scheduledTime} />
      </div>
    </div>;
};
export default React.memo(HomeView);