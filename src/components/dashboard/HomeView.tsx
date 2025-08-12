import React, { useState, useCallback } from "react";
import { Zap, Focus, Clock, X, Play, Pause, ChevronDown, Calendar, User, Settings, PanelLeftClose, PanelRightClose, CheckSquare, PanelLeftOpen, Mail, Kanban, Info, Users, Check, BookOpen, Home, FileText, ClipboardCheck, Pencil, Mic } from "lucide-react";
import MenuBarIcon from "./MenuBarIcon";
import SignalSweepBar from "../visuals/SignalSweepBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { DashboardCard } from "@/components/ui/dashboard-card";

// Import components
import BriefsContainer from "./HomeViewSections/BriefsContainer";
import CalendarSection from "./HomeViewSections/CalendarSection";
import ActionItemsPanel from "./ActionItemsPanel";
import LatestBriefSection from "./HomeViewSections/LatestBriefSection";
import AudioPlayer from "./AudioPlayer";
import BriefsList from "./BriefsList";
import UpcomingBriefCard from "./HomeViewSections/UpcomingBriefCard";
import MobileHomeView from "./MobileHomeView";
import MobileBottomNav from "./MobileBottomNav";
import MobileStatusModal from "./MobileStatusModal";
import BriefDrawer from "./BriefDrawer";

// Meeting interface from CalendarSection
interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
  briefing: string;
  aiSummary: string;
  hasProxy: boolean;
  hasNotes: boolean;
  proxyNotes?: string;
  summaryReady: boolean;
  isRecording: boolean;
  minutesUntil: number;
}

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
  onStatusChange?: (status: "active" | "away" | "focus" | "vacation") => void;
  onExitFocusMode?: () => void;
  onSignBackOn?: () => void;
}
const HomeView = ({
  onOpenBrief,
  onViewTranscript,
  onToggleFocusMode,
  onToggleCatchMeUp,
  onOpenBriefModal,
  onStartFocusMode,
  onSignOffForDay,
  userStatus = "active",
  onStatusChange,
  onExitFocusMode,
  onSignBackOn
}: HomeViewProps) => {
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL LOGIC OR EARLY RETURNS
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // State for new layout
  const [selectedBrief, setSelectedBrief] = useState<number | null>(1); // Default to latest brief
  const [showAllBriefs, setShowAllBriefs] = useState(false);
  const [selectedCalendarItem, setSelectedCalendarItem] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<'briefs' | 'calendar' | 'followups' | null>('briefs');
  const [leftRailTab, setLeftRailTab] = useState<'briefs' | 'calendar' | 'followups'>('briefs');
  const [isHomeSelected, setIsHomeSelected] = useState(false);
  const [followUpsFilter, setFollowUpsFilter] = useState<'all' | 'current'>('all');
  const [showRightDrawer, setShowRightDrawer] = useState(false);
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(true); // Closed by default
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<any>(null);
  const [showPriorityConfirmModal, setShowPriorityConfirmModal] = useState(false);
  const [priorityChangeData, setPriorityChangeData] = useState<any>(null);
  const [snoozeReason, setSnoozeReason] = useState("message");
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [selectedTranscript, setSelectedTranscript] = useState<any>(null);
  const [selectedFollowUpId, setSelectedFollowUpId] = useState<number | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [checkedFollowUps, setCheckedFollowUps] = useState<Set<number>>(new Set());
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('online');
  const [showMobileBriefDrawer, setShowMobileBriefDrawer] = useState(false);
  const [showInstructionsDrawer, setShowInstructionsDrawer] = useState(false);
  const [tempNotes, setTempNotes] = useState("");
  const [showMoreToday, setShowMoreToday] = useState(false);
  const [showAllFollowUps, setShowAllFollowUps] = useState(false);

  // Schedule state (from CalendarSection)
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "0",
      title: "internal project meeting",
      time: "9:00 AM",
      duration: "2 hours",
      attendees: [
        { name: "Project Team", email: "team@company.com" }
      ],
      briefing: "Internal project meeting with the team",
      aiSummary: "Regular project sync to discuss progress and next steps.",
      hasProxy: false,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: -180 // Past event
    },
    {
      id: "1.5",
      title: "demo with steve",
      time: "1:00 PM",
      duration: "1 hour",
      attendees: [
        { name: "Steve Wilson", email: "steve@company.com" }
      ],
      briefing: "Product demo with Steve Wilson",
      aiSummary: "Demo session to showcase new features and gather feedback.",
      hasProxy: true,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: -60 // Past event
    },
    {
      id: "1",
      title: "Test demo",
      time: "2:00 PM",
      duration: "1 hour",
      attendees: [
        { name: "Kevin Kirkpatrick", email: "kirkpatrick.kevin.j@gmail.com" },
        { name: "Kevin Kirkpatrick", email: "kevin@uprise.is" }
      ],
      briefing: "Test demo with Kevin Kirkpatrick (kevin@uprise.is) and kirkpatrick.kevin.j@gmail.com is likely an internal meeting or a product demonstration. Given the participants, it may involve reviewing or testing a tool, feature, or concept.",
      aiSummary: "Product demonstration with Kevin focusing on AI-driven scheduling tools and user-friendly solutions. Kevin has experience with AI assistants and structured content delivery.",
      hasProxy: true,
      hasNotes: true,
      proxyNotes: "Focus on practicality and personalization features",
      summaryReady: false,
      isRecording: true,
      minutesUntil: 45
    },
    {
      id: "2", 
      title: "external demo",
      time: "3:00 PM",
      duration: "30 min",
      attendees: [
        { name: "External Client", email: "client@company.com" }
      ],
      briefing: "External client demonstration meeting",
      aiSummary: "Client demonstration focusing on key product features and capabilities.",
      hasProxy: true,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 105
    },
    {
      id: "3",
      title: "design review",
      time: "3:30 PM", 
      duration: "45 min",
      attendees: [
        { name: "Design Team", email: "design@company.com" }
      ],
      briefing: "Design review session with the design team",
      aiSummary: "Review of latest design mockups and user interface updates.",
      hasProxy: true,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 135
    }
  ]);


  // Meeting handlers (from CalendarSection)
  const toggleProxy = useCallback((meetingId: string) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, hasProxy: !meeting.hasProxy }
        : meeting
    ));
  }, []);

  const openInstructionsDrawer = useCallback((meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setTempNotes(meeting.proxyNotes || "");
    setShowInstructionsDrawer(true);
  }, []);

  const saveNotes = useCallback(() => {
    if (selectedMeeting) {
      setMeetings(prev => prev.map(meeting => 
        meeting.id === selectedMeeting.id 
          ? { 
              ...meeting, 
              proxyNotes: tempNotes,
              hasNotes: tempNotes.trim().length > 0
            }
          : meeting
      ));
    }
    setShowInstructionsDrawer(false);
    setSelectedMeeting(null);
    setTempNotes("");
  }, [selectedMeeting, tempNotes]);

  const openMeetingDetails = useCallback((meeting: Meeting) => {
    const meetingWithDetails = {
      ...meeting,
      context: {
        relevantEmails: ["Parenting Schedule Emails"],
        interests: ["Tennis Newsletters"],
        weeklyCheckIns: ["Weekly Check-Ins"]
      },
      preparationPoints: [
        "Focus on Practicality",
        "Personalization",
        "Clarity and Structure"
      ],
      suggestedAgenda: [
        "Introduction",
        "Key Features"
      ]
    };
    // Use existing handleMeetingClick
    handleMeetingClick(meetingWithDetails);
  }, []);

  const getAttendanceText = useCallback((meeting: Meeting, userJoining: boolean = false) => {
    if (meeting.hasProxy && userJoining) {
      return "1 + Proxy attending";
    } else if (meeting.hasProxy) {
      return "Proxy attending";
    } else {
      return `${meeting.attendees.length} attending`;
    }
  }, []);

  // Process meetings for display
  const hasUpcomingMeetings = meetings.some(m => m.minutesUntil < 120);
  const nextMeeting = meetings.find(m => m.minutesUntil < 120);
  const upcomingMeetings = meetings.filter(m => m.minutesUntil < 120).slice(0, 2);
  const remainingMeetings = meetings.filter(m => m.minutesUntil < 120).slice(2);

  // Get all meetings for schedule (sorted by time)
  const allMeetings = [...meetings].sort((a, b) => {
    // Convert time to minutes for sorting
    const timeToMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const hours24 = period === 'PM' && hours !== 12 ? hours + 12 : (period === 'AM' && hours === 12 ? 0 : hours);
      return hours24 * 60 + (minutes || 0);
    };
    
    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });

  // Status-aware messaging functions
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'active':
        return "I'm here with you — let's make the most of today.";
      case 'away':
        return "Step away and enjoy your day — I'll take care of the rest.";
      case 'focus':
        return "Stay in the flow — I'll handle what can wait.";
      case 'vacation':
        return "Switch off and make the most of your time away — I've got this.";
      default:
        return "I'm here with you — let's make the most of today.";
    }
  };

  const getBriefButtonLabel = (status: string) => {
    switch (status) {
      case 'active':
        return "Brief Me";
      case 'away':
        return "Get Catch-Up Brief";
      case 'focus':
        return "Get Brief Anyway";
      case 'vacation':
        return "Preview OOO Brief";
      default:
        return "Brief Me";
    }
  };

  // Navigation handlers for collapsed panel
  const handleNavigateToHome = useCallback(() => {
    navigate('/dashboard');
    setIsHomeSelected(true);
    setSelectedBrief(null);
    setSelectedCalendarItem(null);
    setSelectedMeeting(null);
    setOpenSection(null);
    setLeftRailTab('briefs');
  }, [navigate]);
  const handleNavigateToAllBriefs = useCallback(() => {
    setIsHomeSelected(false);
    setSelectedBrief(null); // No specific brief selected to show "view all"
    setSelectedCalendarItem(null);
    setSelectedMeeting(null);
    setOpenSection('briefs');
    setLeftRailTab('briefs');
    setShowAllBriefs(true);
  }, []);
  const handleNavigateToAllCalendar = useCallback(() => {
    setIsHomeSelected(false);
    setSelectedBrief(null);
    setSelectedCalendarItem(null); // No specific event selected to show "view all"
    setSelectedMeeting(null);
    setOpenSection('calendar');
    setLeftRailTab('calendar');
  }, []);
  const handleNavigateToAllFollowUps = useCallback(() => {
    setIsHomeSelected(false);
    setSelectedBrief(null);
    setSelectedCalendarItem(null);
    setSelectedMeeting(null);
    setOpenSection('followups');
    setLeftRailTab('followups');
  }, []);
  const handleStatusSelect = useCallback((status: 'online' | 'focus' | 'vacation' | 'offline') => {
    // Map mobile status to main status system
    const statusMap: Record<string, 'active' | 'away' | 'focus' | 'vacation'> = {
      'online': 'active',
      'focus': 'focus', 
      'vacation': 'vacation',
      'offline': 'away'
    };
    
    const newStatus = statusMap[status];
    onStatusChange?.(newStatus);
    setCurrentStatus(status);
    
    if (status === 'focus') {
      onStartFocusMode();
    }
  }, [onStatusChange, onStartFocusMode]);

  // Sample data - expanded to include more briefs for "view all"
  const allBriefs = [{
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
  }, {
    id: 3,
    name: "Midday Brief",
    timeCreated: "Yesterday, 12:30 PM",
    timeRange: "9:00 AM - 12:30 PM",
    slackMessages: {
      total: 15,
      fromPriorityPeople: 4
    },
    emails: {
      total: 7,
      fromPriorityPeople: 3
    },
    actionItems: 6,
    hasTranscript: true
  }, {
    id: 4,
    name: "Weekend Brief",
    timeCreated: "2 days ago, 6:00 PM",
    timeRange: "12:00 PM - 6:00 PM",
    slackMessages: {
      total: 5,
      fromPriorityPeople: 1
    },
    emails: {
      total: 12,
      fromPriorityPeople: 4
    },
    actionItems: 3,
    hasTranscript: true
  }, {
    id: 5,
    name: "Friday Brief",
    timeCreated: "3 days ago, 5:00 PM",
    timeRange: "1:00 PM - 5:00 PM",
    slackMessages: {
      total: 22,
      fromPriorityPeople: 8
    },
    emails: {
      total: 18,
      fromPriorityPeople: 6
    },
    actionItems: 9,
    hasTranscript: true
  }];
  
  const recentBriefs = allBriefs.slice(0, 3); // Only show first 3 in recent
  const upcomingBriefs = [
    {
      id: 'upcoming-1',
      name: "Midday Brief",
      scheduledTime: "Today at 12:30 PM"
    },
    {
      id: 'upcoming-2', 
      name: "Evening Brief",
      scheduledTime: "Today at 6:00 PM"
    }
  ];

  // Sample follow-ups data in same format as messages
  const followUps = [{
    id: 1,
    platform: "G",
    priority: "High",
    message: "Review weekly performance report",
    sender: "kevin@uprise.is",
    time: "12:24 PM",
    actionType: "Decision"
  }, {
    id: 2,
    platform: "G",
    priority: "High",
    message: "Schedule follow up with Mike",
    sender: "mike@company.com",
    time: "11:30 AM",
    actionType: "Action"
  }, {
    id: 3,
    platform: "S",
    priority: "High",
    message: "Decide on new logo design direction",
    sender: "Sara Chen",
    time: "10:15 AM",
    actionType: "Decision"
  }, {
    id: 4,
    platform: "G",
    priority: "Medium",
    message: "Respond to confirm funding details",
    sender: "investor@vc.com",
    time: "9:45 AM",
    actionType: "Decision"
  }, {
    id: 5,
    platform: "S",
    priority: "Medium",
    message: "Update project timeline for Q1",
    sender: "Project Team",
    time: "8:30 AM",
    actionType: "Action"
  }, {
    id: 6,
    platform: "G",
    priority: "Low",
    message: "Review contract terms and conditions",
    sender: "legal@company.com",
    time: "Yesterday",
    actionType: "Deadline"
  }, {
    id: 7,
    platform: "G",
    priority: "Low",
    message: "Approve marketing budget allocation",
    sender: "marketing@company.com",
    time: "Yesterday",
    actionType: "Decision"
  }, {
    id: 8,
    platform: "S",
    priority: "Medium",
    message: "Finalize product roadmap priorities",
    sender: "Product Team",
    time: "Yesterday",
    actionType: "Action"
  }];

  // Sample messages data from the brief
  const allMessages = [{
    id: 1,
    platform: "G",
    priority: "High",
    message: "Your Hover domain 'uprise.holdings' expired yesterday. The renewal price is $74.74 with auto-renew currently off. Please renew soon.",
    sender: "Hover <help@hover.com>",
    time: "12:24 PM",
    actionType: "Open in Email"
  }, {
    id: 2,
    platform: "G",
    priority: "High",
    message: "An automatic deposit of $1,500.00 is scheduled for August 5th, 2025, from your Mercury Uprise Checking account to your Retirement account. You can skip this deposit by 4:00 PM ET on the deposit initiation date if needed.",
    sender: "Betterment <support@betterment.com>",
    time: "6:36 PM",
    actionType: "Open in Email"
  }, {
    id: 3,
    platform: "S",
    priority: "High",
    message: "We're looking for a generalist for our venture studio to work as the founder's right-hand person. Please check the job description on LinkedIn and complete the video ask if you apply. Reach out to Vishaitsa Rakesh for any questions.",
    sender: "Vishaitsa Rakesh",
    time: "12:22 AM",
    actionType: "Open in Slack"
  }, {
    id: 4,
    platform: "G",
    priority: "Medium",
    message: "Your July 2026 statement is available on Betterment. Review updates to their client agreements effective September 1, 2026.",
    sender: "Betterment Statements <support@betterment.com>",
    time: "7:22 AM",
    actionType: "Open in Email"
  }, {
    id: 5,
    platform: "G",
    priority: "Medium",
    message: "Lenny's Newsletter featured a tech founder and VC using AI to launch a brick-and-mortar business. This episode highlights innovative uses of AI in creating business plans and categorizing data.",
    sender: '"Lenny\'s Newsletter" <lenny.how-i-ai@substack.com>',
    time: "4:33 PM",
    actionType: "Open in Email"
  }, {
    id: 6,
    platform: "G",
    priority: "Medium",
    message: "Buffer sent a weekly performance report for your post. Review the details to analyze the post's performance metrics.",
    sender: "The Buffer Team <hello@buffer.com>",
    time: "4:43 PM",
    actionType: "Open in Email"
  }];

  // Handlers
  const handlePlayBrief = useCallback((briefId: number) => {
    console.log('handlePlayBrief called with briefId:', briefId);
    console.log('current playingBrief:', playingBrief);

    // Clear any selected message when showing transcript
    setSelectedMessage(null);
    if (playingBrief === briefId) {
      setPlayingBrief(null);
      setSelectedTranscript(null);
      console.log('Pausing brief');
    } else {
      setPlayingBrief(briefId);
      // Set transcript data
      const brief = allBriefs.find(b => b.id === briefId);
      setSelectedTranscript({
        id: briefId,
        title: brief?.name || "Morning Brief",
        timeRange: brief?.timeRange || "5:00 AM - 8:00 AM",
        transcript: `Welcome to your Morning Brief for August 4th, 2025. I've analyzed your messages from 5:00 PM yesterday to 7:00 AM this morning.

Here's what happened overnight:

**Priority Messages:**
• Betterment sent confirmation about your automatic $1,500 deposit scheduled for today
• Hover notified you that your domain 'uprise.holdings' expired yesterday - renewal required
• Vishaitsa Rakesh reached out about a venture studio generalist position

**Team Updates:**
• Sara Chen needs your input on the new logo design direction
• Mike is waiting for follow-up scheduling after your last conversation
• Project team requested timeline updates for Q1 planning

**Action Items Requiring Your Attention:**
1. Renew the expired domain (due today)
2. Respond to funding confirmation request
3. Review weekly performance report from Kevin
4. Schedule follow-up with Mike

**Focus Metrics:**
• 14 interrupts prevented overnight
• 2 hours 17 minutes of focus time preserved
• Approximately 66 minutes saved through batching

That's your brief for this morning. I've organized your follow-ups in priority order in the right panel.`,
        summary: `3 mins summarizing: 3 Slack | 28 Emails | 4 Actions`,
        stats: {
          interrupts: 14,
          focusTime: "2h 17m",
          timeSaved: "~66"
        }
      });
      setRightPanelCollapsed(false);
      console.log('Playing brief, new playingBrief should be:', briefId);
    }
  }, [playingBrief, recentBriefs]);
  const handleBriefSelect = useCallback((briefId: number) => {
    setSelectedBrief(briefId);
    setSelectedCalendarItem(null);
    setSelectedMeeting(null);
    setIsHomeSelected(false);
    setFollowUpsFilter('current');
    setShowAllBriefs(false);
  }, []);
  const handleCalendarSelect = useCallback((itemId: string) => {
    setSelectedCalendarItem(itemId);
    setSelectedBrief(null);
    setSelectedMeeting(null);
    setIsHomeSelected(false);
    setFollowUpsFilter('all');
  }, []);
  const handleHomeSelect = useCallback(() => {
    setIsHomeSelected(true);
    setSelectedBrief(null);
    setSelectedCalendarItem(null);
    setSelectedMeeting(null);
    setSelectedFollowUpId(null);
    setSelectedMessage(null);
    setSelectedTranscript(null);
    setRightPanelCollapsed(true);
    setShowAllBriefs(false);
  }, []);

  // Handler for follow up clicks in left panel
  const handleFollowUpClick = useCallback((item: any) => {
    // Set the selected follow up for highlighting
    setSelectedFollowUpId(item.id);

    // Show the brief that this follow up came from in main content area
    setSelectedBrief(1); // All follow ups are from the morning brief
    setSelectedCalendarItem(null);
    setSelectedMeeting(null); // Clear calendar selection
    setIsHomeSelected(false);
    setFollowUpsFilter('current');

    // Show detail view in right panel
    setSelectedMessage({
      ...item,
      subject: "Follow-up Required",
      fullMessage: `This is a follow-up item requiring your attention.\n\n${item.message}`,
      from: item.sender,
      relevancy: "Requires action from you",
      reasoning: "Marked as follow-up because it contains a task or decision that needs your input.",
      created: item.time,
      lastActivity: item.time,
      source: item.platform === "S" ? "Slack" : "Email",
      due: "End of day"
    });
    setRightPanelCollapsed(false);
  }, []);

  // Handler for calendar meeting clicks
  const handleMeetingClick = useCallback((meeting: any) => {
    // Show the calendar content in main area
    setOpenSection('calendar');
    setSelectedCalendarItem(meeting.id);
    setSelectedBrief(null);
    setSelectedMeeting(meeting);
    setIsHomeSelected(false);

    // Clear other selections
    setSelectedFollowUpId(null);
    setSelectedMessage(null);
    setSelectedTranscript(null);
    setRightPanelCollapsed(true);
  }, []);

  // Priority change handler
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
  const handleFollowUpCheck = (followUpId: number) => {
    setCheckedFollowUps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(followUpId)) {
        newSet.delete(followUpId);
      } else {
        newSet.add(followUpId);
      }
      return newSet;
    });
  };
  const handleRemoveCheckedFollowUps = () => {
    // In a real app, this would make an API call to remove the items
    setCheckedFollowUps(new Set());
    // You could also filter them out of the followUps array if needed
  };

  // Priority badge component
  const PriorityBadge = ({
    item,
    onPriorityChange
  }: {
    item: any;
    onPriorityChange: (itemId: number, newPriority: string, oldPriority: string, itemData: any) => void;
  }) => {
    return <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className={cn("bg-transparent text-xs px-2 py-1 rounded-full font-medium border h-auto hover:bg-surface-raised/20", item.priority === "High" ? "border-orange-500 text-orange-400" : item.priority === "Medium" ? "border-yellow-500 text-yellow-400" : "border-green-500 text-green-400")}>
            {item.priority}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-2 bg-surface border-border-subtle" align="start">
          <div className="space-y-1">
            {["High", "Medium", "Low"].map(priority => <Button key={priority} variant="ghost" className={cn("w-full justify-start text-xs rounded-full", priority === "High" && "text-orange-400 hover:bg-orange-500/20", priority === "Medium" && "text-yellow-400 hover:bg-yellow-500/20", priority === "Low" && "text-green-400 hover:bg-green-500/20")} onClick={() => onPriorityChange(item.id, priority, item.priority, item)}>
                {priority}
              </Button>)}
          </div>
        </PopoverContent>
      </Popover>;
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
          // active
          return <Zap className="h-3 w-3" />;
      }
    };
    return <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="px-2 py-1 h-8 rounded-full border-border-subtle bg-surface-raised/50 hover:bg-surface-raised/70 text-text-primary flex items-center gap-1.5 text-xs">
            {getStatusIcon()}
            <span>Update Status</span>
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-surface border-border-subtle w-56 z-50" align="start">
          <DropdownMenuItem onClick={onStartFocusMode} className="text-text-primary hover:bg-surface-raised/50 flex items-center gap-3 px-4 py-3">
            <Focus className="h-4 w-4" />
            Start Focus Mode
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSignOffForDay} className="text-text-primary hover:bg-surface-raised/50 flex items-center gap-3 px-4 py-3">
            <Clock className="h-4 w-4" />
            Sign Off for the Day
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>;
  };

  const handleOpenMobileBrief = useCallback((briefId: number) => {
    setSelectedBrief(briefId);
    setShowMobileBriefDrawer(true);
  }, []);

  const handleOpenBriefFromAudioBar = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!playingBrief) return;
    const target = e.target as HTMLElement;
    if (target.closest('button')) return; // ignore clicks on controls
    setSelectedBrief(playingBrief);
    setShowMobileBriefDrawer(true);
  }, [playingBrief]);

  // Mobile layout
  if (isMobile) {
    return <div className="relative">
        <MobileHomeView onPlayBrief={handlePlayBrief} playingBrief={playingBrief} onOpenBrief={handleOpenMobileBrief} onStartFocusMode={onStartFocusMode} onBriefMe={onToggleCatchMeUp} userStatus={userStatus} onStatusChange={onStatusChange} />
        
        {/* Mobile Bottom Navigation */}
        <MobileBottomNav onShowStatusModal={() => setShowStatusModal(true)} userStatus={userStatus} />
        
        {/* Mobile Audio Player - shows above bottom nav when active */}
        {playingBrief && (
          <div onClick={handleOpenBriefFromAudioBar}>
            <AudioPlayer briefId={playingBrief} briefName={allBriefs.find(b => b.id === playingBrief)?.name} briefTime={allBriefs.find(b => b.id === playingBrief)?.timeCreated} onClose={() => setPlayingBrief(null)} />
          </div>
        )}

        {/* Mobile Status Modal */}
        <MobileStatusModal 
          isOpen={showStatusModal} 
          onClose={() => setShowStatusModal(false)} 
          onSelectStatus={handleStatusSelect} 
          currentStatus={
            userStatus === 'active' ? 'online' : 
            userStatus === 'focus' ? 'focus' : 
            userStatus === 'vacation' ? 'vacation' : 
            userStatus === 'away' ? 'offline' : 'online'
          } 
        />

        {/* Mobile Brief Drawer */}
        <BriefDrawer open={showMobileBriefDrawer} briefId={selectedBrief} onClose={() => setShowMobileBriefDrawer(false)} />
      </div>;
    }

  return <div className="min-h-screen flex flex-col">
      {/* Global Header */}
      <header className="border-b border-border-subtle bg-surface/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Brief Me Logo and Status */}
            <div className="flex items-center gap-3">
              <img src="/lovable-uploads/e61a999f-f42f-4283-b55a-696ceeb36413.png" alt="Brief Me" className="h-8 w-auto" />
              {/* Status Indicator with Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div 
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      userStatus === "active" ? "bg-green-500" :
                      userStatus === "away" ? "bg-yellow-500" :
                      userStatus === "focus" ? "bg-blue-500" :
                      userStatus === "vacation" ? "bg-gray-500" : "bg-green-500"
                    }`} />
                    <span className="text-sm text-text-secondary capitalize">{userStatus}</span>
                    <ChevronDown className="w-3 h-3 text-text-secondary" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => onStatusChange?.("active")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange?.("away")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Away
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange?.("focus")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    Focus
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onStatusChange?.("vacation")}
                    className="flex items-center gap-2"
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-500" />
                    Vacation
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Center: Status Message */}
            <div className="flex-1 flex justify-center">
              <p className="text-sm text-text-secondary/80">{getStatusMessage(userStatus)}</p>
            </div>

            {/* Right: Integration Icons, Get Brief button, Avatar */}
            <div className="flex items-center gap-3">
              {/* Integration Status Icons */}
              <div className="flex items-center gap-2">
                {/* Slack Integration */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors">
                      <div className="w-4 h-4 bg-purple-500 rounded-sm flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">#</span>
                      </div>
                      <span className="text-sm font-medium text-white">4</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Slack</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white text-sm">workspace@company.com</span>
                          <span className="text-gray-400 text-sm">• active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white text-sm">team@company.co</span>
                          <span className="text-gray-400 text-sm">• active</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Google Integration */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors">
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px] font-bold text-white">G</span>
                      </div>
                      <span className="text-sm font-medium text-white">2</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Google</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white text-sm">kirkpatrick.kevin.j@gmail.com</span>
                          <span className="text-gray-400 text-sm">• active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white text-sm">me@kevink.co</span>
                          <span className="text-gray-400 text-sm">• active</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Calendar Integration */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full cursor-pointer transition-colors">
                      <Calendar className="w-4 h-4 text-white" />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="bg-gray-900 rounded-lg overflow-hidden">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="text-white font-semibold">Calendar</h3>
                      </div>
                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-white text-sm">Personal Calendar</span>
                          <span className="text-gray-400 text-sm">• syncing</span>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Get Brief Button */}
              <Button onClick={onToggleCatchMeUp} className="bg-accent-primary hover:bg-accent-primary/90 text-white px-4 py-2">
                <Zap className="mr-2 h-4 w-4" />
                {getBriefButtonLabel(userStatus)}
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

      {/* SignalSweepBar - Full width below header */}
      <div className="w-full px-6">
        <SignalSweepBar 
          className="w-full" 
          height={5} 
          anchors={["#1B5862", "#277F64", "#4FAF83"]} 
          background="transparent" 
          thickness={2} 
          status={userStatus === 'active' ? 'active' : userStatus === 'focus' ? 'focused' : userStatus === 'vacation' ? 'ooo' : userStatus === 'away' ? 'offline' : 'active'} 
        />
      </div>

      {/* Three-Column Layout */}
      <div className="flex-1 pb-20 flex">
        {/* Left Panel */}
        {!leftPanelCollapsed ? <div className="w-80 h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="h-full flex flex-col">
              {/* Header with collapse button */}
              <div className="px-6">
                <div className="flex items-center justify-between mt-6 mb-4 flex ">
                  <h2 className="text-text-primary text-lg text-left font-medium mx-[10px]">Navigation</h2>
                  <Button variant="ghost" size="sm" onClick={() => setLeftPanelCollapsed(true)} className="h-6 w-6 p-0">
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Navigation sections - simplified */}
                <div className="w-full border-t border-border-subtle mt-8 pt-6 space-y-2 px-0">
                  {/* Home */}
                  <Button variant="ghost" onClick={handleNavigateToHome} className={cn("w-full justify-start py-2 text-sm font-medium hover:bg-surface-raised/50 px-[10px]", isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>

                  {/* Briefs */}
                  <Button variant="ghost" onClick={handleNavigateToAllBriefs} className={cn("w-full justify-start py-2 text-sm font-medium hover:bg-surface-raised/50 px-[10px]", leftRailTab === 'briefs' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Briefs
                  </Button>

                  {/* Calendar */}
                  <Button variant="ghost" onClick={handleNavigateToAllCalendar} className={cn("w-full justify-start py-2 text-sm font-medium hover:bg-surface-raised/50 px-[10px]", leftRailTab === 'calendar' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Calendar
                  </Button>

                  {/* Follow-ups */}
                  <Button variant="ghost" onClick={handleNavigateToAllFollowUps} className={cn("w-full justify-start py-2 text-sm font-medium hover:bg-surface-raised/50 px-[10px]", leftRailTab === 'followups' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                    <ClipboardCheck className="h-4 w-4 mr-2" />
                    Follow-ups
                  </Button>
                </div>
              </div>
              </div>
          </div> : (/* Collapsed Left Panel */
      <div className="w-12 h-full border-r border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="p-2 flex flex-col items-center mt-[30px] space-y-3">
              {/* Open/Close Panel Button */}
              <Button variant="ghost" size="sm" onClick={() => setLeftPanelCollapsed(false)} className="h-8 w-8 p-0 mb-4">
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
              
              {/* Home Icon */}
              <Button variant="ghost" size="sm" onClick={handleNavigateToHome} className={cn("h-8 w-8 p-0", isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                <Home className="h-4 w-4" />
              </Button>
              
              {/* Briefs Icon */}
              <Button variant="ghost" size="sm" onClick={handleNavigateToAllBriefs} className={cn("h-8 w-8 p-0", leftRailTab === 'briefs' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                <FileText className="h-4 w-4" />
              </Button>
              
              {/* Calendar Icon */}
              <Button variant="ghost" size="sm" onClick={handleNavigateToAllCalendar} className={cn("h-8 w-8 p-0", leftRailTab === 'calendar' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                <Calendar className="h-4 w-4" />
              </Button>
              
              {/* Follow Ups Icon */}
              <Button variant="ghost" size="sm" onClick={handleNavigateToAllFollowUps} className={cn("h-8 w-8 p-0", leftRailTab === 'followups' && !isHomeSelected ? "bg-accent-primary/20 text-accent-primary" : "")}>
                <ClipboardCheck className="h-4 w-4" />
              </Button>
            </div>
          </div>)}

        {/* Main Content Panel */}
        <div className="flex-1 h-screen overflow-hidden">
          {/* Main Content Card */}
          <div className="h-full bg-background/80 backdrop-blur-sm shadow-xl border border-border-subtle overflow-hidden" style={{
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
            <div className="p-6 h-full overflow-auto bg-[#1f262c]/[0.47] shadow-lg">
              {/* Default Home Content */}
              {!selectedMeeting && !selectedBrief && isHomeSelected && <div className="space-y-6 px-[100px]">
                  {/* Date Header */}
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-text-primary">
                      {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                    </h1>
                  </div>

                  {/* Main Layout Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                      {/* Latest Brief Section */}
                      <DashboardCard 
                        title="Latest brief"
                        actions={
                          <Button 
                            variant="ghost" 
                            onClick={handleNavigateToAllBriefs}
                            className="text-xs text-text-secondary hover:text-text-primary p-0 h-auto font-normal"
                          >
                            View all
                          </Button>
                        }
                      >
                        <div 
                          className="p-4 rounded-lg hover:bg-surface-raised/20 transition-colors cursor-pointer -m-1"
                          onClick={() => handleBriefSelect(recentBriefs[0].id)}
                        >
                          <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent-primary/20" onClick={e => {
                              e.stopPropagation();
                              handlePlayBrief(recentBriefs[0].id);
                            }}>
                              {playingBrief === recentBriefs[0].id ? <Pause className="h-4 w-4 text-accent-primary" /> : <Play className="h-4 w-4 text-accent-primary" />}
                            </Button>
                            <div className="flex-1">
                              <h3 className="font-medium text-text-primary text-sm mb-1">{recentBriefs[0].name}</h3>
                              <p className="text-xs text-text-secondary mb-1">{recentBriefs[0].timeCreated}</p>
                              <p className="text-xs text-text-secondary">
                                {recentBriefs[0].slackMessages.fromPriorityPeople} Slack | {recentBriefs[0].emails.fromPriorityPeople} Emails | {recentBriefs[0].actionItems} Actions
                              </p>
                            </div>
                            <div className="text-xs text-text-secondary">
                              12hrs
                            </div>
                          </div>
                        </div>
                      </DashboardCard>

                      {/* Upcoming Briefs Section */}
                      <DashboardCard 
                        title="Upcoming briefs"
                        actions={
                          <Button 
                            variant="ghost" 
                            onClick={handleNavigateToAllBriefs}
                            className="text-xs text-text-secondary hover:text-text-primary p-0 h-auto font-normal"
                          >
                            View all
                          </Button>
                        }
                      >
                        {upcomingBriefs.length > 0 ? (
                          <div className="space-y-3">
                            {upcomingBriefs.slice(0, 2).map(brief => (
                              <div key={brief.id} className="p-4 rounded-lg hover:bg-surface-raised/20 transition-colors cursor-pointer -m-1" onClick={handleNavigateToAllBriefs}>
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded flex items-center justify-center bg-surface-overlay/50">
                                    <Clock className="h-4 w-4 text-text-secondary" />
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="font-medium text-text-primary text-sm mb-1">{brief.name}</h3>
                                    <p className="text-xs text-text-secondary">{brief.scheduledTime}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-sm text-text-secondary mb-2">No briefs scheduled.</p>
                            <Button 
                              variant="ghost"
                              onClick={handleNavigateToAllBriefs}
                              className="text-xs text-text-secondary hover:text-text-primary p-0 h-auto font-normal"
                            >
                              Schedule one
                            </Button>
                          </div>
                        )}
                      </DashboardCard>

                      {/* Today's Schedule Section */}
                      <DashboardCard title="Today's schedule">
                        <TooltipProvider>
                          {!hasUpcomingMeetings ? (
                            <div className="text-center py-6">
                              <Calendar className="w-8 h-8 mx-auto mb-3 text-text-secondary" />
                              <p className="text-sm text-text-secondary">No meetings soon</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Next 2 meetings expanded */}
                              {upcomingMeetings.map((meeting, index) => (
                                <div key={meeting.id} className="space-y-3">
                                  <div 
                                    className="bg-brand-600 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/5"
                                    onClick={() => openMeetingDetails(meeting)}
                                  >
                                    <div className="space-y-3">
                                      {/* Header with time and chips */}
                                      <div className="flex items-start justify-between mb-3">
                                        <div>
                                          <h4 className="text-sm font-medium text-text-primary mb-1">
                                            {meeting.title}
                                          </h4>
                                          <div className="flex items-center gap-2 text-xs text-text-secondary">
                                            <Clock className="w-3 h-3" />
                                            {meeting.time} • {meeting.duration}
                                          </div>
                                        </div>
                                        
                                        {/* Top-right chips */}
                                        <div className="flex items-center gap-2">
                                          {meeting.isRecording && (
                                            <div className="flex items-center gap-1">
                                              <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                                              <span className="text-xs text-error">REC</span>
                                            </div>
                                          )}
                                          
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  toggleProxy(meeting.id);
                                                }}
                                                variant={meeting.hasProxy ? "default" : "outline"}
                                                size="sm"
                                                className={`h-6 px-3 text-xs rounded-full ${
                                                  meeting.hasProxy 
                                                    ? "bg-success text-background hover:bg-success/90" 
                                                    : "border-white/12 text-text-secondary hover:border-success hover:text-success"
                                                }`}
                                              >
                                                {meeting.hasProxy ? "Proxy On" : "Send Proxy"}
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                              <p className="text-xs max-w-xs">
                                                Proxy will record, transcribe, and send a brief to you only.
                                              </p>
                                            </TooltipContent>
                                          </Tooltip>
                                        </div>
                                      </div>

                                      {/* AI Summary */}
                                      <div className="mb-3">
                                        <div className="flex items-start gap-2">
                                          <p className="text-xs text-text-secondary flex-1">
                                            {meeting.aiSummary}
                                          </p>
                                          <Button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openInstructionsDrawer(meeting);
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="h-5 w-5 p-0 text-text-secondary hover:text-text-primary"
                                          >
                                            {meeting.hasNotes ? (
                                              <BookOpen className="w-3 h-3" />
                                            ) : (
                                              <Pencil className="w-3 h-3" />
                                            )}
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Deliverables preview */}
                                      {meeting.hasProxy && (
                                        <div className="mb-3">
                                          <p className="text-xs text-text-secondary">
                                            {meeting.summaryReady ? (
                                              <span className="text-accent-primary cursor-pointer hover:underline">
                                                Summary & action items ready
                                              </span>
                                            ) : (
                                              "Summary & action items will appear here ≈ 10 min after the call"
                                            )}
                                          </p>
                                        </div>
                                      )}

                                      {/* Bottom section with attendance and CTA */}
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <Users className="w-3 h-3 text-text-secondary" />
                                          <span className="text-xs text-text-secondary">
                                            {getAttendanceText(meeting)}
                                          </span>
                                        </div>

                                        {/* Split button CTA */}
                                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                          <Button
                                            size="sm"
                                            className={`h-7 px-3 text-xs rounded-l-full ${
                                              meeting.hasProxy 
                                                ? "bg-brand-500 text-text-secondary hover:bg-brand-500" 
                                                : "bg-brand-300 text-background hover:bg-brand-300/90"
                                            }`}
                                            disabled={meeting.hasProxy}
                                          >
                                            Join Live
                                          </Button>
                                          
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                size="sm"
                                                className={`h-7 w-6 px-0 rounded-r-full border-l border-l-white/20 ${
                                                  meeting.hasProxy 
                                                    ? "bg-brand-500 text-text-secondary hover:bg-brand-500" 
                                                    : "bg-brand-300 text-background hover:bg-brand-300/90"
                                                }`}
                                              >
                                                <ChevronDown className="w-3 h-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="bg-brand-600 border-white/8">
                                              <DropdownMenuItem 
                                                onClick={() => toggleProxy(meeting.id)}
                                                className="text-text-primary hover:bg-white/8"
                                              >
                                                Send Proxy Instead
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Separator between expanded meetings */}
                                  {index < upcomingMeetings.length - 1 && (
                                    <div className="border-t border-white/8" />
                                  )}
                                </div>
                              ))}

                              {/* More today expander */}
                              {remainingMeetings.length > 0 && (
                                <div className="space-y-3">
                                  <div className="border-t border-white/8" />
                                  <Button
                                    variant="ghost"
                                    onClick={() => setShowMoreToday(!showMoreToday)}
                                    className="w-full justify-between text-sm text-text-secondary hover:text-text-primary p-0 h-auto font-normal"
                                  >
                                    <span>More today ({remainingMeetings.length})</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${showMoreToday ? 'rotate-180' : ''}`} />
                                  </Button>
                                  
                                  {showMoreToday && (
                                    <div className="space-y-0 bg-brand-600 rounded-xl">
                                      {allMeetings.map((meeting, index) => {
                                        const isPast = meeting.minutesUntil < 0;
                                        const isNext = meeting.id === nextMeeting?.id;
                                        
                                        return (
                                          <div key={meeting.id} className="relative">
                                            {/* Timeline connector */}
                                            {index > 0 && (
                                              <div className={`absolute left-16 top-0 w-0.5 h-4 ${
                                                allMeetings[index - 1].minutesUntil < 0 ? 'bg-error' : 'bg-white/8'
                                              }`} />
                                            )}
                                            
                                            <div 
                                              className={`flex items-center gap-4 py-3 px-4 cursor-pointer hover:bg-white/8 rounded-lg transition-colors ${
                                                isNext ? 'opacity-100' : 'opacity-80'
                                              }`}
                                              onClick={() => openMeetingDetails(meeting)}
                                            >
                                              {/* Time */}
                                              <div className="text-sm text-text-secondary min-w-[100px] font-mono">
                                                {meeting.time}
                                              </div>
                                              
                                              {/* Title */}
                                              <div className="flex-1">
                                                <span className={`text-sm ${isPast ? 'text-text-secondary' : 'text-text-primary'}`}>
                                                  {meeting.title}
                                                </span>
                                              </div>
                                              
                                              {/* Status indicator */}
                                              <div className="flex items-center gap-2">
                                                {meeting.hasProxy && (
                                                  <div className="w-2 h-2 bg-success rounded-full" />
                                                )}
                                                {meeting.isRecording && (
                                                  <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                                                )}
                                              </div>
                                            </div>
                                            
                                            {/* Timeline indicator line - red line shows current time */}
                                            {meeting.minutesUntil < 0 && allMeetings[index + 1]?.minutesUntil >= 0 && (
                                              <div className="absolute left-0 right-0 top-full">
                                                <div className="h-0.5 bg-error w-full" />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </TooltipProvider>
                      </DashboardCard>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      {/* Follow ups Section */}
                      <DashboardCard title="Follow ups">
                        {(() => {
                          // Group follow-ups by priority
                          const groupedFollowUps = followUps.reduce((acc, item) => {
                            if (!acc[item.priority]) acc[item.priority] = [];
                            acc[item.priority].push(item);
                            return acc;
                          }, {} as Record<string, typeof followUps>);

                          const highPriority = groupedFollowUps.High || [];
                          const mediumPriority = groupedFollowUps.Medium || [];
                          const lowPriority = groupedFollowUps.Low || [];

                          // Show High + Medium by default (up to 5 total)
                          const defaultItems = [...highPriority, ...mediumPriority].slice(0, 5);
                          const hasLowPriority = lowPriority.length > 0;


                          const renderFollowUpItem = (item: any) => (
                            <div 
                              key={item.id}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-lg hover:bg-surface-raised/20 cursor-pointer transition-colors",
                                selectedFollowUpId === item.id && "bg-accent-primary/10 border-l-4 border-l-accent-primary"
                              )}
                              onClick={() => {
                                setSelectedFollowUpId(item.id);
                                setSelectedMessage({
                                  ...item,
                                  subject: "Follow-up Required",
                                  fullMessage: `This is a follow-up item requiring your attention.\n\n${item.message}`,
                                  from: item.sender,
                                  relevancy: "Requires action from you",
                                  reasoning: "Marked as follow-up because it contains a task or decision that needs your input.",
                                  created: item.time,
                                  lastActivity: item.time,
                                  source: item.platform === "S" ? "Slack" : "Email",
                                  due: "End of day"
                                });
                                setRightPanelCollapsed(false);
                              }}
                            >
                              <div 
                                className="flex-shrink-0" 
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox 
                                  checked={checkedFollowUps.has(item.id)} 
                                  onCheckedChange={() => handleFollowUpCheck(item.id)} 
                                  className="h-4 w-4" 
                                />
                              </div>

                              <div className="w-8 h-8 rounded-full bg-surface-raised/50 border border-border-subtle flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-medium text-text-primary">{item.platform}</span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <PriorityBadge item={item} onPriorityChange={handlePriorityChange} />
                                  <span className="text-xs text-text-secondary">{item.time}</span>
                                </div>
                                <p className="text-sm text-text-primary line-clamp-2 leading-relaxed mb-1">
                                  {item.message}
                                </p>
                                <p className="text-xs text-text-secondary truncate">{item.sender}</p>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7"
                                >
                                  <Kanban className="h-3 w-3" />
                                  Asana
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7"
                                >
                                  {item.platform === "S" ? (
                                    <>
                                      <Calendar className="h-3 w-3" />
                                      Schedule
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="h-3 w-3" />
                                      Reply
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          );

                          return (
                            <div className="space-y-4">
                              {/* High Priority Section */}
                              {highPriority.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                                    <h4 className="text-sm font-medium text-text-secondary">High Priority</h4>
                                  </div>
                                  <div className="space-y-1">
                                    {highPriority.map(renderFollowUpItem)}
                                  </div>
                                </div>
                              )}

                              {/* Medium Priority Section */}
                              {mediumPriority.length > 0 && (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                    <h4 className="text-sm font-medium text-text-secondary">Medium Priority</h4>
                                  </div>
                                  <div className="space-y-1">
                                    {mediumPriority.slice(0, Math.max(0, 5 - highPriority.length)).map(renderFollowUpItem)}
                                  </div>
                                </div>
                              )}

                              {/* Low Priority Section - Collapsible */}
                              {hasLowPriority && (
                                <div className="space-y-2">
                                  {showAllFollowUps && (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                                        <h4 className="text-sm font-medium text-text-secondary">Low Priority</h4>
                                      </div>
                                      <div className="space-y-1">
                                        {lowPriority.map(renderFollowUpItem)}
                                      </div>
                                    </>
                                  )}

                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowAllFollowUps(!showAllFollowUps)}
                                    className="w-full justify-center text-text-secondary hover:text-text-primary text-sm"
                                  >
                                    {showAllFollowUps ? 'Show less' : `Show all (${lowPriority.length} more)`}
                                  </Button>
                                </div>
                              )}

                              {checkedFollowUps.size > 0 && (
                                <div className="pt-3 border-t border-border-subtle">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemoveCheckedFollowUps}
                                    className="text-text-secondary hover:text-text-primary text-sm"
                                  >
                                    Remove {checkedFollowUps.size} completed
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </DashboardCard>
                    </div>
                  </div>
                </div>}
              
              {selectedMeeting && <div className="space-y-6">
                  {/* Meeting Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-text-primary mb-2">{selectedMeeting.title}</h2>
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{selectedMeeting.time} • {selectedMeeting.duration}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedMeeting(null);
                  setSelectedCalendarItem(null);
                }} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Attendees Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-text-secondary" />
                      <h3 className="text-lg font-medium text-text-primary">Attendees</h3>
                    </div>
                    <div className="space-y-3">
                      {selectedMeeting.attendees?.map((attendee: any, index: number) => <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
                              <span className="text-sm font-medium text-accent-primary">
                                {attendee.name.split(' ').map((n: string) => n.charAt(0)).join('').slice(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-text-primary">{attendee.name}</p>
                              <p className="text-xs text-text-secondary">{attendee.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" />
                            <Mail className="w-4 h-4 text-text-secondary" />
                          </div>
                        </div>)}
                    </div>
                  </div>

                  {/* Description Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-text-secondary" />
                      <h3 className="text-lg font-medium text-text-primary">Description</h3>
                    </div>
                    <p className="text-sm text-text-secondary">No description available.</p>
                  </div>

                  {/* Briefing Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Info className="w-5 h-5 text-text-secondary" />
                      <h3 className="text-lg font-medium text-text-primary">Briefing</h3>
                    </div>
                    
                    <div className="space-y-6">
                      {/* Relevant Context */}
                      <div>
                        <h4 className="text-base font-medium text-text-primary mb-3">Relevant Context:</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-sm font-medium text-text-primary mb-2">Parenting Schedule Emails:</h5>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              Kevin Kirkpatrick has been actively using an AI assistant for daily parenting and nanny scheduling. 
                              This suggests familiarity with AI-driven tools and a focus on practical, user-friendly solutions.
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-text-primary mb-2">Tennis Newsletters:</h5>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              Kevin also receives curated tennis updates, indicating an interest in personalized, well-structured 
                              content delivery. This could be relevant if the demo involves content curation or user engagement.
                            </p>
                          </div>
                          
                          <div>
                            <h5 className="text-sm font-medium text-text-primary mb-2">Weekly Check-Ins:</h5>
                            <p className="text-sm text-text-secondary leading-relaxed">
                              Kevin has participated in numerous recurring "Weekly Check" meetings with sb.suico@gmail.com. 
                              This demonstrates a routine of structured updates and collaboration.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Preparation Points */}
                      <div>
                        <h4 className="text-base font-medium text-text-primary mb-3">Preparation Points:</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium flex-shrink-0 mt-0.5">1</span>
                            <div>
                              <p className="text-sm text-text-primary"><strong>Focus on Practicality:</strong> Highlight how the demo tool or feature can simplify tasks or improve efficiency, similar to the AI assistant's scheduling capabilities.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium flex-shrink-0 mt-0.5">2</span>
                            <div>
                              <p className="text-sm text-text-primary"><strong>Personalization:</strong> If applicable, emphasize customization options or how the tool adapts to user preferences, drawing parallels to the curated tennis newsletters.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent-primary/20 text-accent-primary text-sm font-medium flex-shrink-0 mt-0.5">3</span>
                            <div>
                              <p className="text-sm text-text-primary"><strong>Clarity and Structure:</strong> Ensure the demo is well-organized, reflecting the structured approach Kevin is accustomed to in his weekly check-ins.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Suggested Agenda */}
                      <div>
                        <h4 className="text-base font-medium text-text-primary mb-3">Suggested Agenda:</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-text-primary"><strong>Introduction:</strong> Brief overview of the tool or feature being demonstrated.</p>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-primary mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-text-primary"><strong>Key Features:</strong> Highlight functionalities that align with Kevin's known interests.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
              
              {/* All Briefs View */}
              {showAllBriefs && <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-text-primary">All Briefs</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowAllBriefs(false)} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {allBriefs.map(brief => 
                      <div key={brief.id} className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle hover:bg-surface-raised/40 transition-colors cursor-pointer" onClick={() => handleBriefSelect(brief.id)}>
                        <div className="flex items-center gap-3">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-accent-primary/20" onClick={(e) => {
                            e.stopPropagation();
                            handlePlayBrief(brief.id);
                          }}>
                            {playingBrief === brief.id ? <Pause className="h-4 w-4 text-accent-primary" /> : <Play className="h-4 w-4 text-accent-primary" />}
                          </Button>
                          <div className="flex-1">
                            <h3 className="font-medium text-text-primary text-sm">{brief.name}</h3>
                            <p className="text-xs text-text-secondary mb-1">{brief.timeCreated}</p>
                            <p className="text-xs text-text-secondary">
                              {brief.slackMessages.fromPriorityPeople} Slack | {brief.emails.fromPriorityPeople} Emails | {brief.actionItems} Actions
                            </p>
                          </div>
                          <div className="text-xs text-text-secondary">
                            {brief.id === 1 ? '12hrs' : brief.id === 2 ? '1d' : brief.id === 3 ? '1d' : brief.id === 4 ? '2d' : '3d'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>}
              
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

                  {/* Tabs Section */}
                  <div>
                    <Tabs defaultValue="followups" className="w-full">
                      <TabsList className="grid w-fit grid-cols-2 bg-surface-raised/30 p-1 rounded-lg">
                        <TabsTrigger value="followups" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2 text-left">
                          Follow ups (8)
                        </TabsTrigger>
                        <TabsTrigger value="allmessages" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2">
                          All Messages & Items ({allMessages.length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="followups" className="mt-4">
                        <div className="bg-surface-raised/30 rounded-lg border border-border-subtle">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border-subtle hover:bg-transparent">
                                <TableHead className="text-text-secondary font-medium w-8"></TableHead>
                                <TableHead className="text-text-secondary font-medium">Platform</TableHead>
                                <TableHead className="text-text-secondary font-medium">Priority</TableHead>
                                <TableHead className="text-text-secondary font-medium">Message</TableHead>
                                <TableHead className="text-text-secondary font-medium">Sender</TableHead>
                                <TableHead className="text-text-secondary font-medium">Time</TableHead>
                                <TableHead className="text-text-secondary font-medium">Action Menu</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {followUps.map(item => <TableRow key={item.id} className={`border-border-subtle hover:bg-surface-raised/20 cursor-pointer ${selectedFollowUpId === item.id ? 'bg-accent-primary/10 border-l-4 border-l-accent-primary' : ''}`} onClick={() => {
                            setSelectedFollowUpId(item.id);
                            setSelectedMessage({
                              ...item,
                              subject: "Follow-up Required",
                              fullMessage: `This is a follow-up item requiring your attention.\n\n${item.message}`,
                              from: item.sender,
                              relevancy: "Requires action from you",
                              reasoning: "Marked as follow-up because it contains a task or decision that needs your input.",
                              created: item.time,
                              lastActivity: item.time,
                              source: item.platform === "S" ? "Slack" : "Email",
                              due: "End of day"
                            });
                            setRightPanelCollapsed(false);
                          }}>
                                  <TableCell className="w-8" onClick={e => e.stopPropagation()}>
                                    <Checkbox checked={checkedFollowUps.has(item.id)} onCheckedChange={() => handleFollowUpCheck(item.id)} className="h-4 w-4" />
                                  </TableCell>
                                  <TableCell className="w-12">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised/50 border border-border-subtle">
                                      <span className="text-xs font-medium text-text-primary">{item.platform}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-20">
                                    <PriorityBadge item={item} onPriorityChange={handlePriorityChange} />
                                  </TableCell>
                                  <TableCell className="max-w-md">
                                    <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">
                                      {item.message}
                                    </p>
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {item.sender}
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {item.time}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7">
                                        <Kanban className="h-3 w-3" />
                                        Asana
                                      </Button>
                                      <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7">
                                        {item.platform === "S" ? <>
                                            <Calendar className="h-3 w-3" />
                                            Slack
                                          </> : <>
                                            <Mail className="h-3 w-3" />
                                            Email
                                          </>}
                                      </Button>
                                      <Button variant="ghost" size="sm" onClick={() => {
                                  setSelectedFollowUp({
                                    id: item.id,
                                    title: "Domain Expiration",
                                    priority: item.priority,
                                    type: item.actionType,
                                    description: item.message,
                                    sender: item.sender,
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
                                }} className="h-6 w-6 p-0 text-text-secondary hover:text-text-primary">
                                        <Info className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
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
                              {allMessages.map(message => <TableRow key={message.id} className="border-border-subtle hover:bg-surface-raised/20 cursor-pointer" onClick={() => {
                            setSelectedMessage({
                              ...message,
                              subject: message.id === 2 ? "Upcoming Automatic Deposit" : "Important Message",
                              fullMessage: message.id === 2 ? `From: ${message.sender}\nSubject: Upcoming Automatic Deposit\n\nFull Message:\n\nAn automatic deposit of $1,500.00 is scheduled for August 5th, 2026, from your Mercury Uprise Checking account to your Retirement account. You can skip this deposit by 4:00 PM ET on the deposit initiation date if needed.\n\n${message.message}\n\nBest regards,\nBetterment Team` : `From: ${message.sender}\nSubject: Important Message\n\nFull Message:\n\n${message.message}`,
                              from: message.sender,
                              relevancy: message.priority === "High" ? "Requires immediate attention" : "Review when convenient",
                              reasoning: "Flagged based on sender importance and content keywords.",
                              created: message.time,
                              lastActivity: message.time,
                              source: message.platform === "S" ? "Slack" : "Email",
                              due: message.priority === "High" ? "Today" : "This week"
                            });
                            setRightPanelCollapsed(false);
                          }}>
                                  <TableCell className="w-12">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised/50 border border-border-subtle">
                                      <span className="text-xs font-medium text-text-primary">{message.platform}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="w-20">
                                    <PriorityBadge item={message} onPriorityChange={handlePriorityChange} />
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
                                    <div className="flex items-center gap-2">
                                      <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7">
                                        <Kanban className="h-3 w-3" />
                                        Asana
                                      </Button>
                                      <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-2 py-1 text-xs flex items-center gap-1 h-7">
                                        {message.platform === "S" ? <>
                                            <Calendar className="h-3 w-3" />
                                            Slack
                                          </> : <>
                                            <Mail className="h-3 w-3" />
                                            Email
                                          </>}
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>}

              {selectedCalendarItem && <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-4">Meeting Brief</h2>
                  <div className="bg-surface-raised/50 rounded-lg p-6 border border-border-subtle">
                    <p className="text-text-secondary">Meeting brief content would appear here...</p>
                  </div>
                </div>}

              {/* Follow ups view when leftRailTab is 'followups' */}
              {leftRailTab === 'followups' && !selectedBrief && !selectedCalendarItem && !isHomeSelected && <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-text-primary mb-1">All Follow-ups</h2>
                    <p className="text-sm text-text-secondary">Items requiring your attention</p>
                  </div>

                  {/* Tabs Section */}
                  <div>
                    <Tabs defaultValue="followups" className="w-full">
                      <TabsList className="grid w-fit grid-cols-2 bg-surface-raised/30 p-1 rounded-lg">
                        <TabsTrigger value="followups" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2 text-left">
                          Follow ups ({followUps.length})
                        </TabsTrigger>
                        <TabsTrigger value="allmessages" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-surface-raised/70 rounded-md px-4 py-2">
                          All Messages & Items ({allMessages.length})
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="followups" className="mt-4">
                        <div className="bg-surface-raised/30 rounded-lg border border-border-subtle">
                          <Table>
                            <TableHeader>
                              <TableRow className="border-border-subtle hover:bg-transparent">
                                <TableHead className="text-text-secondary font-medium w-8"></TableHead>
                                <TableHead className="text-text-secondary font-medium">Platform</TableHead>
                                <TableHead className="text-text-secondary font-medium">Priority</TableHead>
                                <TableHead className="text-text-secondary font-medium">Message</TableHead>
                                <TableHead className="text-text-secondary font-medium">Sender</TableHead>
                                <TableHead className="text-text-secondary font-medium">Time</TableHead>
                                <TableHead className="text-text-secondary font-medium">Action Menu</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {followUps.map(item => <TableRow key={item.id} className={`border-border-subtle hover:bg-surface-raised/20 cursor-pointer ${selectedFollowUpId === item.id ? 'bg-accent-primary/10 border-l-4 border-l-accent-primary' : ''}`} onClick={() => {
                            setSelectedFollowUpId(item.id);
                            setSelectedMessage({
                              ...item,
                              subject: "Follow-up Required",
                              fullMessage: `This is a follow-up item requiring your attention.\n\n${item.message}`,
                              from: item.sender,
                              relevancy: item.priority === "High" ? "Requires immediate attention" : "Review when convenient",
                              reasoning: "Flagged based on sender importance and content keywords."
                            });
                          }}>
                                  <TableCell className="w-8" onClick={e => e.stopPropagation()}>
                                    <Checkbox checked={checkedFollowUps.has(item.id)} onCheckedChange={() => handleFollowUpCheck(item.id)} className="h-4 w-4" />
                                  </TableCell>
                                  <TableCell>
                                    <div className={`w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold ${item.platform === 'S' ? 'bg-purple-600' : item.platform === 'G' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                      {item.platform}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <PriorityBadge item={item} onPriorityChange={handlePriorityChange} />
                                  </TableCell>
                                  <TableCell className="pr-4">
                                    <p className="text-sm text-text-primary line-clamp-2 leading-relaxed">
                                      {item.message}
                                    </p>
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {item.sender}
                                  </TableCell>
                                  <TableCell className="text-sm text-text-secondary">
                                    {item.time}
                                  </TableCell>
                                  <TableCell>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                          <span className="sr-only">Actions</span>
                                          <ChevronDown className="h-3 w-3" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(item.platform === 'S' ? 'https://slack.com' : 'https://gmail.com', '_blank');
                                    }}>
                                          {item.actionType || 'Open'}
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                                </TableRow>)}
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>}

              {!selectedBrief && !selectedCalendarItem && !isHomeSelected && leftRailTab !== 'followups' && <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-text-primary mb-2">No upcoming meetings for today</h3>
                    <p className="text-text-secondary">Select a brief or calendar item from the left panel to view details</p>
                  </div>
                </div>}
            </div>
          </div>
        </div>

        {/* Right Panel - Only show when there's content */}
        {!rightPanelCollapsed && (selectedMessage || selectedTranscript) ? <div className="w-80 h-full border-l border-border-subtle bg-surface/50 backdrop-blur-sm flex flex-col">
            <div className="flex-1 overflow-hidden">
              <ActionItemsPanel onToggleCollapse={() => setRightPanelCollapsed(true)} selectedMessage={selectedMessage} onCloseMessage={() => {
            setSelectedMessage(null);
            setRightPanelCollapsed(true);
          }} selectedTranscript={selectedTranscript} onCloseTranscript={() => {
            setSelectedTranscript(null);
            setPlayingBrief(null);
            setRightPanelCollapsed(true);
          }} />
            </div>
          </div> : null}
      </div>

      {/* Fixed Audio Player */}
      <AudioPlayer briefId={playingBrief} briefName={playingBrief ? allBriefs.find(b => b.id === playingBrief)?.name : undefined} briefTime={playingBrief ? allBriefs.find(b => b.id === playingBrief)?.timeCreated : undefined} onClose={() => setPlayingBrief(null)} />

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
          {selectedFollowUp && <div className="space-y-6">
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
                  <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-3 py-2 text-sm flex items-center gap-2">
                    <Kanban className="h-4 w-4" />
                    Add to Asana
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent border border-border-subtle text-text-primary hover:bg-surface-raised/30 rounded-full px-3 py-2 text-sm flex items-center gap-2">
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
                <Button className="w-full bg-accent-primary hover:bg-accent-primary/90 text-white py-3 rounded-lg flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  Open in Gmail
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Priority Change Confirmation Modal */}
      <Dialog open={showPriorityConfirmModal} onOpenChange={setShowPriorityConfirmModal}>
        <DialogContent className="bg-surface border-border-subtle max-w-2xl">
          {priorityChangeData && <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold text-text-primary">Why don't you want to see this?</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPriorityConfirmModal(false)} className="h-6 w-6 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Priority Change Description */}
              <div className="bg-surface-raised/30 rounded-lg p-4 border border-border-subtle">
                <h3 className="text-lg font-medium text-text-primary mb-2">{priorityChangeData.title}</h3>
                <p className="text-sm text-text-secondary">
                  Priority changed from {priorityChangeData.oldPriority} to {priorityChangeData.newPriority}
                </p>
              </div>

              {/* Radio Options */}
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

                <div className="flex items-center space-x-3 p-4 bg-surface-raised/20 rounded-lg border border-border-subtle">
                  <RadioGroupItem value="sender" id="sender" />
                  <div className="flex-1">
                    <Label htmlFor="sender" className="text-text-primary font-medium cursor-pointer">
                      Snooze messages from {priorityChangeData.itemData.sender}
                    </Label>
                    <p className="text-sm text-text-secondary">Hide future action items from this person</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-surface-raised/20 rounded-lg border border-border-subtle">
                  <RadioGroupItem value="topic" id="topic" />
                  <div className="flex-1">
                    <Label htmlFor="topic" className="text-text-primary font-medium cursor-pointer">
                      Mark this topic as unimportant
                    </Label>
                    <p className="text-sm text-text-secondary">Hide similar action items in the future</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-surface-raised/20 rounded-lg border border-border-subtle">
                  <RadioGroupItem value="other" id="other" />
                  <div className="flex-1">
                    <Label htmlFor="other" className="text-text-primary font-medium cursor-pointer">
                      Other reason
                    </Label>
                    <p className="text-sm text-text-secondary">Tell us why you don't want to see this</p>
                  </div>
                </div>
              </RadioGroup>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowPriorityConfirmModal(false)} className="flex-1 bg-transparent border-border-subtle text-text-primary hover:bg-surface-raised/30">
                  Cancel
                </Button>
                <Button onClick={() => {
              setShowPriorityConfirmModal(false);
              setPriorityChangeData(null);
              setShowPriorityConfirmModal(false);
            }} className="flex-1 bg-accent-primary hover:bg-accent-primary/90 text-white">
                  Snooze Forever
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>

      {/* Instructions Drawer */}
      <Drawer open={showInstructionsDrawer} onOpenChange={setShowInstructionsDrawer}>
        <DrawerContent className="bg-surface border-border-subtle">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="text-text-primary">Meeting Instructions</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-6 space-y-4">
            <div>
              <Label className="text-sm font-medium text-text-primary mb-2 block">
                Instructions for your proxy
              </Label>
              <Input
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="Add any specific instructions..."
                className="bg-surface-raised border-border-subtle text-text-primary"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowInstructionsDrawer(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={saveNotes} className="flex-1 bg-accent-primary hover:bg-accent-primary/90">
                Save
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

    </div>;
};
export default React.memo(HomeView);