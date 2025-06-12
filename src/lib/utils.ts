import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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

