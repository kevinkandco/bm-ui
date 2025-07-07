import React, { useState, useEffect, useCallback } from "react";
import {
  Calendar,
  Clock,
  Mic,
  Users,
  ChevronDown,
  Pencil,
  BookOpen,
  Info,
  Circle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import MeetingDetailsPanel from "./MeetingDetailsPanel";
import { CalendarEvent, CalenderData, Meeting } from "../types";
import { useApi } from "@/hooks/useApi";
import { Collapsible } from "@radix-ui/react-collapsible";
import {
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { convertToMeetings } from "@/lib/utils";

interface CalenderSectionProps {
  calendarData: CalenderData;
  onViewAllSchedule: (isPast: boolean) => void;
}

const CalendarSection = ({
  calendarData,
  onViewAllSchedule,
}: CalenderSectionProps) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [upcomingMeetings, setUpcomingMeetings] = useState<Meeting[]>([]);

  const [showInstructionsDrawer, setShowInstructionsDrawer] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [tempNotes, setTempNotes] = useState("");
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeetingForDetails, setSelectedMeetingForDetails] =
    useState<Meeting | null>(null);
  const [upcomingOpen, setUpcomingOpen] = useState(false);
  const { call } = useApi();

  // Check if any meetings are within 2 hours
  // const hasUpcomingMeetings = meetings.some(m => m.minutesUntil < 120);
  const hasUpcomingMeetings = meetings.length > 0;
  const nextMeeting = meetings.find((m) => m.minutesUntil > 0);
  const otherMeetings = meetings.filter(
    (m) => m.minutesUntil < 120 && m.id !== nextMeeting?.id
  );

  useEffect(() => {
    if (!calendarData || calendarData?.today.length === 0) return;

    const meetingsToday = convertToMeetings(calendarData?.today);
    const upcomingMeetings = convertToMeetings(calendarData?.upcoming);

    setMeetings(meetingsToday);
    setUpcomingMeetings(upcomingMeetings);
  }, [calendarData]);

  // Get all meetings for schedule (sorted by time)
  const allMeetings = [...meetings].sort((a, b) => {
    // Convert time to minutes for sorting
    const timeToMinutes = (timeStr: string) => {
      const [time, period] = timeStr.split(" ");
      const [hours, minutes] = time.split(":").map(Number);
      const hours24 =
        period === "PM" && hours !== 12
          ? hours + 12
          : period === "AM" && hours === 12
          ? 0
          : hours;
      return hours24 * 60 + (minutes || 0);
    };

    return timeToMinutes(a.time) - timeToMinutes(b.time);
  });

  const toggleProxy = (meetingId: string) => {
    setMeetings((prev) =>
      prev.map((meeting) =>
        meeting.id === meetingId
          ? { ...meeting, hasProxy: !meeting.hasProxy }
          : meeting
      )
    );
  };

  const openInstructionsDrawer = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setTempNotes(meeting.proxyNotes || "");
    setShowInstructionsDrawer(true);
  };

  const saveNotes = useCallback(async () => {
    const response = await call("post", "/calendar/proxy-note", {
      body: {
        id: selectedMeeting?.id,
        proxy_note: tempNotes,
      },
      showToast: true,
      toastTitle: "Failed to save notes",
      toastDescription: "Something went wrong. Please try again.",
      returnOnFailure: false,
    });

    if (!response) return;

    if (selectedMeeting) {
      setMeetings((prev) =>
        prev.map((meeting) =>
          meeting.id === selectedMeeting.id
            ? {
                ...meeting,
                proxyNotes: tempNotes,
                hasNotes: tempNotes.trim().length > 0,
              }
            : meeting
        )
      );
    }
    setShowInstructionsDrawer(false);
    setSelectedMeeting(null);
    setTempNotes("");
  }, [selectedMeeting, tempNotes, call]);

  const openMeetingDetails = (meeting: Meeting) => {
    const meetingWithDetails = {
      ...meeting,
      context: {
        relevantEmails: ["Parenting Schedule Emails"],
        interests: ["Tennis Newsletters"],
        weeklyCheckIns: ["Weekly Check-Ins"],
      },
      preparationPoints: [
        "Focus on Practicality",
        "Personalization",
        "Clarity and Structure",
      ],
      suggestedAgenda: ["Introduction", "Key Features"],
    };
    setSelectedMeetingForDetails(meetingWithDetails);
    setShowMeetingDetails(true);
  };

  const getAttendanceText = (
    meeting: Meeting,
    userJoining: boolean = false
  ) => {
    if (meeting.hasProxy && userJoining) {
      return "1 + Proxy attending";
    } else if (meeting.hasProxy) {
      return "Proxy attending";
    } else {
      return `${meeting.attendees.length} attending`;
    }
  };

  // if (!hasUpcomingMeetings) {
  //   return (
  //     <div className="w-full">
  //       <div className="text-center py-6">
  //         <Calendar className="w-8 h-8 mx-auto mb-3 text-text-secondary" />
  //         <p className="text-sm text-text-secondary">No meetings soon</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <TooltipProvider>
      <div className="w-full space-y-4">
        {/* Upcoming header */}
        <h3 className="text-sm font-medium text-text-primary">Upcoming</h3>

        {/* Next Meeting Card - Reverted to original version with outline */}
        {nextMeeting ? (
          <Card
            className="w-full rounded-xl border border-border-subtle cursor-pointer hover:shadow-md transition-shadow"
            style={{
              background:
                "linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)",
            }}
            onClick={() => openMeetingDetails(nextMeeting)}
          >
            <CardContent className="p-4">
              <div className="bg-surface-overlay/50 rounded-xl p-4">
                {/* Header with time and chips */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-1 break-all">
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
                          Proxy will record, transcribe, and send a brief to you
                          only.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="mb-3">
                  <div className="flex items-start gap-2">
                    <p className="text-xs text-text-secondary flex-1 break-all">
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
                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
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
                      <DropdownMenuContent
                        align="end"
                        className="bg-surface border-border-subtle"
                      >
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
        ) : (
          <Card
            className="w-full rounded-xl border border-border-subtle cursor-pointer hover:shadow-md transition-shadow"
            style={{
              background:
                "linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)",
            }}
          >
            <CardContent className="p-4">
              <div className="bg-surface-overlay/50 rounded-xl p-4">
                <h4 className="text-sm font-medium text-text-primary tracking-wide">
                  No upcoming meetings for today
                </h4>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Schedule section with header above */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-text-primary">Schedule</h3>
          <Card
            className="w-full rounded-xl shadow-none border-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(31, 36, 40, 0.4) 0%, rgba(43, 49, 54, 0.4) 100%)",
              boxShadow: "none",
            }}
          >
            <CardContent className="p-4">
              <h3 className="text-sm font-medium text-white-text/80 px-1 mb-2">
                Today's Schedule
              </h3>
              <div className="space-y-0">
                {allMeetings.map((meeting, index) => {
                  const isPast = meeting.minutesUntil < 0;
                  const isNext = meeting.id === nextMeeting?.id;

                  return (
                    <div key={meeting.id} className="relative">
                      {/* Timeline connector */}
                      {index > 0 && (
                        <div
                          className={`absolute left-16 top-0 w-0.5 h-4 ${
                            allMeetings[index - 1].minutesUntil < 0
                              ? "bg-red-500"
                              : "bg-border-subtle"
                          }`}
                        />
                      )}

                      <div
                        className={`flex items-center gap-4 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors ${
                          isNext ? "opacity-100" : "opacity-80"
                        }`}
                        onClick={() => openMeetingDetails(meeting)}
                      >
                        {/* Time */}
                        <div className="text-sm text-text-secondary min-w-[100px] font-mono">
                          {meeting.time}
                        </div>

                        {/* Title */}
                        <div className="flex-1">
                          <span
                            className={`text-sm ${
                              isPast
                                ? "text-text-secondary"
                                : "text-text-primary"
                            }`}
                          >
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
                      {meeting.minutesUntil < 0 &&
                        allMeetings[index + 1]?.minutesUntil >= 0 && (
                          <div className="absolute left-0 right-0 top-full">
                            <div className="h-0.5 bg-red-500 w-full" />
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
              <Separator className="my-3 bg-white-text/10" />

              {
                <div className="pt-2">
                  <Collapsible
                    open={upcomingOpen}
                    onOpenChange={setUpcomingOpen}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full text-left">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white-text/80 px-1">
                          Upcoming
                        </h3>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 text-white-text/60 transition-transform duration-200 ${
                          upcomingOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 pt-2">
                      <div className="space-y-0">
                        {upcomingMeetings.map((meeting, index) => {
                          return (
                            <div key={meeting.id} className="relative">
                              <div
                                className={
                                  "flex items-center gap-4 py-3 cursor-pointer hover:bg-white/5 rounded-lg transition-colors opacity-100"
                                }
                                onClick={() => openMeetingDetails(meeting)}
                              >
                                {/* Time */}
                                <div className="text-sm text-text-secondary min-w-[100px] font-mono">
                                  {meeting.date} {meeting.time}
                                </div>

                                {/* Title */}
                                <div className="flex-1">
                                  <span className={"text-sm text-text-primary"}>
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
                            </div>
                          );
                        })}
                        <div className="flex items-center justify-end w-full">
                          <Button
                            onClick={() => onViewAllSchedule(false)}
                            variant="ghost"
                            size="sm"
                            className="text-xs text-white-text/60 hover:text-white-text hover:bg-white/10 h-auto p-2 rounded-lg"
                          >
                            View all
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Separator className="mt-2 my-3 bg-white-text/10" />
                </div>
              }

              <div className="space-y-2">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-sm font-medium text-white-text/80 px-1">
                    Past Schedule
                  </h3>
                  <Button
                    onClick={() => onViewAllSchedule(true)}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-white-text/60 hover:text-white-text hover:bg-white/10 h-auto p-2 rounded-lg"
                  >
                    View all
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Instructions Drawer */}
      <Drawer
        open={showInstructionsDrawer}
        onOpenChange={setShowInstructionsDrawer}
      >
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
