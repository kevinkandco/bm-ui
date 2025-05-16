
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PriorityPeopleWidgetProps {}

const PriorityPeopleWidget = React.memo(({}: PriorityPeopleWidgetProps) => {
  // Sample data with actual profile image URLs
  const priorityPeople = [
    { 
      name: "Sandra Chen", 
      title: "Product Manager", 
      lastActivity: "15m ago", 
      platform: "Email",
      active: true,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
    },
    { 
      name: "Alex Johnson", 
      title: "Engineering Lead", 
      lastActivity: "2h ago", 
      platform: "Slack",
      active: true,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
    },
    { 
      name: "Michael Lee", 
      title: "CEO", 
      lastActivity: "1d ago", 
      platform: "Calendar",
      active: false,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
    },
    { 
      name: "Taylor Swift", 
      title: "Designer", 
      lastActivity: "3h ago", 
      platform: "Slack",
      active: true,
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
    },
    { 
      name: "Jamie Williams", 
      title: "Marketing", 
      lastActivity: "5h ago", 
      platform: "Email",
      active: true,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
    }
  ];
  
  return (
    <TooltipProvider>
      <div className="flex gap-1.5">
        {priorityPeople.map((person) => (
          <Popover key={person.name}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 ring-2 ring-background hover:scale-105 transition-transform">
                      <AvatarImage src={person.image} alt={person.name} />
                      <AvatarFallback className={`${
                        person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"
                      } text-xs`}>
                        {person.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{person.name}</p>
                  </TooltipContent>
                </Tooltip>
                {person.active && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={person.image} alt={person.name} />
                  <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-text-primary">{person.name}</h3>
                  <p className="text-text-secondary text-sm">{person.title}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                    <span>{person.platform}</span>
                    <span>•</span>
                    <span>{person.lastActivity}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </TooltipProvider>
  );
});

PriorityPeopleWidget.displayName = 'PriorityPeopleWidget';
export default PriorityPeopleWidget;
