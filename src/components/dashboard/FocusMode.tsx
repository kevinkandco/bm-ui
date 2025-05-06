
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
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Monitor, Wifi, X } from "lucide-react";

interface FocusModeProps {
  open: boolean;
  onClose: () => void;
}

const FocusMode = ({ open, onClose }: FocusModeProps) => {
  const { toast } = useToast();
  const [focusTime, setFocusTime] = useState(30);
  const [options, setOptions] = useState({
    updateStatus: true,
    closeApps: false,
    monitorNotifications: true,
    enableDnd: true
  });

  const handleOptionChange = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleStartFocus = () => {
    toast({
      title: "Focus Mode Activated",
      description: `Focus mode activated for ${focusTime} minutes`
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white/75 backdrop-blur-md border border-white/30 shadow-md max-w-md">
        <DialogHeader>
          <DialogTitle className="text-deep-teal flex items-center">
            <Headphones className="mr-2 h-5 w-5 text-glass-blue" />
            Focus Mode
          </DialogTitle>
          <DialogDescription className="text-deep-teal/70">
            Minimize distractions and focus on what matters most
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-white/50 rounded-lg border border-white/40 p-4">
            <h4 className="text-sm font-medium text-deep-teal mb-2">Focus Duration</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-deep-teal/70">Time: {focusTime} minutes</span>
                <div className="flex gap-2">
                  {[25, 50, 90].map(time => (
                    <Button 
                      key={time} 
                      variant="outline"
                      size="sm"
                      className={focusTime === time ? "bg-glass-blue text-white border-glass-blue" : ""}
                      onClick={() => setFocusTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <Slider
                value={[focusTime]}
                min={5}
                max={120}
                step={5}
                onValueChange={(value) => setFocusTime(value[0])}
                className="py-2"
              />
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-deep-teal">Options</h4>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/40">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-glass-blue" />
                <Label htmlFor="update-status">Update status on connected apps</Label>
              </div>
              <Switch 
                id="update-status"
                checked={options.updateStatus}
                onCheckedChange={() => handleOptionChange("updateStatus")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/40">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-glass-blue" />
                <Label htmlFor="close-apps">Close distracting applications</Label>
              </div>
              <Switch 
                id="close-apps"
                checked={options.closeApps}
                onCheckedChange={() => handleOptionChange("closeApps")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/40">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-glass-blue" />
                <Label htmlFor="enable-dnd">Enable Do Not Disturb</Label>
              </div>
              <Switch 
                id="enable-dnd"
                checked={options.enableDnd}
                onCheckedChange={() => handleOptionChange("enableDnd")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/40">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-glass-blue" />
                <Label htmlFor="monitor-notifs">Continue monitoring for urgent messages</Label>
              </div>
              <Switch 
                id="monitor-notifs"
                checked={options.monitorNotifications}
                onCheckedChange={() => handleOptionChange("monitorNotifications")}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="shadow-sm">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleStartFocus} className="shadow-sm">
            <Headphones className="mr-2 h-4 w-4" /> Start Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusMode;
