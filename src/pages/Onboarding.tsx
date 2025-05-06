
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import SignInStep from "@/components/onboarding/SignInStep";
import FeaturesWalkthroughStep from "@/components/onboarding/FeaturesWalkthroughStep";
import IntegrationsStep from "@/components/onboarding/IntegrationsStep";
import PriorityPeopleStep from "@/components/onboarding/PriorityPeopleStep";
import PriorityChannelsStep from "@/components/onboarding/PriorityChannelsStep";
import PriorityTopicsStep from "@/components/onboarding/PriorityTopicsStep";
import IgnoreConfigStep from "@/components/onboarding/IgnoreConfigStep";
import BriefPreferencesStep from "@/components/onboarding/BriefPreferencesStep";
import GetStartedStep from "@/components/onboarding/GetStartedStep";
import SuccessModal from "@/components/onboarding/SuccessModal";

type DeliveryMethod = "email" | "audio" | "both";
type ScheduleTime = "morning" | "midday" | "evening" | "custom";

interface BriefSchedule {
  id: string;
  name: string;
  deliveryMethod: DeliveryMethod;
  scheduleTime: ScheduleTime;
  briefTime: string;
  enabled: boolean;
  days: string[];
}

interface DailySchedule {
  workdayStart: string;
  workdayEnd: string;
  weekendMode: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState({
    // Auth data
    isSignedIn: false,
    authProvider: "",
    
    // User preferences 
    priorityPeople: [],
    priorityChannels: [],
    priorityTopics: [],
    
    // Ignore settings
    ignoreChannels: [],
    ignoreKeywords: [],
    includeIgnoredInSummary: false,
    
    // Brief preferences - now an array of scheduled briefs
    briefSchedules: [
      {
        id: "default",
        name: "Daily Brief",
        deliveryMethod: "email" as DeliveryMethod,
        scheduleTime: "morning" as ScheduleTime,
        briefTime: "08:00",
        enabled: true,
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      }
    ],
    
    // Daily schedule
    dailySchedule: {
      workdayStart: "09:00",
      workdayEnd: "17:00",
      weekendMode: false
    },
    
    // Connected integrations
    integrations: []
  });
  
  const totalSteps = 9;
  
  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      setShowSuccess(true);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleComplete = () => {
    // Navigate to dashboard (for now redirect to home)
    navigate("/");
  };

  const handleSkip = () => {
    // Skip to final step
    setCurrentStep(totalSteps);
  };

  return (
    <OnboardingLayout>
      {showSuccess ? (
        <SuccessModal onComplete={handleComplete} />
      ) : (
        <>
          {currentStep === 1 && <SignInStep 
            onNext={handleNext} 
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 2 && <FeaturesWalkthroughStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 3 && <IntegrationsStep 
            onNext={handleNext} 
            onBack={handleBack} 
            updateUserData={updateUserData}
            userData={userData}
            onSkip={handleSkip}
          />}
          
          {currentStep === 4 && <PriorityPeopleStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 5 && <PriorityChannelsStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 6 && <PriorityTopicsStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 7 && <IgnoreConfigStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 8 && <BriefPreferencesStep
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          
          {currentStep === 9 && <GetStartedStep 
            onNext={handleNext} 
            onBack={handleBack}
            userData={userData}
          />}
        </>
      )}
    </OnboardingLayout>
  );
};

export default Onboarding;
