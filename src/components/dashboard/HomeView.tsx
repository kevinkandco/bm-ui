
import React, { useState } from "react";
import { Calendar, Mail, MessageSquare, Zap, Clock, Wifi, User, Headphones } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface HomeViewProps {
  onOpenBrief: (briefId: number) => void;
  onToggleFocusMode: () => void;
  onToggleCatchMeUp: () => void;
}

const HomeView = ({ onOpenBrief, onToggleFocusMode, onToggleCatchMeUp }: HomeViewProps) => {
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
        <div className="lg:col-span-8 space-y-6">
          {/* Urgent Threads */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <Zap className="mr-2 h-5 w-5 text-glass-blue" />
                Urgent Threads
              </CardTitle>
              <CardDescription className="text-deep-teal/80">
                2 threads requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
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
            </CardContent>
          </Card>
          
          {/* Latest Brief */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg hover:shadow-xl transition-shadow cursor-pointer" onClick={showBriefDetails}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-deep-teal">Latest Brief</CardTitle>
                <span className="text-sm text-deep-teal/80">Today, 8:00 AM</span>
              </div>
              <CardDescription className="text-deep-teal/90">Quick summary of your morning updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="p-3 bg-white/50 rounded-lg border border-white/40 shadow-sm flex items-center gap-2 flex-1">
                  <Mail className="h-5 w-5 text-glass-blue" />
                  <span className="text-sm font-medium text-deep-teal">5 emails reviewed</span>
                </div>
                
                <div className="p-3 bg-white/50 rounded-lg border border-white/40 shadow-sm flex items-center gap-2 flex-1">
                  <MessageSquare className="h-5 w-5 text-glass-blue" />
                  <span className="text-sm font-medium text-deep-teal">12 Slack messages</span>
                </div>
                
                <Button variant="outline" size="sm" className="ml-auto border-glass-blue/40 text-glass-blue hover:bg-white/50 hover:text-glass-blue shadow-sm">
                  View Full Brief
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Meetings */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-deep-teal flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-glass-blue" />
                Upcoming Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
                  { time: "1:30 PM", title: "Product Review", participants: 6 },
                  { time: "3:00 PM", title: "Client Call", participants: 2 }
                ].map((meeting, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-white/60 border border-white/40 rounded-lg shadow-sm">
                    <div className="bg-white/60 rounded p-1.5 h-8 w-8 flex items-center justify-center">
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
            </CardContent>
          </Card>
        </div>
        
        {/* Right Section - Col 9-12 */}
        <div className="lg:col-span-4 space-y-6">
          {/* Next Brief */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-glass-blue" />
                Next Brief
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-3 bg-white/50 rounded-lg border border-white/40 shadow-sm">
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
            </CardContent>
          </Card>
          
          {/* Connected Channels */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-glass-blue" />
                Connected Channels
              </CardTitle>
              <CardDescription className="text-deep-teal/80">
                Monitoring 5 channels across 3 platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1">
                {[
                  { name: "Slack", channels: ["#product", "#team-updates", "#general"], icon: MessageSquare, active: true },
                  { name: "Email", channels: ["Work Inbox", "Personal"], icon: Mail, active: true },
                  { name: "Calendar", channels: ["Work", "Personal"], icon: Calendar, active: true }
                ].map((platform, i) => (
                  <div key={i} className="bg-white/50 rounded-lg border border-white/40 p-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <platform.icon className="h-4 w-4 text-glass-blue mr-2" />
                        <h3 className="text-sm font-medium text-deep-teal">{platform.name}</h3>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-glass-blue" : "bg-gray-300"}`}></span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {platform.channels.map((channel, j) => (
                        <span key={j} className="text-xs text-deep-teal/80 bg-white/40 px-2 py-0.5 rounded">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="text-glass-blue border-white/40 hover:bg-white/50 shadow-sm">
                Manage Connections
              </Button>
            </CardFooter>
          </Card>
          
          {/* Priority People */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-glass-blue" />
                Priority People
              </CardTitle>
              <CardDescription className="text-deep-teal/80">
                2 people with recent activity
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
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
                  <div key={i} className={`p-2 rounded-lg border shadow-sm ${person.active ? "bg-white/70 border-glass-blue/30" : "bg-white/50 border-white/40"}`}>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-white/70 border border-white/50 flex items-center justify-center text-deep-teal font-medium text-sm">
                        {person.name.charAt(0)}
                      </div>
                      <div className="ml-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-medium text-deep-teal">{person.name}</h3>
                          {person.active && <span className="h-2 w-2 rounded-full bg-glass-blue"></span>}
                        </div>
                        <div className="flex items-center text-xs text-deep-teal/70">
                          <span>{person.platform}</span>
                          <span className="mx-1">•</span>
                          <span>{person.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Task Radar */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-deep-teal">Task Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className="relative w-28 h-28">
                  {/* Circle progress indicator */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="10" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="url(#gradient-stroke)" 
                      strokeWidth="10" 
                      strokeDasharray="283" strokeDashoffset="70" 
                      transform="rotate(-90 50 50)"
                    />
                    <defs>
                      <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#36FFAF" />
                        <stop offset="100%" stopColor="#4F99E9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-deep-teal">75%</span>
                    <span className="text-xs text-deep-teal/80">Complete</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-deep-teal/90 mt-2">6 of 8 tasks done</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
