
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressIndicator = ({ currentStep, totalSteps }: ProgressIndicatorProps) => {
  // Calculate progress percentage
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-text-secondary text-sm">
        <span>Step {currentStep}</span>
        <span>of {totalSteps}</span>
      </div>
      
      {/* Neumorphic progress track */}
      <div className="neu-progress-track">
        <div 
          className="neu-progress-bar" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div 
            key={index} 
            className={cn(
              "neu-dot",
              index < currentStep ? "active" : "inactive"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
