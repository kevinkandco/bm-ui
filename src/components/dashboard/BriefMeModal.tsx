
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
import { Zap, X, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import ListeningScreen from "./ListeningScreen";
import moment from "moment";

interface BriefMeModalProps {
  open: boolean;
  onClose: () => void;
  onGenerateBrief: () => void;
}

const BriefMeModal = ({ 
  open, 
  onClose, 
  onGenerateBrief
}: BriefMeModalProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [timePeriod, setTimePeriod] = useState<"auto" | "custom">("auto");
  const [customHours, setCustomHours] = useState(3);
  const [detectedTime, setDetectedTime] = useState("3 hours");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customStartTime, setCustomStartTime] = useState("09:00");
  const [currentTime] = useState(new Date());
  const [showAnalyzing, setShowAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate detection of offline time
    setDetectedTime("3 hours");
  }, [open]);

  const handleGenerateBrief = () => {
    setShowAnalyzing(true);
    
    // Simulate brief generation process
    setTimeout(() => {
      setShowAnalyzing(false);
      onClose();
      onGenerateBrief();
      
      toast({
        title: "Brief Created",
        description: "Your brief has been generated successfully"
      });
    }, 3000);
  };

    const getPastHours = (date: Date) => {
      const inputDate = moment(date);
      const now = moment();
  
      const diffInHours = now.diff(inputDate, "hours");
      setCustomHours(diffInHours);
      setCustomStartDate(date);
    };
  
    const handleChangeStartTime = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
  
          setCustomStartTime(e.target.value);
          const hourString = moment(e.target.value, "HH:mm").format("HH");
          setCustomHours(Number(hourString));
        }
    };

  if (showAnalyzing) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
          <ListeningScreen
            isListening={true}
            title="brief me is analyzing updates and creating your brief..."
            subtitle="This will just take a moment"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10 ${isMobile ? 'p-4' : 'p-6'}`}>
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
            <div className="space-y-4 pt-2 bg-white/10 rounded-lg border border-white/10 p-3">
              {/* Start Date and Time Selection */}
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label className="text-sm text-white/70">Start Date & Time</Label>
                  <div className="flex gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "flex-1 justify-start text-left font-normal bg-white/5 border-white/20 text-white hover:bg-white/10 text-xs",
                            !customStartDate && "text-white/50"
                          )}
                        >
                          <Calendar className="mr-1 h-3 w-3" />
                          {customStartDate ? format(customStartDate, "MMM d") : "Date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-background/90 border-white/20" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={customStartDate}
                          onSelect={getPastHours}
                          initialFocus
                          className="pointer-events-auto"
                          disabled={[
                            { before: subDays(new Date(), 7)},
                            { after: new Date()},
                          ]}
                        />
                      </PopoverContent>
                    </Popover>
                    <input
                      type="time"
                      value={customStartTime}
                      onChange={(e) => handleChangeStartTime(e)}
                      className="px-2 py-2 bg-white/5 border border-white/20 rounded-md text-white text-xs w-20"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm text-white/70">End Time (Current)</Label>
                  <div className="px-2 py-2 bg-white/5 border border-white/20 rounded-md text-white/70 text-xs">
                    {format(currentTime, "MMM d, yyyy 'at' HH:mm")}
                  </div>
                </div>
                
                <div className="text-center text-white/50 text-xs">
                  or use a preset duration
                </div>
              </div>
              
              {/* Preset Hours Selection */}
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-white/70">Duration: {customHours} hr</span>
                  <div className="flex gap-2">
                    {[1, 4, 24].map(time => (
                      <Button 
                        key={time} 
                        variant="outline"
                        size="sm"
                        className={`flex-1 text-xs ${customHours === time ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : "bg-white/5 text-white/70 border-white/10"} hover:bg-white/10`}
                        onClick={() => setCustomHours(time)}
                      >
                        {time} hr
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
            </div>
          )}
        </div>
        
        <DialogFooter className={isMobile ? "flex-col gap-2" : ""}>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white w-full sm:w-auto">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleGenerateBrief} className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto">
            <Zap className="mr-2 h-4 w-4" /> Generate Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BriefMeModal;
