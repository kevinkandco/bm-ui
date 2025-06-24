
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Headphones, Monitor, Slack, Mail, Calendar, X } from "lucide-react";

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
    { value: "focused", label: "🎯 Focused", description: "Deep work mode" },
    { value: "heads-down", label: "🤫 Heads Down", description: "Do not disturb" },
    { value: "in-the-zone", label: "⚡ In the Zone", description: "High concentration" },
    { value: "deep-work", label: "🧠 Deep Work", description: "Focused on important tasks" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5 text-accent-primary" />
            Configure Focus Mode
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Duration Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Focus Duration</Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Close Apps Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Close Integrated Apps</Label>
              <p className="text-sm text-text-secondary mt-1">
                Automatically close or minimize these apps to reduce distractions
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Slack className="h-5 w-5 text-purple-400" />
                  <div>
                    <Label className="font-medium">Slack</Label>
                    <p className="text-xs text-text-secondary">Close Slack desktop app</p>
                  </div>
                </div>
                <Switch
                  checked={closeApps.slack}
                  onCheckedChange={() => handleAppToggle('slack')}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <Label className="font-medium">Gmail</Label>
                    <p className="text-xs text-text-secondary">Close Gmail tabs and desktop app</p>
                  </div>
                </div>
                <Switch
                  checked={closeApps.gmail}
                  onCheckedChange={() => handleAppToggle('gmail')}
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <div>
                    <Label className="font-medium">Google Calendar</Label>
                    <p className="text-xs text-text-secondary">Close calendar tabs</p>
                  </div>
                </div>
                <Switch
                  checked={closeApps.calendar}
                  onCheckedChange={() => handleAppToggle('calendar')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Status Updates Section */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Update Status in Integrations</Label>
              <p className="text-sm text-text-secondary mt-1">
                Automatically update your status to let others know you're focused
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <Slack className="h-5 w-5 text-purple-400" />
                  <Label className="font-medium">Slack Status</Label>
                </div>
                
                <Select value={statusUpdates.slack} onValueChange={(value) => setStatusUpdates(prev => ({ ...prev, slack: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {slackStatusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-text-secondary">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">Preview</h4>
            <div className="text-sm text-text-secondary space-y-1">
              <p>• Focus mode will run for {duration} minutes</p>
              {Object.entries(closeApps).some(([_, enabled]) => enabled) && (
                <p>• Will close: {Object.entries(closeApps).filter(([_, enabled]) => enabled).map(([app]) => app).join(', ')}</p>
              )}
              <p>• Slack status will be set to: {slackStatusOptions.find(opt => opt.value === statusUpdates.slack)?.label}</p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleStartFocus} className="bg-accent-primary hover:bg-accent-primary/90">
            <Headphones className="mr-2 h-4 w-4" />
            Start Focus Mode
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FocusModeConfig;
