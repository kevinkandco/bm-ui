import React, { useState, useCallback } from "react";
import { Zap, Focus, Clock, X, Play, Pause, ChevronDown, Calendar, User, Settings, PanelLeftClose, PanelRightClose, CheckSquare, PanelLeftOpen, Mail, Kanban, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);

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

  // Sample messages data from the brief
  const allMessages = [
    {
      id: 1,
      platform: "G",
      priority: "High",
      message: "Your Hover domain 'uprise.holdings' expired yesterday. The renewal price is $74.74 with auto-renew currently off. Please renew soon.",
      sender: "Hover <help@hover.com>",
      time: "12:24 PM",
      actionType: "Open in Email"
    },
    {
      id: 2,
      platform: "G", 
      priority: "High",
      message: "An automatic deposit of $1,500.00 is scheduled for August 5th, 2025, from your Mercury Uprise Checking account to your Retirement account. You can skip this deposit by 4:00 PM ET on the deposit initiation date if needed.",
      sender: "Betterment <support@betterment.com>",
      time: "6:36 PM",
      actionType: "Open in Email"
    },
    {
      id: 3,
      platform: "S",
      priority: "High", 
      message: "We're looking for a generalist for our venture studio to work as the founder's right-hand person. Please check the job description on LinkedIn and complete the video ask if you apply. Reach out to Vishaitsa Rakesh for any questions.",
      sender: "Vishaitsa Rakesh",
      time: "12:22 AM",
      actionType: "Open in Slack"
    },
    {
      id: 4,
      platform: "G",
      priority: "Medium",
      message: "Your July 2026 statement is available on Betterment. Review updates to their client agreements effective September 1, 2026.",
      sender: "Betterment Statements <support@betterment.com>",
      time: "7:22 AM", 
      actionType: "Open in Email"
    },
    {
      id: 5,
      platform: "G",
      priority: "Medium",
      message: "Lenny's Newsletter featured a tech founder and VC using AI to launch a brick-and-mortar business. This episode highlights innovative uses of AI in creating business plans and categorizing data.",
      sender: '"Lenny\'s Newsletter" <lenny.how-i-ai@substack.com>',
      time: "4:33 PM",
      actionType: "Open in Email"
    },
    {
      id: 6,
      platform: "G",
      priority: "Medium",
      message: "Buffer sent a weekly performance report for your post. Review the details to analyze the post's performance metrics.",
      sender: "The Buffer Team <hello@buffer.com>",
      time: "4:43 PM",
      actionType: "Open in Email"
    }
  ];

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
    const getStatusIcon = () => {
      switch (userStatus) {
        case 'focus':
          return <Focus className="h-3 w-3" />;
        case 'away':
          return <Clock className="h-3 w-3" />;
        case 'vacation':
          return <X className="h-3 w-3" />;
        default: // active
          return <Zap className="h-3 w-3" />;
      }
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className="px-2 py-1 h-8 rounded-full border-border-subtle bg-surface-raised/50 hover:bg-surface-raised/70 text-text-primary flex items-center gap-1.5 text-xs"
          >
            {getStatusIcon()}
            <span>Update Status</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-surface border-border-subtle w-56 z-50" align="start">
          <DropdownMenuItem 
            onClick={onStartFocusMode} 
            className="text-text-primary hover:bg-surface-raised/50 flex items-center gap-3 px-4 py-3"
          >
            <Focus className="h-4 w-4" />
            Start Focus Mode
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={onSignOffForDay} 
            className="text-text-primary hover:bg-surface-raised/50 flex items-center gap-3 px-4 py-3"
          >
            <Clock className="h-4 w-4" />
            Sign Off for the Day
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
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
            {/* Left: Brief Me Logo and Status */}
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" alt="Brief Me" className="h-8 w-auto" />
              {/* Status Chip */}
              {getStatusChip()}
            </div>

            {/* Center: Empty (reserved space) */}
            <div className="flex-1" />

            {/* Right: Get Brief button, Avatar */}
            <div className="flex items-center gap-3">
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

      {/* Three-Column Layout */}
      <div className="flex-1 pb-20 flex">
        {/* Left Panel */}
        {!leftPanelCollapsed ? (
          <div className="w-80 h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="h-full flex flex-col">
              {/* Latest Brief Section */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3 mt-[30px]">
                  <h2 className="text-lg font-medium text-text-primary">Latest Brief</h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setLeftPanelCollapsed(true)} 
                    className="h-6 w-6 p-0"
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
                <LatestBriefSection onClick={() => handleBriefSelect(1)} isSelected={selectedBrief === 1} />
              </div>
              
              {/* Briefs List */}
              <div className="flex-1 min-h-0">
                <BriefsList 
                  onPlayBrief={handlePlayBrief} 
                  onSettingsClick={() => navigate("/dashboard/settings")} 
                  playingBrief={playingBrief} 
                  selectedBrief={selectedBrief} 
                  onBriefSelect={handleBriefSelect} 
                />
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed Left Panel */
          <div className="w-12 h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="p-2 flex flex-col items-center mt-[30px] space-y-3">
              {/* Open Panel Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setLeftPanelCollapsed(false)} 
                className="h-8 w-8 p-0 mb-4"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
              
              {/* Latest Brief Icon */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleBriefSelect(1);
                  setLeftPanelCollapsed(false);
                }}
                className={cn(
                  "h-8 w-8 p-0",
                  selectedBrief === 1 ? "bg-accent-primary/20 text-accent-primary" : ""
                )}
              >
                <CheckSquare className="h-4 w-4" />
              </Button>
              
              {/* Recent Briefs Icons */}
              {recentBriefs.slice(1).map((brief, index) => (
                <Button
                  key={brief.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleBriefSelect(brief.id);
                    setLeftPanelCollapsed(false);
                  }}
                  className={cn(
                    "h-8 w-8 p-0",
                    selectedBrief === brief.id ? "bg-accent-primary/20 text-accent-primary" : ""
                  )}
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
              ))}
              
              {/* Calendar Events Icons (sample) */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleCalendarSelect("meeting-1");
                  setLeftPanelCollapsed(false);
                }}
                className={cn(
                  "h-8 w-8 p-0",
                  selectedCalendarItem === "meeting-1" ? "bg-accent-primary/20 text-accent-primary" : ""
                )}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleCalendarSelect("meeting-2");
                  setLeftPanelCollapsed(false);
                }}
                className={cn(
                  "h-8 w-8 p-0",
                  selectedCalendarItem === "meeting-2" ? "bg-accent-primary/20 text-accent-primary" : ""
                )}
              >
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Main Content Panel */}
        <div className="flex-1 h-screen overflow-hidden">
          {/* Main Content Card */}
          <div className="h-full bg-background/80 backdrop-blur-sm shadow-xl rounded-xl border border-border-subtle overflow-hidden" style={{
            background: `
              radial-gradient(
                circle at top left,
                #2A8A5F 0%,
                #1E646E 30%,
                #000000 70%
              ),
              url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M30 0c16.569 0 30 13.431 30 30s-13.431 30-30 30S0 46.569 0 30 13.431 0 30 0zm0 6c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24S43.255 6 30 6zm0 6c9.941 0 18 8.059 18 18s-8.059 18-18 18-18-8.059-18-18 8.059-18 18-18zm0 6c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"
            `
          }}>
            <div className="p-6 h-full overflow-auto bg-[#1f262c]/[0.47]">
              {selectedBrief && (
                <div className="space-y-6">
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
                        <button 
                          onClick={() => handlePlayBrief(selectedBrief)} 
                          className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center hover:bg-accent-primary/30 transition-colors"
                        >
                          {playingBrief === selectedBrief ? (
                            <Pause className="h-6 w-6 text-accent-primary" />
                          ) : (
                            <Play className="h-6 w-6 text-accent-primary" />
                          )}
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

                  {/* Tabs Section */}
                  <div>
                    <Tabs defaultValue="followups" className="w-full">
                      <TabsList className="grid w-fit grid-cols-2 bg-surface-raised/30 p-1 rounded-lg">
                        <TabsTrigger 
                          value="followups" 
                          className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2"
                        >
                          Follow ups (8)
                        </TabsTrigger>
                        <TabsTrigger 
                          value="allmessages" 
                          className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2"
                        >
                          All Messages & Items ({allMessages.length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="followups" className="mt-4">
                        <div className="space-y-3">
                          {[...Array(8)].map((_, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 bg-surface-raised/30 rounded-lg">
                              <div className="w-16 text-center">
                                <Badge className="bg-transparent border border-orange-500 text-orange-400 text-xs px-2 py-1 rounded-full font-medium">
                                  High
                                </Badge>
                              </div>
                              <div className="w-20 text-center">
                                <Badge className="bg-transparent border border-blue-500 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                                  Decision
                                </Badge>
                              </div>
                              <div className="flex-1">
                                <span className="text-sm text-text-primary">Review weekly performance report</span>
                              </div>
                              <div className="w-32 text-center">
                                <span className="text-sm text-text-secondary">kevin@uprise.is</span>
                              </div>
                              <div className="w-28 text-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7"
                                >
                                  <Kanban className="h-3 w-3" />
                                  Asana
                                </Button>
                              </div>
                              <div className="w-28 text-center">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7"
                                >
                                  <Mail className="h-3 w-3" />
                                  Gmail
                                </Button>
                              </div>
                              <div className="flex items-center">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedFollowUp({
                                      id: index,
                                      title: "Domain Expiration",
                                      priority: "High",
                                      type: "Decision",
                                      description: "Review weekly performance report",
                                      sender: "kevin@uprise.is",
                                      from: "Hover <help@hover.com>",
                                      subject: "Urgent: Launch Materials Review Needed",
                                      fullMessage: "Your Hover domain 'uprise.holdings' expired yesterday. The renewal price is $74.74 with auto-renew currently off. Please renew soon.",
                                      relevancy: "Critical - blocking marketing team progress",
                                      reasoning: "Marked as an Action Item because it contains an explicit request directed at you with a specific deadline.",
                                      created: "12:24 PM",
                                      lastActivity: "12:24 PM",
                                      source: "Gmail",
                                      due: "2 PM today"
                                    });
                                    setShowFollowUpModal(true);
                                  }}
                                  className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary"
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="allmessages" className="mt-4">
                        <div className="bg-surface-raised/30 rounded-lg border border-border-subtle">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border-subtle hover:bg-transparent">
                                <TableHead className="text-text-secondary font-medium">Platform</TableHead>
                                <TableHead className="text-text-secondary font-medium">Priority</TableHead>
                                <TableHead className="text-text-secondary font-medium">Message</TableHead>
                                <TableHead className="text-text-secondary font-medium">Sender</TableHead>
                                <TableHead className="text-text-secondary font-medium">Time</TableHead>
                                <TableHead className="text-text-secondary font-medium">Action Menu</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {allMessages.map((message) => (
                                <TableRow key={message.id} className="border-border-subtle hover:bg-surface-raised/20">
                                  <TableCell className="w-12">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised/50 border border-border-subtle">
                                      <span className="text-xs font-medium text-text-primary">{message.platform}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-20">
                                    <Badge className={cn(
                                      "bg-transparent text-xs px-2 py-1 rounded-full font-medium border",
                                      message.priority === "High" 
                                        ? "border-orange-500 text-orange-400" 
                                        : "border-yellow-500 text-yellow-400"
                                    )}>
                                      {message.priority}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="max-w-md">
                                    <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">
                                      {message.message}
                                    </p>
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {message.sender}
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {message.time}
                                  </TableCell>
                                  <TableCell>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7"
                                    >
                                      {message.platform === "S" ? (
                                        <>
                                          <Calendar className="h-3 w-3" />
                                          Slack
                                        </>
                                      ) : (
                                        <>
                                          <Mail className="h-3 w-3" />
                                          Email
                                        </>
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}

              {selectedCalendarItem && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">Meeting Brief</h2>
                  <div className="bg-surface-raised/50 rounded-lg p-6 border border-border-subtle">
                    <p className="text-text-secondary">Meeting brief content would appear here...</p>
                  </div>
                </div>
              )}

              {!selectedBrief && !selectedCalendarItem && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-text-primary mb-2">No upcoming meetings for today</h3>
                    <p className="text-text-secondary">Select a brief or calendar item from the left panel to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {!rightPanelCollapsed ? (
          <div className="w-80 h-full border-l border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ActionItemsPanel onToggleCollapse={() => setRightPanelCollapsed(true)} />
            </div>
          </div>
        ) : (
          /* Collapsed Right Panel - Empty Space */
          <div className="w-5 h-full">
            {/* 20px empty space */}
          </div>
        )}
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

      {/* Follow-up Details Modal */}
      <Dialog open={showFollowUpModal} onOpenChange={setShowFollowUpModal}>
        <DialogContent className="bg-surface border-border-subtle max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedFollowUp && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-6 w-6 text-blue-400" />
                  <div>
                    <h2 className="text-xl font-semibold text-text-primary">{selectedFollowUp.title}</h2>
                    <p className="text-sm text-text-secondary">7:45 AM</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-3 py-2 text-sm flex items-center gap-2"
                  >
                    <Kanban className="h-4 w-4" />
                    Add to Asana
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-3 py-2 text-sm flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Open in Gmail
                  </Button>
                </div>
              </div>

              {/* From and Subject */}
              <div className="space-y-2">
                <div>
                  <span className="text-text-secondary text-sm">From: </span>
                  <span className="text-text-primary">{selectedFollowUp.from}</span>
                </div>
                <div>
                  <span className="text-text-secondary text-sm">Subject: </span>
                  <span className="text-text-primary">{selectedFollowUp.subject}</span>
                </div>
              </div>

              {/* Full Message */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-text-primary">Full Message:</h3>
                <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
                  <p className="text-text-primary leading-relaxed">{selectedFollowUp.fullMessage}</p>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left Column - Relevancy */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-text-primary">Relevancy:</h3>
                  <p className="text-text-primary">{selectedFollowUp.relevancy}</p>
                </div>

                {/* Right Column - Why this is an action item */}
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-text-primary">Why this is an action item:</h3>
                  <p className="text-text-primary">{selectedFollowUp.reasoning}</p>
                </div>
              </div>

              {/* Bottom Details */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Created:</span>
                  <span className="text-text-primary">{selectedFollowUp.created}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Last Activity:</span>
                  <span className="text-text-primary">{selectedFollowUp.lastActivity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Source:</span>
                  <span className="text-text-primary">{selectedFollowUp.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Due:</span>
                  <span className="text-text-primary">{selectedFollowUp.due}</span>
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="pt-4">
                <Button 
                  className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Open in Gmail
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>;
};
export default React.memo(HomeView);