import React, { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VacationTimerProps {
  startTime: number;
  onEndVacation: () => void;
}

const VacationTimer: React.FC<VacationTimerProps> = ({ startTime, onEndVacation }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      
      const days = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((elapsedMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
      
      let timeString = '';
      if (days > 0) {
        timeString = `${days} day${days !== 1 ? 's' : ''}, ${hours} hour${hours !== 1 ? 's' : ''}`;
      } else if (hours > 0) {
        timeString = `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''}`;
      } else {
        timeString = `${minutes} minute${minutes !== 1 ? 's' : ''}`;
      }
      
      setTimeElapsed(`On vacation for ${timeString}`);
    };

    // Update immediately
    updateTimer();

    // Update every minute
    const interval = setInterval(updateTimer, 60000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-gray-500/10 rounded-full">
      <div className="flex items-center gap-1.5">
        <Plane className="h-3 w-3 text-gray-500" />
        <span className="text-sm font-medium text-gray-500">{timeElapsed}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onEndVacation}
        className="h-6 px-2 py-0 text-xs border-gray-500/20 hover:bg-gray-500/10"
      >
        End Now
      </Button>
    </div>
  );
};

export default VacationTimer;