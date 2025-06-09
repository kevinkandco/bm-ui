
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"home" | "listening">("home");
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);

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
    setUserStatus(prevStatus => prevStatus === "focus" ? "active" : "focus");
    toast({
      title: "Focus Mode",
      description: userStatus === "active" ? "Entering focus mode" : "Exiting focus mode"
    });
  }, [toast, userStatus]);

  const handleExitFocusMode = useCallback(() => {
    setShowEndFocusModal(true);
  }, []);

  const handleConfirmExitFocus = useCallback(() => {
    setUserStatus("active");
    setShowEndFocusModal(false);
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
      {/* Focus Mode Timer Header */}
      {userStatus === "focus" && (
        <StatusTimer 
          status={userStatus}
          onExitFocusMode={handleExitFocusMode}
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
    </div>
  );
};

export default Dashboard;
