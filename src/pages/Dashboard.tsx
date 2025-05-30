
import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefModal from "@/components/dashboard/BriefModal";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type UserStatus = "active" | "away" | "focus" | "vacation";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: !isMobile,
    briefModalOpen: false,
    endFocusModalOpen: false,
    catchUpModalOpen: false,
    userStatus: "active" as UserStatus
  });

  const handleOpenBrief = useCallback((briefId: number) => {
    setUiState(prev => ({
      ...prev,
      selectedBrief: briefId,
      briefModalOpen: true
    }));
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: !prev.focusModeOpen
    }));
  }, []);

  const handleToggleCatchMeUp = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      catchMeUpOpen: !prev.catchMeUpOpen
    }));
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen
    }));
  }, []);

  const handleCloseFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false
    }));
  }, []);

  const handleStartFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false,
      userStatus: "focus" as UserStatus
    }));
  }, []);

  const handleExitFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: true
    }));
  }, []);

  const handleCloseEndFocusModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: false,
      userStatus: "active" as UserStatus
    }));
    
    toast({
      title: "Focus Mode Ended",
      description: "Your brief has been created and emailed to you"
    });
  }, [toast]);

  const handleCloseCatchMeUp = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      catchMeUpOpen: false
    }));
  }, []);

  const handleGenerateCatchMeUpSummary = useCallback((timeDescription: string) => {
    setUiState(prev => ({
      ...prev,
      catchMeUpOpen: false,
      catchUpModalOpen: true
    }));
  }, []);

  const handleCloseCatchUpModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      catchUpModalOpen: false
    }));
    
    toast({
      title: "Catch Me Up Summary Ready",
      description: "Your summary has been created and emailed to you"
    });
    
    navigate("/dashboard/catch-up");
  }, [toast, navigate]);

  const handleCloseBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: false
    }));
  }, []);

  const handleOpenBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: true
    }));
  }, []);

  const layoutProps = useMemo(() => ({
    currentPage: "home", 
    sidebarOpen: uiState.sidebarOpen, 
    onToggleSidebar: handleToggleSidebar
  }), [uiState.sidebarOpen, handleToggleSidebar]);

  const endFocusModalProps = useMemo(() => ({
    open: uiState.endFocusModalOpen,
    onClose: handleCloseEndFocusModal,
    title: "Creating Your Brief",
    description: "We're preparing a summary of all updates during your focus session"
  }), [uiState.endFocusModalOpen, handleCloseEndFocusModal]);

  const catchUpModalProps = useMemo(() => ({
    open: uiState.catchUpModalOpen,
    onClose: handleCloseCatchUpModal,
    title: "Creating Your Summary",
    description: "We're preparing a summary of what you've missed",
    timeRemaining: 60
  }), [uiState.catchUpModalOpen, handleCloseCatchUpModal]);

  return (
    <DashboardLayout {...layoutProps}>
      <HomeView 
        onOpenBrief={handleOpenBrief}
        onToggleFocusMode={handleToggleFocusMode}
        onToggleCatchMeUp={handleToggleCatchMeUp}
        onOpenBriefModal={handleOpenBriefModal}
      />
      
      {/* Modals */}
      <FocusMode 
        open={uiState.focusModeOpen}
        onClose={handleStartFocusMode}
      />
      <CatchMeUp 
        open={uiState.catchMeUpOpen}
        onClose={handleCloseCatchMeUp}
        onGenerateSummary={handleGenerateCatchMeUpSummary}
      />
      <BriefModal 
        open={uiState.briefModalOpen}
        onClose={handleCloseBriefModal}
      />
      <EndFocusModal {...endFocusModalProps} />
      <EndFocusModal {...catchUpModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
