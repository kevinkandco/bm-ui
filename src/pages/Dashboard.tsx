
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import BriefMeModal from "@/components/dashboard/BriefMeModal";
import FocusModeConfig from "@/components/dashboard/FocusModeConfig";
import VacationStatusModal, { VacationSchedule } from "@/components/dashboard/VacationStatusModal";

import { Slack, Mail, Calendar, FileText, Users, MessageSquare } from "lucide-react";

interface ConnectedApp {
  id: string;
  name: string;
  icon: typeof Slack | typeof Mail | typeof Calendar | typeof FileText | typeof Users | typeof MessageSquare;
  color: string;
}

interface FocusConfig {
  duration: number;
  closeApps: Record<string, boolean>;
  statusUpdates: {
    slack: string;
  };
}

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [currentView, setCurrentView] = useState<"home" | "listening">("home");
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);
  const [showFocusConfig, setShowFocusConfig] = useState(false);
  const [focusConfig, setFocusConfig] = useState<FocusConfig | null>(null);
  const [showCatchUpModal, setShowCatchUpModal] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState<number | null>(null);
  const [awayStartTime, setAwayStartTime] = useState<number | null>(null);
  const [vacationSchedule, setVacationSchedule] = useState<VacationSchedule | null>(null);
  const [vacationStartTime, setVacationStartTime] = useState<number | null>(null);
  const [showVacationModal, setShowVacationModal] = useState(false);

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
    // Start generating brief and show catch-up modal
    setUserStatus("active");
    setFocusConfig(null);
    setFocusStartTime(null);
    setShowCatchUpModal(true);
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
  }, [connectedApps]);
  
  const handleStartFocusMode = useCallback(() => {
    console.log("Focus mode triggered - opening config modal");
    setShowFocusConfig(true);
  }, []);
  
  const handleSignOffForDay = useCallback(() => {
    setUserStatus("away");
    setAwayStartTime(Date.now());
    toast({
      title: "Signing Off",
      description: "You've signed off for today"
    });
  }, [toast]);

  const handleSignBackOn = useCallback(() => {
    setUserStatus("active");
    setAwayStartTime(null);
    toast({
      title: "Welcome Back",
      description: "You're now back online and monitoring"
    });
  }, [toast]);

  const handleStatusChange = useCallback((newStatus: "active" | "away" | "focus" | "vacation") => {
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

  const handleOpenVacationModal = useCallback(() => {
    setShowVacationModal(true);
  }, []);

  // Check if scheduled vacation should become active
  React.useEffect(() => {
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
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Force a re-render to check dates if vacation is scheduled
      if (vacationSchedule) {
        const now = new Date();
        // The effect above will handle the actual logic
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [vacationSchedule]);

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

  return (
    <div className="min-h-screen flex flex-col">
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
            userStatus={userStatus}
            focusConfig={focusConfig}
            focusStartTime={focusStartTime}
            awayStartTime={awayStartTime}
            vacationStartTime={vacationStartTime}
            onStatusChange={handleStatusChange}
            onExitFocusMode={handleExitFocusMode}
            onSignBackOn={handleSignBackOn}
            onOpenVacationModal={handleOpenVacationModal}
            onEndVacationNow={handleEndVacationNow}
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
    </div>
  );
};

export default Dashboard;
