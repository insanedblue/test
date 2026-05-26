import { Card, Text, Group, Badge } from '@mantine/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import type { Task } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { UserAvatar } from '../common/UserAvatar';
import { useUIStore } from '../../store/uiStore';
import { formatDate, isOverdue } from '../../utils/dates';

interface Props {
  task: Task;
  overlay?: boolean;
}

export function KanbanCard({ task, overlay = false }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const overdue = task.status !== 'done' && isOverdue(task.dueDate);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={{
        ...style,
        borderLeft: overlay ? '3px solid #7800FF' : '3px solid transparent',
        transition: 'border-left-color 0.15s',
      }}
      withBorder
      radius="sm"
      p="sm"
      shadow={overlay ? 'lg' : undefined}
      onClick={() => !overlay && openTaskModal(task.id)}
      className="kanban-card"
      onMouseEnter={(e) => { if (!overlay) (e.currentTarget as HTMLElement).style.borderLeftColor = '#7800FF'; }}
      onMouseLeave={(e) => { if (!overlay) (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent'; }}
    >
      <Group gap={4} mb={6} wrap="nowrap">
        <div
          {...attributes}
          {...listeners}
          style={{ cursor: 'grab', color: '#C4A0FF', flexShrink: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </div>
        <Text size="sm" fw={500} lineClamp={2} style={{ flex: 1 }}>
          {task.title}
        </Text>
      </Group>

      {task.description && (
        <Text size="xs" c="dimmed" lineClamp={2} mb={6}>
          {task.description}
        </Text>
      )}

      <Group gap={4} mb={6} wrap="wrap">
        {task.tags.slice(0, 3).map((tag) => (
          <Badge key={tag} size="xs" variant="light" color="violet" radius="sm">
            {tag}
          </Badge>
        ))}
      </Group>

      <Group justify="space-between" mt={4}>
        <PriorityBadge priority={task.priority} size="xs" />
        <Group gap={4}>
          <Text size="xs" c={overdue ? 'red' : 'dimmed'}>
            {formatDate(task.dueDate)}
          </Text>
          <UserAvatar memberId={task.assigneeId} size={20} withTooltip />
        </Group>
      </Group>
    </Card>
  );
}
