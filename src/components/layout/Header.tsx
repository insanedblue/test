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
    <Group h="100%" justify="space-between" style={{ flex: 1 }}>
      <Group gap={6} align="center">
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #7800FF 0%, #E600A0 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 900, letterSpacing: -1 }}>Y</span>
        </div>
        <Text
          fw={800}
          size="md"
          style={{ color: '#1A1A2E', letterSpacing: '-0.3px' }}
        >
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
          styles={{
            input: {
              borderColor: '#E8E8F0',
              '&:focus': { borderColor: '#7800FF' },
            },
          }}
        />
        <ActionIcon
          size="md"
          onClick={() => openTaskModal()}
          disabled={!activeProjectId}
          title="태스크 추가"
          style={{
            backgroundColor: activeProjectId ? '#7800FF' : undefined,
            color: activeProjectId ? '#fff' : undefined,
            borderRadius: 6,
          }}
        >
          <Plus size={16} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="md"
          onClick={() => setColorScheme(computed === 'light' ? 'dark' : 'light')}
          aria-label="테마 전환"
          style={{ color: '#7800FF', borderRadius: 6 }}
        >
          {computed === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </ActionIcon>
      </Group>
    </Group>
  );
}
