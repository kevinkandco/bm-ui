
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LatestBriefSection from "./HomeViewSections/LatestBriefSection";
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import CalendarSection from "./HomeViewSections/CalendarSection";
import MonitoringSection from "./MonitoringSection";

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
  const navigate = useNavigate();
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePlayBrief = (briefId: number) => {
    setPlayingBrief(playingBrief === briefId ? null : briefId);
  };

  // Mock data for briefs
  const mockBriefs = [
    {
      id: 1,
      name: "Morning Brief",
      timeCreated: "Today, 8:00 AM",
      timeRange: "5:00 AM - 8:00 AM",
      slackMessages: { total: 12, fromPriorityPeople: 3 },
      emails: { total: 5, fromPriorityPeople: 2 },
      actionItems: 3,
      hasTranscript: true
    }
  ];

  const upcomingBrief = {
    name: "Afternoon Brief",
    scheduledTime: "2:00 PM"
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Monitoring */}
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">
              Good {currentTime.getHours() < 12 ? 'morning' : currentTime.getHours() < 18 ? 'afternoon' : 'evening'}
            </h1>
            <p className="text-text-secondary">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          
          <MonitoringSection />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-12 gap-6 p-6 h-full">
          {/* Left Column - Briefs */}
          <div className="col-span-8 flex flex-col space-y-6">
            <LatestBriefSection
              onClick={() => onOpenBrief(1)}
            />
            
            <BriefsContainer
              briefs={mockBriefs}
              totalBriefs={mockBriefs.length}
              onViewBrief={onOpenBrief}
              onViewTranscript={onViewTranscript}
              onPlayBrief={handlePlayBrief}
              playingBrief={playingBrief}
              onViewAllBriefs={() => navigate('/dashboard/briefs')}
              onGetBriefedNow={onOpenBriefModal}
              onUpdateSchedule={() => console.log('Update schedule')}
              upcomingBrief={upcomingBrief}
            />
          </div>

          {/* Right Column - Calendar */}
          <div className="col-span-4">
            <CalendarSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
