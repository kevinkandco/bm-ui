
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
        <div className="relative">
          <Clock size={48} className="text-electric-teal opacity-70" />
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-hot-coral flex items-center justify-center text-xs text-canvas-black font-bold">
            !
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">How will you get your brief?</h2>
        <p className="text-cool-slate">Customize your preferred delivery method and timing.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-ice-grey">Delivery method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={cn(
                "delivery-card flex flex-col items-center gap-3 py-6",
                deliveryMethod === 'email' ? 'selected' : ''
              )}
              onClick={() => handleMethodChange('email')}
            >
              <Mail size={28} className="text-electric-teal" />
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Email</div>
                <p className="text-xs text-cool-slate mt-1">Receive your brief in a daily email</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "delivery-card flex flex-col items-center gap-3 py-6",
                deliveryMethod === 'audio' ? 'selected' : ''
              )}
              onClick={() => handleMethodChange('audio')}
            >
              <Headphones size={28} className="text-electric-teal" />
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Audio</div>
                <p className="text-xs text-cool-slate mt-1">Listen to your brief on any device</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "delivery-card flex flex-col items-center gap-3 py-6",
                deliveryMethod === 'both' ? 'selected' : ''
              )}
              onClick={() => handleMethodChange('both')}
            >
              <div className="flex">
                <Mail size={28} className="text-electric-teal mr-1" />
                <Headphones size={28} className="text-electric-teal" />
              </div>
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Both</div>
                <p className="text-xs text-cool-slate mt-1">Get email and audio delivery</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="brief-time" className="text-ice-grey">When should we deliver your brief?</Label>
          <div className="max-w-xs">
            <Input
              id="brief-time"
              type="time"
              value={briefTime}
              onChange={handleTimeChange}
              className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey focus-visible:ring-electric-teal"
            />
            <p className="text-xs text-cool-slate mt-2">
              Your brief will be prepared and delivered at this time each day (in your local timezone)
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          className="neon-outline-button"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          className="neon-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default DeliveryPreferencesStep;
