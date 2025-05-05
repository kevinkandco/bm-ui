
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import PriorityGroupsPicker from "./PriorityGroupsPicker";

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
  const [hasContacts, setHasContacts] = useState(false);
  
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
  const canContinue = hasAnyConnection || hasContacts;

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={2} totalSteps={3} />
      
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
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Connect your tools</h2>
        <p className="text-cool-slate">Brief.me will monitor these tools to create your personalized brief.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {integrations.map((integration) => (
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
                  connected[integration.id] ? 'Linked ✓' : 'Tap to connect'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Groups Picker */}
      <div className="mt-8 pt-4 border-t border-cool-slate/10">
        <PriorityGroupsPicker onContactsAdded={setHasContacts} />
      </div>
      
      <TooltipProvider>
        <div className="flex items-center gap-2 text-sm text-cool-slate">
          <Info size={16} className="text-electric-teal" />
          <span>Select at least one integration or add priority contacts</span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-auto text-cool-slate">
                <Info size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-canvas-black border border-cool-slate/20 text-ice-grey">
              <p>You can add more integrations and contacts later.</p>
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
          disabled={!canContinue}
          className="neon-button disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="link" 
          onClick={onNext} 
          className="text-sm text-cool-slate hover:text-ice-grey"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default IntegrationsStep;
