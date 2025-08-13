
import React, { useState, useEffect } from "react";
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
import { Headphones, Slack, Mail, Calendar, FileText, Users, MessageSquare } from "lucide-react";

interface ConnectedApp {
  id: string;
  name: string;
  icon: typeof Slack | typeof Mail | typeof Calendar | typeof FileText | typeof Users | typeof MessageSquare;
  color: string;
}

interface FocusModeConfigProps {
  isOpen: boolean;
  onClose: () => void;
  onStartFocus: (config: FocusConfig) => void;
  connectedApps?: ConnectedApp[];
}

interface FocusConfig {
  duration: number;
  closeApps: Record<string, boolean>;
  statusUpdates: {
    slack: string;
  };
}

const FocusModeConfig = ({ isOpen, onClose, onStartFocus, connectedApps = [] }: FocusModeConfigProps) => {
  console.log("FocusModeConfig rendered with connectedApps:", connectedApps);
  const { toast } = useToast();
  const [duration, setDuration] = useState(30);
  const [statusUpdates, setStatusUpdates] = useState({
    slack: "focused",
  });

  // Default apps if no connected apps provided (for backwards compatibility)
  const defaultApps: ConnectedApp[] = [
    { id: "slack", name: "Slack", icon: Slack, color: "text-purple-400" },
    { id: "gmail", name: "Gmail", icon: Mail, color: "text-blue-400" },
    { id: "calendar", name: "Calendar", icon: Calendar, color: "text-green-400" },
  ];

  const appsToShow = connectedApps.length > 0 ? connectedApps : defaultApps;
  console.log("Apps to show in modal:", appsToShow);

  // Initialize closeApps state based on apps to show
  const [closeApps, setCloseApps] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};
    appsToShow.forEach(app => {
      initialState[app.id] = false;
    });
    return initialState;
  });

  // Reset closeApps when modal opens with potentially different connected apps
  useEffect(() => {
    if (isOpen) {
      const newCloseApps: Record<string, boolean> = {};
      appsToShow.forEach(app => {
        newCloseApps[app.id] = false; // Reset all to false when modal opens
      });
      setCloseApps(newCloseApps);
    }
  }, [isOpen]); // Only depend on modal open state

  const handleAppToggle = (appId: string) => {
    setCloseApps(prev => ({ ...prev, [appId]: !prev[appId] }));
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
            {appsToShow.length > 0 ? (
              <div className={`grid gap-4 ${
                appsToShow.length === 1 ? 'grid-cols-1 max-w-xs mx-auto' :
                appsToShow.length === 2 ? 'grid-cols-2' :
                appsToShow.length === 3 ? 'grid-cols-3' :
                appsToShow.length === 4 ? 'grid-cols-2' :
                'grid-cols-3'
              }`}>
                {appsToShow.map((app) => {
                  const IconComponent = app.icon;
                  return (
                    <div
                      key={app.id}
                      onClick={() => handleAppToggle(app.id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                        closeApps[app.id] 
                          ? 'bg-brand-300/20 border border-brand-300' 
                          : 'bg-brand-600 border border-border-subtle hover:bg-brand-600/80'
                      }`}
                    >
                      <IconComponent className={`h-6 w-6 ${app.color}`} />
                      <span className="text-xs font-medium text-text-primary">{app.name}</span>
                      <Switch
                        checked={closeApps[app.id] || false}
                        onCheckedChange={() => handleAppToggle(app.id)}
                        className="data-[state=unchecked]:bg-gray-600 pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-text-secondary">
                No apps available to close
              </div>
            )}
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
