
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Sparkles } from "lucide-react";
import ProgressIndicator from "./ProgressIndicator";

interface FinalizeSetupStepProps {
  onNext: () => void;
  onBack: () => void;
  userData: {
    ignoreKeywords: string[];
    [key: string]: any;
  };
}

const FinalizeSetupStep = ({ onNext, onBack, userData }: FinalizeSetupStepProps) => {
  const [ignoreKeyword, setIgnoreKeyword] = useState("");
  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>(userData.ignoreKeywords || []);
  
  const addKeyword = () => {
    if (!ignoreKeyword.trim()) return;
    setIgnoreKeywords(prev => [...prev, ignoreKeyword.trim()]);
    setIgnoreKeyword("");
  };
  
  const removeKeyword = (keyword: string) => {
    setIgnoreKeywords(prev => prev.filter(k => k !== keyword));
  };

  // Format the user data for summary display
  const formatUserData = () => {
    const sections = [];
    
    if (userData.purpose) {
      sections.push({
        title: "Purpose",
        value: userData.purpose.charAt(0).toUpperCase() + userData.purpose.slice(1)
      });
    }
    
    if (userData.integrations && userData.integrations.length > 0) {
      sections.push({
        title: "Integrations",
        value: userData.integrations.length.toString(),
        detail: userData.integrations.join(", ")
      });
    }
    
    if (userData.priorityContacts && userData.priorityContacts.length > 0) {
      sections.push({
        title: "Priority Contacts",
        value: userData.priorityContacts.length.toString(),
        detail: userData.priorityContacts.map((c: any) => c.name).join(", ")
      });
    }
    
    if (userData.deliveryMethod) {
      sections.push({
        title: "Delivery Method",
        value: userData.deliveryMethod.charAt(0).toUpperCase() + userData.deliveryMethod.slice(1)
      });
    }
    
    if (userData.briefTime) {
      sections.push({
        title: "Daily Brief Time",
        value: userData.briefTime
      });
    }
    
    return sections;
  };

  const summaryData = formatUserData();
  
  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={6} totalSteps={6} />
      
      {/* Visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <Sparkles size={48} className="text-electric-teal animate-float" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Final Touches</h2>
        <p className="text-cool-slate">Almost there! Just a few more details to perfect your brief.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-ice-grey">Hide topics (optional)</Label>
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
          <p className="text-xs text-cool-slate">
            Messages containing these keywords will be excluded from your brief
          </p>
          
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
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-ice-grey">Your Brief Setup</h3>
          
          <div className="border border-cool-slate/20 rounded-lg divide-y divide-cool-slate/10">
            {summaryData.map((section, index) => (
              <div key={index} className="flex justify-between px-4 py-3">
                <span className="text-cool-slate">{section.title}</span>
                <div className="text-right">
                  <span className="text-ice-grey font-medium">{section.value}</span>
                  {section.detail && (
                    <p className="text-xs text-cool-slate mt-1">{section.detail}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-cool-slate text-center">
            You can change these settings at any time from your dashboard
          </p>
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
          onClick={onNext}
          className="neon-button"
        >
          Generate my first brief
        </Button>
      </div>
    </div>
  );
};

export default FinalizeSetupStep;
