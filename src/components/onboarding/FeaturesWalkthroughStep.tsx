
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Inbox, Clock, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeaturesWalkthroughStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    [key: string]: any;
  };
}

const FeaturesWalkthroughStep = ({
  onNext,
  onBack,
  updateUserData,
  userData
}: FeaturesWalkthroughStepProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      id: "daily-briefings",
      title: "Automated Daily Briefs",
      description: "Get a personalized summary of key conversations, threads, meetings, and tasks.",
      icon: <Inbox className="h-8 sm:h-10 w-8 sm:w-10 text-accent-primary" />,
      detail: "Brief.me monitors your connected apps while you're away and delivers a concise summary of what happened."
    }, 
    {
      id: "catch-me-up",
      title: "Catch Me Up",
      description: "Get caught up on specific topics, channels, or conversations with a single click.",
      icon: <Clock className="h-8 sm:h-10 w-8 sm:w-10 text-accent-primary" />,
      detail: "Need to know what happened in a specific Slack channel? Just ask Brief.me to catch you up."
    }, 
    {
      id: "vacation-mode",
      title: "Vacation Mode",
      description: "Stay completely disconnected while away, then get a comprehensive summary when you return.",
      icon: <Plane className="h-8 sm:h-10 w-8 sm:w-10 text-accent-primary" />,
      detail: "Brief.me will monitor everything while you're gone, then give you exactly what you need to know when you're back."
    }
  ];
  
  const nextFeature = () => {
    if (currentFeature < features.length - 1) {
      setCurrentFeature(currentFeature + 1);
    } else {
      onNext();
    }
  };
  
  const prevFeature = () => {
    if (currentFeature > 0) {
      setCurrentFeature(currentFeature - 1);
    } else {
      onBack();
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <ProgressIndicator currentStep={2} totalSteps={7} />

      <div className="text-center space-y-2 sm:space-y-3">
        <h2 className="headline-m">
          How Brief.me works
        </h2>
        <p className="body-s mx-auto">
          Brief.me helps you stay informed without the information overload.
        </p>
      </div>

      <div className="py-4 sm:py-6">
        <div className="feature-display space-y-4 sm:space-y-6">
          <div className="flex items-center justify-center">
            <div className="p-4 rounded-full shadow-neu-inner bg-surface">
              {features[currentFeature].icon}
            </div>
          </div>
          
          <div className="text-center space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-medium text-text-primary tracking-tighter">
              {features[currentFeature].title}
            </h3>
            <p className="text-sm sm:text-base text-text-secondary">{features[currentFeature].description}</p>
            
            <div className="p-3 sm:p-4 bg-surface rounded-lg shadow-neu-inner mt-4">
              <p className="text-xs sm:text-sm text-text-secondary">{features[currentFeature].detail}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pt-2 sm:pt-4">
        {features.map((_, index) => (
          <div 
            key={index} 
            className={cn(
              "neu-dot cursor-pointer transition-all", 
              index === currentFeature ? "active w-4" : "inactive hover:bg-slider-track/70"
            )} 
            onClick={() => setCurrentFeature(index)} 
          />
        ))}
      </div>

      <div className="flex justify-between pt-2 sm:pt-4">
        <Button onClick={prevFeature} variant="ghost" size="none" className="text-sm sm:text-base">
          Back
        </Button>
        <Button onClick={nextFeature} variant="primary" className="text-sm sm:text-base py-2 sm:py-3 px-4 sm:px-6">
          {currentFeature < features.length - 1 ? "Next Feature" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default FeaturesWalkthroughStep;
