import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';
import { useUIStore } from '../store/uiStore';
import { filterTasks } from '../utils/taskUtils';

export function useTasksForProject(projectId: string | null) {
  const tasks = useProjectStore((s) => s.tasks);
  return useMemo(
    () => (projectId ? Object.values(tasks).filter((t) => t.projectId === projectId) : []),
    [tasks, projectId]
  );
}

export function useFilteredTasks(projectId: string | null) {
  const tasks = useTasksForProject(projectId);
  const filters = useUIStore((s) => s.filters);
  return useMemo(() => filterTasks(tasks, filters), [tasks, filters]);
}

export function useAllTasks() {
  const tasks = useProjectStore((s) => s.tasks);
  return useMemo(() => Object.values(tasks), [tasks]);
}
