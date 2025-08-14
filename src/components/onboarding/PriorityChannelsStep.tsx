
import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import ProgressIndicator from "./ProgressIndicator";
import { MessageSquare } from "lucide-react";
import { PriorityChannelsStepProps } from "./priority-channels/types";
import { SlackChannelsList } from "./priority-channels/SlackChannelsList";
import { ChannelInput } from "./priority-channels/ChannelInput";
import { SelectedChannels } from "./priority-channels/SelectedChannels";
import { usePriorityChannelsState } from "./priority-channels/usePriorityChannelsState";

const PriorityChannelsStep = ({ onNext, onBack, updateUserData, userData, connectedAccount }: PriorityChannelsStepProps) => {
  const slackId = connectedAccount?.find(c => c?.provider_name?.toLowerCase() === "slack")?.id;
  const {
    priorityChannels,
    slackChannels,
    allSlackChannels,
    addChannel,
    selectChannel,
    removeChannel
  } = usePriorityChannelsState(slackId, userData.priorityChannels || []);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [allChannelsJoined, setAllChannelsJoined] = useState(userData.allChannelsJoined || false);
  
  // Handle "All channels joined" toggle
  const handleAllChannelsToggle = (checked: boolean) => {
    setAllChannelsJoined(checked);
    if (checked) {
      // Select all available channels when toggled on
      const allAvailableChannels = [...new Set([...priorityChannels, ...slackChannels])];
      updateUserData({ 
        priorityChannels: allAvailableChannels,
        allChannelsJoined: true 
      });
    }
  };
  
  // Memoize filtered channels to prevent unnecessary recalculation
  const filteredChannels = useMemo(() => 
    searchQuery 
      ? slackChannels?.filter(channel => 
          channel?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
      : slackChannels,
    [searchQuery, slackChannels]
  );
  
  const hasSlackIntegration = userData.integrations?.includes("slack");
  
  const handleContinue = useCallback(() => {
    updateUserData({ 
      priorityChannels,
      allChannelsJoined 
    });
    onNext();
  }, [priorityChannels, allChannelsJoined, updateUserData, onNext]);

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={5} totalSteps={10} />
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-text-primary tracking-tighter">Which channels are critical?</h2>
        <p className="text-text-secondary">Mark your most important channels. We'll highlight updates from these channels in your brief.</p>
      </div>
      
      <div className="space-y-5">
        {/* All channels toggle */}
        <div className="flex items-center space-x-3 p-4 rounded-lg bg-brand-600/50 border border-border-subtle">
          <Checkbox 
            id="all-channels"
            checked={allChannelsJoined}
            onCheckedChange={(checked) => handleAllChannelsToggle(!!checked)}
            className="border-border-subtle data-[state=checked]:bg-accent-primary data-[state=checked]:border-accent-primary"
          />
          <Label 
            htmlFor="all-channels" 
            className="text-text-primary font-medium cursor-pointer"
          >
            All channels I've joined
          </Label>
        </div>
        
        {/* Manual channel selection - only show when "All channels" is not selected */}
        {!allChannelsJoined && (
          <>
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
                slackChannels={allSlackChannels}
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
          </>
        )}
        
        {/* Show selected channels summary when "All channels" is selected */}
        {allChannelsJoined && (
          <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/20">
            <p className="text-text-primary font-medium">All channels selected</p>
            <p className="text-text-secondary text-sm mt-1">
              You'll receive updates from all {slackChannels.length + priorityChannels.length} channels you've joined.
            </p>
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

export default React.memo(PriorityChannelsStep);
