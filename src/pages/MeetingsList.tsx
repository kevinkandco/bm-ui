import React, { useCallback, useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  Video,
  Plus,
  Calendar,
  Clock,
  Users,
  CalendarCheck2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLocation, useNavigate } from "react-router-dom";
import { Meeting } from "@/components/dashboard/types";
import { useApi } from "@/hooks/useApi";
import { cn, convertToMeetings } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import MeetingDetailsPanel from "@/components/dashboard/HomeViewSections/MeetingDetailsPanel";
import Pagination from "@/components/dashboard/Pagination";

const MeetingsList = () => {
  const location = useLocation();
  const initialState = location.state;
  const [isPast, setIsPast] = useState(initialState?.isPast ?? true);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);
  const [selectedMeetingForDetails, setSelectedMeetingForDetails] =
    useState<Meeting | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 2,
  });
  const { toast } = useToast();
  const { call } = useApi();
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleScheduleMeeting = () => {
    toast({
      title: "Schedule Meeting",
      description: "Opening meeting scheduler form",
    });
  };

  const getCalendarData = useCallback(
    async (page = 1) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setLoading(true);
      const response = await call(
        "get",
        `/calendar/data?page=${page}&status=${isPast ? "past" : "future"}`,
        {
          showToast: true,
          toastTitle: "Failed to fetch calendar data",
          toastDescription: "Something went wrong while fetching the calendar.",
          returnOnFailure: false,
        }
      );
      if (!response && !response.data) {
        setMeetings([]);
        setLoading(false);
        return;
      }

      setPagination((prev) => ({
        ...prev,
        currentPage: response?.meta?.current_page || 1,
        totalPages: response?.meta?.last_page || 1,
      }));

      const meetingsToday = convertToMeetings(response.data);

      setMeetings(meetingsToday);
      setLoading(false);
    },
    [call, isPast]
  );

  useEffect(() => {
    getCalendarData(pagination.currentPage);
  }, [getCalendarData]);

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

  return (
    <DashboardLayout
      currentPage="meetings"
      sidebarOpen={sidebarOpen}
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Meetings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Meetings</h1>
            <p className="text-text-secondary mt-1">
              Schedule and manage your meetings
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button
              onClick={handleScheduleMeeting}
              className="rounded-full shadow-subtle hover:shadow-glow transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Schedule Meeting
            </Button>
            <Button
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
            >
              <Calendar className="mr-2 h-5 w-5" /> Calendar View
            </Button>
            <Button
              onClick={() => setIsPast(!isPast)}
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
            >
              <CalendarCheck2 className="mr-2 h-5 w-5" /> Show{" "}
              {isPast ? "Upcoming" : "Past"} Schedule
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              {isPast ? "Past" : "Upcoming"} Meetings
            </h2>

            <div className="space-y-4">
              {loading ? (
                <MeetingsSkeleton />
              ) : (
                meetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        <div className="h-10 w-10 rounded-xl bg-accent-primary/20 flex items-center justify-center mr-4">
                          <Video className="h-5 w-5 text-accent-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-text-primary text-lg">
                            {meeting.title}
                          </h3>
                          <div className="mt-1 space-y-1">
                            <div className="flex items-center text-sm text-text-secondary">
                              <Calendar className="h-4 w-4 inline mr-1.5" />
                              <span>
                                {meeting.date}, {meeting.time}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-text-secondary">
                              <Users className="h-4 w-4 inline mr-1.5" />
                              <span>
                                {meeting.attendees.length} participants
                              </span>
                            </div>
                            {/* <div className="flex items-center text-sm text-text-secondary">
                            <Clock className="h-4 w-4 inline mr-1.5" />
                            <span>{meeting.location}</span>
                          </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Button
                          disabled={isPast}
                          size="sm"
                          variant="default"
                          className={cn("w-full", isPast ? "invisible" : "")}
                        >
                          Join
                        </Button>
                        <Button
                          onClick={() => openMeetingDetails(meeting)}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={getCalendarData}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {showMeetingDetails && selectedMeetingForDetails && (
        <MeetingDetailsPanel
          meeting={selectedMeetingForDetails}
          onClose={() => {
            setShowMeetingDetails(false);
            setSelectedMeetingForDetails(null);
          }}
        />
      )}
    </DashboardLayout>
  );
};

const MeetingsSkeleton = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="p-4 h-28 rounded-xl hover:bg-white/10 animate-pulse flex justify-between"
        >
          <div className="flex">
            <div className="h-10 w-10 rounded-xl bg-accent-primary/20 flex items-center justify-center mr-4">
              <Video className="h-5 w-5 text-accent-primary" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-28 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MeetingsList;
