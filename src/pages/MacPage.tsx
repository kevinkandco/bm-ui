
import React, { useState } from "react";
import MenuBarIcon from "@/components/dashboard/MenuBarIcon";
import MenuBarCompanion from "@/components/dashboard/MenuBarCompanion";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, X, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type StatusType = "active" | "offline" | "dnd";

const MacPage = () => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [status, setStatus] = useState<StatusType>("active");
  const [showInterruptNotification, setShowInterruptNotification] = useState(false);
  const [currentNotificationIndex, setCurrentNotificationIndex] = useState(0);

  // Example dynamic integrations data
  const integrations = [
    { name: "Slack", count: 12, isConnected: true },
    { name: "Notion", count: 8, isConnected: true },
    { name: "Teams", count: 5, isConnected: false },
    { name: "Mail", count: 3, isConnected: false }
  ];

  // Example notifications
  const exampleNotifications = [
    {
      sender: "Sarah Chen",
      platform: "Slack • #incidents",
      message: "URGENT: Payment service is down affecting checkout. Need immediate attention.",
      urgentKeyword: "URGENT",
      reason: "Sarah is in your priority contacts and message contains \"URGENT\" keyword"
    },
    {
      sender: "Mike Rodriguez",
      platform: "Teams • Engineering",
      message: "CRITICAL: Database connection failing, users can't login. Need help ASAP!",
      urgentKeyword: "CRITICAL",
      reason: "Mike is in your priority contacts and message contains \"CRITICAL\" keyword"
    },
    {
      sender: "Jessica Wu",
      platform: "Slack • #alerts",
      message: "Server monitoring shows 99% CPU usage. Site may go down soon.",
      urgentKeyword: null,
      reason: "Jessica is in your priority contacts and #alerts is a priority channel"
    }
  ];

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

  const handleDismissNotification = () => {
    setShowInterruptNotification(false);
  };

  const handleToggleExampleNotification = () => {
    setShowInterruptNotification(!showInterruptNotification);
  };

  const handleRefreshNotification = () => {
    setCurrentNotificationIndex((prevIndex) => 
      (prevIndex + 1) % exampleNotifications.length
    );
  };

  const currentNotification = exampleNotifications[currentNotificationIndex];

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
      
      {/* Control Buttons - Top Left */}
      <div className="fixed top-4 left-4 z-50 flex space-x-3">
        <Button
          onClick={handleToggleExampleNotification}
          className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
          variant="ghost"
        >
          <Zap className="h-4 w-4 mr-2" />
          {showInterruptNotification ? "Hide example notification" : "Show example notification"}
        </Button>
        
        {showInterruptNotification && (
          <Button
            onClick={handleRefreshNotification}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
            variant="ghost"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh notification
          </Button>
        )}
      </div>
      
      {/* Menu Bar Icon - Only shown on Mac page */}
      <MenuBarIcon 
        onToggleMenu={handleToggleMenu}
        onStatusChange={handleStatusChange}
        currentStatus={status}
        isMenuOpen={isMenuOpen}
        integrations={integrations}
      />
      
      {/* Menu Bar Companion */}
      <MenuBarCompanion
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        onGetBriefedNow={handleGetBriefedNow}
        onUpdateSchedule={handleUpdateSchedule}
        onOpenDashboard={handleOpenDashboard}
      />

      {/* Interrupt Notification Example - positioned to expand from Brief Me button */}
      {showInterruptNotification && (
        <div className="fixed top-20 right-4 z-40 max-w-md w-full">
          <div className="glass-panel p-4 animate-in slide-in-from-top-4 fade-in-0 duration-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">Brief Me Interrupt</span>
              </div>
              <Button
                onClick={handleDismissNotification}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-semibold text-text-primary">{currentNotification.sender}</p>
                  <span className="text-xs text-text-secondary">{currentNotification.platform}</span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed mb-3">
                  "{currentNotification.urgentKeyword && (
                    <span className="font-medium text-red-400">{currentNotification.urgentKeyword}</span>
                  )}{currentNotification.urgentKeyword && ': '}{currentNotification.message.replace(currentNotification.urgentKeyword + ': ', '')}"
                </p>
                <div className="flex space-x-2">
                  <Button size="sm" variant="primary" className="h-7 text-xs px-3">
                    Reply
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 text-xs px-3">
                    View Thread
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border-subtle">
              <p className="text-xs text-text-secondary">
                <span className="font-medium">Why you saw this:</span> {currentNotification.reason}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop Content Area */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center text-white/80">
          <h1 className="text-6xl font-thin mb-4">macOS Desktop</h1>
          <p className="text-xl mb-8">Click the menu bar to access Brief Me or cycle through status by clicking the button</p>
          
          {/* Interrupt Notification Info */}
          <div className="max-w-2xl mx-auto mt-12 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <h2 className="text-2xl font-light mb-4">Smart Interrupt System</h2>
            <p className="text-white/70 leading-relaxed">
              Brief Me monitors all your communications silently in the background. Only the most critical messages—from priority contacts or containing emergency keywords—break through as interrupt notifications. Everything else waits for your next brief, keeping you focused while ensuring you never miss what truly matters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacPage;
