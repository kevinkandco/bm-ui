import { WeekendBrief } from './../components/dashboard/types';
import { BriefSchedules, DailySchedule } from "@/components/dashboard/types";
import { PriorityPerson } from "@/components/onboarding/priority-people/types";
import { ConnectedAccount } from "@/components/settings/types";
import { useState, useCallback, useEffect } from "react";
import { useApi } from "./useApi";

export interface UserData {
  // Auth data
  isSignedIn: boolean;
  authProvider: string;

  // User preferences
  slackPriorityPeople: PriorityPerson[];
  googlePriorityPeople: PriorityPerson[];
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
  briefSchedules: BriefSchedules[];

  // Weekend brief preferences
  weekendBrief: WeekendBrief;
  
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
  slackPriorityPeople: [],
  googlePriorityPeople: [],
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
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
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
  const { call } = useApi();
  const [showSuccess, setShowSuccess] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState<ConnectedAccount[]>([]);
  const [userData, setUserData] = useState<UserData>(() => {
  const token = localStorage.getItem("token");
    const storedData = localStorage.getItem("onboardingUserData");
    return storedData && token !== "null"
      ? (JSON.parse(storedData) as UserData)
      : defaultUserData;
  });
  // The sign-in step is no longer counted in the total steps
  const totalSteps = 9;

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
			let nextStep = prev + 1;

      if (nextStep === 5 && !userData?.integrations?.includes("slack")) {
        nextStep++;
      }

			if (nextStep <= totalSteps + 1) {
				// +1 because we have an extra step
				window.scrollTo(0, 0);
        localStorage.setItem("onboardingCurrentStep", nextStep.toString());
				return nextStep;
			} else {
				setShowSuccess(true);
        // localStorage.removeItem("onboardingCurrentStep");
				return prev;
			}
		});
	}, [userData?.integrations, totalSteps]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
      let nextStep = prev - 1;

      if (nextStep === 5 && !userData?.integrations?.includes("slack")) {
        nextStep--;
      }

      if (nextStep >= 1) {
        window.scrollTo(0, 0);
        localStorage.setItem("onboardingCurrentStep", nextStep.toString());
        return nextStep;
      }
      return prev;
    });
  }, [userData?.integrations]);

  const handleSkip = useCallback(() => {
    // Skip to final step
    localStorage.setItem("onboardingCurrentStep", (totalSteps + 1).toString());
    setCurrentStep(totalSteps + 1); // +1 because we have an extra step (sign-in)
  }, [totalSteps]);

  const gotoLogin = useCallback(() => {
    localStorage.setItem("onboardingCurrentStep", "1");
    setCurrentStep(1);
  }, []);

  const getIntegrations = useCallback(async (): Promise<void> => {
    const response = await call("get", "/settings/system-integrations", {
      returnOnFailure: false,
    });
  
    if (!response) {
      console.error("Failed to fetch user data");
      // Handle unauthenticated case
      localStorage.removeItem("token");
      gotoLogin();
      return;
    }
  
    if (response?.data) {
      setConnectedAccount(response.data);
      const data = response.data.map((i) => i.provider_name?.toLowerCase());
      setUserData((prev) => ({
        ...prev,
        integrations: data,
      }));
    }
  }, [call, gotoLogin]);
  
  useEffect(() => {
    if(userData?.isSignedIn) getIntegrations();
  }, [getIntegrations, userData?.isSignedIn]);

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
    connectedAccount,
  };
}
