
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Download, Smartphone, ChevronsRight, Sparkles, Sunrise, Sunset, Calendar } from "lucide-react";
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
  
  return <div className="space-y-8">
      <ProgressIndicator currentStep={9} totalSteps={9} />
      
      {/* Visual element */}
      <div className="relative h-24 w-full flex items-center justify-center overflow-hidden mb-4">
        <Sparkles size={48} className="text-electric-teal animate-float" />
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-off-white tracking-tighter">You're all set!</h2>
        <p className="text-off-white/90">Your Brief.me account is ready to go. Here's how to get the most out of it.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-off-white">Your Brief Setup</h3>
          
          <div className="border border-white/30 rounded-lg divide-y divide-white/20 bg-white/15 backdrop-blur-sm">
            {summaryData.map((section, index) => <div key={index} className="flex justify-between px-4 py-3">
                <span className="text-off-white/90">{section.title}</span>
                <div className="text-right">
                  <span className="text-off-white font-medium">{section.value}</span>
                  {section.detail && <p className="text-xs text-off-white/80 mt-1">{section.detail}</p>}
                </div>
              </div>)}
          </div>
        </div>

        {/* Daily Schedule Card */}
        {userData.dailySchedule && (
          <div className="p-5 rounded-xl border border-white/30 bg-white/15 backdrop-blur-sm space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-electric-teal" />
              <h4 className="text-lg font-medium text-off-white">Your Daily Schedule</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Sunrise className="text-electric-teal h-5 w-5" />
                <div>
                  <p className="text-xs text-off-white/70">Start</p>
                  <p className="text-off-white">{formatTimeString(userData.dailySchedule.workdayStart)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="text-electric-teal h-5 w-5" />
                <div>
                  <p className="text-xs text-off-white/70">End</p>
                  <p className="text-off-white">{formatTimeString(userData.dailySchedule.workdayEnd)}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-off-white/90">
              {userData.dailySchedule.weekendMode 
                ? "Your briefs will be delivered 7 days a week." 
                : "Your briefs will be delivered on weekdays."}
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-off-white">Get the full experience</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-white/30 bg-white/15 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-electric-teal" />
                <h4 className="text-lg font-medium text-off-white">Desktop App</h4>
              </div>
              <p className="text-sm text-off-white/90">
                Get desktop notifications and quick access to your briefs from your taskbar.
              </p>
              <Button variant="outline" className="w-full neon-outline-button text-xs">Download Desktop App</Button>
            </div>
            
            <div className="p-5 rounded-xl border border-white/30 bg-white/15 backdrop-blur-sm space-y-3">
              <div className="flex items-center gap-3">
                <Smartphone className="h-8 w-8 text-electric-teal" />
                <h4 className="text-lg font-medium text-off-white">Mobile App</h4>
              </div>
              <p className="text-sm text-off-white/90">
                Listen to your briefs on the go and stay in sync while mobile.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="neon-outline-button text-xs">iOS</Button>
                <Button variant="outline" className="neon-outline-button text-xs">Android</Button>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-off-white/80 text-center pt-2">
            You can always download these apps later from your dashboard
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
        <Button onClick={onNext} className="neon-button">
          Go to Dashboard <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>;
};

export default GetStartedStep;
