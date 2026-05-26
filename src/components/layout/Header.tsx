import { Group, Text, ActionIcon, useComputedColorScheme, useMantineColorScheme, Select } from '@mantine/core';
import { Sun, Moon, Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { useActiveProjects } from '../../hooks/useProjects';
import { useUIStore } from '../../store/uiStore';

export function Header() {
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light');
  const projects = useActiveProjects();
  const { activeProjectId, setActiveProject, openTaskModal } = useUIStore(
    useShallow((s) => ({
      activeProjectId: s.activeProjectId,
      setActiveProject: s.setActiveProject,
      openTaskModal: s.openTaskModal,
    }))
  );

  const projectOptions = projects.map((p) => ({ value: p.id, label: p.name }));

  return (
    <Group h="100%" px="md" justify="space-between" style={{ flex: 1 }}>
      <Group gap="xs">
        <Text fw={700} size="lg" c="blue">
          Yong's Dashboard
        </Text>
      </Group>

      <Group gap="sm">
        <Select
          placeholder="프로젝트 선택"
          value={activeProjectId}
          onChange={(v) => setActiveProject(v)}
          data={projectOptions}
          size="sm"
          w={200}
          clearable
        />
        <ActionIcon
          variant="light"
          size="md"
          onClick={() => openTaskModal()}
          disabled={!activeProjectId}
          title="태스크 추가"
        >
          <Plus size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="md"
          onClick={() => setColorScheme(computed === 'light' ? 'dark' : 'light')}
          aria-label="테마 전환"
        >
          {computed === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
