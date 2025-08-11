import React from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpcomingBriefsCardProps {
  upcomingBriefs: Array<{
    id: number;
    name: string;
    scheduledTime: string;
  }>;
  onViewAll: () => void;
}

const UpcomingBriefsCard = ({ upcomingBriefs, onViewAll }: UpcomingBriefsCardProps) => {
  return (
    <div className="bg-brand-600 rounded-xl p-4 border border-border-subtle">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">Upcoming Briefs</h3>
          <p className="text-xs text-text-muted">Your day at a glance.</p>
        </div>
      </div>

      <div className="space-y-2">
        {upcomingBriefs.slice(0, 2).map((brief) => (
          <div key={brief.id} className="flex items-center gap-3 p-2 rounded-lg bg-surface-overlay/20 border border-border-subtle">
            <div className="h-8 w-8 rounded flex items-center justify-center bg-brand-300/15">
              <Clock className="h-4 w-4 text-brand-300" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-text-primary text-sm">{brief.name}</h4>
              <p className="text-xs text-text-secondary">{brief.scheduledTime}</p>
            </div>
          </div>
        ))}
        
        {upcomingBriefs.length > 2 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="w-full justify-between text-brand-300 hover:text-brand-200 hover:bg-brand-300/10"
          >
            <span className="text-xs">View all {upcomingBriefs.length} briefs</span>
            <ChevronRight className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default UpcomingBriefsCard;