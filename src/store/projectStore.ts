import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { nanoid } from 'nanoid';
import type { ActivityEntry, Member, Project, ProjectStoreState, Task, TaskStatus } from '../types';
import { generateDemoData } from './demoData';

type CreateTaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>;
type CreateProjectInput = Omit<Project, 'id' | 'createdAt'>;

interface Actions {
  createProject: (input: CreateProjectInput) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  createTask: (input: CreateTaskInput) => string;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus, newSortOrder: number) => void;
  addMember: (member: Omit<Member, 'id'>) => string;
  pushActivity: (entry: Omit<ActivityEntry, 'id' | 'createdAt'>) => void;
}

const emptyState: ProjectStoreState = {
  projects: {},
  tasks: {},
  members: {},
  activity: [],
};

export const useProjectStore = create<ProjectStoreState & Actions>()(
  persist(
    immer((set, get) => ({
      ...emptyState,

      createProject: (input) => {
        const id = nanoid();
        set((s) => {
          s.projects[id] = { ...input, id, createdAt: new Date().toISOString() };
          s.activity = [
            { id: nanoid(), type: 'project_created', projectId: id, payload: { name: input.name }, createdAt: new Date().toISOString() },
            ...s.activity,
          ].slice(0, 100) as ActivityEntry[];
        });
        return id;
      },

      updateProject: (id, patch) => {
        set((s) => {
          if (s.projects[id]) Object.assign(s.projects[id], patch);
        });
      },

      deleteProject: (id) => {
        set((s) => {
          s.projects[id].archivedAt = new Date().toISOString();
        });
      },

      createTask: (input) => {
        const id = nanoid();
        const tasksInStatus = Object.values(get().tasks).filter(
          (t) => t.projectId === input.projectId && t.status === input.status
        );
        const maxOrder = tasksInStatus.reduce((m, t) => Math.max(m, t.sortOrder), 0);
        const now = new Date().toISOString();
        set((s) => {
          s.tasks[id] = { ...input, id, sortOrder: maxOrder + 1000, createdAt: now, updatedAt: now };
          s.activity = [
            { id: nanoid(), type: 'task_created', taskId: id, projectId: input.projectId, payload: { taskTitle: input.title }, createdAt: now },
            ...s.activity,
          ].slice(0, 100) as ActivityEntry[];
        });
        return id;
      },

      updateTask: (id, patch) => {
        const task = get().tasks[id];
        if (!task) return;
        const now = new Date().toISOString();
        set((s) => {
          Object.assign(s.tasks[id], { ...patch, updatedAt: now });
          if (patch.status && patch.status !== task.status) {
            s.activity = [
              { id: nanoid(), type: 'task_status_changed', taskId: id, projectId: task.projectId, payload: { from: task.status, to: patch.status, taskTitle: task.title }, createdAt: now },
              ...s.activity,
            ].slice(0, 100) as ActivityEntry[];
            if (patch.status === 'done') s.tasks[id].completedAt = now;
          }
        });
      },

      deleteTask: (id) => {
        const task = get().tasks[id];
        if (!task) return;
        const now = new Date().toISOString();
        set((s) => {
          delete s.tasks[id];
          s.activity = [
            { id: nanoid(), type: 'task_deleted', taskId: id, projectId: task.projectId, payload: { taskTitle: task.title }, createdAt: now },
            ...s.activity,
          ].slice(0, 100) as ActivityEntry[];
        });
      },

      moveTask: (id, newStatus, newSortOrder) => {
        const task = get().tasks[id];
        if (!task) return;
        const now = new Date().toISOString();
        set((s) => {
          s.tasks[id].status = newStatus;
          s.tasks[id].sortOrder = newSortOrder;
          s.tasks[id].updatedAt = now;
          if (newStatus !== task.status) {
            if (newStatus === 'done') s.tasks[id].completedAt = now;
            s.activity = [
              { id: nanoid(), type: 'task_status_changed', taskId: id, projectId: task.projectId, payload: { from: task.status, to: newStatus, taskTitle: task.title }, createdAt: now },
              ...s.activity,
            ].slice(0, 100) as ActivityEntry[];
          }
        });
      },

      addMember: (member) => {
        const id = nanoid();
        set((s) => {
          s.members[id] = { ...member, id };
          s.activity = [
            { id: nanoid(), type: 'member_added', payload: { name: member.name }, createdAt: new Date().toISOString() },
            ...s.activity,
          ].slice(0, 100) as ActivityEntry[];
        });
        return id;
      },

      pushActivity: (entry) => {
        set((s) => {
          s.activity = [{ ...entry, id: nanoid(), createdAt: new Date().toISOString() }, ...s.activity].slice(0, 100) as ActivityEntry[];
        });
      },
    })),
    {
      name: 'project-manager-store',
      storage: createJSONStorage(() => localStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        if (Object.keys(state.projects).length === 0) {
          const demo = generateDemoData();
          state.projects = demo.projects;
          state.tasks = demo.tasks;
          state.members = demo.members;
          state.activity = demo.activity;
        }
      },
    }
  )
);
