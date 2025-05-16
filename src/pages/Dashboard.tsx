
import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BriefsFeed from "@/components/dashboard/BriefsFeed";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import BriefModal from "@/components/dashboard/BriefModal";
import StatusTimer from "@/components/dashboard/StatusTimer";
import ConnectedAccounts from "@/components/dashboard/ConnectedAccounts";
import PriorityPeopleWidget from "@/components/dashboard/PriorityPeopleWidget";
import { NextBriefSection, UpcomingMeetingsSection } from "@/components/dashboard/HomeViewSections/SidebarSections";
import { Button } from "@/components/ui/button";
import { Headphones, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserStatus = "active" | "away" | "focus" | "vacation";

const Dashboard = () => {
  const { toast } = useToast();
  // Initialize state once, avoid unnecessary re-renders
  const [uiState, setUiState] = useState({
    briefDrawerOpen: false,
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: false, // Sidebar closed by default
    briefModalOpen: false,
    userStatus: "active" as UserStatus // Explicitly type as UserStatus
  });

  // Optimized callbacks to prevent re-creation on each render
  const handleOpenBrief = useCallback((briefId: number) => {
    setUiState(prev => ({
      ...prev,
      selectedBrief: briefId,
      briefModalOpen: true // Open modal instead of drawer
    }));
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: !prev.focusModeOpen,
      userStatus: prev.userStatus === "focus" ? "active" : "focus"
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
      focusModeOpen: false,
      userStatus: "active" as UserStatus
    }));
  }, []);

  const handleCloseCatchMeUp = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      catchMeUpOpen: false
    }));
  }, []);

  const handleCloseBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: false
    }));
  }, []);

  const handleUpdateSchedule = useCallback(() => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings",
    });
  }, [toast]);

  const handleUpdatePriorityPeople = useCallback(() => {
    toast({
      title: "Priority People",
      description: "Opening priority people settings",
    });
  }, [toast]);

  // Memoize drawer props to prevent unnecessary re-renders
  const briefDrawerProps = useMemo(() => ({
    open: uiState.briefDrawerOpen,
    briefId: uiState.selectedBrief,
    onClose: handleCloseBriefDrawer
  }), [uiState.briefDrawerOpen, uiState.selectedBrief, handleCloseBriefDrawer]);

  const focusModeProps = useMemo(() => ({
    open: uiState.focusModeOpen,
    onClose: handleCloseFocusMode
  }), [uiState.focusModeOpen, handleCloseFocusMode]);

  const catchMeUpProps = useMemo(() => ({
    open: uiState.catchMeUpOpen,
    onClose: handleCloseCatchMeUp
  }), [uiState.catchMeUpOpen, handleCloseCatchMeUp]);

  const briefModalProps = useMemo(() => ({
    open: uiState.briefModalOpen,
    onClose: handleCloseBriefModal
  }), [uiState.briefModalOpen, handleCloseBriefModal]);

  return (
    <DashboardLayout 
      currentPage="home" 
      sidebarOpen={uiState.sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        {/* Top Action Buttons */}
        <div className="flex justify-end mb-6 gap-3">
          <Button 
            onClick={handleToggleCatchMeUp}
            className="rounded-full bg-accent-primary text-white"
          >
            <Zap className="mr-2 h-5 w-5" /> Catch Me Up
          </Button>
          <Button 
            onClick={handleToggleFocusMode}
            variant="outline"
            className="rounded-full border-border-subtle"
          >
            <Headphones className="mr-2 h-5 w-5" /> Focus Mode
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Feed Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Status Timer and Connected Accounts */}
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="md:flex-1">
                <StatusTimer status={uiState.userStatus} />
              </div>
              <div className="mt-4 md:mt-0">
                <ConnectedAccounts />
              </div>
            </div>
            
            {/* Briefs Feed */}
            <BriefsFeed 
              onOpenBrief={handleOpenBrief}
              onCatchMeUp={handleToggleCatchMeUp}
              onFocusMode={handleToggleFocusMode}
            />
          </div>
          
          {/* Right Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Priority People */}
            <div className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary font-medium">Priority People</h2>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleUpdatePriorityPeople} 
                  className="h-8 w-8 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </Button>
              </div>
              <PriorityPeopleWidget />
            </div>
            
            {/* Next Brief */}
            <div className="py-4">
              <NextBriefSection onUpdateSchedule={handleUpdateSchedule} />
            </div>
            
            {/* Upcoming Meetings */}
            <div className="py-4">
              <UpcomingMeetingsSection />
            </div>
          </div>
        </div>
      </div>
      
      <BriefDrawer {...briefDrawerProps} />
      <FocusMode {...focusModeProps} />
      <CatchMeUp {...catchMeUpProps} />
      <BriefModal {...briefModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
