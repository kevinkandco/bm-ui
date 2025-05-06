import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { User, Plus, X, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriorityPeopleStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: string[];
    [key: string]: any;
  };
}

const PriorityPeopleStep = ({ onNext, onBack, updateUserData, userData }: PriorityPeopleStepProps) => {
  const [inputValue, setInputValue] = useState("");
  const [priorityPeople, setPriorityPeople] = useState<string[]>(userData.priorityPeople || []);
  
  // Mock contacts for the demo - in real implementation, would be fetched from the user's device/integrations
  const [suggestedContacts] = useState([
    { id: "c1", name: "Team Lead", email: "lead@company.com" },
    { id: "c2", name: "CEO", email: "ceo@company.com" },
    { id: "c3", name: "Project Manager", email: "pm@company.com" },
    { id: "c4", name: "Spouse", email: "spouse@email.com" },
    { id: "c5", name: "Client", email: "client@client.com" },
  ]);
  
  const addPerson = () => {
    if (!inputValue.trim()) return;
    
    setPriorityPeople(prev => [...prev, inputValue.trim()]);
    setInputValue("");
  };
  
  const removePerson = (person: string) => {
    setPriorityPeople(prev => prev.filter(item => item !== person));
  };
  
  const addContactAsPriority = (contact: { name: string; email: string }) => {
    // Check if already added to avoid duplicates
    if (!priorityPeople.includes(contact.name)) {
      setPriorityPeople(prev => [...prev, contact.name]);
    }
  };
  
  const handleContinue = () => {
    updateUserData({ priorityPeople });
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={4} totalSteps={9} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Who are your priority people?</h2>
        <p className="text-cool-slate">Add important people who should be able to break through Brief-Me barriers. We'll prioritize messages from these contacts.</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="priority-person" className="text-ice-grey">Add important people</Label>
          <p className="text-sm text-cool-slate -mt-1">
            Add your boss, spouse, team members, or anyone else whose messages should always be flagged.
          </p>
          <div className="flex gap-2">
            <Input
              id="priority-person"
              placeholder="Enter name or email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              className="bg-canvas-black/80 border-cool-slate/20 text-ice-grey"
            />
            <Button 
              onClick={addPerson}
              variant="outline"
              className="shrink-0"
            >
              <Plus size={16} />
              Add
            </Button>
          </div>
          
          {priorityPeople.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {priorityPeople.map(person => (
                <div key={person} className="flex items-center gap-1 px-3 py-1 rounded-full bg-deep-plum/30 border border-electric-teal/20 text-sm text-ice-grey">
                  <User size={14} className="text-electric-teal" />
                  {person}
                  <button onClick={() => removePerson(person)} className="ml-1 focus:outline-none text-cool-slate hover:text-hot-coral">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Contacts suggestion section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-lg font-medium text-ice-grey">Suggested Contacts</h3>
          <p className="text-sm text-cool-slate">
            Select from your recent contacts or connected accounts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestedContacts.map(contact => (
              <button
                key={contact.id}
                onClick={() => addContactAsPriority(contact)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border text-left",
                  priorityPeople.includes(contact.name)
                    ? "bg-deep-plum/40 border-electric-teal/30 text-electric-teal"
                    : "bg-canvas-black/50 border-cool-slate/20 text-ice-grey hover:border-cool-slate/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-deep-plum/50 flex items-center justify-center text-electric-teal">
                    <User size={20} />
                  </div>
                  <div>
                    <div className="font-medium">{contact.name}</div>
                    <div className="text-sm text-cool-slate flex items-center gap-1">
                      <Mail size={12} /> {contact.email}
                    </div>
                  </div>
                </div>
                {priorityPeople.includes(contact.name) && (
                  <div className="text-electric-teal">Added</div>
                )}
              </button>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              className="text-cool-slate hover:text-ice-grey"
            >
              <Phone size={16} className="mr-2" />
              Import from contacts
            </Button>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          onClick={onBack} 
          variant="plain"
          size="none"
          className="text-off-white hover:text-electric-teal transition-colors"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue}
          className="neon-button"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityPeopleStep;
