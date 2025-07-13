
import React from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Video, Plus, Calendar, Clock, Users } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

const MeetingsList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleScheduleMeeting = () => {
    toast({
      title: "Schedule Meeting",
      description: "Opening meeting scheduler form",
    });
  };

  const meetings = [
    { 
      id: 1, 
      title: "Weekly Team Sync", 
      date: "Today", 
      time: "2:00 PM - 3:00 PM",
      participants: 8,
      location: "Zoom"
    },
    { 
      id: 2, 
      title: "Product Roadmap Planning", 
      date: "Tomorrow", 
      time: "11:00 AM - 12:30 PM",
      participants: 5,
      location: "Conference Room A"
    },
    { 
      id: 3, 
      title: "Client Presentation", 
      date: "May 16, 2025", 
      time: "10:00 AM - 11:00 AM",
      participants: 12,
      location: "Google Meet"
    },
    { 
      id: 4, 
      title: "Design Review", 
      date: "May 17, 2025", 
      time: "3:30 PM - 4:30 PM",
      participants: 4,
      location: "Microsoft Teams"
    },
    { 
      id: 5, 
      title: "Quarterly Planning", 
      date: "May 20, 2025", 
      time: "9:00 AM - 12:00 PM",
      participants: 15,
      location: "Main Boardroom"
    }
  ];

  return (
    <AppLayout currentPage="meetings">
      <div className="max-w-7xl mx-auto">
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

        <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-text-primary">Meetings</h1>
            <p className="text-sm md:text-base text-text-secondary mt-1">Schedule and manage your meetings</p>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:gap-3">
            <Button 
              onClick={handleScheduleMeeting}
              className="rounded-full shadow-subtle hover:shadow-glow transition-all text-sm md:text-base"
              size="sm"
            >
              <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Schedule Meeting
            </Button>
            <Button 
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md text-sm md:text-base"
              size="sm"
            >
              <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Calendar View
            </Button>
          </div>
        </div>

        <div className="glass-card rounded-xl md:rounded-3xl overflow-hidden">
          <div className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
            
            <div className="space-y-3 md:space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-3 md:p-4 rounded-lg md:rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div className="flex gap-3">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                        <Video className="h-4 w-4 md:h-5 md:w-5 text-accent-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-medium text-text-primary text-base md:text-lg">{meeting.title}</h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-xs md:text-sm text-text-secondary">
                            <Calendar className="h-3 w-3 md:h-4 md:w-4 inline mr-1.5 flex-shrink-0" /> 
                            <span className="truncate">{meeting.date}, {meeting.time}</span>
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-text-secondary">
                            <Users className="h-3 w-3 md:h-4 md:w-4 inline mr-1.5 flex-shrink-0" /> 
                            <span>{meeting.participants} participants</span>
                          </div>
                          <div className="flex items-center text-xs md:text-sm text-text-secondary">
                            <Clock className="h-3 w-3 md:h-4 md:w-4 inline mr-1.5 flex-shrink-0" /> 
                            <span className="truncate">{meeting.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 md:space-y-2">
                      <Button size="sm" variant="default" className="flex-1 md:flex-none text-xs md:text-sm">Join</Button>
                      <Button size="sm" variant="outline" className="flex-1 md:w-full text-xs md:text-sm">Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default MeetingsList;
