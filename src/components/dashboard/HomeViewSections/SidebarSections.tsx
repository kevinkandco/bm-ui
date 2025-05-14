
import React from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextBriefSectionProps {
  onUpdateSchedule: () => void;
}

export const NextBriefSection = React.memo(({ onUpdateSchedule }: NextBriefSectionProps) => {
  return (
    <div>
      <h2 className="text-heading-md text-text-headline flex items-center mb-4">
        <Clock className="mr-2 h-5 w-5 text-icon" />
        Next Brief
      </h2>
      <div className="border border-divider rounded-md p-4 bg-card/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-body font-medium text-text-headline">Midday Brief</h3>
            <p className="text-xs text-text-secondary">Today at 12:30 PM</p>
          </div>
          <Calendar className="h-5 w-5 text-icon" />
        </div>
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={onUpdateSchedule}
          >
            Update Schedule
          </Button>
        </div>
      </div>
    </div>
  );
});

export const UpcomingMeetingsSection = React.memo(() => {
  const meetings = [
    { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
    { time: "1:30 PM", title: "Product Review", participants: 6 },
    { time: "3:00 PM", title: "Client Call", participants: 2 }
  ];

  return (
    <div>
      <h2 className="text-heading-md text-text-headline flex items-center mb-4">
        <Calendar className="mr-2 h-5 w-5 text-icon" />
        Upcoming Meetings
      </h2>
      <div className="space-y-row-gap">
        {meetings.map((meeting, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border border-divider rounded-md bg-card/30">
            <div className="rounded p-1.5 h-8 w-8 flex items-center justify-center border border-divider bg-card">
              <Calendar className="h-4 w-4 text-icon" />
            </div>
            <div className="flex-1">
              <p className="text-body font-medium text-text-headline">{meeting.title}</p>
              <div className="flex items-center justify-between mt-1">
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
