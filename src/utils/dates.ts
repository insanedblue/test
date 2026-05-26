import { format, parseISO, isAfter, isBefore, startOfDay } from 'date-fns';
import { ko } from 'date-fns/locale';

export function formatDate(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM-dd', { locale: ko });
}

export function formatDateTime(iso: string): string {
  return format(parseISO(iso), 'yyyy-MM-dd HH:mm', { locale: ko });
}

export function isOverdue(dueDateIso: string): boolean {
  return isBefore(parseISO(dueDateIso), startOfDay(new Date()));
}

export function toISODate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function fromISODate(iso: string): Date {
  return parseISO(iso);
}

export function isInRange(iso: string, from: string | null, to: string | null): boolean {
  const d = parseISO(iso);
  if (from && isBefore(d, parseISO(from))) return false;
  if (to && isAfter(d, parseISO(to))) return false;
  return true;
}
