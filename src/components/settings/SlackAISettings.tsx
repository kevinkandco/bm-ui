
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Brain, MessageSquare, AlertCircle, Clock, Users, Hash, Ban, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SlackAISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  currentSettings?: {
    autoMarkRead: boolean;
    preservePriorities: boolean;
    markDelay: number;
    priorityPeople: string[];
    priorityChannels: string[];
    ignoreChannels: string[];
    ignoreKeywords: string[];
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
    markDelay: 5,
    priorityPeople: [],
    priorityChannels: [],
    ignoreChannels: [],
    ignoreKeywords: []
  },
  onSave
}: SlackAISettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(currentSettings);
  const [newPriorityPerson, setNewPriorityPerson] = useState("");
  const [newPriorityChannel, setNewPriorityChannel] = useState("");
  const [newIgnoreChannel, setNewIgnoreChannel] = useState("");
  const [newIgnoreKeyword, setNewIgnoreKeyword] = useState("");

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

  const addPriorityPerson = () => {
    if (newPriorityPerson.trim()) {
      setSettings(prev => ({
        ...prev,
        priorityPeople: [...prev.priorityPeople, newPriorityPerson.trim()]
      }));
      setNewPriorityPerson("");
    }
  };

  const removePriorityPerson = (person: string) => {
    setSettings(prev => ({
      ...prev,
      priorityPeople: prev.priorityPeople.filter(p => p !== person)
    }));
  };

  const addPriorityChannel = () => {
    if (newPriorityChannel.trim()) {
      setSettings(prev => ({
        ...prev,
        priorityChannels: [...prev.priorityChannels, newPriorityChannel.trim()]
      }));
      setNewPriorityChannel("");
    }
  };

  const removePriorityChannel = (channel: string) => {
    setSettings(prev => ({
      ...prev,
      priorityChannels: prev.priorityChannels.filter(c => c !== channel)
    }));
  };

  const addIgnoreChannel = () => {
    if (newIgnoreChannel.trim()) {
      setSettings(prev => ({
        ...prev,
        ignoreChannels: [...prev.ignoreChannels, newIgnoreChannel.trim()]
      }));
      setNewIgnoreChannel("");
    }
  };

  const removeIgnoreChannel = (channel: string) => {
    setSettings(prev => ({
      ...prev,
      ignoreChannels: prev.ignoreChannels.filter(c => c !== channel)
    }));
  };

  const addIgnoreKeyword = () => {
    if (newIgnoreKeyword.trim()) {
      setSettings(prev => ({
        ...prev,
        ignoreKeywords: [...prev.ignoreKeywords, newIgnoreKeyword.trim()]
      }));
      setNewIgnoreKeyword("");
    }
  };

  const removeIgnoreKeyword = (keyword: string) => {
    setSettings(prev => ({
      ...prev,
      ignoreKeywords: prev.ignoreKeywords.filter(k => k !== keyword)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
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

          {/* AI Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">AI Features</h3>

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
          </div>

          <Separator />

          {/* Priority People */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Priority People</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Messages from these people will never be marked as read automatically
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter @username or display name..."
                value={newPriorityPerson}
                onChange={(e) => setNewPriorityPerson(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPriorityPerson()}
                className="flex-1"
              />
              <Button onClick={addPriorityPerson} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {settings.priorityPeople.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.priorityPeople.map(person => (
                  <Badge key={person} variant="secondary" className="flex items-center gap-1">
                    {person}
                    <button onClick={() => removePriorityPerson(person)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Priority Channels */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Priority Channels</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Messages in these channels will never be marked as read automatically
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter #channel-name..."
                value={newPriorityChannel}
                onChange={(e) => setNewPriorityChannel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPriorityChannel()}
                className="flex-1"
              />
              <Button onClick={addPriorityChannel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {settings.priorityChannels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.priorityChannels.map(channel => (
                  <Badge key={channel} variant="secondary" className="flex items-center gap-1">
                    #{channel}
                    <button onClick={() => removePriorityChannel(channel)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Ignore Channels */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Ignore Channels</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Messages in these channels will always be marked as read immediately
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter #channel-name..."
                value={newIgnoreChannel}
                onChange={(e) => setNewIgnoreChannel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIgnoreChannel()}
                className="flex-1"
              />
              <Button onClick={addIgnoreChannel} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {settings.ignoreChannels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.ignoreChannels.map(channel => (
                  <Badge key={channel} variant="outline" className="flex items-center gap-1 text-red-400 border-red-400/20">
                    #{channel}
                    <button onClick={() => removeIgnoreChannel(channel)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {/* Ignore Keywords */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Ignore Keywords</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Messages containing these keywords will be marked as read automatically
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword to ignore..."
                value={newIgnoreKeyword}
                onChange={(e) => setNewIgnoreKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addIgnoreKeyword()}
                className="flex-1"
              />
              <Button onClick={addIgnoreKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {settings.ignoreKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.ignoreKeywords.map(keyword => (
                  <Badge key={keyword} variant="outline" className="flex items-center gap-1 text-red-400 border-red-400/20">
                    {keyword}
                    <button onClick={() => removeIgnoreKeyword(keyword)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Priority criteria info */}
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">What counts as priority?</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Direct messages to you</li>
              <li>• Messages mentioning you (@username)</li>
              <li>• Messages in your priority channels</li>
              <li>• Messages from your priority people</li>
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
