
import React from "react";
import { Mail, Tag, Archive, Robot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const EmailAutomationSection = () => {
  const emailProviders = [
    {
      name: "Gmail",
      provider: "gmail",
      connected: true,
      icon: Mail,
      features: {
        autoLabel: true,
        autoCategorize: true,
        autoArchive: true
      }
    },
    {
      name: "Outlook",
      provider: "outlook", 
      connected: false,
      icon: Mail,
      features: {
        autoLabel: false,
        autoCategorize: false,
        autoArchive: false
      }
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-500/10 rounded-lg">
          <Robot className="h-5 w-5 text-green-500" />
        </div>
        <div>
          <h3 className="text-lg font-medium text-text-primary">Email Automation</h3>
          <p className="text-sm text-text-secondary">
            Automatically organize your emails based on AI analysis and briefing preferences
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {emailProviders.map((provider) => {
          const IconComponent = provider.icon;
          
          return (
            <div
              key={provider.provider}
              className="glass-card rounded-2xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <IconComponent className="h-5 w-5 text-text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{provider.name}</h4>
                    <Badge 
                      variant={provider.connected ? "default" : "secondary"} 
                      className="text-xs mt-1"
                    >
                      {provider.connected ? "Connected" : "Not Connected"}
                    </Badge>
                  </div>
                </div>
              </div>

              {provider.connected && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4 text-blue-400" />
                      <Label className="text-sm text-text-secondary">
                        Auto-label processed emails
                      </Label>
                    </div>
                    <Switch defaultChecked={provider.features.autoLabel} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Robot className="h-4 w-4 text-purple-400" />
                      <Label className="text-sm text-text-secondary">
                        Auto-categorize by importance
                      </Label>
                    </div>
                    <Switch defaultChecked={provider.features.autoCategorize} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Archive className="h-4 w-4 text-green-400" />
                      <Label className="text-sm text-text-secondary">
                        Auto-archive processed emails (never delete)
                      </Label>
                    </div>
                    <Switch defaultChecked={provider.features.autoArchive} />
                  </div>

                  <div className="mt-4 p-3 bg-white/5 rounded-lg">
                    <p className="text-xs text-text-secondary">
                      <strong>Auto-labeling:</strong> Adds "BriefMe-Processed" label to emails included in briefs<br/>
                      <strong>Auto-categorizing:</strong> Uses AI to sort emails by priority and topic<br/>
                      <strong>Auto-archiving:</strong> Moves processed emails to archive while keeping them accessible
                    </p>
                  </div>
                </div>
              )}

              {!provider.connected && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary mb-2">
                    Connect {provider.name} to enable email automation
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmailAutomationSection;
