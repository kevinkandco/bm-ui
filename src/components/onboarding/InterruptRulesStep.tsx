
import React, { useState, useMemo } from "react";
import { Shield, Plus, X, AlertTriangle, User, Hash, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface InterruptRulesStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: any;
}

const InterruptRulesStep: React.FC<InterruptRulesStepProps> = ({
  onNext,
  onBack,
  updateUserData,
  userData
}) => {
  const [newContact, setNewContact] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedSystemAlerts, setSelectedSystemAlerts] = useState<string[]>(
    userData.interruptRules?.systemAlerts || []
  );
  const [usePriorityPeople, setUsePriorityPeople] = useState(false);
  const [showContactSuggestions, setShowContactSuggestions] = useState(false);

  // Mock contacts from user's platforms
  const allContacts = useMemo(() => [
    { name: "Alex Johnson", email: "alex@company.com" },
    { name: "Taylor Swift", email: "taylor@email.com" },
    { name: "Kelsey Smith", email: "kelsey@personal.com" },
    { name: "Jordan Lee", email: "jordan@client.com" },
    { name: "Pat Wilson", email: "pat@partner.com" },
    { name: "Robin Zhang", email: "robin@team.com" },
    { name: "Morgan Freeman", email: "morgan@company.com" },
    { name: "Emma Watson", email: "emma@company.com" },
    { name: "Chris Evans", email: "chris@company.com" },
    { name: "Jennifer Lopez", email: "jlo@email.com" },
    { name: "Ryan Reynolds", email: "ryan@client.com" },
  ], []);

  // Filter contacts based on input
  const filteredContacts = useMemo(() => {
    if (!newContact.trim()) return [];
    return allContacts.filter(contact =>
      contact.name.toLowerCase().includes(newContact.toLowerCase()) ||
      contact.email.toLowerCase().includes(newContact.toLowerCase())
    ).slice(0, 5); // Show max 5 suggestions
  }, [newContact, allContacts]);

  // Get contacts and keywords based on toggle
  const contacts = useMemo(() => {
    if (usePriorityPeople && userData.priorityPeople?.length > 0) {
      return userData.priorityPeople.map((person: any) => ({
        name: person.name,
        email: person.email || ""
      }));
    }
    return userData.interruptRules?.contacts || [];
  }, [usePriorityPeople, userData.priorityPeople, userData.interruptRules?.contacts]);

  const keywords = useMemo(() => {
    if (usePriorityPeople && userData.priorityTopics?.length > 0) {
      return userData.priorityTopics;
    }
    return userData.interruptRules?.keywords || [];
  }, [usePriorityPeople, userData.priorityTopics, userData.interruptRules?.keywords]);

  const systemAlertOptions = [
    "PagerDuty",
    "Datadog",
    "Sentry", 
    "AWS CloudWatch",
    "New Relic",
    "Splunk",
    "Nagios"
  ];

  const addContact = (contactName?: string, contactEmail?: string) => {
    const name = contactName || newContact.trim();
    const email = contactEmail || "";
    
    if (!name) return;
    
    const updatedContacts = [...(userData.interruptRules?.contacts || []), { name, email }];
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        contacts: updatedContacts
      }
    });
    setNewContact("");
    setShowContactSuggestions(false);
  };

  const removeContact = (index: number) => {
    const updatedContacts = (userData.interruptRules?.contacts || []).filter((_: any, i: number) => i !== index);
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        contacts: updatedContacts
      }
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const updatedKeywords = [...(userData.interruptRules?.keywords || []), newKeyword.trim()];
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        keywords: updatedKeywords
      }
    });
    setNewKeyword("");
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = (userData.interruptRules?.keywords || []).filter((_: string, i: number) => i !== index);
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        keywords: updatedKeywords
      }
    });
  };

  const toggleSystemAlert = (alert: string) => {
    const updatedAlerts = selectedSystemAlerts.includes(alert)
      ? selectedSystemAlerts.filter(a => a !== alert)
      : [...selectedSystemAlerts, alert];
    
    setSelectedSystemAlerts(updatedAlerts);
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        systemAlerts: updatedAlerts
      }
    });
  };

  const handleUsePriorityPeopleToggle = (checked: boolean) => {
    setUsePriorityPeople(checked);
    
    if (checked) {
      // Copy priority people and topics to interrupt rules
      const priorityContacts = userData.priorityPeople?.map((person: any) => ({
        name: person.name,
        email: person.email || ""
      })) || [];
      
      const priorityKeywords = userData.priorityTopics || [];
      
      updateUserData({
        interruptRules: {
          ...userData.interruptRules,
          contacts: priorityContacts,
          keywords: priorityKeywords
        }
      });
    } else {
      // Clear interrupt rules when toggled off
      updateUserData({
        interruptRules: {
          ...userData.interruptRules,
          contacts: [],
          keywords: []
        }
      });
    }
  };

  const handleNext = () => {
    updateUserData({
      interruptRules: {
        contacts,
        keywords,
        systemAlerts: selectedSystemAlerts
      }
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-6 w-6 text-red-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Interrupt Rules
          </h1>
          <p className="text-text-secondary max-w-lg mx-auto">
            Set up rules that can pierce through Focus Mode for truly urgent matters only.
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-400" />
          <p className="text-sm text-text-secondary">
            Use sparingly - only for genuine emergencies to maintain focus effectiveness.
          </p>
        </div>
      </div>

      {/* Use Priority People Toggle */}
      {userData.priorityPeople?.length > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-blue-400" />
              <div>
                <h3 className="font-medium text-text-primary text-sm">Use priority settings</h3>
                <p className="text-xs text-text-secondary">
                  Auto-use your priority people and topics.
                </p>
              </div>
            </div>
            <Switch
              checked={usePriorityPeople}
              onCheckedChange={handleUsePriorityPeopleToggle}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {/* Emergency Contacts */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-text-secondary" />
            <h3 className="font-medium text-text-primary">Emergency Contacts</h3>
          </div>
          
          {!usePriorityPeople && (
            <div className="relative">
              <div className="flex space-x-2">
                <Input
                  placeholder="Contact name..."
                  value={newContact}
                  onChange={(e) => {
                    setNewContact(e.target.value);
                    setShowContactSuggestions(e.target.value.length > 0);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addContact()}
                  onFocus={() => setShowContactSuggestions(newContact.length > 0)}
                  onBlur={() => setTimeout(() => setShowContactSuggestions(false), 200)}
                  className="flex-1 bg-white/5 border-white/20 h-9 text-sm"
                />
                <Button 
                  onClick={() => addContact()}
                  disabled={!newContact.trim()}
                  size="sm"
                  className="h-9 px-3"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Contact Suggestions */}
              {showContactSuggestions && filteredContacts.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur border border-white/20 rounded-lg shadow-lg z-10">
                  {filteredContacts.map((contact, index) => (
                    <button
                      key={index}
                      onClick={() => addContact(contact.name, contact.email)}
                      className="w-full text-left px-3 py-2 hover:bg-white/10 first:rounded-t-lg last:rounded-b-lg text-sm"
                    >
                      <div className="font-medium text-text-primary">{contact.name}</div>
                      <div className="text-xs text-text-secondary">{contact.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {contacts.map((contact: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-white/10 text-text-primary text-xs h-6"
                >
                  {contact.name}
                  {!usePriorityPeople && (
                    <button
                      onClick={() => removeContact(index)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Keywords */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Hash className="h-4 w-4 text-text-secondary" />
            <h3 className="font-medium text-text-primary">Emergency Keywords</h3>
          </div>
          
          {!usePriorityPeople && (
            <div className="flex space-x-2">
              <Input
                placeholder="Enter keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                className="flex-1 bg-white/5 border-white/20 h-9 text-sm"
              />
              <Button 
                onClick={addKeyword}
                disabled={!newKeyword.trim()}
                size="sm"
                className="h-9 px-3"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          )}

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {keywords.map((keyword: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-white/10 text-text-primary text-xs h-6"
                >
                  {keyword}
                  {!usePriorityPeople && (
                    <button
                      onClick={() => removeKeyword(index)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-2 w-2" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Alerts */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Bell className="h-4 w-4 text-text-secondary" />
          <h3 className="font-medium text-text-primary">System Alerts</h3>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {systemAlertOptions.map((alert) => (
            <button
              key={alert}
              onClick={() => toggleSystemAlert(alert)}
              className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                selectedSystemAlerts.includes(alert)
                  ? 'bg-primary/20 border-primary/40 text-primary'
                  : 'bg-white/5 border-white/20 text-text-secondary hover:border-white/30'
              }`}
            >
              {alert}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="bg-white/5 border-white/20 text-text-primary hover:bg-white/10"
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          className="bg-primary hover:bg-primary/90"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default InterruptRulesStep;
