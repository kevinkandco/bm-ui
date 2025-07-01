
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
import { Brain, Mail, MessageSquare, Archive, Tag, AlertCircle, Users, Ban, Plus, X, Clock, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  provider: string;
  accountType: 'email' | 'slack';
  currentSettings?: any;
  onSave: (settings: any) => void;
}

const AISettingsModal = ({
  isOpen,
  onClose,
  accountName,
  provider,
  accountType,
  currentSettings = {},
  onSave
}: AISettingsModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('ai-features');
  
  // Email settings
  const [emailSettings, setEmailSettings] = useState({
    autoLabel: currentSettings.autoLabel || false,
    autoSort: currentSettings.autoSort || false,
    autoArchive: currentSettings.autoArchive || false,
    priorityOnly: currentSettings.priorityOnly || false,
    priorityPeople: currentSettings.priorityPeople || [],
    ignoreKeywords: currentSettings.ignoreKeywords || [],
    priorityTopics: currentSettings.priorityTopics || []
  });

  // Slack settings
  const [slackSettings, setSlackSettings] = useState({
    autoMarkRead: currentSettings.autoMarkRead || false,
    preservePriorities: currentSettings.preservePriorities || true,
    markDelay: currentSettings.markDelay || 5,
    priorityPeople: currentSettings.priorityPeople || [],
    priorityChannels: currentSettings.priorityChannels || [],
    ignoreChannels: currentSettings.ignoreChannels || [],
    ignoreKeywords: currentSettings.ignoreKeywords || []
  });

  const [newPriorityPerson, setNewPriorityPerson] = useState("");
  const [newPriorityChannel, setNewPriorityChannel] = useState("");
  const [newIgnoreChannel, setNewIgnoreChannel] = useState("");
  const [newIgnoreKeyword, setNewIgnoreKeyword] = useState("");
  const [newPriorityTopic, setNewPriorityTopic] = useState("");

  const currentSettings_ = accountType === 'email' ? emailSettings : slackSettings;
  const setCurrentSettings = accountType === 'email' ? setEmailSettings : setSlackSettings;

  const handleSave = () => {
    onSave(currentSettings_);
    toast({
      title: "Settings Updated",
      description: `AI ${accountType === 'email' ? 'email' : 'message'} management settings for ${accountName} have been updated.`,
    });
    onClose();
  };

  const handleSettingChange = (key: string, value: boolean | number) => {
    setCurrentSettings(prev => ({ ...prev, [key]: value }));
  };

  const addPriorityPerson = () => {
    if (newPriorityPerson.trim()) {
      setCurrentSettings(prev => ({
        ...prev,
        priorityPeople: [...prev.priorityPeople, newPriorityPerson.trim()]
      }));
      setNewPriorityPerson("");
    }
  };

  const removePriorityPerson = (person: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      priorityPeople: prev.priorityPeople.filter(p => p !== person)
    }));
  };

  const addPriorityChannel = () => {
    if (newPriorityChannel.trim()) {
      setCurrentSettings(prev => ({
        ...prev,
        priorityChannels: [...prev.priorityChannels, newPriorityChannel.trim()]
      }));
      setNewPriorityChannel("");
    }
  };

  const removePriorityChannel = (channel: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      priorityChannels: prev.priorityChannels.filter(c => c !== channel)
    }));
  };

  const addIgnoreChannel = () => {
    if (newIgnoreChannel.trim()) {
      setCurrentSettings(prev => ({
        ...prev,
        ignoreChannels: [...prev.ignoreChannels, newIgnoreChannel.trim()]
      }));
      setNewIgnoreChannel("");
    }
  };

  const removeIgnoreChannel = (channel: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      ignoreChannels: prev.ignoreChannels.filter(c => c !== channel)
    }));
  };

  const addIgnoreKeyword = () => {
    if (newIgnoreKeyword.trim()) {
      setCurrentSettings(prev => ({
        ...prev,
        ignoreKeywords: [...prev.ignoreKeywords, newIgnoreKeyword.trim()]
      }));
      setNewIgnoreKeyword("");
    }
  };

  const removeIgnoreKeyword = (keyword: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      ignoreKeywords: prev.ignoreKeywords.filter(k => k !== keyword)
    }));
  };

  const addPriorityTopic = () => {
    if (newPriorityTopic.trim()) {
      setCurrentSettings(prev => ({
        ...prev,
        priorityTopics: [...prev.priorityTopics, newPriorityTopic.trim()]
      }));
      setNewPriorityTopic("");
    }
  };

  const removePriorityTopic = (topic: string) => {
    setCurrentSettings(prev => ({
      ...prev,
      priorityTopics: prev.priorityTopics.filter(t => t !== topic)
    }));
  };

  const tabs = [
    { id: 'ai-features', label: 'AI Features', icon: Brain },
    { id: 'priority-people', label: 'Priority People', icon: Users },
    ...(accountType === 'email' ? [{ id: 'priority-topics', label: 'Priority Topics', icon: Tag }] : []),
    ...(accountType === 'slack' ? [{ id: 'priority-channels', label: 'Priority Channels', icon: Hash }] : []),
    ...(accountType === 'slack' ? [{ id: 'ignore-channels', label: 'Ignore Channels', icon: Ban }] : []),
    { id: 'ignore-keywords', label: 'Ignore Keywords', icon: Ban }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-blue-400" />
            AI {accountType === 'email' ? 'Email' : 'Message'} Management - {accountName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Navigation */}
          <div className="w-64 border-r bg-muted/20 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-medium text-text-primary">How it works</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {accountType === 'email' 
                      ? "Our AI analyzes your emails to identify priorities, automatically organizing your inbox so you only see what matters most."
                      : "Our AI identifies priority messages and automatically marks non-priority messages as read, keeping your Slack clean and focused."
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* AI Features Tab */}
            {activeTab === 'ai-features' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-text-primary">AI Features</h3>
                
                {accountType === 'email' ? (
                  <div className="space-y-4">
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
                          checked={emailSettings.autoLabel}
                          onCheckedChange={(checked) => handleSettingChange('autoLabel', checked)}
                        />
                      </div>

                      {emailSettings.autoLabel && (
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
                        checked={emailSettings.autoSort}
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
                        checked={emailSettings.autoArchive}
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
                        checked={emailSettings.priorityOnly}
                        onCheckedChange={(checked) => handleSettingChange('priorityOnly', checked)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
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
                        checked={slackSettings.autoMarkRead}
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
                        checked={slackSettings.preservePriorities}
                        onCheckedChange={(checked) => handleSettingChange('preservePriorities', checked)}
                        disabled={!slackSettings.autoMarkRead}
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
                              slackSettings.markDelay === minutes
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-text-secondary hover:bg-white/20'
                            }`}
                            disabled={!slackSettings.autoMarkRead}
                          >
                            {minutes}m
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Priority criteria info */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-6">
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
                )}
              </div>
            )}

            {/* Priority People Tab */}
            {activeTab === 'priority-people' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-text-secondary" />
                  <h3 className="text-lg font-medium text-text-primary">Priority People</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  {accountType === 'email' 
                    ? "Emails from these people will always be marked as high priority"
                    : "Messages from these people will never be marked as read automatically"
                  }
                </p>
                
                <div className="flex gap-2">
                  <Input
                    placeholder={accountType === 'email' ? "Enter email or name..." : "Enter @username or display name..."}
                    value={newPriorityPerson}
                    onChange={(e) => setNewPriorityPerson(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addPriorityPerson()}
                    className="flex-1"
                  />
                  <Button onClick={addPriorityPerson} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {currentSettings_.priorityPeople.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentSettings_.priorityPeople.map(person => (
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
            )}

            {/* Priority Topics Tab (Email only) */}
            {activeTab === 'priority-topics' && accountType === 'email' && (
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

                {emailSettings.priorityTopics.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {emailSettings.priorityTopics.map(topic => (
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
            )}

            {/* Priority Channels Tab (Slack only) */}
            {activeTab === 'priority-channels' && accountType === 'slack' && (
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

                {slackSettings.priorityChannels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slackSettings.priorityChannels.map(channel => (
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
            )}

            {/* Ignore Channels Tab (Slack only) */}
            {activeTab === 'ignore-channels' && accountType === 'slack' && (
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

                {slackSettings.ignoreChannels.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {slackSettings.ignoreChannels.map(channel => (
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
            )}

            {/* Ignore Keywords Tab */}
            {activeTab === 'ignore-keywords' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ban className="h-4 w-4 text-text-secondary" />
                  <h3 className="text-lg font-medium text-text-primary">Ignore Keywords</h3>
                </div>
                <p className="text-sm text-text-secondary">
                  {accountType === 'email' 
                    ? "Emails containing these keywords will be automatically marked as low priority"
                    : "Messages containing these keywords will be marked as read automatically"
                  }
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

                {currentSettings_.ignoreKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {currentSettings_.ignoreKeywords.map(keyword => (
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
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISettingsModal;
