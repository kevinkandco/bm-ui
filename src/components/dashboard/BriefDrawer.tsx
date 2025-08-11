
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
      <DrawerContent className="max-h-[85vh] bg-surface/80 backdrop-blur-xl border-t border-border-subtle">
        <DrawerHeader>
          <DrawerTitle className="text-text-primary text-2xl">{briefData.title}</DrawerTitle>
          <DrawerDescription className="text-text-secondary">{briefData.date} · {briefData.summary}</DrawerDescription>
        </DrawerHeader>
        
        <div className="px-4 pb-2">
          <Tabs defaultValue="audio" className="w-full">
            <TabsList className="bg-surface-raised/20 border border-border-subtle w-full">
              <TabsTrigger value="audio" className="flex-1 data-[state=active]:bg-surface-raised/30">
                <Play className="mr-2 h-4 w-4" />
                Audio Brief
              </TabsTrigger>
              <TabsTrigger value="updates" className="flex-1 data-[state=active]:bg-surface-raised/30">
                <MessageSquare className="mr-2 h-4 w-4" />
                Updates
              </TabsTrigger>
              <TabsTrigger value="tasks" className="flex-1 data-[state=active]:bg-surface-raised/30">
                <CheckSquare className="mr-2 h-4 w-4" />
                Tasks
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="audio" className="mt-4">
              <div className="bg-surface-raised/20 rounded-xl p-4 backdrop-blur-md border border-border-subtle">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Button size="sm" variant="secondary" className="mr-2">
                      <Play className="h-4 w-4" />
                    </Button>
                    <span className="text-text-secondary text-sm">{briefData.audioLength}</span>
                  </div>
                  
                </div>
                
                <div className="space-y-2 mt-6">
                  <h4 className="text-sm font-medium text-text-primary mb-2">Timestamps</h4>
                  {briefData.timestamps.map((timestamp, i) => (
                    <div key={i} className="flex items-center py-2 border-b border-border-subtle last:border-b-0">
                      <Button variant="outline" size="sm" className="h-6 min-w-[50px] mr-3">
                        {timestamp.time}
                      </Button>
                      <span className="text-sm text-text-secondary">{timestamp.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="updates" className="mt-4 space-y-3">
              {briefData.updates.map((update, i) => (
                <div key={i} className="bg-surface-raised/20 rounded-xl p-4 backdrop-blur-md border border-border-subtle">
                  <div className="flex items-center gap-3">
                    {update.type === "email" && <Mail className="h-4 w-4 text-accent-primary" />}
                    {update.type === "slack" && <MessageSquare className="h-4 w-4 text-accent-primary" />}
                    {update.type === "calendar" && <Calendar className="h-4 w-4 text-accent-primary" />}
                    <div>
                      <h4 className="font-medium text-text-primary">{update.title}</h4>
                      <p className="text-sm text-text-secondary">
                        <span className="font-medium">{update.source}</span>: {update.preview}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-4">
              <div className="bg-surface-raised/20 rounded-xl p-4 backdrop-blur-md border border-border-subtle">
                <div className="space-y-2">
                  {briefData.todos.map((todo) => (
                    <div key={todo.id} className="flex items-center py-2 border-b border-border-subtle last:border-b-0">
                      <input 
                        type="checkbox" 
                        id={`todo-${todo.id}`}
                        className="rounded mr-3 h-4 w-4 border-border-subtle text-accent-primary focus:ring-accent-primary"
                      />
                      <label htmlFor={`todo-${todo.id}`} className="text-sm text-text-primary">
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
