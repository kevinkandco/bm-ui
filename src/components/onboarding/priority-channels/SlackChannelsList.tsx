
import { cn } from "@/lib/utils";
import { Hash, Lock } from "lucide-react";
import { useState } from "react";
import { PriorityChannels } from "./types";

interface SlackChannelsListProps {
  slackChannels: PriorityChannels[];
  priorityChannels: string[];
  onSelectChannel: (channel: string) => void;
}

export const SlackChannelsList = ({ 
  slackChannels, 
  priorityChannels, 
  onSelectChannel 
}: SlackChannelsListProps) => {
  const [showAllChannels, setShowAllChannels] = useState(false);
  
  // Show 10 channels by default instead of 5
  const displayedChannels = showAllChannels 
    ? slackChannels 
    : slackChannels?.slice(0, 10);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-1.5">
        {displayedChannels?.map(channel => (
          <button
            key={channel?.id}
            onClick={() => onSelectChannel(channel?.name)}
            className={cn(
              "flex items-center justify-between py-2 px-3 rounded-lg border text-left",
              priorityChannels?.includes(channel?.name)
                ? "bg-white/20 border-neon-mint/30 text-neon-mint"
                : "bg-white/5 border-white/20 text-off-white hover:bg-white/10"
            )}
          >
            <div className="flex items-center gap-2">
              {channel?.channel_type ? <Lock size={16} className="text-neon-mint" /> : <Hash size={16} className="text-neon-mint" />}
              <div className="font-medium">{channel?.name}</div>
            </div>
            {priorityChannels?.includes(channel?.name) && (
              <div className="text-neon-mint text-sm">Added</div>
            )}
          </button>
        ))}
      </div>
      
      {!showAllChannels && slackChannels?.length > 10 && (
        <button 
          onClick={() => setShowAllChannels(true)}
          className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-off-white/70 hover:text-off-white text-sm transition-colors"
        >
          Show all {slackChannels?.length} channels
        </button>
      )}
    </div>
  );
};
