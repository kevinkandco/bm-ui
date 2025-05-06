
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Hash, Plus, X, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filteredChannels, setFilteredChannels] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mock Slack channels - in real implementation, would be fetched from Slack API
  const [slackChannels] = useState([
    "#general",
    "#random",
    "#announcements",
    "#team-dev",
    "#marketing",
    "#sales",
    "#support",
    "#watercooler",
    "#project-alpha",
    "#design",
    "#engineering",
    "#hr"
  ]);
  
  const hasSlackIntegration = userData.integrations?.some(
    (integration: any) => integration.type === "slack" || integration === "slack"
  );
  
  // Filter channels based on input
  useEffect(() => {
    if (isInputFocused) {
      const filtered = slackChannels.filter(
        channel => channel.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredChannels(filtered);
    } else {
      setFilteredChannels([]);
    }
  }, [inputValue, isInputFocused, slackChannels]);
  
  const addChannel = () => {
    if (!inputValue.trim()) return;
    
    // Check if channel already exists
    if (priorityChannels.includes(inputValue.trim())) {
      return;
    }
    
    setPriorityChannels(prev => [...prev, inputValue.trim()]);
    setInputValue("");
  };
  
  const selectChannel = (channel: string) => {
    if (!priorityChannels.includes(channel)) {
      setPriorityChannels(prev => [...prev, channel]);
    }
    setInputValue("");
    setFilteredChannels([]);
    setIsInputFocused(false);
  };
  
  const removeChannel = (channel: string) => {
    setPriorityChannels(prev => prev.filter(item => item !== channel));
  };
  
  const handleContinue = () => {
    updateUserData({ priorityChannels });
    onNext();
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
          <div className="flex gap-2 relative">
            <div className="relative flex-grow">
              <Input
                ref={inputRef}
                id="priority-channel"
                placeholder="Enter channel name (e.g. #random)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addChannel()}
                onFocus={() => setIsInputFocused(true)}
                className="bg-white/15 border-white/20 text-off-white placeholder:text-white placeholder:opacity-70 w-full focus:border-glass-blue/50 focus:ring-glass-blue/30"
              />
              
              {isInputFocused && filteredChannels.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                  {filteredChannels.map((channel) => (
                    <div
                      key={channel}
                      onClick={() => selectChannel(channel)}
                      className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                    >
                      <Hash size={14} className="text-glass-blue" />
                      <span className="text-off-white">{channel}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button 
              onClick={addChannel}
              variant="outline"
              className="shrink-0"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>
          
          {/* Selected channels display */}
          {priorityChannels.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-3 mt-2 pb-2">
              {priorityChannels.map(channel => (
                <div key={channel} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white">
                  <Hash size={14} className="text-glass-blue" />
                  {channel}
                  <button onClick={() => removeChannel(channel)} className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
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
            
            <div className="grid grid-cols-1 gap-2">
              {slackChannels.map(channel => (
                <button
                  key={channel}
                  onClick={() => selectChannel(channel)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border text-left",
                    priorityChannels.includes(channel)
                      ? "bg-white/20 border-neon-mint/30 text-neon-mint"
                      : "bg-white/5 border-white/20 text-off-white hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-neon-mint">
                      <Hash size={20} />
                    </div>
                    <div>
                      <div className="font-medium">{channel}</div>
                      <div className="text-sm text-off-white/50">Description</div>
                    </div>
                  </div>
                  {priorityChannels.includes(channel) && (
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
