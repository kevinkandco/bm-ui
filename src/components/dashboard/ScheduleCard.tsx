import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Mic, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ScheduleItem {
  id: string;
  title: string;
  time: string;
  duration: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
  briefing?: string;
  hasProxy?: boolean;
  hasNotes?: boolean;
  isRecording?: boolean;
  minutesUntil: number;
  status?: 'upcoming' | 'current' | 'past';
}

export interface ScheduleCardProps {
  items: ScheduleItem[];
  onJoin?: (item: ScheduleItem) => void;
  onProxy?: (item: ScheduleItem) => void;
  onViewDetails?: (item: ScheduleItem) => void;
  className?: string;
}

export const ScheduleCard = ({ 
  items, 
  onJoin, 
  onProxy, 
  onViewDetails,
  className 
}: ScheduleCardProps) => {
  const getStatusColor = (minutesUntil: number) => {
    if (minutesUntil < 0) return 'text-text-muted';
    if (minutesUntil <= 15) return 'text-orange-400';
    return 'text-text-secondary';
  };

  const getTimeUntilText = (minutesUntil: number) => {
    if (minutesUntil < 0) return 'Past';
    if (minutesUntil === 0) return 'Now';
    if (minutesUntil < 60) return `${minutesUntil}m`;
    return `${Math.floor(minutesUntil / 60)}h ${minutesUntil % 60}m`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-brand-600 rounded-xl p-3 border border-border-subtle hover:bg-white/5 transition-colors cursor-pointer"
          onClick={() => onViewDetails?.(item)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-muted" />
              <span className="text-sm font-medium text-text-primary">
                {item.title}
              </span>
              {item.isRecording && (
                <Badge variant="high" className="text-xs">
                  <Mic className="h-3 w-3 mr-1" />
                  Recording
                </Badge>
              )}
            </div>
            <span className={cn("text-xs", getStatusColor(item.minutesUntil))}>
              {getTimeUntilText(item.minutesUntil)}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-text-secondary">
              {item.time} • {item.duration}
            </div>
            
            <div className="flex items-center gap-2">
              {item.hasNotes && (
                <FileText className="h-3 w-3 text-text-muted" />
              )}
              {item.hasProxy && (
                <Badge variant="low" className="text-xs">
                  Proxy
                </Badge>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onJoin?.(item);
                }}
              >
                Join
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};