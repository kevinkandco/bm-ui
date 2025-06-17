
import React, { useState } from "react";
import { Shield, Plus, X, AlertTriangle, User, Hash, Bell, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const InterruptRulesSection = () => {
  const { toast } = useToast();
  
  const [contacts, setContacts] = useState([
    { name: "Mom", email: "mom@family.com" },
    { name: "Direct Manager", email: "manager@company.com" }
  ]);
  const [keywords, setKeywords] = useState(["emergency", "urgent", "down"]);
  const [systemAlerts, setSystemAlerts] = useState(["PagerDuty", "Datadog"]);
  
  const [newContact, setNewContact] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const systemAlertOptions = [
    "PagerDuty", "Datadog", "Sentry", "AWS CloudWatch", 
    "New Relic", "Splunk", "Nagios", "Grafana"
  ];

  const addContact = () => {
    if (!newContact.trim()) return;
    setContacts(prev => [...prev, { name: newContact.trim(), email: "" }]);
    setNewContact("");
  };

  const removeContact = (index: number) => {
    setContacts(prev => prev.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    setKeywords(prev => [...prev, newKeyword.trim()]);
    setNewKeyword("");
  };

  const removeKeyword = (index: number) => {
    setKeywords(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSystemAlert = (alert: string) => {
    setSystemAlerts(prev =>
      prev.includes(alert)
        ? prev.filter(a => a !== alert)
        : [...prev, alert]
    );
  };

  const handleSaveSettings = () => {
    toast({
      title: "Interrupt Rules Saved",
      description: "Your interrupt rules have been updated successfully",
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">Interrupt Rules</h2>
        <Button 
          onClick={handleSaveSettings}
          className="shadow-subtle hover:shadow-glow transition-all"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary">Emergency Override System</h3>
            <p className="text-sm text-text-secondary mt-1">
              These rules can pierce through Focus Mode and device Do Not Disturb settings. 
              Use sparingly for genuine emergencies only to maintain effectiveness.
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 space-y-8">
        {/* Emergency Contacts */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">Emergency Contacts</h3>
          </div>
          <p className="text-sm text-text-secondary">
            People who can interrupt you for urgent matters. Messages from these contacts will trigger OS notifications even during Focus Mode.
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
              variant="outline"
              className="bg-white/5 border-white/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {contacts.length > 0 && (
            <div className="space-y-2">
              {contacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div>
                    <span className="text-text-primary font-medium">{contact.name}</span>
                    {contact.email && (
                      <span className="text-text-secondary text-sm ml-2">({contact.email})</span>
                    )}
                  </div>
                  <Button
                    onClick={() => removeContact(index)}
                    variant="ghost"
                    size="sm"
                    className="text-text-secondary hover:text-red-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator className="bg-white/10" />

        {/* Emergency Keywords */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Hash className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">Emergency Keywords</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Messages containing these words will trigger interrupt notifications. Choose words that clearly indicate urgent situations.
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
              variant="outline"
              className="bg-white/5 border-white/20"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="flex items-center gap-1 bg-white/10 text-text-primary"
                >
                  "{keyword}"
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
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="h-5 w-5 text-text-secondary" />
            <h3 className="text-lg font-medium text-text-primary">System Alerts</h3>
          </div>
          <p className="text-sm text-text-secondary">
            Select monitoring and alerting systems that can interrupt for critical infrastructure issues.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {systemAlertOptions.map((alert) => (
              <button
                key={alert}
                onClick={() => toggleSystemAlert(alert)}
                className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                  systemAlerts.includes(alert)
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-white/5 border-white/20 text-text-secondary hover:border-white/30'
                }`}
              >
                {alert}
              </button>
            ))}
          </div>

          {systemAlerts.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-text-secondary mb-2">Active system alerts:</p>
              <div className="flex flex-wrap gap-2">
                {systemAlerts.map((alert) => (
                  <Badge key={alert} variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    {alert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary">How it works</h3>
            <p className="text-sm text-text-secondary mt-1">
              When an interrupt rule triggers, Brief-me sends an OS-level notification that bypasses Focus Mode and Do Not Disturb. 
              The triggering event is then discarded and won't appear in your later summaries to keep them clean.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterruptRulesSection;
