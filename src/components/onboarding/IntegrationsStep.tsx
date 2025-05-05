
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IntegrationOption {
  id: string;
  name: string;
  icon: string;
  available: boolean;
  description: string;
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

const IntegrationsStep = ({ onNext, onBack, onSkip, updateUserData, userData }: IntegrationsStepProps) => {
  const [integrations] = useState<IntegrationOption[]>([
    { 
      id: "slack", 
      name: "Slack", 
      icon: "S", 
      available: true, 
      description: "Connect to your workspaces and channels" 
    },
    { 
      id: "gmail", 
      name: "Gmail", 
      icon: "G", 
      available: true, 
      description: "Sync important emails and avoid spam" 
    },
    { 
      id: "calendar", 
      name: "Google Calendar", 
      icon: "C", 
      available: true, 
      description: "Stay on top of meetings and events" 
    },
    { 
      id: "asana", 
      name: "Asana", 
      icon: "A", 
      available: false, 
      description: "Track your tasks and projects (coming soon)" 
    },
    { 
      id: "notion", 
      name: "Notion", 
      icon: "N", 
      available: false, 
      description: "Link your notes and documents (coming soon)" 
    },
    { 
      id: "zoom", 
      name: "Zoom/Meet", 
      icon: "Z", 
      available: false, 
      description: "Never miss important meetings (coming soon)" 
    },
  ]);
  
  const [connected, setConnected] = useState<Record<string, boolean>>(
    userData.integrations.reduce((acc, id) => ({ ...acc, [id]: true }), {})
  );
  
  const toggleConnection = (id: string) => {
    if (!integrations.find(i => i.id === id)?.available) return;
    
    setConnected(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const handleContinue = () => {
    const selectedIntegrations = Object.entries(connected)
      .filter(([_, isConnected]) => isConnected)
      .map(([id]) => id);
    
    updateUserData({ integrations: selectedIntegrations });
    onNext();
  };
  
  const hasAnyConnection = Object.values(connected).some(value => value);

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={3} totalSteps={6} />
      
      {/* Pyramid neon visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <div className="w-0 h-0 animate-float" style={{ 
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '40px solid rgba(0, 224, 213, 0.3)'
        }} />
        <div className="w-0 h-0 absolute mt-6 animate-float" style={{ 
          animationDelay: '1s',
          borderLeft: '30px solid transparent',
          borderRight: '30px solid transparent',
          borderBottom: '60px solid rgba(255, 79, 109, 0.2)'
        }} />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Choose your tools</h2>
        <p className="text-cool-slate">Brief.me will monitor these sources to create your personalized brief.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {integrations.slice(0, 4).map((integration) => (
          <div 
            key={integration.id}
            className={`integration-card ${connected[integration.id] ? 'connected' : ''} ${!integration.available ? 'disabled' : ''}`}
            onClick={() => toggleConnection(integration.id)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center bg-deep-plum/50 rounded-full font-bold text-electric-teal">
                {integration.icon}
              </div>
              <span className="font-medium text-ice-grey">{integration.name}</span>
              <span className="text-xs text-cool-slate">
                {!integration.available ? 'Coming soon' : 
                  connected[integration.id] ? 'Connected ✓' : 'Tap to connect'}
              </span>
              <p className="text-xs text-cool-slate text-center mt-1">{integration.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <TooltipProvider>
        <div className="flex items-center gap-2 text-sm text-cool-slate">
          <Info size={16} className="text-electric-teal" />
          <span>You'll be able to add more tools later</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-cool-slate">
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-canvas-black border border-cool-slate/20 text-ice-grey">
              <p>You can modify your integrations anytime from settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      
      <div className="flex justify-between pt-2">
        <Button 
          onClick={onBack} 
          className="neon-outline-button"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          disabled={!hasAnyConnection}
          className="neon-button disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="link" 
          onClick={onSkip} 
          className="text-sm text-cool-slate hover:text-ice-grey"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsStep;
