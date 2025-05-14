
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Check } from "lucide-react";

interface GetStartedStepProps {
  onNext: () => void;
  onBack: () => void;
}

const GetStartedStep = ({ onNext, onBack }: GetStartedStepProps) => {
  const [isStarting, setIsStarting] = useState(false);
  
  const handleGetStarted = () => {
    setIsStarting(true);
    // Simulate API call or loading
    setTimeout(() => {
      setIsStarting(false);
      onNext();
    }, 1000);
  };
  
  const benefits = [
    "Save up to 3 hours per week on information management",
    "Never miss important updates from priority people",
    "Stay in sync with your team without constant interruptions",
    "Get personalized summaries on what matters to you"
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <ProgressIndicator currentStep={1} totalSteps={7} />
      
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-semibold text-text-headline tracking-tighter">
          Let's get you set up
        </h1>
        <p className="text-sm sm:text-base text-text-body max-w-md mx-auto">
          Brief-me works best when it knows what to prioritize. 
          The next few steps will help us tailor your experience.
        </p>
      </div>
      
      <div className="bg-card border border-divider rounded-lg p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-medium text-text-headline">
          Why Brief-me?
        </h2>
        
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5 bg-accent-blue/10 rounded-full p-1">
                <Check className="h-4 w-4 text-accent-blue" />
              </div>
              <span className="text-sm sm:text-base text-text-body">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4">
        <Button 
          onClick={onBack}
          variant="outline"
          className="order-2 sm:order-1"
        >
          Back
        </Button>
        
        <Button 
          onClick={handleGetStarted}
          disabled={isStarting}
          variant="default"
          size="lg"
          className="order-1 sm:order-2"
        >
          {isStarting ? "Setting up..." : "Let's get started"}
        </Button>
      </div>
    </div>
  );
};

export default GetStartedStep;
