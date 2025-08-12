import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  service: 'Slack' | 'Gmail' | string;
  isHealthy: boolean;
  icon: typeof MessageCircle;
}

interface SignalFilter {
  key: 'mentions' | 'mail' | 'today';
  icon: typeof Hash;
  label: string;
  active: boolean;
}

// Mock data - replace with actual state/store data
const mockConnectors: ConnectorStatus[] = [
  { service: 'Slack', isHealthy: true, icon: MessageCircle },
  { service: 'Gmail', isHealthy: false, icon: Mail },
];

const UtilityBlock = ({ collapsed, className }: UtilityBlockProps) => {
  const [signalFilters, setSignalFilters] = useState<SignalFilter[]>([
    { key: 'mentions', icon: Hash, label: 'Mentions', active: false },
    { key: 'mail', icon: Mail, label: 'Mail', active: false },
    { key: 'today', icon: Clock, label: 'Today', active: true }
  ]);

  const [contextContent, setContextContent] = useState<{
    type: 'unhealthy' | 'add-connectors' | 'referral' | 'saved-time';
    text: string;
    icon: typeof Clock;
    action: () => void;
    additionalCount?: number;
  }>();

  const [contextKey, setContextKey] = useState(0); // For animation

  // Determine context content based on priority
  useEffect(() => {
    const unhealthyConnectors = mockConnectors.filter(c => !c.isHealthy);
    const connectedCount = mockConnectors.length;
    const hasCompletedBrief = true; // Replace with actual state
    const npsScore = 8; // Replace with actual NPS data
    
    let newContent;
    
    if (unhealthyConnectors.length > 0) {
      const primaryUnhealthy = unhealthyConnectors[0];
      newContent = {
        type: 'unhealthy' as const,
        text: `${primaryUnhealthy.service} needs attention`,
        icon: AlertCircle,
        action: () => {
          console.log(`Opening connectors view for ${primaryUnhealthy.service}`);
        },
        additionalCount: unhealthyConnectors.length > 1 ? unhealthyConnectors.length - 1 : undefined
      };
    } else if (connectedCount < 2) {
      newContent = {
        type: 'add-connectors' as const,
        text: `Add connectors`,
        icon: Plug,
        action: () => {
          console.log('Opening connectors view');
        }
      };
    } else if (hasCompletedBrief && npsScore >= 7) {
      newContent = {
        type: 'referral' as const,
        text: 'Invite your team • +5 briefs',
        icon: Gift,
        action: () => {
          console.log('Opening referral modal');
        }
      };
    } else {
      newContent = {
        type: 'saved-time' as const,
        text: 'Saved this week: 02:34',
        icon: Clock,
        action: () => {
          console.log('Showing time savings detail');
        }
      };
    }

    // Trigger animation if content changes
    if (contextContent?.type !== newContent.type) {
      setContextKey(prev => prev + 1);
    }
    
    setContextContent(newContent);
  }, [contextContent?.type]);

  const handleSignalToggle = (key: 'mentions' | 'mail' | 'today') => {
    setSignalFilters(prev => 
      prev.map(filter => 
        filter.key === key 
          ? { ...filter, active: !filter.active }
          : filter
      )
    );
  };

  const handleNewBrief = () => {
    console.log('Opening new brief modal');
  };

  const getContextIcon = () => {
    if (!contextContent) return Clock;
    
    switch (contextContent.type) {
      case 'unhealthy':
        return contextContent.icon;
      case 'add-connectors':
        return Plug;
      case 'referral':
        return Gift;
      case 'saved-time':
        return Clock;
      default:
        return Clock;
    }
  };

  const getContextTooltip = () => {
    if (!contextContent) return "";
    
    switch (contextContent.type) {
      case 'unhealthy':
        const service = contextContent.text.split(' ')[0];
        return `Reconnect ${service}`;
      case 'add-connectors':
        return 'Add connectors';
      case 'referral':
        return 'Invite your team • +5 briefs';
      case 'saved-time':
        return contextContent.text;
      default:
        return contextContent.text;
    }
  };

  if (collapsed) {
    const ContextIcon = getContextIcon();
    
    return (
      <div className={cn("hidden lg:block", className)}>
        <Separator className="mx-2 mb-2" />
        <div className="flex flex-col items-center space-y-2 p-2">
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
                      <Hash className="h-5 w-5" />
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
                        <Badge
                          variant={filter.active ? "default" : "outline"}
                          className={cn(
                            "h-6 px-2 cursor-pointer hover:bg-accent-primary/20 transition-colors",
                            filter.active && "bg-accent-primary/20 text-accent-primary border-accent-primary/30"
                          )}
                          onClick={() => handleSignalToggle(filter.key)}
                          role="button"
                          tabIndex={0}
                          aria-pressed={filter.active}
                        >
                          <filter.icon className="h-3 w-3 mr-1" />
                          {filter.label}
                        </Badge>
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
                      contextContent.type === 'unhealthy' && "text-[#F87415]"
                    )}
                    aria-label={getContextTooltip()}
                  >
                    <ContextIcon className="h-5 w-5" />
                    {contextContent.type === 'unhealthy' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F87415] rounded-full border border-surface" />
                    )}
                    {contextContent.additionalCount && (
                      <span className="absolute -top-1 -right-1 bg-[#F87415] text-surface text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        +{contextContent.additionalCount}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{getContextTooltip()}</p>
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
                  <Plus className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>New brief</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("hidden lg:block", className)}>
      <Separator className="mb-4" />
      
      <div className="px-6 pb-4 space-y-2">
        {/* Row A - Signals */}
        <TooltipProvider>
          <div className="flex items-center space-x-4 h-8">
            {signalFilters.map((filter) => (
              <Tooltip key={filter.key}>
                <TooltipTrigger asChild>
                  <Badge
                    variant={filter.active ? "default" : "outline"}
                    className={cn(
                      "h-6 px-2 cursor-pointer hover:bg-accent-primary/20 transition-colors text-xs",
                      filter.active && "bg-accent-primary/20 text-accent-primary border-accent-primary/30"
                    )}
                    onClick={() => handleSignalToggle(filter.key)}
                    role="button"
                    tabIndex={0}
                    aria-pressed={filter.active}
                  >
                    <filter.icon className="h-3 w-3 mr-1" />
                    {filter.label}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{filter.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {/* Row B - Context */}
        {contextContent && (
          <div 
            key={contextKey}
            className="flex items-center space-x-2 h-8 cursor-pointer group transition-all duration-120 hover:bg-surface-raised/30 rounded-md px-2 -mx-2"
            onClick={contextContent.action}
            role="button"
            tabIndex={0}
            aria-label={contextContent.text}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                contextContent.action();
              }
            }}
          >
            <contextContent.icon className={cn(
              "h-5 w-5 flex-shrink-0",
              contextContent.type === 'unhealthy' ? "text-[#F87415]" : "text-text-muted group-hover:text-text-primary transition-colors"
            )} />
            <div className="flex-1 min-w-0 flex items-center">
              <span className={cn(
                "text-sm truncate group-hover:text-text-primary transition-colors",
                contextContent.type === 'unhealthy' ? "text-[#F87415]" : "text-text-secondary"
              )}>
                {contextContent.text}
              </span>
              {contextContent.additionalCount && (
                <span className="ml-2 text-text-muted text-sm">
                  · +{contextContent.additionalCount}
                </span>
              )}
            </div>
            {contextContent.type === 'unhealthy' && (
              <div className="w-2 h-2 bg-[#F87415] rounded-full flex-shrink-0" />
            )}
            {contextContent.type === 'saved-time' && (
              <div className="flex-1 min-w-0 ml-2">
                <div className="w-full bg-surface-raised/30 rounded-full h-0.5">
                  <div 
                    className="bg-accent-primary h-0.5 rounded-full transition-all duration-300" 
                    style={{ width: '68%' }}
                    role="progressbar" 
                    aria-valuenow={68} 
                    aria-valuemin={0} 
                    aria-valuemax={100}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Row C - New Brief Button */}
        <Button
          onClick={handleNewBrief}
          size="sm"
          className="w-full h-8 text-sm bg-accent-primary text-surface hover:bg-accent-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Brief
        </Button>
      </div>
    </div>
  );
};

export default UtilityBlock;