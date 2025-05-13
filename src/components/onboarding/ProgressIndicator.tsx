
import React from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({
  currentStep,
  totalSteps
}: ProgressIndicatorProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-2">
      {/* Progress bar with glow effect */}
      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
        <Progress 
          value={progress} 
          className="h-1 bg-white/10" 
          variant="glow"
        />
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-xs text-text-secondary">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;
