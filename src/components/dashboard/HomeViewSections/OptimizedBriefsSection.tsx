import React, { memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import BriefsContainer from './BriefsContainer';

interface Brief {
  id: number;
  name: string;
  timeCreated: string;
  timeRange: string;
  slackMessages: {
    total: number;
    fromPriorityPeople: number;
  };
  emails: {
    total: number;
    fromPriorityPeople: number;
  };
  actionItems: number;
  hasTranscript: boolean;
}

interface OptimizedBriefsSectionProps {
  allBriefs: Brief[];
  recentBriefs: Brief[];
  upcomingBriefs: Array<{
    id: string;
    name: string;
    scheduledTime: string;
  }>;
  playingBrief?: number | null;
  onPlayBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
}

const OptimizedBriefsSection = memo(({
  allBriefs,
  recentBriefs,
  upcomingBriefs,
  playingBrief,
  onPlayBrief,
  onViewTranscript
}: OptimizedBriefsSectionProps) => {
  const navigate = useNavigate();

  const briefsActions = useMemo(() => ({
    onViewBrief: (briefId: number) => {
      navigate(`/dashboard/briefs/${briefId}`);
    },
    onPlayBrief,
    onViewTranscript,
    onUpdateSchedule: () => {
      // Handle schedule update
    },
    onGetBriefedNow: () => {
      // Handle get briefed now
    },
    onViewAllBriefs: () => {
      navigate('/dashboard/briefs');
    }
  }), [navigate, onPlayBrief, onViewTranscript]);

  return (
    <BriefsContainer
      briefs={recentBriefs}
      totalBriefs={allBriefs.length}
      upcomingBrief={upcomingBriefs[0]}
      playingBrief={playingBrief}
      {...briefsActions}
    />
  );
});

OptimizedBriefsSection.displayName = 'OptimizedBriefsSection';

export default OptimizedBriefsSection;