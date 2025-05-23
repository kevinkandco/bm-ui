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
  redirectLink?: string;
}

export interface Summary {
  id: number;
  user_id?: number;
  summary?: string;
  audioPath?: string;
  created_at?: string;
  title?: string;
  description?: string;
  duration?: string;
  timestamp?: string;
  savedTime?: string;
  messages?: SummaryMassage[];
  messagesCount?: number;
  taskCount?: number;
  summaryTime?: string;
  ended_at?: string;
  start_at?: string;
  slackMessageCount: number;
  emailCount: number;
  meetingCount: number;
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