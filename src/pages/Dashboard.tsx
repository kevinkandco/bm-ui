import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import FocusMode from "@/components/dashboard/FocusMode";
import StatusTimer from "@/components/dashboard/StatusTimer";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import MenuBarContainer from "@/components/dashboard/MenuBarContainer";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"home" | "listening" | "focus">("home");
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);

  const openBriefDetails = useCallback((briefId: number) => {
    // Logic to open brief details
    toast({
      title: `Opening Brief ${briefId}`,
      description: "Navigating to brief details..."
    });
  }, [toast]);
  const openTranscript = useCallback((briefId: number) => {
    setSelectedBriefId(briefId);
    setIsTranscriptOpen(true);
  }, [setSelectedBriefId, setIsTranscriptOpen]);
  const closeTranscript = useCallback(() => {
    setIsTranscriptOpen(false);
    setSelectedBriefId(null);
  }, [setIsTranscriptOpen, setSelectedBriefId]);
  const handleToggleFocusMode = useCallback(() => {
    setUserStatus(prevStatus => prevStatus === "focus" ? "active" : "focus");
    setCurrentView(prevView => prevView === "focus" ? "home" : "focus");
    toast({
      title: "Focus Mode",
      description: currentView === "home" ? "Entering focus mode" : "Exiting focus mode"
    });
  }, [toast, currentView]);
  const handleExitFocusMode = useCallback(() => {
    setUserStatus("active");
    setCurrentView("home");
    toast({
      title: "Focus Mode",
      description: "Exiting focus mode"
    });
  }, [toast]);
  const handleToggleCatchMeUp = useCallback(() => {
    setCurrentView(prevView => prevView === "listening" ? "home" : "listening");
    toast({
      title: "Catch Me Up",
      description: currentView === "home" ? "Entering catch me up mode" : "Exiting catch me up mode"
    });
  }, [toast, currentView]);
  const openBriefModal = useCallback(() => {
    setIsBriefModalOpen(true);
  }, [setIsBriefModalOpen]);
  const closeBriefModal = useCallback(() => {
    setIsBriefModalOpen(false);
  }, [setIsBriefModalOpen]);
  const handleStartFocusMode = useCallback(() => {
    setUserStatus("focus");
    setCurrentView("focus");
    toast({
      title: "Focus Mode",
      description: "Starting focus mode"
    });
  }, [toast]);
  const handleSignOffForDay = useCallback(() => {
    setUserStatus("vacation");
    toast({
      title: "Signing Off",
      description: "Signing off for the day"
    });
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Menu Bar Companion - macOS style */}
      <MenuBarContainer
        onGetBriefedNow={handleToggleCatchMeUp}
        onUpdateSchedule={() => navigate("/dashboard/settings")}
        onOpenDashboard={() => navigate("/dashboard")}
      />

      {/* Status Timer */}
      <StatusTimer 
        status={userStatus}
        onToggleCatchMeUp={handleToggleCatchMeUp}
        onToggleFocusMode={handleToggleFocusMode}
        onExitFocusMode={handleExitFocusMode}
      />

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
        {currentView === "focus" && <FocusMode onExitFocusMode={handleExitFocusMode} />}
      </div>

      {/* Modals */}
      <NewBriefModal open={isBriefModalOpen} onClose={closeBriefModal} />
      <TranscriptView briefId={selectedBriefId} open={isTranscriptOpen} onClose={closeTranscript} />
    </div>
  );
};

export default Dashboard;
