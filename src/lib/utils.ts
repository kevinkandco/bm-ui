import { CalendarEvent, Meeting, PriorityItems, Stats, Summary } from "@/components/dashboard/types";
import { clsx, type ClassValue } from "clsx"
import moment from "moment";
import { twMerge } from "tailwind-merge"

type Platform = "slack" | "gmail";
type Priority = "low" | "medium" | "high";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function capitalizeFirstLetter(str: string) {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export function getTimePeriodInObject(time: string | undefined | null) {
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
    morning: totalMinutes >= 360 && totalMinutes <= 720, // 06:00–12:00
    midday: totalMinutes >= 721 && totalMinutes <= 1020, // 12:01–17:00
    evening: totalMinutes >= 1021 && totalMinutes <= 1320, // 17:01–22:00
  };
}

export function convertTo12Hour(time24: string): string | null {
  if (typeof time24 !== 'string') return null;

  const parsed = moment(time24, 'HH:mm', true); // 'true' enables strict parsing

  return parsed.isValid() ? parsed.format('hh:mm A') : null;
}

export function getTimePeriod(time: string | undefined | null) {

  if (!time || typeof time !== "string") return "morning";

  const [hoursStr, minutesStr] = time.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  // Validate hours and minutes
  if (
    isNaN(hours) || isNaN(minutes) ||
    hours < 0 || hours > 23 ||
    minutes < 0 || minutes > 59
  ) {
    return "morning";
  }

  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes >= 360 && totalMinutes <= 720) return "morning";
  if (totalMinutes >= 721 && totalMinutes <= 1020) return "midday";
  if (totalMinutes >= 1021 && totalMinutes <= 1320) return "evening";
  if (totalMinutes >= 1321 || totalMinutes <= 300) return "night";
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
        response_status: a.response_status || "",
        self: a.self || "",
      })),
      description: item.description || "No description available.",
      briefing: "",
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