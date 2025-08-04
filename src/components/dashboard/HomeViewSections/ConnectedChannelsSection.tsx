
import React from "react";
import { MessageSquare, Mail, Slack, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Account {
  email: string;
  status: "active" | "monitoring" | "offline";
}

interface Integration {
  name: string;
  id: string;
  icon: string;
  accounts: Account[];
  totalCount: number;
}

interface ConnectedChannelsSectionProps {
  showAsHorizontal?: boolean;
}

const ConnectedChannelsSection = ({
  showAsHorizontal = false
}: ConnectedChannelsSectionProps) => {
  const isMobile = useIsMobile();
  
  // Mock data - in real app this would come from props/API
  const integrations: Integration[] = [
    {
      name: "Slack",
      id: "slack",
      icon: "S",
      accounts: [
        { email: "kevin@uprise.is", status: "monitoring" },
        { email: "workspace-2", status: "active" }
      ],
      totalCount: 2
    },
    {
      name: "Gmail",
      id: "gmail", 
      icon: "G",
      accounts: [
        { email: "kevin@uprise.is", status: "monitoring" },
        { email: "me@kevink.co", status: "monitoring" },
        { email: "personal@gmail.com", status: "active" }
      ],
      totalCount: 3
    },
    {
      name: "Google Calendar",
      id: "calendar",
      icon: "C",
      accounts: [
        { email: "kevin@uprise.is", status: "monitoring" }
      ],
      totalCount: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "monitoring": return "bg-green-500";
      case "active": return "bg-blue-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

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
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Condensed Integration Display */}
            <div className="flex items-center gap-2">
              {integrations.map((integration, i) => {
                const overallStatus = getOverallStatus(integration.accounts);
                return (
                  <Tooltip key={i}>
                    <TooltipTrigger asChild>
                      <div className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 cursor-pointer hover:bg-white/15 transition-all duration-200">
                        <div className="flex items-center justify-center relative">
                          {renderIcon(integration)}
                          {/* Status dot - positioned as overlay */}
                          <div className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white/20 ${getStatusColor(overallStatus)}`}></div>
                        </div>
                        {/* Count badge */}
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
                            <span>{account.email}</span>
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
        </div>
      </TooltipProvider>
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
          {integrations.map((integration, i) => {
            const overallStatus = getOverallStatus(integration.accounts);
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
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
                        <span>{account.email}</span>
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

export default React.memo(ConnectedChannelsSection);
