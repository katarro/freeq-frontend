import { SiteStatus } from '@/components/cards/site-card';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function currentStatus(status: SiteStatus) {
  return {
    [SiteStatus.HIGH_DEMAND]: 'Alta demanda',
    [SiteStatus.AVAILABLE]: 'Disponible',
    [SiteStatus.CLOSED]: 'Cerrado',
  }[status];
}
