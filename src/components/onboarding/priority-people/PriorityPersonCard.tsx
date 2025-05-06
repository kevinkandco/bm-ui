
import { User, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Contact, PriorityPerson, Label } from "./types";

interface PriorityPersonCardProps {
  person: PriorityPerson;
  removePerson: (name: string) => void;
  designateContact: (personName: string, contact: Contact) => void;
  addLabel: (personName: string, label: string) => void;
  contacts: Contact[];
}

export const PriorityPersonCard = ({ 
  person, 
  removePerson, 
  designateContact, 
  addLabel,
  contacts 
}: PriorityPersonCardProps) => {
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  
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
  
  // Filter platform contacts based on contact search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );
  
  const removeDesignation = () => {
    designateContact(person.name, { id: "", name: "", email: "" });
  };

  // Format display name - use contactName if available, otherwise use person.name
  const displayName = person.contactName || person.name;

  return (
    <div className="flex items-center justify-between py-2 px-3 border border-white/30 backdrop-blur-md bg-white/15 rounded-lg transition-all">
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center bg-deep-plum rounded-full mr-3">
          <User size={15} className="text-white" />
        </div>
        <div>
          {/* Display label (role) if present */}
          {person.label && (
            <p className="text-white text-sm font-medium">{person.label}</p>
          )}
          
          {/* Display person name only once */}
          <p className="text-white text-sm font-medium">{displayName}</p>
          
          {/* Display email if available */}
          {person.email && (
            <div className="text-xs text-white/50 flex items-center gap-1">
              <Mail size={10} /> {person.email}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Contact designation button - only if no contact is selected yet */}
        {!person.contactName && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-6 py-0 px-2 bg-white/10 border-white/20 text-white/70"
              >
                Select Person
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-deep-plum border-white/20" align="end">
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
                  {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
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
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Label button - only show if no label is set */}
        {!person.label && (
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                className="text-xs h-6 py-0 px-2 bg-white/10 border-white/20 text-white/70"
              >
                Add Label
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
        )}
        
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
  );
};
