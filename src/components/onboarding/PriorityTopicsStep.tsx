
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { Tag, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
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
    <div className="space-y-5 sm:space-y-8">
      <ProgressIndicator currentStep={6} totalSteps={10} />
      
      <div className="space-y-2 sm:space-y-3">
        <h2 className="text-xl sm:text-2xl font-semibold text-off-white tracking-tighter">What topics matter most?</h2>
        <p className="text-xs sm:text-sm text-off-white/70">Add keywords or topics that are important across your communications. We'll flag any messages containing these keywords.</p>
      </div>
      
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="priority-topic" className="text-off-white text-sm">Add important topics</Label>
          <p className="text-xs sm:text-sm text-off-white/70 -mt-1">
            Enter keywords like "urgent", "site down", or specific project names that should be highlighted.
          </p>
          <div className="flex gap-2">
            <Input
              id="priority-topic"
              placeholder="Enter keyword or topic"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTopic()}
              className="bg-white/15 border-white/20 text-off-white placeholder:text-white/50 text-sm"
            />
            <Button 
              onClick={addTopic}
              variant="outline"
              className="shrink-0"
              size={isMobile ? "sm" : "default"}
            >
              <Plus size={isMobile ? 14 : 16} />
              <span className={isMobile ? "ml-1" : "ml-2"}>Add</span>
            </Button>
          </div>
          
          {priorityTopics.length > 0 && (
            <div className="flex flex-wrap gap-1 sm:gap-2 pt-2">
              {priorityTopics.map(topic => (
                <div key={topic} className="flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-xs sm:text-sm text-off-white">
                  <Tag size={isMobile ? 12 : 14} className="text-glass-blue/80" />
                  {topic}
                  <button onClick={() => removeTopic(topic)} className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange">
                    <X size={isMobile ? 12 : 14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Suggested topics section */}
        <div className="space-y-2 sm:space-y-3 pt-1 sm:pt-2">
          <h3 className="text-base sm:text-lg font-medium text-off-white">Common Topics</h3>
          <p className="text-xs sm:text-sm text-off-white/70">
            Click to add these suggested topics to your priority list.
          </p>
          
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {suggestedTopics.map(topic => (
              <button
                key={topic.id}
                onClick={() => addSuggestedTopic(topic)}
                className={cn(
                  "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border text-xs sm:text-sm",
                  priorityTopics.includes(topic.name)
                    ? "bg-glass-blue/10 border-glass-blue/40 text-glass-blue"
                    : "bg-white/10 border-white/20 text-off-white hover:border-white/40"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <Tag size={isMobile ? 10 : 12} />
                  {topic.name}
                </div>
              </button>
            ))}
          </div>
          
          {/* Topics by category - stack vertically on mobile */}
          <div className={`${isMobile ? 'space-y-4' : 'grid grid-cols-1 sm:grid-cols-2 gap-4'} mt-4`}>
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-off-white/80">Priority & Work</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedTopics
                  .filter(t => t.category === "Priority" || t.category === "Work")
                  .map(topic => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs",
                        priorityTopics.includes(topic.name)
                          ? "bg-glass-blue/10 border border-glass-blue/40 text-glass-blue"
                          : "bg-white/10 text-off-white/70 hover:text-off-white"
                      )}
                    >
                      {topic.name}
                    </button>
                  ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs sm:text-sm font-medium text-off-white/80">Technical</h4>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {suggestedTopics
                  .filter(t => t.category === "Technical")
                  .map(topic => (
                    <button
                      key={`cat-${topic.id}`}
                      onClick={() => addSuggestedTopic(topic)}
                      className={cn(
                        "px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs",
                        priorityTopics.includes(topic.name)
                          ? "bg-glass-blue/10 border border-glass-blue/40 text-glass-blue"
                          : "bg-white/10 text-off-white/70 hover:text-off-white"
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
      
      <div className="flex justify-between pt-2 sm:pt-4">
        <Button 
          onClick={onBack} 
          variant="plain"
          size="none"
          className="text-sm"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          variant="primary"
          size="pill"
          className="py-2 sm:py-3 px-4 sm:px-6 text-sm"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityTopicsStep;
