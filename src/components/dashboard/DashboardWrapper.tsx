import React, { useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Zap, ChevronDown, Focus, Clock, Users, User, Settings, LogOut, CheckSquare, Calendar, Network, Mail, FileText, Home, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatusTimer from "./StatusTimer";
import NewBriefModal from "./NewBriefModal";
import TranscriptView from "./TranscriptView";
import EndFocusModal from "./EndFocusModal";
import BriefMeModal from "./BriefMeModal";
import FocusModeConfig from "./FocusModeConfig";

interface FocusConfig {
  duration: number;
  closeApps: {
    slack: boolean;
    gmail: boolean;
    calendar: boolean;
  };
  statusUpdates: {
    slack: string;
  };
}

const DashboardWrapper = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // State management
  const [userStatus, setUserStatus] = useState<"active" | "away" | "focus" | "vacation">("active");
  const [currentStatus, setCurrentStatus] = useState<'active' | 'focus' | 'offline'>('active');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);
  const [selectedBriefId, setSelectedBriefId] = useState<number | null>(null);
  const [showEndFocusModal, setShowEndFocusModal] = useState(false);
  const [showBriefMeModal, setShowBriefMeModal] = useState(false);
  const [showFocusConfig, setShowFocusConfig] = useState(false);
  const [focusConfig, setFocusConfig] = useState<FocusConfig | null>(null);
  const [waitlistStatus, setWaitlistStatus] = useState<'initial' | 'added'>('initial');

  // Sample connected integrations
  const connectedIntegrations = [
    { name: "Slack", channels: 12 },
    { name: "Gmail", emails: 5 },
    { name: "Google Calendar", events: 3 }
  ];

  // Sample upcoming brief data
  const upcomingBrief = {
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  };

  // Handlers
  const openBriefDetails = useCallback((briefId: number) => {
    navigate(`/dashboard/briefs/${briefId}`);
  }, [navigate]);

  const openTranscript = useCallback((briefId: number) => {
    setSelectedBriefId(briefId);
    setIsTranscriptOpen(true);
  }, []);
  
  const closeTranscript = useCallback(() => {
    setIsTranscriptOpen(false);
    setSelectedBriefId(null);
  }, []);

  const handleToggleFocusMode = useCallback(() => {
    if (userStatus === "focus") {
      setUserStatus("active");
      toast({
        title: "Focus Mode",
        description: "Exiting focus mode"
      });
    } else {
      setShowFocusConfig(true);
    }
  }, [toast, userStatus]);

  const handleExitFocusMode = useCallback(() => {
    setShowEndFocusModal(true);
  }, []);

  const handleConfirmExitFocus = useCallback(() => {
    setUserStatus("active");
    setCurrentStatus("active");
    setShowEndFocusModal(false);
    setFocusConfig(null);
    toast({
      title: "Focus Mode",
      description: "Exiting focus mode"
    });
  }, [toast]);

  const handleToggleCatchMeUp = useCallback(() => {
    setShowBriefMeModal(true);
  }, []);
  
  const openBriefModal = useCallback(() => {
    setIsBriefModalOpen(true);
  }, []);
  
  const closeBriefModal = useCallback(() => {
    setIsBriefModalOpen(false);
  }, []);
  
  const handleStartFocusModeWithConfig = useCallback((config: FocusConfig) => {
    setFocusConfig(config);
    setUserStatus("focus");
    setCurrentStatus("focus");
    
    const actionsText = [];
    if (config.closeApps.slack) actionsText.push("Slack closed");
    if (config.closeApps.gmail) actionsText.push("Gmail closed");
    if (config.closeApps.calendar) actionsText.push("Calendar closed");
    
    toast({
      title: "Focus Mode Started",
      description: `${config.duration} minute focus session started. ${actionsText.length > 0 ? actionsText.join(', ') + '. ' : ''}Slack status updated.`
    });
    setShowFocusConfig(false);
  }, [toast]);
  
  const handleStartFocusMode = useCallback(() => {
    setShowFocusConfig(true);
  }, []);
  
  const handleSignOffForDay = useCallback(() => {
    setUserStatus("away");
    setCurrentStatus("offline");
    toast({
      title: "Signing Off",
      description: "You've signed off for today"
    });
  }, [toast]);

  const handleSignBackOn = useCallback(() => {
    setUserStatus("active");
    setCurrentStatus("active");
    toast({
      title: "Welcome Back",
      description: "You're now back online and monitoring"
    });
  }, [toast]);

  const handleGenerateBrief = useCallback(() => {
    console.log("Generating new brief...");
  }, []);

  // Status management handlers
  const handleStatusChange = useCallback((status: 'focus' | 'offline') => {
    setCurrentStatus(status);
    if (status === 'focus') {
      handleStartFocusMode();
    } else if (status === 'offline') {
      handleSignOffForDay();
    }
  }, [handleStartFocusMode, handleSignOffForDay]);

  const handleExitStatus = useCallback(() => {
    setCurrentStatus('active');
    setUserStatus('active');
    toast({
      title: "Status Reset",
      description: "You're back to active monitoring"
    });
  }, [toast]);

  // Profile dropdown handlers
  const handleProfileClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "profile" }
    });
  }, [navigate]);

  const handleIntegrationsClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "integrations" }
    });
  }, [navigate]);

  const handleBriefConfigClick = useCallback(() => {
    navigate("/dashboard/settings", {
      state: { activeSection: "brief-config" }
    });
  }, [navigate]);

  const handleAllSettingsClick = useCallback(() => {
    navigate("/dashboard/settings");
  }, [navigate]);

  const handleTeamInterest = useCallback(() => {
    setWaitlistStatus('added');
  }, []);

  // Mobile navigation component
  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Focus Mode Timer Header */}
        {userStatus === "focus" && (
          <StatusTimer 
            status={userStatus}
            onExitFocusMode={handleExitFocusMode}
          />
        )}

        {/* Away/Offline Timer Header */}
        {userStatus === "away" && (
          <StatusTimer 
            status={userStatus}
            onSignBackOn={handleSignBackOn}
          />
        )}

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>

        {/* Modals */}
        <NewBriefModal open={isBriefModalOpen} onClose={closeBriefModal} />
        <TranscriptView briefId={selectedBriefId} open={isTranscriptOpen} onClose={closeTranscript} />
        <EndFocusModal 
          open={showEndFocusModal} 
          onClose={handleConfirmExitFocus}
          title="Creating Your Brief"
          description="We're preparing a summary of all updates during your focus session"
        />
        <BriefMeModal
          open={showBriefMeModal}
          onClose={() => setShowBriefMeModal(false)}
          onGenerateBrief={handleGenerateBrief}
        />
        <FocusModeConfig
          isOpen={showFocusConfig}
          onClose={() => setShowFocusConfig(false)}
          onStartFocus={handleStartFocusModeWithConfig}
        />
      </div>
    );
  }

  // Desktop layout with sidebar
  return (
    <div className="min-h-screen flex flex-col">
      {/* Focus Mode Timer Header */}
      {userStatus === "focus" && (
        <StatusTimer 
          status={userStatus}
          onExitFocusMode={handleExitFocusMode}
        />
      )}

      {/* Away/Offline Timer Header */}
      {userStatus === "away" && (
        <StatusTimer 
          status={userStatus}
          onSignBackOn={handleSignBackOn}
        />
      )}

      <div className="flex flex-1">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-surface-raised/20 flex flex-col">
          <div className="p-4 pt-12 space-y-4 flex-1">
            {/* Profile Section */}
            <div className="flex items-center gap-3 p-3 rounded-lg">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary-teal text-white text-sm">AK</AvatarFallback>
                </Avatar>
                
                {/* Status indicator */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-primary ${
                  currentStatus === 'active' ? 'bg-green-500' : 
                  currentStatus === 'focus' ? 'bg-primary-teal' : 'bg-orange-500'
                }`}></div>
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-white-text text-sm font-medium">Alex</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-normal text-text-secondary hover:text-text-primary justify-start">
                      {currentStatus === 'active' ? 'Active' : 
                       currentStatus === 'focus' ? 'Focus Mode' : 'Away'}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('focus')}
                      className="flex items-center gap-2"
                    >
                      <Focus className="w-4 h-4 text-primary-teal" />
                      <div>
                        <p className="font-medium">Focus Mode</p>
                        <p className="text-xs text-text-secondary">Only urgent notifications</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleStatusChange('offline')}
                      className="flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4 text-orange-500" />
                      <div>
                        <p className="font-medium">Away</p>
                        <p className="text-xs text-text-secondary">Monitor but don't notify</p>
                      </div>
                    </DropdownMenuItem>
                    {currentStatus !== 'active' && (
                      <DropdownMenuItem 
                        onClick={handleExitStatus}
                        className="flex items-center gap-2"
                      >
                        <div className="w-4 h-4 rounded-full bg-green-500" />
                        <div>
                          <p className="font-medium">Active</p>
                          <p className="text-xs text-text-secondary">Full monitoring</p>
                        </div>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleIntegrationsClick}>
                    <Network className="mr-2 h-4 w-4" />
                    Connected Accounts
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBriefConfigClick}>
                    <Clock className="mr-2 h-4 w-4" />
                    Brief Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAllSettingsClick}>
                    <Settings className="mr-2 h-4 w-4" />
                    All Settings
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Integration Status Indicators - Full Width */}
            <div className="flex gap-2">
              {connectedIntegrations.map((integration, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200 flex-1 justify-center rounded-full">
                  {integration.name === "Slack" && <Network className="w-3 h-3 text-green-400" />}
                  {integration.name === "Gmail" && <Mail className="w-3 h-3 text-blue-400" />}
                  {integration.name === "Google Calendar" && <Calendar className="w-3 h-3 text-orange-400" />}
                  <span className="text-xs font-medium text-white">
                    {integration.channels || integration.emails || integration.events}
                  </span>
                </div>
              ))}
            </div>

            {/* Sidebar Content - Scrollable */}
            <ScrollArea className="flex-1">
              {/* Upcoming Brief Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-accent-primary" />
                  <h2 className="text-base font-medium text-text-primary text-left">Upcoming brief</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-text-primary text-left">Midday Brief</h3>
                    <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
                  </div>
                  <Button 
                    onClick={openBriefModal}
                    className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white border-0 justify-start"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Brief Me
                  </Button>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="space-y-1 mb-6">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-text-primary hover:bg-surface-raised/50"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home className="h-4 w-4 mr-3" />
                  Briefs
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-raised/50"
                  onClick={() => navigate('/dashboard/tasks')}
                >
                  <CheckSquare className="h-4 w-4 mr-3" />
                  Follow-ups
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-text-secondary hover:text-text-primary hover:bg-surface-raised/50"
                  onClick={() => navigate('/dashboard/meetings')}
                >
                  <Calendar className="h-4 w-4 mr-3" />
                  Meetings
                </Button>
              </div>

              {/* Brief Me Teams Section */}
              <div className="border-t border-border-subtle pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-accent-primary" />
                  <h2 className="text-base font-medium text-text-primary text-left">Brief Me Teams</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary text-left">Coming soon...</p>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>AI meeting proxy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Team analytics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Shared briefs</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleTeamInterest}
                    className={`text-xs w-full text-left p-0 h-auto font-normal ${waitlistStatus === 'added' ? 'text-green-400' : 'text-text-primary hover:text-text-secondary'} transition-colors`} 
                    disabled={waitlistStatus === 'added'}
                  >
                    {waitlistStatus === 'added' ? 'Added to waitlist' : 'Join waitlist'}
                  </button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>

      {/* Modals */}
      <NewBriefModal open={isBriefModalOpen} onClose={closeBriefModal} />
      <TranscriptView briefId={selectedBriefId} open={isTranscriptOpen} onClose={closeTranscript} />
      <EndFocusModal 
        open={showEndFocusModal} 
        onClose={handleConfirmExitFocus}
        title="Creating Your Brief"
        description="We're preparing a summary of all updates during your focus session"
      />
      <BriefMeModal
        open={showBriefMeModal}
        onClose={() => setShowBriefMeModal(false)}
        onGenerateBrief={handleGenerateBrief}
      />
      <FocusModeConfig
        isOpen={showFocusConfig}
        onClose={() => setShowFocusConfig(false)}
        onStartFocus={handleStartFocusModeWithConfig}
      />
    </div>
  );
};

export default DashboardWrapper;