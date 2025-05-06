
import { cn } from "@/lib/utils";
import { Hash } from "lucide-react";

interface SlackChannelsListProps {
  slackChannels: string[];
  priorityChannels: string[];
  onSelectChannel: (channel: string) => void;
}

export const SlackChannelsList = ({ 
  slackChannels, 
  priorityChannels, 
  onSelectChannel 
}: SlackChannelsListProps) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {slackChannels.map(channel => (
        <button
          key={channel}
          onClick={() => onSelectChannel(channel)}
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
  );
};
