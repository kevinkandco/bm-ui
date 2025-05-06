
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

interface CatchMeUpProps {
  open: boolean;
  onClose: () => void;
}

const CatchMeUp = ({ open, onClose }: CatchMeUpProps) => {
  const { toast } = useToast();
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
    
    toast({
      title: "Catch Me Up Summary",
      description: `Generating summary for the last ${timeDescription}`
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/75 backdrop-blur-md border border-white/30 shadow-md max-w-md">
        <DialogHeader>
          <DialogTitle className="text-deep-teal flex items-center">
            <Zap className="mr-2 h-5 w-5 text-glass-blue" />
            Catch Me Up
          </DialogTitle>
          <DialogDescription className="text-deep-teal/70">
            Get a summary of what you've missed while you were away
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-white/50 rounded-lg border border-white/40 p-4 text-deep-teal">
            <p className="text-sm">We detected you've been offline for <span className="font-medium">{detectedTime}</span></p>
          </div>
          
          <RadioGroup 
            defaultValue="auto" 
            value={timePeriod}
            onValueChange={(value) => setTimePeriod(value as "auto" | "custom")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto">Use detected time ({detectedTime})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom">Set custom time period</Label>
            </div>
          </RadioGroup>
          
          {timePeriod === "custom" && (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between">
                <span className="text-sm text-deep-teal/70">Time period: {customHours} hours</span>
                <div className="flex gap-2">
                  {[1, 4, 24].map(time => (
                    <Button 
                      key={time} 
                      variant="outline"
                      size="sm"
                      className={customHours === time ? "bg-glass-blue text-white border-glass-blue" : ""}
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
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleGenerate}>
            <Zap className="mr-2 h-4 w-4" /> Generate Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatchMeUp;
