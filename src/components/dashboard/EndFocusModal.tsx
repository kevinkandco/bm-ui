
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

interface EndFocusModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  timeRemaining?: number;
}

const EndFocusModal = ({ 
  open, 
  onClose, 
  title = "Creating Your Brief", 
  description = "We're preparing a summary of all updates during your focus session", 
  timeRemaining: initialTimeRemaining = 90
}: EndFocusModalProps) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining); // default 90 seconds = 1:30

  useEffect(() => {
    if (!open) return;
    
    // Reset timer when modal opens
    setTimeRemaining(initialTimeRemaining);
    
    // Start countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [open, onClose, initialTimeRemaining]);
  
  // Format time as mm:ss
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progress = ((initialTimeRemaining - timeRemaining) / initialTimeRemaining) * 100;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-black/80 text-white backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-center text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-white/70 text-center">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center py-8 space-y-6">
          <div className="relative flex items-center justify-center">
            <div className="absolute">
              <Loader className="h-12 w-12 text-blue-400 animate-spin" />
            </div>
            <div className="h-32 w-32 rounded-full flex items-center justify-center border-4 border-white/5">
              <span className="text-2xl font-semibold">{formatTime()}</span>
            </div>
          </div>
          
          <div className="w-full max-w-xs">
            <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
          
          <p className="text-sm text-white/70 text-center max-w-xs">
            Your brief will be ready soon. We'll also email you a copy when it's complete.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndFocusModal;
