
import React from "react";
import { Wifi, MessageSquare, Mail, Calendar } from "lucide-react";

const ConnectedChannelsSection = () => {
  const platforms = [
    { name: "Slack", channels: ["#product", "#team-updates", "#general"], icon: MessageSquare, active: true },
    { name: "Email", channels: ["Work Inbox", "Personal"], icon: Mail, active: true },
    { name: "Calendar", channels: ["Work", "Personal"], icon: Calendar, active: true }
  ];

  return (
    <div className="p-6">
      <h2 className="text-deep-teal text-lg flex items-center mb-2">
        <Wifi className="mr-2 h-5 w-5 text-glass-blue" />
        Connected Channels
      </h2>
      <p className="text-deep-teal/80 text-sm mb-3">
        Monitoring {platforms.reduce((total, p) => total + p.channels.length, 0)} channels across {platforms.length} platforms
      </p>
      <div className="space-y-3">
        {platforms.map((platform, i) => (
          <div key={i} className="rounded-lg p-3 hover:bg-white/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <platform.icon className="h-4 w-4 text-glass-blue mr-2" />
                <h3 className="text-sm font-medium text-deep-teal">{platform.name}</h3>
              </div>
              <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-glass-blue" : "bg-gray-300"}`}></span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {platform.channels.map((channel, j) => (
                <span key={j} className="text-xs text-deep-teal/80 bg-white/40 px-2 py-0.5 rounded border border-white/30">
                  {channel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ConnectedChannelsSection);
