import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LatestBriefCardProps {
  brief: {
    id: number;
    name: string;
    timeCreated: string;
    slackMessages: { total: number; fromPriorityPeople: number };
    emails: { total: number; fromPriorityPeople: number };
    actionItems: number;
  };
  playingBrief: number | null;
  onPlayBrief: (briefId: number) => void;
  onBriefSelect: (briefId: number) => void;
}

const LatestBriefCard = ({ brief, playingBrief, onPlayBrief, onBriefSelect }: LatestBriefCardProps) => {
  return (
    <div className="bg-brand-600 rounded-xl p-4 border border-border-subtle hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onBriefSelect(brief.id)}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Latest Brief</h3>
          <p className="text-xs text-text-muted">Here's what's coming up.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            onPlayBrief(brief.id);
          }} 
          className="h-10 w-10 p-0 rounded-full bg-brand-300/15 hover:bg-brand-300/25 transition-all duration-200"
        >
          {playingBrief === brief.id ? (
            <Pause className="h-5 w-5 text-brand-300 fill-current" />
          ) : (
            <Play className="h-5 w-5 text-brand-300 fill-current" />
          )}
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-text-primary font-semibold text-sm leading-tight tracking-tight">
              {brief.name}
            </div>
            {playingBrief === brief.id && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-300/20 text-brand-300">
                Playing
              </span>
            )}
          </div>
          <div className="text-text-secondary text-xs mb-1">
            {brief.timeCreated}
          </div>
          <div className="text-text-muted text-xs">
            {brief.slackMessages.fromPriorityPeople} Slack • {brief.emails.fromPriorityPeople} Emails • {brief.actionItems} Actions
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestBriefCard;