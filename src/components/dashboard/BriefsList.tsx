import React from 'react';
import { Play, Settings, Rss, Clock } from 'lucide-react';
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
}

const BriefsList = ({ onPlayBrief, onSettingsClick, onRssClick, playingBrief, selectedBrief, onBriefSelect, activeTab = 'briefs', onTabChange }: BriefsListProps) => {
  const meetings: Meeting[] = [
    { id: 1, title: "Meeting w/Mike", time: "8AM to 9AM", duration: "(1hr)" },
    { id: 2, title: "Meeting w/Emily", time: "11AM to 12PM", duration: "(1hr)" },
    { id: 3, title: "Meeting w/Steve", time: "1PM to 2PM", duration: "(1hr)" },
  ];

  const dailySchedule = [
    {
      type: 'section',
      title: 'Daily Brief',
      id: 'daily-brief'
    },
    {
      type: 'brief',
      id: 1,
      title: "Morning Brief",
      scheduledTime: "Scheduled for 8/4/2025 at 7:00 AM",
      timeAgo: "12hrs",
      stats: { slack: 3, emails: 28, actions: 4 }
    },
    {
      type: 'meeting',
      id: 1,
      title: "Meeting w/Mike",
      time: "8AM to 9AM (1hr)"
    },
    {
      type: 'meeting',
      id: 2,
      title: "Meeting w/Emily", 
      time: "11AM to 12PM (1hr)"
    },
    {
      type: 'brief',
      id: 2,
      title: "Midday Brief",
      scheduledTime: "Scheduled for 8/4/2025 at 12:00 PM",
      timeAgo: "",
      stats: null,
      hasButton: true
    },
    {
      type: 'meeting',
      id: 3,
      title: "Meeting w/Steve",
      time: "1PM to 2PM (1hr)"
    }
  ];

  const upcomingMeetings = [
    { id: 4, title: "Meeting w/Mike", time: "8AM to 9AM (1hr)" },
    { id: 5, title: "Meeting w/Mike", time: "8AM to 9AM (1hr)" },
    { id: 6, title: "Meeting w/Mike", time: "8AM to 9AM (1hr)" },
    { id: 7, title: "Meeting w/Mike", time: "8AM to 9AM (1hr)" },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-subtle">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onTabChange?.('briefs')}
            className={cn(
              "text-lg font-medium transition-colors hover:text-text-primary",
              activeTab === 'briefs' ? "text-text-primary font-semibold" : "text-text-secondary"
            )}
          >
            Briefs
          </button>
          <button 
            onClick={() => onTabChange?.('calendar')}
            className={cn(
              "text-lg font-medium transition-colors hover:text-text-primary",
              activeTab === 'calendar' ? "text-text-primary font-semibold" : "text-text-secondary"
            )}
          >
            Calendar
          </button>
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

      {/* Combined Briefs and Calendar View */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'briefs' ? (
          <div className="space-y-0">
            {/* Daily Schedule */}
            {dailySchedule.map((item, index) => {
              if (item.type === 'section') {
                return (
                  <div key={item.id} className="px-4 py-3">
                    <h2 className="text-lg font-medium text-text-secondary">{item.title}</h2>
                  </div>
                );
              }
              
              if (item.type === 'brief') {
                return (
                  <div key={`brief-${item.id}`}>
                    <div 
                      className={cn(
                        "flex items-center gap-3 p-4 hover:bg-surface-raised/20 transition-colors cursor-pointer",
                        selectedBrief === item.id && "bg-accent-primary/10 border-l-2 border-accent-primary"
                      )}
                       onClick={() => onBriefSelect(item.id as number)}
                     >
                       {/* Play Button */}
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={(e) => {
                           e.stopPropagation();
                           onPlayBrief(item.id as number);
                         }}
                        className={cn(
                          "h-8 w-8 p-0 rounded-none bg-transparent hover:bg-surface-raised/20",
                          playingBrief === item.id && "text-accent-primary"
                        )}
                      >
                        <Play className="h-4 w-4 fill-current" />
                      </Button>

                      {/* Brief Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-text-primary mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-text-secondary mb-2">
                              {item.scheduledTime}
                            </p>
                            {item.stats && (
                              <p className="text-xs text-text-secondary">
                                {item.stats.slack} Slack | {item.stats.emails} Emails | {item.stats.actions} Actions
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.hasButton && (
                              <Button 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle "Get Briefed Now" action
                                }}
                              >
                                Get Briefed Now
                              </Button>
                            )}
                            {item.timeAgo && (
                              <span className="text-xs text-text-secondary flex-shrink-0">
                                {item.timeAgo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-4 border-b border-border-subtle" />
                  </div>
                );
              }
              
              if (item.type === 'meeting') {
                return (
                  <div key={`meeting-${item.id}`}>
                    <div className="flex items-center gap-3 p-4 hover:bg-surface-raised/20 transition-colors">
                      {/* Clock Icon */}
                      <div className="h-8 w-8 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-text-secondary" />
                      </div>

                      {/* Meeting Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-text-primary mb-1">
                              {item.title}
                            </h3>
                            <p className="text-xs text-text-secondary">
                              {item.time}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs text-text-secondary hover:text-text-primary"
                            >
                              Record
                            </Button>
                            <span className="text-text-secondary">|</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 text-xs text-text-secondary hover:text-text-primary"
                            >
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mx-4 border-b border-border-subtle" />
                  </div>
                );
              }
              
              return null;
            })}

            {/* Upcoming Section */}
            <div className="px-4 py-3 mt-6">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Upcoming</h3>
            </div>
            
            {upcomingMeetings.map((meeting, index) => (
              <div key={`upcoming-${meeting.id}`}>
                <div className="flex items-center gap-3 p-4 hover:bg-surface-raised/20 transition-colors">
                  {/* Clock Icon */}
                  <div className="h-8 w-8 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-text-secondary" />
                  </div>

                  {/* Meeting Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-text-primary mb-1">
                          {meeting.title}
                        </h3>
                        <p className="text-xs text-text-secondary">
                          {meeting.time}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-text-secondary hover:text-text-primary"
                        >
                          Record
                        </Button>
                        <span className="text-text-secondary">|</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-7 text-xs text-text-secondary hover:text-text-primary"
                        >
                          Join
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < upcomingMeetings.length - 1 && (
                  <div className="mx-4 border-b border-border-subtle" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <p className="text-text-secondary">Calendar view content would go here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(BriefsList);