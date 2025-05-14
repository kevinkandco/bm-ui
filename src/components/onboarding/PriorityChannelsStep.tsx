
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Info, Plus } from "lucide-react";
import { usePriorityChannelsState } from "./priority-channels/usePriorityChannelsState";
import { SelectedChannels } from "./priority-channels/SelectedChannels";
import { SlackChannelsList } from "./priority-channels/SlackChannelsList";
import { ChannelInput } from "./priority-channels/ChannelInput";

interface PriorityChannelsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityChannels: string[];
    [key: string]: any;
  };
}

const PriorityChannelsStep = ({
  onNext,
  onBack,
  updateUserData,
  userData
}: PriorityChannelsStepProps) => {
  const {
    priorityChannels,
    addChannel,
    removeChannel,
    slackChannels,
    selectChannel
  } = usePriorityChannelsState(userData.priorityChannels || []);

  const [showTip, setShowTip] = useState(true);

  const handleContinue = () => {
    // Update user data with selected channels
    updateUserData({
      priorityChannels: priorityChannels
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={4} totalSteps={7} />
      
      <div className="text-center space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-headline tracking-tighter">
          Select priority channels
        </h2>
        <p className="text-sm text-text-body max-w-md mx-auto">
          Which Slack channels contain the most important information for you?
        </p>
      </div>
      
      {showTip && (
        <div className="bg-card border border-divider rounded-lg p-4 flex gap-3">
          <Info className="h-5 w-5 text-text-secondary flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-text-headline">Tip</h3>
            <p className="text-xs text-text-body">
              Brief-me will prioritize updates from these channels in your daily briefings.
              Choose 3-5 channels for the best results.
            </p>
            <button 
              onClick={() => setShowTip(false)}
              className="text-xs text-accent-blue hover:underline"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      {/* Selected channels */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-headline">
          Your priority channels ({priorityChannels.length})
        </h3>
        
        <SelectedChannels 
          channels={priorityChannels} 
          onRemoveChannel={removeChannel}
        />
        
        {/* Channel input */}
        <ChannelInput 
          onAddChannel={addChannel}
          onSelectChannel={selectChannel}
          existingChannels={priorityChannels}
          availableChannels={slackChannels}
        />
      </div>
      
      {/* Available channels */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-text-headline">
          Available channels
        </h3>
        
        <SlackChannelsList 
          slackChannels={slackChannels}
          priorityChannels={priorityChannels}
          onSelectChannel={selectChannel}
        />
      </div>
      
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} variant="plain">
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={priorityChannels.length === 0}
          variant="default" 
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityChannelsStep;
