import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FollowUpItem {
  id: number;
  platform: string;
  priority: 'High' | 'Medium' | 'Low';
  message: string;
  sender: string;
  time: string;
  actionType: string;
}

interface FollowUpsCardProps {
  followUps: FollowUpItem[];
  onFollowUpClick: (item: FollowUpItem) => void;
  onViewAll: () => void;
  selectedFollowUpId?: number | null;
}

const FollowUpsCard = ({ followUps, onFollowUpClick, onViewAll, selectedFollowUpId }: FollowUpsCardProps) => {
  const [showLowPriority, setShowLowPriority] = useState(false);

  const groupedFollowUps = followUps.reduce((acc, item) => {
    if (!acc[item.priority]) acc[item.priority] = [];
    acc[item.priority].push(item);
    return acc;
  }, {} as Record<string, FollowUpItem[]>);

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500/20 text-red-400 hover:bg-red-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30';
      case 'Low':
        return 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const visibleItems = showLowPriority 
    ? followUps 
    : followUps.filter(item => item.priority !== 'Low');

  return (
    <div className="bg-brand-600 rounded-xl p-4 border border-border-subtle">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Follow-ups</h3>
          <p className="text-xs text-text-muted">These need your attention.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* High Priority */}
        {groupedFollowUps.High && (
          <div>
            <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">High Priority</h4>
            <div className="space-y-2">
              {groupedFollowUps.High.slice(0, 2).map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors border border-border-subtle ${
                    selectedFollowUpId === item.id 
                      ? 'bg-brand-300/10 border-brand-300/30' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => onFollowUpClick(item)}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                  <div className="flex-1 min-w-0">
                    <Badge className={`${getPriorityBadgeVariant(item.priority)} text-[10px] px-2 py-0 mb-1 border-0`}>
                      {item.priority}
                    </Badge>
                    <p className="text-sm text-text-primary font-medium leading-relaxed mb-1">
                      {item.message}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {item.sender} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Medium Priority */}
        {groupedFollowUps.Medium && (
          <div>
            <h4 className="text-xs font-medium text-text-secondary mb-2 uppercase tracking-wider">Medium Priority</h4>
            <div className="space-y-2">
              {groupedFollowUps.Medium.slice(0, 2).map((item) => (
                <div 
                  key={item.id}
                  className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors border border-border-subtle ${
                    selectedFollowUpId === item.id 
                      ? 'bg-brand-300/10 border-brand-300/30' 
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => onFollowUpClick(item)}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                  <div className="flex-1 min-w-0">
                    <Badge className={`${getPriorityBadgeVariant(item.priority)} text-[10px] px-2 py-0 mb-1 border-0`}>
                      {item.priority}
                    </Badge>
                    <p className="text-sm text-text-primary font-medium leading-relaxed mb-1">
                      {item.message}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {item.sender} • {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Low Priority - Collapsible */}
        {groupedFollowUps.Low && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLowPriority(!showLowPriority)}
              className="w-full justify-between text-text-secondary hover:text-text-primary text-xs p-2"
            >
              <span className="font-medium uppercase tracking-wider">
                Low Priority ({groupedFollowUps.Low.length})
              </span>
              <ChevronRight className={`h-3 w-3 transition-transform ${showLowPriority ? 'rotate-90' : ''}`} />
            </Button>
            
            {showLowPriority && (
              <div className="mt-2 space-y-2">
                {groupedFollowUps.Low.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors border border-border-subtle ${
                      selectedFollowUpId === item.id 
                        ? 'bg-brand-300/10 border-brand-300/30' 
                        : 'hover:bg-white/5'
                    }`}
                    onClick={() => onFollowUpClick(item)}
                  >
                    <div className="w-2 h-2 rounded-full bg-gray-500 mt-2" />
                    <div className="flex-1 min-w-0">
                      <Badge className={`${getPriorityBadgeVariant(item.priority)} text-[10px] px-2 py-0 mb-1 border-0`}>
                        {item.priority}
                      </Badge>
                      <p className="text-sm text-text-primary font-medium leading-relaxed mb-1">
                        {item.message}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {item.sender} • {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onViewAll}
          className="w-full justify-between text-brand-300 hover:text-brand-200 hover:bg-brand-300/10 mt-3"
        >
          <span className="text-xs">View all {followUps.length} items</span>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default FollowUpsCard;