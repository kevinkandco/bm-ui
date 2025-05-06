
import { useState } from "react";
import { Contact, PriorityPerson, Label } from "./types";

export function usePriorityPeopleState(initialPeople: PriorityPerson[] = []) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [priorityPeople, setPriorityPeople] = useState<PriorityPerson[]>(initialPeople);
  
  // Mock platform contacts for designation
  const [platformContacts] = useState<Contact[]>([
    { id: "p1", name: "Alex Johnson", email: "alex@company.com" },
    { id: "p2", name: "Taylor Swift", email: "taylor@email.com" },
    { id: "p3", name: "Kelsey Smith", email: "kelsey@personal.com" },
    { id: "p4", name: "Jordan Lee", email: "jordan@client.com" },
    { id: "p5", name: "Pat Wilson", email: "pat@partner.com" },
    { id: "p6", name: "Robin Zhang", email: "robin@team.com" },
  ]);
  
  // Suggested contacts - using actual contacts instead of roles
  const [suggestedContacts] = useState<Contact[]>([
    { id: "c1", name: "Morgan Freeman", email: "morgan@company.com" },
    { id: "c2", name: "Emma Watson", email: "emma@company.com" },
    { id: "c3", name: "Chris Evans", email: "chris@company.com" },
    { id: "c4", name: "Jennifer Lopez", email: "jlo@email.com" },
    { id: "c5", name: "Ryan Reynolds", email: "ryan@client.com" },
  ]);

  // Get filtered contacts based on input value
  const getFilteredContacts = (query: string) => {
    return platformContacts.filter(contact =>
      contact.name.toLowerCase().includes(query.toLowerCase()) ||
      contact.email.toLowerCase().includes(query.toLowerCase())
    );
  };
  
  const filteredManualContacts = getFilteredContacts(inputValue);
  
  // Function to add a person to the priority list
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
  };
  
  // Function to remove a person from the priority list
  const removePerson = (personName: string) => {
    setPriorityPeople(prev => prev.filter(person => person.name !== personName));
  };
  
  // Function to designate a contact for a person
  const designateContact = (personName: string, contact: Contact) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { 
              ...person, 
              contactName: contact.name || undefined, 
              email: contact.email || undefined 
            } 
          : person
      )
    );
  };
  
  // Function to add a label to a person
  const addLabel = (personName: string, label: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, label } 
          : person
      )
    );
  };

  return {
    inputValue,
    setInputValue,
    searchQuery,
    setSearchQuery,
    selectedLabel,
    setSelectedLabel,
    priorityPeople,
    setPriorityPeople,
    platformContacts,
    suggestedContacts,
    filteredManualContacts,
    addPerson,
    removePerson,
    designateContact,
    addLabel
  };
}
