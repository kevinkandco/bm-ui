import { useState, useCallback, useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BriefSchedules, UserSchedule, PriorityPeople, Summary, Priorities, CalendarEvent, CalenderData, IStatus, UserIntegrations } from "@/components/dashboard/types";
import SignOff from "@/components/dashboard/SignOff";
import { useApi } from "@/hooks/useApi";
import BriefMeModal from "@/components/dashboard/BriefMeModal";
import { enrichBriefsWithStats, transformToStats } from "@/lib/utils";
import FocusModeConfig from "@/components/dashboard/FocusModeConfig";
import FancyLoader from "@/components/settings/modal/FancyLoader";
import FocusMode from "@/components/dashboard/FocusMode";
import { requestNotificationPermission } from "@/firebase/fcmService";
import VacationStatusModal, { VacationSchedule } from "@/components/dashboard/VacationStatusModal";
import { OfflineStatusModal } from "@/components/dashboard/OfflineStatusModal";

import { Slack, Mail, Calendar, FileText, Users, MessageSquare } from "lucide-react";

interface ConnectedApp {
  id: string;
  name: string;
  icon: typeof Slack | typeof Mail | typeof Calendar | typeof FileText | typeof Users | typeof MessageSquare;
  color: string;
}

export interface PendingData {
  id: number;
  status: boolean;
}

interface Transcript {
  id: number;
  title: string;
  transcript: string;
}
interface FocusConfig {
  duration: number;
  closeApps: Record<string, boolean>;
  statusUpdates: {
    slack: string;
  };
}

interface OfflineSchedule {
  startTime: Date;
  endTime: Date;
  slackSync: boolean;
  teamsSync: boolean;
  slackMessage: string;
  teamsMessage: string;
  enableDND: boolean;
}

const Dashboard = () => {
  const { toast } = useToast();
  const { call } = useApi();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState<"home" | "listening">("home");
  const [userStatus, setUserStatus] = useState<IStatus>("active");
  const [focusModeAppType, setFocusModeAppType] = useState<"offline" | "DND" | null>(null);
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [transcript, setTranscript] = useState<Transcript | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);
  const [userSchedule, setUserSchedule] = useState<UserSchedule | null>(null);
  const [briefSchedules, SetBriefSchedules] = useState<BriefSchedules[]>([]);
  const [upcomingBrief, setUpcomingBrief] = useState<Summary | null>(null);
  const [focusTime, setFocusTime] = useState(0);
  const [recentBriefs, setRecentBriefs] = useState<Summary[]>([]);
  const [totalBriefs, setTotalBriefs] = useState(0);
  const [briefsLoading, setBriefsLoading] = useState(false);
  const [pendingData, setPendingData] = useState<PendingData[]>([]);
  const [focusModeExitLoading, setFocusModeExitLoading] = useState(false);
  const [focusModeActivationLoading, setFocusModeActivationLoading] = useState(false);
  const [showFocusConfig, setShowFocusConfig] = useState(false);
  const [focusConfig, setFocusConfig] = useState<FocusConfig | null>(null);
  const [showCatchUpModal, setShowCatchUpModal] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [awayStartTime, setAwayStartTime] = useState<number | null>(null);
  const [vacationSchedule, setVacationSchedule] = useState<VacationSchedule | null>(null);
  const [vacationStartTime, setVacationStartTime] = useState<number | null>(null);
  const [showVacationModal, setShowVacationModal] = useState(false);
  const [offlineSchedule, setOfflineSchedule] = useState<OfflineSchedule | null>(null);
  const [offlineStartTime, setOfflineStartTime] = useState<number | null>(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [userintegrations, setUserIntegrations] = useState<UserIntegrations[]>([]);

  const [calendarData, setCalendarData] = useState<CalenderData>({
    today: [],
    upcoming: [],
  });
  const [priorities, setPriorities] = useState<Priorities>({
    priorityPeople: [],
    priorityChannels: [],
    triggers: [],
    integrations: [],
  });
  const [loading, setLoading] = useState(true);

  const intervalIDsRef = useRef<NodeJS.Timeout[]>([]);
  const [searchParams] = useSearchParams();
  const fetchDashboardData = useCallback(async () => {
    const response = await call("get", "/dashboard", {
      showToast: true,
      toastTitle: "Failed to fetch user data",
      toastDescription: "Something went wrong. Failed to fetch user data.",
    });

    if (response) {
      setUserStatus(() => {
				return response?.mode === "focus"
					? response?.focusType === "App" ? "app focus" : "focus"
					: response.sign_off
					? "away"
					: "active";
			});
      setFocusModeAppType(response?.focusType === "App" && response?.mode === "focus" ? response?.focusModeAppType : null); 
      setUserSchedule(response.userSchedule);
      SetBriefSchedules(response.briefSchedules);
      setUpcomingBrief(response.upComingBrief);
      setFocusTime(response.focusRemainingTime);
      const priorityPeople = [
        ...(Array.isArray(response?.slackPriorityPeople) ? response.slackPriorityPeople : []),
        ...(Array.isArray(response?.googlePriorityPeople) ? response.googlePriorityPeople : []),
      ];
      setUserIntegrations(response?.user_integrations || []);
      setPriorities((prev) => {
        return {
          ...prev,
          priorityPeople: priorityPeople,
          priorityChannels: response.channels?.map((channel) => ({ name: channel, active: true })) || [],
          triggers: response.triggers,
          integrations: response.integrations ? response.integrations?.map((integration) => ({name: integration, active: true})) : [],
        };
      });
    }
  }, [call]);

  const getCalendarData = useCallback(async () => {
    // setBriefsLoading(true);
    const response = await call("get", `/calendar/data`, {
      showToast: true,
      toastTitle: "Failed to fetch calendar data",
      toastDescription: "Something went wrong while fetching the calendar.",
      returnOnFailure: false,
    });
    if (!response && !response.data) return;
    setCalendarData({
      today: response.data.today,
      upcoming: response.data.upcoming
    });
    // setBriefsLoading(false);
  }, [call]);

  const getRecentBriefs = useCallback(async () => {
    setBriefsLoading(true);
    const response = await call("get", `/summaries?date_filter=${new Date().toISOString().slice(0, 10)}`, {
      showToast: true,
      toastTitle: "Failed to fetch briefs",
      toastDescription: "Something went wrong while fetching the briefs.",
      returnOnFailure: false,
    });

    if (!response) return;

    setRecentBriefs(enrichBriefsWithStats(response?.data));
    setTotalBriefs(response?.meta?.total);
    setBriefsLoading(false);
  }, [call]);

  const getBrief = useCallback(
      async (briefId: number): Promise<false | Summary> => {
        const response = await call("get", `/summary/${briefId}/status`, {
          showToast: true,
          toastTitle: "Failed to fetch brief",
          toastDescription: "Something went wrong while fetching the brief.",
          returnOnFailure: false, 
        });
  
        return response?.data?.status === "success" || response?.data?.status === "failed" ? response?.data : false;
      },
      [call]
    );

    const handleLoginSuccess = useCallback(async () => {
      const token = await requestNotificationPermission();

      if (token) {
        await call("post", `/store-token`, {
          body: { token },
        });
      }
    }, [call]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            const tokenFromUrl = searchParams.get("token");

            if (tokenFromUrl) {
            localStorage.setItem("token", tokenFromUrl);

            const url = new URL(window.location.href);
            url.searchParams.delete("token");
            url.searchParams.delete("provider");
            handleLoginSuccess();
            window.history.replaceState({}, document.title, url.pathname + url.search);
            }

            try {
            await Promise.all([
                fetchDashboardData(),
                getCalendarData(),
                getRecentBriefs()
            ]);
            } catch (error) {
            console.error("Failed to load data:", error);
            } finally {
            setLoading(false);
            }
        };

        loadData();
    }, [searchParams, getRecentBriefs, fetchDashboardData, getCalendarData, handleLoginSuccess]);

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
                const stats = transformToStats(data);
                const dataWithStats = { ...data, stats };
                setPendingData(
                  (prev) => prev?.filter((data) => data.id !== item.id) ?? []
                );
      
                setRecentBriefs((prev) => {
                  if (!prev) return null;
                  return prev?.map((brief) => brief.id === item.id ? dataWithStats : brief) || null;
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

  // Mock connected apps - in real app this would come from user's integrations
  const connectedApps: ConnectedApp[] = [
    { id: "slack", name: "Slack", icon: Slack, color: "text-purple-400" },
    { id: "gmail", name: "Gmail", icon: Mail, color: "text-blue-400" },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "text-green-400" },
    { id: "notion", name: "Notion", icon: FileText, color: "text-gray-400" },
    { id: "jira", name: "Jira", icon: Users, color: "text-blue-500" },
  ];
  
  console.log("Dashboard connectedApps:", connectedApps);

  const openBriefDetails = useCallback((briefId: number) => {
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  const openTranscript = useCallback((briefId: number, title: string, transcript: string) => {
    setTranscript({
      id: briefId,
      title: title,
      transcript: transcript
    })
    setIsTranscriptOpen(true);
  }, [setIsTranscriptOpen]);
  
  const closeTranscript = useCallback(() => {
    setIsTranscriptOpen(false);
    setTranscript(null);
  }, [setIsTranscriptOpen]);

  const handleToggleFocusMode = useCallback(() => {
    setShowFocusConfig(true);
    }, []);

  const handleExitFocusMode = useCallback(async () => {
    setFocusModeExitLoading(true);

    const response = await call("get", "/exit-focus-mode", {
      showToast: true,
      toastTitle: "Focus Mode Exit failed",
      toastDescription: "Something went wrong. Please try again later.",
    });

    if (response) {
      setShowEndFocusModal(true);
      fetchDashboardData();
      getRecentBriefs();
    
      toast({
        title: "Focus Mode Ended",
        description: "Slack and Gmail status set to 'online'"
      });
    }

    setFocusModeExitLoading(false);
  }, [call, fetchDashboardData, getRecentBriefs, toast]);
  // const handleExitFocusMode = useCallback(() => {
  //   // Start generating brief and show catch-up modal
  //   setUserStatus("active");
  //   setFocusConfig(null);
  //   setFocusStartTime(null);
  //   setShowCatchUpModal(true);
  // }, []);

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

  const handleFocusModalClose = useCallback(() => {
    setShowFocusConfig(false);
  }, []);
  
  const handleStartFocusMode = useCallback(
    async (
      // focusTime: number,
      // options: {
      //   updateStatus?: boolean;
      //   closeApps?: boolean;
      //   monitorNotifications?: boolean;
      //   enableDnd?: boolean;
      // } = {}
    ) => {
      setShowFocusConfig(true);
      // setFocusModeActivationLoading(true);

      // const response = await call("post", "/focus-mode", {
      //   body: { ...options, focusDuration: focusTime },
      //   showToast: true,
      //   toastTitle: "Focus Mode Activation Failed",
      //   toastDescription:
      //     "Focus mode activation failed. please try again sometime later.",
      //   toastVariant: "destructive",
      //   returnOnFailure: false,
      // });
      // if (response) {
      //   setUserStatus("focus");
      //   setFocusTime(focusTime * 60);
      //   setFocusModeActivationLoading(false);
      //   setShowFocusConfig(false);

      //   toast({
      //     title: "Focus Mode Started",
      //     description:
      //       "Slack status set to 'focusing', Gmail status set to 'monitoring'",
      //   });
      // }
    },
    // [toast, call]
    []
  );

  const handleStartFocusModeWithConfig = useCallback(async (config: FocusConfig) => {

    const response = await call("post", "/focus-mode", {
        body: config,
        showToast: true,
        toastTitle: "Focus Mode Activation Failed",
        toastDescription:
          "Focus mode activation failed. please try again sometime later.",
        toastVariant: "destructive",
        returnOnFailure: false,
      });

      if (!response) return;

    setFocusConfig(config);
    setUserStatus("focus");
    // setFocusTime(config?.duration * 60);
    setFocusStartTime(Date.now());
    
    // Simulate closing apps and updating status
    const actionsText = [];
    Object.entries(config.closeApps).forEach(([appId, shouldClose]) => {
      if (shouldClose) {
        const app = connectedApps.find(a => a.id === appId);
        if (app) {
          actionsText.push(`${app.name} closed`);
        }
      }
    });
  }, [connectedApps, call]);

  const handleSignOffForDay = useCallback(async() => {
    const response = await call("post", "/sign-off", {
      showToast: true,
      toastTitle: "Sign Off Failed",
      toastDescription:
        "Sign off failed. please try again sometime later.",
      toastVariant: "destructive"
    })

    if (!response) {
      return;
    }
    setUserStatus("away");
    
    toast({
      title: "Signing Off",
      description: "You've signed off for today"
    });
  }, [toast]);

  // const handleStartFocusMode = useCallback(() => {
  //   console.log("Focus mode triggered - opening config modal");
  //   setShowFocusConfig(true);
  // }, []);
  
  //   const handleSignOffForDay = useCallback(() => {
  //   setUserStatus("away");
  //   setAwayStartTime(Date.now());
  //   toast({
  //     title: "Signing Off",
  //     description: "You've signed off for today"
  //   });
  // }, [toast]);

  const handleSignBackOn = useCallback(async() => {
    const response = await call("post", "/sign-back-on", {
      showToast: true,
      toastTitle: "Sign Back On Failed",
      toastDescription:
        "Sign Back On failed. please try again sometime later.",
      toastVariant: "destructive",
    })

    if (!response) {
      return;
    }
    setUserStatus("active");
    getRecentBriefs();
    setAwayStartTime(null);
    toast({
      title: "Welcome Back",
      description: "You're now back online and monitoring"
    });
  }, [toast, call, getRecentBriefs]);

  const handleStatusChange = useCallback((newStatus: "active" | "away" | "focus" | "vacation" | "offline") => {
    if (newStatus === "away" && userStatus !== "away") {
      setAwayStartTime(Date.now());
    } else if (newStatus !== "away" && userStatus === "away") {
      setAwayStartTime(null);
    }
    
    if (newStatus === "vacation" && userStatus !== "vacation") {
      setVacationStartTime(Date.now());
    } else if (newStatus !== "vacation" && userStatus === "vacation") {
      setVacationStartTime(null);
    }

    if (newStatus === "offline" && userStatus !== "offline") {
      // Don't set status immediately, open modal instead
      setShowOfflineModal(true);
      return;
    } else if (newStatus !== "offline" && userStatus === "offline") {
      setOfflineStartTime(null);
      setOfflineSchedule(null);
    }
    
    setUserStatus(newStatus);
  }, [userStatus]);

  const handleSaveVacationSchedule = useCallback((schedule: VacationSchedule) => {
    setVacationSchedule(schedule);
    
    // If the vacation starts now or in the past, activate immediately
    if (schedule.startDate <= new Date()) {
      setUserStatus("vacation");
      setVacationStartTime(schedule.startDate.getTime());
    }
    
    toast({
      title: "Vacation Scheduled",
      description: `Vacation period set from ${schedule.startDate.toLocaleDateString()} to ${schedule.endDate.toLocaleDateString()}`
    });
  }, [toast]);

  const handleEndVacationNow = useCallback(() => {
    setUserStatus("active");
    setVacationStartTime(null);
    setVacationSchedule(null);
    
    toast({
      title: "Vacation Ended",
      description: "You're now back online and monitoring"
    });
  }, [toast]);

  const handleSaveOfflineSchedule = useCallback((schedule: OfflineSchedule) => {
    setOfflineSchedule(schedule);
    setUserStatus("offline");
    setOfflineStartTime(schedule.startTime.getTime());
    
    toast({
      title: "Now Offline",
      description: `Offline until ${schedule.endTime.toLocaleString()}`
    });
  }, [toast]);

  const handleEndOfflineNow = useCallback(() => {
    setUserStatus("active");
    setOfflineStartTime(null);
    setOfflineSchedule(null);
    
    toast({
      title: "Back Online",
      description: "You're now back online and monitoring"
    });
  }, [toast]);

  const handleExtendOffline = useCallback((newEndTime: Date) => {
    if (offlineSchedule) {
      setOfflineSchedule(prev => prev ? { ...prev, endTime: newEndTime } : null);
    }
  }, [offlineSchedule]);

  const handleOpenVacationModal = useCallback(() => {
    setShowVacationModal(true);
  }, []);

  // Check if scheduled vacation should become active
  useEffect(() => {
    if (vacationSchedule && !vacationSchedule.isActive && userStatus !== "vacation") {
      const now = new Date();
      if (now >= vacationSchedule.startDate && now <= vacationSchedule.endDate) {
        setUserStatus("vacation");
        setVacationStartTime(vacationSchedule.startDate.getTime());
        setVacationSchedule(prev => prev ? { ...prev, isActive: true } : null);
      }
    }
    
    // Check if active vacation should end
    if (vacationSchedule && vacationSchedule.isActive && userStatus === "vacation") {
      const now = new Date();
      if (now > vacationSchedule.endDate) {
        setUserStatus("active");
        setVacationStartTime(null);
        
        // Show catch-up brief if enabled
        if (vacationSchedule.deliverCatchUpBrief) {
          setShowCatchUpModal(true);
        }
        
        setVacationSchedule(null);
        toast({
          title: "Welcome Back",
          description: "Your vacation has ended. You're now back online and monitoring"
        });
      }
    }
  }, [vacationSchedule, userStatus, toast, setShowCatchUpModal]);

  // Polling to check vacation schedule every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force a re-render to check dates if vacation is scheduled
      if (vacationSchedule) {
        const now = new Date();
        // The effect above will handle the actual logic
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [vacationSchedule]);

  // Check if scheduled offline should end
  useEffect(() => {
    if (offlineSchedule && userStatus === "offline") {
      const now = new Date();
      if (now > offlineSchedule.endTime) {
        handleEndOfflineNow();
      }
    }
  }, [offlineSchedule, userStatus, handleEndOfflineNow]);

  // Polling to check offline schedule every minute
  useEffect(() => {
    const interval = setInterval(() => {
      if (offlineSchedule && userStatus === "offline") {
        const now = new Date();
        // The effect above will handle the actual logic
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [offlineSchedule, userStatus]);

  const handleGenerateBrief = useCallback(() => {
    // This would typically trigger the creation of a new brief
    console.log("Generating new brief...");
  }, []);

  const handleGenerateCatchUpBrief = useCallback((timeDescription: string) => {
    setShowCatchUpModal(false);
    console.log("Generating catch-up brief for:", timeDescription);
    
    toast({
      title: "Brief Generated",
      description: "Your catch-up brief has been created successfully"
    });
  }, [toast]);

  if (loading) {
    return <FancyLoader />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1">
        {currentView === "home" && (
          <HomeView
            status={userStatus}
            priorities={priorities}
            recentBriefs={recentBriefs}
            totalBriefs={totalBriefs}
            briefsLoading={briefsLoading}
            upcomingBrief={upcomingBrief}
            calendarData={calendarData}
            userintegrations={userintegrations}
            onOpenBrief={openBriefDetails}
            onViewTranscript={openTranscript}
            onStartFocusMode={handleStartFocusMode}
            onToggleFocusMode={handleToggleFocusMode}
            onToggleCatchMeUp={handleToggleCatchMeUp}
            onOpenBriefModal={openBriefModal}
            onExitFocusMode={handleExitFocusMode}
            onSignOffForDay={handleSignOffForDay}
            fetchDashboardData={fetchDashboardData}
            userStatus={userStatus}
            focusConfig={focusConfig}
            focusStartTime={focusStartTime}
            awayStartTime={awayStartTime}
            vacationStartTime={vacationStartTime}
            onStatusChange={handleStatusChange}
            onSignBackOn={handleSignBackOn}
            onOpenVacationModal={handleOpenVacationModal}
            onEndVacationNow={handleEndVacationNow}
            offlineSchedule={offlineSchedule}
            offlineStartTime={offlineStartTime}
            onEndOfflineNow={handleEndOfflineNow}
            onExtendOffline={handleExtendOffline}
          />
        )}
        {currentView === "listening" && <ListeningScreen />}
      </div>

      {/* Modals */}
      <NewBriefModal open={isBriefModalOpen} onClose={closeBriefModal} />
      <TranscriptView briefId={transcript?.id} open={isTranscriptOpen} onClose={closeTranscript} transcript={transcript?.transcript} title={transcript?.title} />
      <EndFocusModal 
        open={showEndFocusModal} 
        onClose={handleConfirmExitFocus}
        title="Creating Your Brief"
        description="We're preparing a summary of all updates during your focus session"
      />
      {/* <FocusMode 
        open={focusModalOpen}
        loading={focusModeActivationLoading}
        SaveChangesAndClose={handleStartFocusMode}
        onClose={handleFocusModalClose}
      /> */}
      <BriefMeModal
        open={showBriefMeModal}
        onClose={() => setShowBriefMeModal(false)}
        getRecentBriefs={getRecentBriefs}
      />
      <FocusModeConfig
        isOpen={showFocusConfig}
        onClose={handleFocusModalClose}
        onStartFocus={handleStartFocusModeWithConfig}
        connectedApps={connectedApps}
      />
      
      {/* Import and add the CatchMeUp modal */}
      <Dialog open={showCatchUpModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Catch-Up Brief</DialogTitle>
            <DialogDescription>
              You've exited focus mode. Generate a brief to catch up on what you missed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Button onClick={() => handleGenerateCatchUpBrief("focus session")} className="w-full">
              Generate Catch-Up Brief
            </Button>
            <Button variant="outline" onClick={() => setShowCatchUpModal(false)} className="w-full">
              Skip for Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <VacationStatusModal
        isOpen={showVacationModal}
        onClose={() => setShowVacationModal(false)}
        onSave={handleSaveVacationSchedule}
        currentVacation={vacationSchedule}
      />

      <OfflineStatusModal
        isOpen={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        onSchedule={handleSaveOfflineSchedule}
      />
    </div>
  );
};

export default Dashboard;
