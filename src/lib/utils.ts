import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
