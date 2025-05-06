
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Slack, Mail, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface IntegrationOption {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
  version: "V1" | "V2" | "V3" | "Future";
}

interface IntegrationsStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  updateUserData: (data: any) => void;
  userData: {
    integrations: string[];
    [key: string]: any;
  };
}

const IntegrationsStep = ({
  onNext,
  onBack,
  onSkip,
  updateUserData,
  userData
}: IntegrationsStepProps) => {
  const isMobile = useIsMobile();
  
  const [integrations] = useState<IntegrationOption[]>([
  // V1 integrations
  {
    id: "slack",
    name: "Slack",
    icon: "S",
    available: true,
    description: "Connect to your workspaces and channels",
    version: "V1"
  }, {
    id: "gmail",
    name: "Gmail",
    icon: "G",
    available: true,
    description: "Sync important emails and avoid spam",
    version: "V1"
  }, {
    id: "outlook",
    name: "Outlook",
    icon: "O",
    available: true,
    description: "Connect your Outlook email account",
    version: "V1"
  }, {
    id: "calendar",
    name: "Google Calendar",
    icon: "C",
    available: true,
    description: "Stay on top of meetings and events",
    version: "V1"
  },
  // V2 integrations (coming soon)
  {
    id: "asana",
    name: "Asana",
    icon: "A",
    available: false,
    description: "Track your tasks and projects (coming soon)",
    version: "V2"
  }, {
    id: "notion",
    name: "Notion",
    icon: "N",
    available: false,
    description: "Link your notes and documents (coming soon)",
    version: "V2"
  }, {
    id: "zoom",
    name: "Zoom/Meet",
    icon: "Z",
    available: false,
    description: "Never miss important meetings (coming soon)",
    version: "V2"
  },
  // V3 integrations (coming soon)
  {
    id: "teams",
    name: "Microsoft Teams",
    icon: "T",
    available: false,
    description: "Connect your Teams workspace (coming soon)",
    version: "V3"
  }, {
    id: "salesforce",
    name: "Salesforce",
    icon: "SF",
    available: false,
    description: "Monitor your CRM data (coming soon)",
    version: "V3"
  }, {
    id: "hubspot",
    name: "Hubspot",
    icon: "H",
    available: false,
    description: "Track your marketing data (coming soon)",
    version: "V3"
  }, {
    id: "jira",
    name: "Jira",
    icon: "J",
    available: false,
    description: "Stay on top of issues and tickets (coming soon)",
    version: "V3"
  }, {
    id: "confluence",
    name: "Confluence",
    icon: "CF",
    available: false,
    description: "Connect your knowledge base (coming soon)",
    version: "V3"
  },
  // Future integrations
  {
    id: "github",
    name: "GitHub/GitLab",
    icon: "GH",
    available: false,
    description: "Monitor your repositories (coming soon)",
    version: "Future"
  }, {
    id: "zendesk",
    name: "Zendesk",
    icon: "ZD",
    available: false,
    description: "Track customer support tickets (coming soon)",
    version: "Future"
  }, {
    id: "servicenow",
    name: "ServiceNow",
    icon: "SN",
    available: false,
    description: "Monitor your service desk (coming soon)",
    version: "Future"
  }]);
  
  const [connected, setConnected] = useState<Record<string, boolean>>(userData.integrations.reduce((acc: Record<string, boolean>, id: string) => ({
    ...acc,
    [id]: true
  }), {}));
  
  const toggleConnection = (id: string) => {
    if (!integrations.find(i => i.id === id)?.available) return;
    setConnected(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleContinue = () => {
    const selectedIntegrations = Object.entries(connected).filter(([_, isConnected]) => isConnected).map(([id]) => id);
    updateUserData({
      integrations: selectedIntegrations
    });
    onNext();
  };
  
  const hasAnyConnection = Object.values(connected).some(value => value);

  // Group integrations by version
  const groupedIntegrations = integrations.reduce((groups, integration) => {
    if (!groups[integration.version]) {
      groups[integration.version] = [];
    }
    groups[integration.version].push(integration);
    return groups;
  }, {} as Record<string, IntegrationOption[]>);
  
  // Helper function to render the appropriate icon based on integration ID
  const renderIcon = (id: string, iconText: string) => {
    switch(id) {
      case "slack":
        return <Slack className="text-white" size={isMobile ? 16 : 20} />;
      case "gmail":
        return <Mail className="text-white" size={isMobile ? 16 : 20} />;
      case "outlook":
        return <Mail className="text-white" size={isMobile ? 16 : 20} />;
      case "calendar":
        return <Calendar className="text-white" size={isMobile ? 16 : 20} />;
      default:
        return <span className="text-white font-bold text-xs sm:text-sm">{iconText}</span>;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <ProgressIndicator currentStep={3} totalSteps={7} />
      
      {/* Reduce height of pyramid neon visual */}
      <div className="relative h-8 sm:h-12 w-full flex items-center justify-center overflow-hidden mb-1 sm:mb-2">
        <div className="w-0 h-0 animate-float" style={{
        borderLeft: isMobile ? '12px solid transparent' : '16px solid transparent',
        borderRight: isMobile ? '12px solid transparent' : '16px solid transparent',
        borderBottom: isMobile ? '24px solid rgba(0, 224, 213, 0.3)' : '32px solid rgba(0, 224, 213, 0.3)'
      }} />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-ice-grey tracking-tighter">Connect your tools</h2>
        <p className="text-xs sm:text-sm text-cool-slate text-zinc-100">Brief.me will monitor these sources to create your personalized brief.</p>
      </div>
      
      {/* Combined integrations list */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-medium text-ice-grey">Integrations</h3>
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Available integrations */}
          {groupedIntegrations.V1?.map(integration => 
            <div 
              key={integration.id}
              onClick={() => toggleConnection(integration.id)}
              className={cn(
                "integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg cursor-pointer transition-all duration-300",
                connected[integration.id]
                  ? "border-2 border-electric-teal bg-white/20 backdrop-blur-md shadow-neo"
                  : "border border-white/30 bg-white/15 hover:bg-white/25 backdrop-blur-md"
              )}
            >
              <div className={cn(
                "w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3",
                connected[integration.id] ? "bg-electric-teal/80" : "bg-deep-plum"
              )}>
                {renderIcon(integration.id, integration.icon)}
              </div>
              
              <div className="flex-grow">
                <h4 className="text-sm sm:text-base font-medium text-white">
                  {integration.name}
                </h4>
                
                {!isMobile && (
                  <p className="text-xs text-white/70 hidden sm:block">{integration.description}</p>
                )}
              </div>
              
              <div className="ml-2">
                {connected[integration.id] && (
                  <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-electric-teal/20 text-white whitespace-nowrap">
                    Connected ✓
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Coming soon integrations with indicator in the same line */}
          {groupedIntegrations.V2?.map(integration => 
            <div 
              key={integration.id}
              className="integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border border-white/20 bg-white/10 backdrop-blur-md opacity-70"
            >
              <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center bg-deep-plum/70 rounded-full mr-2 sm:mr-3">
                <span className="text-white/80 font-bold text-xs sm:text-sm">{integration.icon}</span>
              </div>
              
              <div className="flex-grow">
                <h4 className="text-sm sm:text-base font-medium text-white/90">{integration.name}</h4>
              </div>

              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-deep-plum/30 rounded-full text-electric-teal whitespace-nowrap">
                Coming Soon
              </span>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional coming soon integrations - more compact */}
      <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
        <h4 className="text-[10px] sm:text-xs font-medium text-ice-grey mb-1 sm:mb-2">More integrations coming soon:</h4>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {[...(groupedIntegrations.V3 || []), ...(groupedIntegrations.Future || [])].map(integration => 
            <span key={integration.id} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-white/15 rounded-full text-white/80">
              {integration.name}
            </span>
          )}
        </div>
      </div>
      
      <TooltipProvider>
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-cool-slate">
          <Info size={isMobile ? 12 : 14} className="text-electric-teal" />
          <span>You'll be able to add more tools later</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-cool-slate">
                <Info size={isMobile ? 10 : 12} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-canvas-black border border-cool-slate/20 text-ice-grey text-[10px] sm:text-xs">
              <p>You can modify your integrations anytime from settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      <div className="flex justify-between pt-2">
        <Button onClick={onBack} variant="plain" size="none" className="text-sm">
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!hasAnyConnection} className="neon-button disabled:opacity-50 disabled:pointer-events-none py-2 sm:py-3 px-3 sm:px-4 text-sm">
          Continue
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button variant="link" onClick={onSkip} className="text-xs sm:text-sm text-cool-slate hover:text-ice-grey">
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsStep;
