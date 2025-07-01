import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import Audio from "@/components/dashboard/Audio";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { AUDIO_URL } from "@/config";

interface Voice {
  id: number;
  voiceId: string;
  name: string;
  description: string;
  audio_path: string;
  avatar: string;
  is_active: boolean;
}

const Voices = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [voices, setVoices] = useState<Voice[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const { call } = useApi();

  const currentAudioUrl = useMemo(() => {
    const audioPath = voices.find((v) => v.id === playingId)?.audio_path;
    if (!audioPath) return null;
    return audioPath.includes("storage") ? AUDIO_URL + audioPath : audioPath;
  }, [voices, playingId]);

  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handleSeekStart,
    handleSeekMove,
    handleSeekEnd,
    handlePlayPause,
    barRef,
    formatDuration,
  } = useAudioPlayer(currentAudioUrl, true);

  const getVoices = useCallback(async () => {
    const response = await call("get", `/settings/voice-tones`, {
      showToast: true,
      toastTitle: "Error",
      toastDescription: "Failed to fetch voices",
      toastVariant: "destructive",
    });
    if (response?.data) {
      setVoices(response.data);
    }
  }, [call]);

  useEffect(() => {
    getVoices();
  }, [getVoices]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [audioRef]);

  const handlePlayClick = useCallback(
  (voice: Voice) => {
    if (playingId !== voice.id) {
      setPlayingId(voice.id);
    } else {
      handlePlayPause();
    }
  },
  [playingId, handlePlayPause]
);

 const setVoiceActive = useCallback(async (voice_id: number, status: boolean) => {
  const response = await call("post", `/settings/voice-tones/status-update`, {
      showToast: true,
      toastTitle: "Error",
      toastDescription: "Failed to fetch voices",
      toastVariant: "destructive",
      body: {
        voice_id
       }
    });
    if (response) {
      getVoices();
      toast({
        title: "Success",
        description: response?.message || "Status updated successfully"
      });
    }
 }, [call, getVoices, toast]);


  const voiceItems = useMemo(
    () =>
      voices.map((voice) => (
        <div
          key={voice.id}
          className="flex flex-col gap-2 py-3 px-3 rounded-lg transition-all duration-300 border bg-white/5 hover:bg-white/10 backdrop-blur-md border-white/10"
        >
          <div className="flex items-center">
            {/* <div className="w-8 h-8 bg-gray-800/90 rounded-full mr-3" /> */}
            <div className="w-8 h-8 flex items-center justify-center bg-deep-plum rounded-full mr-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={voice?.avatar ? voice?.avatar : `https://ui-avatars.com/api/?background=random&color=random&rounded=true&name=${voice?.name}`} alt={voice?.name} />
                <AvatarFallback className="bg-accent-primary/20 text-accent-primary">
                  {voice?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
          </div>
            <div className="flex-grow">
              <h4 className={cn("font-medium text-text-primary",
                isMobile ? "text-sm" : "text-base"
              )}>
                {voice.name}
              </h4>
              {!isMobile && (
                <p className="text-xs text-text-secondary">{voice.description}</p>
              )}
            </div>
            <div className="pr-4">

            <Switch
                id="include-in-summary"
                checked={voice?.is_active}
                onCheckedChange={(status) => setVoiceActive(voice?.id, status)}
                // className="data-[state=checked]:bg-glass-blue data-[state=unchecked]:bg-glass-black"
                />
                </div>
            <button
              onClick={() => handlePlayClick(voice)}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              aria-label={
                isPlaying && playingId === voice.id ? "Pause" : "Play"
              }
            >
              {isPlaying && playingId === voice.id ? (
                <Pause size={16} />
              ) : (
                <Play size={16} className="ml-0.5" />
              )}
            </button>
          </div>

          {playingId === voice.id && (
            <div className="flex flex-col mt-2">
              <div
                ref={barRef}
                onMouseDown={handleSeekStart}
                onMouseMove={handleSeekMove}
                onMouseUp={handleSeekEnd}
                onTouchEnd={handleSeekEnd}
                className="h-2 bg-gray-300 rounded overflow-hidden cursor-pointer relative group"
                aria-valuemin={0}
                aria-valuemax={duration}
                aria-valuenow={currentTime}
                role="slider"
              >
                <div
                  className="h-full bg-blue-600 relative"
                  style={{
                    width: `${(currentTime / duration) * 100 || 0}%`,
                  }}
                >
                  <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-text-secondary mt-1">
                <span>{formatDuration(currentTime)}</span>
                <span>{formatDuration(duration)}</span>
              </div>
            </div>
          )}
        </div>
      )),
    [
      voices,
      isMobile,
      playingId,
      isPlaying,
      handlePlayClick,
      barRef,
      handleSeekStart,
      handleSeekMove,
      handleSeekEnd,
      currentTime,
      duration,
      formatDuration,
      setVoiceActive
    ]
  );

  return (
    <div className="md:col-span-3 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Voice Settings
      </h2>

      <div className="space-y-4 max-w-[98%]">{voiceItems}</div>

      <Audio
        audioSrc={currentAudioUrl}
        audioRef={audioRef}
      />
    </div>
  );
};

export default Voices;
