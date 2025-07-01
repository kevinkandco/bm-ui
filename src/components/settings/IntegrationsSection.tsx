import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Zap, Mail, Slack, Google, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import AISettingsModal from "./AISettingsModal";

interface Integration {
  id: string;
  type: "email" | "slack" | "google";
  name: string;
  description: string;
  isConnected: boolean;
}

const IntegrationsSection = () => {
  const { toast } = useToast();
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "gmail",
      type: "email",
      name: "Gmail",
      description: "Connect your Gmail account for email summaries",
      isConnected: true,
    },
    {
      id: "slack",
      type: "slack",
      name: "Slack",
      description: "Connect your Slack workspace for team updates",
      isConnected: false,
    },
    {
      id: "google-calendar",
      type: "google",
      name: "Google Calendar",
      description: "Sync your Google Calendar for schedule insights",
      isConnected: false,
    },
  ]);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const [integrationToDisconnect, setIntegrationToDisconnect] = useState<Integration | null>(null);
  const [aiSettingsOpen, setAiSettingsOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<{ name: string; provider: "email" | "slack" } | null>(null);

  const handleConnect = (id: string) => {
    setIntegrations((prevIntegrations) =>
      prevIntegrations.map((integration) =>
        integration.id === id ? { ...integration, isConnected: true } : integration
      )
    );
    toast({
      title: "Integration Connected",
      description: `Successfully connected to ${integrations.find((i) => i.id === id)?.name}.`,
    });
  };

  const handleDisconnect = (id: string) => {
    const integration = integrations.find((i) => i.id === id);
    if (integration) {
      setIntegrationToDisconnect(integration);
      setIsDisconnectModalOpen(true);
    }
  };

  const confirmDisconnect = () => {
    if (integrationToDisconnect) {
      setIntegrations((prevIntegrations) =>
        prevIntegrations.map((integration) =>
          integration.id === integrationToDisconnect.id ? { ...integration, isConnected: false } : integration
        )
      );
      toast({
        title: "Integration Disconnected",
        description: `Successfully disconnected from ${integrationToDisconnect.name}.`,
      });
      setIsDisconnectModalOpen(false);
      setIntegrationToDisconnect(null);
    }
  };

  const cancelDisconnect = () => {
    setIsDisconnectModalOpen(false);
    setIntegrationToDisconnect(null);
  };

  const handleOpenAISettings = (accountName: string, provider: "email" | "slack") => {
    setSelectedAccount({ name: accountName, provider });
    setAiSettingsOpen(true);
  };

  const handleSaveAISettings = (emailSettings?: any, slackSettings?: any) => {
    console.log("Saving AI settings:", { emailSettings, slackSettings });
    // Here you would typically save to your backend
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-text-primary mb-6">Integrations</h2>
      <p className="text-text-secondary mb-8">
        Connect your favorite tools to streamline your workflow and get the most out of Brief Me.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center">
                  {integration.type === "email" && <Mail className="mr-2 h-4 w-4 text-blue-500" />}
                  {integration.type === "slack" && <Slack className="mr-2 h-4 w-4 text-purple-500" />}
                  {integration.type === "google" && <Google className="mr-2 h-4 w-4 text-red-500" />}
                  {integration.name}
                </CardTitle>
                <Switch
                  id={integration.id}
                  checked={integration.isConnected}
                  onCheckedChange={(checked) =>
                    checked ? handleConnect(integration.id) : handleDisconnect(integration.id)
                  }
                />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-text-secondary">
                {integration.description}
              </CardDescription>
              {integration.isConnected && (
                <div className="mt-4">
                  {integration.type === "email" && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleOpenAISettings(integration.name, "email")}
                    >
                      Configure AI Email Management
                    </Button>
                  )}
                  {integration.type === "slack" && (
                    <Button
                      variant="secondary"
                      className="w-full"
                      onClick={() => handleOpenAISettings(integration.name, "slack")}
                    >
                      Configure AI Message Management
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDisconnectModalOpen} onOpenChange={setIsDisconnectModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disconnect Integration</DialogTitle>
            <DialogDescription>
              Are you sure you want to disconnect from {integrationToDisconnect?.name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button type="button" variant="secondary" onClick={cancelDisconnect}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmDisconnect}>
              Disconnect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedAccount && (
        <AISettingsModal
          isOpen={aiSettingsOpen}
          onClose={() => {
            setAiSettingsOpen(false);
            setSelectedAccount(null);
          }}
          accountName={selectedAccount.name}
          provider={selectedAccount.provider}
          onSave={handleSaveAISettings}
        />
      )}
    </>
  );
};

export default IntegrationsSection;
