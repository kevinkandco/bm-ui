import React, { useState, useCallback } from "react";
import { Zap, Headphones, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

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
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
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

  // Memoize Hero section to prevent unnecessary re-renders
  const HeroSection = React.memo(() => <div className="mb-6 md:mb-8 text-center">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
        Good morning, Alex
      </h1>
      <p className="text-text-secondary">Ready to catch up or focus?</p>
    </div>);
  return <div className="min-h-screen bg-surface px-4 py-6">
      <HeroSection />
      
      {/* Mobile-first layout with responsive grid */}
      <div className="max-w-7xl mx-auto">
        {/* Main CTAs - Full width on mobile, centered on desktop */}
        <div className="mb-6 md:mb-8 space-y-4 max-w-md mx-auto">
          <Button onClick={onToggleCatchMeUp} className="w-full h-14 md:h-16 bg-accent-primary text-white rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transition-all">
            <Zap className="mr-3 h-5 w-5 md:h-6 md:w-6" />
            Catch Me Up
          </Button>
          
          <Button onClick={onToggleFocusMode} variant="outline" className="w-full h-14 md:h-16 rounded-2xl text-lg font-medium border-2 border-border-subtle text-text-primary hover:bg-surface-raised/30 shadow-lg hover:shadow-xl transition-all">
            <Headphones className="mr-3 h-5 w-5 md:h-6 md:w-6" />
            Focus Mode
          </Button>
        </div>

        {/* Responsive layout: single column on mobile, two columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main content - Full width on mobile, 8 columns on desktop */}
          <div className="lg:col-span-8 space-y-6">
            {/* Latest Brief Card */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Latest Brief</h2>
                <span className="text-sm text-text-secondary">{latestBrief.timestamp}</span>
              </div>
              
              <p className="text-text-secondary mb-4">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => onOpenBrief(latestBrief.id)} className="flex-1 bg-accent-primary text-white rounded-xl">
                  Read Brief
                </Button>
                <Button onClick={handleViewAllBriefs} variant="outline" className="flex-1 rounded-xl border-border-subtle text-text-primary">
                  <Archive className="mr-2 h-4 w-4" />
                  View All Briefs
                </Button>
              </div>
            </div>

            {/* Desktop: Combined sections in a single card */}
            <div className="hidden md:block glass-card rounded-3xl overflow-hidden">
              <LatestBriefSection onClick={onOpenBriefModal} />
              <Separator className="bg-border-subtle" />
              <UrgentThreadsSection />
              <Separator className="bg-border-subtle" />
              <ConnectedChannelsSection />
              <Separator className="bg-border-subtle" />
              <PriorityPeopleSection />
            </div>

            {/* Mobile: Separate cards for each section */}
            <div className="md:hidden space-y-4">
              <div className="glass-card rounded-2xl overflow-hidden">
                <UrgentThreadsSection />
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <ConnectedChannelsSection />
              </div>
              <div className="glass-card rounded-2xl overflow-hidden">
                <PriorityPeopleSection />
              </div>
            </div>
          </div>
          
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            {/* Next Brief Section */}
            <div className="glass-card rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Next Scheduled Brief</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-text-primary">Midday Brief</p>
                  <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full rounded-xl border-border-subtle text-text-primary" onClick={handleUpdateSchedule}>
                Update Schedule
              </Button>
            </div>
            
            {/* Upcoming Meetings - Blurred Coming Soon */}
            <div className="glass-card rounded-2xl p-4 md:p-6 relative overflow-hidden">
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

        {/* Mobile: Next Brief at bottom */}
        <div className="md:hidden mt-6">
          <div className="glass-card rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-text-primary">Next Brief</h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium text-text-primary">Midday Brief</p>
                <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
              </div>
            </div>
            
            <Button variant="outline" className="w-full rounded-xl border-border-subtle text-text-primary" onClick={handleUpdateSchedule}>
              Update Schedule
            </Button>
          </div>
        </div>
      </div>
    </div>;
};
export default React.memo(HomeView);