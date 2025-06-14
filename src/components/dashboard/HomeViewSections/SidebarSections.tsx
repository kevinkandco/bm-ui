
import React from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";

interface NextBriefSectionProps {
  onUpdateSchedule: () => void;
}

export const NextBriefSection = React.memo(({ onUpdateSchedule }: NextBriefSectionProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleUpdateSchedule = () => {
    navigate("/dashboard/settings", { state: { activeSection: "brief-config" } });
  };
  
  return (
    <div>
      <h2 className="text-text-primary text-base md:text-lg flex items-center mb-2 md:mb-3">
        <Clock className="mr-2 h-4 w-4 md:h-5 md:w-5 text-accent-primary" />
        Next Brief
      </h2>
      <div className="border-b border-border-subtle pb-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-sm md:text-base text-text-primary">Midday Brief</h3>
            <p className="text-xs text-text-secondary">Today at 12:30 PM</p>
          </div>
          <Calendar className="h-4 w-4 md:h-5 md:w-5 text-accent-primary" />
        </div>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            className="w-full text-text-primary border-border-subtle hover:bg-surface-raised/20 text-xs md:text-sm"
            onClick={handleUpdateSchedule}
          >
            Update Schedule
          </Button>
        </div>
      </div>
    </div>
  );
});

export const UpcomingMeetingsSection = React.memo(() => {
  const isMobile = useIsMobile();
  const meetings = [
    { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
    { time: "1:30 PM", title: "Product Review", participants: 6 },
    { time: "3:00 PM", title: "Client Call", participants: 2 }
  ];

  return (
    <div>
      <h2 className="text-base md:text-lg text-text-primary flex items-center mb-2 md:mb-3">
        <Calendar className="mr-2 h-4 w-4 md:h-5 md:w-5 text-accent-primary" />
        Upcoming Meetings
      </h2>
      <div className="space-y-1 md:space-y-2">
        {meetings.map((meeting, i) => (
          <div key={i} className="flex items-start gap-2 md:gap-3 py-2 border-b border-border-subtle">
            <div className="rounded p-1 md:p-1.5 h-6 w-6 md:h-8 md:w-8 flex items-center justify-center border border-border-subtle bg-surface-overlay">
              <Calendar className="h-3 w-3 md:h-4 md:w-4 text-accent-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-xs md:text-sm text-text-primary">{meeting.title}</p>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-text-secondary">{meeting.time}</span>
                <span className="text-xs text-text-secondary">{meeting.participants} attendees</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
