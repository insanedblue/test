import { Stack, Text, Divider, ScrollArea, Box } from '@mantine/core';
import { LayoutDashboard, Kanban, GanttChartSquare, List, Plus, FolderOpen } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useActiveProjects } from '../../hooks/useProjects';
import { useUIStore } from '../../store/uiStore';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: '대시보드' },
  { path: '/kanban', icon: Kanban, label: '칸반 보드' },
  { path: '/gantt', icon: GanttChartSquare, label: '간트 차트' },
  { path: '/list', icon: List, label: '태스크 목록' },
];

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

  return (
    <Stack h="100%" gap={0} style={{ backgroundColor: '#1A1A2E' }}>
      {/* 로고 영역 */}
      <Box px="md" py="sm" style={{ borderBottom: '1px solid #2A2A40' }}>
        <Text size="xs" fw={600} style={{ color: '#9B9BB8', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          Menu
        </Text>
      </Box>

      {/* 네비게이션 */}
      <Stack gap={2} p="sm">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Box
              key={path}
              onClick={() => navigate(path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: isActive ? '#7800FF' : 'transparent',
                color: isActive ? '#ffffff' : '#B0B0CC',
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid #E600A0' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(120,0,255,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#B0B0CC';
                }
              }}
            >
              <Icon size={16} style={{ flexShrink: 0 }} />
              <span>{label}</span>
            </Box>
          );
        })}
      </Stack>

      <Divider color="#2A2A40" />

      {/* 프로젝트 목록 */}
      <Stack gap={4} p="sm" flex={1} style={{ minHeight: 0 }}>
        <Text
          size="xs"
          fw={600}
          style={{ color: '#9B9BB8', letterSpacing: '1.5px', textTransform: 'uppercase', padding: '4px 4px 8px' }}
        >
          Projects
        </Text>
        <ScrollArea flex={1}>
          <Stack gap={2}>
            {projects.map((project) => {
              const isActive = activeProjectId === project.id;
              return (
                <Box
                  key={project.id}
                  onClick={() => setActiveProject(project.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 10px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    backgroundColor: isActive ? 'rgba(120,0,255,0.2)' : 'transparent',
                    color: isActive ? '#ffffff' : '#B0B0CC',
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                      (e.currentTarget as HTMLElement).style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#B0B0CC';
                    }
                  }}
                >
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: isActive ? '#E600A0' : '#4A4A6A',
                    flexShrink: 0,
                  }} />
                  <FolderOpen size={13} style={{ flexShrink: 0, opacity: 0.7 }} />
                  <Text size="xs" style={{ color: 'inherit', fontWeight: 'inherit' }} lineClamp={1}>
                    {project.name}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        </ScrollArea>

        <Box style={{ borderTop: '1px solid #2A2A40', paddingTop: 8 }}>
          <Box
            onClick={() => openProjectModal()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 10px',
              borderRadius: 6,
              cursor: 'pointer',
              color: '#7800FF',
              fontSize: 13,
              border: '1px solid rgba(120,0,255,0.3)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(120,0,255,0.15)';
              (e.currentTarget as HTMLElement).style.color = '#9B33FF';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#7800FF';
            }}
          >
            <Plus size={13} />
            <span>프로젝트 추가</span>
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
}
