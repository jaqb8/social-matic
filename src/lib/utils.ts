import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatValueWithinRange(
  value: string,
  min: number,
  max: number,
) {
  let intValue = parseInt(value, 10);

  if (isNaN(intValue) || intValue < min) {
    intValue = min;
  } else if (intValue > max) {
    intValue = max;
  }

  return intValue.toString().padStart(2, "0");
}

export const buildCronFromDate = (date: Date) =>
  `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
    date.getMonth() + 1
  } *`;
