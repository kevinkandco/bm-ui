export interface Stats {
  emails?: number;
  messages?: number;
  meetings?: number;
}

export interface Summary {
  id: number;
  user_id: number;
  summary: string;
  audio_path: string;
  created_at: string;
  title?: string;
  description?: string;
  timestamp?: string;
  stats?: Stats;
  saved_time?: string;
  messages: string[];
  messages_count: number;
  task_count: number;
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