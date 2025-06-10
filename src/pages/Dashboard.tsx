import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
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
import BriefMeModal from "@/components/dashboard/BriefMeModal";

type UserStatus = "active" | "away" | "focus" | "vacation";

export interface PendingData {
  id: number;
  status: boolean;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { call } = useApi();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"home" | "listening">("home");
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [briefSchedules, SetBriefSchedules] = useState<BriefSchedules[]>([]);
  const [upcomingBrief, setUpcomingBrief] = useState<Summary | null>(null);
  const [focusTime, setFocusTime] = useState(0);
  const [recentBriefs, setRecentBriefs] = useState<Summary[]>([]);
  const [totalBriefs, setTotalBriefs] = useState(0);
  const [pendingData, setPendingData] = useState<PendingData[]>([]);
  const [focusModeExitLoading, setFocusModeExitLoading] = useState(false);
  const [priorities, setPriorities] = useState<Priorities>({
    priorityPeople: [],
    priorityChannels: [],
    triggers: [],
    integrations: [],
  });

  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
  const [searchParams] = useSearchParams();

  const fetchDashboardData = useCallback(async () => {
    const response = await call("get", "/api/dashboard", {
      showToast: true,
      toastTitle: "Failed to fetch user data",
      toastDescription: "Something went wrong. Failed to fetch user data.",
    });

    if (response) {
      setUserStatus(response?.mode === 'focus' ? 'focus' : response.sign_off ? 'away' : 'active');
      setUserSchedule(response.userSchedule);
      SetBriefSchedules(response.briefSchedules);
      setUpcomingBrief(response.upComingBrief);
      setFocusTime(response.focusRemainingTime);
      setPriorities((prev) => {
        return {
          ...prev,
          priorityPeople: response.priorityPeople,
          priorityChannels: response.channels?.map((channel) => ({ name: channel, active: true })) || [],
          triggers: response.triggers,
          integrations: response.integrations ? response.integrations?.map((integration) => ({name: integration, active: true})) : [],
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
    setTotalBriefs(response?.meta?.total);
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
    setShowBriefMeModal(true);
  }, []);
  
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
          focusTime={focusTime}
          briefSchedules={briefSchedules}
          userSchedule={userSchedule}
          focusModeExitLoading={focusModeExitLoading}
          onExitFocusMode={handleExitFocusMode}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        {currentView === "home" && (
          <HomeView
            status={userStatus}
            priorities={priorities}
            recentBriefs={recentBriefs}
            totalBriefs={totalBriefs}
            upcomingBrief={upcomingBrief}
            onOpenBrief={openBriefDetails}
            onViewTranscript={openTranscript}
            onStartFocusMode={handleStartFocusMode}
            onToggleFocusMode={handleToggleFocusMode}
            onToggleCatchMeUp={handleToggleCatchMeUp}
            onOpenBriefModal={openBriefModal}
            onExitFocusMode={handleExitFocusMode}
            onSignOffForDay={handleSignOffForDay}
            fetchDashboardData={fetchDashboardData}
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
    </div>
  );
};

export default Dashboard;
