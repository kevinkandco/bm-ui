import React from 'react';
import { Check, Clock, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface FollowUpItem {
  id: number;
  type: 'message' | 'task' | 'email';
  title: string;
  preview?: string;
  from?: string;
  priority: 'high' | 'medium' | 'low';
  time: string;
  channel?: string;
  isChecked?: boolean;
}

export interface FollowUpListProps {
  items: FollowUpItem[];
  onOpenItem?: (item: FollowUpItem) => void;
  onToggleItem?: (id: number, checked: boolean) => void;
  onMarkComplete?: (id: number) => void;
  showCheckboxes?: boolean;
  className?: string;
}

export const FollowUpList = ({ 
  items, 
  onOpenItem, 
  onToggleItem, 
  onMarkComplete,
  showCheckboxes = false,
  className 
}: FollowUpListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-text-muted';
      default: return 'text-text-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'email': return MessageSquare;
      case 'task': return Clock;
      default: return MessageSquare;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item) => {
        const Icon = getTypeIcon(item.type);
        
        return (
          <div
            key={item.id}
            className="bg-brand-600 rounded-lg p-3 border border-border-subtle hover:bg-white/5 transition-colors cursor-pointer"
            onClick={() => onOpenItem?.(item)}
          >
            <div className="flex items-start gap-3">
              {showCheckboxes && (
                <Checkbox
                  checked={item.isChecked || false}
                  onCheckedChange={(checked) => 
                    onToggleItem?.(item.id, checked as boolean)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
              )}
              
              <Icon className="h-4 w-4 text-text-muted mt-0.5 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-text-primary truncate">
                    {item.title}
                  </span>
                  <Badge 
                    variant={item.priority === 'high' ? 'high' : item.priority === 'medium' ? 'medium' : 'low'}
                    className="text-xs flex-shrink-0"
                  >
                    {item.priority}
                  </Badge>
                </div>
                
                {item.preview && (
                  <p className="text-xs text-text-secondary mb-1 line-clamp-2">
                    {item.preview}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    {item.from && (
                      <>
                        <User className="h-3 w-3" />
                        <span>{item.from}</span>
                      </>
                    )}
                    {item.channel && (
                      <>
                        {item.from && <span>•</span>}
                        <span>#{item.channel}</span>
                      </>
                    )}
                  </div>
                  <span>{item.time}</span>
                </div>
              </div>
              
              {onMarkComplete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkComplete(item.id);
                  }}
                >
                  <Check className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};