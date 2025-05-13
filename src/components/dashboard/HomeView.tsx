
import React, { useState, useCallback } from "react";
import { Zap, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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

const HomeView = ({ onOpenBrief, onToggleFocusMode, onToggleCatchMeUp, onOpenBriefModal }: HomeViewProps) => {
  const { toast } = useToast();
  
  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);

  const handleUpdateSchedule = useCallback(() => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings",
    });
  }, [toast]);
  
  // Memoize Hero section to prevent unnecessary re-renders
  const HeroSection = React.memo(() => (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-deep-teal">Morning, Alex</h1>
        <p className="text-deep-teal/90 mt-1">Here's what you missed</p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button 
          onClick={onToggleCatchMeUp}
          className="rounded-full shadow-sm hover:shadow-md transition-all bg-lake-blue text-white"
        >
          <Zap className="mr-2 h-5 w-5" /> Catch Me Up
        </Button>
        <Button 
          onClick={onToggleFocusMode}
          className="rounded-full shadow-sm hover:shadow-md transition-all bg-glass-blue text-white"
        >
          <Headphones className="mr-2 h-5 w-5" /> Focus Mode
        </Button>
      </div>
    </div>
  ));
  
  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
      <HeroSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - Col 1-8 */}
        <div className="lg:col-span-8">
          {/* Combined Card with Sections and Dividers */}
          <div className="backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-lg">
            {/* Latest Brief Section - Moved to top */}
            <LatestBriefSection onClick={onOpenBriefModal} />

            <Separator className="bg-white/20" />
            
            {/* Urgent Threads Section */}
            <UrgentThreadsSection />

            <Separator className="bg-white/20" />
            
            {/* Connected Channels Section */}
            <ConnectedChannelsSection />
            
            <Separator className="bg-white/20" />
            
            {/* Priority People Section */}
            <PriorityPeopleSection />
          </div>
        </div>
        
        {/* Right Section - Col 9-12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Next Brief Section */}
          <NextBriefSection onUpdateSchedule={handleUpdateSchedule} />
          
          {/* Upcoming Meetings Section */}
          <UpcomingMeetingsSection />
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeView);
