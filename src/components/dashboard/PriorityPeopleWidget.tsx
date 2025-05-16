
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface PriorityPeopleWidgetProps {}

const PriorityPeopleWidget = React.memo(({}: PriorityPeopleWidgetProps) => {
  // Sample data - in a real app this would come from a data source
  const priorityPeople = [
    { 
      name: "Sandra Chen", 
      title: "Product Manager", 
      lastActivity: "15m ago", 
      platform: "Email",
      active: true,
      image: null
    },
    { 
      name: "Alex Johnson", 
      title: "Engineering Lead", 
      lastActivity: "2h ago", 
      platform: "Slack",
      active: true,
      image: null
    },
    { 
      name: "Michael Lee", 
      title: "CEO", 
      lastActivity: "1d ago", 
      platform: "Calendar",
      active: false,
      image: null
    },
    { 
      name: "Taylor Swift", 
      title: "Designer", 
      lastActivity: "3h ago", 
      platform: "Slack",
      active: true,
      image: null
    },
    { 
      name: "Jamie Williams", 
      title: "Marketing", 
      lastActivity: "5h ago", 
      platform: "Email",
      active: true,
      image: null
    }
  ];
  
  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2">
        {priorityPeople.map((person) => (
          <Popover key={person.name}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-12 w-12 border-2 border-background hover:scale-105 transition-transform">
                      <AvatarImage src={person.image || undefined} />
                      <AvatarFallback className={`${
                        person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"
                      }`}>
                        {person.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{person.name}</p>
                  </TooltipContent>
                </Tooltip>
                {person.active && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-accent-primary border-2 border-background"></span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
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
