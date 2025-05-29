
import { useState, useCallback, useMemo, useEffect } from "react";
import { Contact, PriorityPerson, Label } from "./types";
import { useApi } from "@/hooks/useApi";


export function usePriorityPeopleState(initialPeople: PriorityPerson[] = []) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [priorityPeople, setPriorityPeople] = useState<PriorityPerson[]>(initialPeople);
  const [suggestedContacts, setSuggestedContacts] = useState<Contact[] | null>(null);
  const [platformContacts, setPlatformContacts] = useState<Contact[] | null>(null);
  const { call } = useApi();

  const getContact = useCallback(async (): Promise<void> => {
    const response = await call("get", "/api/slack/dms/contacts");

    if (response) {
      setPlatformContacts(response?.contacts);
      setSuggestedContacts(response?.contacts);
    }
  }, [call]);

  useEffect(() => {
		getContact();
	}, [getContact]);

  // Get filtered contacts based on input value - memoized for performance
  const filteredManualContacts = useMemo(() => 
    platformContacts?.filter(contact =>
      contact.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      contact.email.toLowerCase().includes(inputValue.toLowerCase())
    ),
    [platformContacts, inputValue]
  );
  
  // Function to add a person to the priority list
  const addPerson = useCallback((name: string, email?: string, avatar?: string) => {
    if (!name.trim()) return;
    
    setPriorityPeople(prev => {
      // Check if person already exists
      if (prev.some(p => p.name === name)) return prev;
      
      return [...prev, { 
        name: name.trim(), 
        email,
        label: selectedLabel || undefined,
        avatar: avatar || undefined,
      }];
    });
    
    setInputValue("");
    setSelectedLabel("");
  }, [selectedLabel]);
  
  // Function to remove a person from the priority list
  const removePerson = useCallback((personName: string) => {
    setPriorityPeople(prev => prev.filter(person => person.name !== personName));
  }, []);
  
  // Function to designate a contact for a person
  const designateContact = useCallback((personName: string, contact: Contact) => {
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
  }, []);
  
  // Function to add a label to a person
  const addLabel = useCallback((personName: string, label: string) => {
    setPriorityPeople(prev => 
      prev.map(person => 
        person.name === personName 
          ? { ...person, label } 
          : person
      )
    );
  }, []);

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
