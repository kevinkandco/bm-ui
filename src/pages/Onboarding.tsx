
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingLayout from "@/components/onboarding/OnboardingLayout";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import PurposeStep from "@/components/onboarding/PurposeStep";
import IntegrationsStep from "@/components/onboarding/IntegrationsStep";
import PriorityContactsStep from "@/components/onboarding/PriorityContactsStep";
import DeliveryPreferencesStep from "@/components/onboarding/DeliveryPreferencesStep";
import FinalizeSetupStep from "@/components/onboarding/FinalizeSetupStep";
import SuccessModal from "@/components/onboarding/SuccessModal";

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userData, setUserData] = useState({
    purpose: "",
    integrations: [],
    priorityContacts: [],
    deliveryMethod: "email",
    briefTime: "08:00",
    ignoreKeywords: []
  });
  
  const totalSteps = 6;
  
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
          {currentStep === 1 && <WelcomeStep onNext={handleNext} />}
          {currentStep === 2 && <PurposeStep 
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
          {currentStep === 4 && <PriorityContactsStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          {currentStep === 5 && <DeliveryPreferencesStep 
            onNext={handleNext} 
            onBack={handleBack}
            updateUserData={updateUserData}
            userData={userData}
          />}
          {currentStep === 6 && <FinalizeSetupStep 
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
