
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
  const [showLabelInput, setShowLabelInput] = useState(false);
  
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
  const filteredContacts = searchQuery.trim() 
    ? suggestedContacts?.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedContacts;

  // Filter platform contacts based on contact search query
  const filteredPlatformContacts = platformContacts?.filter(contact =>
    contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(contactSearchQuery.toLowerCase())
  );

  // Check if a contact is already in priority people
  const isContactAdded = (contact: Contact) => {
    // return priorityPeople.some(p => p.name === contact.name || p.email === contact.email);
    return priorityPeople.some(p => p.name === contact.name || (p.email != "N/A" && p.email === contact.email) );
  };

  // Handle designation and label selection
  const handleDesignate = (contact: Contact) => {
    // Toggle label selector for this contact
    setShowLabelSelector(prev => prev === contact.id ? null : contact.id);
  };

  // Handle label selection
  const handleLabelSelect = (contactId: string, label: string) => {
    // Find the contact
    const contact = suggestedContacts.find(c => c.id === contactId);
    if (contact) {
      // Add the person first if not already added
      if (!isContactAdded(contact)) {
        addPerson(contact.name, contact.email);
      }
      
      // Then add the label with a slight delay to ensure person is added first
      setTimeout(() => {
        addLabel(contact.name, label);
        setShowLabelSelector(null);
        setCustomLabel("");
      }, 100);
    }
  };

  return (
    <div className="pt-2">
      <h3 className="text-sm font-medium text-foreground dark:text-ice-grey mb-2">Suggested Contacts</h3>
      <div className="space-y-1.5">
        {filteredContacts?.map(contact => {
          const isAdded = isContactAdded(contact);
          const person = isAdded ? 
            priorityPeople.find(p => p.name === contact.name || p.email === contact.email) : null;
          
          return (
            <div 
              key={contact.id}
              className={cn(
                "flex items-center justify-between py-2 px-3 rounded-lg transition-all duration-200",
                isAdded
                  ? "border-2 border-electric-teal bg-white/30 dark:bg-white/20 backdrop-blur-md shadow-neo"
                  : "border border-black/40 dark:border-white/30 bg-white/25 dark:bg-white/15 hover:bg-white/35 dark:hover:bg-white/25 backdrop-blur-md shadow-sm"
              )}
            >
              <div className="flex items-center">
                <div className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full mr-3",
                  isAdded 
                    ? "bg-electric-teal/80" 
                    : "bg-foreground/90 dark:bg-deep-plum"
                )}>
                  <User size={15} className="text-white" />
                </div>
                
                <div>
                  <p className="text-foreground dark:text-white text-sm font-medium">{contact.name}</p>
                  <div className="text-xs text-foreground/80 dark:text-white/50 flex items-center gap-1">
                    <Mail size={10} /> {contact.email}
                  </div>
                  {person?.label && (
                    <p className="text-xs text-electric-teal mt-0.5">{person.label}</p>
                  )}
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
                        variant="black"
                        className="rounded-full"
                        onClick={() => handleDesignate(contact)}
                      >
                        <Plus size={14} className="mr-1" /> Designate
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-0 bg-card border-border">
                      <div className="p-2">
                        <p className="text-xs text-foreground/80 dark:text-white/70 p-2">Add a label (optional)</p>
                        <div className="space-y-1">
                          {labels.map((label) => (
                            <div 
                              key={label}
                              className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                              onClick={() => handleLabelSelect(contact.id, label)}
                            >
                              <span className="text-foreground dark:text-white text-xs">{label}</span>
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
                                      handleLabelSelect(contact.id, customLabel);
                                    }
                                  }}
                                >
                                  Save
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  className="text-xs h-7"
                                  onClick={() => setShowLabelInput(false)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}
                          <div 
                            className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                            onClick={() => handleLabelSelect(contact.id, "")}
                          >
                            <span className="text-foreground dark:text-white text-xs">No Label</span>
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Label management button */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-white/20 dark:bg-white/10 border-black/30 dark:border-white/20 text-foreground/80 dark:text-white/70 text-xs"
                        >
                          {person?.label ? "Update Label" : "Add Label"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-48 p-0 bg-card border-border">
                        <div className="p-2">
                          <div className="space-y-1">
                            {labels.map((label) => (
                              <div 
                                key={label}
                                className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                                onClick={() => addLabel(contact.name, label)}
                              >
                                <span className="text-foreground dark:text-white text-xs">{label}</span>
                              </div>
                            ))}
                            {/* Option to remove label if one exists */}
                            {person?.label && (
                              <div 
                                className="flex items-center p-2 hover:bg-accent/15 dark:hover:bg-white/10 rounded cursor-pointer"
                                onClick={() => addLabel(contact.name, "")}
                              >
                                <span className="text-foreground/70 dark:text-white/70 text-xs">Remove Label</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                    
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-foreground/60 dark:text-white/50 hover:text-destructive"
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
          className="text-foreground/60 dark:text-white/50 hover:text-foreground dark:hover:text-ice-grey"
        >
          <Search size={16} className="mr-2" />
          Import from contacts
        </Button>
      </div>
    </div>
  );
};
