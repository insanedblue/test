export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewMode = 'Day' | 'Week' | 'Month' | 'Year';
export type ActivityType =
  | 'task_created'
  | 'task_updated'
  | 'task_status_changed'
  | 'task_deleted'
  | 'project_created'
  | 'member_added';

export interface Member {
  id: string;
  name: string;
  avatarUrl?: string;
  color: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  ownerId: string;
  memberIds: string[];
  createdAt: string;
  archivedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  startDate: string;
  dueDate: string;
  estimatedHours?: number;
  tags: string[];
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  sortOrder: number;
}

export interface ActivityEntry {
  id: string;
  type: ActivityType;
  taskId?: string;
  projectId?: string;
  actorId?: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface TaskFilters {
  statusFilter: TaskStatus[];
  priorityFilter: TaskPriority[];
  assigneeFilter: string[];
  tagFilter: string[];
  searchQuery: string;
}

export interface ProjectStoreState {
  projects: Record<string, Project>;
  tasks: Record<string, Task>;
  members: Record<string, Member>;
  activity: ActivityEntry[];
}

export interface UIStoreState {
  activeProjectId: string | null;
  ganttViewMode: ViewMode;
  filters: TaskFilters;
  openModalType: 'task' | 'project' | null;
  editingTaskId: string | null;
  editingProjectId: string | null;
}
