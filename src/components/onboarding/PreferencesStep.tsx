import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Sun, Coffee, Moon } from "lucide-react";

interface PreferencesStepProps {
  onNext: () => void;
  onBack: () => void;
}

const PreferencesStep = ({ onNext, onBack }: PreferencesStepProps) => {
  const [priorities] = useState([
    { id: "p1", name: "Team", avatar: "T" },
    { id: "p2", name: "Manager", avatar: "M" },
    { id: "p3", name: "Partner", avatar: "P" },
    { id: "p4", name: "Client", avatar: "C" },
    { id: "p5", name: "Family", avatar: "F" },
  ]);
  
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<"email" | "audio" | "both">("email");
  const [selectedTimes, setSelectedTimes] = useState<string[]>(["morning"]); // Default to morning
  const [briefTime, setBriefTime] = useState("08:00");
  const [ignoreKeyword, setIgnoreKeyword] = useState("");
  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>([]);
  
  const togglePriority = (id: string) => {
    setSelectedPriorities(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };
  
  const toggleTimeSelection = (time: string) => {
    setSelectedTimes(prev => {
      if (prev.includes(time)) {
        // Don't remove if it's the last selected time
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== time);
      } else {
        return [...prev, time];
      }
    });
  };

  const addKeyword = () => {
    if (!ignoreKeyword.trim()) return;
    setIgnoreKeywords(prev => [...prev, ignoreKeyword.trim()]);
    setIgnoreKeyword("");
  };
  
  const removeKeyword = (keyword: string) => {
    setIgnoreKeywords(prev => prev.filter(k => k !== keyword));
  };
  
  const handleSubmit = () => {
    onNext();
  };
  
  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={3} totalSteps={3} />
      
      {/* Concentric circles visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <div className="w-80 h-80 rounded-full border border-electric-teal/10 absolute animate-pulse" />
        <div className="w-60 h-60 rounded-full border border-electric-teal/20 absolute animate-pulse" style={{animationDelay: '0.5s'}} />
        <div className="w-40 h-40 rounded-full border border-electric-teal/30 absolute animate-pulse" style={{animationDelay: '1s'}} />
        <div className="w-20 h-20 rounded-full border border-electric-teal/40 absolute animate-pulse" style={{animationDelay: '1.5s'}} />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Set your preferences</h2>
        <p className="text-cool-slate">Customize how your brief works for you.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-ice-grey">High-priority contacts</Label>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <div
                key={priority.id}
                className={`preference-chip flex items-center gap-2 ${selectedPriorities.includes(priority.id) ? 'selected' : ''}`}
                onClick={() => togglePriority(priority.id)}
              >
                <div className="w-6 h-6 rounded-full bg-deep-plum/50 flex items-center justify-center text-xs font-medium text-electric-teal">
                  {priority.avatar}
                </div>
                <span className="text-ice-grey">{priority.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-ice-grey">Ignore keywords/channels</Label>
          <div className="flex gap-2">
            <Input
              value={ignoreKeyword}
              onChange={(e) => setIgnoreKeyword(e.target.value)}
              placeholder="Add keywords to ignore"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey placeholder:text-cool-slate/70 focus-visible:ring-electric-teal"
            />
            <Button 
              onClick={addKeyword}
              variant="outline"
              className="border-cool-slate/20 text-ice-grey hover:bg-deep-plum/30 hover:text-electric-teal"
            >
              Add
            </Button>
          </div>
          {ignoreKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {ignoreKeywords.map(keyword => (
                <div key={keyword} className="flex items-center gap-1 px-3 py-1 rounded-full bg-deep-plum/30 border border-electric-teal/20 text-sm text-ice-grey">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Label className="text-ice-grey">Delivery method</Label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              className={`delivery-card ${deliveryMethod === 'email' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('email')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-deep-plum/50 flex items-center justify-center text-electric-teal">
                  ✉️
                </div>
                <span className="font-medium text-ice-grey">Email</span>
              </div>
            </div>
            <div 
              className={`delivery-card ${deliveryMethod === 'audio' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('audio')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-deep-plum/50 flex items-center justify-center text-electric-teal">
                  🎧
                </div>
                <span className="font-medium text-ice-grey">Audio</span>
              </div>
            </div>
            <div 
              className={`delivery-card ${deliveryMethod === 'both' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('both')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-deep-plum/50 flex items-center justify-center text-electric-teal">
                  ⚡
                </div>
                <span className="font-medium text-ice-grey">Both</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-ice-grey">Schedule your briefs</Label>
          <p className="text-sm text-cool-slate -mt-1">Select when you'd like to receive your briefs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {/* Morning schedule option */}
            <div 
              className={`schedule-card flex flex-col items-center justify-center p-6 rounded-xl border transition-all cursor-pointer
                ${selectedTimes.includes('morning') 
                  ? 'border-electric-teal bg-deep-teal/30 shadow-glow' 
                  : 'border-cool-slate/20 bg-deep-teal/10 hover:bg-deep-teal/20'
                }`}
              onClick={() => toggleTimeSelection('morning')}
            >
              <div className="relative h-14 w-full flex items-center justify-center">
                <Sun size={28} className="text-electric-teal" />
                <div className="absolute right-1 top-1">
                  <Checkbox 
                    checked={selectedTimes.includes('morning')}
                    className="data-[state=checked]:bg-electric-teal data-[state=checked]:border-electric-teal"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium text-ice-grey mt-2">Morning</h3>
              <p className="text-cool-slate mt-1">8:00 AM</p>
            </div>
            
            {/* Midday schedule option */}
            <div 
              className={`schedule-card flex flex-col items-center justify-center p-6 rounded-xl border transition-all cursor-pointer
                ${selectedTimes.includes('midday') 
                  ? 'border-electric-teal bg-deep-teal/30 shadow-glow' 
                  : 'border-cool-slate/20 bg-deep-teal/10 hover:bg-deep-teal/20'
                }`}
              onClick={() => toggleTimeSelection('midday')}
            >
              <div className="relative h-14 w-full flex items-center justify-center">
                <Coffee size={28} className="text-electric-teal" />
                <div className="absolute right-1 top-1">
                  <Checkbox 
                    checked={selectedTimes.includes('midday')}
                    className="data-[state=checked]:bg-electric-teal data-[state=checked]:border-electric-teal"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium text-ice-grey mt-2">Midday</h3>
              <p className="text-cool-slate mt-1">12:00 PM</p>
            </div>
            
            {/* Evening schedule option */}
            <div 
              className={`schedule-card flex flex-col items-center justify-center p-6 rounded-xl border transition-all cursor-pointer
                ${selectedTimes.includes('evening') 
                  ? 'border-electric-teal bg-deep-teal/30 shadow-glow' 
                  : 'border-cool-slate/20 bg-deep-teal/10 hover:bg-deep-teal/20'
                }`}
              onClick={() => toggleTimeSelection('evening')}
            >
              <div className="relative h-14 w-full flex items-center justify-center">
                <Moon size={28} className="text-electric-teal" />
                <div className="absolute right-1 top-1">
                  <Checkbox 
                    checked={selectedTimes.includes('evening')}
                    className="data-[state=checked]:bg-electric-teal data-[state=checked]:border-electric-teal"
                  />
                </div>
              </div>
              <h3 className="text-lg font-medium text-ice-grey mt-2">Evening</h3>
              <p className="text-cool-slate mt-1">5:00 PM</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="brief-time" className="text-ice-grey">Custom time (optional)</Label>
          <Input
            id="brief-time"
            type="time"
            value={briefTime}
            onChange={(e) => setBriefTime(e.target.value)}
            className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey focus-visible:ring-electric-teal max-w-xs"
          />
          <p className="text-sm text-cool-slate">You can set a custom time in addition to the scheduled times.</p>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          onClick={onBack} 
          variant="back"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="primary"
          size="pill"
        >
          Generate my first brief
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant="link" 
          onClick={onNext} 
          className="text-sm text-cool-slate hover:text-ice-grey"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;
