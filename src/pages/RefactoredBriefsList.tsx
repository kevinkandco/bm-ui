import React from 'react';
import { BriefCard, BriefCardProps } from '@/components/dashboard';

interface RefactoredBriefsListProps {
  briefs: BriefCardProps[];
  onPlayBrief: (briefId: number) => void;
  onViewBrief: (briefId: number) => void;
  onViewTranscript: (briefId: number) => void;
  className?: string;
}

export const RefactoredBriefsList = ({
  briefs,
  onPlayBrief,
  onViewBrief,
  onViewTranscript,
  className
}: RefactoredBriefsListProps) => {
  return (
    <div className={className}>
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">All Briefs</h1>
        <div className="space-y-4">
          {briefs.map((brief) => (
            <BriefCard
              key={brief.id}
              {...brief}
              actions={{
                onPlay: () => onPlayBrief(brief.id),
                onView: () => onViewBrief(brief.id),
                onTranscript: () => onViewTranscript(brief.id)
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};