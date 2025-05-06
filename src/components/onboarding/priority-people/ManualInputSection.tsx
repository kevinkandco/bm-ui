
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Contact, Label as ContactLabel } from "./types";

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

  const handleAdd = () => {
    // Add the person with the current input value
    if (inputValue.trim()) {
      addPerson(inputValue);
      setInputValue("");
    }
  };

  return (
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
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
            <Select
              value={selectedLabel}
              onValueChange={(value) => {
                if (value === "Other") {
                  setShowLabelInput(true);
                } else {
                  setSelectedLabel(value as ContactLabel);
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
              onClick={handleAdd}
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
                  addPerson(contact.name);
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
        </div>
      )}
    </div>
  );
};
