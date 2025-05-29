
import { useNavigate } from "react-router-dom";
import { useOnboardingState } from "@/hooks/useOnboardingState";
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
import { memo, useEffect, useCallback } from "react";
import useAuthStore from '@/store/useAuthStore.ts';

// Each step component is memoized to prevent unnecessary re-renders
const OnboardingContent = memo(({ 
  currentStep, 
  showSuccess,
  userData,
  updateUserData,
  handleNext,
  handleBack,
  handleSkip,
  handleComplete,
  totalSteps,
  getProgressStep,
  gotoLogin
}: {
  currentStep: number;
  showSuccess: boolean;
  userData: any;
  updateUserData: (data: any) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSkip: () => void;
  handleComplete: () => void;
  totalSteps: number;
  getProgressStep: (step: number) => number;
  gotoLogin: () => void;
}) => {
  // Scroll to top when step changes for better mobile experience
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep, showSuccess]);
  if (showSuccess) {
    return <SuccessModal onComplete={handleComplete} />;
  }

  // Only render the current step to reduce DOM elements and improve performance
  switch (currentStep) {
    case 1:
      return (
        <SignInStep 
          onNext={handleNext} 
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 2:
      return (
        <FeaturesWalkthroughStep 
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 3:
      return (
        <IntegrationsStep 
          onNext={handleNext} 
          onBack={handleBack} 
          updateUserData={updateUserData}
          userData={userData}
          onSkip={handleSkip}
          gotoLogin={gotoLogin}
        />
      );
    case 4:
      return (
        <PriorityPeopleStep 
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 5:
      return (
        <PriorityChannelsStep 
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 6:
      return (
        <PriorityTopicsStep 
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 7:
      return (
        <IgnoreConfigStep 
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 8:
      return (
        <BriefPreferencesStep
          onNext={handleNext} 
          onBack={handleBack}
          updateUserData={updateUserData}
          userData={userData}
        />
      );
    case 9:
      return (
        <GetStartedStep 
          onNext={handleNext} 
          onBack={handleBack}
          userData={userData}
        />
      );
    default:
      return null;
  }
});

OnboardingContent.displayName = 'OnboardingContent';
const Onboarding = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    showSuccess,
    userData,
    updateUserData,
    handleNext,
    handleBack,
    handleSkip,
    setShowSuccess,
    totalSteps,
    getProgressStep,
    gotoLogin
  } = useOnboardingState();
  
  const handleComplete = useCallback(() => {
    // Navigate to dashboard
    navigate("/dashboard");
  }, [navigate]);

  // Disable body scroll when modals are open for better mobile experience
  useEffect(() => {
    if (showSuccess) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSuccess]);
    const { user } = useAuthStore();
    useEffect(() => {
        if (user?.is_onboard) {
            navigate("/dashboard");
            return;
        }
    }, [user?.is_onboard]);

  return (
    <OnboardingLayout>
      <OnboardingContent 
        currentStep={currentStep}
        showSuccess={showSuccess}
        userData={userData}
        updateUserData={updateUserData}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleComplete={handleComplete}
        totalSteps={totalSteps}
        getProgressStep={getProgressStep}
        gotoLogin={gotoLogin}
      />
    </OnboardingLayout>
  );
};

export default memo(Onboarding);
