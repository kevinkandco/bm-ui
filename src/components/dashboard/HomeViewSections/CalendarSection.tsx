
import React, { useState } from "react";
import { Calendar, Clock, Mic, Users, ChevronDown, Pencil, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerClose } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: number;
  briefing: string;
  hasProxy: boolean;
  hasNotes: boolean;
  proxyNotes?: string;
  summaryReady: boolean;
  isRecording: boolean;
  minutesUntil: number;
}

const CalendarSection = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Product Strategy Review",
      time: "2:00 PM",
      duration: "45 min",
      attendees: 6,
      briefing: "Quarterly product roadmap discussion and feature prioritization",
      hasProxy: false,
      hasNotes: false,
      summaryReady: false,
      isRecording: false,
      minutesUntil: 45
    },
    {
      id: "2", 
      title: "Client Onboarding Call",
      time: "3:30 PM",
      duration: "30 min",
      attendees: 3,
      briefing: "New client setup and requirements gathering",
      hasProxy: true,
      hasNotes: true,
      proxyNotes: "Focus on technical requirements and timeline",
      summaryReady: false,
      isRecording: true,
      minutesUntil: 105
    }
  ]);

  const [showInstructionsDrawer, setShowInstructionsDrawer] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Check if any meetings are within 2 hours
  const hasUpcomingMeetings = meetings.some(m => m.minutesUntil < 120);

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

  const getAttendanceText = (meeting: Meeting, userJoining: boolean = false) => {
    if (meeting.hasProxy && userJoining) {
      return "1 + Proxy attending";
    } else if (meeting.hasProxy) {
      return "Proxy attending";
    } else {
      return `${meeting.attendees} attending`;
    }
  };

  if (!hasUpcomingMeetings) {
    return (
      <Card className="w-full rounded-xl shadow-none border-0" style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}>
        <CardContent className="p-4">
          <div className="text-center py-6">
            <Calendar className="w-8 h-8 mx-auto mb-3 text-text-secondary" />
            <p className="text-sm text-text-secondary">No meetings soon</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full rounded-xl shadow-none border-0" style={{
        background: 'linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)',
        boxShadow: 'none'
      }}>
        <CardContent className="p-3">
          <div className="space-y-3">
            {meetings
              .filter(meeting => meeting.minutesUntil < 120)
              .map((meeting, index) => (
                <div key={meeting.id} className="relative">
                  <div className="bg-surface-overlay/50 rounded-xl p-4 border border-border-subtle">
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
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs text-red-400">REC</span>
                          </div>
                        )}
                        
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={() => toggleProxy(meeting.id)}
                              variant={meeting.hasProxy ? "default" : "outline"}
                              size="sm"
                              className={`h-6 px-2 text-xs rounded-full ${
                                meeting.hasProxy 
                                  ? "bg-green-600 text-white hover:bg-green-700" 
                                  : "border-text-secondary text-text-secondary hover:border-green-600 hover:text-green-600"
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

                    {/* Briefing with notes button */}
                    <div className="mb-3">
                      <div className="flex items-start gap-2">
                        <p className="text-xs text-text-secondary flex-1">
                          {meeting.briefing}
                        </p>
                        <Button
                          onClick={() => openInstructionsDrawer(meeting)}
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
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          className={`h-7 px-3 text-xs rounded-l-lg rounded-r-none ${
                            meeting.hasProxy 
                              ? "bg-surface text-text-secondary hover:bg-surface" 
                              : "bg-accent-primary text-white hover:bg-accent-primary/90"
                          }`}
                          disabled={meeting.hasProxy}
                        >
                          Join Live
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              className={`h-7 w-6 px-0 rounded-r-lg rounded-l-none border-l border-l-white/20 ${
                                meeting.hasProxy 
                                  ? "bg-surface text-text-secondary hover:bg-surface" 
                                  : "bg-accent-primary text-white hover:bg-accent-primary/90"
                              }`}
                            >
                              <ChevronDown className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-surface border-border-subtle">
                            <DropdownMenuItem 
                              onClick={() => toggleProxy(meeting.id)}
                              className="text-text-primary hover:bg-white/5"
                            >
                              Send Proxy Instead
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Timeline accent line */}
                    {meeting.hasProxy && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-xl" />
                    )}
                  </div>
                  
                  {index < meetings.filter(m => m.minutesUntil < 120).length - 1 && (
                    <Separator className="mt-3 bg-border-subtle" />
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

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
    </TooltipProvider>
  );
};

export default React.memo(CalendarSection);
