
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, X } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

interface UpdateScheduleModalProps {
  open: boolean;
  onClose: () => void;
}

const UpdateScheduleModal = ({ open, onClose }: UpdateScheduleModalProps) => {
  const { toast } = useToast();
  const [scheduleType, setScheduleType] = useState<"auto" | "custom">("auto");
  const [days, setDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: false,
    sunday: false
  });
  const [times, setTimes] = useState({
    morning: true,
    midday: true,
    evening: false
  });

  const handleSaveSchedule = () => {
    toast({
      title: "Schedule Updated",
      description: "Your brief schedule has been updated successfully"
    });
    
    onClose();
  };

  const toggleDay = (day: keyof typeof days) => {
    setDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  const toggleTime = (time: keyof typeof times) => {
    setTimes(prev => ({ ...prev, [time]: !prev[time] }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-400" />
            Update Brief Schedule
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Customize when you receive your briefings
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <RadioGroup 
            defaultValue="auto" 
            value={scheduleType}
            onValueChange={(value) => setScheduleType(value as "auto" | "custom")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label htmlFor="auto" className="text-white">Use AI-recommended schedule</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="custom" id="custom" />
              <Label htmlFor="custom" className="text-white">Set custom schedule</Label>
            </div>
          </RadioGroup>
          
          {scheduleType === "custom" && (
            <div className="space-y-4 pt-2">
              <div className="bg-white/10 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-white mb-3">Days</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(days).map(([day, isActive]) => (
                    <div key={day} className="flex items-center justify-between">
                      <Label htmlFor={`day-${day}`} className="text-white capitalize">
                        {day}
                      </Label>
                      <Switch 
                        id={`day-${day}`}
                        checked={isActive}
                        onCheckedChange={() => toggleDay(day as keyof typeof days)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/10 rounded-lg border border-white/10 p-4">
                <h4 className="text-sm font-medium text-white mb-3">Times</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-morning" className="text-white">Morning Brief</Label>
                      <p className="text-xs text-white/60">Delivered at 8:00 AM</p>
                    </div>
                    <Switch 
                      id="time-morning"
                      checked={times.morning}
                      onCheckedChange={() => toggleTime("morning")}
                    />
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-midday" className="text-white">Midday Brief</Label>
                      <p className="text-xs text-white/60">Delivered at 12:30 PM</p>
                    </div>
                    <Switch 
                      id="time-midday"
                      checked={times.midday}
                      onCheckedChange={() => toggleTime("midday")}
                    />
                  </div>
                  
                  <Separator className="bg-white/10" />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="time-evening" className="text-white">Evening Brief</Label>
                      <p className="text-xs text-white/60">Delivered at 6:00 PM</p>
                    </div>
                    <Switch 
                      id="time-evening"
                      checked={times.evening}
                      onCheckedChange={() => toggleTime("evening")}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSaveSchedule} className="bg-blue-600 text-white hover:bg-blue-700">
            <Clock className="mr-2 h-4 w-4" /> Save Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateScheduleModal;
