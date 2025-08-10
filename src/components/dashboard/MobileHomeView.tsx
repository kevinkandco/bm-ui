import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MobileStatusModal from './MobileStatusModal';

interface MobileHomeViewProps {
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onOpenBrief: (briefId: number) => void;
  onStartFocusMode?: () => void;
}

const MobileHomeView = ({ onPlayBrief, playingBrief, onOpenBrief, onStartFocusMode }: MobileHomeViewProps) => {
  const [currentDate] = useState(new Date());
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('active');

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

  const handleStatusSelect = (status: 'active' | 'focus' | 'away') => {
    setCurrentStatus(status);
    if (status === 'focus' && onStartFocusMode) {
      onStartFocusMode();
    }
  };

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Header */}
      <div className="px-6 pt-16 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Good morning, Alex
            </h1>
            <p className="text-text-secondary">
              Ready to catch up or focus?
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowStatusModal(true)}
            className="h-10 px-3 bg-surface-raised/50 hover:bg-surface-raised/80 border border-border-subtle rounded-xl"
          >
            <Target className="h-4 w-4 mr-2 text-accent-primary" />
            <span className="text-text-primary text-sm">Focus</span>
          </Button>
        </div>
      </div>

      {/* Meetings Section */}
      <div className="px-6 mb-8">
        <h2 className="text-text-primary font-semibold text-lg mb-4">Meetings</h2>
        <div className="space-y-3">
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              className="bg-surface-raised/50 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-border-subtle"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  getMeetingDotColor(meeting.color)
                )} />
                <div>
                  <div className="text-text-primary font-medium">
                    {meeting.title}
                  </div>
                  <div className="text-text-secondary text-sm">
                    {meeting.time}
                  </div>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-text-secondary" />
            </div>
          ))}
        </div>
      </div>

      {/* Briefs Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary font-semibold text-lg">Briefs</h2>
          <div className="flex items-center gap-2 bg-surface-raised/50 rounded-full px-3 py-1 border border-border-subtle">
            <ChevronLeft className="h-4 w-4 text-text-secondary" />
            <span className="text-text-primary text-sm font-medium">Today</span>
            <ChevronRight className="h-4 w-4 text-text-secondary" />
          </div>
        </div>

        {/* Brief Card */}
        <div className="bg-surface-raised/50 backdrop-blur-sm rounded-xl p-4 border border-border-subtle">
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPlayBrief(briefData.id)}
              className="h-10 w-10 p-0 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30"
            >
              <Play className="h-5 w-5 text-accent-primary fill-current" />
            </Button>
            <div>
              <div className="text-text-primary font-medium">
                {briefData.title}
              </div>
              <div className="text-text-secondary text-sm">
                {briefData.time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>{briefData.slackCount} Slack</span>
            <span>{briefData.emailCount} Emails</span>
            <span>{briefData.actionCount} Actions</span>
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-text-primary font-medium">Upcoming</h3>
            <ChevronRight className="h-5 w-5 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Status Modal */}
      <MobileStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        onSelectStatus={handleStatusSelect}
        currentStatus={currentStatus}
      />
    </div>
  );
};

export default MobileHomeView;