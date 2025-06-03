import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Import optimized section components
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PriorityPeopleSection from "./HomeViewSections/PriorityPeopleSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";
interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onStartFocusMode: () => void;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Sample urgent threads data
  const urgentThreads = [{
    channel: "# product",
    message: "New designs ready for review"
  }, {
    channel: "Sandra",
    message: "About the quarterly report"
  }, {
    channel: "# engineering",
    message: "Critical bug found in production"
  }, {
    channel: "Michael",
    message: "Urgent: Client meeting moved to 2 PM"
  }];

  // Combine brief and urgent threads for horizontal scroll (mobile)
  const allCards = [{
    type: 'brief',
    id: recentBriefs[0].id,
    title: recentBriefs[0].name,
    subtitle: recentBriefs[0].timeRange,
    description: `${recentBriefs[0].emails.total} emails, ${recentBriefs[0].slackMessages.total} messages`,
    icon: FileText,
    iconColor: "text-primary-teal",
    buttonText: "Read Brief",
    buttonVariant: "default" as const,
    onClick: () => onOpenBrief(recentBriefs[0].id)
  }, ...urgentThreads.map((thread, i) => ({
    type: 'urgent',
    id: `urgent-${i}`,
    title: thread.channel,
    subtitle: "Urgent Thread",
    description: thread.message,
    icon: Zap,
    iconColor: "text-accent-green",
    buttonText: "View Thread",
    buttonVariant: "outline" as const,
    onClick: () => console.log(`View thread: ${thread.channel}`)
  }))];

  // Mobile View
  if (isMobile) {
    return <div className="min-h-screen px-6 py-8 flex flex-col relative">
        {/* Mobile Menu Button - Top Right */}
        <div className="fixed top-8 right-6 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button size="icon" className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 text-light-gray-text hover:border-light-gray-text/60" variant="outline">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-dark-navy/95 backdrop-blur-xl border-light-gray-text/20">
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white-text">Menu</h2>
                </div>

                {/* Other Sections */}
                <div className="space-y-4">
                  <div className="border border-light-gray-text/20 rounded-2xl p-4 bg-deep-blue/30">
                    <ConnectedChannelsSection />
                  </div>
                  <div className="border border-light-gray-text/20 rounded-2xl p-4 bg-deep-blue/30">
                    <PriorityPeopleSection />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Mobile Welcome Section */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-3xl font-semibold text-white-text mb-3">
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-lg">Ready to catch up or focus?</p>
        </div>

        {/* Horizontal Scrolling Section for Briefs and Urgent Threads */}
        <div className="mb-8">
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-4">
              {allCards.map(card => <div key={card.id} className="flex-none w-72 border border-light-gray-text/20 rounded-2xl p-4 bg-deep-blue/30">
                  <div className="flex items-center gap-2 mb-2">
                    <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                    <h3 className="font-semibold text-white-text text-sm">{card.subtitle}</h3>
                  </div>
                  <p className="text-sm font-medium text-white-text mb-1">{card.title}</p>
                  <p className="text-sm text-light-gray-text mb-3">{card.description}</p>
                  <Button onClick={card.onClick} size="sm" variant={card.buttonVariant} className={card.buttonVariant === "default" ? "bg-primary-teal text-white-text rounded-xl hover:bg-accent-green" : "border-light-gray-text/40 text-light-gray-text rounded-xl hover:border-light-gray-text/60"}>
                    {card.buttonText}
                  </Button>
                </div>)}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Central "Brief Me" Button */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-16">
            {/* Enhanced gradient background with multiple layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal via-accent-green to-primary-teal rounded-full blur-3xl opacity-30 animate-pulse scale-110" style={{
            animationDuration: '4s'
          }}></div>
            <div className="absolute inset-0 bg-gradient-to-l from-accent-green via-primary-teal to-accent-green rounded-full blur-2xl opacity-40 animate-spin" style={{
            animationDuration: '8s'
          }}></div>
            
            {/* Main Brief Me Button */}
            <button onClick={onToggleCatchMeUp} className="relative w-48 h-48 rounded-full bg-gradient-to-br from-dark-navy via-deep-blue to-dark-navy text-white-text font-semibold text-2xl tracking-wide
                         shadow-[16px_16px_32px_rgba(0,0,0,0.5),-16px_-16px_32px_rgba(255,255,255,0.05)]
                         hover:shadow-[12px_12px_24px_rgba(0,0,0,0.6),-12px_-12px_24px_rgba(255,255,255,0.08)]
                         active:shadow-[8px_8px_16px_rgba(0,0,0,0.7),-8px_-8px_16px_rgba(255,255,255,0.1)]
                         transition-all duration-300 transform hover:scale-105 active:scale-98
                         border border-white/10">
              Brief Me
            </button>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center items-center gap-8 pb-8">
          <button onClick={onOpenBriefModal} className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <FileText className="w-6 h-6 text-light-gray-text" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                           flex items-center justify-center transition-all duration-200
                           hover:border-light-gray-text/60 hover:bg-deep-blue/90
                           active:scale-95">
                <ChevronDown className="w-6 h-6 text-light-gray-text" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-deep-blue border-light-gray-text/20">
              <DropdownMenuItem onClick={onStartFocusMode} className="text-white-text hover:bg-light-gray-text/10">
                <Headphones className="mr-2 h-4 w-4" />
                Start Focus Mode
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSignOffForDay} className="text-white-text hover:bg-light-gray-text/10">
                <Clock className="mr-2 h-4 w-4" />
                Sign Off for the Day
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={onToggleCatchMeUp} className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95">
            <Zap className="w-6 h-6 text-light-gray-text" />
          </button>
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
              Good morning, Alex
            </h1>
            <p className="text-text-secondary font-light text-slate-50">Let's get you caught up.</p>
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
              <BriefsContainer briefs={recentBriefs} onViewBrief={onOpenBrief} onViewTranscript={handleViewTranscript} />
            </div>
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-4">
            {/* Priority People Section - Compact */}
            <div className="border border-border-subtle p-4 bg-surface-overlay/30 shadow-sm px-[10px] py-0 rounded-2xl">
              <PriorityPeopleSection />
            </div>

            {/* Next Brief Section */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Next Scheduled Brief</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-text-primary">Midday Brief</p>
                  <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full rounded-xl border-border-subtle text-text-primary shadow-sm" onClick={handleUpdateSchedule}>
                Update Schedule
              </Button>
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
                  <p className="text-text-primary font-semibold mb-1">Coming Soon</p>
                  <p className="text-text-secondary text-sm">Meeting Proxy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default React.memo(HomeView);