
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, CheckSquare, Clock, ArrowUp, ArrowDown, Play, Pause } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BriefModalProps {
  open: boolean;
  onClose: () => void;
}

const BriefModal = ({ open, onClose }: BriefModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-6xl h-[90vh] max-h-[90vh] overflow-hidden bg-background/80 backdrop-blur-xl border border-white/10 p-0">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-4 md:px-6 py-3 border-b border-white/10 flex-shrink-0">
            <DialogTitle className="text-lg font-medium text-white">Brief Details</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 md:px-6 py-4 space-y-4">
              <p className="text-white/90 text-sm md:text-base">
                I've been monitoring your channels for <span className="font-semibold text-blue-400">1.25 hrs</span>. 
                Here's a brief of what you missed while you were away:
              </p>
              
              {/* Summary Cards - More compact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-white/10 rounded-lg border border-white/10 p-3 shadow-sm">
                  <h3 className="text-white/80 text-xs mb-1">Messages Analyzed</h3>
                  <p className="text-xl md:text-2xl font-medium text-white">349</p>
                  <p className="text-white/70 text-xs">Emails, Threads, Messages</p>
                </div>
                
                <div className="bg-white/10 rounded-lg border border-white/10 p-3 shadow-sm">
                  <h3 className="text-white/80 text-xs mb-1">Estimated Time Saved</h3>
                  <p className="text-xl md:text-2xl font-medium text-white">48 Minutes</p>
                  <div className="flex gap-1 mt-1">
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white/90">T</span>
                    </div>
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white/90">M</span>
                    </div>
                    <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white/90">S</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 rounded-lg border border-white/10 p-3 shadow-sm sm:col-span-2 lg:col-span-1">
                  <h3 className="text-white/80 text-xs mb-1">Tasks Found</h3>
                  <p className="text-xl md:text-2xl font-medium text-white">4</p>
                  <p className="text-white/70 text-xs">Detected and Saved</p>
                </div>
              </div>
              
              {/* Audio Brief Section - More compact */}
              <div className="bg-white/10 rounded-lg border border-white/10 p-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
                  <div>
                    <h3 className="font-semibold text-white text-sm md:text-base">Afternoon Catch-up Brief</h3>
                    <p className="text-white/70 text-xs">2:00 PM - 4:30 PM Updates</p>
                  </div>
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full self-start">
                    1.25 hrs summarized in 1:03
                  </span>
                </div>
                
                <p className="text-xs text-white/80 mb-3">
                  A summary of <span className="font-medium">5 important messages</span> from Slack and{" "}
                  <span className="font-medium">3 emails</span> requiring your attention. 
                  Key topics include the Q4 planning meeting and project deadlines.
                </p>
                
                {/* Audio timeline - More compact */}
                <div className="mb-3 relative">
                  <div className="h-4 flex items-center overflow-hidden">
                    {Array.from({ length: 40 }).map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-1 mx-0.5 rounded-full ${index < 28 ? 'bg-blue-500 h-3' : 'bg-white/20 h-1.5'}`}
                      />
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-xs text-white/70 mt-1">
                    <div>00:00</div>
                    <div className="hidden sm:flex flex-1 justify-around px-4">
                      <div className="text-blue-400 text-xs">Q4 Planning</div>
                      <div className="text-green-400 text-xs">Project Deadlines</div>
                      <div className="text-red-400 text-xs">Urgent Email</div>
                    </div>
                    <div>01:03</div>
                  </div>
                  
                  {/* Mobile topic indicators */}
                  <div className="sm:hidden flex justify-center space-x-4 mt-1 text-xs">
                    <div className="text-blue-400">Q4</div>
                    <div className="text-green-400">Deadlines</div>
                    <div className="text-red-400">Urgent</div>
                  </div>
                </div>
                
                {/* Audio controls - More compact */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                  <Button variant="outline" size="sm" className="text-blue-400 border-white/20 hover:bg-white/10 w-full sm:w-auto text-xs h-7">
                    Skip Section
                  </Button>
                  
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-6 w-6 border-white/20 hover:bg-white/10">
                      <ArrowDown className="h-3 w-3 text-white" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-white/20 hover:bg-white/10">
                      <ArrowUp className="h-3 w-3 text-white" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full border-blue-500 bg-blue-500/20 hover:bg-blue-500/30">
                      <Play className="h-3 w-3 text-blue-400" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-white/20 hover:bg-white/10">
                      <ArrowDown className="h-3 w-3 text-white" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-6 w-6 border-white/20 hover:bg-white/10">
                      <ArrowUp className="h-3 w-3 text-white" />
                    </Button>
                  </div>
                  
                  <span className="text-xs font-medium text-white">01:03</span>
                </div>
                
                <div className="mt-2 text-center sm:text-right">
                  <Button variant="link" className="text-blue-400 hover:text-blue-300 text-xs p-0 h-auto">
                    View Transcript
                  </Button>
                </div>
              </div>
              
              {/* Recent Messages - Compact cards matching home dashboard style */}
              <div>
                <h3 className="text-base md:text-lg font-semibold text-white mb-3">Recent Messages</h3>
                
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
                    <div key={i} className="transition-all duration-300 cursor-pointer rounded-lg overflow-hidden hover:scale-[1.01] bg-gradient-to-r from-white/5 to-white/10 border border-white/10 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs text-white/80">{message.platform}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-white text-xs truncate">{message.message}</h4>
                            <p className="text-white/70 text-xs truncate">{message.sender} • {message.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            message.priority === "High" 
                              ? "bg-red-500/20 text-red-400" 
                              : message.priority === "Medium"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {message.priority}
                          </span>
                          <Button variant="link" className="text-blue-400 p-0 h-auto text-xs hover:text-blue-300">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop: Compact table layout */}
                <div className="hidden md:block bg-white/5 rounded-lg border border-white/10 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Platform</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Message</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Sender</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Time</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Priority</th>
                          <th className="py-2 px-3 text-left text-xs font-medium text-white/70">Action</th>
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
                          <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                            <td className="py-2 px-3">
                              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                                <span className="text-xs text-white/80">{message.platform}</span>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-medium text-white text-sm">{message.message}</td>
                            <td className="py-2 px-3 text-white/80 text-sm">{message.sender}</td>
                            <td className="py-2 px-3 text-white/70 text-sm">{message.time}</td>
                            <td className="py-2 px-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                message.priority === "High" 
                                  ? "bg-red-500/20 text-red-400" 
                                  : message.priority === "Medium"
                                    ? "bg-orange-500/20 text-orange-400"
                                    : "bg-blue-500/20 text-blue-400"
                              }`}>
                                {message.priority}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <Button variant="link" className="text-blue-400 p-0 h-auto text-sm hover:text-blue-300">
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
    </Dialog>
  );
};

export default BriefModal;
