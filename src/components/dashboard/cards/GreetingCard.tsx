import React from 'react';
import { Button } from '@/components/ui/button';
import SignalSweepBar from '../../visuals/SignalSweepBar';

interface GreetingCardProps {
  userStatus: 'active' | 'away' | 'focus' | 'vacation';
  onBriefMe: () => void;
  onStatusChange?: (status: 'active' | 'away' | 'focus' | 'vacation') => void;
}

const GreetingCard = ({ userStatus, onBriefMe, onStatusChange }: GreetingCardProps) => {
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
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
      default:
        return "I'm here with you — let's make the most of today.";
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'vacation': return 'OOO';
      case 'focus': return 'Focus';
      case 'away': return 'Offline';
      default: return 'Active';
    }
  };

  const getBriefButtonLabel = (status: string) => {
    switch (status) {
      case 'active':
        return "Brief Me";
      case 'away':
        return "Get Catch-Up Brief";
      case 'focus':
        return "Get Brief Anyway";
      case 'vacation':
        return "Preview OOO Brief";
      default:
        return "Brief Me";
    }
  };

  return (
    <div className="bg-brand-600 rounded-xl p-6 mb-6 border border-border-subtle">
      {/* Greeting and Status Message */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
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
                {getStatusLabel(userStatus)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <span>Next brief at 12:30 PM</span>
              <button 
                className="text-brand-300 hover:text-brand-200 underline ml-1"
                onClick={onBriefMe}
              >
                Get it now
              </button>
            </div>
          </div>
        </div>

        {/* Brief Me Button */}
        <Button
          onClick={onBriefMe}
          className="rounded-full px-6"
        >
          {getBriefButtonLabel(userStatus)}
        </Button>
      </div>

      {/* Signal Sweep Bar */}
      <SignalSweepBar 
        className="w-full" 
        height={5} 
        anchors={["#1B5862", "#277F64", "#4FAF83"]} 
        background="transparent" 
        thickness={2} 
        status={userStatus === 'active' ? 'active' : userStatus === 'focus' ? 'focused' : userStatus === 'vacation' ? 'ooo' : userStatus === 'away' ? 'offline' : 'active'} 
      />
    </div>
  );
};

export default GreetingCard;