
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Clock, Zap, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface CatchMeUpProps {
  open: boolean;
  onClose: () => void;
  onGenerateSummary: (timeDescription: string) => void;
}

const CatchMeUp = ({ open, onClose, onGenerateSummary }: CatchMeUpProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [timePeriod, setTimePeriod] = useState<"auto" | "custom">("auto");
  const [customHours, setCustomHours] = useState(3);
  const [detectedTime, setDetectedTime] = useState("3 hours");

  useEffect(() => {
    // Simulate detection of offline time
    // In a real app, this would be calculated from last activity
    setDetectedTime("3 hours");
  }, [open]);

  const handleGenerate = () => {
    const timeDescription = timePeriod === "auto" ? detectedTime : `${customHours} hours`;
    
    onGenerateSummary(timeDescription);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto bg-black/80 text-white backdrop-blur-xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Zap className="mr-2 h-5 w-5 text-blue-400" />
            Catch Me Up
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Get a summary of what you've missed while you were away
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-white/10 rounded-lg border border-white/10 p-3 text-white">
            <p className="text-sm">We detected you've been offline for <span className="font-medium text-blue-400">{detectedTime}</span></p>
          </div>
          
          <RadioGroup 
            defaultValue="auto" 
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value as "auto" | "custom")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="text-white">Use detected time ({detectedTime})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-white">Set custom time period</Label>
            </div>
          </RadioGroup>
          
          {timePeriod === "custom" && (
            <div className="space-y-2 pt-2 bg-white/10 rounded-lg border border-white/10 p-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-sm text-white/70">Time period: {customHours} hours</span>
                <div className="flex gap-2 flex-wrap">
                  {[1, 4, 24].map(time => (
                    <Button 
                      key={time} 
                      variant="outline"
                      size="sm"
                      className={`${customHours === time ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : "bg-white/5 text-white/70 border-white/10"} hover:bg-white/10`}
                      onClick={() => setCustomHours(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Slider
                value={[customHours]}
                min={1}
                max={48}
                step={1}
                onValueChange={(value) => setCustomHours(value[0])}
                className="py-2"
              />
            </div>
          )}
        </div>
        
        <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleGenerate} className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
            <Zap className="mr-2 h-4 w-4" /> Generate Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatchMeUp;
