
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ProgressIndicator from "./ProgressIndicator";
import { X, Plus, BellOff, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface IgnoreConfigStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    ignoreChannels: string[];
    ignoreKeywords: string[];
    includeIgnoredInSummary: boolean;
    [key: string]: any;
  };
}

const IgnoreConfigStep = ({ onNext, onBack, updateUserData, userData }: IgnoreConfigStepProps) => {
  const [selectedTab, setSelectedTab] = useState<"channel" | "keyword">("channel");
  const [inputValue, setInputValue] = useState("");
  
  const [ignoreChannels, setIgnoreChannels] = useState<string[]>(userData.ignoreChannels || []);
  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>(userData.ignoreKeywords || []);
  const [includeInSummary, setIncludeInSummary] = useState<boolean>(userData.includeIgnoredInSummary || false);
  
  const addItem = () => {
    if (!inputValue.trim()) return;
    
    if (selectedTab === "channel") {
      setIgnoreChannels(prev => [...prev, inputValue.trim()]);
    } else if (selectedTab === "keyword") {
      setIgnoreKeywords(prev => [...prev, inputValue.trim()]);
    }
    
    setInputValue("");
  };
  
  const removeItem = (type: "channel" | "keyword", value: string) => {
    if (type === "channel") {
      setIgnoreChannels(prev => prev.filter(item => item !== value));
    } else if (type === "keyword") {
      setIgnoreKeywords(prev => prev.filter(item => item !== value));
    }
  };
  
  const handleContinue = () => {
    updateUserData({
      ignoreChannels,
      ignoreKeywords,
      includeIgnoredInSummary: includeInSummary
    });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={5} totalSteps={7} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-off-white tracking-tighter">Configure what to ignore</h2>
        <p className="text-off-white/80">Tell us what to filter out from your briefs to keep them focused on what matters.</p>
      </div>
      
      <div className="flex border-b border-white/20">
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "channel" ? "text-glass-blue" : "text-off-white/70 hover:text-off-white"
          )}
          onClick={() => setSelectedTab("channel")}
        >
          <div className="flex items-center gap-2">
            <Hash size={16} />
            <span>Channels</span>
          </div>
          {selectedTab === "channel" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-glass-blue" />
          )}
        </button>
        
        <button
          className={cn(
            "py-3 px-4 focus:outline-none relative",
            selectedTab === "keyword" ? "text-glass-blue" : "text-off-white/70 hover:text-off-white"
          )}
          onClick={() => setSelectedTab("keyword")}
        >
          <div className="flex items-center gap-2">
            <BellOff size={16} />
            <span>Keywords</span>
          </div>
          {selectedTab === "keyword" && (
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-glass-blue" />
          )}
        </button>
      </div>
      
      <div className="space-y-6">
        {selectedTab === "channel" && (
          <div className="space-y-3">
            <Label htmlFor="ignore-channel" className="text-off-white">Ignore channels</Label>
            <p className="text-sm text-off-white/70 -mt-1">
              We'll exclude these Slack channels or email folders from your brief (like #random or social updates).
            </p>
            <div className="flex gap-2">
              <Input
                id="ignore-channel"
                placeholder="Enter channel name (e.g. #random)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="bg-white/10 border-white/20 text-off-white placeholder:text-off-white/50"
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
            
            {ignoreChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {ignoreChannels.map(channel => (
                  <div key={channel} className="flex items-center gap-1 px-3 py-1 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white">
                    <Hash size={14} className="text-glass-blue/80" />
                    <span className="line-through">{channel}</span>
                    <button onClick={() => removeItem("channel", channel)} className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {selectedTab === "keyword" && (
          <div className="space-y-3">
            <Label htmlFor="ignore-keyword" className="text-off-white">Ignore keywords</Label>
            <p className="text-sm text-off-white/70 -mt-1">
              We'll filter out messages containing these keywords or phrases.
            </p>
            <div className="flex gap-2">
              <Input
                id="ignore-keyword"
                placeholder="Enter keyword to ignore"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
                className="bg-white/10 border-white/20 text-off-white placeholder:text-off-white/50"
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
            
            {ignoreKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {ignoreKeywords.map(keyword => (
                  <div key={keyword} className="flex items-center gap-1 px-3 py-1 rounded-full bg-glass-blue/10 border border-glass-blue/40 text-sm text-off-white">
                    <BellOff size={14} className="text-glass-blue/80" />
                    <span className="line-through">{keyword}</span>
                    <button onClick={() => removeItem("keyword", keyword)} className="ml-1 focus:outline-none text-off-white/70 hover:text-bright-orange">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="include-in-summary"
            checked={includeInSummary}
            onCheckedChange={setIncludeInSummary}
            className="data-[state=checked]:bg-glass-blue"
          />
          <Label htmlFor="include-in-summary" className="text-off-white/80 cursor-pointer">
            Still include ignored items in summaries (but with lower priority)
          </Label>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="plain"
          size="none"
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

export default IgnoreConfigStep;
