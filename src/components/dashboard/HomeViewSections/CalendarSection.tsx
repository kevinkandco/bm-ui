import React, { useState } from "react";
import { Calendar, Clock, Mic, Users, ChevronDown, Pencil, BookOpen, Info, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import MeetingDetailsPanel from "./MeetingDetailsPanel";

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
  context?: {
    relevantEmails?: string[];
    weeklyCheckIns?: string[];
    interests?: string[];
  };
  preparationPoints?: string[];
  suggestedAgenda?: string[];
}

const CalendarSection = () => {
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
    },
    {
      id: "4",
      title: "product planning",
      time: "4:15 PM", 
      duration: "1 hour",
      attendees: [
        { name: "Product Manager", email: "pm@company.com" },
        { name: "Engineering Lead", email: "eng@company.com" }
      ],
      briefing: "Product planning and roadmap discussion",
      aiSummary: "Strategic planning session for upcoming product features and timeline.",
      hasProxy: false,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 180
    },
    {
      id: "5",
      title: "review",
      time: "5:00 PM", 
      duration: "1 hour",
      attendees: [
        { name: "Team Lead", email: "lead@company.com" }
      ],
      briefing: "Weekly review meeting with team lead",
      aiSummary: "Regular review session to discuss progress and next steps.",
      hasProxy: true,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 225
    },
    {
      id: "6",
      title: "team standup",
      time: "5:30 PM", 
      duration: "30 min",
      attendees: [
        { name: "Development Team", email: "dev-team@company.com" }
      ],
      briefing: "Daily team standup meeting",
      aiSummary: "Quick sync on current tasks and blockers with the development team.",
      hasProxy: false,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 255
    },
    {
      id: "7",
      title: "client feedback session",
      time: "6:00 PM", 
      duration: "45 min",
      attendees: [
        { name: "Sarah Johnson", email: "sarah@client.com" },
        { name: "Mike Chen", email: "mike@client.com" }
      ],
      briefing: "Client feedback session on recent deliverables",
      aiSummary: "Gathering client feedback on recent project milestones and discussing next phases.",
      hasProxy: true,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 285
    }
  ]);

  const [showInstructionsDrawer, setShowInstructionsDrawer] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeetingForDetails, setSelectedMeetingForDetails] = useState<Meeting | null>(null);

  // Check if any meetings are within 2 hours
  const hasUpcomingMeetings = meetings.some(m => m.minutesUntil < 120);
  const nextMeeting = meetings.find(m => m.minutesUntil < 120);
  const otherMeetings = meetings.filter(m => m.minutesUntil < 120 && m.id !== nextMeeting?.id);

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

  const toggleProxy = (meetingId: string) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, hasProxy: !meeting.hasProxy }
        : meeting
    ));
  };

  const openInstructionsDrawer = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setTempNotes(meeting.proxyNotes || "");
    setShowInstructionsDrawer(true);
  };

  const saveNotes = () => {
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
  };

  const openMeetingDetails = (meeting: Meeting) => {
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
    setSelectedMeetingForDetails(meetingWithDetails);
    setShowMeetingDetails(true);
  };

  const getAttendanceText = (meeting: Meeting, userJoining: boolean = false) => {
    if (meeting.hasProxy && userJoining) {
      return "1 + Proxy attending";
    } else if (meeting.hasProxy) {
      return "Proxy attending";
    } else {
      return `${meeting.attendees.length} attending`;
    }
  };

  if (!hasUpcomingMeetings) {
    return (
      <div className="w-full">
        <div className="text-center py-6">
          <Calendar className="w-8 h-8 mx-auto mb-3 text-text-secondary" />
          <p className="text-sm text-text-secondary">No meetings soon</p>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        {/* Upcoming header */}
        <h3 className="text-sm font-medium text-text-primary">Upcoming</h3>
        
        {/* Next Meeting Card - Full Detail - No outline */}
        {nextMeeting && (
          <Card 
            className="w-full rounded-xl shadow-none border-0 cursor-pointer hover:shadow-md transition-shadow" 
            style={{
              background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
              boxShadow: 'none'
            }}
            onClick={() => openMeetingDetails(nextMeeting)}
          >
            <CardContent className="p-4">
              <div className="bg-surface-overlay/50 rounded-xl p-4">
                {/* Header with time and chips */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-1">
                      {nextMeeting.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <Clock className="w-3 h-3" />
                      {nextMeeting.time} • {nextMeeting.duration}
                    </div>
                  </div>
                  
                  {/* Top-right chips */}
                  <div className="flex items-center gap-2">
                    {nextMeeting.isRecording && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs text-red-400">REC</span>
                      </div>
                    )}
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleProxy(nextMeeting.id);
                          }}
                          variant={nextMeeting.hasProxy ? "default" : "outline"}
                          size="sm"
                          className={`h-6 px-2 text-xs rounded-full ${
                            nextMeeting.hasProxy 
                              ? "bg-green-600 text-white hover:bg-green-700" 
                              : "border-text-secondary text-text-secondary hover:border-green-600 hover:text-green-600"
                          }`}
                        >
                          {nextMeeting.hasProxy ? "Proxy On" : "Send Proxy"}
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
                      {nextMeeting.aiSummary}
                    </p>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        openInstructionsDrawer(nextMeeting);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-text-secondary hover:text-text-primary"
                    >
                      {nextMeeting.hasNotes ? (
                        <BookOpen className="w-3 h-3" />
                      ) : (
                        <Pencil className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Deliverables preview */}
                {nextMeeting.hasProxy && (
                  <div className="mb-3">
                    <p className="text-xs text-text-secondary">
                      {nextMeeting.summaryReady ? (
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
                      {getAttendanceText(nextMeeting)}
                    </span>
                  </div>

                  {/* Split button CTA */}
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      size="sm"
                      className={`h-7 px-3 text-xs rounded-l-lg rounded-r-none ${
                        nextMeeting.hasProxy 
                          ? "bg-surface text-text-secondary hover:bg-surface" 
                          : "bg-accent-primary text-white hover:bg-accent-primary/90"
                      }`}
                      disabled={nextMeeting.hasProxy}
                    >
                      Join Live
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          className={`h-7 w-6 px-0 rounded-r-lg rounded-l-none border-l border-l-white/20 ${
                            nextMeeting.hasProxy 
                              ? "bg-surface text-text-secondary hover:bg-surface" 
                              : "bg-accent-primary text-white hover:bg-accent-primary/90"
                          }`}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-surface border-border-subtle">
                        <DropdownMenuItem 
                          onClick={() => toggleProxy(nextMeeting.id)}
                          className="text-text-primary hover:bg-white/5"
                        >
                          Send Proxy Instead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule/Timeline View - Updated layout with timeline */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-text-primary">Schedule</h3>
          <Card className="w-full rounded-xl shadow-none border-0" style={{
            background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
            boxShadow: 'none'
          }}>
            <CardContent className="p-4">
              <div className="space-y-0">
                {allMeetings.map((meeting, index) => {
                  const isPast = meeting.minutesUntil < 0;
                  const isNext = meeting.id === nextMeeting?.id;
                  
                  return (
                    <div key={meeting.id} className="relative">
                      {/* Timeline connector */}
                      {index > 0 && (
                        <div className={`absolute left-16 top-0 w-0.5 h-4 ${
                          allMeetings[index - 1].minutesUntil < 0 ? 'bg-red-500' : 'bg-border-subtle'
                        }`} />
                      )}
                      
                      <div 
                        className={`flex items-center gap-4 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors ${
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
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                          )}
                          {meeting.isRecording && (
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </div>
                      </div>
                      
                      {/* Timeline indicator line - red line shows current time */}
                      {meeting.minutesUntil < 0 && allMeetings[index + 1]?.minutesUntil >= 0 && (
                        <div className="absolute left-0 right-0 top-full">
                          <div className="h-0.5 bg-red-500 w-full" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions Drawer */}
      <Drawer open={showInstructionsDrawer} onOpenChange={setShowInstructionsDrawer}>
        <DrawerContent className="bg-surface border-border-subtle">
          <DrawerHeader className="flex flex-row items-center justify-between">
            <DrawerTitle className="text-text-primary">
              Proxy Instructions - {selectedMeeting?.title}
            </DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-text-primary mb-2 block">
                Notes for your proxy:
              </label>
              <Input
                value={tempNotes}
                onChange={(e) => setTempNotes(e.target.value)}
                placeholder="e.g., Focus on technical requirements and timeline"
                className="bg-surface-overlay border-border-subtle text-text-primary"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveNotes} className="flex-1">
                Save Notes
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowInstructionsDrawer(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Meeting Details Panel */}
      {showMeetingDetails && selectedMeetingForDetails && (
        <MeetingDetailsPanel
          meeting={selectedMeetingForDetails}
          onClose={() => {
            setShowMeetingDetails(false);
            setSelectedMeetingForDetails(null);
          }}
        />
      )}
    </TooltipProvider>
  );
};

export default React.memo(CalendarSection);
