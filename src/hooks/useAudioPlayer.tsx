import { useEffect, useRef, useState } from "react";

const useAudioPlayer = (audioSrc: string | null, autoplay: boolean, onAudioEnded?: () => void) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);

	const audioRef = useRef<HTMLAudioElement>(null);
	const barRef = useRef<HTMLDivElement | null>(null);
	const [isSeeking, setIsSeeking] = useState(false);

	useEffect(() => {
    if (!audioSrc) {
		setCurrentTime(0);
		setDuration(0);
		setIsPlaying(false);
      	if (audioRef.current) {
			audioRef.current.pause();
			audioRef.current.currentTime = 0;
      	}
      	return;
    }

	const audio = audioRef.current;
	if (!audio) return;

	const handleEnded = () => {
		setIsPlaying(false);
		setCurrentTime(0); // optional, reset playback time
		if (onAudioEnded) { // Call the callback when audio ends
			onAudioEnded();
		}
	};

	audio.addEventListener("ended", handleEnded);


    if (audioRef.current && autoplay) {
    	audioRef.current.load();
    	audioRef.current.play().then(() => {
			setIsPlaying(true);
		}).catch((err) => {
    		console.warn("Autoplay failed", err);
			setIsPlaying(false);
    	});
    }
  }, [audioSrc, autoplay]);

	const handleSeekStart = (e: React.MouseEvent) => {
		setIsSeeking(true);
		seekToPosition(e);
	};

	const handleSeekMove = (e: React.MouseEvent) => {
		if (!isSeeking) return;
		seekToPosition(e);
	};

	const seekToPosition = (e: React.MouseEvent) => {
		if (!barRef.current || !audioRef.current || !duration) return;

		const rect = barRef.current.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = Math.min(Math.max(x / rect.width, 0), 1);
		audioRef.current.currentTime = percentage * duration;
	};

	const handleSeekEnd = () => {
		setIsSeeking(false);
	};

	//-----

	const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		console.log(e.currentTarget.dataset.value);
		const value = Number(e.currentTarget.dataset.value);
		if (audioRef.current) {
			audioRef.current.currentTime = Math.floor(
				(duration * (value === 1 ? 0 : value)) / 100
			);
		}
		setCurrentTime(value);
	};

	const handleTimeUpdate = () => {
		const audio = audioRef.current;
		if (!audio) return;

		setCurrentTime(audio.currentTime);
		setDuration(audio.duration);
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

	return {
		audioRef,
		isPlaying,
		currentTime,
		duration,
		handleSeek,
		handleTimeUpdate,
		handlePlay,
		handlePause,
		handlePlayPause,
		formatDuration,
		barRef,
		handleSeekStart,
		handleSeekEnd,
		handleSeekMove,
	};
};

export default useAudioPlayer;
