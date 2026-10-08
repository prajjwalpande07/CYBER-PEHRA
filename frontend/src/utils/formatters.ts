import { RiskLevel } from '../types';

export function formatINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

export function getRiskColorClass(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  dot: string;
} {
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-950/60',
        text: 'text-red-400',
        border: 'border-red-600/60',
        badge: 'bg-red-500/15 text-red-400 border-red-500/40',
        dot: 'bg-red-500',
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-950/60',
        text: 'text-orange-400',
        border: 'border-orange-600/60',
        badge: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
        dot: 'bg-orange-500',
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-950/60',
        text: 'text-amber-400',
        border: 'border-amber-600/60',
        badge: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
        dot: 'bg-amber-500',
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/60',
        text: 'text-emerald-400',
        border: 'border-emerald-600/60',
        badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40',
        dot: 'bg-emerald-500',
      };
  }
}
