import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Video, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

interface CalendarPageProps {
  meetings: Meeting[];
  onToggleProxy: (meetingId: string) => void;
  onOpenInstructionsDrawer: (meeting: Meeting) => void;
  onOpenMeetingDetails: (meeting: Meeting) => void;
  getAttendanceText: (meeting: Meeting, userJoining?: boolean) => string;
}

const CalendarPage = ({ 
  meetings, 
  onToggleProxy, 
  onOpenInstructionsDrawer, 
  onOpenMeetingDetails,
  getAttendanceText 
}: CalendarPageProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get today's date info
  const today = new Date();
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const currentMonth = monthNames[selectedDate.getMonth()];
  const currentYear = selectedDate.getFullYear();
  const currentDay = dayNames[selectedDate.getDay()];
  const currentDate = selectedDate.getDate();

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setSelectedDate(new Date());
    } else if (direction === 'prev') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    }
  };

  // Filter meetings for upcoming (next 3)
  const upcomingMeetings = meetings.filter(m => m.minutesUntil >= 0).slice(0, 3);
  const hasUpcomingMeetings = upcomingMeetings.length > 0;

  // Generate timeline hours
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    const time12 = hour === 0 ? '12:00 AM' : 
                  hour < 12 ? `${hour}:00 AM` : 
                  hour === 12 ? '12:00 PM' : 
                  `${hour - 12}:00 PM`;
    timeSlots.push({ hour, time12, time24: `${hour.toString().padStart(2, '0')}:00` });
  }

  const getMeetingPosition = (time: string) => {
    const [timeStr, period] = time.split(' ');
    const [hours, minutes] = timeStr.split(':').map(Number);
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    return hour24 + (minutes || 0) / 60;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with Breadcrumb */}
      <div className="p-6 pb-4">
        {/* Breadcrumb Navigation */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-text-secondary hover:text-text-primary cursor-pointer">Dashboard</span>
            <span className="text-text-secondary">›</span>
            <span className="text-text-primary">Calendar</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-text-primary">Your Calendar</h1>
          
          {/* Date Navigation */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateDate('prev')}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateDate('today')}
              className="px-3 h-8 text-sm font-medium"
            >
              Today
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigateDate('next')}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Month/Year Display */}
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-text-secondary" />
          <span className="text-lg font-medium text-text-primary">
            {currentDay}, {currentMonth} {currentDate}, {currentYear}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-6 space-y-6">
        {/* Upcoming Meetings Card */}
        <DashboardCard className="bg-surface-raised/30 shadow-sm border-border-subtle">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
            
            {hasUpcomingMeetings ? (
              <div className="space-y-4">
                {upcomingMeetings.map((meeting) => (
                  <div key={meeting.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {meeting.time}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {meeting.duration}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">
                          {meeting.title}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {getAttendanceText(meeting, true)}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-text-secondary mx-auto mb-3 opacity-50" />
                <h3 className="text-base font-medium text-text-primary mb-1">
                  No upcoming meetings today
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Take the time to focus on what matters most.
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm">
                    Review This Week
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Event
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Full Day Schedule */}
        <DashboardCard className="bg-surface-raised/30 shadow-sm border-border-subtle mb-6">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Today's Schedule</h2>
            
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-16 top-0 bottom-0 w-px bg-border-subtle"></div>
              
              {timeSlots.map((slot, index) => {
                const meetingsAtThisHour = meetings.filter(meeting => {
                  const meetingHour = Math.floor(getMeetingPosition(meeting.time));
                  return meetingHour === slot.hour;
                });

                const isPast = slot.hour < new Date().getHours();
                const isAMPMBoundary = slot.hour === 0 || slot.hour === 12;

                return (
                  <div key={slot.hour} className="relative flex items-start min-h-[60px]">
                    {/* Time label */}
                    <div className={cn(
                      "w-14 text-right pr-4 text-xs font-medium mt-1",
                      isPast ? "text-text-secondary opacity-60" : "text-text-secondary",
                      isAMPMBoundary && "text-text-primary font-semibold"
                    )}>
                      {slot.time12}
                    </div>

                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute left-16 w-2 h-2 rounded-full -translate-x-1/2 mt-1.5",
                      meetingsAtThisHour.length > 0 
                        ? "bg-accent-primary" 
                        : isPast 
                          ? "bg-border-subtle opacity-60" 
                          : "bg-border-subtle"
                    )}></div>

                    {/* Meeting content */}
                    <div className="flex-1 pl-8">
                      {meetingsAtThisHour.map((meeting) => (
                        <div 
                          key={meeting.id} 
                          className={cn(
                            "bg-surface-raised/40 rounded-lg p-4 mb-2 border border-border-subtle cursor-pointer hover:bg-surface-raised/60 transition-colors",
                            isPast && "opacity-60"
                          )}
                          onClick={() => onOpenMeetingDetails(meeting)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className={cn(
                              "font-medium text-sm",
                              isPast ? "text-text-secondary" : "text-text-primary"
                            )}>
                              {meeting.title}
                            </h3>
                            <div className="flex items-center gap-2">
                              {meeting.hasProxy && (
                                <Badge variant="secondary" className="text-xs">
                                  Proxy
                                </Badge>
                              )}
                              {meeting.isRecording && (
                                <Badge variant="outline" className="text-xs text-red-400 border-red-400">
                                  Recording
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-text-secondary">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{meeting.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{getAttendanceText(meeting)}</span>
                            </div>
                          </div>

                          {!isPast && (
                            <div className="flex justify-end mt-3">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs">
                                <Video className="h-3 w-3 mr-1" />
                                Join
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default CalendarPage;