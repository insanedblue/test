import { Table, Stack, Button, Group } from '@mantine/core';
import { Plus, ClipboardList } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useFilteredTasks } from '../../hooks/useTasks';
import { useUIStore } from '../../store/uiStore';
import { TaskListFilters } from './TaskListFilters';
import { TaskRow } from './TaskRow';
import { EmptyState } from '../common/EmptyState';

export function TaskListView() {
  const { activeProjectId, openTaskModal } = useUIStore(
    useShallow((s) => ({
      activeProjectId: s.activeProjectId,
      openTaskModal: s.openTaskModal,
    }))
  );
  const tasks = useFilteredTasks(activeProjectId);

  if (!activeProjectId) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="프로젝트를 선택하세요"
        description="상단에서 프로젝트를 선택하면 태스크 목록이 표시됩니다."
      />
    );
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <TaskListFilters />
        <Button size="sm" leftSection={<Plus size={14} />} onClick={() => openTaskModal()}>
          태스크 추가
        </Button>
      </Group>

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="태스크가 없습니다"
          description="새 태스크를 추가해 보세요."
          action={{ label: '태스크 추가', onClick: () => openTaskModal() }}
        />
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>제목</Table.Th>
              <Table.Th w={120}>상태</Table.Th>
              <Table.Th w={100}>우선순위</Table.Th>
              <Table.Th w={80}>담당자</Table.Th>
              <Table.Th w={110}>마감일</Table.Th>
              <Table.Th>태그</Table.Th>
              <Table.Th w={40} />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
