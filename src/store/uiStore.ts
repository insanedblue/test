import { create } from 'zustand';
import type { TaskFilters, UIStoreState, ViewMode } from '../types';

const defaultFilters: TaskFilters = {
  statusFilter: [],
  priorityFilter: [],
  assigneeFilter: [],
  tagFilter: [],
  searchQuery: '',
};

interface UIActions {
  setActiveProject: (id: string | null) => void;
  openTaskModal: (taskId?: string) => void;
  openProjectModal: (projectId?: string) => void;
  closeModal: () => void;
  setGanttViewMode: (mode: ViewMode) => void;
  setFilters: (patch: Partial<TaskFilters>) => void;
  resetFilters: () => void;
}

export const useUIStore = create<UIStoreState & UIActions>()((set) => ({
  activeProjectId: null,
  ganttViewMode: 'Week',
  filters: defaultFilters,
  openModalType: null,
  editingTaskId: null,
  editingProjectId: null,

  setActiveProject: (id) => set({ activeProjectId: id }),
  openTaskModal: (taskId) => set({ openModalType: 'task', editingTaskId: taskId ?? null }),
  openProjectModal: (projectId) => set({ openModalType: 'project', editingProjectId: projectId ?? null }),
  closeModal: () => set({ openModalType: null, editingTaskId: null, editingProjectId: null }),
  setGanttViewMode: (mode) => set({ ganttViewMode: mode }),
  setFilters: (patch) => set((s) => ({ filters: { ...s.filters, ...patch } })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
