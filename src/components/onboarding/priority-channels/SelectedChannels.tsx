
import { X, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectedChannelsProps {
  channels: string[];
  onRemoveChannel: (channel: string) => void;
}

export const SelectedChannels = ({ channels, onRemoveChannel }: SelectedChannelsProps) => {
  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-3 pt-3 mt-2 pb-2">
      {channels.map(channel => (
        <div 
          key={channel} 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white"
        >
          <Hash size={18} className="text-white/70" />
          <span>{channel}</span>
          <button 
            onClick={() => onRemoveChannel(channel)} 
            className="ml-1 p-1 focus:outline-none text-white/70 hover:text-white transition-colors rounded-full"
            aria-label={`Remove ${channel}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
