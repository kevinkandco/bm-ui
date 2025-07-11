
import React from "react";
import { CheckSquare, Plus, Filter, Clock, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useNavigate } from "react-router-dom";

const TasksList = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateTask = () => {
    toast({
      title: "Create Task",
      description: "Opening task creation form",
    });
  };

  const tasks = [
    { 
      id: 1, 
      title: "Review Q2 strategy document", 
      dueDate: "Today, 5:00 PM",
      priority: "High",
      completed: false 
    },
    { 
      id: 2, 
      title: "Prepare for weekly team meeting", 
      dueDate: "Tomorrow, 10:00 AM",
      priority: "Medium",
      completed: false 
    },
    { 
      id: 3, 
      title: "Send client proposal", 
      dueDate: "May 16, 2025",
      priority: "High",
      completed: false 
    },
    { 
      id: 4, 
      title: "Update project timelines",
      dueDate: "May 18, 2025",
      priority: "Low",
      completed: false 
    },
    { 
      id: 5, 
      title: "Research new tools for team productivity", 
      dueDate: "Completed May 10",
      priority: "Medium",
      completed: true 
    }
  ];

  return (
    <div className="container p-4 md:p-6 max-w-7xl mx-auto">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={() => navigate("/dashboard")} 
                className="cursor-pointer"
              >
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Tasks</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
            <p className="text-text-secondary mt-1">Track and manage your to-dos</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button 
              onClick={handleCreateTask}
              className="rounded-full shadow-subtle hover:shadow-glow transition-all"
            >
              <Plus className="mr-2 h-5 w-5" /> Create Task
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
            <h2 className="text-xl font-semibold text-text-primary mb-4">Upcoming Tasks</h2>

            <div className="space-y-1">
              {tasks.filter(task => !task.completed).map((task) => (
                <React.Fragment key={task.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex items-center">
                      <div className="h-5 w-5 mr-3">
                        <CheckSquare className="h-5 w-5 text-accent-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary">{task.title}</h3>
                        <div className="flex items-center text-sm text-text-secondary">
                          <Clock className="h-3.5 w-3.5 inline mr-1" /> {task.dueDate}
                          <span className={`ml-3 px-2 py-0.5 text-xs rounded-full 
                            ${task.priority === "High" ? "bg-red-500/20 text-red-300" : 
                              task.priority === "Medium" ? "bg-yellow-500/20 text-yellow-300" : 
                              "bg-green-500/20 text-green-300"}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Complete</Button>
                  </div>
                  <Separator className="bg-border-subtle my-1" />
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <Separator className="bg-border-subtle" />
          
          <div className="p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
              <CheckCheck className="mr-2 h-5 w-5" />
              Completed
            </h2>
            
            <div className="space-y-1">
              {tasks.filter(task => task.completed).map((task) => (
                <React.Fragment key={task.id}>
                  <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer opacity-60">
                    <div className="flex items-center">
                      <div className="h-5 w-5 mr-3">
                        <CheckSquare className="h-5 w-5 text-accent-primary" fill="currentColor" />
                      </div>
                      <div>
                        <h3 className="font-medium text-text-primary line-through">{task.title}</h3>
                        <div className="flex items-center text-sm text-text-secondary">
                          <Clock className="h-3.5 w-3.5 inline mr-1" /> {task.dueDate}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">Undo</Button>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksList;
