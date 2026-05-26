import { Table, Text, Menu, ActionIcon, Group } from '@mantine/core';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import type { Task, TaskStatus } from '../../types';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { UserAvatar } from '../common/UserAvatar';
import { useProjectStore } from '../../store/projectStore';
import { useUIStore } from '../../store/uiStore';
import { formatDate, isOverdue } from '../../utils/dates';

interface Props {
  task: Task;
}

export function TaskRow({ task }: Props) {
  const { updateTask, deleteTask } = useProjectStore(
    useShallow((s) => ({
      updateTask: s.updateTask,
      deleteTask: s.deleteTask,
    }))
  );
  const openTaskModal = useUIStore((s) => s.openTaskModal);
  const overdue = task.status !== 'done' && isOverdue(task.dueDate);

  return (
    <Table.Tr>
      <Table.Td>
        <Text size="sm" fw={500} lineClamp={1}>
          {task.title}
        </Text>
        {task.description && (
          <Text size="xs" c="dimmed" lineClamp={1}>
            {task.description}
          </Text>
        )}
      </Table.Td>
      <Table.Td>
        <Menu withinPortal>
          <Menu.Target>
            <div style={{ cursor: 'pointer' }}>
              <StatusBadge status={task.status} />
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            {(['todo', 'in_progress', 'done'] as TaskStatus[]).map((s) => (
              <Menu.Item key={s} onClick={() => updateTask(task.id, { status: s })}>
                <StatusBadge status={s} />
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
      <Table.Td>
        <PriorityBadge priority={task.priority} />
      </Table.Td>
      <Table.Td>
        <UserAvatar memberId={task.assigneeId} withTooltip />
      </Table.Td>
      <Table.Td>
        <Text size="sm" c={overdue ? 'red' : undefined}>
          {formatDate(task.dueDate)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Group gap={4} justify="flex-end">
          {task.tags.map((tag) => (
            <Text key={tag} size="xs" c="dimmed">
              #{tag}
            </Text>
          ))}
        </Group>
      </Table.Td>
      <Table.Td>
        <Menu withinPortal>
          <Menu.Target>
            <ActionIcon variant="subtle" size="sm">
              <MoreHorizontal size={14} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Pencil size={14} />} onClick={() => openTaskModal(task.id)}>
              수정
            </Menu.Item>
            <Menu.Item leftSection={<Trash2 size={14} />} color="red" onClick={() => deleteTask(task.id)}>
              삭제
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  );
}
