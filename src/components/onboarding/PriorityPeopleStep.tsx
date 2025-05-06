
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { User, Plus, X, Mail, Phone, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";

interface PriorityPeopleStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: Array<{
      name: string;
      role?: string;
      email?: string;
    }>;
    [key: string]: any;
  };
}

// Define Role as a specific type (union of string literals)
type Role = "Team Lead" | "CEO" | "Project Manager" | "Spouse" | "Client" | "Other";

const PriorityPeopleStep = ({ onNext, onBack, updateUserData, userData }: PriorityPeopleStepProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Updated to properly handle the type conversion with userData.priorityPeople
  const [priorityPeople, setPriorityPeople] = useState<Array<{
    name: string;
    role?: Role;
    email?: string;
  }>>(
    // Convert string roles to Role type if they match, otherwise omit the role
    (userData.priorityPeople || []).map(person => ({
      name: person.name,
      role: person.role as Role, // Type assertion here is needed
      email: person.email
    }))
  );
  
  // Mock contacts similar to the integration styling
  const [suggestedContacts] = useState([
    { id: "c1", name: "Team Lead", email: "lead@company.com" },
    { id: "c2", name: "CEO", email: "ceo@company.com" },
    { id: "c3", name: "Project Manager", email: "pm@company.com" },
    { id: "c4", name: "Spouse", email: "spouse@email.com" },
    { id: "c5", name: "Client", email: "client@client.com" },
  ]);

  // Available roles for designation
  const roles: Role[] = [
    "Team Lead", 
    "CEO", 
    "Project Manager", 
    "Spouse", 
    "Client", 
    "Other"
  ];
  
  const addPerson = (name: string, email?: string) => {
    if (!name.trim()) return;
    
    // Check if person already exists
    if (!priorityPeople.some(p => p.name === name)) {
      setPriorityPeople(prev => [...prev, { name: name.trim(), email }]);
    }
    setInputValue("");
  };
  
  const assignRole = (personName: string, role: Role) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, role } 
          : person
      )
    );
  };
  
  const removePerson = (personName: string) => {
    setPriorityPeople(prev => prev.filter(person => person.name !== personName));
  };

  const filteredContacts = suggestedContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleContinue = () => {
    // Ensure we update user data with the current state, and ensure types are compatible
    updateUserData({ priorityPeople });
    onNext();
  };

  return (
    <div className="space-y-6">
      <ProgressIndicator currentStep={4} totalSteps={9} />
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Who are your priority people?</h2>
        <p className="text-white/70">Add important people who should be able to break through Brief-Me barriers.</p>
      </div>
      
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-ice-grey placeholder:text-white/40"
          />
        </div>
        
        {/* Added people list */}
        <div className="space-y-1.5">
          {priorityPeople.map((person) => (
            <div 
              key={person.name}
              className="flex items-center justify-between py-2 px-3 border border-white/30 backdrop-blur-md bg-white/15 rounded-lg transition-all"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-deep-plum rounded-full mr-3">
                  <User size={15} className="text-white" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{person.name}</p>
                  {person.email && (
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <Mail size={10} /> {person.email}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Role dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className={cn(
                        "text-xs h-6 py-0 px-2", 
                        person.role ? "bg-electric-teal/20 border-electric-teal/40 text-white" : "bg-white/10"
                      )}
                    >
                      {person.role || "Designate"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-deep-plum border-white/20">
                    {roles.map((role) => (
                      <DropdownMenuItem 
                        key={role} 
                        onClick={() => assignRole(person.name, role)}
                        className="text-white hover:bg-white/10"
                      >
                        {role}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {/* Remove button */}
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-6 w-6 p-0 text-white/50 hover:text-hot-coral"
                  onClick={() => removePerson(person.name)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Manual input */}
        <div className="flex gap-2">
          <Input
            placeholder="Add someone manually"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="bg-white/15 border-white/20 text-ice-grey placeholder:text-white/50"
            onKeyPress={(e) => e.key === 'Enter' && addPerson(inputValue)}
          />
          <Button 
            onClick={() => addPerson(inputValue)}
            variant="outline"
            className="shrink-0"
            disabled={!inputValue.trim()}
          >
            <Plus size={16} />
            Add
          </Button>
        </div>

        {/* Suggested contacts - List view similar to integrations */}
        <div className="pt-2">
          <h3 className="text-sm font-medium text-ice-grey mb-2">Suggested Contacts</h3>
          <div className="space-y-1.5">
            {filteredContacts.map(contact => (
              <div 
                key={contact.id}
                className={cn(
                  "flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer transition-all duration-200",
                  priorityPeople.some(p => p.name === contact.name)
                    ? "border-2 border-electric-teal bg-white/20 backdrop-blur-md shadow-neo"
                    : "border border-white/30 bg-white/15 hover:bg-white/25 backdrop-blur-md"
                )}
                onClick={() => addPerson(contact.name, contact.email)}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-full mr-3",
                    priorityPeople.some(p => p.name === contact.name) 
                      ? "bg-electric-teal/80" 
                      : "bg-deep-plum"
                  )}>
                    <User size={15} className="text-white" />
                  </div>
                  
                  <div>
                    <p className="text-white text-sm font-medium">{contact.name}</p>
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <Mail size={10} /> {contact.email}
                    </div>
                  </div>
                </div>
                
                <div>
                  {priorityPeople.some(p => p.name === contact.name) ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-electric-teal/20 text-white">
                      Added
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              className="text-white/50 hover:text-ice-grey"
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
