
import { PriorityPersonCard } from "./PriorityPersonCard";
import { PriorityPerson, Contact } from "./types";

interface PriorityPeopleListProps {
  priorityPeople: PriorityPerson[];
  removePerson: (personId: string | number) => void;
  designateContact: (personId: string | number, contact: Contact) => void;
  addLabel: (personId: string | number, label: string) => void;
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
          key={person.id}
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
