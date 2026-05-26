import type { TaskPriority, TaskStatus } from '../types';

export const priorityColors: Record<TaskPriority, string> = {
  low: 'gray',
  medium: 'violet',
  high: 'orange',
  urgent: 'pink',
};

export const statusColors: Record<TaskStatus, string> = {
  todo: 'gray',
  in_progress: 'violet',
  done: 'teal',
};

export const priorityHex: Record<TaskPriority, string> = {
  low: '#9CA3AF',
  medium: '#7800FF',
  high: '#F97316',
  urgent: '#E600A0',
};

export const statusHex: Record<TaskStatus, string> = {
  todo: '#9CA3AF',
  in_progress: '#7800FF',
  done: '#0D9488',
};
