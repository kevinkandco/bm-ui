import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Download, Smartphone, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
interface GetStartedStepProps {
  onNext: () => void;
  onBack: () => void;
  userData: {
    [key: string]: any;
  };
}
const GetStartedStep = ({
  onNext,
  onBack,
  userData
}: GetStartedStepProps) => {
  // Function to format data for the summary
  const formatSummary = () => {
    const sections = [];

    // Connected integrations
    const integrations = userData.integrations || [];
    if (integrations.length > 0) {
      sections.push({
        title: "Connected Tools",
        value: integrations.length.toString(),
        detail: integrations.join(", ")
      });
    }

    // Priority items
    const priorityPeople = userData.priorityPeople || [];
    const priorityChannels = userData.priorityChannels || [];
    const priorityTopics = userData.priorityTopics || [];
    const totalPriorities = priorityPeople.length + priorityChannels.length + priorityTopics.length;
    if (totalPriorities > 0) {
      sections.push({
        title: "Priority Items",
        value: totalPriorities.toString(),
        detail: `${priorityPeople.length} people, ${priorityChannels.length} channels, ${priorityTopics.length} topics`
      });
    }

    // Ignored items
    const ignoreChannels = userData.ignoreChannels || [];
    const ignoreKeywords = userData.ignoreKeywords || [];
    const totalIgnored = ignoreChannels.length + ignoreKeywords.length;
    if (totalIgnored > 0) {
      sections.push({
        title: "Ignored Items",
        value: totalIgnored.toString(),
        detail: `${ignoreChannels.length} channels, ${ignoreKeywords.length} keywords`
      });
    }

    // Brief preferences
    if (userData.deliveryMethod) {
      sections.push({
        title: "Delivery Method",
        value: userData.deliveryMethod.charAt(0).toUpperCase() + userData.deliveryMethod.slice(1)
      });
    }
    if (userData.scheduleTime) {
      sections.push({
        title: "Brief Schedule",
        value: userData.scheduleTime.charAt(0).toUpperCase() + userData.scheduleTime.slice(1),
        detail: userData.briefTime
      });
    }
    return sections;
  };
  const summaryData = formatSummary();
  return <div className="space-y-8">
      <ProgressIndicator currentStep={7} totalSteps={7} />
      
      {/* Visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <Sparkles size={48} className="text-electric-teal animate-float" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">You're all set!</h2>
        <p className="text-cool-slate text-zinc-50">Your Brief.me account is ready to go. Here's how to get the most out of it.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-ice-grey">Your Brief Setup</h3>
          
          <div className="border border-cool-slate/20 rounded-lg divide-y divide-cool-slate/10">
            {summaryData.map((section, index) => <div key={index} className="flex justify-between px-4 py-3">
                <span className="text-cool-slate">{section.title}</span>
                <div className="text-right">
                  <span className="text-ice-grey font-medium">{section.value}</span>
                  {section.detail && <p className="text-xs text-cool-slate mt-1">{section.detail}</p>}
                </div>
              </div>)}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-ice-grey">Get the full experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-cool-slate/20 bg-canvas-black/80 space-y-3">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-electric-teal" />
                <h4 className="text-lg font-medium text-ice-grey">Desktop App</h4>
              </div>
              <p className="text-sm text-cool-slate">
                Get desktop notifications and quick access to your briefs from your taskbar.
              </p>
              <Button variant="outline" className="w-full neon-outline-button text-xs">Download Desktop App</Button>
            </div>
            
            <div className="p-5 rounded-xl border border-cool-slate/20 bg-canvas-black/80 space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-electric-teal" />
                <h4 className="text-lg font-medium text-ice-grey">Mobile App</h4>
              </div>
              <p className="text-sm text-cool-slate">
                Listen to your briefs on the go and stay in sync while mobile.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="neon-outline-button text-xs">iOS</Button>
                <Button variant="outline" className="neon-outline-button text-xs">Android</Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-cool-slate text-center pt-2">
            You can always download these apps later from your dashboard
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button onClick={onBack} className="neon-outline-button">
          Back
        </Button>
        <Button onClick={onNext} className="neon-button">
          Go to Dashboard <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>;
};
export default GetStartedStep;