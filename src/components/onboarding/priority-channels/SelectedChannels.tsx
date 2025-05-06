
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
    <div className="flex flex-wrap gap-2 pt-3 mt-2 pb-2">
      {channels.map(channel => (
        <div key={channel} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white">
          <Hash size={14} className="text-glass-blue" />
          {channel}
          <button onClick={() => onRemoveChannel(channel)} className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange transition-colors">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
