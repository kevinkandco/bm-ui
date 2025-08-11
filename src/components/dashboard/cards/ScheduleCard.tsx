import React from 'react';
import { Calendar, ChevronRight, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Meeting {
  id: string;
  title: string;
  time: string;
  duration?: string;
  status: 'active' | 'scheduled';
  attendeeCount?: number;
}

interface ScheduleCardProps {
  meetings: Meeting[];
  onMeetingClick: (meeting: Meeting) => void;
  onViewAll: () => void;
}

const ScheduleCard = ({ meetings, onMeetingClick, onViewAll }: ScheduleCardProps) => {
  const getMeetingDotColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'scheduled':
        return 'bg-orange-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-brand-600 rounded-xl p-4 border border-border-subtle">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Today's Schedule</h3>
          <p className="text-xs text-text-muted">Your day at a glance.</p>
        </div>
      </div>

      <div className="space-y-2">
        {meetings.slice(0, 3).map((meeting) => (
          <div 
            key={meeting.id} 
            className="flex items-center gap-3 p-2 rounded-lg bg-surface-overlay/20 border border-border-subtle hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => onMeetingClick(meeting)}
          >
            <div className={`w-2 h-2 rounded-full ${getMeetingDotColor(meeting.status)}`} />
            <div className="h-8 w-8 rounded flex items-center justify-center bg-brand-300/15">
              <Calendar className="h-4 w-4 text-brand-300" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">{meeting.title}</h4>
              <p className="text-xs text-text-secondary">
                {meeting.time}
                {meeting.attendeeCount && ` • ${meeting.attendeeCount} attendees`}
              </p>
            </div>
            {meeting.status === 'active' && (
              <Button 
                size="sm" 
                className="h-6 px-2 rounded-full text-xs bg-green-500 hover:bg-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  // Handle join live
                }}
              >
                <Video className="h-3 w-3 mr-1" />
                Join Live
              </Button>
            )}
          </div>
        ))}
        
        {meetings.length > 3 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="w-full justify-between text-brand-300 hover:text-brand-200 hover:bg-brand-300/10"
          >
            <span className="text-xs">View all {meetings.length} events</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard;