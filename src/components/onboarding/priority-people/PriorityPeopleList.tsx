
import { PriorityPersonCard } from "./PriorityPersonCard";
import { PriorityPerson, Contact } from "./types";

interface PriorityPeopleListProps {
  priorityPeople: PriorityPerson[];
  removePerson: (name: string) => void;
  designateContact: (personName: string, contact: Contact) => void;
  addLabel: (personName: string, label: string) => void;
  contacts: Contact[];
}

export const PriorityPeopleList = ({
  priorityPeople,
  removePerson,
  designateContact,
  addLabel,
  contacts
}: PriorityPeopleListProps) => {
  if (priorityPeople?.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-1.5">
      {priorityPeople?.map((person) => (
        <PriorityPersonCard
          key={person.name}
          person={person}
          removePerson={removePerson}
          designateContact={designateContact}
          addLabel={addLabel}
          contacts={contacts}
        />
      ))}
    </div>
  );
};
