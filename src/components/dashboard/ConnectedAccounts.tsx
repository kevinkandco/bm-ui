
import React from "react";
import { Settings, MessageSquare, Mail, Calendar } from "lucide-react";
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
    { id: 1, name: "Slack", icon: MessageSquare, active: true },
    { id: 2, name: "Email", icon: Mail, active: true },
    { id: 3, name: "Calendar", icon: Calendar, active: true },
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
                    ? "bg-accent-primary/20 text-accent-primary" 
                    : "bg-surface-raised/30 text-text-secondary"
                }`}
              >
                <platform.icon className="h-5 w-5" />
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
