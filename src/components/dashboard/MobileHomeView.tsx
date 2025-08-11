import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileHomeViewProps {
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onOpenBrief: (briefId: number) => void;
  onStartFocusMode?: () => void;
  onBriefMe?: () => void;
  userStatus?: 'active' | 'away' | 'focus' | 'vacation';
}

const MobileHomeView = ({ onPlayBrief, playingBrief, onOpenBrief, onStartFocusMode, onBriefMe, userStatus = 'active' }: MobileHomeViewProps) => {
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

  const getUserStatusDotColor = (status: 'active' | 'away' | 'focus' | 'vacation') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'focus':
        return 'bg-blue-500';
      case 'vacation':
        return 'bg-gray-500';
      default:
        return 'bg-green-500';
    }
  };

  const getTimeOfDayGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Hope you're having a wonderful morning";
    if (hour < 17) return "Hope your afternoon is going well";
    return "Hope you're having a peaceful evening";
  };

  const getStatusReassurance = (status: string) => {
    switch (status) {
      case 'focus':
        return "I'll keep distractions away";
      case 'vacation':
        return "Enjoy your time away";
      case 'offline':
        return "I'll be here when you're ready";
      default:
        return "I've got you covered";
    }
  };

  return (
    <div className="h-screen max-h-[932px] overflow-y-auto bg-brand-900 relative">
      {/* Header */}
      <div className="px-6 pt-16 pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text-primary mb-1">
              Good morning, Alex
            </h1>
            <p className="text-text-secondary/80 text-sm mb-2">
              {getTimeOfDayGreeting()}
            </p>
            <p className="text-text-secondary/70">
              Ready to catch up or focus?
            </p>
            <div className="mt-2 inline-flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getUserStatusDotColor(userStatus)}`} />
              <span className="text-xs text-text-secondary capitalize">{userStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator moved inline with header */}

      {/* Today's Updates Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary font-semibold text-lg tracking-tight">Today's Updates</h2>
<Button size="sm" className="h-7 px-3 rounded-full" onClick={() => onBriefMe?.()}>
  Brief Me
</Button>
        </div>

        {/* Brief Card */}
        <div className="bg-brand-600 rounded-xl p-3 border border-border-subtle shadow-none hover:bg-white/5 transition-colors"
             onClick={() => onOpenBrief(briefData.id)}>
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onPlayBrief(briefData.id); }}
              className="h-10 w-10 p-0 rounded-full bg-brand-300/15 hover:bg-brand-300/25 transition-all duration-200"
            >
              <Play className="h-5 w-5 text-brand-300 fill-current" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-text-primary font-semibold text-sm leading-tight tracking-tight">
                  {briefData.title}
                </div>
                {playingBrief === briefData.id && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-300/20 text-brand-300 border border-brand-300/30">Playing</span>
                )}
              </div>
              <div className="text-text-secondary text-xs">
                {briefData.time}
              </div>
            </div>
          </div>
          <div className="text-text-muted text-xs">
            {briefData.slackCount} Slack • {briefData.emailCount} Emails • {briefData.actionCount} Actions
          </div>
        </div>

        {/* Empty State or Upcoming */}
        <div className="mt-12 text-center">
          <div className="text-text-primary font-medium mb-2 tracking-tight">That's it for now</div>
          <div className="text-text-muted text-sm">Enjoy your day ✨</div>
        </div>
      </div>

      {/* Bottom navigation spacing */}
      <div className="h-20" />

    </div>
  );
};

export default MobileHomeView;