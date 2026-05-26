import { Badge } from '@mantine/core';
import type { TaskPriority } from '../../types';
import { priorityColors } from '../../utils/colors';

const labels: Record<TaskPriority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  urgent: '긴급',
};

interface Props {
  priority: TaskPriority;
  size?: 'xs' | 'sm' | 'md';
}

export function PriorityBadge({ priority, size = 'sm' }: Props) {
  return (
    <Badge color={priorityColors[priority]} size={size} variant="filled" radius="sm">
      {labels[priority]}
    </Badge>
  );
}
