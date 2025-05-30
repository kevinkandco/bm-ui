
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
    { name: "Outlook", id: "outlook", icon: Mail, connected: false, comingSoon: true },
    { name: "Google Calendar", id: "calendar", icon: Calendar, connected: false, comingSoon: true },
    { name: "Teams", id: "teams", icon: MessageSquare, connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render the appropriate icon based on platform ID
  const renderIcon = (platform: typeof connectedPlatforms[0]) => {
    switch (platform.id) {
      case "slack":
        return <Slack className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
      case "gmail":
        return <Mail className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
      case "outlook":
        return <Mail className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
      case "calendar":
        return <Calendar className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
      case "teams":
        return <MessageSquare className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
      default:
        return <platform.icon className={`h-3 w-3 ${
          platform.connected ? "text-accent-primary" : "text-text-muted/50"
        }`} />;
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-text-primary text-xs font-medium">Connected Channels</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5"
          onClick={handleOpenSettings}
        >
          <Settings className="h-2.5 w-2.5 text-text-secondary" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1.5">
        {connectedPlatforms.map((platform, i) => (
          <div key={i} className="relative group">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
              platform.connected 
                ? "bg-accent-primary/20 border border-accent-primary/30" 
                : "bg-surface-raised/20 border border-border-subtle/50"
            } ${platform.comingSoon ? "cursor-pointer" : ""}`}>
              {renderIcon(platform)}
            </div>
            {platform.comingSoon && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 text-[10px] px-1 py-0 h-3 bg-surface-raised/80 text-text-muted border border-border-subtle opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Soon
              </Badge>
            )}
            {platform.connected && (
              <span className="absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-green-500 border border-background"></span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(ConnectedChannelsSection);
