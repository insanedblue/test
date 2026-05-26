import { Stack, Text, Group, Badge, Paper, Button } from '@mantine/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import type { Task, TaskStatus } from '../../types';
import { KanbanCard } from './KanbanCard';
import { useUIStore } from '../../store/uiStore';
import { statusColors } from '../../utils/colors';

const COLUMN_LABELS: Record<TaskStatus, string> = {
  todo: '할 일',
  in_progress: '진행 중',
  done: '완료',
};

const COLUMN_TOP_COLOR: Record<TaskStatus, string> = {
  todo: '#9CA3AF',
  in_progress: '#7800FF',
  done: '#0D9488',
};

interface Props {
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const openTaskModal = useUIStore((s) => s.openTaskModal);

  return (
    <Stack flex={1} miw={280} maw={380}>
      <Group justify="space-between" px={4}>
        <Group gap="xs">
          <Text fw={600} size="sm">{COLUMN_LABELS[status]}</Text>
          <Badge size="sm" color={statusColors[status]} variant="light" radius="xl">
            {tasks.length}
          </Badge>
        </Group>
        <Button
          variant="subtle"
          size="xs"
          px={6}
          leftSection={<Plus size={12} />}
          onClick={() => openTaskModal()}
        >
          추가
        </Button>
      </Group>

      <Paper
        ref={setNodeRef}
        radius="sm"
        p="sm"
        withBorder
        style={{
          minHeight: 120,
          flex: 1,
          backgroundColor: isOver ? 'rgba(120,0,255,0.06)' : '#ffffff',
          borderTop: `3px solid ${COLUMN_TOP_COLOR[status]}`,
          transition: 'background-color 0.15s',
        }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          <Stack gap="sm">
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} />
            ))}
          </Stack>
        </SortableContext>
      </Paper>
    </Stack>
  );
}
