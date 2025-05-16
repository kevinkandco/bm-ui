
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
    
    // Close the modal properly to update the parent state
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Headphones className="mr-2 h-5 w-5 text-blue-400" />
            Focus Mode
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Minimize distractions and focus on what matters most
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="bg-white/10 rounded-lg border border-white/10 p-4">
            <h4 className="text-sm font-medium text-white mb-2">Focus Duration</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">Time: {focusTime} minutes</span>
                <div className="flex gap-2">
                  {[25, 50, 90].map(time => (
                    <Button 
                      key={time} 
                      variant="outline"
                      size="sm"
                      className={`${focusTime === time ? "bg-blue-500/20 text-blue-400 border-blue-500/50" : "bg-white/5 text-white/70 border-white/10"} hover:bg-white/10`}
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
            <h4 className="text-sm font-medium text-white">Options</h4>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <Label htmlFor="update-status" className="text-white">Update status on connected apps</Label>
              </div>
              <Switch 
                id="update-status"
                checked={options.updateStatus}
                onCheckedChange={() => handleOptionChange("updateStatus")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Monitor className="h-4 w-4 text-blue-400" />
                <Label htmlFor="close-apps" className="text-white">Close distracting applications</Label>
              </div>
              <Switch 
                id="close-apps"
                checked={options.closeApps}
                onCheckedChange={() => handleOptionChange("closeApps")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Headphones className="h-4 w-4 text-blue-400" />
                <Label htmlFor="enable-dnd" className="text-white">Enable Do Not Disturb</Label>
              </div>
              <Switch 
                id="enable-dnd"
                checked={options.enableDnd}
                onCheckedChange={() => handleOptionChange("enableDnd")}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg border border-white/10">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4 text-blue-400" />
                <Label htmlFor="monitor-notifs" className="text-white">Continue monitoring for urgent messages</Label>
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
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleStartFocus} className="bg-blue-600 text-white hover:bg-blue-700">
            <Headphones className="mr-2 h-4 w-4" /> Start Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusMode;
