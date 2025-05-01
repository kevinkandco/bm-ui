
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";

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
    <div className="space-y-6">
      <ProgressIndicator currentStep={3} totalSteps={3} />
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Set your preferences</h2>
        <p className="text-neutral-gray">Customize how your brief works for you.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>High-priority contacts</Label>
          <div className="flex flex-wrap gap-2">
            {priorities.map((priority) => (
              <div
                key={priority.id}
                className={`preference-chip flex items-center gap-2 ${selectedPriorities.includes(priority.id) ? 'selected' : ''}`}
                onClick={() => togglePriority(priority.id)}
              >
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium">
                  {priority.avatar}
                </div>
                <span>{priority.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Ignore keywords/channels</Label>
          <div className="flex gap-2">
            <Input
              value={ignoreKeyword}
              onChange={(e) => setIgnoreKeyword(e.target.value)}
              placeholder="Add keywords to ignore"
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
            />
            <Button 
              onClick={addKeyword}
              variant="outline"
            >
              Add
            </Button>
          </div>
          {ignoreKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {ignoreKeywords.map(keyword => (
                <div key={keyword} className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-sm">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 focus:outline-none">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-3">
          <Label>Delivery method</Label>
          <div className="grid grid-cols-3 gap-3">
            <div 
              className={`delivery-card ${deliveryMethod === 'email' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('email')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  ✉️
                </div>
                <span className="font-medium">Email</span>
              </div>
            </div>
            <div 
              className={`delivery-card ${deliveryMethod === 'audio' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('audio')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  🎧
                </div>
                <span className="font-medium">Audio</span>
              </div>
            </div>
            <div 
              className={`delivery-card ${deliveryMethod === 'both' ? 'selected' : ''}`}
              onClick={() => setDeliveryMethod('both')}
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  ⚡
                </div>
                <span className="font-medium">Both</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="brief-time">Send my brief at</Label>
          <Input
            id="brief-time"
            type="time"
            value={briefTime}
            onChange={(e) => setBriefTime(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={onBack}>Back</Button>
        <Button 
          onClick={handleSubmit}
          className="bg-indigo hover:bg-indigo/90 text-white"
        >
          Generate my first brief
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button variant="link" onClick={onNext} className="text-sm text-neutral-gray">
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default PreferencesStep;
