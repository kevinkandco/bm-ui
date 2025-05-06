
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Hash, MessageSquare } from "lucide-react";
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
        <h2 className="text-2xl font-semibold text-off-white tracking-tighter">Which channels are critical?</h2>
        <p className="text-off-white/70">Mark your most important channels. We'll highlight updates from these channels in your brief.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="priority-channel" className="text-off-white">Add important channels</Label>
          <p className="text-sm text-off-white/70 -mt-1">
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
            <h3 className="text-lg font-medium text-off-white">
              <span className="flex items-center gap-2">
                <MessageSquare size={18} className="text-neon-mint" />
                Your Slack Channels
              </span>
            </h3>
            <p className="text-sm text-off-white/50">
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
          variant="plain"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityChannelsStep;
