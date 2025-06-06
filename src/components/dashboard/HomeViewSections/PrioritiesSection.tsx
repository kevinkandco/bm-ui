import React, { useState } from "react";
import { Settings, Hash, AlertTriangle, ChevronDown, Slack, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

const PrioritiesSection = () => {
  const navigate = useNavigate();

  // State for collapsible sections
  const [peopleOpen, setPeopleOpen] = useState(true);
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [triggersOpen, setTriggersOpen] = useState(true);
  const [integrationsOpen, setIntegrationsOpen] = useState(true);

  const priorityPeople = [{
    name: "Sandra Chen",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    active: true
  }, {
    name: "Alex Johnson",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    active: true
  }, {
    name: "Michael Lee",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80",
    active: false
  }];
  const priorityChannels = [{
    name: "product",
    active: true
  }, {
    name: "engineering",
    active: true
  }, {
    name: "general",
    active: false
  }];
  const priorityTriggers = ["urgent", "deadline", "budget", "client"];
  const connectedIntegrations = [{
    name: "Slack",
    icon: Slack,
    connected: true
  }, {
    name: "Gmail",
    icon: Mail,
    connected: true
  }];
  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };
  return <div className="p-4 pt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-text-primary font-medium text-base">Priorities</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleOpenSettings}>
          <Settings className="h-3 w-3 text-text-secondary" />
        </Button>
      </div>
      
      {/* People Section */}
      <Collapsible open={peopleOpen} onOpenChange={setPeopleOpen} className="mb-3">
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <span className="text-xs text-text-secondary font-medium">People</span>
          <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${peopleOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1">
            {priorityPeople.slice(0, 4).map((person, i) => <div key={i} className="relative">
                <Avatar className="h-6 w-6 ring-1 ring-background">
                  <AvatarImage src={person.image} alt={person.name} />
                  <AvatarFallback className={`${person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"} text-xs`}>
                    {person.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {person.active && <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 border border-background"></span>}
              </div>)}
            {priorityPeople.length > 4 && <div className="w-6 h-6 rounded-full bg-surface-raised/30 border border-border-subtle flex items-center justify-center">
                <span className="text-xs text-text-secondary">+{priorityPeople.length - 4}</span>
              </div>}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Channels Section */}
      <Collapsible open={channelsOpen} onOpenChange={setChannelsOpen} className="mb-3">
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <span className="text-xs text-text-secondary font-medium">Channels</span>
          <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${channelsOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {priorityChannels.slice(0, 3).map((channel, i) => <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${channel.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"}`}>
                <Hash className="h-2.5 w-2.5" />
                <span>{channel.name}</span>
              </div>)}
            {priorityChannels.length > 3 && <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
                +{priorityChannels.length - 3}
              </div>}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Triggers Section */}
      <Collapsible open={triggersOpen} onOpenChange={setTriggersOpen} className="mb-3">
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <span className="text-xs text-text-secondary font-medium">Triggers</span>
          <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${triggersOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {priorityTriggers.slice(0, 3).map((trigger, i) => <div key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-orange-500/20 text-orange-400">
                <AlertTriangle className="h-2.5 w-2.5" />
                <span>{trigger}</span>
              </div>)}
            {priorityTriggers.length > 3 && <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
                +{priorityTriggers.length - 3}
              </div>}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator className="my-3 bg-border-subtle" />

      {/* Integrations Section */}
      <Collapsible open={integrationsOpen} onOpenChange={setIntegrationsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
          <span className="text-xs text-text-secondary font-medium">Integrations</span>
          <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${integrationsOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          <div className="flex items-center gap-1 flex-wrap">
            {connectedIntegrations.map((integration, i) => <div key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent-primary/20 text-accent-primary">
                <integration.icon className="h-2.5 w-2.5" />
                <span>{integration.name}</span>
              </div>)}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>;
};

export default React.memo(PrioritiesSection);
