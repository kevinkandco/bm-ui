import { useToast } from "@/hooks/use-toast";
import { Slack, Mail, Calendar } from "lucide-react";
import { IntegrationOption } from "@/components/type";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Http from "@/Http";
import useAuthStore from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";

const BaseURL = import.meta.env.VITE_API_HOST;

interface UserData {
  [key: string]: any;
}

const Integrations = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { gotoLogin } = useAuthStore();

  const [integrations] = useState<IntegrationOption[]>([
    // V1 integrations
    {
      id: "slack",
      name: "Slack",
      icon: "S",
      available: true,
      description: "Connect to your workspaces and channels",
      version: "V1",
    },
    {
      id: "google",
      name: "Gmail",
      icon: "G",
      available: true,
      description: "Sync important emails and avoid spam",
      version: "V1",
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: "O",
      available: true,
      description: "Connect your Outlook email account",
      version: "V1",
    },
    {
      id: "calendar",
      name: "Google Calendar",
      icon: "C",
      available: true,
      description: "Stay on top of meetings and events",
      version: "V1",
    },
    // V2 integrations (coming soon)
    {
      id: "asana",
      name: "Asana",
      icon: "A",
      available: false,
      description: "Track your tasks and projects (coming soon)",
      version: "V2",
    },
    {
      id: "notion",
      name: "Notion",
      icon: "N",
      available: false,
      description: "Link your notes and documents (coming soon)",
      version: "V2",
    },
    {
      id: "zoom",
      name: "Zoom/Meet",
      icon: "Z",
      available: false,
      description: "Never miss important meetings (coming soon)",
      version: "V2",
    },
    // V3 integrations (coming soon)
    {
      id: "teams",
      name: "Microsoft Teams",
      icon: "T",
      available: false,
      description: "Connect your Teams workspace (coming soon)",
      version: "V3",
    },
    {
      id: "salesforce",
      name: "Salesforce",
      icon: "SF",
      available: false,
      description: "Monitor your CRM data (coming soon)",
      version: "V3",
    },
    {
      id: "hubspot",
      name: "Hubspot",
      icon: "H",
      available: false,
      description: "Track your marketing data (coming soon)",
      version: "V3",
    },
    {
      id: "jira",
      name: "Jira",
      icon: "J",
      available: false,
      description: "Stay on top of issues and tickets (coming soon)",
      version: "V3",
    },
    {
      id: "confluence",
      name: "Confluence",
      icon: "CF",
      available: false,
      description: "Connect your knowledge base (coming soon)",
      version: "V3",
    },
    // Future integrations
    {
      id: "github",
      name: "GitHub/GitLab",
      icon: "GH",
      available: false,
      description: "Monitor your repositories (coming soon)",
      version: "Future",
    },
    {
      id: "zendesk",
      name: "Zendesk",
      icon: "ZD",
      available: false,
      description: "Track customer support tickets (coming soon)",
      version: "Future",
    },
    {
      id: "servicenow",
      name: "ServiceNow",
      icon: "SN",
      available: false,
      description: "Monitor your service desk (coming soon)",
      version: "Future",
    },
  ]);

  const navigate = useNavigate();

  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const [data, setData] = useState<UserData>({});

  const toggleConnection = (id: string) => {
    const lowerId = id.toLowerCase();

    const openAuthUrl = (provider: string) => {
      const urls: Record<string, string> = {
        slack: `${BaseURL}/auth/redirect/slack`,
        google: `${BaseURL}/google/auth`,
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
      // if (data?.provider === "slack" || isIntegrated || isConnected) {
        setConnected((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      // } else {
        // openAuthUrl("slack");
      // }
    } else if (id === "google") {
      // if (data?.provider === "google" || isConnected || isIntegrated) {
        setConnected((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      // } else {
      //   openAuthUrl("google");
      // }
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
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      Http.setBearerToken(token);

      const response = await Http.callApi("get", `${BaseURL}/api/me`);
      if (response && response.data && response.data.data && response.data.data.system_integrations) {

        setData(response.data.data);
        const data = response.data.data.system_integrations.reduce(
          (
            acc: Record<string, boolean>,
            integration: { provider_name: string }
          ) => {
            const key = integration.provider_name.toLowerCase() as string;
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
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (
        error?.message === "Unauthenticated." ||
        error?.response?.status === 401
      ) {
        // If unauthorized, redirect to login
        gotoLogin();
      }
    }
  }, [gotoLogin, navigate]);
  
  useEffect(() => {
    getUser();
  }, [getUser]);

  const groupedIntegrations = integrations.reduce((groups, integration) => {
    if (!groups[integration.version]) {
      groups[integration.version] = [];
    }
    groups[integration.version].push(integration);
    return groups;
  }, {} as Record<string, IntegrationOption[]>);

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully",
    });
  };

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
        return (
          <span className="text-white font-bold text-xs sm:text-sm">
            {iconText}
          </span>
        );
    }
  };
  return (
    <div className="md:col-span-3 p-6">
      <h2 className="text-xl font-semibold text-text-primary mb-6">
        Integrations Settings
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-text-primary mb-4">
          Integrations
        </h3>
        <div className="space-y-4 max-w-2xl">
          <div className="flex flex-col space-y-1 sm:space-y-1.5">
            {/* Available integrations */}
            {groupedIntegrations.V1?.map((integration) => (
              <div
                key={integration.id}
                onClick={() => toggleConnection(integration.id)}
                className={cn(
                  "integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg cursor-pointer transition-all duration-300",
                  connected[integration.id]
                    ? "border-2 border-electric-teal bg-white/20 backdrop-blur-md shadow-neo"
                    : "border border-black/25 bg-white/15 hover:bg-white/25 backdrop-blur-md dark:border-white/30"
                )}
              >
                <div
                  className={cn(
                    "w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center rounded-full mr-2 sm:mr-3",
                    connected[integration.id]
                      ? "bg-electric-teal/80"
                      : "bg-gray-800/90"
                  )}
                >
                  {renderIcon(integration.id, integration.icon)}
                </div>

                <div className="flex-grow">
                  <h4 className="text-sm sm:text-base font-medium text-text-primary">
                    {integration.name}
                  </h4>

                  {!isMobile && (
                    <p className="text-xs text-text-secondary hidden sm:block">
                      {integration.description}
                    </p>
                  )}
                </div>

                <div className="ml-2">
                  {connected[integration.id] && (
                    <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-electric-teal/20 text-text-primary whitespace-nowrap font-medium dark:text-white">
                      Connected ✓
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Coming soon integrations with indicator in the same line */}
            {groupedIntegrations.V2?.map((integration) => (
              <div
                key={integration.id}
                className="integration-list-item flex items-center py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg border border-black/20 bg-white/10 backdrop-blur-md opacity-70 dark:border-white/20"
              >
                <div className="w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center bg-gray-800/80 rounded-full mr-2 sm:mr-3">
                  <span className="text-white/80 font-bold text-xs sm:text-sm">
                    {integration.icon}
                  </span>
                </div>

                <div className="flex-grow">
                  <h4 className="text-sm sm:text-base font-medium text-text-primary/90">
                    {integration.name}
                  </h4>
                </div>

                <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 bg-gray-800/60 rounded-full text-electric-teal whitespace-nowrap">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
