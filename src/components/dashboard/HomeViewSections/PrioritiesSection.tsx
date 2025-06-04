
import React, { useState } from "react";
import { Settings, Hash, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Priorities, PriorityPeople } from "../types";
import SlackSettingsModal from "@/components/settings/modal/SlackSettingsModal";

interface PrioritiesSectionProps {
  priorities: Priorities;
  fetchDashboardData: () => void;
}

const PrioritiesSection = ({priorities, fetchDashboardData} : PrioritiesSectionProps) => {
  const [isSlackModalOpen, setSlackModalOpen] = useState(false);

  const handleOpenSettings = () => {
    setSlackModalOpen(true);
  };

  const handleCloseSettings = () => {
    setSlackModalOpen(false);
    fetchDashboardData();
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-text-primary text-sm font-medium">Priorities</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleOpenSettings}
        >
          <Settings className="h-3 w-3 text-text-secondary" />
        </Button>
      </div>
      
      {/* People */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-text-secondary font-medium">People</span>
        </div>
        <div className="flex items-center gap-1">
          {priorities?.priorityPeople?.slice(0, 4).map((person, i) => (
            <div key={i} className="relative">
              <Avatar className="h-6 w-6 ring-1 ring-background">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback className={`${
                  person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"
                } text-xs`}>
                  {person.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {person.active && (
                <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 border border-background"></span>
              )}
            </div>
          ))}
          {priorities?.priorityPeople?.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center">
              <span className="text-xs text-text-secondary">+{priorities?.priorityPeople?.length - 4}</span>
            </div>
          )}
        </div>
      </div>

      {/* Channels */}
      <div className="mb-3">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-text-secondary font-medium">Channels</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {priorities?.priorityChannels?.slice(0, 3).map((channel, i) => (
            <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              channel.active 
                ? "bg-accent-primary/20 text-accent-primary" 
                : "bg-surface-raised/30 text-text-secondary"
            }`}>
              <Hash className="h-2.5 w-2.5" />
              <span>{channel.name}</span>
            </div>
          ))}
          {priorities?.priorityChannels.length > 3 && (
            <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
              +{priorities?.priorityChannels.length - 3}
            </div>
          )}
        </div>
      </div>

      {/* Triggers */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-text-secondary font-medium">Triggers</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {priorities?.triggers?.slice(0, 3).map((trigger, i) => (
            <div key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400">
              <AlertTriangle className="h-2.5 w-2.5" />
              <span>{trigger}</span>
            </div>
          ))}
          {priorities?.triggers?.length > 3 && (
            <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
              +{priorities?.triggers?.length - 3}
            </div>
          )}
        </div>
      </div>
      <SlackSettingsModal
        open={isSlackModalOpen}
        onClose={handleCloseSettings}
        initialTab={"priorityPeople"}
      />
    </div>
  );
};

export default React.memo(PrioritiesSection);
