import Http from "@/Http";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const BaseURL = import.meta.env.VITE_API_HOST;


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
};

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  console.log(userData, 'rrr');  
  const navigate = useNavigate();
  

  // The sign-in step is no longer counted in the total steps
  const totalSteps = 8;

  // This function maps the UI step (1-based) to the actual progress step (0-based)
  // where step 1 is the FeaturesWalkthroughStep (after sign in)
  const getProgressStep = useCallback((uiStep: number) => {
    // First step (sign in) doesn't count in the progress
    return uiStep === 1 ? 0 : uiStep - 1;
  }, []);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  }, []);

  const handleNext = useCallback( () => {
    setCurrentStep((prev) => {
      const nextStep = prev + 1;
      if (nextStep == 10) {

        try {
              const token = localStorage.getItem("token");
              if (!token) {
                navigate("/");
                return;
              }
              Http.setBearerToken(token);
              const response = Http.callApi("post", `${BaseURL}/api/slack/on-boarding`, { userData }, {
                // headers: {
                //   "ngrok-skip-browser-warning": "true",
                // },
              });
              if (response) { 
                console.log(response, 'response');
                
                // setUserData(response);
              } else {
                console.error("Failed to fetch user data");
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
      }
      if (nextStep <= totalSteps + 1) {
        // +1 because we have an extra step (sign-in)
        window.scrollTo(0, 0);
        return nextStep;
      } else {
        setShowSuccess(true);
        return prev;
      }

      
    });
  }, [totalSteps, userData]);

  const handleBack = useCallback(() => {
    setCurrentStep((prev) => {
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
    handleSkip,
  };
}
