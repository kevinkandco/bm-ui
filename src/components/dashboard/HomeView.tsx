import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive, Menu, X, FileText, Focus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
}

const HomeView = ({
  onOpenBrief,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal
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

  // Sample brief data with time ranges
  const latestBrief = {
    id: 1,
    title: "Morning Brief",
    timestamp: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    emailCount: 5,
    messageCount: 12
  };

  // Mobile View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-dark-navy px-6 py-8 flex flex-col">
        {/* Mobile Welcome Section */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl font-semibold text-white-text mb-3">
            Good morning, Alex
          </h1>
          <p className="text-light-gray-text text-lg">Ready to catch up or focus?</p>
        </div>

        {/* Central "Brief Me" Button */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-16">
            {/* Enhanced gradient background with multiple layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-teal via-accent-green to-primary-teal rounded-full blur-3xl opacity-30 animate-pulse scale-110" style={{ animationDuration: '4s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-l from-accent-green via-primary-teal to-accent-green rounded-full blur-2xl opacity-40 animate-spin" style={{ animationDuration: '8s' }}></div>
            
            {/* Main Brief Me Button */}
            <button
              onClick={onToggleCatchMeUp}
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-dark-navy via-deep-blue to-dark-navy text-white-text font-semibold text-2xl tracking-wide
                         shadow-[16px_16px_32px_rgba(0,0,0,0.5),-16px_-16px_32px_rgba(255,255,255,0.05)]
                         hover:shadow-[12px_12px_24px_rgba(0,0,0,0.6),-12px_-12px_24px_rgba(255,255,255,0.08)]
                         active:shadow-[8px_8px_16px_rgba(0,0,0,0.7),-8px_-8px_16px_rgba(255,255,255,0.1)]
                         transition-all duration-300 transform hover:scale-105 active:scale-98
                         border border-white/10"
            >
              Brief Me
            </button>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex justify-center items-center gap-8 pb-8">
          {/* Brief Button */}
          <button
            onClick={onOpenBriefModal}
            className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95"
          >
            <FileText className="w-6 h-6 text-light-gray-text" />
          </button>

          {/* Focus Button */}
          <button
            onClick={onToggleFocusMode}
            className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95"
          >
            <Headphones className="w-6 h-6 text-light-gray-text" />
          </button>

          {/* Catch Up Button */}
          <button
            onClick={onToggleCatchMeUp}
            className="w-16 h-16 rounded-full bg-deep-blue border border-light-gray-text/40 
                       flex items-center justify-center transition-all duration-200
                       hover:border-light-gray-text/60 hover:bg-deep-blue/90
                       active:scale-95"
          >
            <Clock className="w-6 h-6 text-light-gray-text" />
          </button>
        </div>

        {/* Mobile Menu Button - Moved to top right corner */}
        <div className="fixed top-8 right-6 z-50">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                className="w-12 h-12 rounded-full bg-deep-blue border border-light-gray-text/40 text-light-gray-text hover:border-light-gray-text/60"
                variant="outline"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-dark-navy/95 backdrop-blur-xl border-light-gray-text/20">
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-white-text">Menu</h2>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-light-gray-text hover:text-white-text"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Latest Brief */}
                <div className="border border-light-gray-text/20 rounded-2xl p-4 bg-deep-blue/30">
                  <h3 className="font-semibold text-white-text mb-1">Latest Brief</h3>
                  <p className="text-xs text-light-gray-text mb-1">{latestBrief.timeRange}</p>
                  <p className="text-sm text-light-gray-text mb-3">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
                  <Button 
                    onClick={() => onOpenBrief(latestBrief.id)} 
                    className="w-full bg-primary-teal text-white-text rounded-xl hover:bg-accent-green"
                  >
                    Read Brief
                  </Button>
                </div>

                {/* Other Sections */}
                <div className="space-y-4">
                  <div className="border border-light-gray-text/20 rounded-2xl p-4 bg-deep-blue/30">
                    <UrgentThreadsSection />
                  </div>
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
          
          {/* Smaller CTAs on the right */}
          <div className="flex gap-3">
            <Button 
              onClick={onToggleCatchMeUp} 
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
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
              
              <div className="mb-4">
                <p className="text-xs text-text-secondary mb-1">Time Range: {latestBrief.timeRange}</p>
                <p className="text-text-secondary">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
              </div>
              
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
