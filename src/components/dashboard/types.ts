export interface Stats {
  emails?: number;
  messages?: number;
  meetings?: number;
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