
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
  userData,
}: FeaturesWalkthroughStepProps) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    {
      id: "daily-briefings",
      title: "Daily Briefings",
      description: "Get a personalized summary of your communications, meetings, and tasks first thing in the morning.",
      icon: <Inbox className="h-10 w-10 text-electric-teal" />,
      detail: "Brief.me monitors your connected apps while you're away and delivers a concise summary of what happened."
    },
    {
      id: "catch-me-up",
      title: "Catch Me Up",
      description: "Get caught up on specific topics, channels, or conversations with a single click.",
      icon: <Clock className="h-10 w-10 text-electric-teal" />,
      detail: "Need to know what happened in a specific Slack channel? Just ask Brief.me to catch you up."
    },
    {
      id: "vacation-mode",
      title: "Vacation Mode",
      description: "Stay completely disconnected while away, then get a comprehensive summary when you return.",
      icon: <Plane className="h-10 w-10 text-electric-teal" />,
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
    <div className="space-y-8">
      <ProgressIndicator currentStep={2} totalSteps={7} />

      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">
          How Brief.me works
        </h2>
        <p className="text-cool-slate max-w-lg mx-auto">
          Brief.me helps you stay informed without the information overload.
        </p>
      </div>

      <div className="py-6">
        <div className="feature-display space-y-6">
          <div className="flex items-center justify-center">
            {features[currentFeature].icon}
          </div>
          
          <div className="text-center space-y-3">
            <h3 className="text-xl font-medium text-ice-grey">
              {features[currentFeature].title}
            </h3>
            <p className="text-cool-slate">{features[currentFeature].description}</p>
            
            <div className="p-4 bg-deep-plum/20 rounded-lg border border-electric-teal/20 mt-4">
              <p className="text-sm text-ice-grey">{features[currentFeature].detail}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 pt-4">
        {features.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full cursor-pointer transition-all",
              index === currentFeature
                ? "bg-electric-teal w-4"
                : "bg-cool-slate/30 hover:bg-cool-slate/50"
            )}
            onClick={() => setCurrentFeature(index)}
          />
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <Button onClick={prevFeature} className="neon-outline-button">
          Back
        </Button>
        <Button onClick={nextFeature} className="neon-button">
          {currentFeature < features.length - 1 ? "Next Feature" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default FeaturesWalkthroughStep;
