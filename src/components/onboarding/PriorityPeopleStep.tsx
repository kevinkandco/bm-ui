
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ProgressIndicator from "./ProgressIndicator";
import { User, Plus, X, Mail, Phone, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface PriorityPeopleStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: Array<{
      name: string;
      role?: string;
      email?: string;
      contactName?: string;
      label?: string;
    }>;
    [key: string]: any;
  };
}

// Define Role as a specific type (union of string literals)
type Role = "Team Lead" | "CEO" | "Project Manager" | "Spouse" | "Client" | "Other";
type Label = "Spouse" | "Manager" | "Collaborator" | "CFO" | "Team Member" | "Client" | "Other";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const PriorityPeopleStep = ({ onNext, onBack, updateUserData, userData }: PriorityPeopleStepProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [activeRoleForContact, setActiveRoleForContact] = useState<string | null>(null);
  const [showContactsDropdown, setShowContactsDropdown] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [customLabel, setCustomLabel] = useState("");
  const [showLabelInput, setShowLabelInput] = useState(false);
  
  // Updated to properly handle the type conversion with userData.priorityPeople
  const [priorityPeople, setPriorityPeople] = useState<Array<{
    name: string;
    role?: Role;
    email?: string;
    contactName?: string;
    label?: string;
  }>>(
    // Convert string roles to Role type if they match, otherwise omit the role
    (userData.priorityPeople || []).map(person => ({
      name: person.name,
      role: person.role as Role, // Type assertion here is needed
      email: person.email,
      contactName: person.contactName,
      label: person.label
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

  // Available labels for contacts
  const labels: Label[] = [
    "Spouse", 
    "Manager", 
    "Collaborator", 
    "CFO", 
    "Team Member", 
    "Client", 
    "Other"
  ];

  // Mock platform contacts for designation
  const [platformContacts] = useState<Contact[]>([
    { id: "p1", name: "Alex Johnson", email: "alex@company.com" },
    { id: "p2", name: "Taylor Swift", email: "taylor@email.com" },
    { id: "p3", name: "Kelsey Smith", email: "kelsey@personal.com" },
    { id: "p4", name: "Jordan Lee", email: "jordan@client.com" },
    { id: "p5", name: "Pat Wilson", email: "pat@partner.com" },
    { id: "p6", name: "Robin Zhang", email: "robin@team.com" },
  ]);
  
  const addPerson = (name: string, email?: string) => {
    if (!name.trim()) return;
    
    // Check if person already exists
    if (!priorityPeople.some(p => p.name === name)) {
      setPriorityPeople(prev => [...prev, { 
        name: name.trim(), 
        email,
        label: selectedLabel || undefined
      }]);
    }
    setInputValue("");
    setSelectedLabel("");
    setCustomLabel("");
    setShowLabelInput(false);
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
  
  const designateContact = (personName: string, contact: Contact) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, contactName: contact.name, email: contact.email } 
          : person
      )
    );
    setActiveRoleForContact(null);
  };
  
  const removePerson = (personName: string) => {
    setPriorityPeople(prev => prev.filter(person => person.name !== personName));
  };
  
  const removeDesignation = (personName: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, contactName: undefined, email: undefined } 
          : person
      )
    );
  };

  const addLabel = (personName: string, label: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, label } 
          : person
      )
    );
  };

  // Filtered contacts based on search query
  const filteredContacts = suggestedContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter platform contacts based on contact search query
  const filteredPlatformContacts = platformContacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  // Filter platform contacts for manual input dropdown
  const filteredManualContacts = platformContacts.filter(contact =>
    contact.name.toLowerCase().includes(inputValue.toLowerCase()) ||
    contact.email.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const handleContinue = () => {
    // Ensure we update user data with the current state, and ensure types are compatible
    updateUserData({ priorityPeople });
    onNext();
  };

  const handleSkip = () => {
    // Just proceed to next step without saving any priority people
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
            className="pl-10 bg-white/10 border-white/20 text-ice-grey placeholder:text-white/50"
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
                  {person.contactName ? (
                    <div className="text-xs text-white/90 flex items-center gap-1">
                      <span className="bg-electric-teal/30 px-1.5 py-0.5 rounded text-white">
                        {person.contactName}
                      </span> 
                      <span className="text-white/50">{person.email}</span>
                    </div>
                  ) : person.email && (
                    <div className="text-xs text-white/50 flex items-center gap-1">
                      <Mail size={10} /> {person.email}
                    </div>
                  )}
                  {person.label && (
                    <div className="text-xs mt-1">
                      <span className="bg-hot-coral/20 px-1.5 py-0.5 rounded text-white">
                        {person.label}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Role select - now just a badge if role is selected */}
                {person.role ? (
                  <span className="text-xs h-6 py-0 px-2 bg-electric-teal/20 border-electric-teal/40 text-white rounded-md">
                    {person.role}
                  </span>
                ) : null}
                
                {/* Just the Select Person button - no more Designate */}
                <Popover 
                  open={activeRoleForContact === person.name}
                  onOpenChange={(open) => {
                    if (open) {
                      setActiveRoleForContact(person.name);
                      setContactSearchQuery('');
                    } else {
                      setActiveRoleForContact(null);
                    }
                  }}
                >
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm" 
                      variant={person.contactName ? "secondary" : "outline"}
                      className={cn(
                        "text-xs h-6 py-0 px-2",
                        person.contactName 
                          ? "bg-hot-coral/20 border-hot-coral/40 text-white" 
                          : "bg-white/10 border-white/20 text-white/70"
                      )}
                    >
                      {person.contactName || "Select Person"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-64 p-0 bg-deep-plum border-white/20" 
                    align="end"
                  >
                    <div className="p-2">
                      <div className="relative mb-2">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                        <Input
                          placeholder="Find a person..."
                          value={contactSearchQuery}
                          onChange={(e) => setContactSearchQuery(e.target.value)}
                          className="pl-7 py-1 h-8 bg-white/10 border-white/20 text-ice-grey placeholder:text-white/40 text-xs"
                        />
                      </div>
                      
                      <div className="max-h-52 overflow-y-auto">
                        {filteredPlatformContacts.length > 0 ? (
                          filteredPlatformContacts.map((contact) => (
                            <div 
                              key={contact.id}
                              className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer"
                              onClick={() => designateContact(person.name, contact)}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 flex items-center justify-center bg-hot-coral/30 rounded-full mr-2">
                                  <User size={12} className="text-white" />
                                </div>
                                <div>
                                  <p className="text-white text-xs">{contact.name}</p>
                                  <p className="text-white/50 text-xs">{contact.email}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-white/50 text-xs p-2">No matching contacts found</p>
                        )}
                      </div>
                      
                      {person.contactName && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full mt-2 text-xs h-7 text-hot-coral hover:text-hot-coral hover:bg-hot-coral/10"
                          onClick={() => removeDesignation(person.name)}
                        >
                          <X size={12} className="mr-1" /> Remove designation
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>

                {/* Label dropdown */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      size="sm" 
                      variant={person.label ? "secondary" : "outline"}
                      className={cn(
                        "text-xs h-6 py-0 px-2",
                        person.label 
                          ? "bg-hot-coral/20 border-hot-coral/40 text-white" 
                          : "bg-white/10 border-white/20 text-white/70"
                      )}
                    >
                      {person.label || "Add Label"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-0 bg-deep-plum border-white/20">
                    <div className="p-2">
                      <div className="space-y-1">
                        {labels.map((label) => (
                          <div 
                            key={label}
                            className="flex items-center p-2 hover:bg-white/10 rounded cursor-pointer"
                            onClick={() => {
                              if (label === "Other") {
                                setShowLabelInput(true);
                              } else {
                                addLabel(person.name, label);
                              }
                            }}
                          >
                            <span className="text-white text-xs">{label}</span>
                          </div>
                        ))}
                        
                        {showLabelInput && (
                          <div className="p-2">
                            <Input
                              placeholder="Custom label..."
                              value={customLabel}
                              onChange={(e) => setCustomLabel(e.target.value)}
                              className="h-8 text-xs mb-2"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="text-xs h-7"
                                onClick={() => {
                                  if (customLabel) {
                                    addLabel(person.name, customLabel);
                                    setShowLabelInput(false);
                                    setCustomLabel("");
                                  }
                                }}
                              >
                                Save
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                className="text-xs h-7"
                                onClick={() => {
                                  setShowLabelInput(false);
                                  setCustomLabel("");
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
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
        
        {/* Manual input with dropdown */}
        <div className="relative">
          <DropdownMenu 
            open={showContactsDropdown && inputValue.length > 0} 
            onOpenChange={setShowContactsDropdown}
          >
            <DropdownMenuTrigger asChild>
              <div className="flex gap-2">
                <Input
                  placeholder="Add someone manually"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="bg-white/15 border-white/20 text-ice-grey placeholder:text-white/50"
                  onFocus={() => setShowContactsDropdown(true)}
                  onKeyPress={(e) => e.key === 'Enter' && addPerson(inputValue)}
                />
                <Select
                  value={selectedLabel}
                  onValueChange={(value) => {
                    if (value === "Other") {
                      setShowLabelInput(true);
                    } else {
                      setSelectedLabel(value as Label);
                      setShowLabelInput(false);
                    }
                  }}
                >
                  <SelectTrigger className="w-[140px] bg-white/15 border-white/20 text-ice-grey">
                    <SelectValue placeholder="Add label..." />
                  </SelectTrigger>
                  <SelectContent className="bg-deep-plum text-ice-grey border-white/20">
                    <SelectItem value="">No label</SelectItem>
                    {labels.map((label) => (
                      <SelectItem key={label} value={label}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </DropdownMenuTrigger>
            
            <DropdownMenuContent 
              className="w-[calc(100%-140px-80px)] bg-deep-plum text-ice-grey border-white/20"
              align="start"
            >
              {filteredManualContacts.length > 0 ? (
                filteredManualContacts.map((contact) => (
                  <DropdownMenuItem
                    key={contact.id}
                    className="flex items-center gap-2 p-2 cursor-pointer"
                    onClick={() => {
                      setInputValue(contact.name);
                      addPerson(contact.name, contact.email);
                      setShowContactsDropdown(false);
                    }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-hot-coral/30 rounded-full">
                      <User size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs">{contact.name}</p>
                      <p className="text-white/50 text-xs">{contact.email}</p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-2 text-white/50 text-sm">No contacts found</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {showLabelInput && selectedLabel === "Other" && (
            <div className="mt-2 p-3 border border-white/20 rounded-md bg-white/10">
              <Label className="text-white text-sm mb-1">Custom label</Label>
              <Textarea
                placeholder="Enter custom label..."
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                className="bg-white/15 border-white/20 text-ice-grey min-h-[40px] mb-2"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => {
                    if (customLabel) {
                      setSelectedLabel(customLabel as Label);
                      setShowLabelInput(false);
                    }
                  }}
                >
                  Set Label
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    setShowLabelInput(false);
                    setSelectedLabel("");
                    setCustomLabel("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested contacts - Updated with inline "Select Person" */}
        <div className="pt-2">
          <h3 className="text-sm font-medium text-ice-grey mb-2">Suggested Contacts</h3>
          <div className="space-y-1.5">
            {filteredContacts.map(contact => {
              const isAdded = priorityPeople.some(p => p.name === contact.name);
              const person = isAdded ? priorityPeople.find(p => p.name === contact.name) : null;
              
              return (
                <div 
                  key={contact.id}
                  className={cn(
                    "flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200",
                    isAdded
                      ? "border-2 border-electric-teal bg-white/20 backdrop-blur-md shadow-neo"
                      : "border border-white/30 bg-white/15 hover:bg-white/25 backdrop-blur-md"
                  )}
                >
                  <div className="flex items-center">
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full mr-3",
                      isAdded 
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
                  
                  <div className="flex items-center gap-2">
                    {!isAdded ? (
                      <Button 
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => addPerson(contact.name, contact.email)}
                      >
                        <Plus size={14} className="mr-1" /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button 
                              size="sm" 
                              variant={person?.contactName ? "secondary" : "outline"}
                              className={cn(
                                "text-xs",
                                person?.contactName 
                                  ? "bg-hot-coral/20 border-hot-coral/40 text-white" 
                                  : "bg-white/10 border-white/20 text-white/70"
                              )}
                            >
                              {person?.contactName || "Select Person"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-64 p-0 bg-deep-plum border-white/20">
                            <div className="p-2">
                              <div className="relative mb-2">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/40" />
                                <Input
                                  placeholder="Find a person..."
                                  value={contactSearchQuery}
                                  onChange={(e) => setContactSearchQuery(e.target.value)}
                                  className="pl-7 py-1 h-8 bg-white/10 border-white/20 text-ice-grey placeholder:text-white/40 text-xs"
                                />
                              </div>
                              
                              <div className="max-h-52 overflow-y-auto">
                                {filteredPlatformContacts.map((platformContact) => (
                                  <div 
                                    key={platformContact.id}
                                    className="flex items-center justify-between p-2 hover:bg-white/10 rounded cursor-pointer"
                                    onClick={() => designateContact(contact.name, platformContact)}
                                  >
                                    <div className="flex items-center">
                                      <div className="w-6 h-6 flex items-center justify-center bg-hot-coral/30 rounded-full mr-2">
                                        <User size={12} className="text-white" />
                                      </div>
                                      <div>
                                        <p className="text-white text-xs">{platformContact.name}</p>
                                        <p className="text-white/50 text-xs">{platformContact.email}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 w-8 p-0 text-white/50 hover:text-hot-coral"
                          onClick={() => removePerson(contact.name)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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
      
      <div className="text-center">
        <Button
          variant="link"
          onClick={handleSkip}
          className="text-white/50 hover:text-white"
        >
          Skip this step
        </Button>
      </div>
    </div>
  );
};

export default PriorityPeopleStep;
