import { useState } from "react";
import { Search, X, Check, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface Group {
  id: string;
  name: string;
  contacts: Contact[];
  isExpanded: boolean;
  isCustom?: boolean;
}

interface PriorityGroupsPickerProps {
  onContactsAdded: (hasContacts: boolean) => void;
}

const PriorityGroupsPicker = ({ onContactsAdded }: PriorityGroupsPickerProps) => {
  const [mockContacts] = useState<Contact[]>([
    { id: "1", name: "Alex Johnson", email: "alex@company.com", avatar: "" },
    { id: "2", name: "Jamie Smith", email: "jamie@company.com", avatar: "" },
    { id: "3", name: "Taylor Wong", email: "taylor@company.com", avatar: "" },
    { id: "4", name: "Casey Brown", email: "casey@company.com", avatar: "" },
    { id: "5", name: "Jordan Lee", email: "jordan@company.com", avatar: "" },
    { id: "6", name: "Morgan Davis", email: "morgan@company.com", avatar: "" },
  ]);

  const [groups, setGroups] = useState<Group[]>([
    { id: "team", name: "Team", contacts: [], isExpanded: false },
    { id: "manager", name: "Manager", contacts: [], isExpanded: false },
    { id: "direct-reports", name: "Direct Reports", contacts: [], isExpanded: false },
    { id: "partner", name: "Partner/Spouse", contacts: [], isExpanded: false },
    { id: "vip", name: "VIP Clients", contacts: [], isExpanded: false },
    { id: "custom", name: "+ Custom Group", contacts: [], isExpanded: false, isCustom: true },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [customGroupName, setCustomGroupName] = useState("");
  const [creatingCustomGroup, setCreatingCustomGroup] = useState(false);

  // Filter contacts based on search term
  const filteredContacts = mockContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if any group has contacts
  const hasAnyContacts = groups.some(group => group.contacts.length > 0);

  // Notify parent component when contacts are added/removed
  useState(() => {
    onContactsAdded(hasAnyContacts);
  });

  const toggleGroupExpansion = (groupId: string) => {
    // Close any currently expanded group
    setGroups(prevGroups => 
      prevGroups.map(group => ({
        ...group,
        isExpanded: group.id === groupId ? !group.isExpanded : false
      }))
    );
    setActiveGroupId(groupId);
    setShowResults(false);
    setSearchTerm("");
    
    // Handle custom group creation
    if (groupId === "custom") {
      setCreatingCustomGroup(true);
    } else {
      setCreatingCustomGroup(false);
    }
  };

  const handleSearchFocus = () => {
    setShowResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const addContact = (groupId: string, contact: Contact) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === groupId) {
          // Check if contact already exists in this group
          if (!group.contacts.some(c => c.id === contact.id)) {
            return {
              ...group,
              contacts: [...group.contacts, contact]
            };
          }
        }
        return group;
      })
    );
    setSearchTerm("");
    onContactsAdded(true);
  };

  const removeContact = (groupId: string, contactId: string) => {
    setGroups(prevGroups => {
      const updatedGroups = prevGroups.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            contacts: group.contacts.filter(c => c.id !== contactId)
          };
        }
        return group;
      });
      
      // Check if any contacts remain across all groups
      const remainingContacts = updatedGroups.some(g => g.contacts.length > 0);
      onContactsAdded(remainingContacts);
      
      return updatedGroups;
    });
  };

  const addNewCustomGroup = () => {
    if (!customGroupName.trim()) return;
    
    const newGroupId = `custom-${Date.now()}`;
    
    setGroups(prevGroups => [
      ...prevGroups.filter(g => g.id !== "custom" || g.isCustom), 
      { 
        id: newGroupId, 
        name: customGroupName, 
        contacts: [], 
        isExpanded: true
      },
      // Keep the "+ Custom Group" option at the end
      { id: "custom", name: "+ Custom Group", contacts: [], isExpanded: false, isCustom: true }
    ]);
    
    setActiveGroupId(newGroupId);
    setCustomGroupName("");
    setCreatingCustomGroup(false);
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Priority Groups</h3>
      <p className="text-sm text-neutral-gray mb-4">Who do you absolutely never want to miss?</p>

      {/* Suggested Contacts (would be generated from actual integrations) */}
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Suggested Frequent Contacts</p>
        <div className="flex flex-wrap gap-2">
          {mockContacts.slice(0, 5).map(contact => (
            <div 
              key={contact.id} 
              className="flex items-center gap-1 px-2 py-1 bg-soft-purple rounded-full cursor-pointer hover:bg-soft-purple/80 transition-colors"
              onClick={() => addContact(groups[0].id, contact)}
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs">{contact.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Group Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {groups.map(group => (
          <div 
            key={group.id}
            className={`border rounded-lg p-3 transition-all ${
              group.isExpanded ? 'bg-soft-gray shadow-sm' : 'hover:bg-soft-gray/50 cursor-pointer'
            } ${group.contacts.length > 0 ? 'border-indigo/30' : 'border-gray-200'}`}
            onClick={() => !group.isExpanded && toggleGroupExpansion(group.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{group.name}</span>
                {group.contacts.length > 0 && (
                  <Check size={16} className="text-green-500" />
                )}
              </div>
              {group.contacts.length > 0 && (
                <span className="text-xs text-neutral-gray">{group.contacts.length}</span>
              )}
            </div>

            {/* Expanded Content */}
            {group.isExpanded && (
              <div className="mt-3 space-y-3" onClick={e => e.stopPropagation()}>
                {group.isCustom && creatingCustomGroup ? (
                  <div className="flex gap-2">
                    <Input 
                      type="text"
                      placeholder="Group name" 
                      value={customGroupName}
                      onChange={e => setCustomGroupName(e.target.value)}
                      className="text-sm"
                      autoFocus
                    />
                    <button 
                      onClick={addNewCustomGroup}
                      className="px-3 py-1 bg-indigo text-white rounded-md text-sm"
                      disabled={!customGroupName.trim()}
                    >
                      Create
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search teammates..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleSearchFocus}
                        className="pl-8 text-sm"
                        autoFocus
                      />
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-gray" />
                    </div>

                    {/* Search Results */}
                    {showResults && searchTerm && (
                      <div className="bg-white border rounded-md shadow-md mt-1 max-h-48 overflow-y-auto">
                        {filteredContacts.length > 0 ? (
                          filteredContacts.map(contact => (
                            <div 
                              key={contact.id}
                              className="px-3 py-2 hover:bg-soft-gray cursor-pointer flex items-center gap-2"
                              onClick={() => addContact(group.id, contact)}
                            >
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs bg-soft-purple/80">{getInitials(contact.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{contact.name}</p>
                                <p className="text-xs text-neutral-gray">{contact.email}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div
                            className="px-3 py-2 hover:bg-soft-gray cursor-pointer"
                            onClick={() => addContact(group.id, { 
                              id: `manual-${Date.now()}`, 
                              name: searchTerm, 
                              email: searchTerm.includes('@') ? searchTerm : `${searchTerm}@example.com`
                            })}
                          >
                            <p className="text-sm">Add "{searchTerm}"</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Selected Contacts */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {group.contacts.map(contact => (
                        <div 
                          key={contact.id}
                          className="flex items-center gap-1 px-2 py-1 bg-soft-purple rounded-full group"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">{getInitials(contact.name)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs">{contact.name}</span>
                          <button 
                            className="h-4 w-4 rounded-full flex items-center justify-center opacity-70 hover:opacity-100"
                            onClick={() => removeContact(group.id, contact.id)}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <button
                        className="text-xs text-neutral-gray hover:text-foreground"
                        onClick={() => toggleGroupExpansion(group.id)}
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriorityGroupsPicker;
