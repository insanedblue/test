import { Stack, SimpleGrid, Text } from '@mantine/core';
import { useUIStore } from '../../store/uiStore';
import { StatsCards } from './StatsCards';
import { ProgressByProject } from './ProgressByProject';
import { TasksByPriority } from './TasksByPriority';
import { RecentActivity } from './RecentActivity';

export function DashboardView() {
  const activeProjectId = useUIStore((s) => s.activeProjectId);

  return (
    <Stack gap="xl">
      <div>
        <Text size="xl" fw={700} mb={4}>대시보드</Text>
        <Text c="dimmed" size="sm">
          {activeProjectId ? '선택된 프로젝트의 현황' : '전체 프로젝트 현황'}
        </Text>
      </div>

      <StatsCards projectId={activeProjectId} />

      <SimpleGrid cols={{ base: 1, md: 2 }}>
        <ProgressByProject />
        <TasksByPriority projectId={activeProjectId} />
      </SimpleGrid>

      <RecentActivity />
    </Stack>
  );
}
