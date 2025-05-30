
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles } from "lucide-react";

interface SuccessModalProps {
  onComplete: () => void;
}

const SuccessModal = ({ onComplete }: SuccessModalProps) => {
  const navigate = useNavigate();
  
  const handleViewDashboard = () => {
    navigate("/dashboard");
    onComplete();
  };
  
  return (
    <div className="text-center relative py-2 sm:py-4 bg-background/80 backdrop-blur-xl border border-white/10 rounded-lg">
      <div id="confetti-container" className="absolute inset-0 overflow-hidden pointer-events-none" />
      
      <div className="inline-flex items-center justify-center h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-neon-mint/20 mb-4 sm:mb-6">
        <CheckCircle className="h-8 sm:h-10 w-8 sm:w-10 text-neon-mint" />
      </div>
      
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-off-white">You're all set!</h2>
      
      <p className="text-off-white/70 mb-6">
        Your first brief lands in <span className="inline-flex items-center font-medium text-neon-mint">
          <Sparkles className="h-4 w-4 mr-1" />30 minutes
        </span>
      </p>
      
      <Button 
        onClick={handleViewDashboard}
        className="w-full py-5 sm:py-6 rounded-full bg-off-white text-forest-green font-medium hover:scale-[1.03] hover:brightness-105"
      >
        View Dashboard
      </Button>
    </div>
  );
};

export default SuccessModal;
