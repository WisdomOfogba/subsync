import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type BillingCycle = "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

function startOfDay(date: Date): Date {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addBillingPeriod(date: Date, cycle: string): Date {
  const next = new Date(date);
  switch (cycle) {
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "QUARTERLY":
      next.setMonth(next.getMonth() + 3);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
    case "MONTHLY":
    default:
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}

/** Advance an anchor billing date until it is today or in the future. */
export function getUpcomingChargeDate(anchor: Date | string, cycle: string, from = new Date()): Date {
  let next = startOfDay(new Date(anchor));
  const today = startOfDay(from);
  let safety = 0;
  while (next < today && safety < 600) {
    next = addBillingPeriod(next, cycle);
    safety += 1;
  }
  return next;
}

export function daysUntil(date: Date | string, from = new Date()): number {
  const target = startOfDay(new Date(date));
  const today = startOfDay(from);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function billingCycleLabel(cycle?: string): string {
  switch (cycle) {
    case "WEEKLY":
      return "Weekly";
    case "QUARTERLY":
      return "Quarterly";
    case "YEARLY":
      return "Yearly";
    default:
      return "Monthly";
  }
}

export function toMonthlyAmount(amount: number, cycle?: string): number {
  switch (cycle) {
    case "WEEKLY":
      return (amount * 52) / 12;
    case "QUARTERLY":
      return amount / 3;
    case "YEARLY":
      return amount / 12;
    default:
      return amount;
  }
}

export function convertCurrency(amount: number, from: string, to: string) {
  if (from === to) return amount;
  
  // Simple static rates for MVP
  const rates: Record<string, number> = {
    "NGN": 1,
    "USD": 1500,
    "EUR": 1600,
    "GBP": 1900,
  };

  const amountInNGN = amount * (rates[from] || 1);
  return amountInNGN / (rates[to] || 1);
}
