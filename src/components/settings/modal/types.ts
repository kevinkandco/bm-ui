import { PriorityPerson } from "@/components/onboarding/priority-people/types";

export interface SlackData {
  priorityPeople: PriorityPerson[];
  priorityChannels: string[];
  priorityTopics: string[];
  ignoreChannels: string[];
  ignoreKeywords: string[];
  includeIgnoredInSummary: boolean;
}


export interface SettingsTabProps {
  slackData: SlackData;
  setSlackData: React.Dispatch<React.SetStateAction<SlackData>>;
  SyncLoading: boolean;
  syncData: () => Promise<void>;
  provider: { id: number; name: string };
  shouldRefreshContacts?: boolean;
  setShouldRefreshContacts?: React.Dispatch<React.SetStateAction<boolean>>;
}