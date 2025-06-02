
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
    { name: "Slack", id: "slack", icon: "S", connected: true, comingSoon: false },
    { name: "Gmail", id: "gmail", icon: "G", connected: true, comingSoon: false },
  ];

  const comingSoonPlatforms = [
    { name: "Outlook", id: "outlook", icon: "O", connected: false, comingSoon: true },
    { name: "Google Calendar", id: "calendar", icon: "C", connected: false, comingSoon: true },
    { name: "Asana", id: "asana", icon: "A", connected: false, comingSoon: true },
    { name: "Notion", id: "notion", icon: "N", connected: false, comingSoon: true },
    { name: "Zoom/Meet", id: "zoom", icon: "Z", connected: false, comingSoon: true },
    { name: "Microsoft Teams", id: "teams", icon: "T", connected: false, comingSoon: true },
    { name: "Salesforce", id: "salesforce", icon: "SF", connected: false, comingSoon: true },
    { name: "Hubspot", id: "hubspot", icon: "H", connected: false, comingSoon: true },
    { name: "Jira", id: "jira", icon: "J", connected: false, comingSoon: true },
    { name: "Confluence", id: "confluence", icon: "CF", connected: false, comingSoon: true },
    { name: "GitHub/GitLab", id: "github", icon: "GH", connected: false, comingSoon: true },
    { name: "Zendesk", id: "zendesk", icon: "ZD", connected: false, comingSoon: true },
    { name: "ServiceNow", id: "servicenow", icon: "SN", connected: false, comingSoon: true }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  const renderIcon = (platform: typeof connectedPlatforms[0] | typeof comingSoonPlatforms[0]) => {
    const iconSize = 16;
    
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
        return <span className="text-white font-semibold text-xs">{platform.icon}</span>;
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="bg-ds-surface rounded-xl p-24 shadow-card">
        <div className="flex items-center justify-between mb-16">
          <h2 className="text-ds-text-primary text-lg font-semibold">Connected Channels</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-ds-surface-raised"
            onClick={handleOpenSettings}
          >
            <Settings className="h-4 w-4 text-ds-text-secondary" />
          </Button>
        </div>
        
        {/* Connected Platforms */}
        <div className="flex items-center gap-8 flex-wrap mb-24">
          {connectedPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all duration-hover ${
                    platform.connected 
                      ? "bg-ds-accent-blue" 
                      : "bg-ds-text-secondary opacity-50"
                  }`}>
                    {renderIcon(platform)}
                  </div>
                  {platform.connected && (
                    <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-ds-accent-green border-2 border-ds-surface"></span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-label">
                <p>{platform.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Coming Soon Label */}
        <div className="text-label text-ds-text-secondary font-medium mb-12 border-t border-ds-divider pt-16">
          Coming Soon
        </div>

        {/* Coming Soon Platforms */}
        <div className="flex items-center gap-8 flex-wrap">
          {comingSoonPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="px-12 py-6 bg-ds-surface-raised rounded-full text-ds-text-secondary text-label font-medium cursor-pointer hover:bg-ds-divider transition-colors duration-hover">
                  {platform.name}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-label">
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
