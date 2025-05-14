
import React from "react";
import { Wifi, MessageSquare, Mail, Calendar } from "lucide-react";

const ConnectedChannelsSection = () => {
  const platforms = [
    { name: "Slack", channels: ["#product", "#team-updates", "#general"], icon: MessageSquare, active: true },
    { name: "Email", channels: ["Work Inbox", "Personal"], icon: Mail, active: true },
    { name: "Calendar", channels: ["Work", "Personal"], icon: Calendar, active: true }
  ];

  return (
    <div className="p-card-padding">
      <h2 className="text-heading-md text-text-headline flex items-center mb-2">
        <Wifi className="mr-2 h-5 w-5 text-icon" />
        Connected Channels
      </h2>
      <p className="text-body text-text-secondary mb-4">
        Monitoring {platforms.reduce((total, p) => total + p.channels.length, 0)} channels across {platforms.length} platforms
      </p>
      <div className="space-y-row-gap">
        {platforms.map((platform, i) => (
          <div key={i} className="rounded-md p-3 hover:bg-card/30 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <platform.icon className="h-4 w-4 text-icon mr-2" />
                <h3 className="text-body font-medium text-text-headline">{platform.name}</h3>
              </div>
              <span className={`h-2 w-2 rounded-full ${platform.active ? "bg-accent-blue" : "bg-text-secondary"}`}></span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {platform.channels.map((channel, j) => (
                <span key={j} className="text-xs text-text-secondary bg-card/50 px-2 py-1 rounded border border-divider">
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
