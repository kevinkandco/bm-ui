
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";

interface IntegrationOption {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

interface IntegrationsStepProps {
  onNext: () => void;
  onBack: () => void;
}

const IntegrationsStep = ({ onNext, onBack }: IntegrationsStepProps) => {
  const [integrations, setIntegrations] = useState<IntegrationOption[]>([
    { id: "slack", name: "Slack", icon: "S", available: true },
    { id: "gmail", name: "Gmail", icon: "G", available: true },
    { id: "calendar", name: "Google Calendar", icon: "C", available: true },
    { id: "asana", name: "Asana", icon: "A", available: false },
    { id: "notion", name: "Notion", icon: "N", available: false },
    { id: "zoom", name: "Zoom/Meet", icon: "Z", available: false },
  ]);
  
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  
  const toggleConnection = (id: string) => {
    if (!integrations.find(i => i.id === id)?.available) return;
    
    setConnected(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleContinue = () => {
    onNext();
  };
  
  const hasAnyConnection = Object.values(connected).some(value => value);

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={2} totalSteps={3} />
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Connect your tools</h2>
        <p className="text-neutral-gray">Brief.me will monitor these tools to create your personalized brief.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integration) => (
          <div 
            key={integration.id}
            className={`integration-card ${connected[integration.id] ? 'connected' : ''} ${!integration.available ? 'disabled' : ''}`}
            onClick={() => toggleConnection(integration.id)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-secondary rounded-full font-bold">
                {integration.icon}
              </div>
              <span className="font-medium">{integration.name}</span>
              <span className="text-xs text-neutral-gray">
                {!integration.available ? 'Coming soon' : 
                  connected[integration.id] ? 'Linked ✓' : 'Tap to connect'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <TooltipProvider>
        <div className="flex items-center gap-2 text-sm text-neutral-gray">
          <Info size={16} />
          <span>Select at least one integration</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto">
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>You can add more integrations later.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button 
          onClick={handleContinue} 
          disabled={!hasAnyConnection}
          className="bg-indigo hover:bg-indigo/90 text-white"
        >
          Continue
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button variant="link" onClick={onNext} className="text-sm text-neutral-gray">
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsStep;
