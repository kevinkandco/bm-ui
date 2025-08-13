
import { useState, useCallback, useMemo } from 'react';

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
  
  // Interrupt rules
  interruptRules: {
    contacts: any[];
    keywords: string[];
    systemAlerts: string[];
  };
  
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
  
  // Weekend brief preferences
  weekendBrief: {
    enabled: boolean;
    deliveryMethod: "email" | "audio" | "both";
    deliveryTime: string;
    weekendDays: string[];
    coveragePeriod: {
      startDay: string;
      startTime: string;
      endDay: string;
      endTime: string;
    };
  };
  
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
  
  // Interrupt rules
  interruptRules: {
    contacts: [],
    keywords: [],
    systemAlerts: []
  },
  
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
  
  // Weekend brief preferences
  weekendBrief: {
    enabled: false,
    deliveryMethod: "email",
    deliveryTime: "09:00",
    weekendDays: ["Monday"],
    coveragePeriod: {
      startDay: "Friday",
      startTime: "17:00",
      endDay: "Monday",
      endTime: "09:00"
    }
  },
  
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
  
  // Updated to include interrupt rules step
  const totalSteps = 10;
  
  // This function maps the UI step (1-based) to the actual progress step (0-based)
  // where step 1 is the FeaturesWalkthroughStep (after sign in)
  const getProgressStep = useCallback((uiStep: number) => {
    // First step (sign in) doesn't count in the progress
    return uiStep === 1 ? 0 : uiStep - 1;
  }, []);
  
  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  }, []);
  
  const handleNext = useCallback(() => {
    setCurrentStep(prev => {
      const nextStep = prev + 1;
      if (nextStep <= totalSteps + 1) { // +1 because we have an extra step (sign-in)
        window.scrollTo(0, 0);
        return nextStep;
      } else {
        setShowSuccess(true);
        return prev;
      }
    });
  }, [totalSteps]);
  
  const handleBack = useCallback(() => {
    setCurrentStep(prev => {
      if (prev > 1) {
        window.scrollTo(0, 0);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleSkip = useCallback(() => {
    // Skip to final step
    setCurrentStep(totalSteps + 1); // +1 because we have an extra step (sign-in)
  }, [totalSteps]);

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
