
import React, { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { PriorityPeople } from "../types";
import SlackSettingsModal from "@/components/settings/modal/SlackSettingsModal";

interface PriorityPeopleSectionProps {
  priorityPeople: PriorityPeople[];
}

const PriorityPeopleSection = ({priorityPeople} : PriorityPeopleSectionProps) => {
const navigate = useNavigate();
const [isSlackModalOpen, setSlackModalOpen] = useState(false);

  const handleOpenSettings = () => {
    // For now, we'll navigate to the general settings page
    // In the future, this could be a dedicated priority people settings page
    setSlackModalOpen(true);
  };

  return (
    <>
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
        {priorityPeople?.slice(0, 5).map((person, i) => (
          <div key={i} className="relative">
            <Avatar className="h-8 w-8 ring-2 ring-background">
              <AvatarImage src={person.avatar} alt={person.name} />
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
        {priorityPeople?.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center">
            <span className="text-xs text-text-secondary">+{priorityPeople?.length - 5}</span>
          </div>
        )}
      </div>
    </div>
    <SlackSettingsModal
        open={isSlackModalOpen}
        onClose={() => setSlackModalOpen(false)}
        initialTab={"priorityPeople"}
      />
    </>
  );
};

export default React.memo(PriorityPeopleSection);
