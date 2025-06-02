import React, { useState, useCallback, useMemo } from "react";
import { Zap, Headphones, Archive, Menu, X, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatusTimer, { StatusTimerProps } from "@/components/dashboard/StatusTimer";

// Import optimized section components
import LatestBriefSection from "./HomeViewSections/LatestBriefSection";
import UrgentThreadsSection from "./HomeViewSections/UrgentThreadsSection";
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PriorityPeopleSection from "./HomeViewSections/PriorityPeopleSection";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  statusTimerProps: StatusTimerProps;
}

const HomeView = ({
  onOpenBrief,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  statusTimerProps
}: HomeViewProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);

  
  const handleUpdateSchedule = useCallback(() => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings"
    });
  }, [toast]);
  
  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

  // Sample brief data
  const latestBrief = {
    id: 1,
    title: "Morning Brief",
    timestamp: "Today, 8:00 AM",
    emailCount: 5,
    messageCount: 12
  };

  // Mobile View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-surface px-4 py-6">
        {/* Mobile Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Good morning, Alex
          </h1>
          <p className="text-text-secondary mb-8">What would you like to know?</p>
        </div>

        {/* Central "Brief Me" Button */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            {/* Dynamic multi-colored gradient background with rotation */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-l from-cyan-400 via-blue-500 to-accent-secondary rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
            
            {/* Enhanced Neumorphic Brief Me Button */}
            <button
              onClick={onToggleCatchMeUp}
              className="relative w-36 h-36 rounded-full bg-surface text-text-primary font-bold text-xl tracking-wide
                         shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.1)]
                         hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(255,255,255,0.15)]
                         active:shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.2)]
                         transition-all duration-300 transform hover:scale-105 active:scale-95
                         bg-gradient-to-br from-surface via-surface to-surface-raised
                         border border-white/5"
              style={{
                background: 'linear-gradient(145deg, var(--surface), var(--surface-raised))'
              }}
            >
              Brief Me
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="fixed bottom-6 right-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                className="w-14 h-14 rounded-full bg-accent-primary text-white shadow-lg"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-surface/95 backdrop-blur-xl border-border-subtle">
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Focus Mode Option */}
                <Button 
                  onClick={() => {
                    onToggleFocusMode();
                    setMobileMenuOpen(false);
                  }} 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-border-subtle"
                >
                  <Headphones className="mr-3 h-5 w-5" />
                  Focus Mode
                </Button>

                {/* Latest Brief */}
                <div className="border border-border-subtle rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Latest Brief</h3>
                  <p className="text-sm text-text-secondary mb-3">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
                  <Button 
                    onClick={() => onOpenBrief(latestBrief.id)} 
                    className="w-full bg-accent-primary text-white rounded-xl"
                  >
                    Read Brief
                  </Button>
                </div>

                {/* Other Sections */}
                <div className="space-y-4">
                  <div className="border border-border-subtle rounded-xl p-4">
                    <UrgentThreadsSection />
                  </div>
                  <div className="border border-border-subtle rounded-xl p-4">
                    <ConnectedChannelsSection />
                  </div>
                  <div className="border border-border-subtle rounded-xl p-4">
                    <PriorityPeopleSection />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Good morning, Alex
            </h1>
            <p className="text-text-secondary">Ready to catch up or focus?</p>
          </div>
          
          <StatusTimer {...statusTimerProps} />
          
          {/* Smaller CTAs on the right */}
          <div className="flex gap-3 items-center">

            <Button 
              onClick={onToggleCatchMeUp} 
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
            </Button>
          
              <Button 
                // onClick={onToggleSignOff}
                variant="outline"
                size={isMobile ? "sm" : "default"}
                className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
              >
                <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" /> 
                <span className="text-xs sm:text-sm">Sign Off Today</span>
              </Button>

            <Button 
              onClick={onToggleFocusMode} 
              variant="outline" 
              className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
            >
              <Headphones className="mr-2 h-4 w-4" />
              Focus Mode
            </Button>
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="col-span-8 space-y-6">
            {/* Latest Brief Card */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Latest Brief</h2>
                <span className="text-sm text-text-secondary">{latestBrief.timestamp}</span>
              </div>
              
              <p className="text-text-secondary mb-4">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => onOpenBrief(latestBrief.id)} 
                  className="bg-accent-primary text-white rounded-xl shadow-sm"
                >
                  Read Brief
                </Button>
                <Button 
                  onClick={handleViewAllBriefs} 
                  variant="outline" 
                  className="rounded-xl border-border-subtle text-text-primary shadow-sm"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  View All Briefs
                </Button>
              </div>
            </div>

            {/* Combined sections card */}
            <div className="border border-border-subtle rounded-2xl overflow-hidden bg-surface-overlay/30 shadow-sm">
              <LatestBriefSection onClick={onOpenBriefModal} />
              <Separator className="bg-border-subtle" />
              <UrgentThreadsSection />
            </div>
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-4">
            {/* Priority People Section - Compact */}
            <div className="border border-border-subtle rounded-2xl p-4 bg-surface-overlay/30 shadow-sm">
              <PriorityPeopleSection />
            </div>

            {/* Connected Channels Section - Compact */}
            <div className="border border-border-subtle rounded-2xl p-4 bg-surface-overlay/30 shadow-sm">
              <ConnectedChannelsSection />
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
              
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-border-subtle text-text-primary shadow-sm" 
                onClick={handleUpdateSchedule}
              >
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
                  <p className="text-text-secondary text-sm">Meeting integration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeView);
