import React, { useState, useCallback, useMemo } from "react";
import { Zap, Headphones, Archive, Menu, X, Power, FileText, Focus, Clock, ChevronDown, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatusTimer, { StatusTimerProps } from "@/components/dashboard/StatusTimer";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "./HomeViewSections/PrioritiesSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";
import { PriorityPeople, Summary } from "./types";
import useAuthStore from "@/store/useAuthStore";
import ListeningScreen from "./ListeningScreen";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  priorityPeople: PriorityPeople[];
  latestBrief: Summary;
  status: "active" | "away" | "focus" | "vacation";
  onExitFocusMode: () => void;
  focusModeExitLoading: boolean;
  onToggleSignOff: () => void;
  onStartFocusMode: (focusTime: number) => void;
  onSignOffForDay: () => void;
}
const HomeView = ({
  onOpenBrief,
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
  const {user} = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);
  
  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);
  
  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);
  const handleViewTranscript = useCallback((briefId: number) => {
    toast({
      title: "Transcript",
      description: `Opening transcript for brief ${briefId}`
    });
  }, [toast]);
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
    name: "Midday Brief",
    timeCreated: "Today, 12:30 PM",
    timeRange: "8:00 AM - 12:30 PM",
    slackMessages: {
      total: 18,
      fromPriorityPeople: 5
    },
    emails: {
      total: 8,
      fromPriorityPeople: 3
    },
    actionItems: 6,
    hasTranscript: true
  }, {
    id: 3,
    name: "Evening Brief",
    timeCreated: "Yesterday, 6:00 PM",
    timeRange: "12:30 PM - 6:00 PM",
    slackMessages: {
      total: 14,
      fromPriorityPeople: 2
    },
    emails: {
      total: 6,
      fromPriorityPeople: 1
    },
    actionItems: 3,
    hasTranscript: false
  }];

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

                {/* Simple Menu Links */}
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
        <div className="text-center flex-shrink-0 mt-4 mb-2">
          <h1 className="text-xl font-semibold text-white-text mb-0">
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-sm">Ready to catch up or focus?</p>
        </div>

        {/* Central Animated "Brief Me" Button - Reduced spacing */}
        <div className="flex-1 flex flex-col items-center justify-center my-0 mx-0 px-0 py-[8px]">
          <div className="relative">
            <ListeningScreen isListening={true} title="brief-me is monitoring" />
          </div>
        </div>

        {/* Action Buttons - Above Recent Briefs */}
        <div className="flex justify-center items-center gap-4 mb-3 flex-shrink-0 my-[6px] py-[3px]">
          <button onClick={onOpenBriefModal} className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <FileText className="w-4 h-4 text-light-gray-text" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                           flex items-center justify-center transition-all duration-200
                           hover:border-light-gray-text/60 hover:bg-deep-blue/90
                           active:scale-95">
                <ChevronDown className="w-4 h-4 text-light-gray-text" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-deep-blue border-light-gray-text/20">
              <DropdownMenuItem onClick={() => onStartFocusMode(30)} className="text-white-text hover:bg-light-gray-text/10">
                <Headphones className="mr-2 h-4 w-4" />
                Start Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOffForDay} className="text-white-text hover:bg-light-gray-text/10">
                <Clock className="mr-2 h-4 w-4" />
                Sign Off for the Day
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={onToggleCatchMeUp} className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <Zap className="w-4 h-4 text-light-gray-text" />
          </button>
        </div>

        {/* Mobile Recent Briefs - Below action buttons - Very compact */}
        <div className="mb-2 flex-shrink-0">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-white-text">Recent Briefs</h2>
            <Button onClick={handleViewAllBriefs} variant="ghost" size="sm" className="text-light-gray-text text-xs">
              View All
            </Button>
          </div>
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-2">
              {recentBriefs.map(brief => <div key={brief.id} className="flex-none w-48 border border-light-gray-text/20 rounded-xl p-2 bg-deep-blue/30">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-surface-raised/50 flex items-center justify-center">
                      <FileText className="h-2 w-2 text-primary-teal" />
                    </div>
                    <button onClick={() => handlePlayBrief(brief.id)} className="w-4 h-4 rounded-full bg-primary-teal/20 flex items-center justify-center hover:bg-primary-teal/30 transition-colors">
                      {playingBrief === brief.id ? <div className="flex items-center gap-0.5">
                          <div className="w-0.5 h-1.5 bg-primary-teal rounded-full animate-pulse" style={{
                      animationDelay: '0ms'
                    }} />
                          <div className="w-0.5 h-2 bg-primary-teal rounded-full animate-pulse" style={{
                      animationDelay: '150ms'
                    }} />
                          <div className="w-0.5 h-1.5 bg-primary-teal rounded-full animate-pulse" style={{
                      animationDelay: '300ms'
                    }} />
                        </div> : <Play className="h-1.5 w-1.5 text-primary-teal" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xs font-semibold text-white-text truncate">
                        {brief.name}
                      </h3>
                      <p className="text-xs text-light-gray-text truncate">
                        {brief.timeCreated}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 mb-1">
                    <div className="flex items-center justify-between text-xs text-light-gray-text">
                      <span>{brief.slackMessages.total} Slack</span>
                      <span>{brief.emails.total} Emails</span>
                      <span>{brief.actionItems} Actions</span>
                    </div>
                  </div>
                  <Button onClick={() => onOpenBrief(brief.id)} size="sm" className="w-full bg-primary-teal text-white-text rounded-lg hover:bg-accent-green text-xs py-0.5 h-6">
                    View Brief
                  </Button>
                </div>)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>;
  }

  // Desktop View
  return <div className="min-h-screen px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Good morning, {user.name}
            </h1>
            <p className="text-text-secondary font-light text-gray-50">Let's get you caught up.</p>
          </div>
          
          {/* Updated CTAs on the right */}
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all">
                  Update Status
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-surface border-border-subtle">
                <DropdownMenuItem onClick={() => onStartFocusMode(30)} className="text-text-primary hover:bg-white/5">
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
                <h2 className="text-xl font-semibold text-text-primary">Recent Briefs</h2>
                <Button onClick={handleViewAllBriefs} variant="outline" className="rounded-xl border-border-subtle text-text-primary shadow-sm">
                  <Archive className="mr-2 h-4 w-4" />
                  View All Briefs
                </Button>
              </div>
              
              {/* Unified Brief Container */}
              <BriefsContainer briefs={recentBriefs} onViewBrief={onOpenBrief} onViewTranscript={handleViewTranscript} onPlayBrief={handlePlayBrief} playingBrief={playingBrief} />
            </div>
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-4">
            {/* Next Brief Section - Now first */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm py-[9px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-text-primary text-base">Next Scheduled Brief</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-text-primary text-sm">Midday Brief</p>
                  <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full rounded-xl border-border-subtle text-text-primary shadow-sm" onClick={handleUpdateSchedule}>
                Update Schedule
              </Button>
            </div>

            {/* Priorities Section - Compact */}
            <div className="border border-border-subtle p-4 bg-surface-overlay/30 shadow-sm px-[10px] py-0 rounded-2xl">
              <PrioritiesSection />
            </div>
            
            {/* Upcoming Meetings - Blurred Coming Soon */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm relative overflow-hidden">
              <div className="filter blur-sm">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-text-primary">Weekly Standup</p>
                      <p className="text-sm text-text-secondary">10:00 AM - 4 attendees</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                    <div>
                      <p className="font-medium text-text-primary">Product Review</p>
                      <p className="text-sm text-text-secondary">1:30 PM - 6 attendees</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Coming Soon Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
                <div className="text-center">
                  <p className="text-text-primary font-semibold mb-1">AI Meeting Proxy</p>
                  <p className="text-text-secondary text-xs">Coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default React.memo(HomeView);