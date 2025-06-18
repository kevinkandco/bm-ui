import { useState, useCallback, useMemo, useEffect } from "react";
import { Contact, PriorityPerson, Label } from "./types";
import { useApi } from "@/hooks/useApi";

export function useGmailPriorityPeopleState(id: number, initialPeople: PriorityPerson[] = []) {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [priorityPeople, setPriorityPeople] = useState<PriorityPerson[]>(initialPeople);
  const [suggestedContacts, setSuggestedContacts] = useState<Contact[] | null>(null);
  const [platformContacts, setPlatformContacts] = useState<Contact[] | null>(null);
  const { call } = useApi();

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const response = await call("get", `/api/email/contacts/${id}`);
    if (response) {
      setPlatformContacts(response.contacts || []);
      setSuggestedContacts(response.contacts || []);
    }
    setLoading(false);
  }, [call, id]);

  useEffect(() => {
    if (id) fetchContacts();
  }, [id, fetchContacts]);

  const filteredManualContacts = useMemo(() =>
    platformContacts?.filter(contact =>
      contact.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      contact.email.toLowerCase().includes(inputValue.toLowerCase())
    ),
    [platformContacts, inputValue]
  );

  const addPerson = useCallback((id: number | string,name: string, email?: string, avatar?: string, label?: string) => {
    if (!name.trim()) return;

    setPriorityPeople(prev => {
    if (prev.some(p => p.id === id)) return prev;

      return [
        ...prev,
        {
          id: id || Math.random(),
          name: name.trim(),
          email,
          avatar,
          label: label || selectedLabel || undefined,
        },
      ];
    });

    setInputValue("");
    setSelectedLabel("");
  }, [selectedLabel]);

  const removePerson = useCallback((personId: number | string) => {
    setPriorityPeople((prev) => prev.filter((person) => person.id !== personId));
  }, []);

  const designateContact = useCallback((personId: number | string, contact: Contact) => {
    setPriorityPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? {
              ...person,
              contactName: contact.name || undefined,
              email: contact.email || undefined,
            }
          : person
      )
    );
  }, []);

  const addLabel = useCallback((personId: number | string, label: string) => {
    setPriorityPeople((prev) =>
      prev.map((person) =>
        person.id === personId
          ? { ...person, label }
          : person
      )
    );
  }, []);

  return {
    loading,
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
