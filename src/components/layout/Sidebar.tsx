import { NavLink, Stack, Text, Divider, Button, ScrollArea, Badge } from '@mantine/core';
import { LayoutDashboard, Kanban, GanttChartSquare, List, Plus, FolderOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useActiveProjects } from '../../hooks/useProjects';
import { useShallow } from 'zustand/react/shallow';
import { useUIStore } from '../../store/uiStore';

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const projects = useActiveProjects();
  const { activeProjectId, setActiveProject, openProjectModal } = useUIStore(
    useShallow((s) => ({
      activeProjectId: s.activeProjectId,
      setActiveProject: s.setActiveProject,
      openProjectModal: s.openProjectModal,
    }))
  );

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: '대시보드' },
    { path: '/kanban', icon: Kanban, label: '칸반 보드' },
    { path: '/gantt', icon: GanttChartSquare, label: '간트 차트' },
    { path: '/list', icon: List, label: '태스크 목록' },
  ];

  return (
    <Stack h="100%" gap={0}>
      <Stack gap={4} p="md">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            label={label}
            leftSection={<Icon size={16} />}
            active={location.pathname === path}
            onClick={() => navigate(path)}
            style={{ borderRadius: 8 }}
          />
        ))}
      </Stack>

      <Divider />

      <Stack gap={4} p="md" flex={1}>
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4}>
          프로젝트
        </Text>
        <ScrollArea flex={1}>
          <Stack gap={2}>
            {projects.map((project) => (
              <NavLink
                key={project.id}
                label={project.name}
                leftSection={<FolderOpen size={14} />}
                active={activeProjectId === project.id}
                onClick={() => setActiveProject(project.id)}
                style={{ borderRadius: 8 }}
                rightSection={
                  <Badge size="xs" color={project.color} variant="filled" circle>
                    {' '}
                  </Badge>
                }
              />
            ))}
          </Stack>
        </ScrollArea>
        <Button
          variant="subtle"
          size="xs"
          leftSection={<Plus size={14} />}
          onClick={() => openProjectModal()}
          justify="flex-start"
          mt={4}
        >
          프로젝트 추가
        </Button>
      </Stack>
    </Stack>
  );
}
