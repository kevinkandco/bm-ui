
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface SuccessModalProps {
  onComplete: () => void;
}

const SuccessModal = ({ onComplete }: SuccessModalProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    toast({
      title: "Onboarding Complete!",
      description: "Your Brief.me account is ready to use",
    });
    
    // Create confetti effect
    const createConfetti = () => {
      const colors = ["#3B3BFF", "#9b87f5", "#3B83F5"];
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.className = "absolute h-3 w-3 rounded-full animate-confetti";
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + "%";
        confetti.style.animationDuration = (Math.random() * 1 + 1) + "s";
        confetti.style.animationDelay = Math.random() * 0.5 + "s";
        document.getElementById("confetti-container")?.appendChild(confetti);
        
        // Remove the element after animation completes
        setTimeout(() => confetti.remove(), 2000);
      }
    };
    
    createConfetti();
  }, []);
  
  const handleViewDashboard = () => {
    navigate("/dashboard");
    onComplete();
  };
  
  return (
    <div className="text-center relative">
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-indigo/10 mb-6">
        <CheckCircle className="h-10 w-10 text-indigo" />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
      
      <p className="text-neutral-gray mb-6">
        Your first brief lands in <span className="inline-flex items-center font-medium text-indigo">
          <Sparkles className="h-4 w-4 mr-1" />30 minutes
        </span>
      </p>
      
      <Button 
        onClick={handleViewDashboard}
        className="w-full py-6"
      >
        View Dashboard
      </Button>
    </div>
  );
};

export default SuccessModal;
