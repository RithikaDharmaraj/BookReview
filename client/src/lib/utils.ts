import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency conversion (USD to INR) - Using a fixed exchange rate for demonstration
// In a production app, this would use an API for real-time exchange rates
export function convertUSDtoINR(priceInUSD: string): string {
  // Remove the $ symbol and any commas, then parse to float
  const numericValue = parseFloat(priceInUSD.replace(/[$,]/g, ''));
  
  // Check if it's a valid number
  if (isNaN(numericValue)) {
    return priceInUSD; // Return original if not valid
  }
  
  // Convert using current exchange rate (approximately 82 rupees per dollar)
  const exchangeRate = 83.5;
  const priceInINR = numericValue * exchangeRate;
  
  // Format with rupee symbol and 2 decimal places
  return `₹${priceInINR.toFixed(2)}`;
}

// Format a price to show only INR
export function formatPrice(priceInUSD: string): string {
  if (!priceInUSD) return '';
  
  // For prices already in INR format, return as is
  if (priceInUSD.includes('₹')) return priceInUSD;
  
  // Convert and return only INR price
  return convertUSDtoINR(priceInUSD);
}
