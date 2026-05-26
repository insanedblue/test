import { useState } from 'react';
import { Group, ScrollArea } from '@mantine/core';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Kanban } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { useTasksForProject } from '../../hooks/useTasks';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import { groupByStatus, midSortOrder } from '../../utils/taskUtils';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';
import { EmptyState } from '../common/EmptyState';

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done'];

export function KanbanBoard() {
  const activeProjectId = useUIStore((s) => s.activeProjectId);
  const tasks = useTasksForProject(activeProjectId);
  const moveTask = useProjectStore((s) => s.moveTask);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const grouped = groupByStatus(tasks);

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const draggedTask = tasks.find((t) => t.id === active.id);
    if (!draggedTask) return;

    const overId = String(over.id);

    // Determine target status
    let targetStatus: TaskStatus;
    if (STATUSES.includes(overId as TaskStatus)) {
      targetStatus = overId as TaskStatus;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;
      targetStatus = overTask.status;
    }

    const targetColumn = grouped[targetStatus];

    // Compute new sortOrder
    let newSortOrder: number;
    if (STATUSES.includes(overId as TaskStatus)) {
      // Dropped onto column directly
      const last = targetColumn[targetColumn.length - 1];
      newSortOrder = last ? last.sortOrder + 1000 : 1000;
    } else {
      const overTask = tasks.find((t) => t.id === overId);
      if (!overTask) return;

      const overIndex = targetColumn.findIndex((t) => t.id === overId);
      if (draggedTask.status === targetStatus) {
        // Same column reorder
        const dragIndex = targetColumn.findIndex((t) => t.id === draggedTask.id);
        const newArr = arrayMove(targetColumn, dragIndex, overIndex);
        const prev = newArr[overIndex - 1];
        const next = newArr[overIndex + 1];
        newSortOrder = prev && next ? midSortOrder(prev.sortOrder, next.sortOrder) : overTask.sortOrder - 0.5;
      } else {
        const prev = targetColumn[overIndex - 1];
        const next = targetColumn[overIndex];
        newSortOrder = prev && next ? midSortOrder(prev.sortOrder, next.sortOrder) : next ? next.sortOrder - 0.5 : 1000;
      }
    }

    moveTask(draggedTask.id, targetStatus, newSortOrder);
  };

  if (!activeProjectId) {
    return (
      <EmptyState
        icon={Kanban}
        title="프로젝트를 선택하세요"
        description="상단에서 프로젝트를 선택하면 칸반 보드가 표시됩니다."
      />
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea>
        <Group align="flex-start" gap="md" wrap="nowrap" pb="md" style={{ minHeight: 'calc(100vh - 180px)' }}>
          {STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} tasks={grouped[status]} />
          ))}
        </Group>
      </ScrollArea>

      <DragOverlay>
        {activeTask && <KanbanCard task={activeTask} overlay />}
      </DragOverlay>
    </DndContext>
  );
}
