import { LucideProps } from "lucide-react";

export interface BriefSchedules {
  id: string;
  name?: string;
  deliveryMethod?: "email" | "audio" | "both";
  scheduleTime: "morning" | "midday" | "evening" | "custom";
  briefTime?: string;
  enabled?: boolean;
  days?: string[];
}

export interface WeekendBrief{
    enabled: boolean;
    deliveryMethod: "email" | "audio" | "both";
    deliveryTime: string;
    weekendDays: string[];
    coveragePeriod: {
      startDay: string;
      startTime: string;
      endDay: string;
      endTime: string;
    };
  };

export interface UserSchedule {
  workday_start: string;
  workday_end: string;
}

export interface DailySchedule {
  workdayStart: string;
  workdayEnd: string;
  weekendMode: boolean;
}

export interface SummaryMassage {
  id: number;
  platform?: string;
  message?: string;
  sender?: string;
  time?: string;
  priority?: string;
  title?: string;
  redirectLink?: string;
  channel?: string;
}

export interface Stats {
  totalMessagesAnalyzed: {
    total: number;
    breakdown: {
      slack: number;
      gmail: number;
    };
  };
  lowPriority: {
    total: number;
    breakdown: {
      slack: number;
      gmail: number;
    };
  };
  mediumPriority: {
    total: number;
    breakdown: {
      slack: number;
      gmail: number;
    };
  };
  highPriority: {
    total: number;
    breakdown: {
      slack: number;
      gmail: number;
    };
  };
  actionItems: {
    total: number;
    breakdown: {
      slack: number;
      gmail: number;
    };
  };
}

export interface PriorityItems{
    slack?: { low: number; medium: number; high: number, action: number, total_messages: number };
    gmail?: { low: number; medium: number; high: number, action: number, total_messages: number };
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
  time: string;
  emailCount: number;
  meetingCount: number;
  actionCount: number;
  delivery_at: string;
  vote: null | "like" | "dislike";
  stats: Stats;
  priorityItems: PriorityItems;
  sections: {
    title: string;
    timestamp: number;
    content: string;
  }[]; // Array of objects, optional
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
  priorityChannels: { name: string; active: boolean }[];
  triggers: string[];
  integrations: {
    name: string;
    active: boolean;
  }[];
}

export interface ActionItem {
  id?: string;
  title?: string;
  platform?: 'slack' | 'gmail';
  message?: string;
  sender?: string;
  isVip?: boolean;
  priorityPerson?: string; // Name or initials of flagged person
  triggerKeyword?: string; // Matched trigger keyword
  urgency?: 'critical' | 'high' | 'medium' | 'low';
  isNew?: boolean;
  createdAt?: string;
  threadUrl?: string;
  completed?: boolean;
  lastActivity?: string;
  vote?: boolean;
}