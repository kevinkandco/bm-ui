import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Hash, Plus, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityChannelsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityChannels: string[];
    integrations: any[];
    [key: string]: any;
  };
}

const PriorityChannelsStep = ({ onNext, onBack, updateUserData, userData }: PriorityChannelsStepProps) => {
  const [inputValue, setInputValue] = useState("");
  const [priorityChannels, setPriorityChannels] = useState<string[]>(userData.priorityChannels || []);
  
  // Mock Slack channels - in real implementation, would be fetched from Slack API
  const [slackChannels] = useState([
    { id: "ch1", name: "alerts", description: "System alerts and notifications" },
    { id: "ch2", name: "team-dev", description: "Development team discussions" },
    { id: "ch3", name: "incidents", description: "Service incidents and status" },
    { id: "ch4", name: "general", description: "General conversations" },
    { id: "ch5", name: "announcements", description: "Company-wide announcements" },
  ]);
  
  const hasSlackIntegration = userData.integrations.some(
    (integration: any) => integration.type === "slack"
  );
  
  const addChannel = () => {
    if (!inputValue.trim()) return;
    
    setPriorityChannels(prev => [...prev, inputValue.trim()]);
    setInputValue("");
  };
  
  const removeChannel = (channel: string) => {
    setPriorityChannels(prev => prev.filter(item => item !== channel));
  };
  
  const addSlackChannel = (channel: { name: string }) => {
    const channelName = `#${channel.name}`;
    // Check if already added to avoid duplicates
    if (!priorityChannels.includes(channelName)) {
      setPriorityChannels(prev => [...prev, channelName]);
    }
  };
  
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
          <p className="text-sm text-off-white/50 -mt-1">
            Add critical Slack channels, email folders, or other message sources you need to monitor closely.
          </p>
          <div className="flex gap-2">
            <Input
              id="priority-channel"
              placeholder="Enter channel name (e.g. #alerts)"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChannel()}
              className="bg-white/10 border-white/20 text-off-white"
            />
            <Button 
              onClick={addChannel}
              variant="outline"
              className="shrink-0"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>
          
          {priorityChannels.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {priorityChannels.map(channel => (
                <div key={channel} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-off-white">
                  <Hash size={14} className="text-neon-mint" />
                  {channel}
                  <button onClick={() => removeChannel(channel)} className="ml-1 focus:outline-none text-off-white/70 hover:text-off-white">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Slack channels section */}
        {hasSlackIntegration || true /* Forcing true for demo purposes */ && (
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
            
            <div className="grid grid-cols-1 gap-2">
              {slackChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => addSlackChannel(channel)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border text-left",
                    priorityChannels.includes(`#${channel.name}`)
                      ? "bg-white/20 border-neon-mint/30 text-neon-mint"
                      : "bg-white/5 border-white/20 text-off-white hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-neon-mint">
                      <Hash size={20} />
                    </div>
                    <div>
                      <div className="font-medium">#{channel.name}</div>
                      <div className="text-sm text-off-white/50">{channel.description}</div>
                    </div>
                  </div>
                  {priorityChannels.includes(`#${channel.name}`) && (
                    <div className="text-neon-mint">Added</div>
                  )}
                </button>
              ))}
            </div>
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
