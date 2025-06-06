import { useEffect, useRef, useState } from "react";

const useAudioPlayer = (
  audioSrc: string | null,
  autoplay: boolean,
  onAudioEnded?: () => void
) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement | null>(null);

  // Seek audio to position based on mouse or touch event
  const seekToPosition = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    let clientX: number;

    if ("touches" in e) {
      // Touch event — get first touch point
      clientX = e.touches[0].clientX;
    } else {
      // Mouse event
      clientX = e.clientX;
    }

    if (!barRef.current) return;

    const rect = barRef.current.getBoundingClientRect();
    let pos = clientX - rect.left;
    pos = Math.max(0, Math.min(pos, rect.width)); // clamp position
    const progressPercent = (pos / rect.width) * 100;

    if (audioRef.current) {
      audioRef.current.currentTime = (progressPercent / 100) * duration;
    }
    setCurrentTime((progressPercent / 100) * duration);
  };

  const handleSeekStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    setIsSeeking(true);
    seekToPosition(e);
  };

  const handleSeekMove = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!isSeeking) return;
    seekToPosition(e);
  };

  const handleSeekEnd = (
    e?: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (e) seekToPosition(e);
    setIsSeeking(false);
  };

  const handlePlay = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const handlePause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const formatDuration = (durationSeconds: number) => {
    if (!isFinite(durationSeconds) || durationSeconds < 0) return "0:00";
    const minutes = Math.floor(durationSeconds / 60);
    const seconds = Math.floor(durationSeconds % 60);
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${minutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    const audio = audioRef.current;

    if (!audioSrc) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      return;
    }

    if (!audio) return;

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onTimeUpdate = () => {
      if (!isSeeking) {
        setCurrentTime(audio.currentTime);
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onAudioEnded) onAudioEnded();
    };

    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);

    if (autoplay) {
      audio.load();
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }

    return () => {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, [audioSrc, autoplay, isSeeking, onAudioEnded]);

  return {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handlePlay,
    handlePause,
    handlePlayPause,
    formatDuration,
    barRef,
    handleSeekStart,
    handleSeekMove,
    handleSeekEnd,
  };
};

export default useAudioPlayer;
