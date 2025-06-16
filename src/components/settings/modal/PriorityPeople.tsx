import { ManualInputSection } from "@/components/onboarding/priority-people/ManualInputSection";
import { PriorityPeopleList } from "@/components/onboarding/priority-people/PriorityPeopleList";
import { SuggestedContacts } from "@/components/onboarding/priority-people/SuggestedContacts";
import {
  Contact,
  Label,
  PriorityPerson,
} from "@/components/onboarding/priority-people/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi } from "@/hooks/useApi";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SettingsTabProps } from "./types";
import FancyLoader from "./FancyLoader";

const Provider = {
  slack: "slack",
  google: "email",
}

const PriorityPeople = ({
  slackData,
  setSlackData,
  SyncLoading,
  syncData,
  provider
}: SettingsTabProps) => {
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Label | "">("");
  const [suggestedContacts, setSuggestedContacts] = useState<Contact[]>([]);
  const [platformContacts, setPlatformContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const { call } = useApi();

  const getContact = useCallback(async (): Promise<void> => {
    setLoadingContacts(true);
    const response = await call("get", `/api/${Provider[provider?.name]}/contacts?id=${provider?.id}`);

    if (response) {
      setPlatformContacts(response?.contacts);
      setSuggestedContacts(response?.contacts);
    }
    setLoadingContacts(false);
  }, [call, provider]);

  useEffect(() => {
    getContact();
  }, [getContact]);

  const filteredManualContacts = useMemo(
    () =>
      platformContacts?.filter(
        (contact) =>
          contact?.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          contact?.email.toLowerCase().includes(inputValue.toLowerCase())
      ),
    [platformContacts, inputValue]
  );

  const addPerson = useCallback(
    (name: string, email?: string, avatar?: string) => {
      if (!name.trim()) return;

      setSlackData((prev) => {
        // Check if person already exists
        if (prev.priorityPeople.some((p) => p.id === id)) return prev;

        return {
          ...prev,
          priorityPeople: [
            ...prev.priorityPeople,
            {
              id: Math.random(),
              name: name.trim(),
              email,
              label: selectedLabel || undefined,
              avatar: avatar || undefined,
            },
          ],
        };
      });

      setInputValue("");
      setSelectedLabel("");
    },
    [selectedLabel, setSlackData]
  );

  const removePerson = useCallback(
    (personId: string | number, ) => {
      setSlackData((prev) => ({
        ...prev,
        priorityPeople: prev.priorityPeople.filter(
          (p) => p.id !== personId
        ),
      }));
    },
    [setSlackData]
  );

  const designateContact = useCallback(
    (personId: string | number, contact: Contact) => {
      setSlackData((prev) => ({
        ...prev,
        priorityPeople: prev.priorityPeople.map((person) =>
          person.id === personId
            ? {
                ...person,
                contactName: contact.name || undefined,
                email: contact.email || undefined,
              }
            : person
        ),
      }));
    },
    [setSlackData]
  );

  const addLabel = useCallback(
    (personId: string | number, label: string) => {
      setSlackData((prev) => ({
        ...prev,
        priorityPeople: prev.priorityPeople.map((person) =>
          person.id === personId ? { ...person, label } : person
        ),
      }));
    },
    [setSlackData]
  );

  return (
    <>
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold text-white mb-4">
          Who are your priority people?
        </h2>
        <Button
          variant="outline"
          size="none"
          onClick={syncData}
          disabled={SyncLoading}
          className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white px-2 py-1"
        >
          {SyncLoading && (
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
          )}
          {SyncLoading ? "Syncing" : "Sync"}
        </Button>
      </div>
      <div className="space-y-3 mb-2">
        <p className="text-foreground/70 dark:text-white/70">
          Designate important people who should be able to break through
          Brief-Me barriers.
        </p>
      </div>
      {loadingContacts ? (
        <FancyLoader />
      ) : (
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50 dark:text-white/40" />
            <Input
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 dark:bg-white/10 border-black/30 dark:border-white/20 text-foreground dark:text-ice-grey placeholder:text-foreground/60 dark:placeholder:text-white/50"
            />
          </div>

          {/* Added people list */}
          <PriorityPeopleList
            priorityPeople={slackData?.priorityPeople}
            removePerson={removePerson}
            designateContact={designateContact}
            addLabel={addLabel}
            contacts={platformContacts}
          />

          {/* Manual input with dropdown */}
          <ManualInputSection
            inputValue={inputValue}
            setInputValue={setInputValue}
            selectedLabel={selectedLabel}
            setSelectedLabel={setSelectedLabel}
            addPerson={addPerson}
            filteredManualContacts={filteredManualContacts}
          />

          {/* Suggested contacts */}
          <SuggestedContacts
            suggestedContacts={suggestedContacts}
            priorityPeople={slackData?.priorityPeople}
            platformContacts={platformContacts}
            addPerson={addPerson}
            removePerson={removePerson}
            designateContact={designateContact}
            addLabel={addLabel}
            searchQuery={searchQuery}
          />
        </div>
      )}
    </>
  );
};

export default PriorityPeople;
