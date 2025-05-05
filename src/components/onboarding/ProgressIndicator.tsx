
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const ProgressIndicator = ({ 
  currentStep, 
  totalSteps,
  className
}: ProgressIndicatorProps) => {
  const percentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between text-xs text-cool-slate">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      
      {/* Progress dots instead of bar */}
      <div className="flex items-center justify-center gap-2 py-1">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index}
            className={cn(
              "progress-dot transition-all duration-300",
              index < currentStep ? "active" : "inactive"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;
