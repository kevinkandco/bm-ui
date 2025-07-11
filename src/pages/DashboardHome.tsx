import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, Calendar, ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import ConnectedChannelsSection from "@/components/dashboard/HomeViewSections/ConnectedChannelsSection";
import PrioritiesSection from "@/components/dashboard/HomeViewSections/PrioritiesSection";
import BriefsContainer from "@/components/dashboard/HomeViewSections/BriefsContainer";

const DashboardHome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("Today");

  const handleUpdateSchedule = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

  const handleViewTranscript = useCallback((briefId: number) => {
    // This would be handled by the parent wrapper
    console.log("View transcript for brief:", briefId);
  }, []);

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
    // This would open the catch me up modal
    console.log("Get briefed now clicked");
  }, []);

  const handleOpenBrief = useCallback((briefId: number) => {
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  // Day picker handlers
  const handlePreviousDay = useCallback(() => {
    if (selectedDate === "Today") {
      setSelectedDate("Yesterday");
    } else if (selectedDate === "Yesterday") {
      setSelectedDate("2 days ago");
    }
  }, [selectedDate]);

  const handleNextDay = useCallback(() => {
    if (selectedDate === "2 days ago") {
      setSelectedDate("Yesterday");
    } else if (selectedDate === "Yesterday") {
      setSelectedDate("Today");
    }
  }, [selectedDate]);

  // Sample brief data
  const recentBriefs = [
    {
      id: 1,
      name: "Morning Brief",
      timeCreated: "Today, 8:00 AM",
      timeRange: "5:00 AM - 8:00 AM",
      slackMessages: { total: 12, fromPriorityPeople: 3 },
      emails: { total: 5, fromPriorityPeople: 2 },
      actionItems: 4,
      hasTranscript: true
    },
    {
      id: 2,
      name: "Evening Brief",
      timeCreated: "Yesterday, 8:00 PM",
      timeRange: "5:00 PM - 8:00 PM",
      slackMessages: { total: 8, fromPriorityPeople: 1 },
      emails: { total: 3, fromPriorityPeople: 0 },
      actionItems: 2,
      hasTranscript: true
    },
    {
      id: 3,
      name: "Afternoon Brief",
      timeCreated: "Yesterday, 4:00 PM",
      timeRange: "1:00 PM - 4:00 PM",
      slackMessages: { total: 15, fromPriorityPeople: 4 },
      emails: { total: 7, fromPriorityPeople: 3 },
      actionItems: 5,
      hasTranscript: true
    }
  ];

  const upcomingBrief = {
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  };

  const totalBriefs = 47;

  return (
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
                {/* Good morning greeting */}
                <div className="mb-6">
                  <h1 className="font-bold text-text-primary text-2xl">
                    Good morning, Alex
                  </h1>
                </div>
                
                {/* Day Picker */}
                <div className="flex items-center justify-end mb-6">
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
                      <span className="text-sm text-white-text font-medium min-w-[70px] text-center">
                        {selectedDate}
                      </span>
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
                
                <BriefsContainer 
                  briefs={recentBriefs} 
                  totalBriefs={totalBriefs} 
                  onViewBrief={handleOpenBrief} 
                  onViewTranscript={handleViewTranscript} 
                  onPlayBrief={handlePlayBrief} 
                  playingBrief={playingBrief} 
                  onViewAllBriefs={handleViewAllBriefs} 
                  onGetBriefedNow={handleGetBriefedNow} 
                  onUpdateSchedule={handleUpdateSchedule} 
                  upcomingBrief={upcomingBrief} 
                />
              </div>

              {/* Right panel (1/3) */}
              <div className="col-span-1 space-y-6">
                <PrioritiesSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;