
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HomeView from "@/components/dashboard/HomeView";
import BriefDrawer from "@/components/dashboard/BriefDrawer";
import FocusMode from "@/components/dashboard/FocusMode";

const Dashboard = () => {
  const [briefDrawerOpen, setBriefDrawerOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<number | null>(null);
  const [focusModeOpen, setFocusModeOpen] = useState(false);

  const handleOpenBrief = (briefId: number) => {
    setSelectedBrief(briefId);
    setBriefDrawerOpen(true);
  };

  const handleToggleFocusMode = () => {
    setFocusModeOpen(!focusModeOpen);
  };

  return (
    <DashboardLayout currentPage="home">
      <div className="p-6">
        <div className="rounded-3xl overflow-hidden backdrop-blur-md bg-white/50 border border-white/30 shadow-sm p-6">
          <HomeView 
            onOpenBrief={handleOpenBrief}
            onToggleFocusMode={handleToggleFocusMode}
          />
        </div>
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
    </DashboardLayout>
  );
};

export default Dashboard;
