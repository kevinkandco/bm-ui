
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Brain, MessageSquare, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlackAISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  currentSettings?: {
    autoMarkRead: boolean;
    preservePriorities: boolean;
    markDelay: number;
  };
  onSave: (settings: any) => void;
}

const SlackAISettings = ({
  isOpen,
  onClose,
  accountName,
  currentSettings = {
    autoMarkRead: false,
    preservePriorities: true,
    markDelay: 5
  },
  onSave
}: SlackAISettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(currentSettings);

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Settings Updated",
      description: `AI message management settings for ${accountName} have been updated.`,
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Message Management - {accountName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary">How it works</h3>
                <p className="text-sm text-text-secondary mt-1">
                  Our AI identifies priority messages and automatically marks non-priority messages as read, keeping your Slack clean and focused.
                </p>
              </div>
            </div>
          </div>

          {/* Auto-mark read */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-text-secondary" />
                <Label className="text-base font-medium">Auto-Mark Non-Priorities as Read</Label>
              </div>
              <p className="text-sm text-text-secondary">
                Automatically mark low-priority messages as read to reduce notification noise
              </p>
            </div>
            <Switch
              checked={settings.autoMarkRead}
              onCheckedChange={(checked) => handleSettingChange('autoMarkRead', checked)}
            />
          </div>

          <Separator />

          {/* Preserve priorities */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">Preserve Priority Messages</Label>
              <p className="text-sm text-text-secondary">
                Keep high-priority messages unread so you don't miss important communications
              </p>
            </div>
            <Switch
              checked={settings.preservePriorities}
              onCheckedChange={(checked) => handleSettingChange('preservePriorities', checked)}
              disabled={!settings.autoMarkRead}
            />
          </div>

          <Separator />

          {/* Mark delay */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-text-secondary" />
              <Label className="text-base font-medium">Auto-Mark Delay</Label>
            </div>
            <p className="text-sm text-text-secondary">
              How long to wait before marking non-priority messages as read
            </p>
            <div className="flex items-center gap-4">
              {[1, 5, 15, 30].map(minutes => (
                <button
                  key={minutes}
                  onClick={() => handleSettingChange('markDelay', minutes)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    settings.markDelay === minutes
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-text-secondary hover:bg-white/20'
                  }`}
                  disabled={!settings.autoMarkRead}
                >
                  {minutes}m
                </button>
              ))}
            </div>
          </div>

          {/* Priority criteria info */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">What counts as priority?</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Direct messages to you</li>
              <li>• Messages mentioning you (@username)</li>
              <li>• Messages in channels you've marked as priority</li>
              <li>• Messages from people in your priority contacts</li>
              <li>• Messages containing urgent keywords</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SlackAISettings;
