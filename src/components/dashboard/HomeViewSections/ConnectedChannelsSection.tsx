
import React, { useCallback, useEffect, useState } from "react";
import { Settings, MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useApi } from "@/hooks/useApi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type BackendIntegration = {
  id: number;
  provider: number;
  provider_name: string;
  email: string;
  is_connected: boolean;
  is_combined: number;
  tag: {
    id: number;
    name: string;
    color: string;
    emoji: string;
    send_at: string;
    delivery_email: number;
    delivery_audio: number;
  } | null;
  created_at: string;
  updated_at: string;
  workspace: string;
};

type AccountStatus = 'active' | 'monitoring' | 'offline';

interface Account {
  email: string;
  workspace: string;
  status: AccountStatus;
}

interface Integration {
  id: string;
  name: string;
  icon: string;
  accounts: Account[];
  totalCount: number;
  workspace?: string;
}

interface ConnectedChannelsSectionProps {
  showAsHorizontal?: boolean;
}

const ConnectedChannelsSection = ({
  showAsHorizontal = false
}: ConnectedChannelsSectionProps) => {
  const isMobile = useIsMobile();
  const { call } = useApi();
  const navigate = useNavigate();
  const [connectedPlatforms, setConnectedPlatforms] = React.useState<Integration[]>([]);

    const getProvider = useCallback(async (): Promise<void> => {
      const response = await call("get", "/settings/system-integrations", {
        showToast: false,
        returnOnFailure: false,
      });

      if (response?.data) {
        const grouped = response.data.reduce(
          (acc: Record<string, Integration>, integration: BackendIntegration) => {
            const provider = integration.provider_name;
            const providerId = provider.toLowerCase();

            if (!acc[provider]) {
              acc[provider] = {
                name: provider,
                id: providerId,
                icon: provider.charAt(0).toUpperCase(),
                accounts: [],
                totalCount: 0,
              };
            }

            const status: AccountStatus = integration.is_connected
              ? integration.is_combined
                ? "active"
                : "monitoring"
              : "offline";

            acc[provider].accounts.push({
              email: integration.email,
              workspace: integration.workspace,
              status,
            });

            return acc;
          },
          {}
        );

        const result: Integration[] = Object.values(grouped).map(
          (provider: Integration) => ({
            ...provider,
            totalCount: provider.accounts.length,
          })
        );

        setConnectedPlatforms(result);
      }
    }, [call]);


    
    useEffect(() => {
      getProvider();
    }, [getProvider]);

  const handleOpenSettings = () => {
    navigate("/dashboard/settings?tab=integrations");
  }
    
  const getStatusColor = (status: string) => {
    switch (status) {
      case "monitoring": return "bg-green-500";
      case "active": return "bg-blue-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  }
  

  const getOverallStatus = (accounts: Account[]) => {
    if (accounts.some(acc => acc.status === "monitoring")) return "monitoring";
    if (accounts.some(acc => acc.status === "active")) return "active";
    return "offline";
  };

  // Helper function to render the appropriate icon
  const renderIcon = (integration: Integration) => {
    const iconSize = 16;
    switch (integration.id) {
      case "slack":
        return <Slack className="text-white" size={iconSize} />;
      case "gmail":
        return <Mail className="text-white" size={iconSize} />;
      case "calendar":
        return <Calendar className="text-white" size={iconSize} />;
      default:
        return <span className="text-white font-medium text-sm">{integration.icon}</span>;
    }
  };

  // Horizontal layout for desktop
  if (showAsHorizontal) {
    return (
        <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            {/* Condensed Integration Display */}
            <div className="flex items-center gap-2">
            {connectedPlatforms?.map((integration, i) => <IntegrationStatusBadge getOverallStatus={getOverallStatus} integration={integration} key={i} renderIcon={renderIcon} getStatusColor={getStatusColor} />)}
            </div>
        </div>
        </div>
    );
  }

  // Original vertical layout for mobile/sidebar - also updated to use condensed view
  return (
    <TooltipProvider delayDuration={300}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-primary text-lg font-medium">Connected Channels</h2>
        </div>
        
        {/* Condensed Integration Display for Sidebar */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {connectedPlatforms?.map((integration, i) => {
            const overallStatus = getOverallStatus(integration.accounts);
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild >
                  <div className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200">
                    <div className="flex items-center justify-center relative">
                      {renderIcon(integration)}
                      <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 ${getStatusColor(overallStatus)}`}></div>
                    </div>
                    {integration.totalCount > 1 && (
                      <span className="text-xs font-medium text-white bg-white/20 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {integration.totalCount}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-sm max-w-xs">
                  <div className="space-y-1">
                    <div className="font-medium">{integration.name}</div>
                    {integration.accounts.map((account, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <div className={`h-1.5 w-1.5 rounded-full ${getStatusColor(account.status)}`}></div>
                        <span>{integration.id === "slack" ? account.workspace ?? account.email : account.email}</span>
                        <span className="text-gray-400">• {account.status}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

interface IntegrationStatusBadgeProps {
  integration: Integration;
  getOverallStatus: (accounts: Account[]) => "monitoring" | "active" | "offline";
  getStatusColor: (status: string) => "bg-green-500" | "bg-blue-500" | "bg-gray-500";
  renderIcon: (integration: Integration) => JSX.Element;
}

const IntegrationStatusBadge = ({getOverallStatus, integration, renderIcon, getStatusColor}: IntegrationStatusBadgeProps) => {
    const [open, setOpen] = useState(false);
  const overallStatus = getOverallStatus(integration.accounts);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        asChild
        onMouseEnter={() => setTimeout(() => setOpen(true), 300)}
        onMouseLeave={() => setTimeout(() => setOpen(false), 300)}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
      >
        <div className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200">
          <div className="flex items-center justify-center relative">
            {renderIcon(integration)}
            <div
              className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 ${getStatusColor(
                overallStatus
              )}`}
            />
          </div>
          {integration.totalCount > 1 && (
            <span className="text-xs font-medium text-white bg-white/20 rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
              {integration.totalCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        className="text-sm max-w-xs w-auto"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setTimeout(() => setOpen(false), 200)}
      >
        <div className="space-y-1">
          <div className="font-medium">{integration.name}</div>
          {integration.accounts.map((account, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <div
                className={`h-1.5 w-1.5 rounded-full ${getStatusColor(
                  account.status
                )}`}
              />
              <span>
                {integration.id === "slack"
                  ? account.workspace ?? account.email
                  : account.email}
              </span>
              <span className="text-gray-400">• {account.status}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(ConnectedChannelsSection);
