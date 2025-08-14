import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignalSweepBar from '../visuals/SignalSweepBar';
import MobileHeader from './MobileHeader';
interface MobileHomeViewProps {
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onOpenBrief: (briefId: number) => void;
  onStartFocusMode?: () => void;
  onBriefMe?: () => void;
  userStatus?: 'active' | 'away' | 'focus' | 'vacation' | 'offline';
  onStatusChange?: (status: 'active' | 'away' | 'focus' | 'vacation' | 'offline') => void;
}
const MobileHomeView = ({
  onPlayBrief,
  playingBrief,
  onOpenBrief,
  onStartFocusMode,
  onBriefMe,
  userStatus = 'active',
  onStatusChange
}: MobileHomeViewProps) => {
  const [currentDate] = useState(new Date());

  // Sample data
  const meetings = [{
    id: '1',
    title: 'Team Standup',
    time: 'Today at 10:00 AM',
    status: 'active',
    color: 'green'
  }, {
    id: '2',
    title: 'Product Review',
    time: 'Today at 2:00 PM',
    status: 'scheduled',
    color: 'orange'
  }];
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
  const getUserStatusDotColor = (status: 'active' | 'away' | 'focus' | 'vacation' | 'offline') => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      case 'focus':
        return 'bg-blue-500';
      case 'vacation':
        return 'bg-gray-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
    }
  };
  const getTimeOfDayGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Good morning, Alex";
    if (hour < 17) return "Good afternoon, Alex";
    return "Good evening, Alex";
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'active':
        return "I'm here with you — let's make the most of today.";
      case 'away':
        return "Step away and enjoy your day — I'll take care of the rest.";
      case 'focus':
        return "Stay in the flow — I'll handle what can wait.";
      case 'vacation':
        return "Switch off and make the most of your time away — I've got this.";
      case 'offline':
        return "Taking some time offline — I'll keep everything organized for you.";
      default:
        return "I'm here with you — let's make the most of today.";
    }
  };

  const getNextBriefInfo = () => {
    return "Next brief at 2:15 PM";
  };

  const getNextBriefAction = (status: string) => {
    switch (status) {
      case 'vacation':
        return "Preview now";
      default:
        return "Get it now";
    }
  };

  const getStatusButtons = (status: string) => {
    switch (status) {
      case 'active':
        return [
          { label: "Brief Me", variant: "default" as const, action: onBriefMe }
        ];
      case 'away':
        return [
          { label: "Get Catch-Up Brief", variant: "default" as const, action: onBriefMe }
        ];
      case 'focus':
        return [
          { label: "Exit Focus", variant: "default" as const, action: onStartFocusMode },
          { label: "Get Brief Anyway", variant: "outline" as const, action: onBriefMe }
        ];
      case 'vacation':
        return [
          { label: "Change Return Date", variant: "default" as const, action: () => {} },
          { label: "Preview OOO Brief", variant: "outline" as const, action: onBriefMe }
        ];
      default:
        return [
          { label: "Brief Me", variant: "default" as const, action: onBriefMe }
        ];
    }
  };
  return <div className="h-screen max-h-[932px] overflow-y-auto bg-brand-900 relative">
      {/* Mobile Header with Logo */}
      <MobileHeader />
      
      {/* User Greeting & Status */}
      <div className="px-6 pb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {getTimeOfDayGreeting()}
        </h1>
        <p className="text-text-secondary text-sm mb-3">
          {getStatusMessage(userStatus)}
        </p>
        
        {/* Status & Next Brief Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getUserStatusDotColor(userStatus)}`} />
            <span className="text-xs text-text-secondary capitalize">
              {userStatus === 'vacation' ? 'OOO' : userStatus === 'focus' ? 'Focus' : userStatus === 'away' ? 'Away' : userStatus === 'offline' ? 'Offline' : 'Active'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span>{getNextBriefInfo()}</span>
            <button 
              className="text-brand-300 hover:text-brand-200 underline ml-1"
              onClick={() => onBriefMe?.()}
            >
              {getNextBriefAction(userStatus)}
            </button>
          </div>
        </div>
      </div>

      {/* Signal Sweep Bar */}
      <div className="px-6 pb-6">
        <SignalSweepBar 
          className="mx-auto w-full max-w-[520px]" 
          height={12} 
          anchors={["#1B5862", "#277F64", "#4FAF83"]} 
          background="transparent" 
          thickness={3} 
          status={userStatus === 'active' ? 'active' : userStatus === 'focus' ? 'focused' : userStatus === 'vacation' ? 'ooo' : userStatus === 'away' ? 'offline' : 'active'} 
        />
      </div>

      {/* Status Action Buttons */}
      <div className="px-6 pb-6">
        <div className="flex gap-3">
          {getStatusButtons(userStatus).map((button, index) => (
            <Button
              key={index}
              variant={button.variant}
              size="sm"
              className="h-8 px-4 rounded-full"
              onClick={button.action}
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Today's Updates Section */}
      <div className="px-6">
        <div className="mb-6">
          <h2 className="text-text-primary font-semibold text-lg tracking-tight">Today's Updates</h2>
        </div>

        {/* Brief Card */}
        <div className="bg-brand-600 rounded-xl p-3 shadow-none hover:bg-white/5 transition-colors" onClick={() => onOpenBrief(briefData.id)}>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="sm" onClick={e => {
            e.stopPropagation();
            onPlayBrief(briefData.id);
          }} className="h-10 w-10 p-0 rounded-full bg-brand-300/15 hover:bg-brand-300/25 transition-all duration-200">
              <Play className="h-5 w-5 text-brand-300 fill-current" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-text-primary font-semibold text-sm leading-tight tracking-tight">
                  {briefData.title}
                </div>
                {playingBrief === briefData.id && <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-300/20 text-brand-300">Playing</span>}
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
        
      </div>

      {/* Bottom navigation spacing */}
      <div className="h-20" />

    </div>;
};
export default MobileHomeView;