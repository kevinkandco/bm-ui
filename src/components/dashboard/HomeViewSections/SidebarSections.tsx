
import React from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NextBriefSectionProps {
  onUpdateSchedule: () => void;
}

export const NextBriefSection = React.memo(({ onUpdateSchedule }: NextBriefSectionProps) => {
  return (
    <div>
      <h2 className="text-deep-teal text-lg flex items-center mb-3">
        <Clock className="mr-2 h-5 w-5 text-glass-blue" />
        Next Brief
      </h2>
      <div className="border border-white/40 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-deep-teal">Midday Brief</h3>
            <p className="text-xs text-deep-teal/80">Today at 12:30 PM</p>
          </div>
          <Calendar className="h-5 w-5 text-glass-blue" />
        </div>
        <div className="mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-glass-blue border-white/40 hover:bg-white/50 shadow-sm"
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
      <h2 className="text-lg text-deep-teal flex items-center mb-3">
        <Calendar className="mr-2 h-5 w-5 text-glass-blue" />
        Upcoming Meetings
      </h2>
      <div className="space-y-3">
        {meetings.map((meeting, i) => (
          <div key={i} className="flex items-start gap-3 p-3 border border-white/40 rounded-lg">
            <div className="rounded p-1.5 h-8 w-8 flex items-center justify-center border border-white/30">
              <Calendar className="h-4 w-4 text-glass-blue" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-deep-teal">{meeting.title}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-deep-teal/80">{meeting.time}</span>
                <span className="text-xs text-deep-teal/80">{meeting.participants} attendees</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
