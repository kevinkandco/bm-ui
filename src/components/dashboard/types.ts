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
}