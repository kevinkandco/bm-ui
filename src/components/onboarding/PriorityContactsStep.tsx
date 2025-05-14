import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Plus, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProgressIndicator from "./ProgressIndicator";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface PriorityContactsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityContacts: Contact[];
    [key: string]: any;
  };
}

const PriorityContactsStep = ({ onNext, onBack, updateUserData, userData }: PriorityContactsStepProps) => {
  const [contacts, setContacts] = useState<Contact[]>(userData.priorityContacts || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  // Mock contacts for demo
  const [mockContacts] = useState<Contact[]>([
    { id: "1", name: "Alex Johnson", email: "alex@company.com", avatar: "" },
    { id: "2", name: "Jamie Smith", email: "jamie@company.com", avatar: "" },
    { id: "3", name: "Taylor Wong", email: "taylor@company.com", avatar: "" },
    { id: "4", name: "Casey Brown", email: "casey@company.com", avatar: "" },
    { id: "5", name: "Jordan Lee", email: "jordan@company.com", avatar: "" },
    { id: "6", name: "Morgan Davis", email: "morgan@company.com", avatar: "" },
  ]);

  // Filter contacts based on search term
  const filteredContacts = mockContacts.filter(contact => 
    !contacts.some(c => c.id === contact.id) && (
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const addContact = (contact: Contact) => {
    if (!contacts.some(c => c.id === contact.id)) {
      const updatedContacts = [...contacts, contact];
      setContacts(updatedContacts);
      updateUserData({ priorityContacts: updatedContacts });
    }
    setSearchTerm("");
  };

  const removeContact = (contactId: string) => {
    const updatedContacts = contacts.filter(c => c.id !== contactId);
    setContacts(updatedContacts);
    updateUserData({ priorityContacts: updatedContacts });
  };

  const addManualContact = () => {
    if (!searchTerm.trim()) return;
    
    const newContact = { 
      id: `manual-${Date.now()}`, 
      name: searchTerm, 
      email: searchTerm.includes('@') ? searchTerm : `${searchTerm}@example.com`
    };
    
    addContact(newContact);
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <div className="space-y-8">
      <ProgressIndicator currentStep={4} totalSteps={6} />
      
      {/* Visual element */}
      <div className="h-24 w-full flex items-center justify-center relative mb-8">
        <div className="relative">
          <Users size={48} className="text-electric-teal opacity-70" />
          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-hot-coral flex items-center justify-center text-xs text-canvas-black font-bold">
            !
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold text-ice-grey tracking-tighter">Who matters most?</h2>
        <p className="text-white/70">Never miss messages from your highest priority contacts.</p>
      </div>
      
      <div className="space-y-5">
        {/* Add contact input - updated with lighter background */}
        <div className="relative">
          <Input
            type="text"
            placeholder="Search contacts or type a name..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={handleSearchFocus}
            className="pl-10 bg-white/15 border-white/20 text-ice-grey placeholder:text-white/50"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
          
          {showResults && searchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-canvas-black border border-white/20 rounded-md shadow-md max-h-60 overflow-y-auto">
              {filteredContacts.length > 0 ? (
                filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="px-4 py-2 hover:bg-deep-plum/30 cursor-pointer flex items-center gap-3"
                    onClick={() => addContact(contact)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-deep-plum/50 text-electric-teal">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-ice-grey">{contact.name}</p>
                      <p className="text-xs text-white/50">{contact.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div 
                  className="px-4 py-3 hover:bg-deep-plum/30 cursor-pointer"
                  onClick={addManualContact}
                >
                  <div className="flex items-center gap-2">
                    <Plus size={18} className="text-electric-teal" />
                    <span className="text-ice-grey">Add "{searchTerm}" as contact</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Selected contacts - updated styling to match integration cards */}
        <div>
          <h3 className="text-sm font-medium text-white/70 mb-3">Priority Contacts ({contacts.length})</h3>
          
          {contacts.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-white/20 rounded-lg">
              <p className="text-white/70">Add people you never want to miss</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-1.5">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className="flex items-center justify-between py-2 px-3 rounded-lg border border-white/30 bg-white/15 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-deep-plum/50 text-electric-teal">
                        {getInitials(contact.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-ice-grey">{contact.name}</p>
                      <p className="text-xs text-white/50">{contact.email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 text-white/50 hover:text-hot-coral hover:bg-transparent"
                    onClick={() => removeContact(contact.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          onClick={onBack} 
          variant="back"
          size="none"
        >
          Back
        </Button>
        <Button 
          onClick={handleContinue} 
          variant="primary"
          size="pill"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PriorityContactsStep;
