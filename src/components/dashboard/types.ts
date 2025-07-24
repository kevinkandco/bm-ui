export type IStatus = "active" | "away" | "focus" | "app focus" | "vacation";

export interface BriefSchedules {
  id: string;
  name?: string;
  deliveryMethod?: "email" | "audio" | "both";
  scheduleTime: "morning" | "midday" | "evening" | "custom";
  briefTime?: string;
  enabled?: boolean;
  days?: string[];
}

export interface WeekendBrief {
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
}

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
  id: number | string;
  platform?: string;
  message?: string;
  sender?: string;
  time?: string;
  priority?: string;
  title?: string;
  redirectLink?: string;
  channel?: string;
  tag: "Critical" | "Decision" | "Approval" | "Heads-Up";
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

export interface PriorityItems {
  slack?: {
    low: number;
    medium: number;
    high: number;
    action: number;
    total_messages: number;
  };
  gmail?: {
    low: number;
    medium: number;
    high: number;
    action: number;
    total_messages: number;
  };
}

interface TimeSavedBreakdown {
  context_saved: number;
  reading_saved: number;
  processing_saved: number;
}

interface TimeSavedData {
  breakdown: TimeSavedBreakdown;
  brief_total: number;
  baseline_total: number;
  total_saved_minutes: number;
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
  savedTime?: TimeSavedData;
  all_messages?: SummaryMassage[];
  follow_ups?: SummaryMassage[];
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
  platform?: "slack" | "gmail";
  message?: string;
  sender?: string;
  isVip?: boolean;
  priorityPerson?: string; // Name or initials of flagged person
  triggerKeyword?: string; // Matched trigger keyword
  urgency?: "high" | "medium" | "low";
  tag?: "critical" | "decision" | "approval" | "heads-up";
  isNew?: boolean;
  createdAt?: string;
  threadUrl?: string;
  completed?: boolean;
  lastActivity?: string;
  vote?: boolean;
  time?: string;
}

export interface CalendarEvent {
  id: number;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  duration: string;
  date: string; // Format: "YYYY-MM-DD"
  attendee_count: number;
  attendees: { name: string; organizer: boolean; email: string, response_status: string, self: boolean }[];
  proxy_note: string | null;
}

export interface CalenderData {
  today: CalendarEvent[];
  upcoming: CalendarEvent[];
}

export interface Meeting {
  id: string;
  title: string;
  time: string;
  date: string;
  duration: string;
  attendees: Array<{
    name: string;
    email: string;
  }>;
  briefing: string;
  aiSummary: string;
  hasProxy: boolean;
  hasNotes: boolean;
  proxyNotes?: string;
  summaryReady: boolean;
  isRecording: boolean;
  minutesUntil: number;
  context?: {
    relevantEmails?: string[];
    weeklyCheckIns?: string[];
    interests?: string[];
  };
  preparationPoints?: string[];
  suggestedAgenda?: string[];
}
