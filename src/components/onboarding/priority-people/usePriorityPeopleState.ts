
import { useState, useCallback, useMemo, useEffect } from "react";
import { Contact, PriorityPerson, Label } from "./types";
import Http from "@/Http";
import { useNavigate } from "react-router-dom";

const BaseURL = import.meta.env.VITE_API_HOST;

export function usePriorityPeopleState(initialPeople: PriorityPerson[] = []) {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [priorityPeople, setPriorityPeople] = useState<PriorityPerson[]>(initialPeople);
  const [suggestedContacts, setSuggestedContacts] = useState<Contact[] | null>(null);
  const [platformContacts, setPlatformContacts] = useState<Contact[] | null>(null);

  const navigate = useNavigate();

  
  // Mock platform contacts for designation - moved to useMemo to prevent recreation on every render
  // const platformContacts = useMemo<Contact[]>(() => [
  //   { id: "p1", name: "Alex Johnson", email: "alex@company.com" },
  //   { id: "p2", name: "Taylor Swift", email: "taylor@email.com" },
  //   { id: "p3", name: "Kelsey Smith", email: "kelsey@personal.com" },
  //   { id: "p4", name: "Jordan Lee", email: "jordan@client.com" },
  //   { id: "p5", name: "Pat Wilson", email: "pat@partner.com" },
  //   { id: "p6", name: "Robin Zhang", email: "robin@team.com" },
  // ], []);
  
  // Suggested contacts - using actual contacts instead of roles
  // const suggestedContacts = useMemo<Contact[]>(() => [
  //   { id: "c1", name: "Morgan Freeman", email: "morgan@company.com" },
  //   { id: "c2", name: "Emma Watson", email: "emma@company.com" },
  //   { id: "c3", name: "Chris Evans", email: "chris@company.com" },
  //   { id: "c4", name: "Jennifer Lopez", email: "jlo@email.com" },
  //   { id: "c5", name: "Ryan Reynolds", email: "ryan@client.com" },
  // ], []);

  const getContact = useCallback(async (): Promise<void> => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }
      Http.setBearerToken(token);
      const response = await Http.callApi("get", `${BaseURL}/api/slack/dms/contacts`, null, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (response) { 
        setPlatformContacts(response?.data?.contacts);
        setSuggestedContacts(response?.data?.contacts);
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, []);

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
  const addPerson = useCallback((name: string, email?: string) => {
    if (!name.trim()) return;
    
    setPriorityPeople(prev => {
      // Check if person already exists
      if (prev.some(p => p.name === name)) return prev;
      
      return [...prev, { 
        name: name.trim(), 
        email,
        label: selectedLabel || undefined
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
