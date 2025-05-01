
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
      <div className="flex justify-between text-xs text-neutral-gray">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
        <div 
          className="progress-bar" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressIndicator;
