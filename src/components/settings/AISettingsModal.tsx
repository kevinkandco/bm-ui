
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Brain, Mail, MessageSquare, AlertCircle, Clock, Users, Hash, Ban, Plus, X, Tag, Archive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountName: string;
  provider: "email" | "slack";
  currentEmailSettings?: {
    autoLabel: boolean;
    autoSort: boolean;
    autoArchive: boolean;
    priorityOnly: boolean;
    priorityPeople: string[];
    ignoreKeywords: string[];
    priorityTopics: string[];
  };
  currentSlackSettings?: {
    autoMarkRead: boolean;
    preservePriorities: boolean;
    markDelay: number;
    priorityPeople: string[];
    priorityChannels: string[];
    ignoreChannels: string[];
    ignoreKeywords: string[];
  };
  onSave: (emailSettings?: any, slackSettings?: any) => void;
}

const AISettingsModal = ({
  isOpen,
  onClose,
  accountName,
  provider,
  currentEmailSettings = {
    autoLabel: false,
    autoSort: false,
    autoArchive: false,
    priorityOnly: false,
    priorityPeople: [],
    ignoreKeywords: [],
    priorityTopics: []
  },
  currentSlackSettings = {
    autoMarkRead: false,
    preservePriorities: true,
    markDelay: 5,
    priorityPeople: [],
    priorityChannels: [],
    ignoreChannels: [],
    ignoreKeywords: []
  },
  onSave
}: AISettingsModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(provider === "email" ? "priority-people" : "priority-people");
  const [emailSettings, setEmailSettings] = useState(currentEmailSettings);
  const [slackSettings, setSlackSettings] = useState(currentSlackSettings);
  
  // Input states
  const [newPriorityPerson, setNewPriorityPerson] = useState("");
  const [newPriorityChannel, setNewPriorityChannel] = useState("");
  const [newPriorityTopic, setNewPriorityTopic] = useState("");
  const [newIgnoreKeyword, setNewIgnoreKeyword] = useState("");
  const [newIgnoreChannel, setNewIgnoreChannel] = useState("");

  const handleSave = () => {
    onSave(emailSettings, slackSettings);
    toast({
      title: "Settings Updated",
      description: `AI management settings for ${accountName} have been updated.`,
    });
    onClose();
  };

  const handleEmailSettingChange = (key: string, value: boolean) => {
    setEmailSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSlackSettingChange = (key: string, value: boolean | number) => {
    setSlackSettings(prev => ({ ...prev, [key]: value }));
  };

  // Priority People handlers
  const addPriorityPerson = () => {
    if (newPriorityPerson.trim()) {
      if (provider === "email") {
        setEmailSettings(prev => ({
          ...prev,
          priorityPeople: [...prev.priorityPeople, newPriorityPerson.trim()]
        }));
      } else {
        setSlackSettings(prev => ({
          ...prev,
          priorityPeople: [...prev.priorityPeople, newPriorityPerson.trim()]
        }));
      }
      setNewPriorityPerson("");
    }
  };

  const removePriorityPerson = (person: string) => {
    if (provider === "email") {
      setEmailSettings(prev => ({
        ...prev,
        priorityPeople: prev.priorityPeople.filter(p => p !== person)
      }));
    } else {
      setSlackSettings(prev => ({
        ...prev,
        priorityPeople: prev.priorityPeople.filter(p => p !== person)
      }));
    }
  };

  // Priority Topics/Channels handlers
  const addPriorityTopic = () => {
    if (newPriorityTopic.trim()) {
      setEmailSettings(prev => ({
        ...prev,
        priorityTopics: [...prev.priorityTopics, newPriorityTopic.trim()]
      }));
      setNewPriorityTopic("");
    }
  };

  const removePriorityTopic = (topic: string) => {
    setEmailSettings(prev => ({
      ...prev,
      priorityTopics: prev.priorityTopics.filter(t => t !== topic)
    }));
  };

  const addPriorityChannel = () => {
    if (newPriorityChannel.trim()) {
      setSlackSettings(prev => ({
        ...prev,
        priorityChannels: [...prev.priorityChannels, newPriorityChannel.trim()]
      }));
      setNewPriorityChannel("");
    }
  };

  const removePriorityChannel = (channel: string) => {
    setSlackSettings(prev => ({
      ...prev,
      priorityChannels: prev.priorityChannels.filter(c => c !== channel)
    }));
  };

  // Ignore handlers
  const addIgnoreKeyword = () => {
    if (newIgnoreKeyword.trim()) {
      if (provider === "email") {
        setEmailSettings(prev => ({
          ...prev,
          ignoreKeywords: [...prev.ignoreKeywords, newIgnoreKeyword.trim()]
        }));
      } else {
        setSlackSettings(prev => ({
          ...prev,
          ignoreKeywords: [...prev.ignoreKeywords, newIgnoreKeyword.trim()]
        }));
      }
      setNewIgnoreKeyword("");
    }
  };

  const removeIgnoreKeyword = (keyword: string) => {
    if (provider === "email") {
      setEmailSettings(prev => ({
        ...prev,
        ignoreKeywords: prev.ignoreKeywords.filter(k => k !== keyword)
      }));
    } else {
      setSlackSettings(prev => ({
        ...prev,
        ignoreKeywords: prev.ignoreKeywords.filter(k => k !== keyword)
      }));
    }
  };

  const addIgnoreChannel = () => {
    if (newIgnoreChannel.trim()) {
      setSlackSettings(prev => ({
        ...prev,
        ignoreChannels: [...prev.ignoreChannels, newIgnoreChannel.trim()]
      }));
      setNewIgnoreChannel("");
    }
  };

  const removeIgnoreChannel = (channel: string) => {
    setSlackSettings(prev => ({
      ...prev,
      ignoreChannels: prev.ignoreChannels.filter(c => c !== channel)
    }));
  };

  const currentPriorityPeople = provider === "email" ? emailSettings.priorityPeople : slackSettings.priorityPeople;
  const currentIgnoreKeywords = provider === "email" ? emailSettings.ignoreKeywords : slackSettings.ignoreKeywords;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            {provider === "email" ? "Email" : "Slack"} Settings
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex">
            {/* Left sidebar with tabs */}
            <div className="w-64 pr-6 border-r border-border-subtle">
              <TabsList className="flex flex-col h-auto w-full bg-transparent p-0 space-y-1">
                <TabsTrigger 
                  value="priority-people" 
                  className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary hover:bg-white/5"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Priority People
                </TabsTrigger>
                
                {provider === "email" ? (
                  <TabsTrigger 
                    value="priority-topics" 
                    className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary hover:bg-white/5"
                  >
                    <Tag className="h-4 w-4 mr-2" />
                    Priority Topics
                  </TabsTrigger>
                ) : (
                  <TabsTrigger 
                    value="priority-channels" 
                    className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary hover:bg-white/5"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Priority Channels
                  </TabsTrigger>
                )}
                
                <TabsTrigger 
                  value="ignore-configuration" 
                  className="w-full justify-start px-4 py-3 rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white text-text-secondary hover:bg-white/5"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Ignore Configuration
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Right content area */}
            <div className="flex-1 pl-6">
              <TabsContent value="priority-people" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">Who are your priority people?</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Designate important people who should be able to break through Brief-Me barriers.
                    </p>
                    
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Search contacts..."
                        value={newPriorityPerson}
                        onChange={(e) => setNewPriorityPerson(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPriorityPerson()}
                        className="flex-1 bg-white/5 border-white/10"
                      />
                      <Button 
                        onClick={addPriorityPerson} 
                        className="bg-black text-white hover:bg-black/80 px-8"
                      >
                        Designate
                      </Button>
                    </div>

                    {currentPriorityPeople.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-text-primary">Suggested Contacts</h4>
                        {currentPriorityPeople.map(person => (
                          <div key={person} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                                <span className="text-xs text-white">{person.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-medium text-white">{person}</p>
                                <p className="text-sm text-white/60">@{person.toLowerCase().replace(/\s+/g, '')}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => removePriorityPerson(person)}
                              className="bg-black text-white hover:bg-black/80"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Designate
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="priority-topics" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">Priority Topics</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Emails containing these keywords will be marked as high priority
                    </p>
                    
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Enter keyword or topic..."
                        value={newPriorityTopic}
                        onChange={(e) => setNewPriorityTopic(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPriorityTopic()}
                        className="flex-1 bg-white/5 border-white/10"
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
                </div>
              </TabsContent>

              <TabsContent value="priority-channels" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">Priority Channels</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      Messages in these channels will never be marked as read automatically
                    </p>
                    
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Enter #channel-name..."
                        value={newPriorityChannel}
                        onChange={(e) => setNewPriorityChannel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addPriorityChannel()}
                        className="flex-1 bg-white/5 border-white/10"
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
                </div>
              </TabsContent>

              <TabsContent value="ignore-configuration" className="mt-0">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-text-primary mb-2">Ignore Configuration</h3>
                    <p className="text-sm text-text-secondary mb-4">
                      {provider === "email" ? "Emails" : "Messages"} containing these keywords will be automatically marked as low priority
                    </p>
                    
                    <div className="flex gap-2 mb-4">
                      <Input
                        placeholder="Enter keyword to ignore..."
                        value={newIgnoreKeyword}
                        onChange={(e) => setNewIgnoreKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addIgnoreKeyword()}
                        className="flex-1 bg-white/5 border-white/10"
                      />
                      <Button onClick={addIgnoreKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {currentIgnoreKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {currentIgnoreKeywords.map(keyword => (
                          <Badge key={keyword} variant="outline" className="flex items-center gap-1 text-red-400 border-red-400/20">
                            {keyword}
                            <button onClick={() => removeIgnoreKeyword(keyword)}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}

                    {provider === "slack" && (
                      <div className="mt-6">
                        <h4 className="font-medium text-text-primary mb-2">Ignore Channels</h4>
                        <p className="text-sm text-text-secondary mb-4">
                          Messages in these channels will always be marked as read immediately
                        </p>
                        
                        <div className="flex gap-2 mb-4">
                          <Input
                            placeholder="Enter #channel-name..."
                            value={newIgnoreChannel}
                            onChange={(e) => setNewIgnoreChannel(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addIgnoreChannel()}
                            className="flex-1 bg-white/5 border-white/10"
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
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} className="bg-green-600 text-white hover:bg-green-700">Save Settings</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISettingsModal;
