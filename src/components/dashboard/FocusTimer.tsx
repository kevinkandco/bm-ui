import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface FocusTimerProps {
  startTime: number;
  duration: number; // duration in minutes
}

const FocusTimer: React.FC<FocusTimerProps> = ({ startTime, duration }) => {
  const [timeRemaining, setTimeRemaining] = useState<string>('00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));
      const remainingMinutes = Math.max(0, duration - elapsedMinutes);
      const remainingSeconds = Math.max(0, Math.floor((duration * 60 * 1000 - elapsedMs) / 1000) % 60);
      
      const formattedMinutes = remainingMinutes.toString().padStart(2, '0');
      const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
      
      setTimeRemaining(`${formattedMinutes}:${formattedSeconds}`);
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startTime, duration]);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-full">
      <Clock className="h-3 w-3 text-blue-500" />
      <span className="text-sm font-medium text-blue-500">{timeRemaining}</span>
    </div>
  );
};

export default FocusTimer;