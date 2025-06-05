
import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefModal from "@/components/dashboard/BriefModal";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
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
    userStatus: "active" as UserStatus,
    focusModeActive: false
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
      userStatus: "focus" as UserStatus,
      focusModeActive: true
    }));
    
    toast({
      title: "Focus Mode Started",
      description: "Slack status set to 'focusing', Gmail status set to 'monitoring'"
    });
  }, [toast]);

  const handleExitFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: true,
      userStatus: "active" as UserStatus,
      focusModeActive: false
    }));
    
    toast({
      title: "Focus Mode Ended",
      description: "Slack and Gmail status set to 'online'"
    });
  }, [toast]);

  const handleSignOffForDay = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      userStatus: "away" as UserStatus
    }));
    
    toast({
      title: "Signed Off",
      description: "We'll monitor your channels until your next auto-scheduled brief"
    });
  }, [toast]);

  const handleCloseEndFocusModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: false
    }));
    
    toast({
      title: "Focus Brief Ready",
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
      {/* Focus Mode Timer - only show when focus mode is active */}
      {uiState.focusModeActive && (
        <StatusTimer 
          status={uiState.userStatus}
          onExitFocusMode={handleExitFocusMode}
        />
      )}
      
      {/* Add extra top padding here */}
      <div className="pt-16">
        <HomeView 
          onOpenBrief={handleOpenBrief}
          onToggleFocusMode={handleToggleFocusMode}
          onToggleCatchMeUp={handleToggleCatchMeUp}
          onOpenBriefModal={handleOpenBriefModal}
          onStartFocusMode={handleStartFocusMode}
          onSignOffForDay={handleSignOffForDay}
        />
      </div>
      
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
