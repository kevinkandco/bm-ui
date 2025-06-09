
import React, { useState } from "react";
import MenuBarIcon from "@/components/dashboard/MenuBarIcon";
import MenuBarCompanion from "@/components/dashboard/MenuBarCompanion";
import { useToast } from "@/hooks/use-toast";

type StatusType = "active" | "offline" | "dnd";

const MacPage = () => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("active");

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  const handleStatusChange = (newStatus: StatusType) => {
    setStatus(newStatus);
    toast({
      title: "Status Updated",
      description: `Status changed to ${newStatus === "dnd" ? "Do Not Disturb" : newStatus}`
    });
  };

  const handleGetBriefedNow = () => {
    toast({
      title: "Brief Generated",
      description: "Your morning brief is ready"
    });
    handleCloseMenu();
  };

  const handleUpdateSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "Your brief schedule has been updated"
    });
    handleCloseMenu();
  };

  const handleOpenDashboard = () => {
    toast({
      title: "Opening Dashboard",
      description: "Navigating to main dashboard"
    });
    handleCloseMenu();
  };

  return (
    <div 
      className="min-h-screen w-full relative"
      style={{
        backgroundImage: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* macOS Desktop Overlay */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Menu Bar Icon */}
      <MenuBarIcon 
        onToggleMenu={handleToggleMenu}
        onStatusChange={handleStatusChange}
        currentStatus={status}
        isMenuOpen={isMenuOpen}
      />
      
      {/* Menu Bar Companion */}
      <MenuBarCompanion
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onGetBriefedNow={handleGetBriefedNow}
        onUpdateSchedule={handleUpdateSchedule}
        onOpenDashboard={handleOpenDashboard}
      />
      
      {/* Desktop Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center text-white/80">
          <h1 className="text-6xl font-thin mb-4">macOS Desktop</h1>
          <p className="text-xl">Click the menu bar to access Brief Me or cycle through status by clicking the button</p>
        </div>
      </div>
    </div>
  );
};

export default MacPage;
