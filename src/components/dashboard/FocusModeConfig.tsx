
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
      <DialogContent className="max-w-lg bg-brand-700 border-border-subtle">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-text-primary">
            <Headphones className="h-6 w-6 text-brand-300" />
            Focus Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Duration */}
          <div>
            <Label className="text-base font-medium mb-3 block text-text-secondary">Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="h-12 bg-brand-600 border-brand-300 rounded-full text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-brand-600 border-brand-300">
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
            <Label className="text-base font-medium mb-4 block text-text-secondary">Close Apps</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-brand-600 border border-border-subtle">
                <Slack className="h-8 w-8 text-purple-400" />
                <span className="text-sm font-medium text-text-primary">Slack</span>
                <Switch
                  checked={closeApps.slack}
                  onCheckedChange={() => handleAppToggle('slack')}
                  className="data-[state=unchecked]:bg-gray-600"
                />
              </div>
              
              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-brand-600 border border-border-subtle">
                <Mail className="h-8 w-8 text-blue-400" />
                <span className="text-sm font-medium text-text-primary">Gmail</span>
                <Switch
                  checked={closeApps.gmail}
                  onCheckedChange={() => handleAppToggle('gmail')}
                  className="data-[state=unchecked]:bg-gray-600"
                />
              </div>

              <div className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-brand-600 border border-border-subtle">
                <Calendar className="h-8 w-8 text-green-400" />
                <span className="text-sm font-medium text-text-primary">Calendar</span>
                <Switch
                  checked={closeApps.calendar}
                  onCheckedChange={() => handleAppToggle('calendar')}
                  className="data-[state=unchecked]:bg-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Slack Status */}
          <div>
            <Label className="text-base font-medium mb-3 block text-text-secondary">Slack Status</Label>
            <Select value={statusUpdates.slack} onValueChange={(value) => setStatusUpdates(prev => ({ ...prev, slack: value }))}>
              <SelectTrigger className="h-12 bg-brand-600 border-brand-300 rounded-full text-text-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-brand-600 border-brand-300">
                {slackStatusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-text-primary">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-4 mt-8 pt-4">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="flex-1 h-12 rounded-full border-border-subtle bg-transparent text-text-secondary hover:bg-white/5"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleStartFocus} 
            className="flex-1 h-12 rounded-full bg-brand-300 hover:bg-brand-300/90 text-brand-900 font-semibold"
          >
            <Headphones className="mr-2 h-4 w-4" />
            Start Focus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusModeConfig;
