import useAudioPlayer from "@/hooks/useAudioPlayer";
import { useEffect } from "react";

const Audio = ({
	audioSrc,
	audioRef,
	handleTimeUpdate,
}: {
	audioSrc: string;
	audioRef: React.MutableRefObject<HTMLAudioElement>;
	handleTimeUpdate?: () => void;
}) => {
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		let updateTimeAndDuration: () => void;

		if (handleTimeUpdate) {
			updateTimeAndDuration = () => handleTimeUpdate();

			audio.addEventListener("timeupdate", handleTimeUpdate);
			audio.addEventListener("loadedmetadata", updateTimeAndDuration);
		}

		return () => {
			if(handleTimeUpdate) {
				audio.removeEventListener("timeupdate", handleTimeUpdate);
				audio.removeEventListener("loadedmetadata", updateTimeAndDuration);
			}
		};
	}, [audioRef, handleTimeUpdate]);

	if (!audioSrc) {
		audioRef.current = null; // Reset the audioRef if no audioSrc is provided
		return null; // Return null if audioSrc is not provided
	}

	return <audio ref={audioRef} src={audioSrc} className="hidden" />;
};

export default Audio;
