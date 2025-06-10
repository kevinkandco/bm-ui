
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
    {
      name: "Slack",
      id: "slack",
      icon: "S",
      connected: true,
      comingSoon: false,
      monitoring: "monitoring"
    }, 
    {
      name: "Gmail",
      id: "gmail",
      icon: "G",
      connected: true,
      comingSoon: false,
      monitoring: "monitoring"
    }
  ];

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
    }
  ];

  const handleOpenSettings = () => {
    navigate("/dashboard/settings");
  };

  // Helper function to render icons with glass styling
  const renderIcon = (platform: typeof connectedPlatforms[0] | typeof comingSoonPlatforms[0], isComingSoon = false) => {
    const iconSize = isComingSoon ? 12 : 16;
    switch (platform.id) {
      case "slack":
        return (
          <div className="relative">
            <Slack className="text-glass-primary glass-icon" size={iconSize} />
            {!isComingSoon && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 shadow-status-green"></span>
            )}
          </div>
        );
      case "gmail":
        return <Mail className="text-glass-primary glass-icon" size={iconSize} />;
      case "outlook":
        return <Mail className="text-glass-primary glass-icon" size={iconSize} />;
      case "calendar":
        return <Calendar className="text-glass-primary glass-icon" size={iconSize} />;
      default:
        return <span className={`text-glass-primary glass-icon font-medium ${isComingSoon ? 'text-xs' : 'text-sm'}`}>{platform.icon}</span>;
    }
  };

  // Horizontal layout for desktop with glass styling
  if (showAsHorizontal) {
    return (
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-glass-primary font-light text-sm">Monitoring:</h2>
            
            {/* Connected Platforms - glass chips */}
            <div className="flex items-center gap-3">
              {connectedPlatforms.map((platform, i) => (
                <Tooltip key={i}>
                  <TooltipTrigger asChild>
                    <div className="monitoring-chip active parallax-hover flex items-center gap-3 px-4 py-2 cursor-pointer">
                      <div className="flex items-center justify-center">
                        {renderIcon(platform)}
                      </div>
                      <span className="text-glass-primary text-sm font-medium">{platform.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {platform.monitoring}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-sm glass-thick">
                    <p>{platform.name} - {platform.monitoring}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
          
          <Button variant="ghost" className="chrome-pill h-8 px-3" onClick={handleOpenSettings}>
            <span className="text-glass-secondary text-sm">Settings</span>
            <Settings className="h-4 w-4 text-glass-secondary glass-icon" />
          </Button>
        </div>
      </TooltipProvider>
    );
  }

  // Original vertical layout with glass styling
  return (
    <TooltipProvider delayDuration={300}>
      <div className="glass-panel-elevated">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-glass-primary text-lg font-medium">Connected Channels</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 spring-scale" onClick={handleOpenSettings}>
            <Settings className="h-4 w-4 text-glass-secondary glass-icon" />
          </Button>
        </div>
        
        {/* Available/Connected Platforms - glass chips */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          {connectedPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="monitoring-chip active parallax-hover flex items-center gap-3 px-4 py-2 cursor-pointer">
                  <div className="flex items-center justify-center">
                    {renderIcon(platform)}
                  </div>
                  <span className="text-glass-primary text-sm font-medium">{platform.name}</span>
                  {platform.connected && (
                    <span className="h-2 w-2 rounded-full bg-green-500 shadow-status-green"></span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm glass-thick">
                <p>{platform.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Glass divider */}
        <div className="glass-divider mb-4"></div>

        {/* Coming Soon Label */}
        <div className="text-sm text-glass-secondary font-medium mb-2">
          Coming Soon
        </div>

        {/* Coming Soon Platforms - ultra-thin glass pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {comingSoonPlatforms.map((platform, i) => (
            <Tooltip key={i}>
              <TooltipTrigger asChild>
                <div className="glass-ultra-thin parallax-hover flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer opacity-70">
                  <div className="flex items-center justify-center">
                    {renderIcon(platform, true)}
                  </div>
                  <span className="text-glass-secondary text-xs font-medium">{platform.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-sm glass-thick">
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
