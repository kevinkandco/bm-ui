
import React, { useState } from "react";
import { Shield, Plus, X, AlertTriangle, User, Hash, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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

  const contacts = userData.interruptRules?.contacts || [];
  const keywords = userData.interruptRules?.keywords || [];

  const systemAlertOptions = [
    "PagerDuty",
    "Datadog",
    "Sentry", 
    "AWS CloudWatch",
    "New Relic",
    "Splunk",
    "Nagios"
  ];

  const addContact = () => {
    if (!newContact.trim()) return;
    
    const updatedContacts = [...contacts, { name: newContact.trim(), email: "" }];
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        contacts: updatedContacts
      }
    });
    setNewContact("");
  };

  const removeContact = (index: number) => {
    const updatedContacts = contacts.filter((_: any, i: number) => i !== index);
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        contacts: updatedContacts
      }
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    
    const updatedKeywords = [...keywords, newKeyword.trim()];
    updateUserData({
      interruptRules: {
        ...userData.interruptRules,
        keywords: updatedKeywords
      }
    });
    setNewKeyword("");
  };

  const removeKeyword = (index: number) => {
    const updatedKeywords = keywords.filter((_: string, i: number) => i !== index);
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
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-red-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Interrupt Rules
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Set up rules that can pierce through Focus Mode and Do Not Disturb. 
            These should be reserved for truly urgent matters only.
          </p>
        </div>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary">Use sparingly</h3>
            <p className="text-sm text-text-secondary mt-1">
              Interrupt rules bypass all focus settings. Only add contacts, keywords, and alerts 
              for genuine emergencies to maintain the effectiveness of your focus time.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Interrupt Contacts */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">Emergency Contacts</h3>
          </div>
          <p className="text-sm text-text-secondary">
            People who can interrupt you for urgent matters (family, direct manager, etc.)
          </p>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter contact name"
              value={newContact}
              onChange={(e) => setNewContact(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addContact()}
              className="flex-1 bg-white/5 border-white/20"
            />
            <Button 
              onClick={addContact}
              disabled={!newContact.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {contacts.map((contact: any, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-white/10 text-text-primary"
                >
                  {contact.name}
                  <button
                    onClick={() => removeContact(index)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Interrupt Keywords */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Hash className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">Emergency Keywords</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Words or phrases that signal urgent situations (e.g., "emergency", "urgent", "down")
          </p>
          
          <div className="flex space-x-2">
            <Input
              placeholder="Enter keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              className="flex-1 bg-white/5 border-white/20"
            />
            <Button 
              onClick={addKeyword}
              disabled={!newKeyword.trim()}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword: string, index: number) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-white/10 text-text-primary"
                >
                  {keyword}
                  <button
                    onClick={() => removeKeyword(index)}
                    className="ml-1 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* System Alerts */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">System Alerts</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Monitoring and alerting systems that can interrupt for critical issues
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {systemAlertOptions.map((alert) => (
              <button
                key={alert}
                onClick={() => toggleSystemAlert(alert)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
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
      </div>

      <div className="flex justify-between pt-6">
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
