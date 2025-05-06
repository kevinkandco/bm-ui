
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Tag, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityTopicsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityTopics: string[];
    [key: string]: any;
  };
}

const PriorityTopicsStep = ({ onNext, onBack, updateUserData, userData }: PriorityTopicsStepProps) => {
  const [inputValue, setInputValue] = useState("");
  const [priorityTopics, setPriorityTopics] = useState<string[]>(userData.priorityTopics || []);
  
  // Suggested topics based on common business priorities
  const [suggestedTopics] = useState([
    { id: "t1", name: "urgent", category: "Priority" },
    { id: "t2", name: "site down", category: "Technical" },
    { id: "t3", name: "deadline", category: "Project" },
    { id: "t4", name: "critical", category: "Priority" },
    { id: "t5", name: "meeting", category: "Work" },
    { id: "t6", name: "review", category: "Project" },
    { id: "t7", name: "error", category: "Technical" },
    { id: "t8", name: "issue", category: "Technical" },
    { id: "t9", name: "family", category: "Personal" },
    { id: "t10", name: "weekend", category: "Personal" },
  ]);
  
  const addTopic = () => {
    if (!inputValue.trim()) return;
    
    setPriorityTopics(prev => [...prev, inputValue.trim()]);
    setInputValue("");
  };
  
  const removeTopic = (topic: string) => {
    setPriorityTopics(prev => prev.filter(item => item !== topic));
  };
  
  const addSuggestedTopic = (topic: { name: string }) => {
    // Check if already added to avoid duplicates
    if (!priorityTopics.includes(topic.name)) {
      setPriorityTopics(prev => [...prev, topic.name]);
    }
  };
  
  const handleContinue = () => {
    updateUserData({ priorityTopics });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={6} totalSteps={9} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">What topics matter most?</h2>
        <p className="text-cool-slate">Add keywords or topics that are important across your communications. We'll flag any messages containing these keywords.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="priority-topic" className="text-ice-grey">Add important topics</Label>
          <p className="text-sm text-cool-slate -mt-1">
            Enter keywords like "urgent", "site down", or specific project names that should be highlighted.
          </p>
          <div className="flex gap-2">
            <Input
              id="priority-topic"
              placeholder="Enter keyword or topic"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey"
            />
            <Button 
              onClick={addTopic}
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
                  <button onClick={() => removeTopic(topic)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Suggested topics section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-lg font-medium text-ice-grey">Common Topics</h3>
          <p className="text-sm text-cool-slate">
            Click to add these suggested topics to your priority list.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {suggestedTopics.map(topic => (
              <button
                key={topic.id}
                onClick={() => addSuggestedTopic(topic)}
                className={cn(
                  "px-3 py-1.5 rounded-full border text-sm",
                  priorityTopics.includes(topic.name)
                    ? "bg-deep-plum/40 border-electric-teal/30 text-electric-teal"
                    : "bg-canvas-black/50 border-cool-slate/20 text-ice-grey hover:border-cool-slate/40"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <Tag size={12} />
                  {topic.name}
                </div>
              </button>
            ))}
          </div>
          
          {/* Topics by category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cool-slate">Priority & Work</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics
                  .filter(t => t.category === "Priority" || t.category === "Work")
                  .map(topic => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs",
                        priorityTopics.includes(topic.name)
                          ? "bg-deep-plum/40 border border-electric-teal/30 text-electric-teal"
                          : "bg-deep-plum/20 text-cool-slate hover:text-ice-grey"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-cool-slate">Technical</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics
                  .filter(t => t.category === "Technical")
                  .map(topic => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs",
                        priorityTopics.includes(topic.name)
                          ? "bg-deep-plum/40 border border-electric-teal/30 text-electric-teal"
                          : "bg-deep-plum/20 text-cool-slate hover:text-ice-grey"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            </div>
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

export default PriorityTopicsStep;
