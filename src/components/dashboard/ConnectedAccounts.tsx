
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Slack, Mail, Calendar } from "lucide-react";

interface ConnectedAccountsProps {}

const ConnectedAccounts = React.memo(({}: ConnectedAccountsProps) => {
  const { toast } = useToast();
  
  const handleOpenSettings = () => {
    toast({
      title: "Channel Settings",
      description: "Opening channel integration settings"
    });
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
  
  return (
    <TooltipProvider>
      <div className="flex items-center justify-end gap-2">
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
  );
});

ConnectedAccounts.displayName = 'ConnectedAccounts';
export default ConnectedAccounts;
