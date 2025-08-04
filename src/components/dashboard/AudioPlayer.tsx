import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Rss, Volume2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  briefId: number | null;
  briefName?: string;
  briefTime?: string;
  onClose: () => void;
  className?: string;
}

const AudioPlayer = ({ 
  briefId, 
  briefName = "Morning Brief", 
  briefTime = "Today, 8:00 AM",
  onClose,
  className 
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(312); // 5:12 in seconds
  const [volume, setVolume] = useState(80);
  const [showVolume, setShowVolume] = useState(false);

  // Auto-play when briefId changes
  useEffect(() => {
    if (briefId) {
      setIsPlaying(true);
    }
  }, [briefId]);

  // Simulate audio progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentTime < duration) {
      interval = setInterval(() => {
        setCurrentTime(prev => Math.min(prev + 1, duration));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleSkipBack = useCallback(() => {
    setCurrentTime(prev => Math.max(prev - 10, 0));
  }, []);

  const handleSkipForward = useCallback(() => {
    setCurrentTime(prev => Math.min(prev + 10, duration));
  }, [duration]);

  const handleTimelineChange = useCallback((value: number[]) => {
    setCurrentTime(value[0]);
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    setVolume(value[0]);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePodcastFeed = useCallback(() => {
    // In a real app, this would open the RSS feed
    window.open('https://feeds.example.com/briefme-podcast', '_blank');
  }, []);

  if (!briefId) {
    console.log('AudioPlayer: briefId is null/undefined, not rendering');
    return null;
  }

  console.log('AudioPlayer: rendering with briefId:', briefId, 'briefName:', briefName);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 h-20 bg-surface-raised/95 backdrop-blur-md border-t border-border-subtle z-50",
      className
    )}>
      <div className="flex items-center gap-4 px-6 h-full">
        {/* Play Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipBack}
            className="h-8 w-8 p-0 hover:bg-surface-raised"
          >
            <SkipBack className="h-4 w-4 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            className="h-10 w-10 p-0 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-accent-primary" />
            ) : (
              <Play className="h-5 w-5 text-accent-primary" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkipForward}
            className="h-8 w-8 p-0 hover:bg-surface-raised"
          >
            <SkipForward className="h-4 w-4 fill-current" />
          </Button>
        </div>

        {/* Brief Info */}
        <div className="min-w-0 flex-shrink-0">
          <div className="text-sm font-medium text-text-primary truncate">
            {briefName}
          </div>
          <div className="text-xs text-text-secondary">
            {briefTime}
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 flex items-center gap-3 min-w-0">
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(currentTime)}
          </span>
          
          <div className="flex-1">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleTimelineChange}
              className="w-full"
            />
          </div>
          
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="relative flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className="h-8 w-8 p-0 hover:bg-surface-raised"
            onMouseEnter={() => setShowVolume(true)}
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          {showVolume && (
            <div 
              className="absolute bottom-full mb-2 right-0 bg-surface-raised border border-border-subtle rounded-lg p-3 w-32"
              onMouseLeave={() => setShowVolume(false)}
            >
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                orientation="vertical"
                className="h-16"
              />
            </div>
          )}
        </div>

        {/* Podcast Feed */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePodcastFeed}
          className="h-8 w-8 p-0 hover:bg-surface-raised"
          title="Open podcast RSS feed"
        >
          <Rss className="h-4 w-4" />
        </Button>

        {/* Close */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0 hover:bg-surface-raised"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default React.memo(AudioPlayer);