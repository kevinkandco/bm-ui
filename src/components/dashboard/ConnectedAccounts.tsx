
import React, { useState } from "react";
import { Settings, Clock, Calendar, Bell, Slack, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface ConnectedAccountsProps {}

const ConnectedAccounts = React.memo(({}: ConnectedAccountsProps) => {
  const { toast } = useToast();
  const [showNudge, setShowNudge] = useState(true);
  
  const handleOpenSettings = () => {
    toast({
      title: "Channel Settings",
      description: "Opening channel integration settings"
    });
  };

  const handleDismissNudge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNudge(false);
  };
  
  // Updated to match onboarding integrations style
  const connectedPlatforms = [
    { 
      id: "slack", 
      name: "Slack", 
      active: true,
      icon: <Slack className="h-5 w-5 text-white" />
    },
    { 
      id: "gmail", 
      name: "Gmail", 
      active: true,
      icon: <Mail className="h-5 w-5 text-white" />
    },
    { 
      id: "calendar", 
      name: "Google Calendar", 
      active: true,
      icon: <Calendar className="h-5 w-5 text-white" />
    },
  ];

  // Productivity metrics
  const metrics = [
    {
      id: "focus-hours",
      label: "Focus Hours Gained",
      value: "3.5h",
      icon: <Clock className="h-4 w-4 text-accent-primary" />,
      trend: "up"
    },
    {
      id: "meetings-reduced",
      label: "Meeting Load Reduced",
      value: "25%",
      icon: <Calendar className="h-4 w-4 text-accent-primary" />,
      trend: "down"
    }
  ];
  
  return (
    <div className="flex flex-col gap-2">
      {/* Work Pattern Nudge */}
      {showNudge && (
        <div 
          onClick={() => toast({
            title: "Work Pattern Recommendations",
            description: "Opening detailed recommendations for healthier work patterns"
          })}
          className="flex items-center justify-between px-4 py-2 mb-2 bg-surface-overlay/30 backdrop-blur-sm border border-border-subtle rounded-lg cursor-pointer hover:bg-surface-overlay/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent-primary" />
            <p className="text-xs text-text-primary">Take a break after 2h continuous work</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6" 
            onClick={handleDismissNudge}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </Button>
        </div>
      )}

      {/* Productivity Metrics */}
      <div className="flex items-center gap-3 mr-4">
        {metrics.map(metric => (
          <Tooltip key={metric.id}>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 bg-surface-overlay/30 backdrop-blur-sm border border-border-subtle px-2 py-1 rounded-lg">
                {metric.icon}
                <span className="text-xs font-medium text-text-primary">{metric.value}</span>
                <span className={`h-2 w-2 rounded-full ${metric.trend === 'up' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{metric.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <TooltipProvider>
          <div className="flex items-center gap-2">
            {connectedPlatforms.map((platform) => (
              <Tooltip key={platform.id}>
                <TooltipTrigger asChild>
                  <div 
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      platform.active 
                        ? "bg-gray-800/90" 
                        : "bg-gray-800/40 opacity-50"
                    }`}
                  >
                    {platform.icon}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{platform.name} {platform.active ? "(Connected)" : "(Disconnected)"}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenSettings}
              className="h-10 w-10 rounded-full border-border-subtle hover:bg-surface-raised/30"
            >
              <Settings className="h-5 w-5 text-text-primary" />
            </Button>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
});

ConnectedAccounts.displayName = 'ConnectedAccounts';
export default ConnectedAccounts;
