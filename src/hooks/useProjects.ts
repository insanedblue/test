import { useMemo } from 'react';
import { useProjectStore } from '../store/projectStore';

export function useActiveProjects() {
  const projects = useProjectStore((s) => s.projects);
  return useMemo(
    () => Object.values(projects).filter((p) => !p.archivedAt),
    [projects]
  );
}

export function useProject(id: string | null) {
  return useProjectStore((s) => (id ? s.projects[id] : null));
}
