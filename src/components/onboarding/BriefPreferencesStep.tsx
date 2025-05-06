
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Mail, Headphones, Clock, Sun, Coffee, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BriefPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    deliveryMethod: "email" | "audio" | "both";
    scheduleTime: "morning" | "midday" | "evening" | "custom";
    briefTime: string;
    [key: string]: any;
  };
}

const BriefPreferencesStep = ({ onNext, onBack, updateUserData, userData }: BriefPreferencesStepProps) => {
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "audio" | "both">(userData.deliveryMethod || "email");
  const [scheduleTime, setScheduleTime] = useState<"morning" | "midday" | "evening" | "custom">(userData.scheduleTime || "morning");
  const [briefTime, setBriefTime] = useState(userData.briefTime || "08:00");

  const handleMethodChange = (method: "email" | "audio" | "both") => {
    setDeliveryMethod(method);
  };
  
  const handleScheduleChange = (schedule: "morning" | "midday" | "evening" | "custom") => {
    setScheduleTime(schedule);
    
    // Set default times based on selection
    if (schedule === "morning") {
      setBriefTime("08:00");
    } else if (schedule === "midday") {
      setBriefTime("12:00");
    } else if (schedule === "evening") {
      setBriefTime("17:00");
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBriefTime(e.target.value);
    setScheduleTime("custom");
  };

  const handleContinue = () => {
    updateUserData({ 
      deliveryMethod,
      scheduleTime,
      briefTime
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={6} totalSteps={7} />
      
      {/* Clock visual element */}
      <div className="h-16 w-full flex items-center justify-center relative mb-4">
        <Clock size={40} className="text-electric-teal opacity-70" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Customize your briefs</h2>
        <p className="text-cool-slate">Choose how and when you want to receive your Brief.me updates.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-ice-grey">Delivery method</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                deliveryMethod === 'email' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
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
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                deliveryMethod === 'audio' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
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
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                deliveryMethod === 'both' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
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
          <Label className="text-ice-grey">Brief schedule</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                scheduleTime === 'morning' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
              )}
              onClick={() => handleScheduleChange('morning')}
            >
              <Sun size={28} className="text-electric-teal" />
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Morning</div>
                <p className="text-xs text-cool-slate mt-1">Start your day informed (8:00 AM)</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                scheduleTime === 'midday' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
              )}
              onClick={() => handleScheduleChange('midday')}
            >
              <Coffee size={28} className="text-electric-teal" />
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Midday</div>
                <p className="text-xs text-cool-slate mt-1">Lunchtime update (12:00 PM)</p>
              </div>
            </div>
            
            <div 
              className={cn(
                "flex flex-col items-center gap-3 py-6 px-4 rounded-xl border cursor-pointer transition-all",
                scheduleTime === 'evening' 
                  ? 'border-electric-teal bg-deep-plum/30' 
                  : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
              )}
              onClick={() => handleScheduleChange('evening')}
            >
              <Moon size={28} className="text-electric-teal" />
              <div className="text-center">
                <div className="font-medium text-lg text-ice-grey">Evening</div>
                <p className="text-xs text-cool-slate mt-1">End of day recap (5:00 PM)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="custom-time" className="text-ice-grey flex items-center gap-2">
            Custom time
            {scheduleTime === 'custom' && (
              <span className="text-xs px-2 py-0.5 bg-electric-teal/10 rounded-full text-electric-teal">Selected</span>
            )}
          </Label>
          <div className="max-w-xs">
            <Input
              id="custom-time"
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

export default BriefPreferencesStep;
