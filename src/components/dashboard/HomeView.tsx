import React, { useState, useCallback, useMemo } from "react";
import { Zap, Headphones, Archive, Menu, X, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import StatusTimer, { StatusTimerProps } from "@/components/dashboard/StatusTimer";

// Import optimized section components
import LatestBriefSection from "./HomeViewSections/LatestBriefSection";
import UrgentThreadsSection from "./HomeViewSections/UrgentThreadsSection";
import ConnectedChannelsSection from "./HomeViewSections/ConnectedChannelsSection";
import PriorityPeopleSection from "./HomeViewSections/PriorityPeopleSection";
import { NextBriefSection, UpcomingMeetingsSection } from "./HomeViewSections/SidebarSections";
import { PriorityPeople, Summary } from "./types";
import useAuthStore from "@/store/useAuthStore";
import ViewErrorMessage from "./ViewErrorMessage";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  statusTimerProps: StatusTimerProps;
  priorityPeople: PriorityPeople[];
  latestBrief: Summary[];
  status: "active" | "away" | "focus" | "vacation";
  onExitFocusMode: () => void;
  focusModeExitLoading: boolean;
  onToggleSignOff: () => void;
}

const HomeView = ({
  onOpenBrief,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  statusTimerProps,
  priorityPeople,
  latestBrief,
  status,
  onExitFocusMode,
  focusModeExitLoading,
  onToggleSignOff
}: HomeViewProps) => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");

  const showBriefDetails = useCallback(() => {
    onOpenBrief(1);
  }, [onOpenBrief]);

  
  const handleUpdateSchedule = useCallback(() => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings"
    });
  }, [toast]);
  
  const handleViewAllBriefs = useCallback(() => {
    navigate("/dashboard/briefs");
  }, [navigate]);

  const handleMessageClick = (message: string) => {
    setOpen(true);
    setMessage(message);
  };

  const handleClose = () => {
    setOpen(false);
  }

  const renderContent = () => {
    switch (status) {
      case "focus":
        return (
          <div className="flex gap-3 items-center">
            <Button
              onClick={onToggleCatchMeUp}
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
            </Button>
            <Button
              onClick={onExitFocusMode}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className={`rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all`}
              disabled={focusModeExitLoading}
            >
              {focusModeExitLoading ? (
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              ) : (
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              )}
              <span className="text-xs sm:text-sm">Exit</span>
            </Button>
          </div>
        );

      case "away":
        return (
          <div className="flex gap-3 items-center">
            <Button
              onClick={onToggleCatchMeUp}
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
            </Button>

            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
              disabled
            >
              <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Signed Off Today</span>
            </Button>
          </div>
        );

      case "vacation":
        return (
          <div className="flex gap-3 items-center">
            <Button
              onClick={onToggleCatchMeUp}
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
            </Button>
          </div>
        );

      default: // Active status - improved mobile layout
        return (
          <div className="flex gap-3 items-center">
            <Button
              onClick={onToggleCatchMeUp}
              className="bg-accent-primary text-white rounded-xl px-6 py-3 shadow-sm hover:shadow-md transition-all"
            >
              <Zap className="mr-2 h-4 w-4" />
              Catch Me Up
            </Button>

            <Button
              onClick={onToggleSignOff}
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
            >
              <Power className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Sign Off Today</span>
            </Button>

            <Button
              onClick={onToggleFocusMode}
              variant="outline"
              className="rounded-xl px-6 py-3 border-border-subtle text-text-primary shadow-sm hover:shadow-md transition-all"
            >
              <Headphones className="mr-2 h-4 w-4" />
              Focus Mode
            </Button>
          </div>
        );
    }
  };

  // Mobile View
  if (isMobile) {
    return (
      <div className="min-h-screen bg-surface px-4 py-6">
        {/* Mobile Welcome Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Good morning, {user?.name}
          </h1>
          <p className="text-text-secondary mb-8">What would you like to know?</p>
        </div>

        {/* Central "Brief Me" Button */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            {/* Dynamic multi-colored gradient background with rotation */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-purple-500 to-pink-500 rounded-full blur-2xl opacity-40 animate-spin" style={{ animationDuration: '8s' }}></div>
            <div className="absolute inset-0 bg-gradient-to-l from-cyan-400 via-blue-500 to-accent-secondary rounded-full blur-xl opacity-30 animate-pulse" style={{ animationDuration: '3s' }}></div>
            
            {/* Enhanced Neumorphic Brief Me Button */}
            <button
              onClick={onToggleCatchMeUp}
              className="relative w-36 h-36 rounded-full bg-surface text-text-primary font-bold text-xl tracking-wide
                         shadow-[12px_12px_24px_rgba(0,0,0,0.4),-12px_-12px_24px_rgba(255,255,255,0.1)]
                         hover:shadow-[8px_8px_16px_rgba(0,0,0,0.5),-8px_-8px_16px_rgba(255,255,255,0.15)]
                         active:shadow-[4px_4px_8px_rgba(0,0,0,0.6),-4px_-4px_8px_rgba(255,255,255,0.2)]
                         transition-all duration-300 transform hover:scale-105 active:scale-95
                         bg-gradient-to-br from-surface via-surface to-surface-raised
                         border border-white/5"
              style={{
                background: 'linear-gradient(145deg, var(--surface), var(--surface-raised))'
              }}
            >
              Brief Me
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="fixed bottom-6 right-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                size="icon" 
                className="w-14 h-14 rounded-full bg-accent-primary text-white shadow-lg"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] bg-surface/95 backdrop-blur-xl border-border-subtle">
              <div className="p-4 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Focus Mode Option */}
                <Button 
                  onClick={() => {
                    onToggleFocusMode();
                    setMobileMenuOpen(false);
                  }} 
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-border-subtle"
                >
                  <Headphones className="mr-3 h-5 w-5" />
                  Focus Mode
                </Button>

                {/* Latest Brief */}
                <div className="border border-border-subtle rounded-xl p-4">
                  <h3 className="font-semibold text-text-primary mb-2">Latest Brief</h3>
                  <span className="text-sm text-text-secondary mb-3">{latestBrief?.[0]?.title}</span>
                  <p className="text-sm text-text-secondary mb-3">{latestBrief?.[0]?.emailCount ? `${latestBrief?.[0]?.emailCount} emails` : "0 email"}, {latestBrief?.[0]?.slackMessageCount  ? `${latestBrief?.[0]?.slackMessageCount} messages` : "0 messages"}</p>
                  <Button 
                    onClick={() => onOpenBrief(latestBrief?.[0]?.id)} 
                    className="w-full bg-accent-primary text-white rounded-xl"
                  >
                    Read Brief
                  </Button>
                </div>

                {/* Other Sections */}
                <div className="space-y-4">
                  <div className="border border-border-subtle rounded-xl p-4">
                    <UrgentThreadsSection />
                  </div>
                  <div className="border border-border-subtle rounded-xl p-4">
                    <ConnectedChannelsSection />
                  </div>
                  <div className="border border-border-subtle rounded-xl p-4">
                    <PriorityPeopleSection priorityPeople={priorityPeople}/>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    );
  }

  // Desktop View
  return (
    <div className="min-h-screen bg-surface px-4 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Desktop Header - Horizontal Layout */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Good morning, {user.name}
            </h1>
            <p className="text-text-secondary">Ready to catch up or focus?</p>
          </div>
          
          <StatusTimer {...statusTimerProps} />
          
          {/* Smaller CTAs on the right */}
          {renderContent()}
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main content - 8 columns */}
          <div className="col-span-8 space-y-6">
            {/* Latest Brief Card */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-semibold text-text-primary">Latest Brief</h2>
                <span className="text-sm text-text-secondary">{latestBrief?.[0]?.summaryTime}</span>
              </div>
              <span className="text-sm text-text-secondary mb-4">{latestBrief?.[0]?.title}</span>
              <p className="text-text-secondary mb-4">{latestBrief?.[0]?.emailCount ? `${latestBrief?.[0]?.emailCount} emails` : "0 email"}, {latestBrief?.[0]?.slackMessageCount  ? `${latestBrief?.[0]?.slackMessageCount} messages` : "0 message"}</p>
              
              <div className="flex gap-3">
                <Button 
                  onClick={() => onOpenBrief(latestBrief?.[0].id)} 
                  className="bg-accent-primary text-white rounded-xl shadow-sm"
                >
                  Read Brief
                </Button>
                <Button 
                  onClick={handleViewAllBriefs} 
                  variant="outline" 
                  className="rounded-xl border-border-subtle text-text-primary shadow-sm"
                >
                  <Archive className="mr-2 h-4 w-4" />
                  View All Briefs
                </Button>
              </div>
            </div>

            {/* Combined sections card */}
            {latestBrief?.slice(0,3).map((brief, index) => (
              <div className="border border-border-subtle rounded-2xl overflow-hidden bg-surface-overlay/30 shadow-sm">
                <LatestBriefSection onClick={onOpenBrief} key={brief?.id} brief={brief} handleMessageClick={handleMessageClick} />
                <Separator className="bg-border-subtle" />
                <UrgentThreadsSection />
              </div>
            ))}
          </div>
          
          {/* Sidebar - 4 columns */}
          <div className="col-span-4 space-y-4">
            {/* Priority People Section - Compact */}
            <div className="border border-border-subtle rounded-2xl p-4 bg-surface-overlay/30 shadow-sm">
              <PriorityPeopleSection priorityPeople={priorityPeople} />
            </div>

            {/* Connected Channels Section - Compact */}
            <div className="border border-border-subtle rounded-2xl p-4 bg-surface-overlay/30 shadow-sm">
              <ConnectedChannelsSection />
            </div>

            {/* Next Brief Section */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-text-primary">Next Scheduled Brief</h2>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-medium text-text-primary">Midday Brief</p>
                  <p className="text-sm text-text-secondary">Today at 12:30 PM</p>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full rounded-xl border-border-subtle text-text-primary shadow-sm" 
                onClick={handleUpdateSchedule}
              >
                Update Schedule
              </Button>
            </div>
            
            {/* Upcoming Meetings - Blurred Coming Soon */}
            <div className="border border-border-subtle rounded-2xl p-6 bg-surface-overlay/30 shadow-sm relative overflow-hidden">
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
        </div>
      </div>
      <ViewErrorMessage open={open} onClose={handleClose} message={message} />
    </div>
  );
};

export default React.memo(HomeView);
