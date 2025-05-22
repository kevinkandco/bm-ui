export interface Stats {
  emails?: number;
  messages?: number;
  meetings?: number;
}

export interface BriefSchedules {
    id: string;
    name?: string;
    deliveryMethod?: "email" | "audio" | "both";
    scheduleTime: "morning" | "midday" | "evening" | "custom";
    briefTime?: string;
    enabled?: boolean;
    days?: string[];
  }

export interface SummaryMassage {
	platform?: string;
	message?: string;
	sender?: string;
	time?: string;
	priority?: string;
  title?: string;
}

export interface Summary {
  id: number;
  user_id?: number;
  summary?: string;
  audioPath?: string;
  created_at?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  stats?: Stats;
  savedTime?: string;
  messages?: SummaryMassage[];
  messagesCount?: number;
  taskCount?: number;
  monitoringChannels?: string;
  summaryTime?: string;
  ended_at?: string;
  start_at?: string;
}

export interface PriorityPeople {
  name: string;
  email?: string;
  label?: string;
  title?: string;
  avatar?: string;
  active?: boolean;
  platform?: string;
  lastActivity?: string;
}