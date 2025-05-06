
import React, { useState, useCallback } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import BriefModal from "@/components/dashboard/BriefModal";

const Dashboard = () => {
  const [uiState, setUiState] = useState({
    briefDrawerOpen: false,
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: true,
    briefModalOpen: false
  });

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

  return (
    <DashboardLayout 
      currentPage="home" 
      sidebarOpen={uiState.sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="p-6">
        <HomeView 
          onOpenBrief={handleOpenBrief}
          onToggleFocusMode={handleToggleFocusMode}
          onToggleCatchMeUp={handleToggleCatchMeUp}
          onOpenBriefModal={handleOpenBriefModal}
        />
      </div>
      
      <BriefDrawer 
        open={uiState.briefDrawerOpen} 
        briefId={uiState.selectedBrief}
        onClose={handleCloseBriefDrawer} 
      />
      
      <FocusMode
        open={uiState.focusModeOpen}
        onClose={handleCloseFocusMode}
      />

      <CatchMeUp 
        open={uiState.catchMeUpOpen}
        onClose={handleCloseCatchMeUp}
      />

      <BriefModal
        open={uiState.briefModalOpen}
        onClose={handleCloseBriefModal}
      />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
