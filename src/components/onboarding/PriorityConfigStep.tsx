import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { User, Hash, Tag, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityContact {
  type: "person" | "channel" | "topic";
  value: string;
}

interface PriorityConfigStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: string[];
    priorityChannels: string[];
    priorityTopics: string[];
    [key: string]: any;
  };
}

const PriorityConfigStep = ({ onNext, onBack, updateUserData, userData }: PriorityConfigStepProps) => {
  const [selectedTab, setSelectedTab] = useState<"person" | "channel" | "topic">("person");
  const [inputValue, setInputValue] = useState("");
  
  const [priorityPeople, setPriorityPeople] = useState<string[]>(userData.priorityPeople || []);
  const [priorityChannels, setPriorityChannels] = useState<string[]>(userData.priorityChannels || []);
  const [priorityTopics, setPriorityTopics] = useState<string[]>(userData.priorityTopics || []);
  
  const addItem = () => {
    if (!inputValue.trim()) return;
    
    if (selectedTab === "person") {
      setPriorityPeople(prev => [...prev, inputValue.trim()]);
    } else if (selectedTab === "channel") {
      setPriorityChannels(prev => [...prev, inputValue.trim()]);
    } else if (selectedTab === "topic") {
      setPriorityTopics(prev => [...prev, inputValue.trim()]);
    }
    
    setInputValue("");
  };
  
  const removeItem = (type: "person" | "channel" | "topic", value: string) => {
    if (type === "person") {
      setPriorityPeople(prev => prev.filter(item => item !== value));
    } else if (type === "channel") {
      setPriorityChannels(prev => prev.filter(item => item !== value));
    } else if (type === "topic") {
      setPriorityTopics(prev => prev.filter(item => item !== value));
    }
  };
  
  const handleContinue = () => {
    updateUserData({
      priorityPeople,
      priorityChannels,
      priorityTopics
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={4} totalSteps={7} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Set your high-priority items</h2>
        <p className="text-cool-slate">Tell us what's most important to you. We'll make sure you never miss updates from these sources.</p>
      </div>
      
      <div className="flex border-b border-cool-slate/20">
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "person" ? "text-electric-teal" : "text-cool-slate hover:text-ice-grey"
          )}
          onClick={() => setSelectedTab("person")}
        >
          <div className="flex items-center gap-2">
            <User size={16} />
            <span>People</span>
          </div>
          {selectedTab === "person" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric-teal" />
          )}
        </button>
        
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "channel" ? "text-electric-teal" : "text-cool-slate hover:text-ice-grey"
          )}
          onClick={() => setSelectedTab("channel")}
        >
          <div className="flex items-center gap-2">
            <Hash size={16} />
            <span>Channels</span>
          </div>
          {selectedTab === "channel" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric-teal" />
          )}
        </button>
        
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "topic" ? "text-electric-teal" : "text-cool-slate hover:text-ice-grey"
          )}
          onClick={() => setSelectedTab("topic")}
        >
          <div className="flex items-center gap-2">
            <Tag size={16} />
            <span>Topics</span>
          </div>
          {selectedTab === "topic" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-electric-teal" />
          )}
        </button>
      </div>
      
      <div className="space-y-6">
        {selectedTab === "person" && (
          <div className="space-y-3">
            <Label htmlFor="priority-person" className="text-ice-grey">Add important people</Label>
            <p className="text-sm text-cool-slate -mt-1">
              We'll prioritize messages from these people (like your boss, spouse, or team members).
            </p>
            <div className="flex gap-2">
              <Input
                id="priority-person"
                placeholder="Enter name or email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey"
              />
              <Button 
                onClick={addItem}
                variant="outline"
                className="shrink-0"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
            
            {priorityPeople.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {priorityPeople.map(person => (
                  <div key={person} className="flex items-center gap-1 px-3 py-1 rounded-full bg-deep-plum/30 border border-electric-teal/20 text-sm text-ice-grey">
                    <User size={14} className="text-electric-teal" />
                    {person}
                    <button onClick={() => removeItem("person", person)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === "channel" && (
          <div className="space-y-3">
            <Label htmlFor="priority-channel" className="text-ice-grey">Add important channels</Label>
            <p className="text-sm text-cool-slate -mt-1">
              We'll highlight updates from critical Slack channels or email folders.
            </p>
            <div className="flex gap-2">
              <Input
                id="priority-channel"
                placeholder="Enter channel name (e.g. #alerts)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey"
              />
              <Button 
                onClick={addItem}
                variant="outline"
                className="shrink-0"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
            
            {priorityChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {priorityChannels.map(channel => (
                  <div key={channel} className="flex items-center gap-1 px-3 py-1 rounded-full bg-deep-plum/30 border border-electric-teal/20 text-sm text-ice-grey">
                    <Hash size={14} className="text-electric-teal" />
                    {channel}
                    <button onClick={() => removeItem("channel", channel)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === "topic" && (
          <div className="space-y-3">
            <Label htmlFor="priority-topic" className="text-ice-grey">Add important topics</Label>
            <p className="text-sm text-cool-slate -mt-1">
              We'll flag any messages containing these keywords (like "urgent", "site down", or project names).
            </p>
            <div className="flex gap-2">
              <Input
                id="priority-topic"
                placeholder="Enter keyword or topic"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey"
              />
              <Button 
                onClick={addItem}
                variant="outline"
                className="shrink-0"
              >
                <Plus size={16} />
                Add
              </Button>
            </div>
            
            {priorityTopics.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {priorityTopics.map(topic => (
                  <div key={topic} className="flex items-center gap-1 px-3 py-1 rounded-full bg-deep-plum/30 border border-electric-teal/20 text-sm text-ice-grey">
                    <Tag size={14} className="text-electric-teal" />
                    {topic}
                    <button onClick={() => removeItem("topic", topic)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="back"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="pill"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityConfigStep;
