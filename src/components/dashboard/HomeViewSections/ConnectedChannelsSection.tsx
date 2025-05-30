
import React from "react";
import { Settings, MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ConnectedChannelsSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const connectedPlatforms = [
    // V1 integrations - available now
    { name: "Slack", id: "slack", icon: Slack, connected: true, comingSoon: false },
    { name: "Gmail", id: "gmail", icon: Mail, connected: true, comingSoon: false },
    
    // V2 integrations - coming soon
    { name: "Outlook", id: "outlook", icon: Mail, connected: false, comingSoon: true },
    { name: "Google Calendar", id: "calendar", icon: Calendar, connected: false, comingSoon: true },
    { name: "Asana", id: "asana", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Notion", id: "notion", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Zoom/Meet", id: "zoom", icon: MessageSquare, connected: false, comingSoon: true },
    
    // V3 integrations - coming soon
    { name: "Microsoft Teams", id: "teams", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Salesforce", id: "salesforce", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Hubspot", id: "hubspot", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Jira", id: "jira", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Confluence", id: "confluence", icon: MessageSquare, connected: false, comingSoon: true },
    
    // Future integrations - coming soon
    { name: "GitHub/GitLab", id: "github", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "Zendesk", id: "zendesk", icon: MessageSquare, connected: false, comingSoon: true },
    { name: "ServiceNow", id: "servicenow", icon: MessageSquare, connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render the appropriate icon based on platform ID
  const renderIcon = (platform: typeof connectedPlatforms[0]) => {
    const iconClass = `h-3 w-3 ${
      platform.connected ? "text-accent-primary" : "text-text-muted/50"
    }`;

    switch (platform.id) {
      case "slack":
        return <Slack className={iconClass} />;
      case "gmail":
      case "outlook":
        return <Mail className={iconClass} />;
      case "calendar":
        return <Calendar className={iconClass} />;
      case "teams":
      case "asana":
      case "notion":
      case "zoom":
      case "salesforce":
      case "hubspot":
      case "jira":
      case "confluence":
      case "github":
      case "zendesk":
      case "servicenow":
      default:
        return <MessageSquare className={iconClass} />;
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-2">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-text-primary text-xs font-medium">Connected Channels</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-4 w-4"
            onClick={handleOpenSettings}
          >
            <Settings className="h-2 w-2 text-text-secondary" />
          </Button>
        </div>
        
        <div className="flex items-center gap-1 flex-wrap">
          {connectedPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    platform.connected 
                      ? "bg-accent-primary/20 border border-accent-primary/30" 
                      : "bg-surface-raised/20 border border-border-subtle/50 hover:bg-surface-raised/30"
                  }`}>
                    {renderIcon(platform)}
                  </div>
                  {platform.connected && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 rounded-full bg-green-500 border border-background"></span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>
                  {platform.name}
                  {platform.comingSoon && " - coming soon!"}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(ConnectedChannelsSection);
