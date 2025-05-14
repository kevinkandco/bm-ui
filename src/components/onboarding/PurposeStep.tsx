
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
      icon: <BriefcaseBusiness className="h-5 sm:h-6 w-5 sm:w-6 text-electric-teal" />
    },
    {
      id: "team",
      name: "Team Coordination",
      description: "Keep your team in sync without constant notifications",
      icon: <Users className="h-5 sm:h-6 w-5 sm:w-6 text-electric-teal" />
    },
    {
      id: "personal",
      name: "Personal Growth",
      description: "Stay on top of your personal goals and communications",
      icon: <Rocket className="h-5 sm:h-6 w-5 sm:w-6 text-electric-teal" />
    },
    {
      id: "leadership",
      name: "Leadership",
      description: "Monitor key metrics and communications with your team",
      icon: <Presentation className="h-5 sm:h-6 w-5 sm:w-6 text-electric-teal" />
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <ProgressIndicator currentStep={2} totalSteps={6} />
      
      {/* Constellation visual element */}
      <div className="relative h-16 sm:h-24 w-full flex items-center justify-center overflow-hidden mb-2 sm:mb-4">
        <div className="constellation animate-pulse">
          <Sparkles className="h-4 sm:h-6 w-4 sm:w-6 text-electric-teal absolute top-4 left-1/4" />
          <Sparkles className="h-6 sm:h-8 w-6 sm:w-8 text-electric-teal absolute top-8 sm:top-10 left-1/2" />
          <Sparkles className="h-3 sm:h-5 w-3 sm:w-5 text-electric-teal absolute top-2 right-1/4" />
        </div>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-ice-grey tracking-tighter">How will you use Brief.me?</h2>
        <p className="text-sm sm:text-base text-cool-slate max-w-lg">We'll tailor your experience based on your primary needs.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        {purposes.map((purpose) => (
          <div 
            key={purpose.id}
            className={cn(
              "purpose-card flex flex-col p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer backdrop-blur-sm",
              selectedPurpose === purpose.id 
                ? "border-white/15 bg-gradient-to-b from-surface-raised/80 to-surface/95 shadow-lg" 
                : "border-white/10 bg-gradient-to-b from-surface-raised/60 to-surface/80 hover:bg-surface-raised/70"
            )}
            onClick={() => handleSelectPurpose(purpose.id)}
          >
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="mt-0.5 sm:mt-1">
                {purpose.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-medium text-ice-grey">{purpose.name}</h3>
                <p className="text-xs sm:text-sm text-cool-slate">{purpose.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-4">
        <Button 
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-sm text-white/70 hover:text-white transition-colors"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!selectedPurpose}
          className="bg-accent-primary hover:bg-accent-primary/90 text-white disabled:opacity-50 disabled:pointer-events-none"
          size="sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PurposeStep;
