import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon } from 'lucide-react';

interface Meeting {
  id: string;
  title: string;
  time: string;
  type: 'current' | 'upcoming';
  color?: string;
}

const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Team Standup',
    time: '10:00 AM',
    type: 'current',
    color: 'green'
  },
  {
    id: '2',
    title: 'Product Review',
    time: '1:30 PM',
    type: 'upcoming',
    color: 'orange'
  },
  {
    id: '3',
    title: 'Client Call',
    time: '3:00 PM',
    type: 'upcoming',
    color: 'gray'
  }
];

export const CalendarScheduleSection = () => {
  const currentMeeting = meetings.find(m => m.type === 'current');
  const upcomingMeetings = meetings.filter(m => m.type === 'upcoming');

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-500';
      case 'orange':
        return 'bg-orange-500';
      case 'gray':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white mb-4">Calendar</h2>
      
      {/* Next Meeting Section */}
      {currentMeeting && (
        <div className="p-4 rounded-lg mb-6" style={{ backgroundColor: 'rgba(14, 116, 144, 0.3)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-white/80" />
            <h3 className="text-lg font-medium text-white">Next Meeting</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xl font-semibold text-white">{currentMeeting.title}</h4>
              <p className="text-white/70 mt-1">Today at {currentMeeting.time}</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                className="bg-teal-700 hover:bg-teal-800 text-white border-0 rounded-full px-6"
                size="default"
              >
                Join Live
              </Button>
              <Button 
                variant="ghost" 
                className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-6"
                size="default"
              >
                Send Proxy
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Schedule Section */}
      <div className="p-4 rounded-lg" style={{ backgroundColor: 'rgba(14, 116, 144, 0.3)' }}>
        <div className="flex items-center gap-2 mb-4">
          <CalendarIcon className="w-5 h-5 text-white/80" />
          <h3 className="text-lg font-medium text-white">Schedule</h3>
        </div>
        
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${getColorClasses(meeting.color)}`}></div>
              <div className="flex-1">
                <div className="text-white/90 font-medium">{meeting.time}</div>
                <div className="text-white/70 text-sm">{meeting.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};