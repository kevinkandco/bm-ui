
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { MessageSquare } from "lucide-react";
import { PriorityChannelsStepProps } from "./priority-channels/types";
import { SlackChannelsList } from "./priority-channels/SlackChannelsList";
import { ChannelInput } from "./priority-channels/ChannelInput";
import { SelectedChannels } from "./priority-channels/SelectedChannels";
import { usePriorityChannelsState } from "./priority-channels/usePriorityChannelsState";
import { useState } from "react";

const PriorityChannelsStep = ({ onNext, onBack, updateUserData, userData }: PriorityChannelsStepProps) => {
  const {
    priorityChannels,
    slackChannels,
    addChannel,
    selectChannel,
    removeChannel
  } = usePriorityChannelsState(userData.priorityChannels || []);
  
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter channels based on search query
  const filteredChannels = searchQuery 
    ? slackChannels.filter(channel => 
        channel.toLowerCase().includes(searchQuery.toLowerCase()))
    : slackChannels;
  
  const hasSlackIntegration = userData.integrations?.some(
    (integration: any) => integration.type === "slack" || integration === "slack"
  );
  
  const handleContinue = () => {
    updateUserData({ priorityChannels });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={5} totalSteps={9} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-text-primary tracking-tighter">Which channels are critical?</h2>
        <p className="text-text-secondary">Mark your most important channels. We'll highlight updates from these channels in your brief.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="priority-channel" className="text-text-primary">Add important channels</Label>
          <p className="text-sm text-text-secondary -mt-1">
            Add critical Slack channels, email folders, or other message sources you need to monitor closely.
          </p>
          
          <ChannelInput 
            onAddChannel={addChannel}
            onSelectChannel={selectChannel}
            existingChannels={priorityChannels}
            availableChannels={slackChannels}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <SelectedChannels 
            channels={priorityChannels} 
            onRemoveChannel={removeChannel} 
          />
        </div>
        
        {/* Slack channels section */}
        {(hasSlackIntegration || true) && (
          <div className="space-y-3 pt-2">
            <h3 className="text-lg font-medium text-text-primary">
              <span className="flex items-center gap-2">
                <MessageSquare size={18} className="text-accent-primary" />
                Your Slack Channels
              </span>
            </h3>
            <p className="text-sm text-text-secondary">
              Select channels from your Slack workspace to prioritize.
            </p>
            
            <SlackChannelsList
              slackChannels={filteredChannels}
              priorityChannels={priorityChannels}
              onSelectChannel={selectChannel}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="outline"
          className="border-border-subtle text-text-secondary hover:bg-surface-raised hover:text-text-primary"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          className="bg-accent-primary hover:bg-accent-primary/90 text-text-primary"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityChannelsStep;
