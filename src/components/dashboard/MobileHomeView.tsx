import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import MobileStatusModal from './MobileStatusModal';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface MobileHomeViewProps {
  onPlayBrief: (briefId: number) => void;
  playingBrief: number | null;
  onOpenBrief: (briefId: number) => void;
  onStartFocusMode?: () => void;
}

const MobileHomeView = ({ onPlayBrief, playingBrief, onOpenBrief, onStartFocusMode }: MobileHomeViewProps) => {
  const [currentDate] = useState(new Date());
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('online');

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

  const handleStatusSelect = (status: 'online' | 'focus' | 'vacation' | 'offline') => {
    setCurrentStatus(status);
    if (status === 'focus' && onStartFocusMode) {
      onStartFocusMode();
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'online':
        return { label: 'Online', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
      case 'focus':
        return { label: 'Focus', color: 'bg-accent-primary', textColor: 'text-accent-primary' };
      case 'vacation':
        return { label: 'Vacation', color: 'bg-orange-500', textColor: 'text-orange-400' };
      case 'offline':
        return { label: 'Offline', color: 'bg-gray-500', textColor: 'text-gray-400' };
      default:
        return { label: 'Online', color: 'bg-emerald-500', textColor: 'text-emerald-400' };
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
          </div>
        </div>
      </div>

      {/* Status Section - compact dropdown */}
      <div className="px-6 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-700/60 border border-border-subtle cursor-pointer hover:bg-brand-700/80 transition-colors">
              <div className={cn("w-2 h-2 rounded-full", getStatusConfig(currentStatus).color)} />
              <span className="text-sm text-text-secondary">{getStatusConfig(currentStatus).label}</span>
              <ChevronDown className="w-3 h-3 text-text-secondary" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            <DropdownMenuItem onClick={() => handleStatusSelect('online')} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Online
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('focus')} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-primary" />
              Focus
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('vacation')} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              Vacation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusSelect('offline')} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-500" />
              Offline
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Today's Updates Section */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary font-semibold text-lg tracking-tight">Today's Updates</h2>
          <div className="flex items-center gap-2 bg-brand-700 rounded-full px-4 py-2 border border-border-subtle">
            <ChevronLeft className="h-4 w-4 text-text-muted" />
            <span className="text-text-primary text-sm font-medium tracking-tight">Today</span>
            <ChevronRight className="h-4 w-4 text-text-muted" />
          </div>
        </div>

        {/* Brief Card */}
        <div className="bg-brand-600 rounded-xl p-5 border border-border-subtle shadow-none hover:bg-white/5 transition-colors"
             onClick={() => onOpenBrief(briefData.id)}>
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onPlayBrief(briefData.id); }}
              className="h-12 w-12 p-0 rounded-full bg-brand-300/15 hover:bg-brand-300/25 transition-all duration-200"
            >
              <Play className="h-6 w-6 text-brand-300 fill-current" />
            </Button>
            <div>
              <div className="text-text-primary font-semibold text-base tracking-tight">
                {briefData.title}
              </div>
              <div className="text-text-secondary text-sm">
                {briefData.time}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-muted">
            <span>{briefData.slackCount} Slack</span>
            <span>{briefData.emailCount} Emails</span>
            <span>{briefData.actionCount} Actions</span>
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