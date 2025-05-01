
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import IntegrationsStep from "@/components/onboarding/IntegrationsStep";
import PreferencesStep from "@/components/onboarding/PreferencesStep";
import SuccessModal from "@/components/onboarding/SuccessModal";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSuccess(true);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
  
  const handleComplete = () => {
    // Navigate to dashboard (for now redirect to home)
    navigate("/");
  };

  return (
    <OnboardingLayout>
      {showSuccess ? (
        <SuccessModal onComplete={handleComplete} />
      ) : (
        <>
          {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
          {currentStep === 2 && <IntegrationsStep onNext={handleNext} onBack={handleBack} />}
          {currentStep === 3 && <PreferencesStep onNext={handleNext} onBack={handleBack} />}
        </>
      )}
    </OnboardingLayout>
  );
};

export default Onboarding;
