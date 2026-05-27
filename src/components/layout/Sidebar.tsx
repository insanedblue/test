import { Stack, Text, Divider, ScrollArea, Box, Menu, Modal, Button, Group } from '@mantine/core';
import { LayoutDashboard, Kanban, GanttChartSquare, List, Plus, FolderOpen, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { useActiveProjects } from '../../hooks/useProjects';
import { useUIStore } from '../../store/uiStore';
import { useProjectStore } from '../../store/projectStore';

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
  const { activeProjectId, setActiveProject, openProjectModal, openDeleteConfirm, closeDeleteConfirm, deleteConfirmProjectId } = useUIStore(
    useShallow((s) => ({
      activeProjectId: s.activeProjectId,
      setActiveProject: s.setActiveProject,
      openProjectModal: s.openProjectModal,
      openDeleteConfirm: s.openDeleteConfirm,
      closeDeleteConfirm: s.closeDeleteConfirm,
      deleteConfirmProjectId: s.deleteConfirmProjectId,
    }))
  );
  const deleteProject = useProjectStore((s) => s.deleteProject);

  const confirmingProject = deleteConfirmProjectId
    ? projects.find((p) => p.id === deleteConfirmProjectId)
    : null;

  const handleDelete = () => {
    if (!deleteConfirmProjectId) return;
    if (activeProjectId === deleteConfirmProjectId) setActiveProject(null);
    deleteProject(deleteConfirmProjectId);
    closeDeleteConfirm();
  };

  return (
    <>
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
                      position: 'relative',
                    }}
                    onClick={() => setActiveProject(project.id)}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)';
                        (e.currentTarget as HTMLElement).style.color = '#ffffff';
                      }
                      const btn = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('.project-menu-btn');
                      if (btn) btn.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#B0B0CC';
                      }
                      const btn = (e.currentTarget as HTMLElement).querySelector<HTMLElement>('.project-menu-btn');
                      if (btn) btn.style.opacity = '0';
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
                    <Text size="xs" style={{ color: 'inherit', fontWeight: 'inherit', flex: 1 }} lineClamp={1}>
                      {project.name}
                    </Text>

                    {/* ⋮ 메뉴 버튼 */}
                    <Menu shadow="md" width={150} position="right-start" withinPortal>
                      <Menu.Target>
                        <Box
                          className="project-menu-btn"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            opacity: 0,
                            transition: 'opacity 0.1s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            flexShrink: 0,
                            color: '#B0B0CC',
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.12)';
                            (e.currentTarget as HTMLElement).style.color = '#ffffff';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                            (e.currentTarget as HTMLElement).style.color = '#B0B0CC';
                          }}
                        >
                          <MoreHorizontal size={13} />
                        </Box>
                      </Menu.Target>
                      <Menu.Dropdown
                        style={{ backgroundColor: '#1E1E32', border: '1px solid #2A2A40' }}
                      >
                        <Menu.Item
                          leftSection={<Pencil size={13} />}
                          onClick={(e) => { e.stopPropagation(); openProjectModal(project.id); }}
                          style={{ color: '#E0E0F0', fontSize: 13 }}
                        >
                          수정
                        </Menu.Item>
                        <Menu.Item
                          leftSection={<Trash2 size={13} />}
                          onClick={(e) => { e.stopPropagation(); openDeleteConfirm(project.id); }}
                          style={{ color: '#FF6B6B', fontSize: 13 }}
                        >
                          삭제
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
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

      {/* 삭제 확인 모달 */}
      <Modal
        opened={!!deleteConfirmProjectId}
        onClose={closeDeleteConfirm}
        title="프로젝트 삭제"
        centered
        size="sm"
      >
        <Text size="sm" style={{ color: '#6B6B8A' }} mb="lg">
          <strong style={{ color: '#1A1A2E' }}>{confirmingProject?.name}</strong> 프로젝트를 삭제하시겠습니까?<br />
          삭제된 프로젝트는 복구할 수 없습니다.
        </Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" onClick={closeDeleteConfirm}>취소</Button>
          <Button color="red" onClick={handleDelete}>삭제</Button>
        </Group>
      </Modal>
    </>
  );
}
