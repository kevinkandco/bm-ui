
import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import BriefModal from "@/components/dashboard/BriefModal";

const Dashboard = () => {
  // Initialize state once, avoid unnecessary re-renders
  const [uiState, setUiState] = useState({
    briefDrawerOpen: false,
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: true,
    briefModalOpen: false
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

  // Memoize HomeView props
  const homeViewProps = useMemo(() => ({
    onOpenBrief: handleOpenBrief,
    onToggleFocusMode: handleToggleFocusMode,
    onToggleCatchMeUp: handleToggleCatchMeUp,
    onOpenBriefModal: handleOpenBriefModal
  }), [handleOpenBrief, handleToggleFocusMode, handleToggleCatchMeUp, handleOpenBriefModal]);

  return (
    <DashboardLayout 
      currentPage="home" 
      sidebarOpen={uiState.sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="p-4 md:p-6">
        <HomeView {...homeViewProps} />
      </div>
      
      <BriefDrawer {...briefDrawerProps} />
      <FocusMode {...focusModeProps} />
      <CatchMeUp {...catchMeUpProps} />
      <BriefModal {...briefModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
