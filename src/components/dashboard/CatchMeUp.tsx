
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
import { Zap, X, Clock, Calendar } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import moment from "moment";

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
  const [loading, setLoading] = useState(false);
  const { call } = useApi();
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customStartTime, setCustomStartTime] = useState("09:00");
  const [currentTime] = useState(new Date());

  useEffect(() => {
    // Simulate detection of offline time
    // In a real app, this would be calculated from last activity
    setDetectedTime("3 hours");

  }, [open]);

  const handleGenerate = async () => {
    setLoading(true);

    let timeDescription = "";
    
    if (timePeriod === "auto") {
      timeDescription = detectedTime;
    } else {
      if (customStartDate) {
        const endTime = format(currentTime, "HH:mm");
        timeDescription = `${format(customStartDate, "MMM d")} ${customStartTime} - ${format(currentTime, "MMM d")} ${endTime}`;
      } else {
        timeDescription = `${customHours} hours`;
      }
    }
    
    
    const response = await call("post", "/api/catch-me", {
      body: {
        time_period: timePeriod === "auto" ? parseInt(detectedTime) : customHours,
      },
      showToast: true,
      toastTitle: "Generate Summary failed",
      toastDescription: "Summary generation failed. Please try again later.",
      toastVariant: "destructive",
      returnOnFailure: false, // returns null on failure
    });

    setLoading(false);

    if (response) {
      onClose();
      toast({
        title: "Create Summary",
        description:
          response?.message || "Summary generated successfully.",
      });
      onGenerateSummary(timeDescription);
    }
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
                          ]}/>
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
          <Button onClick={handleGenerate} className="bg-blue-600 text-white hover:bg-blue-700 w-full sm:w-auto" disabled={loading}>
            {loading ? (
              <svg aria-hidden="true" className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              ) : <Zap className="mr-2 h-4 w-4" /> 
            }
            Generate Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CatchMeUp;
