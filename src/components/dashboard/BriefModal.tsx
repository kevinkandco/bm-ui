import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Mail,
  MessageSquare,
  CheckSquare,
  Clock,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Bookmark,
  BookmarkPlus,
  X,SkipForward, SkipBack, Volume2, Download, Share, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Audio from "./Audio";
import useAudioPlayer from "@/hooks/useAudioPlayer";
import { Summary } from "./types";
import ViewTranscript from "./ViewTranscript";
import { capitalizeFirstLetter } from "@/lib/utils";
import BriefLoadingSkeleton from "./BriefLoadingSkeleton";
import { useBriefStore } from "@/store/useBriefStore";
import { useApi } from "@/hooks/useApi";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import BriefModalSkeleton from "./BriefModalSkeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ActionItemFeedback from "./ActionItemFeedback";
import AddMissingContent from "./AddMissingContent";
import { useFeedbackTracking } from "./useFeedbackTracking";

const BaseURL = import.meta.env.VITE_API_HOST;
interface BriefModalProps {
  open: boolean;
  onClose: () => void;
  briefId: number;
  getRecentBriefs?: () => void;
}

const BriefModal = ({ open, onClose, briefId, getRecentBriefs=() => {} }: BriefModalProps) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showMessageTranscript, setMessageTranscript] = useState({
    open: false,
    message: "",
  });
  const [briefData, setBriefData] = useState<Summary | null>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'none' | 'up' | 'down'>('none');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const { getUnreadCount } = useBriefStore();
  const { handleSummaryFeedback, handleActionRelevance, handleAddMissingContent } = useFeedbackTracking(getRecentBriefs);
  const { call } = useApi();
  const { toast } = useToast();
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handlePlayPause,
    formatDuration,
    barRef,
    handlePause,
    handleSeekStart,
    handleSeekEnd,
    handleSeekMove,
  } = useAudioPlayer(
    briefData?.audioPath ? BaseURL + briefData?.audioPath : null,
    false
  );

  const getBriefData = useCallback(async (): Promise<void> => {
    setLoading(true);

    const response = await call("get", `/api/summary/${briefId}/show`, {
      showToast: true,
      toastTitle: "Failed to fetch brief",
      toastDescription: "Could not retrieve brief data.",
      returnOnFailure: false,
    });

    if (response) {
      setBriefData(response?.data);
      getUnreadCount();
      setFeedbackState(response?.data?.vote ? response?.data?.vote === "like" ? "up" : "down" : "none");
    }

    setLoading(false);
  }, [call, briefId, getUnreadCount]);

  useEffect(() => {
    if (briefId) {
      getBriefData();
    }

    return () => {
      setShowTranscript(false);
      setMessageTranscript({
        open: false,
        message: '',
      });

      setBriefData(null);
    };
  }, [briefId, getBriefData]);

  // Sample data matching the image

  const sections = useMemo(() => briefData?.sections || [], [briefData?.sections]);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // useEffect(() => {
  //   let interval: NodeJS.Timeout;
  //   if (isPlaying) {
  //     interval = setInterval(() => {
  //       setCurrentTime(prev => {
  //         if (prev >= duration) {
  //           setIsPlaying(false);
  //           return duration;
  //         }
  //         return prev + 1;
  //       });
  //     }, 1000);
  //   }
  //   return () => clearInterval(interval);
  // }, [isPlaying, duration]);

  const handleClose = () => {
    setShowTranscript(false);
    setMessageTranscript({
      open: false,
      message: '',
    });
    handlePause();
    onClose();
  };

  const handleTranscriptClose = () => {
    setShowTranscript(false);
    setMessageTranscript({
      open: false,
      message: '',
    });
  };

  const handleTranscriptOpen = () => {
    setShowTranscript(true);
  };

  const handleMessageTranscriptOpen = (message: string) => {
    setMessageTranscript({
      open: true,
      message,
    });
  };

  const handlePlayStopBrief = useCallback(
      () => {
        if (!briefData?.audioPath) {
          toast({
            title: "Audio not found",
            description: `Audio not found, please try again`,
            variant: "destructive",
          })
          return;
        }
        handlePlayPause();
      },
      [toast, handlePlayPause, briefData?.audioPath]
    );

    const timeRange =
    briefData?.start_at && briefData?.ended_at
      ? `${briefData?.start_at} - ${briefData?.ended_at} Updates`
      : "";

  useEffect(() => {
    // Update current section based on timestamp
    const currentSectionIndex = sections.findIndex((section, index) => {
      const nextSection = sections[index + 1];
      return currentTime >= section.timestamp && (!nextSection || currentTime < nextSection.timestamp);
    });
    if (currentSectionIndex !== -1) {
      setCurrentSection(currentSectionIndex);
    }
  }, [currentTime, sections]);

  useEffect(() => {
    // Hide tooltip after 3 seconds or 3 interactions
    if (showTooltip) {
      const timer = setTimeout(() => setShowTooltip(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // const togglePlayback = () => setIsPlaying(!isPlaying);

  const skipToSection = (sectionIndex: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = sections[sectionIndex].timestamp;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFeedback = async (type: 'up' | 'down') => {
    if (feedbackState !== 'none') return;
    
    setFeedbackState(type);
    
    if (type === 'up') {
      await handleSummaryFeedback(briefData.id, 'up');
    } else {
      setShowCommentInput(true);
    }
  };

  const handleCommentSubmit = async () => {
    if (comment.trim()) {
      await handleSummaryFeedback(briefData.id, 'down', comment.trim());
      setComment("");
    } else {
      await handleSummaryFeedback(briefData.id, 'down');
    }
    setShowCommentInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommentSubmit();
    }
  };

  const handleActionItemRelevance = async (itemId: string, relevant: boolean) => {
    await handleActionRelevance(briefData.id, itemId, relevant);
  };

  const handleAddMissing = async (content: string) => {
    await handleAddMissingContent(briefData.id, content);
  };

const handleDownload = async () => {
  try {
    const response = await call("get", briefData?.audioPath);

    const contentType = response.headers.get("Content-Type");

    if (!response.ok || !contentType?.includes("audio")) {
      const text = await response.text();
      console.error("Not an audio file, got:", text.slice(0, 200));
      return;
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "summary_2055.mp3";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed", error);
  }
};



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-[#1a1f23] border-[#2a3038] text-white overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          {briefData ? (<div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-white">{briefData?.title}</h2>
                  <div className="text-sm text-primary-teal mt-4">{briefData?.duration} summarized in {formatDuration(duration)}</div>
                </div>
                <div className="text-sm text-gray-400 mb-3">{timeRange}</div>
                {briefData?.status === "failed" && <p className="text-red-500 text-sm md:text-base mb-3">
                  Failed to Generate Summary: {briefData?.error ? briefData?.error : 'Something went wrong'}
                </p>}
                <p className="text-gray-300 mb-4">{briefData?.description}</p>
                
                {/* Feedback Controls */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback('up')}
                      disabled={feedbackState !== 'none'}
                      className={`h-8 w-8 p-0 transition-all ${
                        feedbackState === 'up' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'text-gray-400 hover:text-green-400'
                      }`}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback('down')}
                      disabled={feedbackState !== 'none'}
                      className={`h-8 w-8 p-0 transition-all ${
                        feedbackState === 'down' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'text-gray-400 hover:text-red-400'
                      }`}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Feedback Badge */}
                  {feedbackState === 'up' && (
                    <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/40">
                      Rated 👍
                    </Badge>
                  )}
                  {feedbackState === 'down' && !showCommentInput && (
                    <Badge variant="secondary" className="text-xs bg-red-500/20 text-red-400 border-red-500/40">
                      Rated 👎
                    </Badge>
                  )}
                </div>

                {/* Comment Input for downvote */}
                {showCommentInput && (
                  <div className="mt-3 animate-fade-in">
                    <Input
                      placeholder="What did we miss?"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      onBlur={handleCommentSubmit}
                      className="bg-[#1a1f23] border-gray-600 text-white placeholder-gray-400"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Stats Cards - Smaller */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#2a3038] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Messages Analyzed</div>
                <div className="text-lg font-bold text-white">{briefData?.messagesCount}</div>
                <div className="text-xs text-gray-500">Emails, Threads, Messages</div>
              </div>
              <div className="bg-[#2a3038] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Estimated Time Saved</div>
                <div className="text-lg font-bold text-white">{briefData?.savedTime} Minutes</div>
                <div className="text-xs text-gray-500">T M S</div>
              </div>
              <div className="bg-[#2a3038] rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Tasks Found</div>
                <div className="text-lg font-bold text-white">{briefData?.taskCount}</div>
                <div className="text-xs text-gray-500">Detected and Saved</div>
              </div>
            </div>

            {/* Audio Player - Restored Design */}
            <div className="bg-[#1a1f23] rounded-lg p-6 mb-6 border border-[#2a3038]">
              {/* Waveform Visualization */}
              <div
              ref={barRef}
                onMouseDown={handleSeekStart}
                onMouseMove={handleSeekMove}
                onMouseUp={handleSeekEnd}
                onTouchStart={handleSeekStart}
                onTouchMove={handleSeekMove}
                onTouchEnd={handleSeekEnd}

              className="relative mb-6 h-16 bg-gradient-to-r from-transparent via-primary-teal/20 to-transparent rounded-lg flex items-center justify-center overflow-hidden">
                {/* Simple waveform representation */}
                <div className="flex items-center gap-1 h-full w-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 bg-gradient-to-t ${
                        i < (progress / 100) * 100 
                          ? 'from-primary-teal to-primary-teal/50' 
                          : 'from-gray-600 to-gray-700'
                      }`}
                      style={{
                        height: `${Math.random() * 40 + 20}%`,
                      }}
                    />
                  ))}
                </div>
                <Audio
                  audioSrc={
                    briefData?.audioPath ? BaseURL + briefData?.audioPath : null
                  }
                  audioRef={audioRef}
                />
                
                {/* Section markers */}
                {sections.map((section, index) => (
                  <div
                    key={index}
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-500"
                    style={{ left: `${(section.timestamp / duration) * 100}%` }}
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
                
                {/* Current position marker */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white"
                  style={{ left: `${progress}%` }}
                />
              </div>

              {/* Section Labels */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <div className="text-gray-400">{formatDuration(currentTime)}</div>
                {sections.map((section, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`text-xs ${currentSection === index ? 'text-primary-teal' : 'text-gray-400'}`}>
                      {section.title}
                    </div>
                  </div>
                ))}
                <div className="text-gray-400">{formatDuration(duration)}</div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button onClick={handlePlayStopBrief} size="icon" className="bg-primary-teal hover:bg-primary-teal/80 text-white w-12 h-12">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Section Navigation */}
              <div className="space-y-2 mb-4">
                {sections.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => skipToSection(index)}
                    className={`w-full text-left p-2 rounded transition-colors ${
                      currentSection === index 
                        ? 'bg-primary-teal/20 text-primary-teal' 
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{section.title}</span>
                      <span className="text-xs text-gray-400">{formatTime(section.timestamp)}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:text-white">
                  <Share className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button onClick={handleTranscriptOpen} variant="outline" size="sm" className="border-gray-600 text-primary-teal hover:text-primary-teal/80 ml-auto">
                  View Transcript
                </Button>
              </div>
            </div>

            {/* Recent Messages Table */}
            {(briefData && briefData.messages && briefData.messages.length > 0) && <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Messages</h3>
              <div className="bg-[#2a3038] rounded-lg overflow-hidden">
                <div className="grid grid-cols-6 gap-4 p-3 bg-[#1a1f23] text-sm text-gray-400">
                  <div>Platform</div>
                  <div>Message</div>
                  <div>Sender</div>
                  <div>Time</div>
                  <div>Priority</div>
                  <div>Action</div>
                </div>
                {briefData?.messages.map((message, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 p-3 border-t border-gray-700 text-sm">
                    <div className="text-white font-mono break-all">{message.platform}</div>
                    <div className="text-white break-all">{message.title}</div>
                    <div className="text-gray-300 break-all">{message.sender}</div>
                    <div className="text-gray-400 break-all">{message.time}</div>
                    <div>
                      <Badge 
                        variant={capitalizeFirstLetter(message.priority) === 'High' ? 'destructive' : capitalizeFirstLetter(message.priority) === 'Medium' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {capitalizeFirstLetter(message.priority)}
                      </Badge>
                    </div>
                    <div>
                      <Button onClick={() => handleMessageTranscriptOpen(message?.message)} variant="ghost" size="sm" className="text-primary-teal hover:text-primary-teal/80 text-xs">
                        View Transcript
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>}

            {/* Action Items */}
            {/* <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Action Items</h3>
              <div className="space-y-3">
                {briefData.actionItems.map((item) => (
                  <div key={item.id} className="group flex items-start gap-3 p-3 rounded-lg bg-[#2a3038]">
                    <div className="w-2 h-2 bg-primary-teal rounded-full mt-2 flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white">{item.text}</p>
                      <Badge 
                        variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {item.priority} priority
                      </Badge>
                    </div>
                    <ActionItemFeedback 
                      itemId={item.id}
                      onRelevanceFeedback={handleActionItemRelevance}
                    />
                  </div>
                ))}
              </div>
            </div> */}

            {/* Add Missing Content */}
            {/* <AddMissingContent onAddContent={handleAddMissing} /> */}
          </div>) : <BriefModalSkeleton />}
        </ScrollArea>
      </DialogContent>
      <ViewTranscript
        open={showTranscript || showMessageTranscript?.open}
        summary={
          showTranscript
            ? briefData?.summary
            : showMessageTranscript.message
        }
        onClose={handleTranscriptClose}
      />
    </Dialog>
  );
};

export default BriefModal;
