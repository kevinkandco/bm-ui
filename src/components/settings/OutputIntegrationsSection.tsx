
import React from "react";
import { Upload, CheckSquare, Trello, Calendar, MessageSquare, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface OutputIntegrationsSectionProps {
  onConnect: (provider: string, type: 'input' | 'output') => void;
}

const OutputIntegrationsSection = ({ onConnect }: OutputIntegrationsSectionProps) => {
  const outputIntegrations = [
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
      available: false, 
      icon: CheckSquare,
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
          const IconComponent = integration.icon;
          return (
            <div
              key={integration.provider}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-text-primary" />
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
