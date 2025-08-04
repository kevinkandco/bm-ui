import React, { useState, useCallback } from "react";
import { Zap, Focus, Clock, X, Play, Pause, ChevronDown, Calendar, User, Settings, PanelLeftClose, PanelRightClose, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Import components
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import CalendarSection from "./HomeViewSections/CalendarSection";
import ActionItemsPanel from "./ActionItemsPanel";
import LatestBriefSection from "./HomeViewSections/LatestBriefSection";
import AudioPlayer from "./AudioPlayer";
import BriefsList from "./BriefsList";
interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onStartFocusMode: () => void;
  onSignOffForDay: () => void;
  userStatus?: "active" | "away" | "focus" | "vacation";
  focusConfig?: any;
}
const HomeView = ({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay,
  userStatus = "active"
}: HomeViewProps) => {
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State for new layout
  const [selectedBrief, setSelectedBrief] = useState<number | null>(1); // Default to latest brief
  const [selectedCalendarItem, setSelectedCalendarItem] = useState<string | null>(null);
  const [leftRailTab, setLeftRailTab] = useState<'briefs' | 'calendar'>('briefs');
  const [followUpsFilter, setFollowUpsFilter] = useState<'all' | 'current'>('all');
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  // Sample data
  const recentBriefs = [{
    id: 1,
    name: "Morning Brief",
    timeCreated: "Today, 8:00 AM",
    timeRange: "5:00 AM - 8:00 AM",
    slackMessages: {
      total: 12,
      fromPriorityPeople: 3
    },
    emails: {
      total: 5,
      fromPriorityPeople: 2
    },
    actionItems: 4,
    hasTranscript: true
  }, {
    id: 2,
    name: "Evening Brief",
    timeCreated: "Yesterday, 8:00 PM",
    timeRange: "5:00 PM - 8:00 PM",
    slackMessages: {
      total: 8,
      fromPriorityPeople: 1
    },
    emails: {
      total: 3,
      fromPriorityPeople: 0
    },
    actionItems: 2,
    hasTranscript: true
  }];
  const upcomingBrief = {
    name: "Midday Brief",
    scheduledTime: "Today at 12:30 PM"
  };

  // Handlers
  const handlePlayBrief = useCallback((briefId: number) => {
    console.log('handlePlayBrief called with briefId:', briefId);
    console.log('current playingBrief:', playingBrief);
    if (playingBrief === briefId) {
      setPlayingBrief(null);
      console.log('Pausing brief');
      toast({
        title: "Brief Paused",
        description: "Audio playback paused"
      });
    } else {
      setPlayingBrief(briefId);
      console.log('Playing brief, new playingBrief should be:', briefId);
      toast({
        title: "Playing Brief",
        description: "Audio playback started"
      });
    }
  }, [playingBrief, toast]);
  const handleBriefSelect = useCallback((briefId: number) => {
    setSelectedBrief(briefId);
    setSelectedCalendarItem(null);
    setFollowUpsFilter('current');
  }, []);
  const handleCalendarSelect = useCallback((itemId: string) => {
    setSelectedCalendarItem(itemId);
    setSelectedBrief(null);
    setFollowUpsFilter('all');
  }, []);
  const getStatusChip = () => {
    const configs = {
      active: {
        label: "Active",
        color: "bg-green-500",
        textColor: "text-green-100"
      },
      focus: {
        label: "Focus",
        color: "bg-primary-teal",
        textColor: "text-white"
      },
      away: {
        label: "Away",
        color: "bg-orange-500",
        textColor: "text-orange-100"
      },
      vacation: {
        label: "Vacation",
        color: "bg-purple-500",
        textColor: "text-purple-100"
      }
    };
    const config = configs[userStatus];
    return <Badge className={cn("px-2 py-1 text-xs font-medium", config.color, config.textColor)} onClick={onToggleFocusMode}>
        {config.label}
      </Badge>;
  };

  // Mobile fallback - return current mobile layout for now
  if (isMobile) {
    return <div className="p-4">
        <h1 className="text-xl font-bold text-text-primary mb-4">Good morning, Alex</h1>
        <p className="text-text-secondary">Mobile layout coming soon...</p>
      </div>;
  }

  // New three-column desktop layout
  return <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="border-b border-border-subtle bg-surface/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Brief Me Logo */}
            <div>
              <img src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" alt="Brief Me" className="h-8 w-auto" />
            </div>

            {/* Center: Empty (reserved space) */}
            <div className="flex-1" />

            {/* Right: Status chip, Get Brief button, Avatar */}
            <div className="flex items-center gap-3">
              {/* Status Chip */}
              {getStatusChip()}

              {/* Get Brief Button */}
              <Button onClick={onToggleCatchMeUp} className="bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                Get Brief
              </Button>

              {/* Avatar with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto">
                    <Avatar className="h-9 w-9 border-2 border-border-subtle hover:border-accent-primary transition-colors cursor-pointer">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt="Alex Johnson" />
                      <AvatarFallback className="bg-accent-primary/20 text-accent-primary font-medium">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-surface border-border-subtle w-56" align="end">
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-text-primary hover:bg-white/5">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/dashboard/settings")} className="text-text-primary hover:bg-white/5">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Resizable Three-Column Layout */}
      <div className="flex-1 pb-20">
        <ResizablePanelGroup direction="horizontal" className="min-h-0">
          {/* Left Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35} collapsible={true} collapsedSize={4} onCollapse={() => setLeftPanelCollapsed(true)} onExpand={() => setLeftPanelCollapsed(false)}>
            <div className={cn("h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col", leftPanelCollapsed && "items-center")}>
              {!leftPanelCollapsed ? <div className="h-full flex flex-col">
                  {/* Latest Brief Section */}
                  <div className="p-4">
                    <LatestBriefSection onClick={() => handleBriefSelect(1)} isSelected={selectedBrief === 1} />
                  </div>
                  
                  {/* Briefs List */}
                  <div className="flex-1 min-h-0">
                    <BriefsList onPlayBrief={handlePlayBrief} onSettingsClick={() => navigate("/dashboard/settings")} playingBrief={playingBrief} selectedBrief={selectedBrief} onBriefSelect={handleBriefSelect} />
                  </div>
                </div> : (/* Collapsed State */
            <div className="p-2 flex flex-col items-center">
                  <Button variant="ghost" size="sm" onClick={() => setLeftPanelCollapsed(false)} className="h-8 w-8 p-0 mb-4">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>)}
            </div>
          </ResizablePanel>

          

          {/* Main Content Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-screen overflow-hidden">
              {/* Main Content Card */}
              <div className="h-full bg-background/80 backdrop-blur-sm shadow-xl rounded-xl border border-border-subtle overflow-hidden">
                <div className="p-6 h-full overflow-auto bg-[#1f262c]/[0.47]">
                  {selectedBrief && <div className="space-y-6">
                      {/* Header */}
                      <div>
                        <div className="text-sm text-text-secondary mb-1">Scheduled | 8/4/2025 at 7:00 AM</div>
                        <h2 className="text-2xl font-bold text-text-primary mb-1">Morning Brief</h2>
                        <p className="text-sm text-text-secondary">Summarizing 5PM on 8/3/25 to 7AM 8/4/25</p>
                      </div>

                      {/* Summary Section with Play Button and Stats */}
                      <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={() => handlePlayBrief(selectedBrief)} className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center hover:bg-accent-primary/30 transition-colors">
                              {playingBrief === selectedBrief ? <Pause className="h-6 w-6 text-accent-primary" /> : <Play className="h-6 w-6 text-accent-primary" />}
                            </button>
                            <div>
                              <div className="text-sm text-text-secondary">3 mins summarizing: 3 Slack | 28 Emails | 4 Actions</div>
                            </div>
                          </div>
                          
                          <div className="flex gap-8">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-text-primary">14</div>
                              <div className="text-xs text-text-secondary">Interrupts Prevented</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-text-primary">2h 17m</div>
                              <div className="text-xs text-text-secondary">Focus Gained</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-text-primary">~66</div>
                              <div className="text-xs text-text-secondary">Time Saved</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Follow ups Section */}
                      <div>
                        <h3 className="text-lg font-medium text-text-primary mb-4">Follow ups (8)</h3>
                        <div className="space-y-3">
                          {[...Array(8)].map((_, index) => <div key={index} className="flex items-center gap-4 p-3 bg-surface-raised/30 rounded-lg border border-border-subtle">
                              <div className="w-16 text-center">
                                <span className="text-sm font-medium text-text-primary">High</span>
                              </div>
                              <div className="w-20 text-center">
                                <span className="text-sm text-text-secondary">Decision</span>
                              </div>
                              <div className="flex-1">
                                <span className="text-sm text-text-primary">Review weekly performance report</span>
                              </div>
                              <div className="w-32 text-center">
                                <span className="text-sm text-text-secondary">kevin@uprise.is</span>
                              </div>
                              <div className="w-24 text-center">
                                <span className="text-sm text-accent-primary">add to Asana</span>
                              </div>
                              <div className="w-24 text-center">
                                <span className="text-sm text-accent-primary">Open in Gmail</span>
                              </div>
                            </div>)}
                        </div>
                      </div>
                    </div>}

                  {selectedCalendarItem && <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-4">Meeting Brief</h2>
                      <div className="bg-surface-raised/50 rounded-lg p-6 border border-border-subtle">
                        <p className="text-text-secondary">Meeting brief content would appear here...</p>
                      </div>
                    </div>}

                  {!selectedBrief && !selectedCalendarItem && <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-text-primary mb-2">No upcoming meetings for today</h3>
                        <p className="text-text-secondary">Select a brief or calendar item from the left panel to view details</p>
                      </div>
                    </div>}
                </div>
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle />

          {/* Right Panel */}
          <ResizablePanel defaultSize={20} minSize={15} maxSize={35} collapsible={true} collapsedSize={4} onCollapse={() => setRightPanelCollapsed(true)} onExpand={() => setRightPanelCollapsed(false)}>
            <div className={cn("h-full border-l border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col", rightPanelCollapsed && "items-center")}>
              {!rightPanelCollapsed ? (
                <div className="flex-1 overflow-hidden">
                  <ActionItemsPanel onToggleCollapse={() => setRightPanelCollapsed(true)} />
                </div>
              ) : (
                /* Collapsed State */
                <div className="p-2 flex flex-col items-center">
                  <Button variant="ghost" size="sm" onClick={() => setRightPanelCollapsed(false)} className="h-8 w-8 p-0 mb-4">
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Fixed Audio Player */}
      <AudioPlayer briefId={playingBrief} briefName={playingBrief ? recentBriefs.find(b => b.id === playingBrief)?.name : undefined} briefTime={playingBrief ? recentBriefs.find(b => b.id === playingBrief)?.timeCreated : undefined} onClose={() => setPlayingBrief(null)} />

      {/* Mobile Right Drawer */}
      <Sheet open={showRightDrawer} onOpenChange={setShowRightDrawer}>
        <SheetContent side="right" className="w-80">
          <div className="p-4">
            <h2 className="font-semibold text-text-primary mb-4">Follow-ups</h2>
            <ActionItemsPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>;
};
export default React.memo(HomeView);