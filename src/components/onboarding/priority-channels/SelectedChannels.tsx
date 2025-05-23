
import { X, Hash, Lock } from "lucide-react";
import { PriorityChannels } from "./types";

interface SelectedChannelsProps {
  channels: string[];
  slackChannels: PriorityChannels[];
  onRemoveChannel: (channel: string) => void;
}

export const SelectedChannels = ({ channels, slackChannels,onRemoveChannel }: SelectedChannelsProps) => {
  if (channels?.length === 0) {
    return null;
  }

  const selectedChannels = slackChannels?.filter(channel => channels?.includes(channel?.name));

  return (
    <div className="flex flex-wrap gap-3 pt-3 mt-2 pb-2">
      {selectedChannels?.map(channel => (
        <div 
          key={channel?.id} 
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 border border-white/30 text-white"
        >
          {/* <Hash size={18} className="text-white/70" /> */}
          {channel?.channel_type ? <Lock size={16} className="text-white/70" /> : <Hash size={16} className="text-white/70" />}
          <span>{channel?.name}</span>
          <button 
            onClick={() => onRemoveChannel(channel?.name)} 
            className="ml-1 p-1 focus:outline-none text-white/70 hover:text-white transition-colors rounded-full"
            aria-label={`Remove ${channel?.name}`}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
