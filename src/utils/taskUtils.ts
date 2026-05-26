import type { Task, TaskFilters, TaskStatus } from '../types';
import { isOverdue } from './dates';

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };

export function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = { todo: [], in_progress: [], done: [] };
  for (const t of tasks) {
    groups[t.status].push(t);
  }
  for (const g of Object.values(groups)) {
    g.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return groups;
}

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
}

export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  return tasks.filter((t) => {
    if (filters.statusFilter.length && !filters.statusFilter.includes(t.status)) return false;
    if (filters.priorityFilter.length && !filters.priorityFilter.includes(t.priority)) return false;
    if (filters.assigneeFilter.length && (!t.assigneeId || !filters.assigneeFilter.includes(t.assigneeId))) return false;
    if (filters.tagFilter.length && !filters.tagFilter.some((tag) => t.tags.includes(tag))) return false;
    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      if (!t.title.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
    }
    return true;
  });
}

export function countOverdue(tasks: Task[]): number {
  return tasks.filter((t) => t.status !== 'done' && isOverdue(t.dueDate)).length;
}

export function calcProgress(tasks: Task[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100);
}

export function midSortOrder(a: number, b: number): number {
  return (a + b) / 2;
}
