
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

import HomeView from "@/components/dashboard/HomeView";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import NewBriefModal from "@/components/dashboard/NewBriefModal";
import TranscriptView from "@/components/dashboard/TranscriptView";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import BriefMeModal from "@/components/dashboard/BriefMeModal";
import FocusModeConfig from "@/components/dashboard/FocusModeConfig";

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

  // Mock connected apps - in real app this would come from user's integrations
  const connectedApps: ConnectedApp[] = [
    { id: "slack", name: "Slack", icon: Slack, color: "text-purple-400" },
    { id: "gmail", name: "Gmail", icon: Mail, color: "text-blue-400" },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "text-green-400" },
    { id: "notion", name: "Notion", icon: FileText, color: "text-gray-400" },
    { id: "jira", name: "Jira", icon: Users, color: "text-blue-500" },
  ];

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
    Object.entries(config.closeApps).forEach(([appId, shouldClose]) => {
      if (shouldClose) {
        const app = connectedApps.find(a => a.id === appId);
        if (app) {
          actionsText.push(`${app.name} closed`);
        }
      }
    });
    
    toast({
      title: "Focus Mode Started",
      description: `${config.duration} minute focus session started. ${actionsText.length > 0 ? actionsText.join(', ') + '. ' : ''}Slack status updated.`
    });
  }, [toast, connectedApps]);
  
  const handleStartFocusMode = useCallback(() => {
    console.log("Focus mode triggered - opening config modal");
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
            onStatusChange={setUserStatus}
            onExitFocusMode={handleExitFocusMode}
            onSignBackOn={handleSignBackOn}
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
    </div>
  );
};

export default Dashboard;
