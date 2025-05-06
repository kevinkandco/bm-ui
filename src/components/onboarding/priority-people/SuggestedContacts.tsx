
import { User, Plus, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Contact, PriorityPerson, Label } from "./types";

interface SuggestedContactsProps {
  suggestedContacts: Contact[];
  priorityPeople: PriorityPerson[];
  platformContacts: Contact[];
  addPerson: (name: string, email?: string) => void;
  removePerson: (name: string) => void;
  designateContact: (personName: string, contact: Contact) => void;
  addLabel: (personName: string, label: string) => void;
  searchQuery: string;
}

export const SuggestedContacts = ({
  suggestedContacts,
  priorityPeople,
  platformContacts,
  addPerson,
  removePerson,
  designateContact,
  addLabel,
  searchQuery
}: SuggestedContactsProps) => {
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  const [showLabelSelector, setShowLabelSelector] = useState<string | null>(null);
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

  // Handle designation and label selection
  const handleDesignate = (contact: Contact) => {
    // Toggle label selector for this contact
    setShowLabelSelector(prev => prev === contact.id ? null : contact.id);
  };

  // Handle label selection
  const handleLabelSelect = (contactId: string, label: string) => {
    // First add person if not already added
    const contact = suggestedContacts.find(c => c.id === contactId);
    if (contact) {
      // Add the person first
      addPerson(contact.name, contact.email);
      
      // Then add the label (with a slight delay to ensure person is added first)
      setTimeout(() => {
        addLabel(contact.name, label);
        setShowLabelSelector(null);
        setCustomLabel("");
      }, 100);
    }
  };

  return (
    <div className="pt-2">
      <h3 className="text-sm font-medium text-ice-grey mb-2">Suggested Contacts</h3>
      <div className="space-y-1.5">
        {filteredContacts.map(contact => {
          const isAdded = priorityPeople.some(p => p.name === contact.name);
          const person = isAdded ? priorityPeople.find(p => p.name === contact.name) : null;
          
          // Format display name - use contactName if available, otherwise use contact.name
          const displayName = person?.contactName || contact.name;
          
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
                  {person?.label && (
                    <p className="text-white text-sm font-medium">{person.label}</p>
                  )}
                  <p className="text-white text-sm font-medium">{displayName}</p>
                  <div className="text-xs text-white/50 flex items-center gap-1">
                    <Mail size={10} /> {contact.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isAdded ? (
                  <Popover open={showLabelSelector === contact.id} onOpenChange={(open) => {
                    if (!open) setShowLabelSelector(null);
                  }}>
                    <PopoverTrigger asChild>
                      <Button 
                        size="sm"
                        className="bg-white/10 text-white hover:bg-white/20"
                        onClick={() => handleDesignate(contact)}
                      >
                        <Plus size={14} className="mr-1" /> Designate
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0 bg-deep-plum border-white/20">
                      <div className="p-2">
                        <p className="text-xs text-white/70 p-2">Add a label (optional)</p>
                        <div className="space-y-1">
                          {labels.map((label) => (
                            <div 
                              key={label}
                              className="flex items-center p-2 hover:bg-white/10 rounded cursor-pointer"
                              onClick={() => {
                                if (label === "Other") {
                                  // Show custom label input field
                                  // This would be implemented with a state toggle
                                } else {
                                  handleLabelSelect(contact.id, label);
                                }
                              }}
                            >
                              <span className="text-white text-xs">{label}</span>
                            </div>
                          ))}
                          <div 
                            className="flex items-center p-2 hover:bg-white/10 rounded cursor-pointer"
                            onClick={() => handleLabelSelect(contact.id, "")}
                          >
                            <span className="text-white text-xs">No Label</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Only show Add Label button if no label is set */}
                    {!person?.label && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white/70 text-xs"
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
                                      // Show custom label input field
                                    } else {
                                      addLabel(contact.name, label);
                                    }
                                  }}
                                >
                                  <span className="text-white text-xs">{label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                    
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
          <Search size={16} className="mr-2" />
          Import from contacts
        </Button>
      </div>
    </div>
  );
};
