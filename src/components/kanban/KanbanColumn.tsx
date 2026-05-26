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
        radius="md"
        p="sm"
        withBorder
        style={{
          minHeight: 120,
          flex: 1,
          backgroundColor: isOver
            ? 'var(--mantine-color-blue-0)'
            : 'var(--mantine-color-gray-0)',
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
