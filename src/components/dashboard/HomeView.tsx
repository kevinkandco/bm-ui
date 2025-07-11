import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, ChevronRight, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight, Home, ChevronLeft, Calendar } from "lucide-react";
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
                <button 
                  onClick={handlePreviousDay}
                  disabled={selectedDate === "2 days ago"}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5 text-light-gray-text" />
                </button>
                <div className="flex items-center gap-1 px-2">
                  <Calendar className="w-3 h-3 text-light-gray-text" />
                  <span className="text-xs text-white-text font-medium min-w-[50px] text-center">{selectedDate}</span>
                </div>
                <button 
                  onClick={handleNextDay}
                  disabled={selectedDate === "Today"}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
                  <Button size="sm" onClick={handleGetBriefedNow} className="bg-primary-teal hover:bg-primary-teal/90 text-white text-xs px-2 py-1 h-6">
                    Get briefed now
                  </Button>
                </div>
              </div>}
          </div>

          {/* Action Items - Reduced spacing */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-sm font-medium">Follow ups</h2>
              <Button size="sm" variant="ghost" onClick={handleViewAllTasks} className="text-xs text-light-gray-text hover:text-primary-teal">
                View all
              </Button>
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {actionItems.slice(0, 4).map(item => <div key={item.id} className="p-2 rounded-lg bg-surface-raised/30 border border-white/10">
                  <div className="flex items-start gap-2">
                    <CheckSquare className="w-3.5 h-3.5 text-primary-teal mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white-text">{item.title}</p>
                      <p className="text-xs text-light-gray-text mt-0.5">from {item.sender}</p>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface-raised/90 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Home */}
            <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-primary-teal">
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </Button>

            {/* Briefs */}
            <Button variant="ghost" size="sm" onClick={handleViewAllBriefs} className="flex flex-col items-center gap-1 text-light-gray-text hover:text-primary-teal">
              <Headphones className="h-4 w-4" />
              <span className="text-xs">Briefs</span>
            </Button>

            {/* Tasks */}
            <Button variant="ghost" size="sm" onClick={handleViewAllTasks} className="flex flex-col items-center gap-1 text-light-gray-text hover:text-primary-teal relative">
              <CheckSquare className="h-4 w-4" />
              <span className="text-xs">Tasks</span>
              {actionItems.filter(item => !item.completed).length > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {actionItems.filter(item => !item.completed).length}
                </div>}
            </Button>

            {/* Settings */}
            <Button variant="ghost" size="sm" onClick={handleAllSettingsClick} className="flex flex-col items-center gap-1 text-light-gray-text hover:text-primary-teal">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </Button>
          </div>
        </div>
      </div>;
  }

  // Desktop View
  return <div className="min-h-screen bg-surface-primary">
      
      {/* Desktop Layout */}
      <div className="min-h-screen bg-surface-primary">
        
        {/* Top Bar - Single Line */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-border-subtle/30">
          {/* Left - Brief Me Logo Pill */}
          <div className="bg-accent-primary/10 text-accent-primary px-4 py-2 rounded-full font-medium text-sm">
            Brief Me
          </div>
          
          {/* Center - Intentionally Blank */}
          <div className="flex-1"></div>
          
          {/* Right - Profile Avatar */}
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Alex" />
              <AvatarFallback className="bg-accent-primary text-white">A</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Greeting / Stats Row */}
        <div className="flex items-center justify-between px-8 py-6 bg-surface-overlay/20">
          {/* Left - Greeting */}
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Good morning, Alex 👋</h1>
            <p className="text-text-secondary mt-1">Ready to catch up on what matters</p>
          </div>
          
          {/* Center - Intentionally Blank */}
          <div className="flex-1"></div>
          
          {/* Right - Three Big Number Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">47</div>
              <div className="text-xs text-text-secondary">Interrupts Prevented</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">3.2h</div>
              <div className="text-xs text-text-secondary">Focus Gained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text-primary">{actionItems.length}</div>
              <div className="text-xs text-text-secondary">Follow-ups</div>
            </div>
          </div>
        </div>

        {/* Three-Column Content Grid */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-12 gap-8">
            
            {/* Column 1 - Navigation List (2 columns) */}
            <div className="col-span-2">
              <nav className="space-y-2">
                <button 
                  onClick={() => navigate("/dashboard")}
                  className="w-full text-left px-4 py-3 rounded-lg bg-accent-primary/10 text-accent-primary font-medium"
                >
                  Briefs
                </button>
                <button 
                  onClick={handleViewAllTasks}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-overlay/30 text-text-primary transition-colors"
                >
                  Follow-ups
                </button>
                <button 
                  onClick={() => navigate("/dashboard/settings")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-overlay/30 text-text-primary transition-colors"
                >
                  Referrals
                </button>
                <button 
                  onClick={handleAllSettingsClick}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-surface-overlay/30 text-text-primary transition-colors"
                >
                  Settings
                </button>
              </nav>
            </div>

            {/* Column 2 - Core Work (7 columns) */}
            <div className="col-span-7 space-y-6">
              
              {/* Today's Schedule */}
              <div className="bg-surface-overlay/30 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary">Today's Schedule</h2>
                  <Calendar className="h-5 w-5 text-accent-primary" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-overlay/40">
                    <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-text-primary">Team Standup</p>
                          <p className="text-sm text-text-secondary">10:00 AM - 10:30 AM</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white">
                            Join Live
                          </Button>
                          <Button size="sm" variant="ghost" className="text-text-secondary hover:text-accent-primary">
                            Send Proxy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-overlay/40 transition-colors">
                    <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Product Review</p>
                      <p className="text-sm text-text-secondary">1:30 PM - 2:30 PM</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-overlay/40 transition-colors">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-text-primary">Client Call</p>
                      <p className="text-sm text-text-secondary">3:00 PM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Latest Brief Card */}
              <div className="space-y-4">
                {/* Day Picker */}
                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1 bg-surface-raised/40 rounded-full px-3 py-2">
                    <button 
                      onClick={handlePreviousDay}
                      disabled={selectedDate === "2 days ago"}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4 text-light-gray-text" />
                    </button>
                    <div className="flex items-center gap-2 px-3">
                      <Calendar className="w-4 h-4 text-light-gray-text" />
                      <span className="text-sm text-white-text font-medium min-w-[70px] text-center">{selectedDate}</span>
                    </div>
                    <button 
                      onClick={handleNextDay}
                      disabled={selectedDate === "Today"}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4 text-light-gray-text" />
                    </button>
                  </div>
                </div>
                
                {/* Brief Container */}
                <BriefsContainer briefs={recentBriefs} totalBriefs={totalBriefs} onViewBrief={onOpenBrief} onViewTranscript={handleViewTranscript} onPlayBrief={handlePlayBrief} playingBrief={playingBrief} onViewAllBriefs={handleViewAllBriefs} onGetBriefedNow={handleGetBriefedNow} onUpdateSchedule={handleUpdateSchedule} upcomingBrief={upcomingBrief} />
              </div>
            </div>

            {/* Column 3 - Action Rail (3 columns) */}
            <div className="col-span-3">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-text-primary">Follow-ups</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleViewAllTasks}
                    className="text-accent-primary hover:text-accent-primary/80"
                  >
                    View All
                  </Button>
                </div>
                <ActionItemsPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Catch Me Up Modal with Scheduling Options */}
        <CatchMeUpWithScheduling open={showSchedulingModal} onClose={handleCloseSchedulingModal} onGenerateSummary={handleGenerateSummaryWithScheduling} upcomingBriefName={upcomingBrief.name} upcomingBriefTime={upcomingBrief.scheduledTime} />
      </div>
    </div>;
};

export default HomeView;