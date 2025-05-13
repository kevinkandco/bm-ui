
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Mail, Headphones, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeliveryPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    deliveryMethod: "email" | "audio" | "both";
    briefTime: string;
    [key: string]: any;
  };
}

const DeliveryPreferencesStep = ({ onNext, onBack, updateUserData, userData }: DeliveryPreferencesStepProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "audio" | "both">(userData.deliveryMethod || "email");
  const [briefTime, setBriefTime] = useState(userData.briefTime || "08:00");

  const handleMethodChange = (method: "email" | "audio" | "both") => {
    setDeliveryMethod(method);
    updateUserData({ deliveryMethod: method });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBriefTime(e.target.value);
    updateUserData({ briefTime: e.target.value });
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={5} totalSteps={6} />
      
      {/* Clock visual element */}
      <div className="h-24 w-full flex items-center justify-center relative mb-8">
        <div className="p-5 rounded-full shadow-neu-outer bg-surface">
          <Clock size={48} className="text-accent-primary" />
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="headline-m">How will you get your brief?</h2>
        <p className="body-s">Customize your preferred delivery method and timing.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-text-primary">Delivery method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 rounded-xl bg-surface-raised transition-all duration-150",
                deliveryMethod === 'email' 
                  ? 'shadow-neu-pressed border-2 border-accent-primary' 
                  : 'shadow-neu-raised hover:shadow-neu-hover hover:-translate-y-1 cursor-pointer'
              )}
              onClick={() => handleMethodChange('email')}
            >
              <Mail size={28} className="text-accent-primary" />
              <div className="text-center">
                <div className="font-medium text-lg text-text-primary">Email</div>
                <p className="text-xs text-text-secondary mt-1">Receive your brief in a daily email</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 rounded-xl bg-surface-raised transition-all duration-150",
                deliveryMethod === 'audio' 
                  ? 'shadow-neu-pressed border-2 border-accent-primary' 
                  : 'shadow-neu-raised hover:shadow-neu-hover hover:-translate-y-1 cursor-pointer'
              )}
              onClick={() => handleMethodChange('audio')}
            >
              <Headphones size={28} className="text-accent-primary" />
              <div className="text-center">
                <div className="font-medium text-lg text-text-primary">Audio</div>
                <p className="text-xs text-text-secondary mt-1">Listen to your brief on any device</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 rounded-xl bg-surface-raised transition-all duration-150",
                deliveryMethod === 'both' 
                  ? 'shadow-neu-pressed border-2 border-accent-primary' 
                  : 'shadow-neu-raised hover:shadow-neu-hover hover:-translate-y-1 cursor-pointer'
              )}
              onClick={() => handleMethodChange('both')}
            >
              <div className="flex">
                <Mail size={28} className="text-accent-primary mr-1" />
                <Headphones size={28} className="text-accent-primary" />
              </div>
              <div className="text-center">
                <div className="font-medium text-lg text-text-primary">Both</div>
                <p className="text-xs text-text-secondary mt-1">Get email and audio delivery</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="brief-time" className="text-text-primary">When should we deliver your brief?</Label>
          <div className="max-w-xs">
            <Input
              id="brief-time"
              type="time"
              value={briefTime}
              onChange={handleTimeChange}
              className="neu-input text-text-primary"
            />
            <p className="text-xs text-text-secondary mt-2">
              Your brief will be prepared and delivered at this time each day (in your local timezone)
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="ghost"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="primary"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DeliveryPreferencesStep;
