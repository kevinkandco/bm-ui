import { PriorityPerson } from "@/components/onboarding/priority-people/types";

export interface ProviderData {
  priorityPeople: PriorityPerson[];
  priorityChannels: string[];
  priorityTopics: string[];
  ignoreChannels: string[];
  ignoreKeywords: string[];
  aiFeatures: {
    autoLabel: boolean;
    autoSort: boolean;
    autoArchive: boolean;
    priorityOnly: boolean;
  };
  interruptRules: {
    contacts: { name: string; email: string }[];
    keywords: string[];
    systemAlerts: string[];
  }
  includeIgnoredInSummary: boolean;
}

export interface SettingsTabProps {
  providerData: ProviderData;
  setProviderData: React.Dispatch<React.SetStateAction<ProviderData>>;
  SyncLoading: boolean;
  syncData: () => Promise<void>;
  loadingProviderData: boolean;
  provider: { id: number; name: string };
  shouldRefreshContacts?: boolean;
  setShouldRefreshContacts?: React.Dispatch<React.SetStateAction<boolean>>;
}
