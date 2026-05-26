import { useMemo } from 'react';
import { Stack } from '@mantine/core';
import { Gantt, ViewMode } from 'gantt-task-react';
import type { Task as GanttTask } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { useShallow } from 'zustand/react/shallow';
import { useTasksForProject } from '../../hooks/useTasks';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import { priorityHex } from '../../utils/colors';
import { fromISODate, toISODate } from '../../utils/dates';
import { GanttToolbar } from './GanttToolbar';
import { EmptyState } from '../common/EmptyState';
import { GanttChartSquare } from 'lucide-react';

const STATUS_PROGRESS: Record<string, number> = { todo: 0, in_progress: 50, done: 100 };

export function GanttView() {
  const { activeProjectId, ganttViewMode } = useUIStore(
    useShallow((s) => ({
      activeProjectId: s.activeProjectId,
      ganttViewMode: s.ganttViewMode,
    }))
  );
  const tasks = useTasksForProject(activeProjectId);
  const updateTask = useProjectStore((s) => s.updateTask);

  const ganttTasks: GanttTask[] = useMemo(() =>
    tasks.map((t) => {
      const start = fromISODate(t.startDate);
      const end = fromISODate(t.dueDate);
      if (end <= start) end.setDate(start.getDate() + 1);
      return {
        id: t.id,
        name: t.title,
        start,
        end,
        progress: STATUS_PROGRESS[t.status] ?? 0,
        type: 'task',
        dependencies: t.dependencies,
        styles: {
          progressColor: priorityHex[t.priority],
          progressSelectedColor: priorityHex[t.priority],
        },
      };
    }),
    [tasks]
  );

  const handleDateChange = (task: GanttTask) => {
    updateTask(task.id, {
      startDate: toISODate(task.start),
      dueDate: toISODate(task.end),
    });
  };

  const handleProgressChange = (task: GanttTask) => {
    const status = task.progress >= 100 ? 'done' : task.progress > 0 ? 'in_progress' : 'todo';
    updateTask(task.id, { status });
  };

  if (!activeProjectId) {
    return (
      <EmptyState
        icon={GanttChartSquare}
        title="프로젝트를 선택하세요"
        description="상단에서 프로젝트를 선택하면 간트 차트가 표시됩니다."
      />
    );
  }

  if (ganttTasks.length === 0) {
    return (
      <Stack gap="md">
        <GanttToolbar />
        <EmptyState
          icon={GanttChartSquare}
          title="태스크가 없습니다"
          description="태스크를 추가하면 간트 차트에 표시됩니다."
        />
      </Stack>
    );
  }

  return (
    <Stack gap="md">
      <GanttToolbar />
      <div style={{ overflowX: 'auto' }}>
        <Gantt
          tasks={ganttTasks}
          viewMode={ganttViewMode as ViewMode}
          onDateChange={handleDateChange}
          onProgressChange={handleProgressChange}
          listCellWidth="200px"
          columnWidth={ganttViewMode === 'Day' ? 40 : ganttViewMode === 'Week' ? 80 : 160}
          locale="ko-KR"
          todayColor="rgba(34,139,230,0.1)"
        />
      </div>
    </Stack>
  );
}
