import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export interface PlayerBarProps {
  playing: boolean;
  currentTrack?: {
    id: number;
    title: string;
    duration: number;
    currentTime: number;
  };
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onSeek?: (time: number) => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  className?: string;
}

export const PlayerBar = ({ 
  playing, 
  currentTrack, 
  onPlay, 
  onPause, 
  onNext, 
  onPrev, 
  onSeek, 
  onVolumeChange,
  volume = 100,
  className 
}: PlayerBarProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentTrack 
    ? (currentTrack.currentTime / currentTrack.duration) * 100 
    : 0;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-brand-800 border-t border-border-subtle p-4 z-30",
      className
    )}>
      <div className="flex items-center gap-4 max-w-6xl mx-auto">
        {/* Track Info */}
        <div className="flex-1 min-w-0">
          {currentTrack ? (
            <div>
              <div className="text-sm font-medium text-text-primary truncate">
                {currentTrack.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-text-muted">
                  {formatTime(currentTrack.currentTime)}
                </span>
                <div className="flex-1 relative">
                  <Slider
                    value={[progressPercentage]}
                    onValueChange={(value) => {
                      const newTime = (value[0] / 100) * currentTrack.duration;
                      onSeek?.(newTime);
                    }}
                    className="w-full"
                    max={100}
                    step={0.1}
                  />
                </div>
                <span className="text-xs text-text-muted">
                  {formatTime(currentTrack.duration)}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-text-muted">No track playing</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrev}
            disabled={!onPrev}
            className="h-8 w-8 p-0"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={playing ? onPause : onPlay}
            className="h-10 w-10 p-0 bg-brand-300/15 hover:bg-brand-300/25"
          >
            {playing ? (
              <Pause className="h-5 w-5 text-brand-300" />
            ) : (
              <Play className="h-5 w-5 text-brand-300 fill-current" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onNext}
            disabled={!onNext}
            className="h-8 w-8 p-0"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume */}
        {onVolumeChange && (
          <div className="flex items-center gap-2 w-24">
            <Volume2 className="h-4 w-4 text-text-muted" />
            <Slider
              value={[volume]}
              onValueChange={(value) => onVolumeChange(value[0])}
              className="flex-1"
              max={100}
              step={1}
            />
          </div>
        )}
      </div>
    </div>
  );
};