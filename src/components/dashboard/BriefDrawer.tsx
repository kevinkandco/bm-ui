
import React from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription, 
  DrawerClose,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckSquare, Play, Mail, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BriefDrawerProps {
  open: boolean;
  briefId: number | null;
  onClose: () => void;
}

const BriefDrawer = ({ open, briefId, onClose }: BriefDrawerProps) => {
  const { toast } = useToast();

  // Mock brief data
  const briefData = {
    id: 1,
    title: "Morning Brief",
    date: "Today, 8:00 AM",
    summary: "3 high priority updates from your connected apps",
    audioUrl: "/path/to/audio.mp3",
    audioLength: "2:35",
    timestamps: [
      { time: "0:12", description: "Email from Finance Team" },
      { time: "0:45", description: "Slack mentions in #product-roadmap" },
      { time: "1:28", description: "Calendar reminder for Weekly Standup" }
    ],
    todos: [
      { id: 1, text: "Review Q3 report from Finance", completed: false },
      { id: 2, text: "Respond to Sandra's email", completed: false },
      { id: 3, text: "Prepare for Weekly Standup", completed: false }
    ],
    updates: [
      { 
        type: "email", 
        source: "Finance Team", 
        title: "Q3 Report Ready for Review", 
        preview: "The quarterly financial report is ready for your review." 
      },
      { 
        type: "slack", 
        source: "#product-roadmap", 
        title: "New Feature Discussion", 
        preview: "Team is discussing the timeline for the new dashboard features." 
      },
      { 
        type: "calendar", 
        source: "Weekly Standup", 
        title: "10:00 AM Today", 
        preview: "4 team members attending." 
      }
    ]
  };

  const sendToTaskApp = () => {
    toast({
      title: "Tasks Exported",
      description: "Tasks have been sent to your task manager"
    });
  };

  if (!briefId) return null;

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="max-h-[85vh] bg-white/75 backdrop-blur-md border-t border-white/30">
        <DrawerHeader>
          <DrawerTitle className="text-deep-teal text-2xl">{briefData.title}</DrawerTitle>
          <DrawerDescription className="text-deep-teal/80">{briefData.date} · {briefData.summary}</DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-2">
          <Tabs defaultValue="audio" className="w-full">
            <TabsList className="bg-white/30 border border-white/20 w-full">
              <TabsTrigger value="audio" className="flex-1 data-[state=active]:bg-white/40">
                <Play className="mr-2 h-4 w-4" />
                Audio Brief
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex-1 data-[state=active]:bg-white/40">
                <MessageSquare className="mr-2 h-4 w-4" />
                Updates
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1 data-[state=active]:bg-white/40">
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="audio" className="mt-4">
              <div className="bg-white/40 rounded-xl p-4 backdrop-blur-md border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Button size="sm" variant="secondary" className="mr-2">
                      <Play className="h-4 w-4" />
                    </Button>
                    <span className="text-deep-teal/80 text-sm">{briefData.audioLength}</span>
                  </div>
                  <Button variant="outline" size="sm">Download</Button>
                </div>
                
                <div className="space-y-2 mt-6">
                  <h4 className="text-sm font-medium text-deep-teal mb-2">Timestamps</h4>
                  {briefData.timestamps.map((timestamp, i) => (
                    <div key={i} className="flex items-center py-2 border-b border-white/30 last:border-b-0">
                      <Button variant="outline" size="sm" className="h-6 min-w-[50px] mr-3">
                        {timestamp.time}
                      </Button>
                      <span className="text-sm text-deep-teal">{timestamp.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="mt-4 space-y-3">
              {briefData.updates.map((update, i) => (
                <div key={i} className="bg-white/40 rounded-xl p-4 backdrop-blur-md border border-white/30">
                  <div className="flex items-center gap-3">
                    {update.type === "email" && <Mail className="h-4 w-4 text-glass-blue" />}
                    {update.type === "slack" && <MessageSquare className="h-4 w-4 text-glass-blue" />}
                    {update.type === "calendar" && <Calendar className="h-4 w-4 text-glass-blue" />}
                    <div>
                      <h4 className="font-medium text-deep-teal">{update.title}</h4>
                      <p className="text-sm text-deep-teal/80">
                        <span className="font-medium">{update.source}</span>: {update.preview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <div className="bg-white/40 rounded-xl p-4 backdrop-blur-md border border-white/30">
                <div className="space-y-2">
                  {briefData.todos.map((todo) => (
                    <div key={todo.id} className="flex items-center py-2 border-b border-white/30 last:border-b-0">
                      <input 
                        type="checkbox" 
                        id={`todo-${todo.id}`}
                        className="rounded mr-3 h-4 w-4 border-white/40 text-glass-blue focus:ring-glass-blue"
                      />
                      <label htmlFor={`todo-${todo.id}`} className="text-sm text-deep-teal">
                        {todo.text}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={sendToTaskApp}>
                    <CheckSquare className="h-4 w-4 mr-2" /> 
                    Send to Task Manager
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BriefDrawer;
