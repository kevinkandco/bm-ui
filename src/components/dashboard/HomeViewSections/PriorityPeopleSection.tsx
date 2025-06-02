
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

const PriorityPeopleSection = () => {
  const navigate = useNavigate();
  
  const priorityPeople = [
    { 
      name: "Sandra Chen", 
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      active: true 
    },
    { 
      name: "Alex Johnson", 
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      active: true 
    },
    { 
      name: "Michael Lee", 
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      active: false 
    },
    { 
      name: "Taylor Swift", 
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
      active: true 
    }
  ];

  const handleOpenSettings = () => {
    // For now, we'll navigate to the general settings page
    // In the future, this could be a dedicated priority people settings page
    navigate("/dashboard/settings");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-text-primary text-sm font-medium">Priority People</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleOpenSettings}
        >
          <Settings className="h-3 w-3 text-text-secondary" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        {priorityPeople.slice(0, 5).map((person, i) => (
          <div key={i} className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={person.image} alt={person.name} />
              <AvatarFallback className={`${
                person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"
              } text-xs`}>
                {person.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {person.active && (
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 border border-background"></span>
            )}
          </div>
        ))}
        {priorityPeople.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center">
            <span className="text-xs text-text-secondary">+{priorityPeople.length - 5}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(PriorityPeopleSection);
