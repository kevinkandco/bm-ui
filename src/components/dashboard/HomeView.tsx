
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
        <h1 className="text-3xl font-bold text-off-white">Morning, Alex</h1>
        <p className="text-off-white/90 mt-1">Here's what you missed</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Latest Brief - Column 1 */}
        <Card className="md:col-span-2 backdrop-blur-md bg-white/20 border border-white/30 hover:shadow-neo transition-shadow cursor-pointer" onClick={showBriefDetails}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-off-white">Latest Brief</CardTitle>
              <span className="text-sm text-off-white/80">Today, 8:00 AM</span>
            </div>
            <CardDescription className="text-off-white/90">3 important updates from your connected tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-white/25 rounded-lg border border-white/30">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-neon-mint" />
                  <span className="text-sm font-medium text-off-white">Email</span>
                </div>
                <p className="mt-2 text-sm text-off-white/90">2 high priority emails from Sandra and Finance Team</p>
              </div>
              
              <div className="p-4 bg-white/25 rounded-lg border border-white/30">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-neon-mint" />
                  <span className="text-sm font-medium text-off-white">Slack</span>
                </div>
                <p className="mt-2 text-sm text-off-white/90">5 mentions in #product-roadmap and #team-updates</p>
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-neon-mint rounded-full"></span>
                  <span className="text-sm text-off-white/90">Audio version available</span>
                </div>
                <Button variant="outline" size="sm" className="border-white/30 text-off-white hover:bg-white/25 hover:text-off-white">
                  View Full Brief
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Upcoming Meetings - Column 2 */}
        <Card className="md:col-span-1 backdrop-blur-md bg-white/20 border border-white/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-off-white">Upcoming Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: "10:00 AM", title: "Weekly Standup", participants: 4 },
                { time: "1:30 PM", title: "Product Review", participants: 6 },
                { time: "3:00 PM", title: "Client Call", participants: 2 }
              ].map((meeting, i) => (
                <div key={i} className="flex items-start gap-3 py-2 border-b border-white/20 last:border-b-0">
                  <div className="bg-white/25 rounded p-1.5 h-8 w-8 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-neon-mint" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-off-white">{meeting.title}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-off-white/80">{meeting.time}</span>
                      <span className="text-xs text-off-white/80">{meeting.participants} attendees</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Urgent Threads & Task Radar - Column 3 */}
        <Card className="md:col-span-1 backdrop-blur-md bg-white/20 border border-white/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-off-white">Urgent Threads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {[
                { channel: "# product", message: "New designs ready for review" },
                { channel: "Sandra", message: "About the quarterly report" }
              ].map((thread, i) => (
                <div key={i} className="px-3 py-2 rounded-full bg-white/25 border border-white/30 text-sm flex items-center justify-between">
                  <span className="font-medium text-off-white">{thread.channel}</span>
                  <span className="text-off-white/90 truncate ml-2" style={{maxWidth: "120px"}}>{thread.message}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3 text-off-white">Task Radar</h3>
              <div className="flex justify-center">
                <div className="relative w-28 h-28">
                  {/* Circle progress indicator */}
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="10" 
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
                        <stop offset="100%" stopColor="#FFCBA3" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-off-white">75%</span>
                    <span className="text-xs text-off-white/80">Complete</span>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-off-white/90 mt-2">6 of 8 tasks done</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-6 md:bottom-8 md:right-8">
        <Button className="neon-button rounded-full h-14 w-14 shadow-light-neon hover:shadow-xl transition-all hover:-translate-y-1" onClick={() => toast({
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
