
import React from "react";

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
      {/* Progress bar */}
      <div className="w-full h-1 bg-surface-raised rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-primary rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
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
