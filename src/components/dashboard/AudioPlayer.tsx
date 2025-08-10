import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Rss, Volume2, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import TranscriptModal from './TranscriptModal';

interface AudioPlayerProps {
  briefId: number | null;
  briefName?: string;
  briefTime?: string;
  onClose: () => void;
  className?: string;
}

const AudioPlayer = ({ 
  briefId, 
  briefName = "No audio selected", 
  briefTime = "Select a brief to play",
  onClose,
  className 
}: AudioPlayerProps) => {
  const isMobile = useIsMobile();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(312); // 5:12 in seconds
  const [volume, setVolume] = useState(80);
  const [showVolume, setShowVolume] = useState(false);
  const [showTranscriptModal, setShowTranscriptModal] = useState(false);

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

  const handleTranscriptClick = useCallback(() => {
    setShowTranscriptModal(true);
  }, []);

  // Show disabled state when no brief is selected
  const isDisabled = !briefId;
  
  console.log('AudioPlayer: rendering with briefId:', briefId, 'briefName:', briefName);

  // Mobile version - simple player above bottom nav
  if (isMobile) {
    return (
      <div className={cn(
        "fixed bottom-20 left-0 right-0 bg-emerald-800/95 backdrop-blur-md border-t border-emerald-600/50 z-45",
        className
      )}>
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            disabled={isDisabled}
            className="h-8 w-8 p-0 rounded-full bg-white/20 hover:bg-white/30 disabled:opacity-50"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white fill-current" />
            )}
          </Button>

          <div className="flex-1 min-w-0">
            <div className="text-white font-medium text-sm truncate">
              {briefName}
            </div>
            <div className="text-emerald-200 text-xs">
              Ready to play
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 hover:bg-white/20 text-emerald-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

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
            disabled={isDisabled}
            className="h-8 w-8 p-0 hover:bg-surface-raised disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="h-4 w-4 fill-current" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handlePlayPause}
            disabled={isDisabled}
            className="h-10 w-10 p-0 rounded-full bg-accent-primary/20 hover:bg-accent-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
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
            disabled={isDisabled}
            className="h-8 w-8 p-0 hover:bg-surface-raised disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isDisabled}
              className="w-full"
            />
          </div>
          
          <span className="text-xs text-text-secondary font-mono">
            {formatTime(duration)}
          </span>
        </div>

        {/* Transcript Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleTranscriptClick}
          disabled={isDisabled}
          className="h-8 w-8 p-0 hover:bg-surface-raised disabled:opacity-50 disabled:cursor-not-allowed"
          title="View transcript"
        >
          <FileText className="h-4 w-4" />
        </Button>

        {/* Volume Control */}
        <div className="relative flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            disabled={isDisabled}
            className="h-8 w-8 p-0 hover:bg-surface-raised disabled:opacity-50 disabled:cursor-not-allowed"
            onMouseEnter={() => !isDisabled && setShowVolume(true)}
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
          disabled={isDisabled}
          className="h-8 w-8 p-0 hover:bg-surface-raised disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Transcript Modal */}
      <TranscriptModal
        open={showTranscriptModal}
        onClose={() => setShowTranscriptModal(false)}
        briefId={briefId || undefined}
      />
    </div>
  );
};

export default React.memo(AudioPlayer);