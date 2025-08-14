import React from 'react';
import { ScheduleCard, ScheduleItem } from '@/components/dashboard';
import { useToast } from '@/hooks/use-toast';

interface RefactoredCalendarPageProps {
  meetings: ScheduleItem[];
  onJoinMeeting: (meeting: ScheduleItem) => void;
  onViewMeetingDetails: (meeting: ScheduleItem) => void;
  className?: string;
}

export const RefactoredCalendarPage = ({
  meetings,
  onJoinMeeting,
  onViewMeetingDetails,
  className
}: RefactoredCalendarPageProps) => {
  const { toast } = useToast();

  const handleJoinMeeting = (meeting: ScheduleItem) => {
    onJoinMeeting(meeting);
    toast({
      title: "Joining meeting",
      description: `Joining ${meeting.title}`
    });
  };

  return (
    <div className={className}>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">Calendar</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Today's Schedule
            </h2>
            <ScheduleCard
              items={meetings.filter(m => m.minutesUntil >= 0)}
              onJoin={handleJoinMeeting}
              onViewDetails={onViewMeetingDetails}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Past Meetings
            </h2>
            <ScheduleCard
              items={meetings.filter(m => m.minutesUntil < 0)}
              onJoin={handleJoinMeeting}
              onViewDetails={onViewMeetingDetails}
            />
          </div>
        </div>
      </div>
    </div>
  );
};