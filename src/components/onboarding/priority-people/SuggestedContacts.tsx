
import { User, Plus, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { Contact, PriorityPerson } from "./types";

interface SuggestedContactsProps {
  suggestedContacts: Contact[];
  priorityPeople: PriorityPerson[];
  platformContacts: Contact[];
  addPerson: (name: string, email?: string) => void;
  removePerson: (name: string) => void;
  designateContact: (personName: string, contact: Contact) => void;
  searchQuery: string;
}

export const SuggestedContacts = ({
  suggestedContacts,
  priorityPeople,
  platformContacts,
  addPerson,
  removePerson,
  designateContact,
  searchQuery
}: SuggestedContactsProps) => {
  const [contactSearchQuery, setContactSearchQuery] = useState("");
  
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
                  <Button 
                    size="sm"
                    className="bg-white/10 text-white hover:bg-white/20"
                    onClick={() => addPerson(contact.name, contact.email)}
                  >
                    <Plus size={14} className="mr-1" /> Add
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    {/* Only show Select Person button if no contact is assigned */}
                    {!person?.contactName && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="bg-white/10 border-white/20 text-white/70 text-xs"
                          >
                            Select Person
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
