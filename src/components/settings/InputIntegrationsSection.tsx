import { Download, Mail, MessageSquare, Calendar, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface InputIntegrationsSectionProps {
  onConnect: (provider: string, type: 'input' | 'output') => void;
}

const InputIntegrationsSection = ({ onConnect }: InputIntegrationsSectionProps) => {
  const inputIntegrations = [
    { 
      name: "Gmail", 
      provider: "google", 
      available: true, 
      icon: Mail,
      description: "Pull emails and automatically summarize important messages",
      features: ["Email summaries", "Priority detection", "Action items extraction"]
    },
    { 
      name: "Slack", 
      provider: "slack", 
      available: true, 
      icon: MessageSquare,
      description: "Monitor channels and DMs for important updates and action items",
      features: ["Channel monitoring", "Message summaries", "Mention tracking"]
    },
    { 
      name: "Outlook", 
      provider: "outlook", 
      available: true, 
      icon: Mail,
      description: "Sync emails and calendar events for comprehensive briefings",
      features: ["Email processing", "Meeting summaries", "Task extraction"]
    },
    { 
      name: "Google Calendar", 
      provider: "calendar", 
      available: true, 
      icon: Calendar,
      description: "Track meetings, deadlines, and schedule changes",
      features: ["Meeting prep", "Schedule conflicts", "Deadline tracking"]
    },
    { 
      name: "Notion", 
      provider: "notion", 
      available: false, 
      icon: FileText,
      description: "Sync pages and databases for project updates",
      features: ["Page changes", "Database updates", "Project tracking"]
    },
    { 
      name: "Linear", 
      provider: "linear", 
      available: false, 
      icon: Users,
      description: "Track issue updates and project progress",
      features: ["Issue tracking", "Sprint updates", "Bug reports"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Download className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-text-primary">Input Integrations</h3>
          <p className="text-sm text-text-secondary">
            Connect systems where BriefMe automatically pulls and summarizes data for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputIntegrations.map((integration) => {
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
                  onClick={() => integration.available && onConnect(integration.provider, 'input')}
                  disabled={!integration.available}
                  className="shrink-0"
                >
                  Connect
                </Button>
              </div>

              <p className="text-sm text-text-secondary">
                {integration.description}
              </p>

              <div className="space-y-2">
                <h5 className="text-xs font-medium text-text-primary uppercase tracking-wide">
                  What gets processed:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {integration.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InputIntegrationsSection;
