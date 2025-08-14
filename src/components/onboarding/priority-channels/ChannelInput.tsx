
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PriorityChannels } from "./types";
import { Search, Hash } from "lucide-react";

interface ChannelInputProps {
  onAddChannel: (channel: string) => void;
  onSelectChannel: (channel: string) => void;
  existingChannels: string[];
  availableChannels: PriorityChannels[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export const ChannelInput = ({
  onAddChannel,
  onSelectChannel,
  existingChannels,
  availableChannels,
  searchQuery = "",
  setSearchQuery
}: ChannelInputProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<PriorityChannels[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter channels based on input
  useEffect(() => {
    if (inputValue) {
      const filtered = availableChannels.filter(channel => channel?.name?.toLowerCase().includes(inputValue.toLowerCase()));
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, availableChannels]);

  // Handle adding a channel
  const addChannel = () => {
    if (!inputValue.trim()) return;
    onAddChannel(inputValue);
    setInputValue("");
    setSearchQuery("");
    setSearchResults([]);
  };

  // Handle selecting a channel from suggestions
  const selectChannel = (channel: string) => {
    onSelectChannel(channel);
    setInputValue("");
    setSearchResults([]);
    setSearchQuery("");
    setIsInputFocused(false);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setTimeout(() => setIsInputFocused(false), 200);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle input changes for search query if provided
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (setSearchQuery) {
      setSearchQuery(value);
    }
    setInputValue(value);
  };
  

  return <div className="space-y-2">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search size={16} className="text-white/30" />
        </div>
        <Input 
          ref={inputRef} 
          placeholder="Search or add channel (e.g. #marketing)" 
          value={inputValue} 
          onChange={handleSearchChange} 
          onFocus={() => setIsInputFocused(true)} 
          onKeyPress={e => e.key === 'Enter' && addChannel()} 
          className="pl-10 bg-white/15 border-white/20 text-off-white placeholder:text-white/50 h-12" 
        />
        
        {isInputFocused && searchResults.length > 0 && <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
            {searchResults.map(channel => <div key={channel} onClick={() => selectChannel(channel)} className="flex items-center gap-2 px-3 py-2 hover:bg-white/10 cursor-pointer">
                <Hash size={14} className="text-white/80" />
                <span className="text-off-white">{channel}</span>
                {existingChannels.includes(channel) && <span className="text-xs text-neon-mint ml-auto">Added</span>}
              </div>)}
          </div>}
      </div>
    </div>;
};
