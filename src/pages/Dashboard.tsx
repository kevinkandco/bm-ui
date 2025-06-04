import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefModal from "@/components/dashboard/BriefModal";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BriefSchedules, UserSchedule, PriorityPeople, Summary } from "@/components/dashboard/types";
import { useIsMobile } from "@/hooks/use-mobile";
import Pagination from "@/components/dashboard/Pagination";
import SignOff from "@/components/dashboard/SignOff";
import { useApi } from "@/hooks/useApi";

type UserStatus = "active" | "away" | "focus" | "vacation";

export interface PendingData {
  id: number;
  status: boolean;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { call } = useApi();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    focusModeOpen: false,
    focusTime: 0,
    focusModeExitLoading: false,
    catchMeUpOpen: false,
    sidebarOpen: !isMobile,
    briefModalOpen: false,
    endFocusModalOpen: false,
    catchUpModalOpen: false,
    isSignoff: false,
    SignOffModalOpen: false,
    userStatus: "active" as UserStatus,
    focusModeActive: false
  });
  const [priorityPeople, setPriorityPeople] = useState<PriorityPeople[]>([]);
  const [briefSchedules, SetBriefSchedules] = useState<BriefSchedules[] | null>(null);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [recentBriefs, setRecentBriefs] = useState<Summary[] | null>(null);
  const [searchParams] = useSearchParams();

  const fetchDashboardData = useCallback(async () => {
    const response = await call("get", "/api/dashboard", {
      showToast: true,
      toastTitle: "Failed to fetch user data",
      toastDescription: "Something went wrong. Failed to fetch user data.",
    });

    if (response) {
      setUiState((prev) => ({
        ...prev,
        userStatus: response.mode === 'focus'
          ? 'focus'
          : response.sign_off
          ? 'away'
          : 'active',
        isSignoff: response.sign_off || false,
        focusTime: response.focusRemainingTime,
      }));

      setUserSchedule(response.userSchedule);
      SetBriefSchedules(response.briefSchedules);
      setPriorityPeople(response.priorityPeople);
    }
  }, [call]);

  const getRecentBriefs = useCallback(async () => {
    const response = await call("get", `/api/summaries?per_page=3`, {
      showToast: true,
      toastTitle: "Failed to fetch briefs",
      toastDescription: "Something went wrong while fetching the briefs.",
      returnOnFailure: false,
    });
    setRecentBriefs(response?.data);
  }, [call]);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
      const url = new URL(window.location.href);
      url.searchParams.delete("token");
      url.searchParams.delete("provider");
      window.history.replaceState(
        {},
        document.title,
        url.pathname + url.search
      );
    }
    fetchDashboardData();
    getRecentBriefs(); 
  }, [searchParams, getRecentBriefs, fetchDashboardData]);

  const handleExitFocusMode = useCallback(async () => {
    setUiState((prev) => ({
      ...prev,
      focusModeExitLoading: true,
    }));

    const response = await call("get", "/api/exit-focus-mode", {
      showToast: true,
      toastTitle: "Focus Mode Exit failed",
      toastDescription: "Something went wrong. Please try again later.",
    });

    if (response) {
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
      fetchDashboardData();
      getRecentBriefs();
    }

    setUiState((prev) => ({
      ...prev,
      focusModeExitLoading: false,
    }));
  }, [call, fetchDashboardData, getRecentBriefs, toast]);

  const handleFocusModeClose = useCallback(() => {
			setUiState((prev) => ({
				...prev,
				focusModeOpen: false,
			}));
		}, []);

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

  // Handler for when focus mode is started
  const handleStartFocusMode = useCallback((focusTime: number) => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false,
      focusTime: focusTime * 60,
      userStatus: "focus" as UserStatus,
      focusModeActive: true
    }));
    
    toast({
      title: "Focus Mode Started",
      description: "Slack status set to 'focusing', Gmail status set to 'monitoring'"
    });
  }, [toast]);

  // const handleExitFocusMode = useCallback(() => {
  //   setUiState(prev => ({
  //     ...prev,
  //     endFocusModalOpen: true,
  //     userStatus: "active" as UserStatus,
  //     focusModeActive: false
  //   }));
    
  //   toast({
  //     title: "Focus Mode Ended",
  //     description: "Slack and Gmail status set to 'online'"
  //   });
  // }, [toast]);

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
    getRecentBriefs();
  }, [getRecentBriefs]);

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

  const handleOpenSignOffModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      SignOffModalOpen: true
    }));
  }, []);

  const handleSignOffStart = useCallback(async () => {
    const response = await call("post", "/api/sign-off", {
      showToast: true,
      toastTitle: "Sign Off Failed",
      toastDescription: "Something went wrong. Please try again later."
    });

    if (response) {
      toast({
        title: "Sign Off Successful",
        description: "Your sign off has been recorded successfully.",
      });

      fetchDashboardData();
      setUiState((prev) => ({
        ...prev,
        isSignoff: true,
        SignOffModalOpen: false,
      }));
    }
  }, [call, fetchDashboardData, toast]);


  const handleCloseSignOffModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      SignOffModalOpen: false
    }));
  }, []);

  // Memoized props to prevent unnecessary re-renders
  const layoutProps = useMemo(() => ({
    currentPage: "home", 
    sidebarOpen: uiState.sidebarOpen, 
    onToggleSidebar: handleToggleSidebar
  }), [uiState.sidebarOpen, handleToggleSidebar]);

  const statusTimerProps = useMemo(() => ({
    status: uiState.userStatus,
    focusTime: uiState.focusTime,
    focusModeExitLoading: uiState.focusModeExitLoading,
    isSignoff: uiState.isSignoff,
    briefSchedules: briefSchedules,
    userSchedule: userSchedule,
    fetchDashboardData: fetchDashboardData,
    onToggleFocusMode: handleToggleFocusMode, 
    onToggleCatchMeUp: handleToggleCatchMeUp,
    onToggleSignOff: handleOpenSignOffModal,
    onExitFocusMode: handleExitFocusMode
  }), [uiState.userStatus, uiState.focusTime, uiState.focusModeExitLoading, uiState.isSignoff, briefSchedules, userSchedule, fetchDashboardData, handleToggleFocusMode, handleToggleCatchMeUp, handleOpenSignOffModal, handleExitFocusMode ]);

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
          focusTime={uiState.focusTime}
          briefSchedules={briefSchedules}
          userSchedule={userSchedule}
        />
      )}
      
      <HomeView 
        onOpenBrief={handleOpenBrief}
        onToggleFocusMode={handleToggleFocusMode}
        onToggleCatchMeUp={handleToggleCatchMeUp}
        onOpenBriefModal={handleOpenBriefModal}
        priorityPeople={priorityPeople}
        recentBriefs={recentBriefs}
        status={uiState.userStatus}
        onExitFocusMode={handleExitFocusMode}
        focusModeExitLoading={uiState.focusModeExitLoading}
        onToggleSignOff={handleOpenSignOffModal}
        onStartFocusMode={handleStartFocusMode}
        onSignOffForDay={handleSignOffForDay}
      />
      
      {/* Modals */}
      <FocusMode 
        open={uiState.focusModeOpen}
        SaveChangesAndClose={handleStartFocusMode}
        onClose={handleFocusModeClose}
      />
      <SignOff 
        open={uiState.SignOffModalOpen}
        onConfirmSignOut={handleSignOffStart}
        onClose={handleCloseSignOffModal}
      />
      <CatchMeUp 
        open={uiState.catchMeUpOpen}
        onClose={handleCloseCatchMeUp}
        onGenerateSummary={handleGenerateCatchMeUpSummary}
      />
      <BriefModal 
        open={uiState.briefModalOpen}
        briefId={uiState.selectedBrief}
        onClose={handleCloseBriefModal}
      />
      <EndFocusModal {...endFocusModalProps} />
      <EndFocusModal {...catchUpModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
