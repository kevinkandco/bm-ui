import { ConnectedAccount } from "@/components/settings/types";

export interface PriorityChannelsStepProps {
  onNext: () => void;
  onBack: () => void;
  updateUserData: (data: any) => void;
  userData: {
    priorityChannels: string[];
    integrations: any[];
    [key: string]: any;
  };
  connectedAccount: ConnectedAccount[];
}

export interface PriorityChannels {
  id?: number | string;
  name?: string;
  email?: string;
  avatar?: string;
  text?: string;
  channel_type?: number;
  is_channel?: number;
  is_selected?: number;
  is_direct_message?: number;
  parent_id?: number;
  slack_id?: string;
  sender_slack_id?: number;
  sender?: string;
  updated_at?: string;
  user_id?: number;
  workspace_id?: number;
  sent_at?: string;
  created_at?: string;
}
