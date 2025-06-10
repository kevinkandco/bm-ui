
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ListeningScreen from "@/components/dashboard/ListeningScreen";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!open) return;
    
    setTimeRemaining(initialTimeRemaining);
    
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
  
  const formatTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progress = ((initialTimeRemaining - timeRemaining) / initialTimeRemaining) * 100;
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md bg-background/80 backdrop-blur-xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-white text-xl">
            {title}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <ListeningScreen 
            isListening={true}
            title="Brief-me is listening"
            subtitle="Analyzing your updates and creating your brief..."
          />
          
          {/* Timer and progress bar */}
          <div className="flex flex-col items-center space-y-4 mt-6">
            <div className="text-xl font-semibold text-white">
              {formatTime()}
            </div>
            
            <div className="w-full max-w-xs">
              <div className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                <div 
                  className="h-full bg-primary-teal rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
            
            <Button 
              onClick={onClose}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full mt-4"
            >
              Stop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EndFocusModal;
