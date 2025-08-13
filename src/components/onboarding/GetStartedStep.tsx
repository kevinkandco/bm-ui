import { Button } from "@/components/ui/button";
import ProgressIndicator from "./ProgressIndicator";
import { Download, Smartphone, ChevronsRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/use-theme";
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
  const {
    theme
  } = useTheme();

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

  // Much darker card background to match image 2
  const cardBgClass = 'bg-black/40 border-white/10';
  const dividerClass = 'divide-white/10';
  return <div className="space-y-4 sm:space-y-6">
      <ProgressIndicator currentStep={8} totalSteps={8} />
      
      {/* Visual element with reduced height */}
      <div className="relative h-12 sm:h-16 w-full flex items-center justify-center overflow-hidden mb-0 sm:mb-2">
        <Sparkles size={32} className="text-accent-primary animate-float" />
      </div>
      
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-text-primary tracking-tighter">You're all set!</h2>
        <p className="text-xs sm:text-sm text-text-secondary">Your Brief me account is ready to go. Here's how to get the most out of it.</p>
      </div>
      
      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-medium text-text-primary">Your Brief Setup</h3>
          
          <div className={`border rounded-lg ${dividerClass} divide-y backdrop-blur-sm ${cardBgClass}`}>
            {summaryData.map((section, index) => <div key={index} className="flex justify-between px-3 sm:px-4 py-2 sm:py-3">
                <span className="text-xs sm:text-sm text-text-secondary">{section.title}</span>
                <div className="text-right">
                  <span className="text-xs sm:text-sm text-text-primary font-medium">{section.value}</span>
                  {section.detail && <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5">{section.detail}</p>}
                </div>
              </div>)}
          </div>
        </div>
        
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-base sm:text-lg font-medium text-text-primary">Get the full experience</h3>
          
          <div className={`border rounded-lg ${dividerClass} divide-y backdrop-blur-sm ${cardBgClass}`}>
            <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2">
                <Download className="h-5 sm:h-6 w-5 sm:w-6 text-accent-primary" />
                <div>
                  <span className="text-xs sm:text-sm text-text-primary">Desktop App</span>
                  <p className="text-[10px] sm:text-xs text-text-secondary">Get desktop notifications and quick access</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-auto">
                Download
              </Button>
            </div>
            
            <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 sm:h-6 w-5 sm:w-6 text-accent-primary" />
                <div>
                  <span className="text-xs sm:text-sm text-text-primary">Mobile App</span>
                  <p className="text-[10px] sm:text-xs text-text-secondary">Listen to briefs on the go</p>
                </div>
              </div>
              <div className="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-auto">iOS</Button>
                <Button variant="outline" size="sm" className="text-[10px] sm:text-xs px-2 sm:px-3 py-1 h-auto">Android</Button>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-text-secondary text-center">
            You can always download these apps later from your dashboard
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-2 sm:pt-3">
        <Button onClick={onBack} variant="ghost" size="none" className="text-sm text-text-secondary hover:text-text-primary">
          Back
        </Button>
        <Button onClick={onNext} variant="glow" size="pill" className="py-2 sm:py-3 px-3 sm:px-4 text-sm">
          Go to Dashboard <ChevronsRight className="ml-1" size={16} />
        </Button>
      </div>
    </div>;
};
export default GetStartedStep;