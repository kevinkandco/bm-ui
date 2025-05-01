
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface SuccessModalProps {
  onComplete: () => void;
}

const SuccessModal = ({ onComplete }: SuccessModalProps) => {
  const { toast } = useToast();
  const [confetti, setConfetti] = useState<Array<{ left: string; delay: string }>>([]);
  
  useEffect(() => {
    // Show toast notification
    toast({
      title: "Success!",
      description: "Your Brief.me account is ready to go!",
    });
    
    // Create confetti effect
    const confettiItems = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 500}ms`,
    }));
    setConfetti(confettiItems);
    
    // Clean up
    return () => {
      setConfetti([]);
    };
  }, [toast]);
  
  return (
    <div className="relative overflow-hidden">
      {/* Confetti animation */}
      {confetti.map((item, index) => (
        <div
          key={index}
          className="absolute w-4 h-4 rounded-full animate-confetti"
          style={{ 
            left: item.left, 
            top: '-10px', 
            animationDelay: item.delay,
            backgroundColor: index % 3 === 0 ? '#3B3BFF' : 
                           index % 3 === 1 ? '#9b87f5' : '#3B83F5'
          }}
        />
      ))}
      
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">All set, Maya!</h2>
          <p className="text-neutral-gray">Your first brief lands in ✨ 15 minutes.</p>
        </div>
        
        <Button 
          onClick={onComplete}
          className="bg-indigo hover:bg-indigo/90 text-white px-8"
        >
          View Dashboard
        </Button>
      </div>
    </div>
  );
};

export default SuccessModal;
