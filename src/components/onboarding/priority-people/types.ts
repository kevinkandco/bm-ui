
export type Role = "Team Lead" | "CEO" | "Project Manager" | "Spouse" | "Client" | "Other";
export type Label = "Spouse" | "Manager" | "Collaborator" | "CFO" | "Team Member" | "Client" | "Other";

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface PriorityPerson {
  name: string;
  role?: Role;
  email?: string;
  contactName?: string;
  label?: string;
}

export interface PriorityPeopleStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityPeople: Array<PriorityPerson>;
    [key: string]: any;
  };
}
