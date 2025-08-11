import React from 'react';
import { Play, Settings, Rss } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
interface Brief {
  id: number;
  title: string;
  scheduledTime: string;
  timeAgo: string;
  stats: {
    slack: number;
    emails: number;
    actions: number;
  };
}
interface Meeting {
  id: number;
  title: string;
  time: string;
  duration: string;
  isUpcoming?: boolean;
}
interface BriefsListProps {
  onPlayBrief: (briefId: number) => void;
  onSettingsClick: () => void;
  onRssClick?: () => void;
  playingBrief?: number | null;
  selectedBrief?: number | null;
  onBriefSelect: (briefId: number) => void;
  activeTab?: 'briefs' | 'calendar';
  onTabChange?: (tab: 'briefs' | 'calendar') => void;
  onViewAll?: () => void;
}
const BriefsList = ({
  onPlayBrief,
  onSettingsClick,
  onRssClick,
  playingBrief,
  selectedBrief,
  onBriefSelect,
  activeTab = 'briefs',
  onTabChange,
  onViewAll
}: BriefsListProps) => {
  const briefs: Brief[] = [{
    id: 1,
    title: "Morning Brief",
    scheduledTime: "Scheduled for 8/4/2025 at 7:00 AM",
    timeAgo: "12hrs",
    stats: {
      slack: 3,
      emails: 28,
      actions: 4
    }
  }, {
    id: 2,
    title: "Midday Brief",
    scheduledTime: "Scheduled for 8/3/2025 at 12:00 PM",
    timeAgo: "1d",
    stats: {
      slack: 5,
      emails: 32,
      actions: 6
    }
  }, {
    id: 3,
    title: "Evening Brief",
    scheduledTime: "Scheduled for 8/2/2025 at 6:00 PM",
    timeAgo: "2d",
    stats: {
      slack: 2,
      emails: 15,
      actions: 3
    }
  }, {
    id: 4,
    title: "Ad Hoc Brief",
    scheduledTime: "Triggered by urgent messages",
    timeAgo: "3d",
    stats: {
      slack: 7,
      emails: 41,
      actions: 8
    }
  }, {
    id: 5,
    title: "Weekend Brief",
    scheduledTime: "Scheduled for 7/31/2025 at 5:00 PM",
    timeAgo: "4d",
    stats: {
      slack: 4,
      emails: 23,
      actions: 5
    }
  }];
  const meetings: Meeting[] = [{
    id: 1,
    title: "Meeting w/Mike",
    time: "8AM to 9AM",
    duration: "(1hr)",
    isUpcoming: true
  }, {
    id: 2,
    title: "Meeting w/Mike",
    time: "8AM to 9AM",
    duration: "(1hr)"
  }, {
    id: 3,
    title: "Meeting w/Mike",
    time: "8AM to 9AM",
    duration: "(1hr)"
  }, {
    id: 4,
    title: "Meeting w/Mike",
    time: "8AM to 9AM",
    duration: "(1hr)"
  }, {
    id: 5,
    title: "Meeting w/Mike",
    time: "8AM to 9AM",
    duration: "(1hr)"
  }];
  return <div className="h-full flex flex-col mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border-subtle">
        <div className="flex items-center gap-6">
          <h2 className="font-semibold text-text-primary text-xs">
            Recent Briefs
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {onRssClick && <Button variant="ghost" size="sm" onClick={onRssClick} className="h-8 w-8 p-0" title="Open podcast RSS feed">
              <Rss className="h-4 w-4" />
            </Button>}
          <Button variant="ghost" size="sm" onClick={onSettingsClick} className="h-8 w-8 p-0">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {briefs.slice(0, 3).map((brief, index) => (
          <div key={brief.id}>
            <div className={cn("flex items-center gap-3 pl-2 pr-4 py-4 hover:bg-surface-raised/20 transition-colors cursor-pointer", selectedBrief === brief.id && "bg-accent-primary/10 border-l-2 border-accent-primary")} onClick={() => onBriefSelect(brief.id)}>
              {/* Play Button */}
              <Button variant="ghost" size="sm" onClick={(e) => {
                e.stopPropagation();
                onPlayBrief(brief.id);
              }} className={cn("h-8 w-8 p-0 rounded-none bg-transparent hover:bg-surface-raised/20", playingBrief === brief.id && "text-accent-primary")}>
                <Play className="h-4 w-4 fill-current" />
              </Button>

              {/* Brief Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary mb-1">
                      {brief.title}
                    </h3>
                  </div>
                  <span className="text-xs text-text-secondary ml-2 flex-shrink-0">
                    {brief.timeAgo}
                  </span>
                </div>
              </div>
            </div>
            {index < 2 && <div className="mx-4 border-b border-border-subtle" />}
          </div>
        ))}
        
        {/* View All Link */}
        {onViewAll && (
          <div className="px-2 py-3">
            <button 
              onClick={onViewAll}
              className="text-xs text-accent-primary hover:text-accent-primary/80 transition-colors"
            >
              View all
            </button>
          </div>
        )}
      </div>
    </div>;
};
export default React.memo(BriefsList);