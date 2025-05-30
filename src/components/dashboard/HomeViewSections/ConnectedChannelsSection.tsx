
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
    { name: "Slack", id: "slack", icon: "S", connected: true, comingSoon: false },
    { name: "Gmail", id: "gmail", icon: "G", connected: true, comingSoon: false },
  ];

  const comingSoonPlatforms = [
    // V2 integrations - coming soon
    { name: "Outlook", id: "outlook", icon: "O", connected: false, comingSoon: true },
    { name: "Google Calendar", id: "calendar", icon: "C", connected: false, comingSoon: true },
    { name: "Asana", id: "asana", icon: "A", connected: false, comingSoon: true },
    { name: "Notion", id: "notion", icon: "N", connected: false, comingSoon: true },
    { name: "Zoom/Meet", id: "zoom", icon: "Z", connected: false, comingSoon: true },
    
    // V3 integrations - coming soon
    { name: "Microsoft Teams", id: "teams", icon: "T", connected: false, comingSoon: true },
    { name: "Salesforce", id: "salesforce", icon: "SF", connected: false, comingSoon: true },
    { name: "Hubspot", id: "hubspot", icon: "H", connected: false, comingSoon: true },
    { name: "Jira", id: "jira", icon: "J", connected: false, comingSoon: true },
    { name: "Confluence", id: "confluence", icon: "CF", connected: false, comingSoon: true },
    
    // Future integrations - coming soon
    { name: "GitHub/GitLab", id: "github", icon: "GH", connected: false, comingSoon: true },
    { name: "Zendesk", id: "zendesk", icon: "ZD", connected: false, comingSoon: true },
    { name: "ServiceNow", id: "servicenow", icon: "SN", connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render the appropriate icon based on platform ID (same as onboarding)
  const renderIcon = (platform: typeof connectedPlatforms[0] | typeof comingSoonPlatforms[0]) => {
    const iconSize = 12; // Smaller for the condensed view
    
    switch (platform.id) {
      case "slack":
        return <Slack className="text-white" size={iconSize} />;
      case "gmail":
        return <Mail className="text-white" size={iconSize} />;
      case "outlook":
        return <Mail className="text-white" size={iconSize} />;
      case "calendar":
        return <Calendar className="text-white" size={iconSize} />;
      default:
        return <span className="text-white font-bold text-[8px]">{platform.icon}</span>;
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
        
        {/* Available/Connected Platforms */}
        <div className="flex items-center gap-1 flex-wrap mb-2">
          {connectedPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                    platform.connected 
                      ? "bg-accent-primary/80" 
                      : "bg-gray-800/90 opacity-70"
                  }`}>
                    {renderIcon(platform)}
                  </div>
                  {platform.connected && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-1 w-1 rounded-full bg-green-500 border border-background"></span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{platform.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Coming Soon Label */}
        <div className="text-[10px] text-text-secondary font-medium mb-1">
          Coming Soon
        </div>

        {/* Coming Soon Platforms */}
        <div className="flex items-center gap-1 flex-wrap">
          {comingSoonPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all bg-gray-800/90 opacity-70">
                    {renderIcon(platform)}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                <p>{platform.name} - coming soon!</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(ConnectedChannelsSection);
