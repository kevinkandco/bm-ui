
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Slack, Mail, Calendar } from "lucide-react";

interface FocusModeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (config: FocusConfig) => void;
}

interface FocusConfig {
  duration: number;
  closeApps: {
    slack: boolean;
    gmail: boolean;
    calendar: boolean;
  };
  statusUpdates: {
    slack: string;
  };
}

const FocusModeConfig = ({ isOpen, onClose, onStartFocus }: FocusModeConfigProps) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState(30);
  const [closeApps, setCloseApps] = useState({
    slack: false,
    gmail: false,
    calendar: false,
  });
  const [statusUpdates, setStatusUpdates] = useState({
    slack: "focused",
  });

  const handleAppToggle = (app: keyof typeof closeApps) => {
    setCloseApps(prev => ({ ...prev, [app]: !prev[app] }));
  };

  const handleStartFocus = () => {
    const config: FocusConfig = {
      duration,
      closeApps,
      statusUpdates,
    };
    
    onStartFocus(config);
    onClose();
  };

  const slackStatusOptions = [
    { value: "focused", label: "🎯 Focused" },
    { value: "heads-down", label: "🤫 Heads Down" },
    { value: "in-the-zone", label: "⚡ In the Zone" },
    { value: "deep-work", label: "🧠 Deep Work" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Headphones className="h-5 w-5 text-accent-primary" />
            Focus Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Duration */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Close Apps */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Close Apps</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <Slack className="h-5 w-5 text-purple-400" />
                <span className="text-xs">Slack</span>
                <Switch
                  checked={closeApps.slack}
                  onCheckedChange={() => handleAppToggle('slack')}
                />
              </div>
              
              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-xs">Gmail</span>
                <Switch
                  checked={closeApps.gmail}
                  onCheckedChange={() => handleAppToggle('gmail')}
                />
              </div>

              <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
                <Calendar className="h-5 w-5 text-green-400" />
                <span className="text-xs">Calendar</span>
                <Switch
                  checked={closeApps.calendar}
                  onCheckedChange={() => handleAppToggle('calendar')}
                />
              </div>
            </div>
          </div>

          {/* Status Updates */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Slack Status</Label>
            <Select value={statusUpdates.slack} onValueChange={(value) => setStatusUpdates(prev => ({ ...prev, slack: value }))}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {slackStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 mt-6">
          <Button variant="outline" onClick={onClose} size="sm">
            Cancel
          </Button>
          <Button onClick={handleStartFocus} className="bg-accent-primary hover:bg-accent-primary/90" size="sm">
            <Headphones className="mr-2 h-4 w-4" />
            Start Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusModeConfig;
