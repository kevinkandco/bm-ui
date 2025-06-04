
import { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, CheckSquare, Clock, ArrowUp, ArrowDown, Play, Pause, Bookmark, BookmarkPlus } from "lucide-react";
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

const BaseURL = import.meta.env.VITE_API_HOST;
interface BriefModalProps {
  open: boolean;
  onClose: () => void;
  briefId: number;
}

const AudioWave = ({ isPlaying, currentTime = 28, duration = 63 }: { isPlaying: boolean; currentTime?: number; duration?: number }) => {
  const [bookmarks, setBookmarks] = useState<number[]>([15, 35]);
  
  const addBookmark = () => {
    if (!bookmarks.includes(currentTime)) {
      setBookmarks([...bookmarks, currentTime].sort((a, b) => a - b));
    }
  };

  // Generate smooth wave points
  const generateWavePoints = (amplitude: number, frequency: number, phase: number = 0) => {
    const points = [];
    const width = 100; // percentage
    const steps = 200; // More steps for smoother curve
    
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const y = 50 + amplitude * Math.sin((i / steps) * frequency * Math.PI * 2 + phase);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  const currentProgress = (currentTime / duration) * 100;

  return (
    <div className="relative w-full">
      {/* Smooth Wave Visualization */}
      <div className="h-16 w-full relative overflow-hidden rounded-lg bg-gray-900/30 border border-gray-700/40">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Background waves - multiple layers for depth */}
          <polyline
            points={generateWavePoints(12, 3, 0)}
            fill="none"
            stroke="rgba(107, 114, 128, 0.2)"
            strokeWidth="0.5"
            className={isPlaying ? "animate-pulse" : ""}
          />
          <polyline
            points={generateWavePoints(8, 5, Math.PI / 4)}
            fill="none"
            stroke="rgba(107, 114, 128, 0.25)"
            strokeWidth="0.8"
            className={isPlaying ? "animate-pulse" : ""}
            style={{ animationDelay: '0.2s' }}
          />
          <polyline
            points={generateWavePoints(15, 2, Math.PI / 2)}
            fill="none"
            stroke="rgba(107, 114, 128, 0.15)"
            strokeWidth="0.3"
            className={isPlaying ? "animate-pulse" : ""}
            style={{ animationDelay: '0.4s' }}
          />
          
          {/* Main active wave - changes color based on progress */}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset={`${currentProgress}%`} stopColor="#10B981" />
              <stop offset={`${currentProgress}%`} stopColor="rgba(107, 114, 128, 0.4)" />
            </linearGradient>
          </defs>
          
          <polyline
            points={generateWavePoints(20, 4, 0)}
            fill="none"
            stroke="url(#waveGradient)"
            strokeWidth="2"
            className={`transition-all duration-300 ${isPlaying ? 'animate-pulse' : ''}`}
            style={{ 
              filter: isPlaying ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' : '',
              animationDuration: '1.5s'
            }}
          />
          
          {/* Flowing overlay wave when playing */}
          {isPlaying && (
            <polyline
              points={generateWavePoints(25, 3, 0)}
              fill="none"
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              className="animate-pulse"
              style={{ 
                animationDuration: '2s',
                filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))'
              }}
            />
          )}
          
          {/* Progress indicator line */}
          <line
            x1={currentProgress}
            y1="0"
            x2={currentProgress}
            y2="100"
            stroke="#E5E7EB"
            strokeWidth="0.8"
            opacity="0.9"
          />
        </svg>
        
        {/* Bookmarks */}
        {bookmarks.map((bookmark) => (
          <div
            key={bookmark}
            className="absolute top-0 w-0.5 h-16 bg-amber-400 rounded-full"
            style={{ left: `${(bookmark / duration) * 100}%` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-amber-400 rounded-full flex items-center justify-center">
              <Bookmark className="w-1.5 h-1.5 text-amber-900" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Time labels and topics */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <div>{Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}</div>
        <div className="hidden sm:flex flex-1 justify-around px-4">
          <div className="text-emerald-400 text-xs cursor-pointer hover:text-emerald-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 18])}>Q4 Planning</div>
          <div className="text-teal-400 text-xs cursor-pointer hover:text-teal-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 38])}>Project Deadlines</div>
          <div className="text-red-400 text-xs cursor-pointer hover:text-red-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 52])}>Urgent Email</div>
        </div>
        <div>1:03</div>
      </div>
      
      {/* Mobile topic indicators */}
      <div className="sm:hidden flex justify-center space-x-4 mt-1 text-xs">
        <div className="text-emerald-400 cursor-pointer hover:text-emerald-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 18])}>Q4</div>
        <div className="text-teal-400 cursor-pointer hover:text-teal-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 38])}>Deadlines</div>
        <div className="text-red-400 cursor-pointer hover:text-red-300 transition-colors" onClick={() => setBookmarks([...bookmarks, 52])}>Urgent</div>
      </div>
      
      {/* Bookmark button */}
      <div className="absolute -top-8 right-0">
        <Button
          size="icon"
          variant="outline"
          className="h-6 w-6 border-amber-400/40 hover:bg-amber-400/10 transition-colors"
          onClick={addBookmark}
        >
          <BookmarkPlus className="h-3 w-3 text-amber-400" />
        </Button>
      </div>
    </div>
  );
};


const BriefModal = ({ open, onClose, briefId }: BriefModalProps) => {
  const [showTranscript, setShowTranscript] = useState(false);
  const [showMessageTranscript, setMessageTranscript] = useState({
    open: false,
    index: null
  });
  const [brief, setBrief] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const {getUnreadCount} = useBriefStore();
  const {
    audioRef,
    isPlaying,
    currentTime,
    duration,
    handleTimeUpdate,
    handlePlayPause,
    formatDuration,
    barRef,
    handleSeekStart,
    handleSeekEnd,
    handleSeekMove,
  } = useAudioPlayer(brief?.audioPath ? BaseURL + brief?.audioPath : null, false);
  const { call } = useApi();
  const getBrief = useCallback(async (): Promise<void> => {
    setLoading(true);

    const response = await call("get", `/api/summary/${briefId}/show`, {
      showToast: true,
      toastTitle: "Failed to fetch brief",
      toastDescription: "Could not retrieve brief data.",
      returnOnFailure: false,
    });

    if (response) {
      setBrief(response?.data);
      getUnreadCount();
    }

    setLoading(false);
  }, [call, briefId, getUnreadCount]);


  useEffect(() => {
		if (briefId) {
			getBrief();
		}

		return () => {
			setShowTranscript(false);
			setMessageTranscript({
				open: false,
				index: null,
			});

			setBrief(null);
		};
	}, [briefId, getBrief]);

  const handleClose = () => {
    setShowTranscript(false);
    setMessageTranscript({
      open: false,
      index: null
    })
  };

  const handleOpen = () => {
    setShowTranscript(true);
  };

  const handleMessageTranscriptOpen = (index: number) => {
    setMessageTranscript({
      open: true,
      index: index
    })
  }

  // const [isPlaying, setIsPlaying] = useState(false);

  // const togglePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-gray-700/40 p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 md:px-6 py-3 border-b border-gray-700/40 flex-shrink-0">
            <DialogTitle className="text-lg font-medium text-gray-100">Brief Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 md:px-6 py-4 space-y-4">
              <p className="text-gray-200 text-sm md:text-base">
                I've been monitoring your channels for <span className="font-semibold text-emerald-400">1.25 hrs</span>. 
                Here's a brief of what you missed while you were away:
              </p>
              
              {/* Summary Cards - More compact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm">
                  <h3 className="text-gray-400 text-xs mb-1">Messages Analyzed</h3>
                  <p className="text-xl md:text-2xl font-medium text-gray-100">349</p>
                  <p className="text-gray-500 text-xs">Emails, Threads, Messages</p>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm">
                  <h3 className="text-gray-400 text-xs mb-1">Estimated Time Saved</h3>
                  <p className="text-xl md:text-2xl font-medium text-gray-100">48 Minutes</p>
                  <div className="flex gap-1 mt-1">
                    <div className="w-4 h-4 bg-gray-700/60 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">T</span>
                    </div>
                    <div className="w-4 h-4 bg-gray-700/60 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">M</span>
                    </div>
                    <div className="w-4 h-4 bg-gray-700/60 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">S</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-3 shadow-sm sm:col-span-2 lg:col-span-1">
                  <h3 className="text-gray-400 text-xs mb-1">Tasks Found</h3>
                  <p className="text-xl md:text-2xl font-medium text-gray-100">4</p>
                  <p className="text-gray-500 text-xs">Detected and Saved</p>
                </div>
              </div>
              
              {/* Audio Brief Section - More compact */}
              <div className="bg-gray-800/60 rounded-lg border border-gray-700/40 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-100 text-sm md:text-base">Afternoon Catch-up Brief</h3>
                    <p className="text-gray-400 text-xs">2:00 PM - 4:30 PM Updates</p>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full self-start">
                    1.25 hrs summarized in 1:03
                  </span>
                </div>
                
                <p className="text-xs text-gray-300 mb-3">
                  A summary of <span className="font-medium">5 important messages</span> from Slack and{" "}
                  <span className="font-medium">3 emails</span> requiring your attention. 
                  Key topics include the Q4 planning meeting and project deadlines.
                </p>
                
                {/* Audio Wave Component */}
                <div className="mb-3 relative">
                  <AudioWave isPlaying={isPlaying} />
                </div>
                
                {/* Audio controls - More compact */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button variant="outline" size="sm" className="text-teal-400 border-gray-600/50 hover:bg-gray-700/50 w-full sm:w-auto text-xs h-7">
                    Skip Section
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-6 w-6 border-gray-600/50 hover:bg-gray-700/50">
                      <ArrowDown className="h-3 w-3 text-gray-300" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-gray-600/50 hover:bg-gray-700/50">
                      <ArrowUp className="h-3 w-3 text-gray-300" />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="outline" 
                      className="h-8 w-8 rounded-full border-emerald-500 bg-emerald-500/20 hover:bg-emerald-500/30"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Play className="h-3 w-3 text-emerald-400" />
                      )}
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-gray-600/50 hover:bg-gray-700/50">
                      <ArrowDown className="h-3 w-3 text-gray-300" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-gray-600/50 hover:bg-gray-700/50">
                      <ArrowUp className="h-3 w-3 text-gray-300" />
                    </Button>
                  </div>
                  
                  <span className="text-xs font-medium text-gray-300">01:03</span>
                </div>
                
                <div className="mt-2 text-center sm:text-right">
                  <Button variant="link" className="text-teal-400 hover:text-teal-300 text-xs p-0 h-auto">
                    View Transcript
                  </Button>
                </div>
              </div>
              
              {/* Recent Messages - Compact cards matching home dashboard style */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-100 mb-3">Recent Messages</h3>
                
                {/* Mobile: Compact card layout */}
                <div className="block md:hidden space-y-2">
                  {[
                    { 
                      platform: "S", 
                      message: "Daily Standup Notes", 
                      sender: "@devops", 
                      time: "08:00 AM",
                      priority: "High", 
                    },
                    { 
                      platform: "M", 
                      message: "Project Deadline Reminder", 
                      sender: "ali@apple.com", 
                      time: "09:00 AM",
                      priority: "Medium", 
                    },
                    { 
                      platform: "M", 
                      message: "Urgent Client Request", 
                      sender: "jane@apple.com", 
                      time: "10:00 AM",
                      priority: "High", 
                    },
                    { 
                      platform: "M", 
                      message: "Lunch Meeting Agenda", 
                      sender: "john@apple.com", 
                      time: "12:00 PM",
                      priority: "Low", 
                    },
                    { 
                      platform: "M", 
                      message: "Feedback on Design Mockup", 
                      sender: "design@brief.me", 
                      time: "02:00 PM",
                      priority: "Medium", 
                    },
                  ].map((message, i) => (
                    <div key={i} className="transition-all duration-300 cursor-pointer rounded-lg overflow-hidden hover:scale-[1.01] bg-gradient-to-r from-gray-800/40 to-gray-700/40 border border-gray-700/40 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-gray-800/60 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-gray-300">{message.platform}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-100 text-xs truncate">{message.message}</h4>
                            <p className="text-gray-400 text-xs truncate">{message.sender} • {message.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            message.priority === "High" 
                              ? "bg-red-500/20 text-red-400" 
                              : message.priority === "Medium"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-emerald-500/20 text-emerald-400"
                          }`}>
                            {message.priority}
                          </span>
                          <Button variant="link" className="text-teal-400 p-0 h-auto text-xs hover:text-teal-300">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Compact table layout */}
                <div className="hidden md:block bg-gray-800/40 rounded-lg border border-gray-700/40 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-700/40 bg-gray-800/60">
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Platform</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Message</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Sender</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Time</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Priority</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-gray-400">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { 
                            platform: "S", 
                            message: "Daily Standup Notes", 
                            sender: "@devops", 
                            time: "08:00 AM",
                            priority: "High", 
                          },
                          { 
                            platform: "M", 
                            message: "Project Deadline Reminder", 
                            sender: "ali@apple.com", 
                            time: "09:00 AM",
                            priority: "Medium", 
                          },
                          { 
                            platform: "M", 
                            message: "Urgent Client Request", 
                            sender: "jane@apple.com", 
                            time: "10:00 AM",
                            priority: "High", 
                          },
                          { 
                            platform: "M", 
                            message: "Lunch Meeting Agenda", 
                            sender: "john@apple.com", 
                            time: "12:00 PM",
                            priority: "Low", 
                          },
                          { 
                            platform: "M", 
                            message: "Feedback on Design Mockup", 
                            sender: "design@brief.me", 
                            time: "02:00 PM",
                            priority: "Medium", 
                          },
                        ].map((message, i) => (
                          <tr key={i} className="border-b border-gray-700/40 hover:bg-gray-800/40 transition-colors">
                            <td className="py-2 px-3">
                              <div className="w-5 h-5 rounded-md bg-gray-800/60 flex items-center justify-center">
                                <span className="text-xs text-gray-300">{message.platform}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-medium text-gray-100 text-sm">{message.message}</td>
                            <td className="py-2 px-3 text-gray-300 text-sm">{message.sender}</td>
                            <td className="py-2 px-3 text-gray-400 text-sm">{message.time}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                message.priority === "High" 
                                  ? "bg-red-500/20 text-red-400" 
                                  : message.priority === "Medium"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-emerald-500/20 text-emerald-400"
                              }`}>
                                {message.priority}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <Button variant="link" className="text-teal-400 p-0 h-auto text-sm hover:text-teal-300">
                                View Transcript
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <ViewTranscript
        open={showTranscript || showMessageTranscript?.open}
        summary={showTranscript ? brief?.summary : brief?.messages?.[showMessageTranscript?.index]?.message}
        onClose={handleClose}
      />
    </Dialog>
  );
};

export default BriefModal;
