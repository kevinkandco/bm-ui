export interface BriefSchedules {
  id: string;
  name?: string;
  deliveryMethod?: "email" | "audio" | "both";
  scheduleTime: "morning" | "midday" | "evening" | "custom";
  briefTime?: string;
  enabled?: boolean;
  days?: string[];
}

export interface UserSchedule {
  workday_start: string;
  workday_end: string;
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
  status: "success" | "failed" | "pending";
  error?: string;
  ended_at?: string;
  read_at?: string | null;
  start_at?: string;
  slackMessageCount: number;
  emailCount: number;
  meetingCount: number;
  actionCount: number;
  sections:
    {
      title: string;
      timestamp: number;
      content: string;
    }[];  // Array of objects, optional
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

export interface Priorities {
  priorityPeople: PriorityPeople[];
  priorityChannels: {name: string, active: boolean}[];
  triggers: string[];
}