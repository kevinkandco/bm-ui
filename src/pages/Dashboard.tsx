
import React, { useState, useCallback, useMemo } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import BriefModal from "@/components/dashboard/BriefModal";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";
import EndFocusModal from "@/components/dashboard/EndFocusModal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, Headphones, Archive, Clock } from "lucide-react";

type UserStatus = "active" | "away" | "focus" | "vacation";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [uiState, setUiState] = useState({
    selectedBrief: null,
    focusModeOpen: false,
    catchMeUpOpen: false,
    sidebarOpen: !isMobile,
    briefModalOpen: false,
    endFocusModalOpen: false,
    catchUpModalOpen: false,
    userStatus: "active" as UserStatus
  });

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

  const handleStartFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      focusModeOpen: false,
      userStatus: "focus" as UserStatus
    }));
  }, []);

  const handleExitFocusMode = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      endFocusModalOpen: true
    }));
  }, []);

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
    
    navigate("/dashboard/catch-up");
  }, [toast, navigate]);

  const handleCloseBriefModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      briefModalOpen: false
    }));
  }, []);

  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

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

  // Sample brief data
  const latestBrief = {
    id: 1,
    title: "Morning Brief",
    timestamp: "Today, 8:00 AM",
    emailCount: 5,
    messageCount: 12
  };

  return (
    <DashboardLayout {...layoutProps}>
      <div className="min-h-screen bg-surface px-4 py-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            Good morning, Alex
          </h1>
          <p className="text-text-secondary">Ready to catch up or focus?</p>
        </div>

        {/* Main CTAs */}
        <div className="mb-8 space-y-4">
          <Button 
            onClick={handleToggleCatchMeUp}
            className="w-full h-16 bg-accent-primary text-white rounded-2xl text-lg font-medium shadow-lg hover:shadow-xl transition-all"
          >
            <Zap className="mr-3 h-6 w-6" />
            Catch Me Up
          </Button>
          
          <Button 
            onClick={handleToggleFocusMode}
            variant="outline"
            className="w-full h-16 rounded-2xl text-lg font-medium border-2 border-border-subtle text-text-primary hover:bg-surface-raised/30 shadow-lg hover:shadow-xl transition-all"
          >
            <Headphones className="mr-3 h-6 w-6" />
            Focus Mode
          </Button>
        </div>

        {/* Latest Brief Card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-text-primary">Latest Brief</h2>
            <span className="text-sm text-text-secondary">{latestBrief.timestamp}</span>
          </div>
          
          <p className="text-text-secondary mb-4">{latestBrief.emailCount} emails, {latestBrief.messageCount} messages</p>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => handleOpenBrief(latestBrief.id)}
              className="flex-1 bg-accent-primary text-white rounded-xl"
            >
              Read Brief
            </Button>
            <Button 
              onClick={handleViewAllBriefs}
              variant="outline" 
              className="flex-1 rounded-xl border-border-subtle text-text-primary"
            >
              <Archive className="mr-2 h-4 w-4" />
              View All Briefs
            </Button>
          </div>
        </div>

        {/* Next Brief Card */}
        <div className="glass-card rounded-2xl p-6 mb-6">
          <div className="flex items-center mb-3">
            <Clock className="mr-2 h-5 w-5 text-accent-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Next Brief</h2>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium text-text-primary">Midday Brief</p>
              <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
            </div>
          </div>
          
          <Button 
            variant="outline"
            className="w-full rounded-xl border-border-subtle text-text-primary"
          >
            Update Schedule
          </Button>
        </div>

        {/* Upcoming Meetings - Blurred Coming Soon */}
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="filter blur-sm">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-text-primary">Weekly Standup</p>
                  <p className="text-sm text-text-secondary">10:00 AM - 4 attendees</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2">
                <div className="w-2 h-2 bg-accent-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-text-primary">Product Review</p>
                  <p className="text-sm text-text-secondary">1:30 PM - 6 attendees</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coming Soon Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-surface/80 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-text-primary font-semibold mb-1">Coming Soon</p>
              <p className="text-text-secondary text-sm">Meeting integration</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modals */}
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
      <EndFocusModal {...endFocusModalProps} />
      <EndFocusModal {...catchUpModalProps} />
    </DashboardLayout>
  );
};

export default React.memo(Dashboard);
