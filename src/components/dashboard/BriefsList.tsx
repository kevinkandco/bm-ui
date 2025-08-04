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

interface BriefsListProps {
  onPlayBrief: (briefId: number) => void;
  onSettingsClick: () => void;
  onRssClick?: () => void;
  playingBrief?: number | null;
  selectedBrief?: number | null;
  onBriefSelect: (briefId: number) => void;
}

const BriefsList = ({ onPlayBrief, onSettingsClick, onRssClick, playingBrief, selectedBrief, onBriefSelect }: BriefsListProps) => {
  const briefs: Brief[] = [
    {
      id: 1,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 8/4/2025 at 7:00 AM",
      timeAgo: "12hrs",
      stats: { slack: 3, emails: 28, actions: 4 }
    },
    {
      id: 2,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 8/3/2025 at 7:00 AM",
      timeAgo: "1d",
      stats: { slack: 5, emails: 32, actions: 6 }
    },
    {
      id: 3,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 8/2/2025 at 7:00 AM",
      timeAgo: "2d",
      stats: { slack: 2, emails: 15, actions: 3 }
    },
    {
      id: 4,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 8/1/2025 at 7:00 AM",
      timeAgo: "3d",
      stats: { slack: 7, emails: 41, actions: 8 }
    },
    {
      id: 5,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 7/31/2025 at 7:00 AM",
      timeAgo: "4d",
      stats: { slack: 4, emails: 23, actions: 5 }
    }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-semibold text-text-primary">Briefs</h2>
          <h2 className="text-lg font-medium text-text-secondary">Calendar</h2>
        </div>
        <div className="flex items-center gap-2">
          {onRssClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRssClick}
              className="h-8 w-8 p-0"
              title="Open podcast RSS feed"
            >
              <Rss className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Briefs List */}
      <div className="flex-1 overflow-auto">
        {briefs.map((brief, index) => (
          <div key={brief.id}>
            <div 
              className={cn(
                "flex items-center gap-3 p-4 hover:bg-surface-raised/20 transition-colors cursor-pointer",
                selectedBrief === brief.id && "bg-accent-primary/10 border-l-2 border-accent-primary"
              )}
              onClick={() => onBriefSelect(brief.id)}
            >
              {/* Play Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlayBrief(brief.id);
                }}
                className={cn(
                  "h-8 w-8 p-0 rounded-none bg-transparent hover:bg-surface-raised/20",
                  playingBrief === brief.id && "text-accent-primary"
                )}
              >
                <Play className="h-4 w-4 fill-current" />
              </Button>

              {/* Brief Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      {brief.title}
                    </h3>
                    <p className="text-xs text-text-secondary mb-2">
                      {brief.scheduledTime}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {brief.stats.slack} Slack | {brief.stats.emails} Emails | {brief.stats.actions} Actions
                    </p>
                  </div>
                  <span className="text-xs text-text-secondary ml-2 flex-shrink-0">
                    {brief.timeAgo}
                  </span>
                </div>
              </div>
            </div>
            {index < briefs.length - 1 && (
              <div className="mx-4 border-b border-border-subtle" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(BriefsList);