import { BriefSchedules, DailySchedule } from "@/components/dashboard/types";
import { useState, useCallback, useEffect } from "react";

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
  briefSchedules: BriefSchedules[];

  // Daily schedule
  dailySchedule: DailySchedule;

  // Connected integrations
  integrations: any[];

   // Timezone
  timezone: string;
  
  [key: string]: any;
}

const timezone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;

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
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  ],

  // Daily schedule
  dailySchedule: {
    workdayStart: "09:00",
    workdayEnd: "17:00",
    weekendMode: false,
  },

  // Connected integrations
  integrations: [],

  // Timezone (default to local timezone)
  timezone: timezone === 'Asia/Calcutta' ? 'Asia/Kolkata' : timezone,
};

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState(() => {
  const token = localStorage.getItem("token");
  const storedStep = localStorage.getItem("onboardingCurrentStep");
  return storedStep && token ? parseInt(storedStep, 10) : 1;
});
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  console.log("currentStep in useOnboarding:", currentStep);


  useEffect(() => {
    const storedData = localStorage.getItem("onboardingUserData");
    if (storedData) {
      const parsedData = JSON.parse(storedData) as UserData;
      setUserData(parsedData);
    }
  }, []);

  

  // The sign-in step is no longer counted in the total steps
  const totalSteps = 8;

  // This function maps the UI step (1-based) to the actual progress step (0-based)
  // where step 1 is the FeaturesWalkthroughStep (after sign in)
  const getProgressStep = useCallback((uiStep: number) => {
    // First step (sign in) doesn't count in the progress
    return uiStep === 1 ? 0 : uiStep - 1;
  }, []);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => {
      const updatedData = { ...prev, ...data };
      localStorage.setItem("onboardingUserData", JSON.stringify(updatedData));
      return updatedData;
    });
  }, []);

  const handleNext = useCallback(() => {
		setCurrentStep((prev) => {
			const nextStep = prev + 1;
			if (nextStep <= totalSteps + 1) {
				// +1 because we have an extra step
        console.log("Next step:", nextStep);
				window.scrollTo(0, 0);
        localStorage.setItem("onboardingCurrentStep", nextStep.toString());
				return nextStep;
			} else {
				setShowSuccess(true);
        // localStorage.removeItem("onboardingCurrentStep");
				return prev;
			}
		});
	}, []);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev > 1) {
        window.scrollTo(0, 0);
        localStorage.setItem("onboardingCurrentStep", (prev - 1).toString());
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleSkip = useCallback(() => {
    // Skip to final step
    localStorage.setItem("onboardingCurrentStep", (totalSteps + 1).toString());
    setCurrentStep(totalSteps + 1); // +1 because we have an extra step (sign-in)
  }, [totalSteps]);

  const gotoLogin = useCallback(() => {
    localStorage.setItem("onboardingCurrentStep", "1");
    setCurrentStep(1);
  }, []);

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
    handleSkip,
    gotoLogin,
  };
}
