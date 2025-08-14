import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface AwayTimerProps {
  startTime: number;
}

const AwayTimer: React.FC<AwayTimerProps> = ({ startTime }) => {
  const [timeElapsed, setTimeElapsed] = useState<string>('00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
      const elapsedSeconds = Math.floor((elapsedMs / 1000) % 60);
      
      const formattedMinutes = elapsedMinutes.toString().padStart(2, '0');
      const formattedSeconds = elapsedSeconds.toString().padStart(2, '0');
      
      setTimeElapsed(`${formattedMinutes}:${formattedSeconds}`);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 rounded-full">
      <Clock className="h-3 w-3 text-yellow-500" />
      <span className="text-sm font-medium text-yellow-500">{timeElapsed}</span>
    </div>
  );
};

export default AwayTimer;