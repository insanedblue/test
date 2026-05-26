import { Badge } from '@mantine/core';
import type { TaskStatus } from '../../types';
import { statusColors } from '../../utils/colors';

const labels: Record<TaskStatus, string> = {
  todo: '할 일',
  in_progress: '진행 중',
  done: '완료',
};

interface Props {
  status: TaskStatus;
  size?: 'xs' | 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  return (
    <Badge color={statusColors[status]} size={size} variant="light">
      {labels[status]}
    </Badge>
  );
}
