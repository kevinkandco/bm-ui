import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";

const Audio = ({
	audioSrc,
	audioRef,
	handleTimeUpdate,
}: {
	audioSrc: string;
	audioRef: React.MutableRefObject<HTMLAudioElement>;
	handleTimeUpdate: () => void;
}) => {
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const updateTimeAndDuration = () => handleTimeUpdate();

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", updateTimeAndDuration);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", updateTimeAndDuration);
		};
	}, [audioRef, handleTimeUpdate]);

	return <audio ref={audioRef} src={audioSrc} className="hidden" />;
};

export default Audio;
