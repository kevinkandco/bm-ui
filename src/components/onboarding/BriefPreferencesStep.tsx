
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Mail, Headphones, Clock, Sun, Coffee, Moon, Plus, Trash2, InfoIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BriefSchedule {
  id: string;
  name: string;
  deliveryMethod: "email" | "audio" | "both";
  scheduleTime: "morning" | "midday" | "evening" | "custom";
  briefTime: string;
  enabled: boolean;
}

interface BriefPreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    briefSchedules: BriefSchedule[];
    [key: string]: any;
  };
}

const BriefPreferencesStep = ({ onNext, onBack, updateUserData, userData }: BriefPreferencesStepProps) => {
  const [briefSchedules, setBriefSchedules] = useState<BriefSchedule[]>(
    userData.briefSchedules?.length 
      ? userData.briefSchedules 
      : [{
          id: "default",
          name: "Daily Brief",
          deliveryMethod: "email",
          scheduleTime: "morning",
          briefTime: "08:00",
          enabled: true
        }]
  );

  const addNewBrief = () => {
    const newBrief: BriefSchedule = {
      id: uuidv4(),
      name: `Brief ${briefSchedules.length + 1}`,
      deliveryMethod: "email",
      scheduleTime: "morning",
      briefTime: "08:00",
      enabled: true
    };
    
    setBriefSchedules([...briefSchedules, newBrief]);
  };

  const removeBrief = (id: string) => {
    if (briefSchedules.length <= 1) return; // Don't allow removing the last brief
    setBriefSchedules(briefSchedules.filter(brief => brief.id !== id));
  };

  const updateBrief = (id: string, updates: Partial<BriefSchedule>) => {
    setBriefSchedules(briefSchedules.map(brief => 
      brief.id === id ? { ...brief, ...updates } : brief
    ));
  };

  const handleMethodChange = (id: string, method: "email" | "audio" | "both") => {
    updateBrief(id, { deliveryMethod: method });
  };
  
  const handleScheduleChange = (id: string, schedule: "morning" | "midday" | "evening" | "custom") => {
    const updates: Partial<BriefSchedule> = { scheduleTime: schedule };
    
    // Set default times based on selection
    if (schedule === "morning") {
      updates.briefTime = "08:00";
    } else if (schedule === "midday") {
      updates.briefTime = "12:00";
    } else if (schedule === "evening") {
      updates.briefTime = "17:00";
    }
    
    updateBrief(id, updates);
  };

  const handleTimeChange = (id: string, time: string) => {
    updateBrief(id, { 
      briefTime: time,
      scheduleTime: "custom"
    });
  };

  const handleContinue = () => {
    updateUserData({ briefSchedules });
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
        <p className="text-cool-slate">
          Set up multiple briefs to receive at different times of day. You can always request an ad hoc "Catch Me Up" anytime.
        </p>
      </div>
      
      {/* Brief schedule list */}
      <div className="space-y-4">
        {briefSchedules.map((brief, index) => (
          <Collapsible 
            key={brief.id}
            defaultOpen={index === 0}
            className="border border-cool-slate/20 rounded-lg overflow-hidden"
          >
            <div className="bg-canvas-black/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-deep-plum/30">
                    <Clock size={18} className="text-electric-teal" />
                  </Button>
                </CollapsibleTrigger>
                <Input
                  value={brief.name}
                  onChange={(e) => updateBrief(brief.id, { name: e.target.value })}
                  className="max-w-[180px] bg-deep-plum/20 border-none text-ice-grey h-8"
                />
              </div>
              
              <div className="flex items-center gap-2">
                {briefSchedules.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeBrief(brief.id)}
                    className="text-cool-slate hover:text-hot-coral hover:bg-deep-plum/30"
                  >
                    <Trash2 size={18} />
                  </Button>
                )}
              </div>
            </div>
            
            <CollapsibleContent className="p-4 space-y-6 bg-deep-plum/10">
              <div className="space-y-3">
                <Label className="text-ice-grey">Delivery method</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.deliveryMethod === 'email' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleMethodChange(brief.id, 'email')}
                  >
                    <Mail size={24} className="text-electric-teal" />
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Email</div>
                      <p className="text-xs text-cool-slate mt-1">Brief in email</p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.deliveryMethod === 'audio' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleMethodChange(brief.id, 'audio')}
                  >
                    <Headphones size={24} className="text-electric-teal" />
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Audio</div>
                      <p className="text-xs text-cool-slate mt-1">Listen to brief</p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.deliveryMethod === 'both' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleMethodChange(brief.id, 'both')}
                  >
                    <div className="flex gap-1">
                      <Mail size={24} className="text-electric-teal" />
                      <Headphones size={24} className="text-electric-teal" />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Both</div>
                      <p className="text-xs text-cool-slate mt-1">Email and audio</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label className="text-ice-grey">Schedule</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.scheduleTime === 'morning' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleScheduleChange(brief.id, 'morning')}
                  >
                    <Sun size={24} className="text-electric-teal" />
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Morning</div>
                      <p className="text-xs text-cool-slate mt-1">8:00 AM</p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.scheduleTime === 'midday' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleScheduleChange(brief.id, 'midday')}
                  >
                    <Coffee size={24} className="text-electric-teal" />
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Midday</div>
                      <p className="text-xs text-cool-slate mt-1">12:00 PM</p>
                    </div>
                  </div>
                  
                  <div 
                    className={cn(
                      "flex flex-col items-center gap-3 py-4 px-3 rounded-xl border cursor-pointer transition-all",
                      brief.scheduleTime === 'evening' 
                        ? 'border-electric-teal bg-deep-plum/30' 
                        : 'border-cool-slate/20 bg-canvas-black/80 hover:bg-deep-plum/20'
                    )}
                    onClick={() => handleScheduleChange(brief.id, 'evening')}
                  >
                    <Moon size={24} className="text-electric-teal" />
                    <div className="text-center">
                      <div className="font-medium text-ice-grey">Evening</div>
                      <p className="text-xs text-cool-slate mt-1">5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <Label htmlFor={`custom-time-${brief.id}`} className="text-ice-grey flex items-center gap-2">
                  Custom time
                  {brief.scheduleTime === 'custom' && (
                    <span className="text-xs px-2 py-0.5 bg-electric-teal/10 rounded-full text-electric-teal">Selected</span>
                  )}
                </Label>
                <div className="max-w-xs">
                  <Input
                    id={`custom-time-${brief.id}`}
                    type="time"
                    value={brief.briefTime}
                    onChange={(e) => handleTimeChange(brief.id, e.target.value)}
                    className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey focus-visible:ring-electric-teal"
                  />
                  <p className="text-xs text-cool-slate mt-2">
                    Your brief will be prepared and delivered at this time (in your local timezone)
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
        
        <Button 
          onClick={addNewBrief}
          variant="outline" 
          className="w-full border-dashed border-cool-slate/40 bg-deep-plum/10 hover:bg-deep-plum/30 text-ice-grey mt-2"
        >
          <Plus size={16} className="mr-2" /> Add another brief schedule
        </Button>
        
        <div className="bg-deep-plum/20 p-4 rounded-lg border border-electric-teal/20 flex gap-3 items-start mt-4">
          <InfoIcon size={20} className="text-electric-teal shrink-0 mt-0.5" />
          <p className="text-sm text-cool-slate">
            <span className="text-ice-grey font-medium">Need a brief outside of your schedule? </span> 
            You can always request a "Catch Me Up" at any time to get an ad hoc brief covering what you missed.
          </p>
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
