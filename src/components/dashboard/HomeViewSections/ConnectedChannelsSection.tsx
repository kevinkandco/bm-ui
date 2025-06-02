
import React, { useCallback, useEffect } from "react";
import { Settings, MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useApi } from "@/hooks/useApi";

interface IntegrationOption {
  name: string;
  id: string;
  icon: string;
  connected: boolean;
  comingSoon: boolean;
}

const ConnectedChannelsSection = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { call } = useApi();
  const [connectedPlatforms, setConnectedPlatforms] = React.useState([]);

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

  const getProvider = useCallback(async (): Promise<void> => {
      const response = await call("get", "/api/settings/system-integrations", {
        showToast: false,
        returnOnFailure: false,
      });
  
      if (response?.data) {
        
        const data = response.data.reduce(
          (
            acc: IntegrationOption[],
            integration: { provider_name: string; is_connected: boolean }
          ) => {
            acc.push({
              name: integration?.provider_name,
              id: integration?.provider_name?.toLowerCase(),
              icon: integration?.provider_name?.charAt(0)?.toLocaleUpperCase(),
              connected: integration.is_connected,
              comingSoon: false,
            });
            return acc;
          },
          []
        );
  
        setConnectedPlatforms(data);
      }
    }, [call]);
    
    useEffect(() => {
      getProvider();
    }, [getProvider]);

  const handleOpenSettings = () => {
    navigate("/dashboard/settings?tab=integrations");
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

        {/* Coming Soon Platforms - styled like the image */}
        <div className="flex items-center gap-1 flex-wrap">
          {comingSoonPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="px-2 py-1 bg-gray-600/90 rounded-full text-white text-[10px] font-medium cursor-pointer hover:bg-gray-500/90 transition-colors">
                  {platform.name}
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
