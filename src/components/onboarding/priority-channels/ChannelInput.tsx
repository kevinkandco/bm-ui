
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Hash, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChannelInputProps {
  onAddChannel: (channelName: string) => void;
  onSelectChannel: (channelName: string) => void;
  existingChannels: string[];
  availableChannels: string[];
}

export const ChannelInput = ({ 
  onAddChannel, 
  onSelectChannel, 
  existingChannels, 
  availableChannels 
}: ChannelInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [filteredChannels, setFilteredChannels] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Filter channels based on input
  useEffect(() => {
    if (isInputFocused) {
      const filtered = availableChannels.filter(
        channel => channel.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredChannels(filtered);
    } else {
      setFilteredChannels([]);
    }
  }, [inputValue, isInputFocused, availableChannels]);
  
  const handleAddChannel = () => {
    if (!inputValue.trim()) return;
    
    // Check if channel already exists
    if (existingChannels.includes(inputValue.trim())) {
      return;
    }
    
    onAddChannel(inputValue.trim());
    setInputValue("");
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
    <div className="flex gap-2 relative">
      <div className="relative flex-grow">
        <Input
          ref={inputRef}
          id="priority-channel"
          placeholder="Enter channel name (e.g. #random)"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddChannel()}
          onFocus={() => setIsInputFocused(true)}
          className="bg-white/15 border-white/20 text-off-white placeholder:text-white placeholder:opacity-70 w-full focus:border-glass-blue/50 focus:ring-glass-blue/30"
        />
        
        {isInputFocused && filteredChannels.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
            {filteredChannels.map((channel) => (
              <div
                key={channel}
                onClick={() => onSelectChannel(channel)}
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
        onClick={handleAddChannel}
        variant="outline"
        className="shrink-0"
      >
        <Plus size={16} />
        Add
      </Button>
    </div>
  );
};
