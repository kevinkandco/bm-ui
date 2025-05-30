import React from "react";
import { Settings, MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const ConnectedChannelsSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const connectedPlatforms = [
    { name: "Gmail", id: "gmail", icon: Mail, connected: true, comingSoon: false },
    { name: "Slack", id: "slack", icon: Slack, connected: true, comingSoon: false },
    { name: "Teams", id: "teams", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Calendar", id: "calendar", icon: Calendar, connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render the appropriate icon based on platform ID
  const renderIcon = (platform: typeof connectedPlatforms[0]) => {
    switch (platform.id) {
      case "slack":
        return <Slack className={`h-4 w-4 ${
          platform.connected ? "text-accent-primary" : "text-text-muted"
        }`} />;
      case "gmail":
        return <Mail className={`h-4 w-4 ${
          platform.connected ? "text-accent-primary" : "text-text-muted"
        }`} />;
      case "calendar":
        return <Calendar className={`h-4 w-4 ${
          platform.connected ? "text-accent-primary" : "text-text-muted"
        }`} />;
      case "teams":
        return <MessageSquare className={`h-4 w-4 ${
          platform.connected ? "text-accent-primary" : "text-text-muted"
        }`} />;
      default:
        return <platform.icon className={`h-4 w-4 ${
          platform.connected ? "text-accent-primary" : "text-text-muted"
        }`} />;
    }
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
              {renderIcon(platform)}
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
