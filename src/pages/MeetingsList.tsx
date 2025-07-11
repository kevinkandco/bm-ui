
import React from "react";
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
            <p className="text-text-secondary mt-1">Schedule and manage your meetings</p>
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
          </div>
        </div>

        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Upcoming Meetings</h2>
            
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex">
                      <div className="h-10 w-10 rounded-xl bg-accent-primary/20 flex items-center justify-center mr-4">
                        <Video className="h-5 w-5 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary text-lg">{meeting.title}</h3>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-text-secondary">
                            <Calendar className="h-4 w-4 inline mr-1.5" /> 
                            <span>{meeting.date}, {meeting.time}</span>
                          </div>
                          <div className="flex items-center text-sm text-text-secondary">
                            <Users className="h-4 w-4 inline mr-1.5" /> 
                            <span>{meeting.participants} participants</span>
                          </div>
                          <div className="flex items-center text-sm text-text-secondary">
                            <Clock className="h-4 w-4 inline mr-1.5" /> 
                            <span>{meeting.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Button size="sm" variant="default">Join</Button>
                      <Button size="sm" variant="outline" className="w-full">Details</Button>
                    </div>
                  </div>
                </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default MeetingsList;
