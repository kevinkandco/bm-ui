
import React, { useState } from "react";
import { Settings, Hash, AlertTriangle, ChevronDown, Slack, Mail, PlugZap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Priorities, PriorityPeople } from "../types";
import SlackSettingsModal from "@/components/settings/modal/SlackSettingsModal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { capitalizeFirstLetter } from "@/lib/utils";


interface PrioritiesSectionProps {
  priorities: Priorities;
  fetchDashboardData: () => void;
}

const integrationIcons: Record<string, React.ElementType> = {
  slack: Slack,
  google: Mail,
  settings: Settings,
  // Add more as needed
};

const PrioritiesSection = ({priorities, fetchDashboardData} : PrioritiesSectionProps) => {
  const [isSlackModalOpen, setSlackModalOpen] = useState(false);
  const navigate = useNavigate();

  const [peopleOpen, setPeopleOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);
  const [triggersOpen, setTriggersOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  
  const handleOpenSettings = () => {
    setSlackModalOpen(true);
  };

  const handleCloseSettings = () => {
    setSlackModalOpen(false);
    fetchDashboardData();
  };
  return (
    <div className="p-4 pt-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-text-primary font-medium text-base">Priorities</h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleOpenSettings}
        >
          <Settings className="h-3 w-3 text-text-secondary" />
        </Button>
      </div>

      {/* People Section */}
      <Collapsible
        open={peopleOpen}
        onOpenChange={setPeopleOpen}
        className="mb-3"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">
              People
            </span>
            <span className="text-xs text-text-secondary bg-surface-raised/30 px-1.5 py-0.5 rounded">
              {priorities?.priorityPeople?.length}
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-text-secondary transition-transform ${
              peopleOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1">
            {priorities?.priorityPeople &&
              priorities.priorityPeople.slice(0, 4).map((person, i) => (
                <div key={i} className="relative">
                  <Avatar className="h-6 w-6 ring-1 ring-background">
                    <AvatarImage src={person.avatar} alt={person.name} />
                    <AvatarFallback
                      className={`${
                        person.active
                          ? "bg-accent-primary/20 text-accent-primary"
                          : "bg-surface-raised/30 text-text-secondary"
                      } text-xs`}
                    >
                      {person.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {person.active && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 border border-background"></span>
                  )}
                </div>
              ))}
            {priorities?.priorityPeople &&
              priorities.priorityPeople?.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center">
                  <span className="text-xs text-text-secondary">
                    +{priorities?.priorityPeople?.length - 4}
                  </span>
                </div>
              )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Channels Section */}
      <Collapsible
        open={channelsOpen}
        onOpenChange={setChannelsOpen}
        className="mb-3"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">
              Channels
            </span>
            <span className="text-xs text-text-secondary bg-surface-raised/30 px-1.5 py-0.5 rounded">
              {priorities?.priorityChannels?.length}
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-text-secondary transition-transform ${
              channelsOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {priorities?.priorityChannels &&
              priorities?.priorityChannels?.slice(0, 3)?.map((channel, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    channel.active
                      ? "bg-accent-primary/20 text-accent-primary"
                      : "bg-surface-raised/30 text-text-secondary"
                  }`}
                >
                  <Hash className="h-2.5 w-2.5" />
                  <span>{channel.name}</span>
                </div>
              ))}
            {priorities?.priorityChannels &&
              priorities.priorityChannels.length > 3 && (
                <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
                  +{priorities?.priorityChannels?.length - 3}
                </div>
              )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Triggers Section */}
      <Collapsible
        open={triggersOpen}
        onOpenChange={setTriggersOpen}
        className="mb-3"
      >
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">
              Triggers
            </span>
            <span className="text-xs text-text-secondary bg-surface-raised/30 px-1.5 py-0.5 rounded">
              {priorities?.triggers?.length}
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-text-secondary transition-transform ${
              triggersOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {priorities?.triggers &&
              priorities.triggers?.slice(0, 3).map((trigger, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400"
                >
                  <AlertTriangle className="h-2.5 w-2.5" />
                  <span>{trigger}</span>
                </div>
              ))}
            {priorities?.triggers && priorities.triggers?.length > 3 && (
              <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
                +{priorities?.triggers && priorities.triggers?.length - 3}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Integrations Section */}
      <Collapsible open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary font-medium">
              Integrations
            </span>
            <span className="text-xs text-text-secondary bg-surface-raised/30 px-1.5 py-0.5 rounded">
              {priorities?.integrations?.length}
            </span>
          </div>
          <ChevronDown
            className={`h-3 w-3 text-text-secondary transition-transform ${
              integrationsOpen ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {priorities?.integrations &&
              priorities.integrations?.map((integration, i) => {
                const Icon = integrationIcons[integration.name.toLowerCase()] || PlugZap;
                return (
                <div
                  key={i}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent-primary/20 text-accent-primary"
                >
                  <Icon className="h-2.5 w-2.5" />
                  <span>{integration.name}</span>
                </div>
              )})}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <SlackSettingsModal
        open={isSlackModalOpen}
        onClose={handleCloseSettings}
        initialTab={"priorityPeople"}
      />
    </div>
  );
};

export default React.memo(PrioritiesSection);
