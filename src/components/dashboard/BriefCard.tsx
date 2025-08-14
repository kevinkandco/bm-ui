import React from 'react';
import { Play, Clock, MessageSquare, Mail, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface BriefCardProps {
  id: number;
  title: string;
  time: string;
  sources: {
    slack: number;
    email: number;
    meetings?: number;
  };
  status?: 'playing' | 'available' | 'scheduled';
  actions?: {
    onPlay?: () => void;
    onView?: () => void;
    onTranscript?: () => void;
  };
  className?: string;
}

export const BriefCard = ({ 
  id, 
  title, 
  time, 
  sources, 
  status = 'available',
  actions,
  className 
}: BriefCardProps) => {
  return (
    <div className={cn(
      "bg-brand-600 rounded-xl p-3 shadow-none hover:bg-white/5 transition-colors cursor-pointer",
      className
    )}
    onClick={actions?.onView}
    >
      <div className="flex items-center gap-3 mb-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => {
            e.stopPropagation();
            actions?.onPlay?.();
          }}
          className="h-10 w-10 p-0 rounded-full bg-brand-300/15 hover:bg-brand-300/25 transition-all duration-200"
        >
          <Play className="h-5 w-5 text-brand-300 fill-current" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className="text-text-primary font-semibold text-sm leading-tight tracking-tight">
              {title}
            </div>
            {status === 'playing' && (
              <Badge variant="low" className="text-[10px] px-2 py-0.5 bg-brand-300/20 text-brand-300">
                Playing
              </Badge>
            )}
          </div>
          <div className="text-text-secondary text-xs">
            {time}
          </div>
        </div>
      </div>
      
      <div className="text-text-muted text-xs flex items-center gap-1">
        {sources.slack > 0 && (
          <>
            <MessageSquare className="h-3 w-3" />
            <span>{sources.slack} Slack</span>
          </>
        )}
        {sources.slack > 0 && sources.email > 0 && <span>•</span>}
        {sources.email > 0 && (
          <>
            <Mail className="h-3 w-3" />
            <span>{sources.email} Emails</span>
          </>
        )}
        {sources.meetings && sources.meetings > 0 && (
          <>
            <span>•</span>
            <Users className="h-3 w-3" />
            <span>{sources.meetings} Meetings</span>
          </>
        )}
      </div>
    </div>
  );
};