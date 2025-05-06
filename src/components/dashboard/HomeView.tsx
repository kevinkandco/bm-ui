
import React, { useState } from "react";
import { Calendar, Mail, MessageSquare, Zap, Clock, Wifi, User, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
  onOpenBriefModal: () => void;
}

const HomeView = ({ onOpenBrief, onToggleFocusMode, onToggleCatchMeUp, onOpenBriefModal }: HomeViewProps) => {
  const { toast } = useToast();
  
  const showBriefDetails = () => {
    onOpenBrief(1);
  };

  const handleUpdateSchedule = () => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings",
    });
  };
  
  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
      {/* Hero Banner with Action Buttons */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-deep-teal">Morning, Alex</h1>
          <p className="text-deep-teal/90 mt-1">Here's what you missed</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            onClick={onToggleCatchMeUp}
            className="rounded-full shadow-sm hover:shadow-md transition-all bg-lake-blue text-white"
          >
            <Zap className="mr-2 h-5 w-5" /> Catch Me Up
          </Button>
          <Button 
            onClick={onToggleFocusMode}
            className="rounded-full shadow-sm hover:shadow-md transition-all bg-glass-blue text-white"
          >
            <Headphones className="mr-2 h-5 w-5" /> Focus Mode
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section - Col 1-8 */}
        <div className="lg:col-span-8">
          {/* Combined Card with Sections and Dividers */}
          <div className="backdrop-blur-md border border-white/40 rounded-3xl overflow-hidden shadow-lg">
            {/* Latest Brief Section - Moved to top */}
            <div className="p-6 hover:bg-white/10 transition-colors cursor-pointer" onClick={onOpenBriefModal}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-deep-teal text-lg font-medium">Latest Brief</h2>
                <span className="text-sm text-deep-teal/80">Today, 8:00 AM</span>
              </div>
              <p className="text-deep-teal/90 mb-4 text-sm">Quick summary of your morning updates</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 flex-1">
                  <Mail className="h-5 w-5 text-glass-blue" />
                  <span className="text-sm font-medium text-deep-teal">5 emails reviewed</span>
                </div>
                
                <div className="flex items-center gap-2 flex-1">
                  <MessageSquare className="h-5 w-5 text-glass-blue" />
                  <span className="text-sm font-medium text-deep-teal">12 Slack messages</span>
                </div>
                
                <Button variant="outline" size="sm" className="ml-auto border-glass-blue/40 text-glass-blue hover:bg-white/50 hover:text-glass-blue shadow-sm">
                  View Full Brief
                </Button>
              </div>
            </div>

            <Separator className="bg-white/20" />
            
            {/* Urgent Threads Section */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-deep-teal text-lg font-medium flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-glass-blue" />
                  Urgent Threads
                </h2>
                <span className="text-deep-teal/80 text-sm">
                  2 threads requiring your attention
                </span>
              </div>
              <div className="space-y-2 mt-4">
                {[
                  { channel: "# product", message: "New designs ready for review" },
                  { channel: "Sandra", message: "About the quarterly report" }
                ].map((thread, i) => (
                  <div key={i} className="px-4 py-3 rounded-lg bg-white/60 border border-white/40 text-sm flex items-center justify-between shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <span className="font-medium text-deep-teal">{thread.channel}</span>
                    <span className="text-deep-teal/90">{thread.message}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-white/20" />
            
            {/* Connected Channels Section */}
            <div className="p-6">
              <h2 className="text-deep-teal text-lg flex items-center mb-2">
                <Wifi className="mr-2 h-5 w-5 text-glass-blue" />
                Connected Channels
              </h2>
              <p className="text-deep-teal/80 text-sm mb-3">
                Monitoring 5 channels across 3 platforms
              </p>
              <div className="space-y-3">
                {[
                  { name: "Slack", channels: ["#product", "#team-updates", "#general"], icon: MessageSquare, active: true },
                  { name: "Email", channels: ["Work Inbox", "Personal"], icon: Mail, active: true },
                  { name: "Calendar", channels: ["Work", "Personal"], icon: Calendar, active: true }
                ].map((platform, i) => (
                  <div key={i} className="rounded-lg p-3 hover:bg-white/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <platform.icon className="h-4 w-4 text-glass-blue mr-2" />
                        <h3 className="text-sm font-medium text-deep-teal">{platform.name}</h3>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-glass-blue" : "bg-gray-300"}`}></span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {platform.channels.map((channel, j) => (
                        <span key={j} className="text-xs text-deep-teal/80 bg-white/40 px-2 py-0.5 rounded border border-white/30">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator className="bg-white/20" />
            
            {/* Priority People Section */}
            <div className="p-6">
              <h2 className="text-deep-teal text-lg flex items-center mb-2">
                <User className="mr-2 h-5 w-5 text-glass-blue" />
                Priority People
              </h2>
              <p className="text-deep-teal/80 text-sm mb-3">
                2 people with recent activity
              </p>
              <div className="space-y-1">
                {[
                  { 
                    name: "Sandra Chen", 
                    title: "Product Manager", 
                    lastActivity: "15m ago", 
                    platform: "Email",
                    active: true 
                  },
                  { 
                    name: "Alex Johnson", 
                    title: "Engineering Lead", 
                    lastActivity: "2h ago", 
                    platform: "Slack",
                    active: true 
                  },
                  { 
                    name: "Michael Lee", 
                    title: "CEO", 
                    lastActivity: "1d ago", 
                    platform: "Calendar",
                    active: false 
                  }
                ].map((person, i) => (
                  <div key={i} className={`p-2 rounded-lg ${person.active ? "hover:bg-white/20" : "hover:bg-white/10"} transition-colors`}>
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-white/70 border border-white/50 flex items-center justify-center text-deep-teal font-medium text-xs">
                        {person.name.charAt(0)}
                      </div>
                      <div className="ml-2 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-deep-teal">{person.name}</h3>
                          <div className="flex items-center text-xs text-deep-teal/70">
                            <span>{person.platform}</span>
                            <span className="mx-1">•</span>
                            <span>{person.lastActivity}</span>
                          </div>
                        </div>
                      </div>
                      {person.active && <span className="h-2 w-2 rounded-full bg-glass-blue ml-1"></span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Col 9-12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Next Brief Section */}
          <div>
            <h2 className="text-deep-teal text-lg flex items-center mb-3">
              <Clock className="mr-2 h-5 w-5 text-glass-blue" />
              Next Brief
            </h2>
            <div className="border border-white/40 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-deep-teal">Midday Brief</h3>
                  <p className="text-xs text-deep-teal/80">Today at 12:30 PM</p>
                </div>
                <Calendar className="h-5 w-5 text-glass-blue" />
              </div>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-glass-blue border-white/40 hover:bg-white/50 shadow-sm"
                  onClick={handleUpdateSchedule}
                >
                  Update Schedule
                </Button>
              </div>
            </div>
          </div>
          
          {/* Upcoming Meetings Section - Moved from left to right */}
          <div>
            <h2 className="text-lg text-deep-teal flex items-center mb-3">
              <Calendar className="mr-2 h-5 w-5 text-glass-blue" />
              Upcoming Meetings
            </h2>
            <div className="space-y-3">
              {[
                { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
                { time: "1:30 PM", title: "Product Review", participants: 6 },
                { time: "3:00 PM", title: "Client Call", participants: 2 }
              ].map((meeting, i) => (
                <div key={i} className="flex items-start gap-3 p-3 border border-white/40 rounded-lg">
                  <div className="rounded p-1.5 h-8 w-8 flex items-center justify-center border border-white/30">
                    <Calendar className="h-4 w-4 text-glass-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-deep-teal">{meeting.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-deep-teal/80">{meeting.time}</span>
                      <span className="text-xs text-deep-teal/80">{meeting.participants} attendees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
