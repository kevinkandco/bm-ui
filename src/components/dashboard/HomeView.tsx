
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
}

const HomeView = ({ onOpenBrief, onToggleFocusMode }: HomeViewProps) => {
  const { toast } = useToast();
  const [timeAway, setTimeAway] = useState<string | null>(null);
  
  const showBriefDetails = () => {
    onOpenBrief(1);
  };

  const handleCatchMeUp = () => {
    // For demo purposes, let's show a dropdown with time options
    setTimeAway("3 hours");
    
    toast({
      title: "Catch Me Up",
      description: "Generating catch-up summary for the last 3 hours",
    });
  };

  const handleUpdateSchedule = () => {
    toast({
      title: "Brief Schedule",
      description: "Opening brief schedule settings",
    });
  };
  
  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-deep-teal">Morning, Alex</h1>
        <p className="text-deep-teal/90 mt-1">Here's what you missed</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Left Section - Col 1-4 */}
        <div className="md:col-span-4 space-y-6">
          {/* Latest Brief */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40 hover:shadow-sm transition-shadow cursor-pointer" onClick={showBriefDetails}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-deep-teal">Latest Brief</CardTitle>
                <span className="text-sm text-deep-teal/80">Today, 8:00 AM</span>
              </div>
              <CardDescription className="text-deep-teal/90">3 important updates from your connected tools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white/50 rounded-lg border border-white/40">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-glass-blue" />
                    <span className="text-sm font-medium text-deep-teal">Email</span>
                  </div>
                  <p className="mt-2 text-sm text-deep-teal/90">2 high priority emails from Sandra and Finance Team</p>
                </div>
                
                <div className="p-4 bg-white/50 rounded-lg border border-white/40">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-glass-blue" />
                    <span className="text-sm font-medium text-deep-teal">Slack</span>
                  </div>
                  <p className="mt-2 text-sm text-deep-teal/90">5 mentions in #product-roadmap and #team-updates</p>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 bg-glass-blue rounded-full"></span>
                    <span className="text-sm text-deep-teal/90">Audio version available</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-glass-blue/40 text-glass-blue hover:bg-white/50 hover:text-glass-blue">
                    View Full Brief
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Connected Channels */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <Wifi className="mr-2 h-5 w-5 text-glass-blue" />
                Connected Channels
              </CardTitle>
              <CardDescription className="text-deep-teal/80">
                Monitoring 5 channels across 3 platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { name: "Slack", channels: ["#product", "#team-updates", "#general"], icon: MessageSquare, active: true },
                  { name: "Email", channels: ["Work Inbox", "Personal"], icon: Mail, active: true },
                  { name: "Calendar", channels: ["Work", "Personal"], icon: Calendar, active: true }
                ].map((platform, i) => (
                  <div key={i} className="bg-white/50 rounded-lg border border-white/40 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <platform.icon className="h-4 w-4 text-glass-blue mr-2" />
                        <h3 className="text-sm font-medium text-deep-teal">{platform.name}</h3>
                      </div>
                      <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-glass-blue" : "bg-gray-300"}`}></span>
                    </div>
                    <div className="space-y-1">
                      {platform.channels.map((channel, j) => (
                        <div key={j} className="text-xs text-deep-teal/80 py-0.5">
                          {channel}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" size="sm" className="text-glass-blue border-white/40 hover:bg-white/50">
                Manage Connections
              </Button>
            </CardFooter>
          </Card>
          
          {/* Priority People */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <User className="mr-2 h-5 w-5 text-glass-blue" />
                Priority People
              </CardTitle>
              <CardDescription className="text-deep-teal/80">
                2 people with recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    name: "Sandra Chen", 
                    title: "Product Manager", 
                    lastActivity: "15m ago", 
                    platform: "Email",
                    message: "About the quarterly report deadline",
                    active: true 
                  },
                  { 
                    name: "Alex Johnson", 
                    title: "Engineering Lead", 
                    lastActivity: "2h ago", 
                    platform: "Slack",
                    message: "Shared a document in #engineering",
                    active: true 
                  },
                  { 
                    name: "Michael Lee", 
                    title: "CEO", 
                    lastActivity: "1d ago", 
                    platform: "Calendar",
                    message: "Scheduled a meeting for tomorrow",
                    active: false 
                  }
                ].map((person, i) => (
                  <div key={i} className={`p-3 rounded-lg border ${person.active ? "bg-white/70 border-glass-blue/30" : "bg-white/50 border-white/40"}`}>
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-white/70 border border-white/50 flex items-center justify-center text-deep-teal font-medium">
                        {person.name.charAt(0)}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-deep-teal">{person.name}</h3>
                          <span className="text-xs text-deep-teal/70">{person.lastActivity}</span>
                        </div>
                        <p className="text-xs text-deep-teal/70">{person.title}</p>
                        {person.active && (
                          <div className="mt-2 text-xs bg-white/70 rounded-md p-2 border border-white/40">
                            <span className="font-medium">{person.platform}:</span> {person.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Section - Col 5-6 */}
        <div className="md:col-span-2 space-y-6">
          {/* Next Brief */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40">
            <CardHeader>
              <CardTitle className="text-deep-teal text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-glass-blue" />
                Next Brief
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-white/50 rounded-lg border border-white/40 text-center">
                <Calendar className="h-6 w-6 text-glass-blue mx-auto mb-2" />
                <h3 className="font-medium text-deep-teal">Midday Brief</h3>
                <p className="text-sm text-deep-teal/80">Today at 12:30 PM</p>
                <p className="text-xs text-deep-teal/70 mt-1">2h 15m from now</p>
                
                <div className="mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-glass-blue border-white/40 hover:bg-white/50"
                    onClick={handleUpdateSchedule}
                  >
                    Update Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Upcoming Meetings */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-deep-teal">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
                  { time: "1:30 PM", title: "Product Review", participants: 6 },
                  { time: "3:00 PM", title: "Client Call", participants: 2 }
                ].map((meeting, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-white/40 last:border-b-0">
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
          
          {/* Urgent Threads & Task Radar */}
          <Card className="backdrop-blur-md bg-white/40 border border-white/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-deep-teal">Urgent Threads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {[
                  { channel: "# product", message: "New designs ready for review" },
                  { channel: "Sandra", message: "About the quarterly report" }
                ].map((thread, i) => (
                  <div key={i} className="px-3 py-2 rounded-full bg-white/60 border border-white/40 text-sm flex items-center justify-between">
                    <span className="font-medium text-deep-teal">{thread.channel}</span>
                    <span className="text-deep-teal/90 truncate ml-2" style={{maxWidth: "120px"}}>{thread.message}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3 text-deep-teal">Task Radar</h3>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="fixed bottom-20 right-6 md:bottom-8 md:right-8 flex flex-col gap-3">
        {/* Focus Mode Button */}
        <Button 
          className="rounded-full h-14 w-14 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-glass-blue text-white"
          onClick={onToggleFocusMode}
        >
          <Headphones className="h-6 w-6" />
        </Button>
        
        {/* Catch Me Up Button */}
        <Button 
          className="rounded-full h-14 w-14 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 bg-lake-blue text-white"
          onClick={handleCatchMeUp}
        >
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomeView;
