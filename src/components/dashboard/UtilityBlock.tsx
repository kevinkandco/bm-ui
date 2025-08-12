import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { 
  Hash, 
  Mail, 
  Clock, 
  Plus,
  Plug,
  Gift,
  AlertCircle,
  MessageCircle
} from "lucide-react";

interface UtilityBlockProps {
  collapsed: boolean;
  className?: string;
}

interface ConnectorStatus {
  service: 'slack' | 'gmail' | string;
  isHealthy: boolean;
  icon: typeof MessageCircle;
}

// Mock data - replace with actual state/store data
const mockConnectors: ConnectorStatus[] = [
  { service: 'slack', isHealthy: true, icon: MessageCircle },
  { service: 'gmail', isHealthy: false, icon: Mail },
];

const UtilityBlock = ({ collapsed, className }: UtilityBlockProps) => {
  const [contextContent, setContextContent] = useState<{
    type: 'unhealthy' | 'add-connectors' | 'referral' | 'saved-time';
    text: string;
    icon: typeof Clock;
    action: () => void;
  }>();

  // Determine context content based on priority
  useEffect(() => {
    const unhealthyConnector = mockConnectors.find(c => !c.isHealthy);
    const connectedCount = mockConnectors.length;
    const hasCompletedBrief = true; // Replace with actual state
    const npsScore = 8; // Replace with actual NPS data
    
    if (unhealthyConnector) {
      setContextContent({
        type: 'unhealthy',
        text: `${unhealthyConnector.service} needs attention`,
        icon: AlertCircle,
        action: () => {
          // Open connectors view focused on that service
          console.log(`Opening connectors view for ${unhealthyConnector.service}`);
        }
      });
    } else if (connectedCount < 2) {
      setContextContent({
        type: 'add-connectors',
        text: `+ Add connectors (${connectedCount} connected)`,
        icon: Plug,
        action: () => {
          // Open connectors view
          console.log('Opening connectors view');
        }
      });
    } else if (hasCompletedBrief && npsScore >= 7) {
      setContextContent({
        type: 'referral',
        text: 'Invite your team • +5 briefs',
        icon: Gift,
        action: () => {
          // Open referral modal
          console.log('Opening referral modal');
        }
      });
    } else {
      setContextContent({
        type: 'saved-time',
        text: 'Saved this week: 02:34',
        icon: Clock,
        action: () => {
          // Show time savings detail
          console.log('Showing time savings detail');
        }
      });
    }
  }, []);

  const signalFilters = [
    { 
      key: 'mentions', 
      icon: Hash, 
      label: 'Mentions',
      action: () => console.log('Filter: Mentions')
    },
    { 
      key: 'mail', 
      icon: Mail, 
      label: 'Mail',
      action: () => console.log('Filter: Mail')
    },
    { 
      key: 'today', 
      icon: Clock, 
      label: 'Today',
      action: () => console.log('Filter: Today')
    }
  ];

  const handleNewBrief = () => {
    console.log('Opening new brief modal');
  };

  if (collapsed) {
    return (
      <div className={cn("hidden lg:flex flex-col items-center space-y-2 p-2", className)}>
        <Separator className="w-6 mb-2" />
        
        <TooltipProvider>
          {/* Signals Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 hover:bg-surface-raised/50"
                    aria-label="Quick filters"
                  >
                    <Hash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Quick filters</p>
                </TooltipContent>
              </Tooltip>
            </PopoverTrigger>
            <PopoverContent 
              side="right" 
              className="w-auto p-2 bg-surface border-border-subtle"
              sideOffset={8}
            >
              <div className="flex items-center space-x-2">
                {signalFilters.map((filter) => (
                  <Tooltip key={filter.key}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={filter.action}
                        className="h-8 w-8 p-0 hover:bg-surface-raised/50"
                        aria-label={filter.label}
                      >
                        <filter.icon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{filter.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Dynamic Context Icon */}
          {contextContent && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={contextContent.action}
                  className={cn(
                    "h-8 w-8 p-0 hover:bg-surface-raised/50 relative",
                    contextContent.type === 'unhealthy' && "text-warning-high"
                  )}
                  aria-label={contextContent.text}
                >
                  <contextContent.icon className="h-4 w-4" />
                  {contextContent.type === 'unhealthy' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-warning-high rounded-full border-2 border-surface" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{contextContent.text}</p>
              </TooltipContent>
            </Tooltip>
          )}

          {/* New Brief Icon */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewBrief}
                className="h-8 w-8 p-0 hover:bg-surface-raised/50"
                aria-label="New brief"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>New brief</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={cn("hidden lg:block", className)}>
      <Separator className="mb-4" />
      
      <div className="px-6 pb-4 space-y-3">
        {/* Signals Row */}
        <TooltipProvider>
          <div className="flex items-center space-x-2">
            {signalFilters.map((filter) => (
              <Tooltip key={filter.key}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={filter.action}
                    className="h-6 px-2 text-xs hover:bg-surface-raised/50 flex items-center space-x-1"
                  >
                    <filter.icon className="h-3 w-3" />
                    <span className="hidden sm:inline">{filter.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{filter.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Context Row */}
        {contextContent && (
          <div 
            className="flex items-center space-x-2 min-h-[24px] cursor-pointer group transition-all duration-120"
            onClick={contextContent.action}
          >
            <contextContent.icon className={cn(
              "h-4 w-4 flex-shrink-0",
              contextContent.type === 'unhealthy' ? "text-warning-high" : "text-text-muted"
            )} />
            <div className="flex-1 min-w-0">
              <span className={cn(
                "text-xs truncate block group-hover:text-text-primary transition-colors",
                contextContent.type === 'unhealthy' ? "text-warning-high" : "text-text-secondary"
              )}>
                {contextContent.text}
              </span>
              {contextContent.type === 'saved-time' && (
                <div className="w-full bg-surface-raised/30 rounded-full h-1 mt-1">
                  <div className="bg-accent-primary h-1 rounded-full transition-all duration-300" style={{ width: '68%' }} />
                </div>
              )}
            </div>
            {contextContent.type === 'unhealthy' && (
              <div className="w-2 h-2 bg-warning-high rounded-full flex-shrink-0" />
            )}
          </div>
        )}

        {/* New Brief Button */}
        <Button
          onClick={handleNewBrief}
          size="sm"
          className="w-full h-7 text-xs bg-accent-primary/10 hover:bg-accent-primary/20 text-accent-primary border border-accent-primary/20"
        >
          <Plus className="h-3 w-3 mr-1" />
          New Brief
        </Button>
      </div>
    </div>
  );
};

export default UtilityBlock;