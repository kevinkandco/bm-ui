
import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Archive, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const BriefsList = () => {
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const handleCreateBrief = () => {
    toast({
      title: "Create Brief",
      description: "Opening brief creation form",
    });
  };

  const briefs = [
    { id: 1, title: "Daily Update - May 14, 2025", date: "Today, 9:00 AM", unread: true },
    { id: 2, title: "Weekly Summary - Week 20", date: "Yesterday, 5:30 PM", unread: false },
    { id: 3, title: "Project Milestones - Q2", date: "May 12, 2025", unread: false },
    { id: 4, title: "Team Performance Review", date: "May 10, 2025", unread: false },
    { id: 5, title: "Stakeholder Update", date: "May 8, 2025", unread: false },
  ];

  return (
    <DashboardLayout 
      currentPage="briefs" 
      sidebarOpen={sidebarOpen} 
      onToggleSidebar={handleToggleSidebar}
    >
      <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Briefs</h1>
            <p className="text-text-secondary mt-1">View and manage all your briefs</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              onClick={handleCreateBrief}
              className="rounded-full shadow-subtle hover:shadow-glow transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Create Brief
            </Button>
            <Button 
              variant="outline"
              className="rounded-full shadow-subtle hover:shadow-glow transition-all border-border-subtle backdrop-blur-md"
            >
              <Filter className="mr-2 h-5 w-5" /> Filter
            </Button>
          </div>
        </div>
        
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Recent Briefs</h2>
            
            <div className="space-y-1">
              {briefs.map((brief) => (
                <React.Fragment key={brief.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center">
                      <Archive className="h-5 w-5 text-accent-primary mr-3" />
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-text-primary">{brief.title}</h3>
                          {brief.unread && (
                            <span className="ml-2 h-2 w-2 bg-accent-primary rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">{brief.date}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                  {brief.id !== briefs.length && <Separator className="bg-border-subtle my-1" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BriefsList;
