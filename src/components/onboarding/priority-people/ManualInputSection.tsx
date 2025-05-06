
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Contact, Label as ContactLabel } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ManualInputSectionProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedLabel: ContactLabel | "";
  setSelectedLabel: (value: ContactLabel | "") => void;
  addPerson: (name: string) => void;
  filteredManualContacts: Contact[];
}

export const ManualInputSection = ({
  inputValue,
  setInputValue,
  selectedLabel,
  setSelectedLabel,
  addPerson,
  filteredManualContacts
}: ManualInputSectionProps) => {
  const [showContactsDropdown, setShowContactsDropdown] = useState(false);
  const [showLabelInput, setShowLabelInput] = useState(false);
  const [customLabel, setCustomLabel] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Available labels for contacts
  const labels: ContactLabel[] = [
    "Spouse", 
    "Manager", 
    "Collaborator", 
    "CFO", 
    "Team Member", 
    "Client", 
    "Other"
  ];

  const handleDesignate = () => {
    // Add the person with the current input value
    if (inputValue.trim()) {
      addPerson(inputValue);
      setInputValue("");
    }
  };

  // Filter contacts based on search query
  const displayedContacts = searchQuery.trim() 
    ? filteredManualContacts.filter(contact => 
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredManualContacts;

  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left font-normal bg-white/15 border-white/20 text-ice-grey"
          >
            <Search className="mr-2 h-4 w-4" />
            Designate someone manually
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-deep-plum border-white/20">
          <div className="p-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/15 border-white/20 text-ice-grey placeholder:text-white/50"
                autoFocus
              />
            </div>
            
            <div className="max-h-52 overflow-y-auto">
              {displayedContacts.length > 0 ? (
                displayedContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded cursor-pointer"
                    onClick={() => {
                      setInputValue(contact.name);
                      addPerson(contact.name);
                      
                      // Show label selection after selecting user
                      setShowLabelInput(true);
                    }}
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-hot-coral/30 rounded-full">
                      <User size={12} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white text-xs">{contact.name}</p>
                      <p className="text-white/50 text-xs">{contact.email}</p>
                    </div>
                  </div>
                ))
              ) : (
                searchQuery.trim() ? (
                  <div className="p-2 text-white/50 text-sm">No users found</div>
                ) : (
                  <div className="p-2 text-white/50 text-sm">Type to search for users</div>
                )
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Optional label selection after user has been designated */}
      {showLabelInput && (
        <div className="mt-2 p-3 border border-white/20 rounded-md bg-white/10">
          <Label className="text-white text-sm mb-1">Add a label (optional)</Label>
          <Select
            value={selectedLabel}
            onValueChange={(value) => {
              if (value === "Other") {
                setShowLabelInput(true);
                setCustomLabel("");
              } else if (value === "_none") {
                setSelectedLabel("");
                setShowLabelInput(false);
              } else {
                setSelectedLabel(value as ContactLabel);
                setShowLabelInput(false);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white/15 border-white/20 text-ice-grey mt-1 mb-2">
              <SelectValue placeholder="Select a label..." />
            </SelectTrigger>
            <SelectContent className="bg-deep-plum text-ice-grey border-white/20">
              <SelectItem value="_none">No label</SelectItem>
              {labels.map((label) => (
                <SelectItem key={label} value={label}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedLabel === "Other" && (
            <>
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
                      setSelectedLabel(customLabel as ContactLabel);
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
            </>
          )}
        </div>
      )}
    </div>
  );
};
