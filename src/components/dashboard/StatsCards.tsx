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
    { label: '전체 태스크', value: stats.total, icon: LayoutList, accent: '#7800FF' },
    { label: '완료', value: stats.done, icon: CheckCircle2, accent: '#0D9488' },
    { label: '진행 중', value: stats.inProgress, icon: Clock, accent: '#7800FF' },
    { label: '지연', value: stats.overdue, icon: AlertCircle, accent: '#E600A0' },
  ];

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }}>
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <Card
          key={label}
          withBorder
          radius="sm"
          p="lg"
          style={{ borderLeft: `4px solid ${accent}`, borderColor: `#E8E8F0`, borderLeftColor: accent }}
        >
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500} style={{ color: '#6B6B8A' }}>{label}</Text>
            <Icon size={20} color={accent} />
          </Group>
          <Text size="2rem" fw={800} style={{ color: '#1A1A2E' }}>{value}</Text>
          {label === '전체 태스크' && stats.total > 0 && (
            <Text size="xs" mt={4} style={{ color: '#9B9BB8' }}>완료율 {stats.progress}%</Text>
          )}
        </Card>
      ))}
    </SimpleGrid>
  );
}
