import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Slack, Mail, Calendar } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { IntegrationOption } from "@/components/type";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/hooks/useApi";

const BaseURL = import.meta.env.VITE_API_HOST;

interface IntegrationsStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  updateUserData: (data: any) => void;
  gotoLogin: () => void;
  userData: {
    integrations: string[];
    [key: string]: any;
  };
}

interface UserData {
  [key: string]: any;
}
const IntegrationsStep = ({
  onNext,
  onBack,
  onSkip,
  updateUserData,
  userData,
  gotoLogin
}: IntegrationsStepProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

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
      id: "google",
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
  
  const { call } = useApi();

  const [loader, setLoader] = useState(false);

  const fetchChannels = useCallback(async (): Promise<void> => {
    setLoader(true);

    const response = await call("get", "/api/slack/fetch", {
      showToast: true,
      toastTitle: "Failed to fetch Slack data",
      toastVariant: "destructive",
      toastDescription: "Something went wrong. Failed to fetch Slack data.",
      returnOnFailure: false,
    });

    if (response) {
      onNext();
    } else {
      console.error("Failed to fetch Slack data");
    }

    setLoader(false);
  }, [call, onNext]);

  const [connected, setConnected] = useState<Record<string, boolean>>(userData.integrations.reduce((acc: Record<string, boolean>, id: string) => ({
        ...acc,
        [id]: true,
      }),
      {}
    )
  );

const [data, setData] = useState<UserData>({});

  const toggleConnection = (id: string) => {
  const lowerId = id.toLowerCase();

  const openAuthUrl = (provider: string) => {
    const urls: Record<string, string> = {
      slack: `${BaseURL}/auth/redirect/slack?redirectURL=onboarding`,
      google: `${BaseURL}/google/auth?redirectURL=onboarding`,
      calendar: `${BaseURL}/calendar/auth`, // Add correct URLs as needed
      outlook: `${BaseURL}/outlook/auth`,
    };
    window.open(urls[provider], "_self");
  };

  const isIntegrated = data?.system_integrations?.some(
    (i) => i.provider_name.toLowerCase() === lowerId
  );

  const isConnected = connected[lowerId];

  if (id === "slack") {
    if (isIntegrated || isConnected) {
      setConnected((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else {
      openAuthUrl("slack");
    }
  } else if (id === "google") {
    if (isConnected || isIntegrated) {
      setConnected((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } else {
      openAuthUrl("google");
    }
  } else {
    // for other providers like 'calendar', 'outlook'
    const available = integrations.find((i) => i.id === id)?.available;
    if (!available) return;

    setConnected((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }
};

const getUser = useCallback(async (): Promise<void> => {
  const response = await call("get", "/api/settings/system-integrations", {
    returnOnFailure: false,
  });

  if (!response) {
    console.error("Failed to fetch user data");
    // Handle unauthenticated case
    localStorage.removeItem("token");
    gotoLogin();
    return;
  }

  if (response?.data) {
    setData(response.data);
    const data = response.data.reduce(
      (
        acc: Record<string, boolean>,
        integration: { provider_name: string }
      ) => {
        const key = integration.provider_name.toLowerCase();
        acc[key] = true;
        return acc;
      },
      {}
    );
    setConnected((prev) => ({
      ...prev,
      ...data,
    }));
  }
}, [call, gotoLogin]);

useEffect(() => {
  getUser();
}, [getUser]);
  const handleContinue = async() => {
    
    const selectedIntegrations = Object.entries(connected).filter(([_, isConnected]) => isConnected).map(([id]) => id);
    updateUserData({
      integrations: selectedIntegrations
    });
    if(connected['slack']) {
      await fetchChannels();
    } else {
      onNext();
    }
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
    switch (id) {
      case "slack":
        return <Slack className="text-white" size={isMobile ? 16 : 20} />;
      case "google":
        return <Mail className="text-white" size={isMobile ? 16 : 20} />;
      case "outlook":
        return <Mail className="text-white" size={isMobile ? 16 : 20} />;
      case "calendar":
        return <Calendar className="text-white" size={isMobile ? 16 : 20} />;
      default:
        return <span className="text-white font-bold text-xs sm:text-sm">{iconText}</span>;
    }
  };
  return <div className="space-y-4 sm:space-y-6">
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
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tighter">Connect your tools</h2>
        <p className="text-sm sm:text-base text-text-secondary">Brief.me will monitor these sources to create your personalized brief.</p>
      </div>

      {/* Combined integrations list */}
      <div className="space-y-3 sm:space-y-4">
        {loader && (
            <p className="text-sm sm:text-base text-yellow-500 font-medium">
              We are Fetching your Slack data, please wait a moment...
            </p>
        )}
        <h3 className="text-base sm:text-lg font-medium text-text-primary">Integrations</h3>
        <div className="flex flex-col space-y-1 sm:space-y-1.5">
          {/* Available integrations */}
          {groupedIntegrations.V1?.map(integration => <div key={integration.id} onClick={() => toggleConnection(integration.id)} className={cn("integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg cursor-pointer transition-all duration-300", connected[integration.id] ? "border-2 border-electric-teal bg-white/20 backdrop-blur-md shadow-neo" : "border border-black/25 bg-white/15 hover:bg-white/25 backdrop-blur-md dark:border-white/30")}>
              <div className={cn("w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3", connected[integration.id] ? "bg-electric-teal/80" : "bg-gray-800/90")}>
                {renderIcon(integration.id, integration.icon)}
              </div>

              <div className="flex-grow">
                <h4 className="text-sm sm:text-base font-medium text-text-primary">
                  {integration.name}
                </h4>
                
                {!isMobile && <p className="text-xs text-text-secondary hidden sm:block">{integration.description}</p>}
              </div>

              <div className="ml-2">
                {connected[integration.id] && <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-electric-teal/20 text-text-primary whitespace-nowrap font-medium dark:text-white">
                    Connected ✓
                  </span>}
              </div>
            </div>)}

          {/* Coming soon integrations with indicator in the same line */}
          {groupedIntegrations.V2?.map(integration => <div key={integration.id} className="integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border border-black/20 bg-white/10 backdrop-blur-md opacity-70 dark:border-white/20">
              <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center bg-gray-800/80 rounded-full mr-2 sm:mr-3">
                <span className="text-white/80 font-bold text-xs sm:text-sm">{integration.icon}</span>
              </div>

              <div className="flex-grow">
                <h4 className="text-sm sm:text-base font-medium text-text-primary/90">{integration.name}</h4>
              </div>

              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-800/60 rounded-full text-electric-teal whitespace-nowrap">
                Coming Soon
              </span>
            </div>)}
        </div>
      </div>

      {/* Additional coming soon integrations - more compact */}
      <div className="p-2 sm:p-3 bg-white/10 backdrop-blur-md rounded-lg border border-black/20 dark:border-white/20">
        <h4 className="text-[10px] sm:text-xs font-medium text-text-primary mb-1 sm:mb-2">More integrations coming soon:</h4>
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {[...(groupedIntegrations.V3 || []), ...(groupedIntegrations.Future || [])].map(integration => <span key={integration.id} className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-white/15 rounded-full text-text-primary/80 font-medium dark:text-white/80">
              {integration.name}
            </span>)}
        </div>
      </div>

      <TooltipProvider>
        <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-text-secondary font-medium">
          <Info size={isMobile ? 12 : 14} className="text-electric-teal" />
          <span>You'll be able to add more tools later</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-text-secondary">
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
        <Button onClick={onBack} variant="back" size="none">
          Back
        </Button>
        <Button onClick={handleContinue} disabled={!hasAnyConnection || loader} variant="primary" size="pill" className="disabled:opacity-50 disabled:pointer-events-none py-2 sm:py-3 px-3 sm:px-4 text-sm">
            {loader && (
             <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
             )}
             Continue
        </Button>
      </div>

      <div className="flex justify-center">
        <Button variant="link" onClick={onSkip} className="text-xs sm:text-sm text-text-secondary hover:text-text-primary font-medium">
          Skip for now
        </Button>
      </div>
    </div>;
};
export default IntegrationsStep;