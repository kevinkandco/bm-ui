
import { useState } from 'react';

export interface UserData {
  // Auth data
  isSignedIn: boolean;
  authProvider: string;
  
  // User preferences 
  priorityPeople: any[];
  priorityChannels: string[];
  priorityTopics: string[];
  
  // Ignore settings
  ignoreChannels: string[];
  ignoreKeywords: string[];
  includeIgnoredInSummary: boolean;
  
  // Brief preferences
  briefSchedules: {
    id: string;
    name: string;
    deliveryMethod: "email" | "audio" | "both";
    scheduleTime: "morning" | "midday" | "evening" | "custom";
    briefTime: string;
    enabled: boolean;
    days: string[];
  }[];
  
  // Daily schedule
  dailySchedule: {
    workdayStart: string;
    workdayEnd: string;
    weekendMode: boolean;
  };
  
  // Connected integrations
  integrations: any[];
  [key: string]: any;
}

export const defaultUserData: UserData = {
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
  
  // Brief preferences
  briefSchedules: [
    {
      id: "default",
      name: "Daily Brief",
      deliveryMethod: "email",
      scheduleTime: "morning",
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
};

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  
  // The sign-in step is no longer counted in the total steps
  const totalSteps = 8;
  
  // This function maps the UI step (1-based) to the actual progress step (0-based)
  // where step 1 is the FeaturesWalkthroughStep (after sign in)
  const getProgressStep = (uiStep: number) => {
    // First step (sign in) doesn't count in the progress
    return uiStep === 1 ? 0 : uiStep - 1;
  };
  
  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };
  
  const handleNext = () => {
    if (currentStep < totalSteps + 1) { // +1 because we have an extra step (sign-in)
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

  const handleSkip = () => {
    // Skip to final step
    setCurrentStep(totalSteps + 1); // +1 because we have an extra step (sign-in)
  };

  return {
    currentStep,
    setCurrentStep,
    showSuccess,
    setShowSuccess,
    userData,
    updateUserData,
    totalSteps,
    getProgressStep,
    handleNext,
    handleBack,
    handleSkip
  };
}
