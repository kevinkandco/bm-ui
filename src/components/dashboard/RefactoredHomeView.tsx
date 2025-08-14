import React, { useState, useCallback } from 'react';
import { Zap, Focus, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

// Import new components
import { AppShell } from './AppShell';
import { LeftNavigation } from './LeftNavigation';
import { BriefCard, BriefCardProps } from './BriefCard';
import { ScheduleCard, ScheduleItem } from './ScheduleCard';
import { FollowUpList, FollowUpItem } from './FollowUpList';
import { RightDetailPanel } from './RightDetailPanel';
import { PlayerBar } from './PlayerBar';
import { QuickChip } from './QuickChips';
import { StatusType } from './StatusMenu';
import { usePanel } from '@/hooks/usePanel';
import { useStatus } from '@/hooks/useStatus';

// Import existing components for mobile
import MobileHomeView from './MobileHomeView';
import MobileBottomNav from './MobileBottomNav';

interface RefactoredHomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
  onStartFocusMode: () => void;
  onSignOffForDay: () => void;
  userStatus?: StatusType;
  focusConfig?: any;
  focusStartTime?: number | null;
  awayStartTime?: number | null;
  vacationStartTime?: number | null;
  offlineStartTime?: number | null;
  offlineSchedule?: {
    startTime: Date;
    endTime: Date;
    slackSync: boolean;
    teamsSync: boolean;
    slackMessage: string;
    teamsMessage: string;
    enableDND: boolean;
  } | null;
  onStatusChange?: (status: StatusType) => void;
  onExitFocusMode?: () => void;
  onSignBackOn?: () => void;
  onOpenVacationModal?: () => void;
  onEndVacationNow?: () => void;
  onEndOfflineNow?: () => void;
  onExtendOffline?: (newEndTime: Date) => void;
}

export const RefactoredHomeView = (props: RefactoredHomeViewProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // State management
  const [leftNavCollapsed, setLeftNavCollapsed] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [playingBrief, setPlayingBrief] = useState<number | null>(null);
  const rightPanel = usePanel();

  // Sample data
  const briefsData: BriefCardProps[] = [
    {
      id: 1,
      title: "Morning Brief",
      time: "Today, 8:00 AM",
      sources: { slack: 12, email: 5, meetings: 2 },
      status: playingBrief === 1 ? 'playing' : 'available',
      actions: {
        onPlay: () => handlePlayBrief(1),
        onView: () => props.onOpenBrief(1),
        onTranscript: () => props.onViewTranscript(1)
      }
    },
    {
      id: 2,
      title: "Afternoon Update",
      time: "Today, 2:00 PM",
      sources: { slack: 8, email: 3 },
      status: 'scheduled',
      actions: {
        onPlay: () => handlePlayBrief(2),
        onView: () => props.onOpenBrief(2),
        onTranscript: () => props.onViewTranscript(2)
      }
    }
  ];

  const scheduleData: ScheduleItem[] = [
    {
      id: "1",
      title: "Test demo",
      time: "2:00 PM",
      duration: "1 hour",
      attendees: [{ name: "Kevin Kirkpatrick", email: "kevin@uprise.is" }],
      briefing: "Product demonstration with Kevin",
      hasProxy: true,
      hasNotes: true,
      isRecording: true,
      minutesUntil: 45,
      status: 'upcoming'
    },
    {
      id: "2",
      title: "Design review",
      time: "3:30 PM",
      duration: "45 min",
      attendees: [{ name: "Design Team", email: "design@company.com" }],
      briefing: "Review of latest design mockups",
      hasProxy: true,
      minutesUntil: 135,
      status: 'upcoming'
    }
  ];

  const followUpData: FollowUpItem[] = [
    {
      id: 1,
      type: 'message',
      title: 'Question about project timeline',
      preview: 'Hey, can you clarify the timeline for the new feature?',
      from: 'Sarah Chen',
      priority: 'high',
      time: '2h ago',
      channel: 'product'
    },
    {
      id: 2,
      type: 'email',
      title: 'Meeting follow-up required',
      preview: 'Please send the notes from yesterday\'s meeting.',
      from: 'Mike Johnson',
      priority: 'medium',
      time: '4h ago'
    },
    {
      id: 3,
      type: 'task',
      title: 'Review design mockups',
      preview: 'New designs are ready for your feedback.',
      from: 'Design Team',
      priority: 'low',
      time: '1d ago',
      channel: 'design'
    }
  ];

  const quickChipsData: QuickChip[] = [
    { id: 'brief-me', label: 'Brief Me', icon: Zap, variant: 'accent' },
    { id: 'focus-mode', label: 'Focus Mode', icon: Focus, variant: 'outline' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, variant: 'outline' }
  ];

  // Handlers
  const handlePlayBrief = useCallback((briefId: number) => {
    if (playingBrief === briefId) {
      setPlayingBrief(null);
    } else {
      setPlayingBrief(briefId);
    }
  }, [playingBrief]);

  const handleNavigation = useCallback((page: string) => {
    setCurrentPage(page);
    if (page === 'home') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${page}`);
    }
  }, [navigate]);

  const handleQuickChipClick = useCallback((chip: QuickChip) => {
    switch (chip.id) {
      case 'brief-me':
        props.onToggleCatchMeUp();
        break;
      case 'focus-mode':
        props.onStartFocusMode();
        break;
      case 'schedule':
        handleNavigation('calendar');
        break;
    }
  }, [props, handleNavigation]);

  const handleFollowUpClick = useCallback((item: FollowUpItem) => {
    rightPanel.openPanel({
      type: 'followup',
      data: item
    });
  }, [rightPanel]);

  const handleScheduleItemClick = useCallback((item: ScheduleItem) => {
    rightPanel.openPanel({
      type: 'meeting',
      data: item
    });
  }, [rightPanel]);

  const handleStatusChange = useCallback((status: StatusType) => {
    props.onStatusChange?.(status);
  }, [props]);

  // Mobile view
  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        <MobileHomeView
          onPlayBrief={handlePlayBrief}
          playingBrief={playingBrief}
          onOpenBrief={props.onOpenBrief}
          onStartFocusMode={props.onStartFocusMode}
          onBriefMe={props.onToggleCatchMeUp}
          userStatus={props.userStatus}
          onStatusChange={props.onStatusChange}
        />
        <MobileBottomNav />
      </div>
    );
  }

  // Desktop view with new component architecture
  return (
    <AppShell
      leftNav={
        <LeftNavigation
          collapsed={leftNavCollapsed}
          onToggleCollapse={() => setLeftNavCollapsed(!leftNavCollapsed)}
          currentPage={currentPage}
          onNavigate={handleNavigation}
          userStatus={props.userStatus || 'active'}
          onStatusChange={handleStatusChange}
          quickChips={quickChipsData}
          onQuickChipClick={handleQuickChipClick}
        />
      }
      mainContent={
        <div className="flex-1 overflow-auto bg-brand-900">
          {/* Main content area */}
          <div className="p-6 max-w-6xl mx-auto">
            {currentPage === 'home' && (
              <div className="space-y-6">
                {/* Welcome section */}
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-text-primary mb-2">
                    Good morning, Alex
                  </h1>
                  <p className="text-text-secondary">
                    I'm here with you — let's make the most of today.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left column - Briefs */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-text-primary mb-4">
                        Today's Updates
                      </h2>
                      <div className="space-y-4">
                        {briefsData.map((brief) => (
                          <BriefCard key={brief.id} {...brief} />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-text-primary mb-4">
                        Follow-ups
                      </h2>
                      <FollowUpList
                        items={followUpData}
                        onOpenItem={handleFollowUpClick}
                      />
                    </div>
                  </div>

                  {/* Right column - Schedule */}
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary mb-4">
                      Schedule
                    </h2>
                    <ScheduleCard
                      items={scheduleData}
                      onViewDetails={handleScheduleItemClick}
                      onJoin={(item) => {
                        toast({
                          title: "Joining meeting",
                          description: `Joining ${item.title}`
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Other pages would render their specific content here */}
            {currentPage === 'briefs' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">All Briefs</h1>
                <div className="space-y-4">
                  {briefsData.map((brief) => (
                    <BriefCard key={brief.id} {...brief} />
                  ))}
                </div>
              </div>
            )}

            {currentPage === 'calendar' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">Calendar</h1>
                <ScheduleCard
                  items={scheduleData}
                  onViewDetails={handleScheduleItemClick}
                  onJoin={(item) => {
                    toast({
                      title: "Joining meeting",
                      description: `Joining ${item.title}`
                    });
                  }}
                />
              </div>
            )}

            {currentPage === 'tasks' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-text-primary">Tasks</h1>
                <FollowUpList
                  items={followUpData.filter(item => item.type === 'task')}
                  onOpenItem={handleFollowUpClick}
                  showCheckboxes={true}
                />
              </div>
            )}
          </div>
        </div>
      }
      rightPanel={
        <RightDetailPanel
          open={rightPanel.isOpen}
          onClose={rightPanel.closePanel}
          title={
            rightPanel.content?.type === 'followup' ? 'Follow-up Details' :
            rightPanel.content?.type === 'meeting' ? 'Meeting Details' :
            'Details'
          }
        >
          {rightPanel.content?.type === 'followup' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-text-primary mb-2">
                  {rightPanel.content.data.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {rightPanel.content.data.preview}
                </p>
              </div>
              <div className="text-xs text-text-muted">
                From: {rightPanel.content.data.from} • {rightPanel.content.data.time}
              </div>
            </div>
          )}
          
          {rightPanel.content?.type === 'meeting' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-text-primary mb-2">
                  {rightPanel.content.data.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {rightPanel.content.data.time} • {rightPanel.content.data.duration}
                </p>
              </div>
              <div className="text-sm text-text-secondary">
                {rightPanel.content.data.briefing}
              </div>
            </div>
          )}
        </RightDetailPanel>
      }
      playerBar={
        playingBrief && (
          <PlayerBar
            playing={true}
            currentTrack={{
              id: playingBrief,
              title: briefsData.find(b => b.id === playingBrief)?.title || "Brief",
              duration: 180,
              currentTime: 45
            }}
            onPlay={() => {}}
            onPause={() => setPlayingBrief(null)}
            onSeek={(time) => {
              // Handle seek
            }}
          />
        )
      }
    />
  );
};
