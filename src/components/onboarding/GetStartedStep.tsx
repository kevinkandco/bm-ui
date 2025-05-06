
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Download, Smartphone, ChevronsRight, Sparkles, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface GetStartedStepProps {
  onNext: () => void;
  onBack: () => void;
  userData: {
    dailySchedule?: {
      workdayStart: string;
      workdayEnd: string;
      weekendMode: boolean;
    };
    [key: string]: any;
  };
}

const GetStartedStep = ({
  onNext,
  onBack,
  userData
}: GetStartedStepProps) => {
  // Format time string to readable format (e.g., "09:00" to "9:00 AM")
  const formatTimeString = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (e) {
      return timeStr;
    }
  };

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

    // Brief schedules
    const briefSchedules = userData.briefSchedules || [];
    if (briefSchedules.length > 0) {
      sections.push({
        title: "Brief Schedules",
        value: briefSchedules.length.toString(),
        detail: briefSchedules.map((brief: any) => brief.name).join(", ")
      });
    }

    // Daily schedule
    if (userData.dailySchedule) {
      sections.push({
        title: "Daily Schedule",
        value: `${formatTimeString(userData.dailySchedule.workdayStart)} - ${formatTimeString(userData.dailySchedule.workdayEnd)}`,
        detail: userData.dailySchedule.weekendMode ? "Including weekends" : "Weekdays only"
      });
    }
    
    return sections;
  };
  
  const summaryData = formatSummary();
  
  return <div className="space-y-6">
      <ProgressIndicator currentStep={9} totalSteps={9} />
      
      {/* Visual element with reduced height */}
      <div className="relative h-16 w-full flex items-center justify-center overflow-hidden mb-2">
        <Sparkles size={40} className="text-electric-teal animate-float" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-off-white tracking-tighter">You're all set!</h2>
        <p className="text-off-white/90">Your Brief.me account is ready to go. Here's how to get the most out of it.</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-off-white">Your Brief Setup</h3>
          
          <div className="border border-white/30 rounded-lg divide-y divide-white/20 bg-white/15 backdrop-blur-sm">
            {summaryData.map((section, index) => <div key={index} className="flex justify-between px-4 py-3">
                <span className="text-off-white/90">{section.title}</span>
                <div className="text-right">
                  <span className="text-off-white font-medium">{section.value}</span>
                  {section.detail && <p className="text-xs text-off-white/80 mt-0.5">{section.detail}</p>}
                </div>
              </div>)}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-off-white">Get the full experience</h3>
          
          <div className="border border-white/30 rounded-lg divide-y divide-white/20 bg-white/15 backdrop-blur-sm">
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center gap-2">
                <Download className="h-6 w-6 text-electric-teal" />
                <div>
                  <span className="text-off-white">Desktop App</span>
                  <p className="text-xs text-off-white/80">Get desktop notifications and quick access</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="neon-outline-button text-xs">
                Download
              </Button>
            </div>
            
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-6 w-6 text-electric-teal" />
                <div>
                  <span className="text-off-white">Mobile App</span>
                  <p className="text-xs text-off-white/80">Listen to briefs on the go</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="neon-outline-button text-xs">iOS</Button>
                <Button variant="outline" size="sm" className="neon-outline-button text-xs">Android</Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-off-white/80 text-center">
            You can always download these apps later from your dashboard
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-3">
        <Button 
          onClick={onBack} 
          variant="plain"
          size="none"
        >
          Back
        </Button>
        <Button onClick={onNext} className="neon-button">
          Go to Dashboard <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>;
};

export default GetStartedStep;
