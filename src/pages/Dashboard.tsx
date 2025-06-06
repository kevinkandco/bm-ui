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
import { BriefSchedules, UserSchedule, PriorityPeople, Summary, Priorities } from "@/components/dashboard/types";
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
    focusModeActive: false,
    focusModeActivationLoading: false
  });
  const [priorities, setPriorities] = useState<Priorities | null>(null);
  const [briefSchedules, SetBriefSchedules] = useState<BriefSchedules[] | null>(null);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [recentBriefs, setRecentBriefs] = useState<Summary[] | null>(null);
  const [pendingData, setPendingData] = useState<PendingData[] | null>(null);
  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
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
        userStatus: response?.mode === 'focus'
          ? 'focus'
          : response.sign_off
          ? 'away'
          : 'active',
        focusModeActive: response?.mode === 'focus',
        isSignoff: response.sign_off || false,
        focusTime: response.focusRemainingTime,
      }));

      setUserSchedule(response.userSchedule);
      SetBriefSchedules(response.briefSchedules);
      setPriorities((prev) => {
        return {
          ...prev,
          priorityPeople: response.priorityPeople,
          priorityChannels: response.channels?.map((channel) => ({ name: channel, active: true })) || [],
          triggers: response.triggers
        };
      });
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

  const getBrief = useCallback(
      async (briefId: number): Promise<false | Summary> => {
        const response = await call("get", `/api/summary/${briefId}/status`, {
          showToast: true,
          toastTitle: "Failed to fetch brief",
          toastDescription: "Something went wrong while fetching the brief.",
          returnOnFailure: false, 
        });
  
        return response?.data?.status === "success" || response?.data?.status === "failed" ? response?.data : false;
      },
      [call]
    );

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

  useEffect(() => {
      if (!recentBriefs) return;
  
      const newPending = recentBriefs
        ?.filter(
          (brief) => brief.status !== "success" && brief.status !== "failed"
        )
        .map((brief) => ({ id: brief.id, status: true }));
  
      setPendingData(newPending);
    }, [recentBriefs, setPendingData]);


    useEffect(() => {
          // Clear existing intervals first
          intervalIDsRef.current.forEach(clearInterval);
          intervalIDsRef.current = [];
      
          if (!pendingData?.length) return;
      
          const ids = pendingData.map((item) => {
            const intervalId = setInterval(async () => {
              const data = await getBrief(item.id);
      
              if (data) {
                setPendingData(
                  (prev) => prev?.filter((data) => data.id !== item.id) ?? []
                );
      
                setRecentBriefs((prev) => {
                  if (!prev) return null;
                  return prev?.map((brief) => brief.id === item.id ? data : brief) || null;
                });
      
                clearInterval(intervalId);
      
                intervalIDsRef.current = intervalIDsRef.current?.filter(
                  (id) => id !== intervalId
                );
              }
            }, 3000);
      
            return intervalId;
          });
      
          intervalIDsRef.current = ids;
      
          return () => {
            intervalIDsRef.current.forEach(clearInterval);
            intervalIDsRef.current = [];
          };
        }, [pendingData, getBrief]);

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
  const handleStartFocusMode = useCallback(
    async (
      focusTime: number,
      options: {
        updateStatus?: boolean;
        closeApps?: boolean;
        monitorNotifications?: boolean;
        enableDnd?: boolean;
      } = {}
    ) => {
      setUiState((prev) => ({
        ...prev,
        focusModeActivationLoading: true,
      }))

      const response = await call("post", "/api/focus-mode", {
        body: { ...options, focusDuration: focusTime },
        showToast: true,
        toastTitle: "Focus Mode Activation Failed",
        toastDescription:
          "Focus mode activation failed. please try again sometime later.",
        toastVariant: "destructive",
        returnOnFailure: false,
      });
      if (response) {
        setUiState((prev) => ({
          ...prev,
          focusModeOpen: false,
          focusTime: focusTime * 60,
          userStatus: "focus" as UserStatus,
          focusModeActive: true,
          focusModeActivationLoading: false
        }));

        toast({
          title: "Focus Mode Started",
          description:
            "Slack status set to 'focusing', Gmail status set to 'monitoring'",
        });
      }
    },
    [toast, call]
  );

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
    const response = call("post", "/api/sign-off", {
      showToast: true,
      toastTitle: "Sign Off Failed",
      toastDescription:
        "Sign off failed. please try again sometime later.",
      toastVariant: "destructive"
    })

    if (!response) {
      return;
    }
    setUiState(prev => ({
      ...prev,
      userStatus: "away" as UserStatus
    }));
    
    toast({
      title: "Signed Off",
      description: "We'll monitor your channels until your next auto-scheduled brief"
    });
  }, [toast, call]);

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
    
    // navigate("/dashboard/catch-up");
  }, [toast]);

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
      {(uiState.focusModeActive || uiState.userStatus === "away") && (
        <StatusTimer 
          status={uiState.userStatus}
          onExitFocusMode={handleExitFocusMode}
          focusTime={uiState.focusTime}
          briefSchedules={briefSchedules}
          userSchedule={userSchedule}
          focusModeExitLoading={uiState.focusModeExitLoading}
        />
      )}
      
      {/* Add extra top padding here */}
      <div className="pt-16">
        <HomeView 
          onOpenBrief={handleOpenBrief}
          onToggleFocusMode={handleToggleFocusMode}
          onToggleCatchMeUp={handleToggleCatchMeUp}
          onOpenBriefModal={handleOpenBriefModal}
          priorities={priorities}
          recentBriefs={recentBriefs}
          status={uiState.userStatus}
          onExitFocusMode={handleExitFocusMode}
          focusModeExitLoading={uiState.focusModeExitLoading}
          onToggleSignOff={handleOpenSignOffModal}
          onStartFocusMode={handleStartFocusMode}
          onSignOffForDay={handleSignOffForDay}
          fetchDashboardData={fetchDashboardData}
        />
      </div>
      
      {/* Modals */}
      <FocusMode 
        open={uiState.focusModeOpen}
        loading={uiState.focusModeActivationLoading}
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
