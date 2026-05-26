import type { TaskPriority, TaskStatus } from '../types';

export const priorityColors: Record<TaskPriority, string> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

export const statusColors: Record<TaskStatus, string> = {
  todo: 'gray',
  in_progress: 'blue',
  done: 'green',
};

export const priorityHex: Record<TaskPriority, string> = {
  low: '#868e96',
  medium: '#228be6',
  high: '#fd7e14',
  urgent: '#fa5252',
};

export const statusHex: Record<TaskStatus, string> = {
  todo: '#868e96',
  in_progress: '#228be6',
  done: '#40c057',
};
