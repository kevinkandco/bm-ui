
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
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
    sidebarOpen: true,
    briefModalOpen: false,
    userStatus: "active" as UserStatus // Explicitly type as UserStatus
  });

  // Optimized callbacks to prevent re-creation on each render
  const handleOpenBrief = useCallback((briefId: number) => {
    setUiState(prev => ({
      ...prev,
      selectedBrief: briefId,
      briefDrawerOpen: true
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
            <Card className="p-6 border-border-subtle shadow-subtle rounded-3xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-text-primary font-medium">Priority People</h2>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleUpdatePriorityPeople} 
                  className="h-8 w-8 rounded-full"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <PriorityPeopleWidget />
            </Card>
            
            {/* Next Brief */}
            <Card className="rounded-3xl p-6">
              <NextBriefSection onUpdateSchedule={handleUpdateSchedule} />
            </Card>
            
            {/* Upcoming Meetings */}
            <Card className="rounded-3xl p-6">
              <UpcomingMeetingsSection />
            </Card>
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
