
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
      <h2 className="text-text-primary text-lg flex items-center mb-2">
        <Wifi className="mr-2 h-5 w-5 text-accent-primary" />
        Connected Channels
      </h2>
      <p className="text-text-secondary text-sm mb-3">
        Monitoring {platforms.reduce((total, p) => total + p.channels.length, 0)} channels across {platforms.length} platforms
      </p>
      <div className="space-y-3">
        {platforms.map((platform, i) => (
          <div key={i} className="rounded-lg p-3 hover:bg-surface-raised/20 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <platform.icon className="h-4 w-4 text-accent-primary mr-2" />
                <h3 className="text-sm font-medium text-text-primary">{platform.name}</h3>
              </div>
              <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-accent-primary" : "bg-text-muted"}`}></span>
            </div>
            <div className="mt-1 flex flex-wrap gap-1">
              {platform.channels.map((channel, j) => (
                <span key={j} className="text-xs text-text-secondary bg-surface-raised/30 px-2 py-0.5 rounded border border-border-subtle">
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
