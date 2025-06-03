import React from "react";
import { Settings, MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface ConnectedChannelsSectionProps {
  showAsHorizontal?: boolean;
}
const ConnectedChannelsSection = ({
  showAsHorizontal = false
}: ConnectedChannelsSectionProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const connectedPlatforms = [
  // V1 integrations - available now
  {
    name: "Slack",
    id: "slack",
    icon: "S",
    connected: true,
    comingSoon: false,
    monitoring: "Active"
  }, {
    name: "Gmail",
    id: "gmail",
    icon: "G",
    connected: true,
    comingSoon: false,
    monitoring: "Monitoring"
  }];
  const comingSoonPlatforms = [
  // V2 integrations - coming soon
  {
    name: "Outlook",
    id: "outlook",
    icon: "O",
    connected: false,
    comingSoon: true
  }, {
    name: "Google Calendar",
    id: "calendar",
    icon: "C",
    connected: false,
    comingSoon: true
  }, {
    name: "Asana",
    id: "asana",
    icon: "A",
    connected: false,
    comingSoon: true
  }, {
    name: "Notion",
    id: "notion",
    icon: "N",
    connected: false,
    comingSoon: true
  }, {
    name: "Zoom/Meet",
    id: "zoom",
    icon: "Z",
    connected: false,
    comingSoon: true
  },
  // V3 integrations - coming soon
  {
    name: "Microsoft Teams",
    id: "teams",
    icon: "T",
    connected: false,
    comingSoon: true
  }, {
    name: "Salesforce",
    id: "salesforce",
    icon: "SF",
    connected: false,
    comingSoon: true
  }, {
    name: "Hubspot",
    id: "hubspot",
    icon: "H",
    connected: false,
    comingSoon: true
  }, {
    name: "Jira",
    id: "jira",
    icon: "J",
    connected: false,
    comingSoon: true
  }, {
    name: "Confluence",
    id: "confluence",
    icon: "CF",
    connected: false,
    comingSoon: true
  },
  // Future integrations - coming soon
  {
    name: "GitHub/GitLab",
    id: "github",
    icon: "GH",
    connected: false,
    comingSoon: true
  }, {
    name: "Zendesk",
    id: "zendesk",
    icon: "ZD",
    connected: false,
    comingSoon: true
  }, {
    name: "ServiceNow",
    id: "servicenow",
    icon: "SN",
    connected: false,
    comingSoon: true
  }];
  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render the appropriate icon based on platform ID
  const renderIcon = (platform: typeof connectedPlatforms[0] | typeof comingSoonPlatforms[0], isComingSoon = false) => {
    const iconSize = isComingSoon ? 12 : 16;
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
        return <span className={`text-white font-medium ${isComingSoon ? 'text-xs' : 'text-sm'}`}>{platform.icon}</span>;
    }
  };

  // Horizontal layout for desktop
  if (showAsHorizontal) {
    return <TooltipProvider delayDuration={300}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-text-primary font-light text-sm">Monitoring:</h2>
            
            {/* Connected Platforms */}
            <div className="flex items-center gap-3">
              {connectedPlatforms.map((platform, i) => <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200 shadow-inner">
                      <div className="flex items-center justify-center">
                        {renderIcon(platform)}
                      </div>
                      <span className="text-white text-sm font-medium">{platform.name}</span>
                      <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/40">
                        {platform.monitoring}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-sm">
                    <p>{platform.name} - {platform.monitoring}</p>
                  </TooltipContent>
                </Tooltip>)}
            </div>
          </div>
          
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenSettings}>
            <Settings className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>
      </TooltipProvider>;
  }

  // Original vertical layout for mobile/sidebar
  return <TooltipProvider delayDuration={300}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary text-lg font-medium">Connected Channels</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleOpenSettings}>
            <Settings className="h-4 w-4 text-text-secondary" />
          </Button>
        </div>
        
        {/* Available/Connected Platforms */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {connectedPlatforms.map((platform, i) => <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200 shadow-inner">
                  <div className="flex items-center justify-center">
                    {renderIcon(platform)}
                  </div>
                  <span className="text-white text-sm font-medium">{platform.name}</span>
                  {platform.connected && <span className="h-2 w-2 rounded-full bg-green-500"></span>}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm">
                <p>{platform.name}</p>
              </TooltipContent>
            </Tooltip>)}
        </div>

        {/* Coming Soon Label */}
        <div className="text-sm text-text-secondary font-medium mb-2">
          Coming Soon
        </div>

        {/* Coming Soon Platforms - Compact Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {comingSoonPlatforms.map((platform, i) => <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/7 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/10 transition-all duration-200 shadow-inner opacity-70">
                  <div className="flex items-center justify-center">
                    {renderIcon(platform, true)}
                  </div>
                  <span className="text-white text-xs font-medium">{platform.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm">
                <p>{platform.name} - coming soon!</p>
              </TooltipContent>
            </Tooltip>)}
        </div>
      </div>
    </TooltipProvider>;
};
export default React.memo(ConnectedChannelsSection);