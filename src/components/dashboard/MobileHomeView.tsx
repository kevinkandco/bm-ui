import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileHomeViewProps {
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onOpenBrief: (briefId: number) => void;
}

const MobileHomeView = ({ onPlayBrief, playingBrief, onOpenBrief }: MobileHomeViewProps) => {
  const [currentDate] = useState(new Date());

  // Sample data
  const meetings = [
    {
      id: '1',
      title: 'Team Standup',
      time: 'Today at 10:00 AM',
      status: 'active',
      color: 'green'
    },
    {
      id: '2',
      title: 'Product Review',
      time: 'Today at 2:00 PM', 
      status: 'scheduled',
      color: 'orange'
    }
  ];

  const briefData = {
    id: 1,
    title: 'Morning Brief',
    time: 'Today, 8:00 AM',
    slackCount: 12,
    emailCount: 5,
    actionCount: 4
  };

  const getMeetingDotColor = (color: string) => {
    switch (color) {
      case 'green':
        return 'bg-green-400';
      case 'orange':
        return 'bg-orange-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-700 pb-20">
      {/* Header */}
      <div className="px-6 pt-16 pb-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Good morning, Alex
        </h1>
        <p className="text-emerald-100">
          Ready to catch up or focus?
        </p>
      </div>

      {/* Meetings Section */}
      <div className="px-6 mb-8">
        <h2 className="text-white font-semibold text-lg mb-4">Meetings</h2>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getMeetingDotColor(meeting.color)
                )} />
                <div>
                  <div className="text-white font-medium">
                    {meeting.title}
                  </div>
                  <div className="text-emerald-100 text-sm">
                    {meeting.time}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-emerald-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Briefs Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Briefs</h2>
          <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
            <ChevronLeft className="h-4 w-4 text-emerald-100" />
            <span className="text-white text-sm font-medium">Today</span>
            <ChevronRight className="h-4 w-4 text-emerald-100" />
          </div>
        </div>

        {/* Brief Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlayBrief(briefData.id)}
              className="h-10 w-10 p-0 rounded-full bg-white/20 hover:bg-white/30"
            >
              <Play className="h-5 w-5 text-white fill-current" />
            </Button>
            <div>
              <div className="text-white font-medium">
                {briefData.title}
              </div>
              <div className="text-emerald-100 text-sm">
                {briefData.time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-emerald-100">
            <span>{briefData.slackCount} Slack</span>
            <span>{briefData.emailCount} Emails</span>
            <span>{briefData.actionCount} Actions</span>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Upcoming</h3>
            <ChevronRight className="h-5 w-5 text-emerald-100" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHomeView;