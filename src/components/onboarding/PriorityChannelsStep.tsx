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
    <div className="space-y-6">
      <ProgressIndicator currentStep={5} totalSteps={9} />
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary tracking-tighter">Which channels are critical?</h2>
        <p className="text-text-secondary">Mark your most important channels. We'll highlight updates from these channels in your brief.</p>
      </div>
      
      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="priority-channel" className="text-text-primary">Add important channels</Label>
          
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
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-text-primary">
              <span className="flex items-center gap-2">
                <MessageSquare size={18} className="text-accent-primary" />
                Your Slack Channels
              </span>
            </h3>
            
            <SlackChannelsList
              slackChannels={filteredChannels}
              priorityChannels={priorityChannels}
              onSelectChannel={selectChannel}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          onClick={onBack} 
          variant="back"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="pill"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityChannelsStep;
