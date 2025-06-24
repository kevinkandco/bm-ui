
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
import { Brain, Mail, Archive, Tag, AlertCircle, Users, Ban, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailAISettingsProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  provider: string;
  currentSettings?: {
    autoLabel: boolean;
    autoSort: boolean;
    autoArchive: boolean;
    priorityOnly: boolean;
    priorityPeople: string[];
    ignoreKeywords: string[];
    priorityTopics: string[];
  };
  onSave: (settings: any) => void;
}

const EmailAISettings = ({
  isOpen,
  onClose,
  accountName,
  provider,
  currentSettings = {
    autoLabel: false,
    autoSort: false,
    autoArchive: false,
    priorityOnly: false,
    priorityPeople: [],
    ignoreKeywords: [],
    priorityTopics: []
  },
  onSave
}: EmailAISettingsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState(currentSettings);
  const [newPriorityPerson, setNewPriorityPerson] = useState("");
  const [newIgnoreKeyword, setNewIgnoreKeyword] = useState("");
  const [newPriorityTopic, setNewPriorityTopic] = useState("");

  const handleSave = () => {
    onSave(settings);
    toast({
      title: "Settings Updated",
      description: `AI email management settings for ${accountName} have been updated.`,
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: boolean) => {
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

  const addPriorityTopic = () => {
    if (newPriorityTopic.trim()) {
      setSettings(prev => ({
        ...prev,
        priorityTopics: [...prev.priorityTopics, newPriorityTopic.trim()]
      }));
      setNewPriorityTopic("");
    }
  };

  const removePriorityTopic = (topic: string) => {
    setSettings(prev => ({
      ...prev,
      priorityTopics: prev.priorityTopics.filter(t => t !== topic)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Email Management - {accountName}
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
                  Our AI analyzes your emails to identify priorities, automatically organizing your inbox so you only see what matters most.
                </p>
              </div>
            </div>
          </div>

          {/* AI Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary">AI Features</h3>
            
            {/* Auto-labeling */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-text-secondary" />
                    <Label className="text-base font-medium">Auto-Label Emails</Label>
                  </div>
                  <p className="text-sm text-text-secondary">
                    Automatically add labels like "Priority", "Meeting", "Invoice", etc.
                  </p>
                </div>
                <Switch
                  checked={settings.autoLabel}
                  onCheckedChange={(checked) => handleSettingChange('autoLabel', checked)}
                />
              </div>

              {settings.autoLabel && (
                <div className="ml-6 space-y-2">
                  <p className="text-xs text-text-secondary">Common labels that will be applied:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Priority', 'Meeting', 'Action Required', 'Invoice', 'Newsletter', 'Spam'].map(label => (
                      <Badge key={label} variant="secondary" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Smart Sorting */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-text-secondary" />
                  <Label className="text-base font-medium">Smart Sorting</Label>
                </div>
                <p className="text-sm text-text-secondary">
                  Organize emails by importance, moving non-priorities to separate folders
                </p>
              </div>
              <Switch
                checked={settings.autoSort}
                onCheckedChange={(checked) => handleSettingChange('autoSort', checked)}
              />
            </div>

            <Separator />

            {/* Auto-archiving */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Archive className="h-4 w-4 text-text-secondary" />
                  <Label className="text-base font-medium">Auto-Archive Non-Priorities</Label>
                </div>
                <p className="text-sm text-text-secondary">
                  Automatically archive low-priority emails after 7 days (never deleted)
                </p>
              </div>
              <Switch
                checked={settings.autoArchive}
                onCheckedChange={(checked) => handleSettingChange('autoArchive', checked)}
              />
            </div>

            <Separator />

            {/* Priority-only mode */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Priority-Only Inbox</Label>
                <p className="text-sm text-text-secondary">
                  Only show high-priority emails in your main inbox view
                </p>
              </div>
              <Switch
                checked={settings.priorityOnly}
                onCheckedChange={(checked) => handleSettingChange('priorityOnly', checked)}
              />
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
              Emails from these people will always be marked as high priority
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter email or name..."
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

          {/* Priority Topics */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-text-secondary" />
              <h3 className="text-lg font-medium text-text-primary">Priority Topics</h3>
            </div>
            <p className="text-sm text-text-secondary">
              Emails containing these keywords will be marked as high priority
            </p>
            
            <div className="flex gap-2">
              <Input
                placeholder="Enter keyword or topic..."
                value={newPriorityTopic}
                onChange={(e) => setNewPriorityTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPriorityTopic()}
                className="flex-1"
              />
              <Button onClick={addPriorityTopic} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {settings.priorityTopics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {settings.priorityTopics.map(topic => (
                  <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                    {topic}
                    <button onClick={() => removePriorityTopic(topic)}>
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
              Emails containing these keywords will be automatically marked as low priority
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
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailAISettings;
