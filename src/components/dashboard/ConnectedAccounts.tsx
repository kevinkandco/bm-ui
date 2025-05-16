
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface ConnectedAccountsProps {}

const ConnectedAccounts = React.memo(({}: ConnectedAccountsProps) => {
  const { toast } = useToast();
  
  const handleOpenSettings = () => {
    toast({
      title: "Channel Settings",
      description: "Opening channel integration settings"
    });
  };
  
  const connectedPlatforms = [
    { 
      id: 1, 
      name: "Slack", 
      active: true,
      logo: "https://cdn.iconscout.com/icon/free/png-256/free-slack-4054995-3353973.png"
    },
    { 
      id: 2, 
      name: "Gmail", 
      active: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/512px-Gmail_icon_%282020%29.svg.png"
    },
    { 
      id: 3, 
      name: "Google Calendar", 
      active: true,
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Google_Calendar_icon_%282020%29.svg/512px-Google_Calendar_icon_%282020%29.svg.png"
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
                    ? "bg-white shadow-sm" 
                    : "bg-surface-raised/30 opacity-50"
                } overflow-hidden`}
              >
                <img 
                  src={platform.logo} 
                  alt={platform.name} 
                  className="h-8 w-8 object-contain"
                />
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
