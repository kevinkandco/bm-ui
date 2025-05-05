
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Sparkles, BriefcaseBusiness, Users, Presentation, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface PurposeStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    purpose: string;
    [key: string]: any;
  };
}

const PurposeStep = ({ onNext, onBack, updateUserData, userData }: PurposeStepProps) => {
  const [selectedPurpose, setSelectedPurpose] = useState<string>(userData.purpose || "");
  
  const handleSelectPurpose = (purpose: string) => {
    setSelectedPurpose(purpose);
    updateUserData({ purpose });
  };

  const handleContinue = () => {
    if (selectedPurpose) {
      onNext();
    }
  };

  const purposes = [
    {
      id: "work",
      name: "Work & Focus",
      description: "Stay productive and never miss important work messages",
      icon: <BriefcaseBusiness className="h-6 w-6 text-electric-teal" />
    },
    {
      id: "team",
      name: "Team Coordination",
      description: "Keep your team in sync without constant notifications",
      icon: <Users className="h-6 w-6 text-electric-teal" />
    },
    {
      id: "personal",
      name: "Personal Growth",
      description: "Stay on top of your personal goals and communications",
      icon: <Rocket className="h-6 w-6 text-electric-teal" />
    },
    {
      id: "leadership",
      name: "Leadership",
      description: "Monitor key metrics and communications with your team",
      icon: <Presentation className="h-6 w-6 text-electric-teal" />
    }
  ];

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={2} totalSteps={6} />
      
      {/* Constellation visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <div className="constellation animate-pulse">
          <Sparkles className="h-6 w-6 text-electric-teal absolute top-4 left-1/4" />
          <Sparkles className="h-8 w-8 text-electric-teal absolute top-10 left-1/2" />
          <Sparkles className="h-5 w-5 text-electric-teal absolute top-2 right-1/4" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">How will you use Brief.me?</h2>
        <p className="text-cool-slate max-w-lg">We'll tailor your experience based on your primary needs.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {purposes.map((purpose) => (
          <div 
            key={purpose.id}
            className={cn(
              "purpose-card flex flex-col p-5 rounded-xl border transition-all duration-300 cursor-pointer",
              selectedPurpose === purpose.id 
                ? "border-electric-teal bg-deep-plum/30" 
                : "border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20"
            )}
            onClick={() => handleSelectPurpose(purpose.id)}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">
                {purpose.icon}
              </div>
              <div>
                <h3 className="text-lg font-medium text-ice-grey">{purpose.name}</h3>
                <p className="text-sm text-cool-slate">{purpose.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack}
          className="neon-outline-button"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!selectedPurpose}
          className="neon-button disabled:opacity-50 disabled:pointer-events-none"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PurposeStep;
