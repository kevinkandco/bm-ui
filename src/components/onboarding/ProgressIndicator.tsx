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
  const percentage = currentStep / totalSteps * 100;
  return <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between text-xs text-cool-slate">
        <span className="text-gray-800">Step {currentStep} of {totalSteps}</span>
        <span className="text-gray-800">{Math.round(percentage)}%</span>
      </div>
      
      <div className="w-full bg-cool-slate/20 h-1.5 rounded-full overflow-hidden">
        <div className="bg-electric-teal h-full rounded-full transition-all duration-500 ease-out" style={{
        width: `${percentage}%`
      }} />
      </div>
      
      {/* Progress dots instead of bar */}
      <div className="flex items-center justify-center gap-2 py-1">
        {[...Array(totalSteps)].map((_, index) => <div key={index} className={cn("progress-dot transition-all duration-300", index < currentStep ? "active" : "inactive")} />)}
      </div>
    </div>;
};
export default ProgressIndicator;