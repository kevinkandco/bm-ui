import React, { useState } from "react";
import { Settings, Hash, AlertTriangle, ChevronDown, Slack, Mail, PlugZap, GripVertical } from "lucide-react";
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

  const [peopleOpen, setPeopleOpen] = useState(true);
  const [channelsOpen, setChannelsOpen] = useState(true);
  const [triggersOpen, setTriggersOpen] = useState(true);
  const [integrationsOpen, setIntegrationsOpen] = useState(true);

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [sections, setSections] = useState([
    'people',
    'channels', 
    'triggers',
    'integrations'
  ]);

  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedItem(sectionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem === targetSectionId) {
      setDraggedItem(null);
      return;
    }

    const newSections = [...sections];
    const draggedIndex = newSections.indexOf(draggedItem);
    const targetIndex = newSections.indexOf(targetSectionId);
    
    // Remove dragged item and insert at target position
    newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);
    
    setSections(newSections);
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const getSectionState = (sectionId: string) => {
    switch (sectionId) {
      case 'people': return peopleOpen;
      case 'channels': return channelsOpen;
      case 'triggers': return triggersOpen;
      case 'integrations': return integrationsOpen;
      default: return false;
    }
  };

  const setSectionState = (sectionId: string, isOpen: boolean) => {
    switch (sectionId) {
      case 'people': setPeopleOpen(isOpen); break;
      case 'channels': setChannelsOpen(isOpen); break;
      case 'triggers': setTriggersOpen(isOpen); break;
      case 'integrations': setIntegrationsOpen(isOpen); break;
    }
  };

  const renderPeopleSection = () => (
    <CollapsibleContent className="mt-1">
      <div className="flex items-center gap-1">
        {priorities?.priorityPeople?.slice(0, 4).map((person, i) => (
          <div key={i} className="relative">
            <Avatar className="h-6 w-6 ring-1 ring-background">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback className={`${person.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"} text-xs`}>
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
    </CollapsibleContent>
  );

  const renderChannelsSection = () => (
    <CollapsibleContent className="mt-1">
      <div className="flex items-center gap-1 flex-wrap">
        {priorities?.priorityChannels?.slice(0, 3)?.map((channel, i) => (
          <div key={i} className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${channel.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"}`}>
            <Hash className="h-2.5 w-2.5" />
            <span>{channel?.name}</span>
          </div>
        ))}
        {priorities?.priorityChannels?.length > 3 && (
          <div className="px-2 py-1 rounded text-xs bg-surface-raised/30 text-text-secondary">
            +{priorities?.priorityChannels?.length - 3}
          </div>
        )}
      </div>
    </CollapsibleContent>
  );

  const renderTriggersSection = () => (
    <CollapsibleContent className="mt-1">
      <div className="flex items-center gap-1 flex-wrap">
        {priorities?.triggers?.slice(0, 3)?.map((trigger, i) => (
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
    </CollapsibleContent>
  );

  const renderIntegrationsSection = () => (
    <CollapsibleContent className="mt-1">
      <div className="flex items-center gap-1 flex-wrap">
        {priorities?.integrations?.map((integration, i) => {
          const Icon = integrationIcons[integration.name.toLowerCase()] || PlugZap;
          return (
            <div key={i} className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-accent-primary/20 text-accent-primary">
              <Icon className="h-2.5 w-2.5" />
              <span>{integration.name}</span>
            </div>
          )
        }
      )}
      </div>
    </CollapsibleContent>
  );

  const renderSection = (sectionId: string) => {
    const isOpen = getSectionState(sectionId);
    const isDragging = draggedItem === sectionId;
    
    let title = '';
    let count = 0;
    let content = null;

    switch (sectionId) {
      case 'people':
        title = 'People';
        count = priorities?.priorityPeople?.length;
        content = renderPeopleSection();
        break;
      case 'channels':
        title = 'Channels';
        count = priorities?.priorityChannels?.length;
        content = renderChannelsSection();
        break;
      case 'triggers':
        title = 'Triggers';
        count = priorities?.triggers?.length;
        content = renderTriggersSection();
        break;
      case 'integrations':
        title = 'Integrations';
        count = priorities?.integrations?.length;
        content = renderIntegrationsSection();
        break;
    }

    return (
      <div key={sectionId}>
        <Collapsible 
          open={isOpen} 
          onOpenChange={(open) => setSectionState(sectionId, open)} 
          className={`mb-3 ${isDragging ? 'opacity-50' : ''}`}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, sectionId)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, sectionId)}
            onDragEnd={handleDragEnd}
            className="group cursor-move"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-surface-raised/20 rounded p-1 transition-colors">
              <div className="flex items-center gap-2">
                <GripVertical className="h-3 w-3 text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs text-text-secondary font-medium">{title}</span>
                <span className="text-xs text-text-secondary bg-surface-raised/30 px-1.5 py-0.5 rounded">{count}</span>
              </div>
              <ChevronDown className={`h-3 w-3 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
          </div>
          {content}
        </Collapsible>
        {sectionId !== sections[sections.length - 1] && (
          <Separator className="my-3 bg-border-subtle" />
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      {sections.map(renderSection)}
    </div>
  );
};

export default React.memo(PrioritiesSection);
