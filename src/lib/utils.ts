import { Stats } from "@/components/dashboard/types";
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


export const transformToStats: (data: any) => Stats = (data: any) => {
  const stats = {
    totalMessagesAnalyzed: {
      total: data.messagesCount || 0,
      breakdown: {
        slack: data.slackMessageCount || 0,
        gmail: data.emailCount || 0,
      },
    },
    lowPriority: {
      total: 0,
      breakdown: { slack: 0, gmail: 0 },
    },
    mediumPriority: {
      total: 0,
      breakdown: { slack: 0, gmail: 0 },
    },
    highPriority: {
      total: 0,
      breakdown: { slack: 0, gmail: 0 },
    },
    actionItems: {
      total: data.actionCount || 0,
      breakdown: { slack: 0, gmail: 0 },
    },
  };

  const platformMap: Record<string, Platform> = {
    S: "slack",
    G: "gmail",
  };

  data.messages.forEach((msg: any) => {
    const platform = platformMap[msg.platform];
    const priority = msg.priority as Priority;

    if (["low", "medium", "high"].includes(priority)) {
      const key = `${priority}Priority` as const;
      stats[key].total += 1;
      stats[key].breakdown[platform] += 1;
    }
  });

  // Calculate proportional actionItem breakdown
  const totalSlack = data.slackMessageCount || 0;
  const totalGmail = data.emailCount || 0;
  const total = totalSlack + totalGmail;

  if (total > 0 && data.actionCount) {
    stats.actionItems.breakdown.slack = Math.round((totalSlack / total) * data.actionCount);
    stats.actionItems.breakdown.gmail = data.actionCount - stats.actionItems.breakdown.slack;
  }

  return stats;
};

