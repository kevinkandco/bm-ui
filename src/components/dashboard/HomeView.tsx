import React, { useState, useCallback } from "react";
import { Zap, Focus, Clock, X, Play, Pause, ChevronDown, Calendar, User, Settings, CheckSquare, Mail, Kanban, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Import components
import ActionItemsPanel from "./ActionItemsPanel";
import AudioPlayer from "./AudioPlayer";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // State for new layout
  const [selectedSection, setSelectedSection] = useState<'briefs' | 'calendar' | 'followups'>('briefs');
  const [selectedBrief, setSelectedBrief] = useState<number | null>(null);
  const [selectedCalendarItem, setSelectedCalendarItem] = useState<string | null>(null);
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [rightPanelContent, setRightPanelContent] = useState<'transcript' | 'message' | 'meeting' | null>(null);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<any>(null);
  const [followUpsFilter, setFollowUpsFilter] = useState<'all' | 'current'>('all');
  const [showPriorityConfirmModal, setShowPriorityConfirmModal] = useState(false);
  const [priorityChangeData, setPriorityChangeData] = useState<any>(null);
  const [snoozeReason, setSnoozeReason] = useState("message");

  // Sample data
  const recentBriefs = [
    {
      id: 1,
      name: "Morning Brief",
      timeCreated: "Today, 8:00 AM",
      timeRange: "5:00 AM - 8:00 AM",
      slackMessages: { total: 12, fromPriorityPeople: 3 },
      emails: { total: 5, fromPriorityPeople: 2 },
      actionItems: 4,
      hasTranscript: true
    },
    {
      id: 2,
      name: "Evening Brief",
      timeCreated: "Yesterday, 8:00 PM",
      timeRange: "5:00 PM - 8:00 PM",
      slackMessages: { total: 8, fromPriorityPeople: 1 },
      emails: { total: 3, fromPriorityPeople: 0 },
      actionItems: 2,
      hasTranscript: true
    }
  ];

  const calendarItems = [
    {
      id: "meeting-1",
      title: "Meeting w/Mike",
      time: "8AM to 9AM (1hr)",
      type: "upcoming"
    },
    {
      id: "meeting-2", 
      title: "Team Standup",
      time: "10AM to 10:30AM (30min)",
      type: "upcoming"
    }
  ];

  const allMessages = [
    {
      id: 1,
      platform: "G",
      priority: "High",
      message: "Your Hover domain 'uprise.holdings' has expired. Please renew it as soon as possible to avoid service interruption.",
      sender: "Hover <billing@hover.com>",
      time: "6:45 PM",
      actionType: "Open in Email"
    },
    {
      id: 2,
      platform: "G", 
      priority: "High",
      message: "An automatic deposit of $1,500.00 is scheduled for August 5th, 2025, from your Mercury Uprise Checking account to your Retirement account.",
      sender: "Betterment <support@betterment.com>",
      time: "6:36 PM",
      actionType: "Open in Email"
    }
  ];

  // Handlers
  const handlePlayBrief = useCallback((briefId: number) => {
    setSelectedMessage(null);
    
    if (playingBrief === briefId) {
      setPlayingBrief(null);
      setSelectedTranscript(null);
      setShowRightPanel(false);
      setRightPanelContent(null);
      toast({
        title: "Brief Paused",
        description: "Audio playback paused"
      });
    } else {
      setPlayingBrief(briefId);
      const brief = recentBriefs.find(b => b.id === briefId);
      setSelectedTranscript({
        id: briefId,
        title: brief?.name || "Morning Brief",
        timeRange: brief?.timeRange || "5:00 AM - 8:00 AM",
        transcript: `Welcome to your Morning Brief for August 4th, 2025. Here's what happened overnight...`,
        summary: `3 mins summarizing: 3 Slack | 28 Emails | 4 Actions`,
        stats: {
          interrupts: 14,
          focusTime: "2h 17m", 
          timeSaved: "~66"
        }
      });
      setShowRightPanel(true);
      setRightPanelContent('transcript');
      toast({
        title: "Playing Brief",
        description: "Audio playback started - transcript shown in right panel"
      });
    }
  }, [playingBrief, toast, recentBriefs]);

  const handleBriefClick = useCallback((briefId: number) => {
    setSelectedBrief(briefId);
    setSelectedCalendarItem(null);
    setSelectedFollowUp(null);
  }, []);

  const handleCalendarClick = useCallback((itemId: string) => {
    setSelectedCalendarItem(itemId);
    setSelectedBrief(null);
    setSelectedFollowUp(null);
    setShowRightPanel(true);
    setRightPanelContent('meeting');
  }, []);

  const handleFollowUpClick = useCallback((followUp: any) => {
    setSelectedFollowUp(followUp);
    setSelectedBrief(null);
    setSelectedCalendarItem(null);
    setSelectedMessage(followUp);
    setShowRightPanel(true);
    setRightPanelContent('message');
  }, []);

  const handlePriorityChange = useCallback((itemId: number, newPriority: string, oldPriority: string, itemData: any) => {
    setPriorityChangeData({
      itemId,
      newPriority,
      oldPriority,
      itemData,
      title: itemData.message
    });
    setShowPriorityConfirmModal(true);
  }, []);

  const PriorityBadge = ({ item, onPriorityChange }: { item: any, onPriorityChange: (itemId: number, newPriority: string, oldPriority: string, itemData: any) => void }) => {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "bg-transparent text-xs px-2 py-1 rounded-full font-medium border h-auto hover:bg-surface-raised/20",
              item.priority === "High" 
                ? "border-orange-500 text-orange-400" 
                : item.priority === "Medium"
                ? "border-yellow-500 text-yellow-400"
                : "border-green-500 text-green-400"
            )}
          >
            {item.priority}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 bg-surface border-border-subtle" align="start">
          <div className="space-y-1">
            {["High", "Medium", "Low"].map((priority) => (
              <Button
                key={priority}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-xs rounded-full",
                  priority === "High" && "text-orange-400 hover:bg-orange-500/20",
                  priority === "Medium" && "text-yellow-400 hover:bg-yellow-500/20", 
                  priority === "Low" && "text-green-400 hover:bg-green-500/20"
                )}
                onClick={() => onPriorityChange(item.id, priority, item.priority, item)}
              >
                {priority}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  const getStatusChip = () => {
    const getStatusIcon = () => {
      switch (userStatus) {
        case 'focus':
          return <Focus className="h-3 w-3" />;
        case 'away':
          return <Clock className="h-3 w-3" />;
        case 'vacation':
          return <X className="h-3 w-3" />;
        default:
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

  // Mobile fallback
  if (isMobile) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold text-text-primary mb-4">Good morning, Alex</h1>
        <p className="text-text-secondary">Mobile layout coming soon...</p>
      </div>
    );
  }

  const renderMainContent = () => {
    if (selectedSection === 'briefs') {
      if (selectedBrief) {
        const brief = recentBriefs.find(b => b.id === selectedBrief);
        return (
          <div className="space-y-6">
            <div>
              <div className="text-sm text-text-secondary mb-1">Scheduled | 8/4/2025 at 7:00 AM</div>
              <h2 className="text-2xl font-bold text-text-primary mb-1">{brief?.name}</h2>
              <p className="text-sm text-text-secondary">Summarizing {brief?.timeRange}</p>
            </div>

            <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handlePlayBrief(selectedBrief)}
                    className="flex items-center justify-center w-12 h-12 bg-accent-primary hover:bg-accent-primary/90 rounded-full text-white transition-colors"
                  >
                    {playingBrief === selectedBrief ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </button>
                  <div>
                    <div className="text-lg font-medium text-text-primary">3 mins summarizing</div>
                    <div className="text-sm text-text-secondary">{brief?.slackMessages.total} Slack | {brief?.emails.total} Emails | {brief?.actionItems} Actions</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Slack Messages</h3>
                <div className="text-2xl font-bold text-text-primary">{brief?.slackMessages.total}</div>
                <div className="text-xs text-text-secondary">{brief?.slackMessages.fromPriorityPeople} from priority people</div>
              </div>
              <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Emails</h3>
                <div className="text-2xl font-bold text-text-primary">{brief?.emails.total}</div>
                <div className="text-xs text-text-secondary">{brief?.emails.fromPriorityPeople} from priority people</div>
              </div>
              <div className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle">
                <h3 className="text-sm font-medium text-text-secondary mb-2">Action Items</h3>
                <div className="text-2xl font-bold text-text-primary">{brief?.actionItems}</div>
                <div className="text-xs text-text-secondary">Need attention</div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-text-primary">Briefs</h2>
            <div className="space-y-3">
              {recentBriefs.map((brief) => (
                <div 
                  key={brief.id}
                  onClick={() => handleBriefClick(brief.id)}
                  className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/70 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary">{brief.name}</h3>
                      <p className="text-sm text-text-secondary">{brief.timeCreated}</p>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayBrief(brief.id);
                      }}
                      className="bg-accent-primary hover:bg-accent-primary/90 text-white rounded-full w-10 h-10 p-0"
                    >
                      {playingBrief === brief.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    } else if (selectedSection === 'calendar') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Calendar</h2>
          <div className="space-y-3">
            {calendarItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleCalendarClick(item.id)}
                className="bg-surface-raised/50 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/70 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                    <p className="text-sm text-text-secondary">{item.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Record</Button>
                    <Button variant="outline" size="sm">Join</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else if (selectedSection === 'followups') {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text-primary">Follow ups</h2>
          <div className="bg-surface-raised/50 rounded-lg border border-border-subtle overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-text-secondary">Priority</TableHead>
                  <TableHead className="text-text-secondary">Message</TableHead>
                  <TableHead className="text-text-secondary">Sender</TableHead>
                  <TableHead className="text-text-secondary">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allMessages.map((message) => (
                  <TableRow 
                    key={message.id}
                    onClick={() => handleFollowUpClick(message)}
                    className="hover:bg-surface-raised/30 cursor-pointer"
                  >
                    <TableCell>
                      <PriorityBadge item={message} onPriorityChange={handlePriorityChange} />
                    </TableCell>
                    <TableCell className="text-text-primary max-w-md truncate">
                      {message.message}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {message.sender}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {message.time}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="border-b border-border-subtle bg-surface/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" alt="Brief Me" className="h-8 w-auto" />
              {getStatusChip()}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <Button onClick={onToggleCatchMeUp} className="bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                Get Brief
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0 h-auto">
                    <Avatar className="h-9 w-9 border-2 border-border-subtle hover:border-accent-primary transition-colors cursor-pointer">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" alt="Alex Johnson" />
                      <AvatarFallback className="bg-accent-primary/20 text-accent-primary font-medium">AJ</AvatarFallback>
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

      {/* Two-Column Layout */}
      <div className="flex-1 pb-20 flex">
        {/* Left Panel - Navigation Cards */}
        <div className="w-80 h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col p-6 space-y-4">
          <h2 className="text-lg font-medium text-text-primary mt-8">Navigation</h2>
          
          {/* Briefs Card */}
          <div 
            onClick={() => setSelectedSection('briefs')}
            className={cn(
              "bg-surface-raised/50 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/70 cursor-pointer transition-colors",
              selectedSection === 'briefs' && "bg-accent-primary/20 border-accent-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-accent-primary" />
              <div>
                <h3 className="text-lg font-medium text-text-primary">Briefs</h3>
                <p className="text-sm text-text-secondary">View your scheduled briefs</p>
              </div>
            </div>
          </div>

          {/* Follow ups Card */}
          <div 
            onClick={() => setSelectedSection('followups')}
            className={cn(
              "bg-surface-raised/50 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/70 cursor-pointer transition-colors",
              selectedSection === 'followups' && "bg-accent-primary/20 border-accent-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="h-6 w-6 text-accent-primary" />
              <div>
                <h3 className="text-lg font-medium text-text-primary">Follow ups</h3>
                <p className="text-sm text-text-secondary">Action items and messages</p>
              </div>
            </div>
          </div>

          {/* Calendar Card */}
          <div 
            onClick={() => setSelectedSection('calendar')}
            className={cn(
              "bg-surface-raised/50 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/70 cursor-pointer transition-colors",
              selectedSection === 'calendar' && "bg-accent-primary/20 border-accent-primary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-accent-primary" />
              <div>
                <h3 className="text-lg font-medium text-text-primary">Calendar</h3>
                <p className="text-sm text-text-secondary">Upcoming meetings and events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Panel */}
        <div className="flex-1 h-screen overflow-hidden">
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
              {renderMainContent()}
            </div>
          </div>
        </div>

        {/* Right Panel - Conditional */}
        {showRightPanel && (
          <div className="w-96 h-full border-l border-border-subtle bg-surface/50 backdrop-blur-sm">
            <div className="p-4 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-text-primary">
                  {rightPanelContent === 'transcript' ? 'Transcript' : 
                   rightPanelContent === 'message' ? 'Message Details' : 
                   rightPanelContent === 'meeting' ? 'Meeting Details' : 'Details'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setShowRightPanel(false);
                    setRightPanelContent(null);
                    setSelectedMessage(null);
                    setSelectedTranscript(null);
                  }} 
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ActionItemsPanel 
                selectedMessage={selectedMessage}
                onCloseMessage={() => setSelectedMessage(null)}
                selectedTranscript={selectedTranscript}
                onCloseTranscript={() => {
                  setSelectedTranscript(null);
                  setPlayingBrief(null);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Fixed Audio Player */}
      <AudioPlayer 
        briefId={playingBrief} 
        briefName={playingBrief ? recentBriefs.find(b => b.id === playingBrief)?.name : undefined} 
        briefTime={playingBrief ? recentBriefs.find(b => b.id === playingBrief)?.timeCreated : undefined} 
        onClose={() => setPlayingBrief(null)} 
      />

      {/* Priority Change Confirmation Modal */}
      <Dialog open={showPriorityConfirmModal} onOpenChange={setShowPriorityConfirmModal}>
        <DialogContent className="bg-surface border-border-subtle max-w-2xl">
          {priorityChangeData && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Why don't you want to see this?</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPriorityConfirmModal(false)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
                <h3 className="text-lg font-medium text-text-primary mb-2">{priorityChangeData.title}</h3>
                <p className="text-sm text-text-secondary">
                  Priority changed from {priorityChangeData.oldPriority} to {priorityChangeData.newPriority}
                </p>
              </div>

              <RadioGroup value={snoozeReason} onValueChange={setSnoozeReason} className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-surface-raised/20 rounded-lg border border-border-subtle">
                  <RadioGroupItem value="message" id="message" />
                  <div className="flex-1">
                    <Label htmlFor="message" className="text-text-primary font-medium cursor-pointer">
                      Snooze this specific message
                    </Label>
                    <p className="text-sm text-text-secondary">Hide only this action item</p>
                  </div>
                </div>
              </RadioGroup>

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setShowPriorityConfirmModal(false)}
                  className="flex-1 bg-transparent border-border-subtle text-text-primary hover:bg-surface-raised/30"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={() => {
                    toast({
                      title: "Priority Updated",
                      description: `Priority changed to ${priorityChangeData.newPriority}. We'll use this feedback to improve future suggestions.`
                    });
                    setShowPriorityConfirmModal(false);
                  }}
                  className="flex-1 bg-accent-primary hover:bg-accent-primary/90 text-white"
                >
                  Snooze Forever
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default React.memo(HomeView);