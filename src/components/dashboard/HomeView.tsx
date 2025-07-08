import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown, Play, Pause, Users, User, Settings, LogOut, CheckSquare, Star, ArrowRight } from "lucide-react";
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
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Hamburger Menu Button - Top Right */}
        <div className="fixed top-4 right-4 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-white/10"
              >
                <Menu className="h-5 w-5 text-white-text" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh] bg-dark-navy/95 backdrop-blur-xl border-light-gray-text/20">
              <div className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white-text">Menu</h2>
                
                <div className="space-y-6">
                  <button 
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg text-white-text hover:text-primary-teal transition-colors py-2"
                  >
                    Brief Schedule
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg text-white-text hover:text-primary-teal transition-colors py-2"
                  >
                    Priorities
                  </button>
                  
                  <button 
                    onClick={() => {
                      navigate("/dashboard/settings");
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-lg text-white-text hover:text-primary-teal transition-colors py-2"
                  >
                    Integrations
                  </button>
                  
                  <span className="block w-full text-left text-lg text-light-gray-text py-2">
                    Feedback
                  </span>
                  
                  <span className="block w-full text-left text-lg text-light-gray-text py-2">
                    Contact Us
                  </span>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Status Selector at Top */}
        {currentStatus === 'active' && (
          <div className="px-4 pt-4 pb-2 flex-shrink-0">
            <DropdownMenu open={showStatusModal} onOpenChange={setShowStatusModal}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full bg-surface-raised/30 border border-white/20 text-white-text rounded-lg px-4 py-3 hover:border-white/40 flex items-center justify-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span>Active</span>
                  <ChevronDown className="w-4 h-4 ml-auto" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-full bg-dark-navy/95 backdrop-blur-xl border-white/20 z-50" 
                align="center"
                side="bottom"
              >
                <DropdownMenuItem 
                  onClick={() => {
                    setCurrentStatus('active');
                    setShowStatusModal(false);
                  }} 
                  className="text-white-text hover:bg-white/10 cursor-pointer flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('focus')} 
                  className="text-white-text hover:bg-white/10 cursor-pointer"
                >
                  <Focus className="mr-2 h-4 w-4 text-primary-teal" />
                  Focus Mode
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleStatusChange('offline')} 
                  className="text-white-text hover:bg-white/10 cursor-pointer"
                >
                  <Clock className="mr-2 h-4 w-4 text-orange-400" />
                  Away
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Floating Status Pill - Top Left when active status */}
        {currentStatus !== 'active' && (
          <div className="fixed top-4 left-4 z-40">
            <div className="flex items-center gap-1 px-3 py-1.5 bg-surface-raised/90 backdrop-blur-md border border-white/20 rounded-full">
              {currentStatus === 'focus' ? (
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
          <h1 className="text-xl font-semibold text-white-text mb-1">
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-sm mb-4">Ready to catch up or focus?</p>
          
          {/* Accounts Section */}
          <div className="flex items-center justify-center">
            <ConnectedChannelsSection showAsHorizontal={true} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 space-y-6 overflow-y-auto">

          {/* Follow-ups/Actions - Max 2 Actions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-base font-medium">Follow-ups</h2>
              {actionItems.length > 2 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleViewAllTasks}
                  className="text-xs text-text-secondary hover:text-primary-teal h-6 px-2"
                >
                  See all
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {actionItems.slice(0, 2).map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-raised/30">
                  <div className="w-4 h-4 rounded border border-light-gray-text/30 mt-0.5 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white-text font-medium">{item.title}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-light-gray-text">
                      <span>from {item.sender}</span>
                      {item.isVip && (
                        <>
                          <span>•</span>
                          <Star className="w-3 h-3 text-green-400" fill="currentColor" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Single Upcoming Event */}
          <div className="space-y-3">
            <h2 className="text-text-primary text-base font-medium">Next meeting</h2>
            <div className="p-3 rounded-lg bg-surface-raised/30 border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-teal flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white-text font-medium">Team Standup</p>
                  <p className="text-xs text-light-gray-text">Today at 10:00 AM</p>
                </div>
                <ArrowRight className="w-4 h-4 text-light-gray-text" />
              </div>
            </div>
          </div>

          {/* Briefs Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-text-primary text-base font-medium">Briefs</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleViewAllBriefs}
                className="text-xs text-text-secondary hover:text-primary-teal h-6 px-2"
              >
                View all
              </Button>
            </div>
            <div 
              className="p-4 rounded-lg bg-surface-raised/30 border border-white/10 cursor-pointer"
              onClick={() => onOpenBrief(latestBrief.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayBrief(latestBrief.id);
                  }}
                  className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
                >
                  <Play className="h-4 w-4 text-primary-teal" />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-white-text font-medium">{latestBrief.name}</h3>
                  <p className="text-xs text-light-gray-text">{latestBrief.timeCreated}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-xs text-light-gray-text">
                <span>{latestBrief.slackMessages.total} Slack</span>
                <span>{latestBrief.emails.total} Emails</span>
                <span>{latestBrief.actionItems} Actions</span>
              </div>
            </div>
        </div>

        {/* Audio Player - Always Visible at Bottom */}
        <div className="border-t border-white/10 px-4 py-3 bg-surface-raised/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => playingBrief ? handlePlayBrief(playingBrief) : handlePlayBrief(latestBrief.id)}
              className="w-8 h-8 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors"
            >
              {playingBrief ? (
                <Pause className="h-4 w-4 text-primary-teal" />
              ) : (
                <Play className="h-4 w-4 text-primary-teal" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-white-text font-medium truncate">
                {playingBrief ? "Morning Brief" : latestBrief.name}
              </div>
              <div className="text-xs text-light-gray-text">
                {playingBrief ? "2:34 / 5:12" : "Ready to play"}
              </div>
            </div>
            {playingBrief && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPlayingBrief(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
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
    );
  }

  // Desktop View
  return <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-bold text-text-primary mb-2 text-2xl">
              Good morning, Alex
            </h1>
            
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

        {/* Desktop Grid Layout - Adjusted column widths */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - 7 columns (reduced from 8) */}
          <div className="col-span-7 space-y-6">
            {/* Briefs Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary text-lg">Daily Brief(s)</h2>
              </div>
              
              {/* Unified Brief Container with upcoming brief */}
              <BriefsContainer briefs={recentBriefs} totalBriefs={totalBriefs} onViewBrief={onOpenBrief} onViewTranscript={handleViewTranscript} onPlayBrief={handlePlayBrief} playingBrief={playingBrief} onViewAllBriefs={handleViewAllBriefs} onGetBriefedNow={handleGetBriefedNow} onUpdateSchedule={handleUpdateSchedule} upcomingBrief={upcomingBrief} />
            </div>

            {/* Calendar Section - New */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary text-lg">Calendar</h2>
              </div>
              <CalendarSection />
            </div>
          </div>
          
          {/* Sidebar - 5 columns (increased from 4) */}
          <div className="col-span-5 space-y-4">
            {/* Action Items Panel with header outside */}
            <div className="space-y-3 relative" onMouseEnter={() => setIsActionItemsHovered(true)} onMouseLeave={() => setIsActionItemsHovered(false)}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary text-lg">Follow ups (4)</h2>
                {isActionItemsHovered && <Button variant="ghost" onClick={handleViewAllTasks} className="absolute right-0 top-0 px-3 py-1.5 text-sm text-text-secondary hover:text-accent-primary hover:bg-white/10 flex items-center gap-1 rounded-lg transition-all duration-200 z-10">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>}
              </div>
              <ActionItemsPanel />
            </div>
            
            {/* Priorities Section with title outside */}
            <div className="space-y-3" onMouseEnter={() => setIsPrioritiesHovered(true)} onMouseLeave={() => setIsPrioritiesHovered(false)}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary text-lg">Priorities</h2>
                {isPrioritiesHovered && <Button variant="ghost" onClick={() => navigate("/dashboard/settings")} className="px-3 py-1.5 text-sm text-text-secondary hover:text-accent-primary hover:bg-white/10 rounded-lg transition-all duration-200">
                    Edit
                  </Button>}
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
                
                <Button onClick={handleTeamInterest} size="sm" className={`rounded-lg px-4 py-2 text-sm w-full ${waitlistStatus === 'added' ? 'bg-green-600 text-white hover:bg-green-600' : 'bg-accent-primary text-white hover:bg-accent-primary/90'}`} disabled={waitlistStatus === 'added'}>
                  {waitlistStatus === 'added' ? 'Added to waitlist' : 'Join waitlist'}
                </Button>
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