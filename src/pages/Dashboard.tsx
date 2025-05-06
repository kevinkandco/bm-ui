
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";
import CatchMeUp from "@/components/dashboard/CatchMeUp";

const Dashboard = () => {
  const [briefDrawerOpen, setBriefDrawerOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<number | null>(null);
  const [focusModeOpen, setFocusModeOpen] = useState(false);
  const [catchMeUpOpen, setCatchMeUpOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleOpenBrief = (briefId: number) => {
    setSelectedBrief(briefId);
    setBriefDrawerOpen(true);
  };

  const handleToggleFocusMode = () => {
    setFocusModeOpen(!focusModeOpen);
  };

  const handleToggleCatchMeUp = () => {
    setCatchMeUpOpen(!catchMeUpOpen);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <DashboardLayout 
      currentPage="home" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="p-6">
        <HomeView 
          onOpenBrief={handleOpenBrief}
          onToggleFocusMode={handleToggleFocusMode}
          onToggleCatchMeUp={handleToggleCatchMeUp}
        />
      </div>
      
      <BriefDrawer 
        open={briefDrawerOpen} 
        briefId={selectedBrief}
        onClose={() => setBriefDrawerOpen(false)} 
      />
      
      <FocusMode
        open={focusModeOpen}
        onClose={() => setFocusModeOpen(false)}
      />

      <CatchMeUp 
        open={catchMeUpOpen}
        onClose={() => setCatchMeUpOpen(false)}
      />
    </DashboardLayout>
  );
};

export default Dashboard;
