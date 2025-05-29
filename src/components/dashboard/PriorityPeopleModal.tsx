
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PriorityPeople } from "./types";

interface PriorityPeopleModalProps {
  open: boolean;
  onClose: () => void;
  priorityPeople: PriorityPeople[],
  setPriorityPeople: React.Dispatch<React.SetStateAction<PriorityPeople[]>>
}

const BaseURL = import.meta.env.VITE_API_HOST;
const PriorityPeopleModal = ({ open, onClose, priorityPeople, setPriorityPeople }: PriorityPeopleModalProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [newPersonName, setNewPersonName] = useState("");
  const [newPersonTitle, setNewPersonTitle] = useState("");

  const filteredPeople = priorityPeople?.filter(person => 
    (person?.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (person?.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleRemovePerson = (name: string) => {
    setPriorityPeople(prev => prev.filter(person => person.name !== name));
  };

  const handleToggleActive = (name: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === name 
          ? { ...person, active: !person.active } 
          : person
      )
    );
  };

  const handleChangePlatform = (name: string, platform: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === name 
          ? { ...person, platform } 
          : person
      )
    );
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    
    const newPerson = {
      name: newPersonName.trim(),
      title: newPersonTitle.trim() || "Team Member",
      lastActivity: "Just added",
      platform: "Email",
      active: true,
      avatar: ""
    };
    
    setPriorityPeople(prev => [...prev, newPerson]);
    setNewPersonName("");
    setNewPersonTitle("");
  };

  const handleSave = () => {
    toast({
      title: "Priority People Updated",
      description: "Your priority people list has been updated successfully"
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-background/80 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-blue-400" />
            Manage Priority People
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Add, remove or modify your high-priority contacts
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          {/* Search and Add section */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input 
                placeholder="Search people..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10"
              />
            </div>
            
            <div className="flex items-end gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-person" className="text-white/70">Add new person</Label>
                <Input 
                  id="new-person"
                  placeholder="Name" 
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="new-title" className="text-white/70">Title/Role</Label>
                <Input 
                  id="new-title"
                  placeholder="Title (optional)" 
                  value={newPersonTitle}
                  onChange={(e) => setNewPersonTitle(e.target.value)}
                  className="bg-white/5 border-white/10"
                />
              </div>
              <Button 
                onClick={handleAddPerson}
                className="bg-blue-600 text-white hover:bg-blue-700 h-10"
                disabled={!newPersonName.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* People list */}
          <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
            {filteredPeople?.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-white/50">No people found matching your search</p>
              </div>
            ) : (
              filteredPeople?.map((person) => (
                <div 
                  key={person?.name} 
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={person?.avatar ? person?.avatar : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=${person?.name}`} alt={person?.name} />
                      <AvatarFallback className="bg-accent-primary/20 text-accent-primary">
                        {person?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">{person?.name}</h3>
                      <p className="text-sm text-white/60">{person?.title || 'Product Manager'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Select 
                      defaultValue={person?.platform || 'Email'}
                      onValueChange={(value) => handleChangePlatform(person?.name, value)}
                    >
                      <SelectTrigger className="w-[100px] h-8 text-xs bg-white/10 border-white/10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background/80 backdrop-blur-xl border-white/10">
                        <SelectGroup>
                          <SelectLabel className="text-white/70">Platform</SelectLabel>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Slack">Slack</SelectItem>
                          <SelectItem value="Calendar">Calendar</SelectItem>
                          <SelectItem value="Teams">Teams</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 rounded-full ${person?.active ? 'bg-green-500/20 text-green-500' : 'bg-white/10 text-white/50'}`}
                      onClick={() => handleToggleActive(person?.name)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-500"
                      onClick={() => handleRemovePerson(person?.name)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-white/20 text-white/70 hover:bg-white/10 hover:text-white">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 text-white hover:bg-blue-700">
            <Check className="mr-2 h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PriorityPeopleModal;
