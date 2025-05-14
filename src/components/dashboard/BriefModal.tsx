
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, CheckSquare, Clock, ArrowUp, ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import Audio from "./Audio";
import useAudioPlayer from "@/hooks/useAudioPlayer";

interface BriefModalProps {
  open: boolean;
  onClose: () => void;
}

const BriefModal = ({ open, onClose }: BriefModalProps) => {
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
		} = useAudioPlayer();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto bg-white/80 backdrop-blur-md border border-white/30">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-deep-teal">Brief Details</DialogTitle>
        </DialogHeader>
        
        <div className="p-2">
          <p className="text-deep-teal/90 mb-6 text-lg">I've been monitoring your channels for <span className="font-semibold text-glass-blue">1.25 hrs</span>. Here's a brief of what you missed while you were away:</p>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/50 rounded-lg border border-white/50 p-5 shadow-sm">
              <h3 className="text-deep-teal/90 text-sm mb-1">Messages Analyzed</h3>
              <p className="text-4xl font-medium text-deep-teal">349</p>
              <p className="text-deep-teal/80 text-sm">Emails, Threads, Messages</p>
            </div>
            
            <div className="bg-white/50 rounded-lg border border-white/50 p-5 shadow-sm">
              <h3 className="text-deep-teal/90 text-sm mb-1">Estimated Time Saved</h3>
              <p className="text-4xl font-medium text-deep-teal">48 Minutes</p>
              <div className="flex gap-2 mt-1">
                <div className="w-5 h-5 bg-white/70 rounded-full flex items-center justify-center">
                  <span className="text-xs">T</span>
                </div>
                <div className="w-5 h-5 bg-white/70 rounded-full flex items-center justify-center">
                  <span className="text-xs">M</span>
                </div>
                <div className="w-5 h-5 bg-white/70 rounded-full flex items-center justify-center">
                  <span className="text-xs">S</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/50 rounded-lg border border-white/50 p-5 shadow-sm">
              <h3 className="text-deep-teal/90 text-sm mb-1">Tasks Found</h3>
              <p className="text-4xl font-medium text-deep-teal">4</p>
              <p className="text-deep-teal/80 text-sm">Detected and Saved</p>
            </div>
          </div>
          
          {/* Audio Brief Section */}
          <div className="bg-white/50 rounded-lg border border-white/50 p-5 shadow-sm mb-6">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-deep-teal">Afternoon Catch-up Brief</h3>
                <p className="text-deep-teal/80 text-sm">2:00 PM - 4:30 PM Updates</p>
              </div>
              <span className="text-xs bg-glass-blue/10 text-glass-blue px-2 py-1 rounded-full">
                1.25 hrs summarized in {formatDuration(duration)}
              </span>
            </div>
            
            <p className="text-sm text-deep-teal/90 mb-4">
              A summary of <span className="font-medium">5 important messages</span> from Slack and <span className="font-medium">3 emails</span> requiring your attention. 
              Key topics include the Q4 planning meeting and project deadlines.
            </p>
            
            {/* Audio timeline */}
            <div className="mb-4 relative">
              <div
                className="h-6 flex items-center"
                onMouseDown={handleSeekStart}
                onMouseMove={handleSeekMove}
                onMouseUp={handleSeekEnd}
                onMouseLeave={handleSeekEnd}
                ref={barRef}
              >
                {Array.from({ length: 100 }).map((_, index) => (
                  <div
                    key={index}
                    data-value={index + 1}
                    className={`w-1 mx-0.5 rounded-full ${
                      index <= Math.floor((currentTime / duration) * 100)
                        ? 'bg-glass-blue h-4'
                        : 'bg-gray-300/50 h-2'
                    }`}
                  />
                ))}
                <Audio audioSrc="public/audio.mp3" audioRef={audioRef} handleTimeUpdate={handleTimeUpdate} />
              </div>
              
              <div className="flex justify-between text-xs text-deep-teal/70 mt-1">
                <div>{formatDuration(currentTime)}</div>
                <div className="flex-1 flex justify-around">
                  <div className="text-glass-blue">Q4 Planning</div>
                  <div className="text-green-500">Project Deadlines</div>
                  <div className="text-red-400">Urgent Email</div>
                </div>
                <div>{formatDuration(duration)}</div>
              </div>
            </div>
            
            {/* Audio controls */}
            <div className="flex justify-between items-center">
              <Button variant="outline" size="sm" className="text-glass-blue border-white/30">
                Skip Section
              </Button>
              
              <div className="flex items-center gap-3">
                <Button size="icon" variant="outline" className="h-8 w-8 border-white/30">
                  <ArrowDown className="h-4 w-4 text-deep-teal" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 border-white/30">
                  <ArrowUp className="h-4 w-4 text-deep-teal" />
                </Button>
                <Button size="icon" variant="outline" className="h-10 w-10 rounded-full border-glass-blue bg-glass-blue/10" onClick={handlePlayPause}>
                  <div className="h-3 w-3 bg-glass-blue rounded-full"></div>
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 border-white/30">
                  <ArrowDown className="h-4 w-4 text-deep-teal" />
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 border-white/30">
                  <ArrowUp className="h-4 w-4 text-deep-teal" />
                </Button>
              </div>
              
              <span className="text-sm font-medium text-deep-teal">{formatDuration(duration)}</span>
            </div>
            
            <div className="mt-4 text-right">
              <Button variant="link" className="text-glass-blue">
                View Transcript
              </Button>
            </div>
          </div>
          
          {/* Recent Messages */}
          <h3 className="text-xl font-semibold text-deep-teal mb-3">Recent Messages</h3>
          
          <div className="bg-white/50 rounded-lg border border-white/50 shadow-sm overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-white/30 bg-white/40">
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Platform</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Message</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Sender</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Time</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Priority</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80">Action</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-deep-teal/80"></th>
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
                  <tr key={i} className="border-b border-white/20 hover:bg-white/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-6 h-6 rounded-md bg-white/70 flex items-center justify-center">
                        <span className="text-xs text-deep-teal">{message.platform}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-deep-teal">{message.message}</td>
                    <td className="py-3 px-4 text-deep-teal/90">{message.sender}</td>
                    <td className="py-3 px-4 text-deep-teal/80">{message.time}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        message.priority === "High" 
                          ? "bg-red-100 text-red-600" 
                          : message.priority === "Medium"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-blue-100 text-blue-600"
                      }`}>
                        {message.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="link" className="text-glass-blue p-0 h-auto text-sm">
                        View Transcript
                      </Button>
                    </td>
                    <td className="py-3 px-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BriefModal;
