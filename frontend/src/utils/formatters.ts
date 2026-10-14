/**
 * Currency and number formatting utilities for Insurance Mantra (BFSI Track)
 */

export function formatINR(amount: number | undefined | null, compact: boolean = false): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  if (compact) {
    if (Math.abs(amount) >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
    }
    if (Math.abs(amount) >= 100000) {
      return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, '')} Lakhs`;
    }
  }

  // Standard Indian comma separator: 12,50,000
  const isNegative = amount < 0;
  const absAmount = Math.abs(Math.round(amount));
  const s = absAmount.toString();
  
  if (s.length <= 3) {
    return `${isNegative ? '-' : ''}₹${s}`;
  }

  const lastThree = s.substring(s.length - 3);
  const otherNumbers = s.substring(0, s.length - 3);
  const formattedOthers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  return `${isNegative ? '-' : ''}₹${formattedOthers},${lastThree}`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`;
}
