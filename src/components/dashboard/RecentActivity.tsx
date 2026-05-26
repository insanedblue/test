import { Card, Text, Stack, Group, ThemeIcon } from '@mantine/core';
import { CheckCircle2, Plus, ArrowRight, Trash2, FolderPlus, UserPlus } from 'lucide-react';
import { useMemo } from 'react';
import { useProjectStore } from '../../store/projectStore';
import type { ActivityEntry, ActivityType } from '../../types';
import { formatDateTime } from '../../utils/dates';

const ACTIVITY_ICONS: Record<ActivityType, typeof Plus> = {
  task_created: Plus,
  task_updated: ArrowRight,
  task_status_changed: CheckCircle2,
  task_deleted: Trash2,
  project_created: FolderPlus,
  member_added: UserPlus,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  task_created: 'blue',
  task_updated: 'gray',
  task_status_changed: 'green',
  task_deleted: 'red',
  project_created: 'violet',
  member_added: 'teal',
};

function activityLabel(entry: ActivityEntry): string {
  const p = entry.payload;
  switch (entry.type) {
    case 'task_created': return `'${p.taskTitle}' 태스크 추가`;
    case 'task_status_changed': return `'${p.taskTitle}' 상태 변경 (${p.from} → ${p.to})`;
    case 'task_deleted': return `'${p.taskTitle}' 태스크 삭제`;
    case 'project_created': return `'${p.name}' 프로젝트 생성`;
    case 'member_added': return `'${p.name}' 멤버 추가`;
    default: return '활동';
  }
}

export function RecentActivity() {
  const activity = useProjectStore((s) => s.activity);
  const recent = useMemo(() => activity.slice(0, 10), [activity]);

  return (
    <Card withBorder radius="md" p="lg">
      <Text fw={600} mb="md">최근 활동</Text>
      <Stack gap="sm">
        {recent.length === 0 && <Text size="sm" c="dimmed">활동 내역이 없습니다.</Text>}
        {recent.map((entry) => {
          const Icon = ACTIVITY_ICONS[entry.type] ?? Plus;
          return (
            <Group key={entry.id} gap="sm" wrap="nowrap">
              <ThemeIcon size="sm" variant="light" color={ACTIVITY_COLORS[entry.type]} radius="xl" style={{ flexShrink: 0 }}>
                <Icon size={12} />
              </ThemeIcon>
              <Stack gap={0} style={{ minWidth: 0 }}>
                <Text size="sm" lineClamp={1}>{activityLabel(entry)}</Text>
                <Text size="xs" c="dimmed">{formatDateTime(entry.createdAt)}</Text>
              </Stack>
            </Group>
          );
        })}
      </Stack>
    </Card>
  );
}
