
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
  onExitFocusMode: () => void;
}

const FocusMode = ({ onExitFocusMode }: FocusModeProps) => {
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-background/80 backdrop-blur-xl border rounded-xl p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center mx-auto">
            <Headphones className="w-8 h-8 text-accent-primary" />
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold">Focus Mode Active</h2>
            <p className="text-muted-foreground">You're in deep work mode</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="text-sm text-muted-foreground">Time remaining</div>
            <div className="text-3xl font-bold">{focusTime}:00</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Notifications</span>
              <span className="text-red-500">Paused</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Status</span>
              <span className="text-yellow-500">Do Not Disturb</span>
            </div>
          </div>

          <Button
            onClick={onExitFocusMode}
            variant="outline"
            className="w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Focus Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
