
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import BriefMeModal from "@/components/dashboard/BriefMeModal";
import FocusModeConfig from "@/components/dashboard/FocusModeConfig";

interface FocusConfig {
  duration: number;
  closeApps: {
    slack: boolean;
    gmail: boolean;
    calendar: boolean;
  };
  statusUpdates: {
    slack: string;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"home" | "listening">("home");
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);
  const [showFocusConfig, setShowFocusConfig] = useState(false);
  const [focusConfig, setFocusConfig] = useState<FocusConfig | null>(null);

  const openBriefDetails = useCallback((briefId: number) => {
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  const openTranscript = useCallback((briefId: number) => {
    setSelectedBriefId(briefId);
    setIsTranscriptOpen(true);
  }, [setSelectedBriefId, setIsTranscriptOpen]);
  
  const closeTranscript = useCallback(() => {
    setIsTranscriptOpen(false);
    setSelectedBriefId(null);
  }, [setIsTranscriptOpen, setSelectedBriefId]);

  const handleToggleFocusMode = useCallback(() => {
    if (userStatus === "focus") {
      setUserStatus("active");
      toast({
        title: "Focus Mode",
        description: "Exiting focus mode"
      });
    } else {
      setShowFocusConfig(true);
    }
  }, [toast, userStatus]);

  const handleExitFocusMode = useCallback(() => {
    setShowEndFocusModal(true);
  }, []);

  const handleConfirmExitFocus = useCallback(() => {
    setUserStatus("active");
    setShowEndFocusModal(false);
    setFocusConfig(null);
    toast({
      title: "Focus Mode",
      description: "Exiting focus mode"
    });
  }, [toast]);

  const handleToggleCatchMeUp = useCallback(() => {
    setShowBriefMeModal(true);
  }, []);
  
  const openBriefModal = useCallback(() => {
    setIsBriefModalOpen(true);
  }, [setIsBriefModalOpen]);
  
  const closeBriefModal = useCallback(() => {
    setIsBriefModalOpen(false);
  }, [setIsBriefModalOpen]);
  
  const handleStartFocusModeWithConfig = useCallback((config: FocusConfig) => {
    setFocusConfig(config);
    setUserStatus("focus");
    
    // Simulate closing apps and updating status
    const actionsText = [];
    if (config.closeApps.slack) actionsText.push("Slack closed");
    if (config.closeApps.gmail) actionsText.push("Gmail closed");
    if (config.closeApps.calendar) actionsText.push("Calendar closed");
    
    toast({
      title: "Focus Mode Started",
      description: `${config.duration} minute focus session started. ${actionsText.length > 0 ? actionsText.join(', ') + '. ' : ''}Slack status updated.`
    });
  }, [toast]);
  
  const handleStartFocusMode = useCallback(() => {
    setShowFocusConfig(true);
  }, []);
  
  const handleSignOffForDay = useCallback(() => {
    setUserStatus("away");
    toast({
      title: "Signing Off",
      description: "You've signed off for today"
    });
  }, [toast]);

  const handleSignBackOn = useCallback(() => {
    setUserStatus("active");
    toast({
      title: "Welcome Back",
      description: "You're now back online and monitoring"
    });
  }, [toast]);

  const handleGenerateBrief = useCallback(() => {
    // This would typically trigger the creation of a new brief
    console.log("Generating new brief...");
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Focus Mode Timer Header */}
      {userStatus === "focus" && (
        <StatusTimer 
          status={userStatus}
          onExitFocusMode={handleExitFocusMode}
        />
      )}

      {/* Away/Offline Timer Header */}
      {userStatus === "away" && (
        <StatusTimer 
          status={userStatus}
          onSignBackOn={handleSignBackOn}
        />
      )}

      {/* Vacation/Out of Office Timer Header */}
      {userStatus === "vacation" && (
        <StatusTimer 
          status={userStatus}
          onToggleCatchMeUp={handleToggleCatchMeUp}
          onSignBackOn={handleSignBackOn}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {currentView === "home" && (
          <HomeView
            onOpenBrief={openBriefDetails}
            onViewTranscript={openTranscript}
            onToggleFocusMode={handleToggleFocusMode}
            onToggleCatchMeUp={handleToggleCatchMeUp}
            onOpenBriefModal={openBriefModal}
            onStartFocusMode={handleStartFocusMode}
            onSignOffForDay={handleSignOffForDay}
          />
        )}
        {currentView === "listening" && <ListeningScreen />}
      </div>

      {/* Modals */}
      <NewBriefModal open={isBriefModalOpen} onClose={closeBriefModal} />
      <TranscriptView briefId={selectedBriefId} open={isTranscriptOpen} onClose={closeTranscript} />
      <EndFocusModal 
        open={showEndFocusModal} 
        onClose={handleConfirmExitFocus}
        title="Creating Your Brief"
        description="We're preparing a summary of all updates during your focus session"
      />
      <BriefMeModal
        open={showBriefMeModal}
        onClose={() => setShowBriefMeModal(false)}
        onGenerateBrief={handleGenerateBrief}
      />
      <FocusModeConfig
        isOpen={showFocusConfig}
        onClose={() => setShowFocusConfig(false)}
        onStartFocus={handleStartFocusModeWithConfig}
      />
    </div>
  );
};

export default Dashboard;
