
import React from "react";
import { Settings, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const ConnectedChannelsSection = () => {
  const navigate = useNavigate();
  
  const connectedPlatforms = [
    { name: "Gmail", icon: Mail, connected: true, comingSoon: false },
    { name: "Slack", icon: MessageSquare, connected: true, comingSoon: false },
    { name: "Teams", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Calendar", icon: MessageSquare, connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-text-primary text-sm font-medium">Connected Channels</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6"
          onClick={handleOpenSettings}
        >
          <Settings className="h-3 w-3 text-text-secondary" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {connectedPlatforms.map((platform, i) => (
          <div key={i} className="relative">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              platform.connected 
                ? "bg-accent-primary/20 border border-accent-primary/30" 
                : "bg-surface-raised/30 border border-border-subtle"
            }`}>
              <platform.icon className={`h-4 w-4 ${
                platform.connected ? "text-accent-primary" : "text-text-muted"
              }`} />
            </div>
            {platform.comingSoon && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 text-xs px-1 py-0 h-4 bg-surface-raised/50 text-text-muted border border-border-subtle"
              >
                Soon
              </Badge>
            )}
            {platform.connected && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 border border-background"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ConnectedChannelsSection);
