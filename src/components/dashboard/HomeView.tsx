
import React, { useCallback } from "react";
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
        <h1 className="text-heading-lg text-text-headline font-medium">Morning, Alex</h1>
        <p className="text-body text-text-secondary mt-1">Here's what you missed</p>
      </div>
      <div className="flex gap-3 mt-4 md:mt-0">
        <Button 
          onClick={onToggleCatchMeUp}
          className="rounded-md shadow-card"
        >
          <Zap className="h-5 w-5" /> Catch Me Up
        </Button>
        <Button 
          onClick={onToggleFocusMode}
          variant="outline"
        >
          <Headphones className="h-5 w-5" /> Focus Mode
        </Button>
      </div>
    </div>
  ));
  
  return (
    <div className="container p-shell max-w-7xl mx-auto">
      <HeroSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-card-gap">
        {/* Left Section - Col 1-8 */}
        <div className="lg:col-span-8">
          {/* Main card with sections and dividers */}
          <div className="rounded-card bg-surface border border-divider shadow-card overflow-hidden">
            {/* Latest Brief Section */}
            <LatestBriefSection onClick={onOpenBriefModal} />

            <div className="h-px w-full bg-divider" />
            
            {/* Urgent Threads Section */}
            <UrgentThreadsSection />

            <div className="h-px w-full bg-divider" />
            
            {/* Connected Channels Section */}
            <ConnectedChannelsSection />
            
            <div className="h-px w-full bg-divider" />
            
            {/* Priority People Section */}
            <PriorityPeopleSection />
          </div>
        </div>
        
        {/* Right Section - Col 9-12 */}
        <div className="lg:col-span-4 space-y-card-gap">
          {/* Next Brief Section */}
          <div className="rounded-card bg-surface border border-divider shadow-card p-card-padding">
            <NextBriefSection onUpdateSchedule={handleUpdateSchedule} />
          </div>
          
          {/* Upcoming Meetings Section */}
          <div className="rounded-card bg-surface border border-divider shadow-card p-card-padding">
            <UpcomingMeetingsSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeView);
