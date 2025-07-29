
import React from "react";
import { Upload, CheckSquare, Trello, Calendar, MessageSquare, Mail, LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OutputIntegration {
  name: string;
  provider: string;
  available: boolean;
  icon?: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  description: string;
  outputs: string[];
  connected: boolean;
}

interface OutputIntegrationsSectionProps {
  onConnect: (provider: string, type: 'input' | 'output') => void;
}

const OutputIntegrationsSection = ({ onConnect }: OutputIntegrationsSectionProps) => {
  const outputIntegrations: OutputIntegration[] = [
    { 
      name: "Todoist", 
      provider: "todoist", 
      available: false, 
      icon: CheckSquare,
      description: "Automatically create tasks from action items in your briefs",
      outputs: ["Action items", "Follow-ups", "Deadlines"],
      connected: false
    },
    { 
      name: "Asana", 
      provider: "asana", 
      available: true, 
      description: "Push tasks and project updates to your Asana workspace",
      outputs: ["Tasks", "Project updates", "Team assignments"],
      connected: false
    },
    { 
      name: "Trello", 
      provider: "trello", 
      available: false, 
      icon: Trello,
      description: "Create cards from action items and meeting notes",
      outputs: ["Cards", "Checklists", "Due dates"],
      connected: false
    },
    { 
      name: "Google Calendar", 
      provider: "calendar-output", 
      available: false, 
      icon: Calendar,
      description: "Create calendar events from meeting requests and deadlines",
      outputs: ["Calendar events", "Meeting reminders", "Deadline alerts"],
      connected: false
    },
    { 
      name: "Slack", 
      provider: "slack-output", 
      available: false, 
      icon: MessageSquare,
      description: "Send important updates and summaries to team channels",
      outputs: ["Channel updates", "Direct messages", "Status updates"],
      connected: false
    },
    { 
      name: "Email", 
      provider: "email-output", 
      available: false, 
      icon: Mail,
      description: "Send digest emails and follow-up reminders",
      outputs: ["Daily digests", "Weekly summaries", "Follow-up emails"],
      connected: false
    }
  ];

  const renderIcon = (
    integration: OutputIntegration,
  ) => {
    switch (integration.provider) {
      case "asana": 
        return <svg className="text-[#fff]" viewBox="-0.5 -0.5 16 16" fill="none" id="Asana--Streamline-Iconoir" height="16" width="16">
          <path d="M7.5 7.1230625000000005c1.6653125 0 3.015375 -1.35 3.015375 -3.015375S9.1653125 1.0923125 7.5 1.0923125c-1.665375 0 -3.015375 1.35 -3.015375 3.015375s1.35 3.015375 3.015375 3.015375Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
          <path d="M3.73075 13.907687500000002c1.665375 0 3.0154375 -1.3500625 3.0154375 -3.015375 0 -1.6653125 -1.3500625 -3.015375 -3.0154375 -3.015375s-3.015375 1.3500625 -3.015375 3.015375c0 1.6653125 1.3500625 3.015375 3.015375 3.015375Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
          <path d="M11.26925 13.907687500000002c1.6653125 0 3.015375 -1.3500625 3.015375 -3.015375 0 -1.6653125 -1.3500625 -3.015375 -3.015375 -3.015375 -1.6653125 0 -3.015375 1.3500625 -3.015375 3.015375 0 1.6653125 1.3500625 3.015375 3.015375 3.015375Z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
        </svg>;
      
      default:
        return <integration.icon />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <Upload className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-text-primary">Output Integrations</h3>
          <p className="text-sm text-text-secondary">
            Connect systems where BriefMe can push tasks, updates, and notifications
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {outputIntegrations.map((integration) => {
          return (
            <div
              key={integration.provider}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                     {renderIcon(integration)}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{integration.name}</h4>
                    {!integration.available && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Coming Soon
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => integration.available && onConnect(integration.provider, 'output')}
                  disabled={!integration.available}
                  className="shrink-0"
                >
                  {integration.connected ? 'Configure' : 'Connect'}
                </Button>
              </div>

              <p className="text-sm text-text-secondary">
                {integration.description}
              </p>

              <div className="space-y-3">
                <h5 className="text-xs font-medium text-text-primary uppercase tracking-wide">
                  What gets pushed:
                </h5>
                <div className="space-y-2">
                  {integration.outputs.map((output) => (
                    <div key={output} className="flex items-center justify-between">
                      <Label htmlFor={`${integration.provider}-${output}`} className="text-sm text-text-secondary">
                        {output}
                      </Label>
                      <Switch 
                        id={`${integration.provider}-${output}`}
                        disabled={!integration.connected}
                        defaultChecked={integration.connected}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {integration.connected && (
                <div className="pt-2 border-t border-border-subtle">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">Auto-push enabled</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OutputIntegrationsSection;
