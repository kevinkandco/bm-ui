import { PriorityItems, Stats, Summary } from "@/components/dashboard/types";
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

export function getTimePeriod(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes;

  const periods = {
    morning: totalMinutes >= 360 && totalMinutes < 720,
    midday: totalMinutes >= 720 && totalMinutes < 1020,
    evening: totalMinutes >= 1020 && totalMinutes < 1440
  };

  return periods;
}


export const transformToStats: (data: Summary) => Stats = (data: Summary) => {
  const slackCount = data.slackMessageCount || 0;
  const gmailCount = data.emailCount || 0;
  const actionCount = data.actionCount || 0;
  const priorityItems = data.priorityItems || {} as PriorityItems;

  const gmailPriority = priorityItems.gmail || { low: 0, medium: 0, high: 0 };
  const slackPriority = priorityItems.slack || { low: 0, medium: 0, high: 0 };

  const stats: Stats = {
    totalMessagesAnalyzed: {
      total: data.messagesCount || 0,
      breakdown: {
        slack: slackCount,
        gmail: gmailCount,
      },
    },
    lowPriority: {
      total: slackPriority.low + gmailPriority.low,
      breakdown: {
        slack: slackPriority.low,
        gmail: gmailPriority.low,
      },
    },
    mediumPriority: {
      total: slackPriority.medium + gmailPriority.medium,
      breakdown: {
        slack: slackPriority.medium,
        gmail: gmailPriority.medium,
      },
    },
    highPriority: {
      total: slackPriority.high + gmailPriority.high,
      breakdown: {
        slack: slackPriority.high,
        gmail: gmailPriority.high,
      },
    },
    actionItems: {
      total: actionCount,
      breakdown: {
        slack: 0,
        gmail: 0,
      },
    },
  };

  // Proportional action item split
  const total = slackCount + gmailCount;
  if (total > 0 && actionCount) {
    const slackRatio = slackCount / total;
    stats.actionItems.breakdown.slack = Math.round(slackRatio * actionCount);
    stats.actionItems.breakdown.gmail = actionCount - stats.actionItems.breakdown.slack;
  }

  return stats;
};


export const enrichBriefsWithStats = (briefs: Summary[]) => {
  return briefs.map((brief) => {
    const {
      slackMessageCount = 0,
      emailCount = 0,
      messagesCount = 0,
      actionCount = 0,
      priorityItems = {} as PriorityItems,
    } = brief;

    const gmailPriority = priorityItems?.gmail || { low: 0, medium: 0, high: 0 };
    const slackPriority = priorityItems?.slack || { low: 0, medium: 0, high: 0 };

    const stats = {
      totalMessagesAnalyzed: {
        total: messagesCount,
        breakdown: {
          slack: slackMessageCount,
          gmail: emailCount,
        },
      },
      lowPriority: {
        total: slackPriority.low + gmailPriority.low,
        breakdown: {
          slack: slackPriority.low,
          gmail: gmailPriority.low,
        },
      },
      mediumPriority: {
        total: slackPriority.medium + gmailPriority.medium,
        breakdown: {
          slack: slackPriority.medium,
          gmail: gmailPriority.medium,
        },
      },
      highPriority: {
        total: slackPriority.high + gmailPriority.high,
        breakdown: {
          slack: slackPriority.high,
          gmail: gmailPriority.high,
        },
      },
      actionItems: {
        total: actionCount,
        breakdown: { slack: 0, gmail: 0 }, // will compute proportionally
      },
    };

    // Proportional action item split
    const total = slackMessageCount + emailCount;
    if (total > 0 && actionCount) {
      const slackRatio = slackMessageCount / total;
      stats.actionItems.breakdown.slack = Math.round(slackRatio * actionCount);
      stats.actionItems.breakdown.gmail = actionCount - stats.actionItems.breakdown.slack;
    }

    return {
      ...brief,
      stats,
    };
  });
};
