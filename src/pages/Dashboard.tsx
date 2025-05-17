import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BriefsFeed from "@/components/dashboard/BriefsFeed";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import BriefModal from "@/components/dashboard/BriefModal";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import UpdateScheduleModal from "@/components/dashboard/UpdateScheduleModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import ConnectedAccounts from "@/components/dashboard/ConnectedAccounts";
import PriorityPeopleWidget from "@/components/dashboard/PriorityPeopleWidget";
import PriorityPeopleModal from "@/components/dashboard/PriorityPeopleModal";
import { NextBriefSection, UpcomingMeetingsSection } from "@/components/dashboard/HomeViewSections/SidebarSections";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type UserStatus = "active" | "away" | "focus" | "vacation";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Initialize state once, avoid unnecessary re-renders
  const [uiState, setUiState] = useState({
    briefDrawerOpen: false,
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: !isMobile, // Sidebar closed on mobile by default, open on desktop
    briefModalOpen: false,
    updateScheduleOpen: false,
    priorityPeopleModalOpen: false,
    endFocusModalOpen: false,
    catchUpModalOpen: false,
    userStatus: "active" as UserStatus
  });

  // Optimized callbacks to prevent re-creation on each render
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

  const handleOpenBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: true
    }));
  }, []);

  const handleCloseBriefDrawer = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefDrawerOpen: false
    }));
  }, []);

  const handleCloseFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false
    }));
  }, []);

  // Handler for when focus mode is started
  const handleStartFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false,
      userStatus: "focus" as UserStatus
    }));
  }, []);

  // Handler for exiting focus mode
  const handleExitFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: true
    }));
  }, []);

  // Handler for closing the end focus modal
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

  // New handler for generating catch me up summary
  const handleGenerateCatchMeUpSummary = useCallback((timeDescription: string) => {
    setUiState(prev => ({
      ...prev,
      catchMeUpOpen: false,
      catchUpModalOpen: true
    }));
  }, []);

  // Handler for closing the catch up modal
  const handleCloseCatchUpModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      catchUpModalOpen: false
    }));
    
    toast({
      title: "Catch Me Up Summary Ready",
      description: "Your summary has been created and emailed to you"
    });
    
    // Navigate to the catch-up page to show the summary
    navigate("/dashboard/catch-up");
  }, [toast, navigate]);

  const handleCloseBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: false
    }));
  }, []);

  const handleUpdateSchedule = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      updateScheduleOpen: true
    }));
  }, []);

  const handleCloseUpdateSchedule = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      updateScheduleOpen: false
    }));
  }, []);

  // New handler for priority people modal
  const handleOpenPriorityPeopleModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      priorityPeopleModalOpen: true
    }));
  }, []);

  // New handler for closing priority people modal
  const handleClosePriorityPeopleModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      priorityPeopleModalOpen: false
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
    onToggleFocusMode: handleToggleFocusMode, 
    onToggleCatchMeUp: handleToggleCatchMeUp,
    onExitFocusMode: handleExitFocusMode
  }), [uiState.userStatus, handleToggleFocusMode, handleToggleCatchMeUp, handleExitFocusMode]);

  const briefsFeedProps = useMemo(() => ({
    onOpenBrief: handleOpenBrief,
    onCatchMeUp: handleToggleCatchMeUp,
    onFocusMode: handleToggleFocusMode
  }), [handleOpenBrief, handleToggleCatchMeUp, handleToggleFocusMode]);

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
      <div className="container px-4 py-4 md:p-6 max-w-7xl mx-auto">
        {/* Timer and status section */}
        <StatusTimer {...statusTimerProps} />
        
        {/* Connected accounts and metrics section */}
        <div className="pb-4 pt-2">
          <ConnectedAccounts />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-8">
            {/* Briefs Feed */}
            <BriefsFeed {...briefsFeedProps} />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            {/* Priority People */}
            <div className="glass-card rounded-xl md:rounded-3xl p-3 md:p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-text-primary font-medium">Priority People</h2>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleOpenPriorityPeopleModal} 
                  className="h-7 w-7 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </Button>
              </div>
              <PriorityPeopleWidget />
            </div>
            
            {/* Next Brief */}
            <div className="glass-card rounded-xl md:rounded-3xl p-3 md:p-4">
              <NextBriefSection onUpdateSchedule={handleUpdateSchedule} />
            </div>
            
            {/* Upcoming Meetings */}
            <div className="glass-card rounded-xl md:rounded-3xl p-3 md:p-4">
              <UpcomingMeetingsSection />
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals and sheets */}
      <BriefDrawer 
        open={uiState.briefDrawerOpen}
        briefId={uiState.selectedBrief}
        onClose={handleCloseBriefDrawer}
      />
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
      <UpdateScheduleModal 
        open={uiState.updateScheduleOpen}
        onClose={handleCloseUpdateSchedule}
      />
      <PriorityPeopleModal
        open={uiState.priorityPeopleModalOpen}
        onClose={handleClosePriorityPeopleModal}
      />
      <EndFocusModal {...endFocusModalProps} />
      <EndFocusModal {...catchUpModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
