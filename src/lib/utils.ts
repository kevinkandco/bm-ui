import { CalendarEvent, Meeting, PriorityItems, Stats, Summary } from "@/components/dashboard/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

type Platform = "slack" | "gmail";
type Priority = "low" | "medium" | "high";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function getTimePeriod(time: string | undefined | null) {
  const periods = {
    morning: false,
    midday: false,
    evening: false,
  };

  if (!time || typeof time !== "string") return periods;

  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  // Validate hours and minutes
  if (
    isNaN(hours) || isNaN(minutes) ||
    hours < 0 || hours > 23 ||
    minutes < 0 || minutes > 59
  ) {
    return periods;
  }

  const totalMinutes = hours * 60 + minutes;

  return {
    morning: totalMinutes >= 360 && totalMinutes < 720,   // 06:00 - 11:59
    midday: totalMinutes >= 720 && totalMinutes < 1020,   // 12:00 - 16:59
    evening: totalMinutes >= 1020 && totalMinutes < 1440, // 17:00 - 23:59
  };
}


export const transformToStats: (data: Summary) => Stats = (data: Summary) => {
  const priorityItems = data.priorityItems || {} as PriorityItems;

  const slack = priorityItems.slack || { low: 0, medium: 0, high: 0, action: 0, total_messages: 0 };
  const gmail = priorityItems.gmail || { low: 0, medium: 0, high: 0, action: 0, total_messages: 0 };

  const slackCount = slack.total_messages || 0;
  const gmailCount = gmail.total_messages || 0;

  const slackAction = slack.action || 0;
  const gmailAction = gmail.action || 0;

  const stats: Stats = {
    totalMessagesAnalyzed: {
      total: slackCount + gmailCount,
      breakdown: {
        slack: slackCount,
        gmail: gmailCount,
      },
    },
    lowPriority: {
      total: slack.low + gmail.low,
      breakdown: {
        slack: slack.low,
        gmail: gmail.low,
      },
    },
    mediumPriority: {
      total: slack.medium + gmail.medium,
      breakdown: {
        slack: slack.medium,
        gmail: gmail.medium,
      },
    },
    highPriority: {
      total: slack.high + gmail.high,
      breakdown: {
        slack: slack.high,
        gmail: gmail.high,
      },
    },
    actionItems: {
      total: slackAction + gmailAction,
      breakdown: {
        slack: slackAction,
        gmail: gmailAction,
      },
    },
  };

  return stats;
};


export const enrichBriefsWithStats = (briefs: Summary[]) => {
  return briefs.map((brief) => {
    const priorityItems = brief.priorityItems || {} as PriorityItems;

    const slack = priorityItems.slack || { low: 0, medium: 0, high: 0, action: 0, total_messages: 0 };
    const gmail = priorityItems.gmail || { low: 0, medium: 0, high: 0, action: 0, total_messages: 0 };

    const slackCount = slack.total_messages || 0;
    const gmailCount = gmail.total_messages || 0;

    const slackAction = slack.action || 0;
    const gmailAction = gmail.action || 0;

    const stats = {
      totalMessagesAnalyzed: {
        total: slackCount + gmailCount,
        breakdown: {
          slack: slackCount,
          gmail: gmailCount,
        },
      },
      lowPriority: {
        total: slack.low + gmail.low,
        breakdown: {
          slack: slack.low,
          gmail: gmail.low,
        },
      },
      mediumPriority: {
        total: slack.medium + gmail.medium,
        breakdown: {
          slack: slack.medium,
          gmail: gmail.medium,
        },
      },
      highPriority: {
        total: slack.high + gmail.high,
        breakdown: {
          slack: slack.high,
          gmail: gmail.high,
        },
      },
      actionItems: {
        total: slackAction + gmailAction,
        breakdown: {
          slack: slackAction,
          gmail: gmailAction,
        },
      },
    };

    return {
      ...brief,
      stats,
    };
  });
};

export function convertToMeetings(calendarItems: CalendarEvent[] = []): Meeting[] {
  const now = new Date();

  return calendarItems.map((item) => {
    const eventDateTime = new Date(`${item.date} ${item.start_time}`);
    const minutesUntil = Math.round((eventDateTime.getTime() - now.getTime()) / 60000);

    return {
      id: item.id.toString(),
      title: item.title,
      time: item.start_time,
      date: item.date,
      duration: item.duration,
      attendees: (item.attendees || []).map((a) => ({
        name: a.name || "Unknown",
        email: a.email || "",
      })),
      briefing: item.description || "No briefing available.",
      aiSummary: item.description || "No AI summary available.",
      hasProxy: false,
      hasNotes: !!item.proxy_note,
      proxyNotes: item.proxy_note || "",
      summaryReady: false,
      isRecording: false,
      minutesUntil,
    };
  });
}