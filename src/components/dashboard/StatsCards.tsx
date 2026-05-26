import { SimpleGrid, Card, Text, Group } from '@mantine/core';
import { CheckCircle2, Clock, AlertCircle, LayoutList } from 'lucide-react';
import { useMemo } from 'react';
import { useTasksForProject } from '../../hooks/useTasks';
import { countOverdue, calcProgress } from '../../utils/taskUtils';

interface Props {
  projectId: string | null;
}

export function StatsCards({ projectId }: Props) {
  const tasks = useTasksForProject(projectId);

  const stats = useMemo(() => ({
    total: tasks.length,
    done: tasks.filter((t) => t.status === 'done').length,
    inProgress: tasks.filter((t) => t.status === 'in_progress').length,
    overdue: countOverdue(tasks),
    progress: calcProgress(tasks),
  }), [tasks]);

  const cards = [
    { label: '전체 태스크', value: stats.total, icon: LayoutList, color: 'blue' },
    { label: '완료', value: stats.done, icon: CheckCircle2, color: 'green' },
    { label: '진행 중', value: stats.inProgress, icon: Clock, color: 'blue' },
    { label: '지연', value: stats.overdue, icon: AlertCircle, color: 'red' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {cards.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} withBorder radius="md" p="lg">
          <Group justify="space-between" mb="xs">
            <Text size="sm" c="dimmed" fw={500}>{label}</Text>
            <Icon size={20} color={`var(--mantine-color-${color}-6)`} />
          </Group>
          <Text size="2rem" fw={700}>{value}</Text>
          {label === '전체 태스크' && stats.total > 0 && (
            <Text size="xs" c="dimmed" mt={4}>완료율 {stats.progress}%</Text>
          )}
        </Card>
      ))}
    </SimpleGrid>
  );
}
