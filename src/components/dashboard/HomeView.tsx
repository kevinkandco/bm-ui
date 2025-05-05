
import React from "react";
import { Calendar, Mail, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

const HomeView = () => {
  const { toast } = useToast();
  
  const showBriefDetails = () => {
    toast({
      title: "Brief Details",
      description: "Opening brief details drawer",
    });
  };
  
  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Morning, Alex</h1>
        <p className="text-muted-foreground mt-1">Here's what you missed</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Latest Brief - Column 1 */}
        <Card className="md:col-span-2 glass-card hover:shadow-neo dark:hover:shadow-neo transition-shadow cursor-pointer" onClick={showBriefDetails}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Latest Brief</CardTitle>
              <span className="text-sm text-muted-foreground">Today, 8:00 AM</span>
            </div>
            <CardDescription>3 important updates from your connected tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-background/50 dark:bg-canvas-black/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-bright-teal dark:text-electric-teal" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="mt-2 text-sm">2 high priority emails from Sandra and Finance Team</p>
              </div>
              
              <div className="p-4 bg-background/50 dark:bg-canvas-black/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-soft-plum dark:text-deep-plum" />
                  <span className="text-sm font-medium">Slack</span>
                </div>
                <p className="mt-2 text-sm">5 mentions in #product-roadmap and #team-updates</p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-bright-teal dark:bg-electric-teal rounded-full"></span>
                  <span className="text-sm text-muted-foreground">Audio version available</span>
                </div>
                <Button variant="outline" size="sm">
                  View Full Brief
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Meetings - Column 2 */}
        <Card className="md:col-span-1 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
                { time: "1:30 PM", title: "Product Review", participants: 6 },
                { time: "3:00 PM", title: "Client Call", participants: 2 }
              ].map((meeting, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b last:border-b-0">
                  <div className="bg-background dark:bg-deep-plum/30 rounded p-1.5 h-8 w-8 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-slate-grey dark:text-cool-slate" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{meeting.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{meeting.time}</span>
                      <span className="text-xs text-muted-foreground">{meeting.participants} attendees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Urgent Threads & Task Radar - Column 3 */}
        <Card className="md:col-span-1 glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Urgent Threads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {[
                { channel: "# product", message: "New designs ready for review" },
                { channel: "Sandra", message: "About the quarterly report" }
              ].map((thread, i) => (
                <div key={i} className="px-3 py-2 rounded-full bg-background/70 dark:bg-canvas-black/60 border border-border text-sm flex items-center justify-between">
                  <span className="font-medium">{thread.channel}</span>
                  <span className="text-slate-grey dark:text-cool-slate truncate ml-2" style={{maxWidth: "120px"}}>{thread.message}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Task Radar</h3>
              <div className="flex justify-center">
                <div className="relative w-28 h-28">
                  {/* Circle progress indicator */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="#e6e6e6" strokeWidth="10" 
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
                        <stop offset="0%" className="text-bright-teal dark:text-electric-teal" stopColor="currentColor" />
                        <stop offset="100%" className="text-warm-coral dark:text-hot-coral" stopColor="currentColor" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold">75%</span>
                    <span className="text-xs text-muted-foreground">Complete</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">6 of 8 tasks done</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 md:bottom-8 md:right-8">
        <Button className="neon-button rounded-full h-14 w-14 shadow-light-neon dark:shadow-neon hover:shadow-xl transition-all hover:-translate-y-1" onClick={() => toast({
          title: "Catch Me Up",
          description: "Opening catch-up generator",
        })}>
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default HomeView;

function Zap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}
