
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
import Http from "@/Http";
import { useNavigate } from "react-router-dom";

const BaseURL = import.meta.env.VITE_API_HOST;

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
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate detection of offline time
    // In a real app, this would be calculated from last activity
    setDetectedTime("3 hours");
  }, [open]);

  const handleGenerate = async () => {
    const timeDescription = timePeriod === "auto" ? detectedTime : `${customHours} hours`;
			try {
				setLoading(true);
				const token = localStorage.getItem("token");
				if (!token) {
					setLoading(false);
					navigate("/");
					return;
				}
				Http.setBearerToken(token);
				const response = await Http.callApi(
					"post",
					`${BaseURL}/api/catch-me`,
          { time_period:  timePeriod === "auto" ? parseInt(detectedTime) : customHours },
          {
            headers: {
                        "ngrok-skip-browser-warning": "true",
                    },
          }
				);
				if (response) {
          // onGenerateSummary(timeDescription);
        // onClose();
        toast({
          title: "Create Summary",
          description:
          response?.data?.message || "Summary generated successfully.",
        });
				} else {
					console.error("Failed to fetch user data");
				}
			} catch (error) {
				console.error("Error fetching user data:", error);
			} finally {
				setLoading(false);
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
